import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const authResponse = await requireAdmin(request);
    if (authResponse) return authResponse;

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("GET /api/admin/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authResponse = await requireAdmin(request);
    if (authResponse) return authResponse;

    try {
        const body = await request.json();
        const { email, name, role } = body;

        if (!email || !role) {
            return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
        }

        if (!["ADMIN", "USER"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                role,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("POST /api/admin/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const authResponse = await requireAdmin(request);
    if (authResponse) return authResponse;

    try {
        const body = await request.json();
        const { id, email, name, role } = body;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        if (role && !["ADMIN", "USER"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (email && email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return NextResponse.json({ error: "Email already exists" }, { status: 400 });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                name,
                role,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/admin/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authResponse = await requireAdmin(request);
    if (authResponse) return authResponse;

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "User deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/admin/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}