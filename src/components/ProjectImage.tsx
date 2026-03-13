"use client";
import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
};

export default function ProjectImage({ src, alt, fallbackSrc, className }: Props) {
  const candidates = [src, fallbackSrc, "/window.svg"];
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <Image
      src={candidates[imgIndex]}
      alt={alt}
      fill
      className={`object-cover ${className || ""}`}
      unoptimized={true}
      onError={() => {
        if (imgIndex < candidates.length - 1) {
          setImgIndex(prev => prev + 1);
        }
      }}
    />
  );
}


