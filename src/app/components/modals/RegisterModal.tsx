'use client';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import axios from 'axios';
import React, { useState } from 'react'
import { FieldValues,SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';

const RegisterModal = () => {
    const registerModal = useRegisterModal()
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

    const onSubmit : SubmitHandler<FieldValues> = (data) =>{
        setIsLoading(true);
        axios.post('/api/register', data)
        .then(() => {
            registerModal.onClose();
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            setIsLoading(false);
        })
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
                onClick={()=>{}}
            />

            <Button 
                outLine
                label='Continue with Github'
                icon={AiFillGithub}
                onClick={()=>{}}
            />

            <div className='text-neutral-500 text-center mt-3 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    <div>Alrealy have an account?</div>
                    <div 
                        className='text-neutral-800 cursor-pointer hover:underline'
                        onClick={()=>{registerModal.onClose();}}
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