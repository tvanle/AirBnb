
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  // Lấy tất cả reservation của các listing mà host sở hữu
  const reservations = await prisma.reservation.findMany({
    where: {
      listing: {
        userId: currentUser.id,
      },
    },
    include: {
      user: true,
      listing: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reservations);
}

