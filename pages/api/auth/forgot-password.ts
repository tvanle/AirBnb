import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prismadb";
import nodemailer from 'nodemailer';

// Tạo OTP ngẫu nhiên 6 chữ số
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Kiểm tra xem email có tồn tại trong hệ thống không
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Vẫn trả về thành công để không để lộ thông tin về việc email có tồn tại hay không
      return res.status(200).json({ message: 'OTP sent if email exists' });
    }

    // Tạo OTP và thời gian hết hạn (5 phút)
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Lưu OTP vào database
    await prisma.resetToken.upsert({
      where: { userId: user.id },
      update: {
        token: otp,
        expiresAt,
      },
      create: {
        userId: user.id,
        token: otp,
        expiresAt,
      },
    });

    // Cấu hình transporter cho nodemailer (cần thiết lập trong .env)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Gửi email chứa OTP
    await transporter.sendMail({
      from: `"AirBnb" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã xác thực đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #FF5A5F;">AirBnb</h1>
          </div>
          <p style="font-size: 16px;">Xin chào,</p>
          <p style="font-size: 16px;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực sau để tiếp tục:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f0f0f0; border-radius: 4px; display: inline-block;">${otp}</div>
          </div>
          <p style="font-size: 16px;">Mã xác thực này sẽ hết hạn sau 5 phút.</p>
          <p style="font-size: 16px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <p style="font-size: 16px; margin-top: 30px;">Trân trọng,</p>
          <p style="font-size: 16px;">Đội ngũ AirBnb</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
}