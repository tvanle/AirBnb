import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/listing";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      price,
    } = body;

    await connectDB();
    const listing = await Listing.create({
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser._id
    });

    return NextResponse.json(listing);
  } catch (error: any) {
    console.log(error, "LISTING_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
