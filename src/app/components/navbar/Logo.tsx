'use client';

import {useRouter} from "next/navigation";
import Image from "next/image";

const Logo = () => {
    const router = useRouter();

    return(
    <Image
        src="/images/logo.png"
        alt="Logo"
        className={"hidden md:block cursor-pointer"}
        width="100"
        height="100"
        onClick={() => router.push("/")}
    />
  );
}

export default Logo;