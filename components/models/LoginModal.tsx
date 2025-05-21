"use client";

import useLoginModal from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useForgotPasswordModal from "@/hook/useForgotPasswordModal";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";

type Props = {};

function LoginModal({}: Props) {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const forgotPasswordModal = useForgotPasswordModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success("Login Successfully");
        router.refresh();
        loginModal.onClose();
      } else if (callback?.error) {
        toast.error("Something Went Wrong");
      }
    });
  };

  const toggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const onForgotPassword = useCallback(() => {
    loginModal.onClose();
    forgotPasswordModal.onOpen();
  }, [loginModal, forgotPasswordModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome Back" subtitle="Login to your Account!" center />
      <Input
        id="email"
        label="Email Address"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/*<Button*/}
      {/*  outline*/}
      {/*  label="Continue with Google"*/}
      {/*  icon={FcGoogle}*/}
      {/*  onClick={() => signIn("google")}*/}
      {/*/>*/}
      {/*<Button*/}
      {/*  outline*/}
      {/*  label="Continue with Facebook"*/}
      {/*  icon={AiFillFacebook}*/}
      {/*  onClick={() => signIn("facebook")}*/}
      {/*  isColor*/}
      {/*/>*/}
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="flex flex-col items-center gap-2 justify-center">
          <span
            onClick={onForgotPassword}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Forgot password?
          </span>
          <div className="flex flex-row items-center gap-2">
            <div>{`Didn't have an Account?`}</div>
            <span
              onClick={toggle}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Create an Account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;