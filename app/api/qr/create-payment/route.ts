import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import  getCurrentUser  from "@/app/actions/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { totalPrice, startDate, endDate, listingId } = body;

    if (!totalPrice || !startDate || !endDate || !listingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Lấy user hiện tại
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tạo transaction mới
    const transaction = await prisma.transaction.create({
      data: {
        userId: currentUser.id,
        listingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: Number(totalPrice),
        status: "PENDING",
      },
    });

    // Quy đổi USD sang VND (1 USD = 1.000 VND)
    const priceVND = Math.round(Number(totalPrice) * 1000);
    const bankNumber = "08242117439";
    const bankBin = "970423"; // TPBank
    const accountName = "LÊ VĂN TRỌNG"; // Thay bằng tên thật của chủ tài khoản
    const addInfo = encodeURIComponent(`Thanh toan Airbnb ${transaction.id}`);

    // Tạo QR VietQR chuẩn
    const qrCodeUrl = `https://img.vietqr.io/image/${bankBin}-${bankNumber}-compact2.png?amount=${priceVND}&addInfo=${addInfo}&accountName=${encodeURIComponent(accountName)}`;

    return NextResponse.json({ qrCodeUrl, transactionId: transaction.id, accountName, bankNumber, priceVND }, { status: 200 });
  } catch (error) {
    console.error("POST /api/qr/create-payment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
