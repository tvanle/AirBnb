import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Tìm user với email đã cung cấp
    const user = await prisma.user.findUnique({
      where: { email },
      include: { resetToken: true },
    });

    if (!user || !user.resetToken || !user.resetToken.verified) {
      return res.status(400).json({ message: 'Unauthorized password reset' });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cập nhật mật khẩu và xóa token đặt lại
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { hashedPassword },
      }),
      prisma.resetToken.delete({
        where: { userId: user.id },
      }),
    ]);

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Error resetting password' });
  }
}