import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const bookings = await prisma.reservation.findMany({
            include: {
                user: true,
                listing: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeBookings = bookings.map(booking => ({
            id: booking.id,
            userId: booking.userId,
            userName: booking.user?.name || 'Unknown User',
            propertyId: booking.listingId,
            propertyName: booking.listing?.title || 'Unknown Property',
            startDate: booking.startDate.toISOString(),
            endDate: booking.endDate.toISOString(),
            totalPrice: booking.totalPrice,
            createdAt: booking.createdAt.toISOString()
        }));

        return NextResponse.json(safeBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}