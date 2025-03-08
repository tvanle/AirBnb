'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from 'react'
import { FieldValues,SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import toast from 'react-hot-toast';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from "@/app/hooks/useRegisterModal";

const LoginModal = () => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false)

    const{
        register,
        handleSubmit,
        formState: { errors },
        
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
        }, [loginModal, registerModal]);

    const onSubmit : SubmitHandler<FieldValues> = (data) =>{
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
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title={'Welcom back'} subtitle='Login to your account!'/>
            <Input
                id='email'
                label='Email'
                isDisabled={isLoading}
                required
                register={register}
                errors={errors}
            />

            <Input
                id='password'
                label='Password'
                type='password'
                isDisabled={isLoading}
                required
                register={register}
                errors={errors}
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button 
                outLine
                label='Continue with Google'
                icon={FcGoogle}
                onClick={()=>{signIn("google")}}
            />

            <Button 
                outLine
                label='Continue with Github'
                icon={AiFillGithub}
                onClick={()=>{signIn("github")}}
            />

            <div className='text-neutral-500 text-center mt-3 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    <div>Didn't have an Account?</div>
                    <div 
                        className='text-neutral-800 cursor-pointer hover:underline'
                        onClick={()=>{toggle()}}
                        >
                            Create an account
                    </div>
                </div>
                
            </div>
        </div>
    )

  return (
    <Modal
    isDisabled = {isLoading}
    isOpen = {loginModal.isOpen}
    title='Login'
    actionLabel='Continue'
    onClose={loginModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    body ={bodyContent}
    footer={footerContent}
    />
  )
}

export default LoginModal