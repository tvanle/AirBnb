import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// PUT: /api/reviews/[reviewId]
export async function PUT(req: NextRequest, { params }: { params: { reviewId: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { reviewId } = params;
  const body = await req.json();
  const { rating, comment } = body;
  if (!rating || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const review = await prisma.review.findUnique({ where: { id: reviewId }, include: { user: true } });
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  if (review.user.email !== currentUser.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: { rating, comment },
    include: { user: true },
  });
  return NextResponse.json(updated);
}

// DELETE: /api/reviews/[reviewId]
export async function DELETE(req: NextRequest, { params }: { params: { reviewId: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { reviewId } = params;
  const review = await prisma.review.findUnique({ where: { id: reviewId }, include: { user: true } });
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  if (review.user.email !== currentUser.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.review.delete({ where: { id: reviewId } });
  return NextResponse.json({ success: true });
}
