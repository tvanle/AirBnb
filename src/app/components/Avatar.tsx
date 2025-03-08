'use client';

import Image from 'next/image';
import React from 'react'

interface AvatarProps {
  src: string | null | undefined;
  userName?: string | null | undefined;
};

export const Avatar : React.FC<AvatarProps> = ({
  src,
  userName,
}) => {
  return (
    <Image
          alt='Avatar'
          className='rounded-full'
          height="30"
          width="30" 
          src = {src ? src : "/Images/placeholder.png"}/>
  )
}

export default Avatar;
