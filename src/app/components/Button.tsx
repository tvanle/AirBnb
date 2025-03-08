'use client';

import React from 'react'
import { IconType } from 'react-icons';
interface ButtonProps {
    outLine?: boolean;
    label?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isDisabled?: boolean;
    small?: boolean;
    icon?: IconType;
    }

const Button : React.FC<ButtonProps>= ({
    outLine,
    label,
    onClick,
    isDisabled,
    small,
    icon : Icon,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`
                ${outLine ? 'bg-white' : 'bg-rose-500'}
                ${outLine ? 'border-black' : 'border-rose-500'}
                ${outLine ? 'text-black' : 'text-white'}
                ${small ? 'px-2 py-1' : 'px-4 py-2'}
                ${small ? 'text-sm' : 'text-md'}
                ${small ? 'font-light' : 'font-semibold'}
                ${small ? 'border-[1px]' : 'border-4'}
                relative
                disabled:opacity-70
                disabled:cursor-not-allowed
                rounded-lg
                hover:opacity-75
                transition
                duration-300
                ease-in-out
                w-full
            `}
        >
            {Icon && <Icon size={20} className="absolute left-4 top-3"/>}
            {label}
        </button>
    )
}

export default Button