import prisma from "@/lib/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

// Định nghĩa các role hợp lệ
const VALID_ROLES = ["USER", "ADMIN"] as const;
type Role = typeof VALID_ROLES[number];

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    // Kiểm tra role hợp lệ
    const role = VALID_ROLES.includes(currentUser.role as Role)
        ? currentUser.role
        : "USER";

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
      role, // Trả về role
    };
  } catch (error: any) {
    console.error("🚀 ~ file: getCurrentUser.ts ~ getCurrentUser ~ error:", error);
    return null;
  }
}