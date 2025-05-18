import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// GET: /api/reviews?listingId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");
  if (!listingId) {
    return NextResponse.json({ error: "Missing listingId" }, { status: 400 });
  }
  const reviews = await prisma.review.findMany({
    where: { listingId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

// POST: /api/reviews
export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { rating, comment, listingId } = body;
  if (!rating || !comment || !listingId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // Lấy userId từ currentUser
  const user = await prisma.user.findUnique({ where: { email: currentUser.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // Kiểm tra đã review chưa (1 user chỉ review 1 lần/listing)
  const existed = await prisma.review.findFirst({ where: { userId: user.id, listingId } });
  if (existed) {
    return NextResponse.json({ error: "You have already reviewed this listing" }, { status: 400 });
  }
  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      userId: user.id,
      listingId,
    },
    include: { user: true },
  });
  return NextResponse.json(review);
}

// Đã move PUT/DELETE sang [reviewId]/route.ts
