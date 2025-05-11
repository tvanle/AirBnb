import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { listingId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!listingId) {
      return new NextResponse("Listing ID is required", { status: 400 });
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || !comment) {
      return new NextResponse("Rating and comment are required", {
        status: 400,
      });
    }

    // Verify user has completed a reservation for this listing
    const completedReservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        userId: currentUser.id,
      },
    });

    if (!completedReservation) {
      return new NextResponse(
        "You can only review listings after completing a stay",
        { status: 403 },
      );
    }

    // Check if user has already reviewed this listing
    const existingReview = await prisma.review.findFirst({
      where: {
        listingId,
        userId: currentUser.id,
      },
    });

    if (existingReview) {
      return new NextResponse("You have already reviewed this listing", {
        status: 400,
      });
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        listingId,
        userId: currentUser.id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const { listingId } = params;

    if (!listingId) {
      return new NextResponse("Listing ID is required", { status: 400 });
    }

    // Get all reviews for listing
    const reviews = await prisma.review.findMany({
      where: {
        listingId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[REVIEWS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
