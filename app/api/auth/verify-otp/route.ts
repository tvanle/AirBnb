import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' }, 
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
        { error: 'Invalid verification code' }, 
        { status: 400 }
      );
    }

    const resetToken = await prisma.resetToken.findFirst({
      where: {
        userId: user.id
      }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid verification code' }, 
        { status: 400 }
      );
    }

    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Verification code has expired' }, 
        { status: 400 }
      );
    }

    const otpHash = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    if (resetToken.token !== otpHash) {
      return NextResponse.json(
        { error: 'Invalid verification code' }, 
        { status: 400 }
      );
    }

    await prisma.resetToken.update({
      where: {
        id: resetToken.id
      },
      data: {
        verified: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { 
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}