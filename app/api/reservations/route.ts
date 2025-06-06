import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listenAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
    include: {
      user: true,
    },
  });

  // Tạo notification cho host
  const hostId = listenAndReservation.user.id;
  if (hostId && hostId !== currentUser.id) {
    await prisma.notification.create({
      data: {
        userId: hostId,
        type: 'RESERVATION',
        message: `${currentUser.name || 'Một người dùng'} đã đặt phòng của bạn!`,
        data: {
          listingId,
          startDate,
          endDate,
          totalPrice,
          guestName: currentUser.name || null,
        },
      },
    });
  }

  return NextResponse.json(listenAndReservation);
}
