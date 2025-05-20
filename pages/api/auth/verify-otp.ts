import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Tìm user với email đã cung cấp
    const user = await prisma.user.findUnique({
      where: { email },
      include: { resetToken: true },
    });

    if (!user || !user.resetToken) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Kiểm tra OTP có hợp lệ không và chưa hết hạn
    if (
      user.resetToken.token !== otp ||
      user.resetToken.expiresAt < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP hợp lệ, đánh dấu đã được xác minh
    await prisma.resetToken.update({
      where: { userId: user.id },
      data: { verified: true },
    });

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Error verifying OTP' });
  }
}