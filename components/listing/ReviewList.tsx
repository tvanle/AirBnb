import React, { useState } from "react";
import ReviewItem from "./ReviewItem";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import type { Review } from "@/types";

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
  onAdd?: (review: { rating: number; comment: string }) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentUserId,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Kiểm tra user đã review chưa
  const hasReviewed = !!reviews.find((r) => r.user.id === currentUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAdd) return;
    setSubmitting(true);
    await onAdd({ rating, comment });
    setComment("");
    setRating(5);
    setSubmitting(false);
  };

  // Airbnb style cho form và nút
  return (
    <div>
      {/* Form thêm review nếu user chưa review */}
      {onAdd && currentUserId && !hasReviewed && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 rounded-2xl shadow-lg border border-gray-200 bg-white max-w-xl mx-auto"
          style={{
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <div className="mb-3 text-lg font-semibold text-gray-800">Đánh giá của bạn</div>
          <div className="flex items-center mb-4">
            <span className="mr-3 text-gray-700 font-medium">Số sao:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) =>
                star <= rating ? (
                  <FaStar
                    key={star}
                    className="text-2xl text-rose-500 cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setRating(star)}
                  />
                ) : (
                  <FaRegStar
                    key={star}
                    className="text-2xl text-gray-300 cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setRating(star)}
                  />
                )
              )}
            </div>
          </div>
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về nơi này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            maxLength={500}
          />
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl shadow transition disabled:opacity-60"
            disabled={submitting || !comment.trim()}
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      )}
      {/* Danh sách review */}
      {reviews.length === 0 ? (
        <div className="text-gray-500 italic py-4 text-center">Chưa có đánh giá nào.</div>
      ) : (
        <div className="divide-y">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              isOwn={review.user.id === currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              EditIcon={FaEdit}
              DeleteIcon={FaTrash}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
