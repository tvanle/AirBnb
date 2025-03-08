'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Button from '../Button';

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactNode;
    footer?: React.ReactNode;
    actionLabel?: string;
    isDisabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    isDisabled,
    secondaryAction,
    secondaryActionLabel
}) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if (isDisabled) return;

        setShowModal(false);
        setTimeout(onClose, 300);
    }, [isDisabled, onClose]);

    const handleOnSubmit = useCallback(() => {
        if (!isDisabled) {
            onSubmit();
        }
    }, [isDisabled, onSubmit]);

    const handleSecondaryAction = useCallback(() => {
        if (isDisabled || !secondaryAction) return;

        secondaryAction();
    }, [isDisabled, secondaryAction]);

    if (!isOpen) return null;

    return (
        <div className="
            flex
            justify-center
            items-center
            fixed
            inset-0
            z-50
            bg-neutral-800/70
            overflow-x-hidden
            overflow-y-auto
            outline-none
            focus:outline-none
        ">
            <div className="
                relative
                w-full
                md:w-4/6
                lg:w-3/6
                xl:w-2/5
                my-6
                mx-auto
                h-full
                lg:h-auto
                md:h-auto
            ">
                <div className={`
                    duration-300
                    ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                `}>
                    <div className="
                        bg-white
                        rounded-lg
                        shadow-lg
                        flex
                        flex-col
                        h-full
                        translate
                        border-0
                        outline-none
                        focus:outline-none
                    ">
                        {/* Header */}
                        <div className="
                            flex
                            items-center
                            p-6
                            rounded-t
                            justify-center
                            relative
                            border-b
                        ">
                            <button
                                onClick={handleClose}
                                className="
                                    p-1
                                    absolute
                                    left-4
                                    hover:opacity-75
                                    transition
                                "
                            >
                                <IoMdClose size={18} />
                            </button>
                            <div className="text-lg font-semibold">{title}</div>
                        </div>

                        {/* Body */}
                        <div className="p-6 flex-auto">{body}</div>

                        {/* Footer */}
                        <div className="flex flex-col gap-2 p-6">
                            <div className="flex flex-row items-center gap-4 w-full">
                                {secondaryAction && secondaryActionLabel && (
                                    <Button
                                        isDisabled={isDisabled}
                                        label={secondaryActionLabel}
                                        outLine
                                        onClick={handleSecondaryAction}
                                    />
                                )}
                                <Button
                                    isDisabled={isDisabled}
                                    label={actionLabel}
                                    onClick={handleOnSubmit}
                                />
                            </div>
                            {footer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
