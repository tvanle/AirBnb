import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
        return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json({ status: transaction.status }, { status: 200 });
    } catch (error) {
        console.error("GET /api/qr/check-payment error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}