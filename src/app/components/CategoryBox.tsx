"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  label: string;
  selected?: boolean;
};

function CategoryBox({ icon: Icon, label, selected }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const updateQueryParams = (label: string) => {
    console.log(params?.toString);
    const urlParams = new URLSearchParams(params?.toString());
    
    if (urlParams.get("category") === label) {
      urlParams.delete("category");
    } else {
      urlParams.set("category", label);
    }

    console.log(urlParams.toString());
    router.push(`/?${urlParams.toString()}`);
  };

  return (
    <div
      onClick={() => updateQueryParams(label)}
      className={`
        flex flex-col items-center justify-center gap-2 p-3 border-b-2
        hover:text-neutral-800 transition cursor-pointer
        ${selected ? "border-b-neutral-800 text-neutral-800" : "border-transparent text-neutral-500"}
      `}
    >
      <Icon size={26} />
      <div className="font-medium text-xs">{label}</div>
    </div>
  );
}

export default CategoryBox;
