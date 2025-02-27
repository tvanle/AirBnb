'use client';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import axios from 'axios';
import React, { useState } from 'react'
import { FieldValues,SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal';

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

  return (
    <Modal
    isDisabled = {isLoading}
    isOpen = {registerModal.isOpen}
    title='Register'
    actionLabel='Continue'
    onClose={registerModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    />
  )
}

export default RegisterModal