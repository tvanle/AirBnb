import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prismadb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' }, 
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid request' }, 
        { status: 400 }
      );
    }

    // Check if user has a valid verified reset token
    const resetToken = await prisma.resetToken.findFirst({
      where: {
        userId: user.id,
        verified: true
      }
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset session' }, 
        { status: 400 }
      );
    }

    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Password reset session has expired' }, 
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword }
    });

    await prisma.resetToken.delete({
      where: { id: resetToken.id }
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}