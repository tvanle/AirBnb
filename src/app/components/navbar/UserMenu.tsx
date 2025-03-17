'user client';
import {useRouter} from 'next/navigation';
import {signOut} from 'next-auth/react';
import React, {useCallback, useState} from 'react'
import {AiOutlineMenu} from 'react-icons/ai';
import Avatar from '../Avatar';
import {MenuItems} from './MenuItems';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import {SafeUser} from '../../../../type';
import useRentModal from '@/app/hooks/useRentModal';

interface UserMenuProps {
    currentUser?: SafeUser | null;
}

export const UserMenu: React.FC<UserMenuProps> = ({currentUser}) => {
    const router = useRouter();
    const rentMolal = useRentModal();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        rentMolal.onOpen();
    }, [currentUser, loginModal, rentMolal]);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={() => onRent()}

                    className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:bg-neutral-100
                    transition
                    cursor-pointer
                "
                >
                    Airbnb your home
                </div>

                <div onClick={toggleOpen}
                     className='
                    p-4
                    md:py-1
                    md:px-2
                    border-[1px]
                    border-neutral-200
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition
                '
                >
                    <AiOutlineMenu/>
                    <div
                        className='hidden md:block'
                    >
                        <Avatar src={currentUser?.image!} userName={currentUser?.name}/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className='
                absolute
                rounded-xl
                shadow-md
                w-[40vw]
                md:w-3/4
                bg-white
                overflow-hidden
                right-0
                top-12
                text-sm
                '
                >
                    <div className='flex flex-col cursor-pointer'>
                        {currentUser ? (
                            <>
                                <MenuItems
                                    onclick={() => router.push("/trips")}
                                    label="My trips"
                                />
                                <MenuItems
                                    onclick={() => router.push("/favorites")}
                                    label="My favorites"
                                />
                                <MenuItems
                                    onclick={() => router.push("/reservations")}
                                    label="My reservations"
                                />
                                <MenuItems
                                    onclick={() => router.push("/properties")}
                                    label="My properties"
                                />
                                <MenuItems onclick={onRent} label="Airbnb your home"/>
                                <MenuItems onclick={() => router.push("/admin")} label={"Admin"}/>
                                <hr/>
                                <MenuItems onclick={() => signOut()} label="Logout"/>
                            </>
                        ) : (
                            <>
                                <MenuItems onclick={loginModal.onOpen} label="Login"/>
                                <MenuItems onclick={registerModal.onOpen} label="Sign up"/>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu;

