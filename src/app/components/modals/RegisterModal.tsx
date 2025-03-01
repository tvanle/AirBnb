'use client';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import axios from 'axios';
import React, { useState } from 'react'
import { FieldValues,SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';

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
    />
  )
}

export default RegisterModal