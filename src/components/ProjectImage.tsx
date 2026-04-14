"use client";
import { useState } from "react";
import Image from "next/image";
import { getProjectVisualImage } from "@/lib/projectVisuals";

type Props = {
  src: string;
  alt: string;
  fallbackSrc: string;
  category?: string;
  projectId?: string;
  className?: string;
};

export default function ProjectImage({ src, alt, fallbackSrc, category, projectId, className }: Props) {
  const specificImage = getProjectVisualImage({
    id: projectId,
    name: alt,
    category,
    fallback: src || fallbackSrc,
  });
  const candidates = [specificImage, src, fallbackSrc, "/window.svg"];
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


