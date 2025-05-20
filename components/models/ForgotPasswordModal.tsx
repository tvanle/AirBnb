'use client';

import axios from 'axios';
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useLoginModal from "@/hook/useLoginModal";
import useForgotPasswordModal from "@/hook/useForgotPasswordModal";
import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

enum STEPS {
  EMAIL = 0,
  OTP = 1,
  NEW_PASSWORD = 2,
  COMPLETED = 3,
}

// Định nghĩa interface cho form values
interface ForgotPasswordFormValues {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

const ForgotPasswordModal = () => {
  const loginModal = useLoginModal();
  const forgotPasswordModal = useForgotPasswordModal();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  const { 
    register, 
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  // OTP input refs
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Move to next input field if current field is filled
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Update form value
      const otpString = newOtpValues.join('');
      setValue('otp', otpString);
    }
  };

  // Start countdown timer for OTP
  const startCountdown = useCallback(() => {
    setCountdown(300); // Reset to 5 minutes
    setTimerActive(true);

    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle sending OTP email
  const onSendOTP = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      toast.success('Mã xác thực đã được gửi đến email của bạn');
      setEmail(email);
      startCountdown();
      setStep(STEPS.OTP);
    } catch (error) {
      toast.error('Không thể gửi mã xác thực. Vui lòng kiểm tra lại email.');
    } finally {
      setIsLoading(false);
    }
  }, [startCountdown]);

  // Resend OTP
  const onResendOTP = useCallback(async () => {
    if (timerActive) return;
    
    setIsLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      toast.success('Mã xác thực mới đã được gửi đến email của bạn');
      startCountdown();
    } catch (error) {
      toast.error('Không thể gửi lại mã xác thực');
    } finally {
      setIsLoading(false);
    }
  }, [email, timerActive, startCountdown]);

  // Verify OTP
  const onVerifyOTP = useCallback(async (otp: string) => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/verify-otp', { email, otp });
      toast.success('Mã xác thực hợp lệ');
      setStep(STEPS.NEW_PASSWORD);
    } catch (error) {
      toast.error('Mã xác thực không hợp lệ hoặc đã hết hạn');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Reset password - sửa lỗi kiểu dữ liệu ở đây
  const onResetPassword = useCallback(async ({ password, confirmPassword }: { password: string, confirmPassword: string }) => {
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { 
        email, 
        password 
      });
      toast.success('Mật khẩu đã được cập nhật thành công');
      setStep(STEPS.COMPLETED);
    } catch (error) {
      toast.error('Không thể cập nhật mật khẩu');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Handle form submission - sửa lỗi kiểu dữ liệu ở đây
  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
    switch (step) {
      case STEPS.EMAIL:
        onSendOTP(data.email);
        break;
      case STEPS.OTP:
        onVerifyOTP(data.otp);
        break;
      case STEPS.NEW_PASSWORD:
        onResetPassword({
          password: data.password,
          confirmPassword: data.confirmPassword
        });
        break;
      default:
        break;
    }
  };

  const onOpenLoginModal = useCallback(() => {
    forgotPasswordModal.onClose();
    loginModal.onOpen();
  }, [forgotPasswordModal, loginModal]);

  // Handle completion and reset
  const handleComplete = useCallback(() => {
    reset();
    setStep(STEPS.EMAIL);
    forgotPasswordModal.onClose();
    loginModal.onOpen();
  }, [reset, forgotPasswordModal, loginModal]);

  // Different content for each step
  const bodyContent = () => {
    switch (step) {
      case STEPS.EMAIL:
        return (
          <div className="flex flex-col gap-4">
            <Heading
              title="Quên mật khẩu"
              subtitle="Nhập email của bạn để nhận mã xác thực"
            />
            <Input
              id="email"
              label="Email"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
        );
      case STEPS.OTP:
        return (
          <div className="flex flex-col gap-4">
            <Heading
              title="Xác thực OTP"
              subtitle="Vui lòng nhập mã xác thực đã được gửi đến email của bạn"
            />
            <div className="flex justify-center gap-2">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl border rounded-md"
                />
              ))}
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Mã xác thực sẽ hết hạn sau: <span className="font-semibold">{formatTime(countdown)}</span>
              </p>
              <button
                onClick={onResendOTP}
                disabled={timerActive || isLoading}
                className={`text-sm mt-2 ${timerActive ? 'text-gray-400' : 'text-rose-500'}`}
                type="button"
              >
                {timerActive ? 'Gửi lại sau ' + formatTime(countdown) : 'Gửi lại mã'}
              </button>
            </div>
          </div>
        );
      case STEPS.NEW_PASSWORD:
        return (
          <div className="flex flex-col gap-4">
            <Heading
              title="Đặt mật khẩu mới"
              subtitle="Vui lòng nhập mật khẩu mới của bạn"
            />
            <Input
              id="password"
              label="Mật khẩu mới"
              type="password"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <Input
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
        );
      case STEPS.COMPLETED:
        return (
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <Heading
              title="Đặt lại mật khẩu thành công!"
              subtitle="Mật khẩu của bạn đã được cập nhật"
              center
            />
            <p className="text-neutral-500 text-center">
              Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // Action buttons based on current step
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      {step === STEPS.COMPLETED ? (
        <Button
          outline
          label="Đăng nhập ngay"
          onClick={handleComplete}
        />
      ) : (
        <Button
          disabled={isLoading}
          label={
            step === STEPS.EMAIL
              ? "Tiếp tục"
              : step === STEPS.OTP
              ? "Xác nhận"
              : "Đặt lại mật khẩu"
          }
          onClick={handleSubmit(onSubmit)}
        />
      )}
      {step === STEPS.EMAIL && (
        <div className="text-neutral-500 text-center mt-4 font-light">
          <div className="flex flex-row items-center gap-2 justify-center">
            <div>Đã nhớ mật khẩu?</div>
            <div
              onClick={onOpenLoginModal}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Đăng nhập
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={forgotPasswordModal.isOpen}
      title="Quên mật khẩu"
      actionLabel="Tiếp tục"
      onClose={forgotPasswordModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent()}
      footer={footerContent}
    />
  );
};

export default ForgotPasswordModal;