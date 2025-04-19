import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/listing";
import Reservation from "@/models/reservation";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      listingId,
      startDate,
      endDate,
      totalPrice
    } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();
    const listingAndReservation = await Listing.findByIdAndUpdate(
      listingId,
      {
        $push: {
          reservations: {
            userId: currentUser._id,
            startDate,
            endDate,
            totalPrice
          }
        }
      },
      { new: true }
    );

    if (!listingAndReservation) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    const reservation = await Reservation.create({
      userId: currentUser._id,
      listingId,
      startDate,
      endDate,
      totalPrice
    });

    return NextResponse.json(reservation);
  } catch (error: any) {
    console.log(error, "RESERVATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
