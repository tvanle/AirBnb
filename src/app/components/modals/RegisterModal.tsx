'use client';

import { signIn } from "next-auth/react";
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import axios from 'axios';
import React, { useState, useCallback } from 'react'
import { FieldValues,SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import { toast } from "react-toastify";

const RegisterModal = () => {
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
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
        loginModal.onOpen();
        registerModal.onClose();
      }, [loginModal, registerModal]);

    const onSubmit : SubmitHandler<FieldValues> = (data) =>{
        setIsLoading(true);
        axios.post('/api/register', data, {
            headers: { "Content-Type": "application/json" }
        })
        .then(() => {
            toast.success("Success!");
            loginModal.onOpen();
            registerModal.onClose();
          })
          .catch((err: any) => toast.error("Something Went Wrong"))
          .finally(() => {
            setIsLoading(false);
            toast.success("Register Successfully");
          });
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title={'Welcom to Airbnb'} subtitle='Create an account!'/>
            <Input
                id='email'
                label='Email'
                isDisabled={isLoading}
                required
                register={register}
                errors={errors}
            />

            <Input
                id='name'
                label='Name'
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
                    <div>Alrealy have an account?</div>
                    <div 
                        className='text-neutral-800 cursor-pointer hover:underline'
                        onClick={()=>{toggle()}}
                        >
                            Login
                    </div>
                </div>
                
            </div>
        </div>
    )

  return (
    <Modal
    isDisabled = {isLoading}
    isOpen = {registerModal.isOpen}
    title='Register'
    actionLabel='Continue'
    onClose={registerModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    body ={bodyContent}
    footer={footerContent}
    />
  )
}

export default RegisterModal