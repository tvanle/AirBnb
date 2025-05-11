"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

type Props = {
  onChange: (value: string) => void;
  value: string;
};

function ImageUpload({ onChange, value }: Props) {
  const handleCallback = useCallback(
    (result: any) => {
      console.log("Upload result:", result);
      if (result?.info?.secure_url) {
        onChange(result.info.secure_url);
      }
    },
    [onChange],
  );

  // Động điều chỉnh z-index của Cloudinary widget khi mở
  useEffect(() => {
    const widgetOverlay = document.querySelector(
      ".cloudinary-widget, .cld-overlay",
    );
    if (widgetOverlay) {
      (widgetOverlay as HTMLElement).style.zIndex = "10000";
      (widgetOverlay as HTMLElement).style.pointerEvents = "auto";
    }
  }, []);

  return (
    <CldUploadWidget
      onUpload={handleCallback}
      uploadPreset="test123"
      options={{
        maxFiles: 1,
        clientAllowedFormats: ["jpg", "jpeg", "png"],
        showPoweredBy: false,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => {
              console.log("Open function:", open);
              open?.();
            }}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  alt="uploaded"
                  fill
                  style={{ objectFit: "cover" }}
                  src={value}
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}

export default ImageUpload;
