import { format } from 'path';
import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { BiDollar } from 'react-icons/bi';

interface InputProps {
    id: string;
    label: string;
    type?: string;
    isDisabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register?: UseFormRegister<FieldValues>;
    errors: FieldErrors
}

const Input : React.FC<InputProps>= ({
    id,
    label,
    type = 'text',
    isDisabled,
    formatPrice,
    required,
    register,
    errors
}) => {
    console.log("Input isDisabled:", isDisabled);
    return (
        <div className='relative w-full'>
            {formatPrice && (
                <><BiDollar size={24} 
                    className='absolute left-2 top-5 text-neutral-700' 
                /> 
                <span className='absolute right-3 top-3'>€</span></>
            )}

            <input 
                id = {id} 
                disabled = {isDisabled} 
                type = {type} 
                {...register?.(id, { required })}

                placeholder=''
                className={`
                peer 
                font-light
                w-full 
                p-4
                pt-6
                border-b-2
                bg-white
                border-2
                rounded-md
                outline-none
                transition 
                disabled:cursor-not-allowed 
                disabled:opacity-70
                ${formatPrice ? 'pl-10 pr-10' : 'px-4'}
                ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
                ${errors[id] ? 'focus: border-rose-500' : 'focus:border-black'}
                `}
            />

            <label className={
                `absolute 
                text-md 
                duration-150 
                transform 
                -translate-y-3 
                top-5 z-10 
                origin-[0]
                ${formatPrice ? 'left-10' : 'left-4'}
                peer-placeholder-shown:scale-100
                peer-placeholder-shown:translate-y-0
                peer-focus:scale-75
                peer-focus:-translate-y-4
                ${errors[id] ? 'text-rose-500' : 'text-neutral-400'}
                `
            }>
                {label}
            </label>
        </div>
    )
}

export default Input;