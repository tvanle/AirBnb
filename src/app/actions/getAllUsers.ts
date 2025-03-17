import prisma from "@/app/libs/prismadb";

export default async function getAllUsers()
{
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })
        //casting the date to string of all users
        const safeUsers = users.map((user) => ({
            ...user,
            createdAt: user.createdAt.toString(),
            updatedAt: user.updatedAt.toString(),
            emailVerified: user.emailVerified?.toISOString() || null,
        }));
        return safeUsers;
    } catch (error: any) {
        console.log(
            "🚀 ~ file: getCurrentUser.ts:13 ~ getCurrentUser ~ error:",
            error
        );
        return [];
    }
}