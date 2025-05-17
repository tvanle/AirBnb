import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { transactionId, status, memo } = body;

        if (!transactionId || !status || !memo) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Kiểm tra trạng thái giao dịch từ webhook
        if (status === "SUCCESS") {
            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId },
            });

            if (!transaction) {
                return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
            }

            // Cập nhật trạng thái giao dịch
            await prisma.transaction.update({
                where: { id: transactionId },
                data: { status: "COMPLETED" },
            });

            // Lưu đặt phòng vào database
            const listenAndReservation = await prisma.listing.update({
                where: { id: transaction.listingId },
                data: {
                    reservations: {
                        create: {
                            userId: transaction.userId,
                            startDate: transaction.startDate,
                            endDate: transaction.endDate,
                            totalPrice: transaction.totalPrice,
                        },
                    },
                },
            });

            return NextResponse.json(listenAndReservation, { status: 200 });
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("POST /api/qr/webhook error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}