import { NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/mailService';
import prisma from '@/lib/prismadb';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const otpHash = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await prisma.resetToken.upsert({
      where: { 
        userId: user.id 
      },
      update: {
        token: otpHash,
        expiresAt,
        verified: false, 
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        token: otpHash,
        expiresAt,
        verified: false,
        updatedAt: new Date()
      }
    });

    sendOTPEmail(email, otp);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}