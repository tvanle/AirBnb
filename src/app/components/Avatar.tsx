'use client';

import Image from 'next/image';
import React from 'react'

export const Avatar = () => {
  return (
    <Image
          alt='Avatar'
          className='rounded-full'
          height="30"
          width="30" 
          src = "/Images/placeholder.png"/>
  )
}

export default Avatar;
