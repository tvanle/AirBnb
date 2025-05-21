// lib/mailService.ts

import nodemailer from 'nodemailer';

// Configure email transport
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send OTP email function
export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'your-email@example.com',
    to: email,
    subject: 'Password Reset Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>You have requested to reset your password. Please use the following verification code:</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}