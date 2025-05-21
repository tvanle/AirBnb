'use client';

import axios from 'axios';
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast as hotToast } from "react-hot-toast"; // Renamed to avoid conflicts
import { toast } from "react-toastify"; // Import toast from react-toastify
import { FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

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
  } = useForm<FieldValues>({
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

  // Custom toast notifications with icons
  const showSuccessEmailToast = () => {
    toast.success(
      <div className="flex items-center">
        <FiMail className="text-white mr-2 text-xl" />
        <div>
          <p className="font-medium">Email sent successfully!</p>
          <p className="text-sm">Please check your email for the OTP code</p>
        </div>
      </div>, 
      {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false
      }
    );
  };

  const showInvalidOTPToast = () => {
    toast.error(
      <div className="flex items-center">
        <FiAlertCircle className="text-white mr-2 text-xl" />
        <div>
          <p className="font-medium">Invalid OTP code!</p>
          <p className="text-sm">Please check and try again</p>
        </div>
      </div>,
      {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false
      }
    );
  };

  const showVerifySuccessToast = () => {
    toast.success(
      <div className="flex items-center">
        {/* Only keep one icon */}
        <FiCheckCircle className="text-white mr-2 text-xl" />
        <div>
          <p className="font-medium">Verification successful!</p>
          <p className="text-sm">Please create a new password</p>
        </div>
      </div>,
      {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false
      }
    );
  };

  const onSendOTP = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      axios.post('/api/auth/forgot-password', { email });
      showSuccessEmailToast(); // New toast notification
      setEmail(email);
      startCountdown();
      setStep(STEPS.OTP);
    } catch (error) {
      toast.error('Unable to send verification code. Please check your email.');
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
      showSuccessEmailToast(); // New toast notification
      startCountdown();
    } catch (error) {
      toast.error('Unable to resend verification code');
    } finally {
      setIsLoading(false);
    }
  }, [email, timerActive, startCountdown]);

  // Verify OTP
  const onVerifyOTP = useCallback(async (otp: string) => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/verify-otp', { email, otp });
      showVerifySuccessToast(); // New toast notification
      setStep(STEPS.NEW_PASSWORD);
    } catch (error) {
      showInvalidOTPToast(); // New toast notification
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Reset password
  const onResetPassword = useCallback(async ({ password, confirmPassword }: { password: string, confirmPassword: string }) => {
    if (password !== confirmPassword) {
      toast.error('Password confirmation does not match');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/auth/reset-password', {
        email,
        password
      });
      toast.success('Password has been updated successfully');
      setStep(STEPS.COMPLETED);
    } catch (error) {
      toast.error('Unable to update password');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Handle form submission
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
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
              title="Forgot Password"
              subtitle="Enter your email to receive a verification code"
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
              title="OTP Verification"
              subtitle="Please enter the verification code sent to your email"
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
                Code expires in: <span className="font-semibold">{formatTime(countdown)}</span>
              </p>
              <button
                onClick={onResendOTP}
                disabled={timerActive || isLoading}
                className={`text-sm mt-2 ${timerActive ? 'text-gray-400' : 'text-rose-500'}`}
                type="button"
              >
                {timerActive ? 'Resend after ' + formatTime(countdown) : 'Resend code'}
              </button>
            </div>
          </div>
        );
      case STEPS.NEW_PASSWORD:
        return (
          <div className="flex flex-col gap-4">
            <Heading
              title="Set New Password"
              subtitle="Please enter your new password"
            />
            <Input
              id="password"
              label="New Password"
              type="password"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <Input
              id="confirmPassword"
              label="Confirm Password"
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
              title="Password Reset Successful!"
              subtitle="Your password has been updated"
              center
            />
            <p className="text-neutral-500 text-center">
              You can now log in with your new password.
            </p>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  // Action buttons based on current step
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      {step === STEPS.EMAIL && (
        <div className="text-neutral-500 text-center mt-4 font-light">
          <div className="flex flex-row items-center gap-2 justify-center">
            <div>Remember your password?</div>
            <div
              onClick={onOpenLoginModal}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Log in
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
      title="Forgot Password"
      actionLabel={step !== STEPS.COMPLETED ? 
        (step === STEPS.EMAIL ? "Continue" : step === STEPS.OTP ? "Verify" : "Reset Password") : 
        "Log in now"}
      onClose={forgotPasswordModal.onClose}
      onSubmit={step !== STEPS.COMPLETED ? handleSubmit(onSubmit) : handleComplete}
      body={bodyContent()}
      footer={footerContent}
    />
  );
};

export default ForgotPasswordModal;