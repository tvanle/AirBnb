//TODO
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(req: Request) 
{
  const body = await req.json();
    const { email,name, password } = body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword,
            image: '' // Add the missing image property here
        }
    });

    return NextResponse.json(user);
}