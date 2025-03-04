//TODO
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '../../../app/libs/prismadb'

export async function POST(req: Request) 
{
  const body = await req.json();
    const { email,name, password } = body;
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log({ email,name, password });

    const users = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword, 
        }
    });
console.log("Users in database:", users);

    return NextResponse.json(body);
}