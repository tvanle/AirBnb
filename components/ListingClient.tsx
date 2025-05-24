"use client";

import useLoginModel from "@/hook/useLoginModal";
import { SafeReservation, SafeUser, safeListing } from "@/types";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { toast } from "react-toastify";

import Container from "./Container";
import ListingHead from "./listing/ListingHead";
import ListingInfo from "./listing/ListingInfo";
import ListingReservation from "./listing/ListingReservation";
import { categories } from "./navbar/Categories";
import ReviewList from "./listing/ReviewList";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

type Props = {
  reservations?: SafeReservation[];
  listing: safeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
};

function ListingClient({ reservations = [], listing, currentUser }: Props) {
  const router = useRouter();
  const loginModal = useLoginModel();

  const disableDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const checkPaymentStatus = useCallback(async (transactionId: string) => {
    try {
      const response = await axios.get(`/api/qr/check-payment?transactionId=${transactionId}`);
      const { status, transaction } = response.data;

      if (status === "COMPLETED") {
        // Gọi API tạo reservation ở client khi thanh toán thành công
        await axios.post("/api/reservations", {
          listingId: listing.id,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          totalPrice: totalPrice,
          userId: currentUser?.id,
        });

        toast.success("Payment Successful! Reservation created.");
        setIsCheckingPayment(false);
        setQrCodeUrl(null);
        setTransactionId(null);
        router.push("/trips");
      } else if (status === "PENDING") {
        setTimeout(() => checkPaymentStatus(transactionId), 5000);
      } else {
        toast.error("Payment failed or canceled.");
        setIsCheckingPayment(false);
        setQrCodeUrl(null);
        setTransactionId(null);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error("Error checking payment status");
      setIsCheckingPayment(false);
      setQrCodeUrl(null);
      setTransactionId(null);
    }
  }, [router, listing.id, dateRange.startDate, dateRange.endDate, totalPrice, currentUser?.id]);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    // Gửi request để tạo mã QR VietQR
    axios
        .post("/api/qr/create-payment", {
          totalPrice,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          listingId: listing?.id,
        })
        .then((response) => {
          const { qrCodeUrl, transactionId } = response.data;
          setQrCodeUrl(qrCodeUrl);
          setTransactionId(transactionId);
          setIsCheckingPayment(true);

          // TODO: Testing
          setTimeout(() => {
            axios.post("/api/qr/webhook", {
              transactionId: transactionId,
              status: "SUCCESS",
              memo: "Thanh toán hoàn tất"
            });
          }, 5000);
          
          checkPaymentStatus(transactionId);
        })
        .catch((error) => {
          console.error("Error creating QR code:", error);
          toast.error("Something Went Wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
  }, [totalPrice, dateRange, listing?.id, currentUser, loginModal, checkPaymentStatus]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
          dateRange.endDate,
          dateRange.startDate,
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  // --- Review State & Logic ---
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch reviews khi load component hoặc khi listing.id thay đổi
  useEffect(() => {
    if (!listing?.id) return;
    setLoadingReviews(true);
    fetch(`/api/reviews?listingId=${listing.id}`)
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .finally(() => setLoadingReviews(false));
  }, [listing?.id]);

  // Thêm review mới
  const handleAddReview = async (review: { rating: number; comment: string }) => {
    if (!currentUser) {
      toast.error("Bạn cần đăng nhập để đánh giá!");
      return;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...review, listingId: listing.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Không thể gửi đánh giá");
        return;
      }
      const newReview = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      toast.success("Đánh giá thành công!");
    } catch (e) {
      toast.error("Có lỗi khi gửi đánh giá");
    }
  };

  // Sửa review
  const handleEditReview = async (review: any) => {
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: review.rating, comment: review.comment }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Không thể sửa đánh giá");
        return;
      }
      const updated = await res.json();
      setReviews((prev) => prev.map(r => r.id === updated.id ? updated : r));
      toast.success("Cập nhật đánh giá thành công!");
    } catch (e) {
      toast.error("Có lỗi khi cập nhật đánh giá");
    }
  };

  // Xóa review
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa đánh giá này?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Không thể xóa đánh giá");
        return;
      }
      setReviews((prev) => prev.filter(r => r.id !== reviewId));
      toast.success("Đã xóa đánh giá!");
    } catch (e) {
      toast.error("Có lỗi khi xóa đánh giá");
    }
  };

  return (
      <Container>
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-6">
            <ListingHead
                title={listing.title}
                imageSrc={listing.imageSrc}
                locationValue={listing.locationValue}
                id={listing.id}
                currentUser={currentUser}
            />
            <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
              <ListingInfo
                  user={listing.user}
                  category={category}
                  description={listing.description}
                  roomCount={listing.roomCount}
                  guestCount={listing.guestCount}
                  bathroomCount={listing.bathroomCount}
                  locationValue={listing.locationValue}
              />
              <div className="order-first mb-10 md:order-last md:col-span-3">
                <ListingReservation
                    price={listing.price}
                    totalPrice={totalPrice}
                    onChangeDate={(value) => setDateRange(value)}
                    dateRange={dateRange}
                    onSubmit={onCreateReservation}
                    disabled={isLoading || isCheckingPayment}
                    disabledDates={disableDates}
                />
                {qrCodeUrl && (
                    <div className="mt-4 text-center">
                      <p className="mb-2">Quét mã QR để thanh toán:</p>
                      <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48 h-48" />
                      <p className="mt-2 text-sm text-gray-600">
                        Vui lòng quét mã QR bằng ứng dụng Mobile Banking để hoàn tất thanh toán.
                      </p>
                      {isCheckingPayment && (
                        <div className="mt-2 text-blue-600 font-semibold animate-pulse">
                          Đang chờ xác nhận thanh toán...
                        </div>
                      )}
                    </div>
                )}
              </div>
            </div>
            {/* --- Review Section --- */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              {loadingReviews ? (
                <div className="text-gray-500">Đang tải đánh giá...</div>
              ) : (
                <ReviewList
                  reviews={reviews}
                  currentUserId={currentUser?.id}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  onAdd={handleAddReview}
                />
              )}
              {/* Nếu muốn có form thêm review, bạn có thể tự thêm ở đây */}
            </div>
          </div>
        </div>
      </Container>
  );
}

export default ListingClient;
