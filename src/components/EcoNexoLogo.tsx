"use client";
import React from 'react';
import Image from 'next/image';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 40 }: EcoNexoLogoProps) {
  return (
    <div
      className={`relative flex items-start justify-center rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-clean-v2.png"
        alt="EcoNexo Logo"
        width={size * 1.5}
        height={size * 1.5}
        className="transition-transform hover:scale-105 duration-300 object-cover"
        style={{ objectPosition: 'center center' }}
        priority
      />
    </div>
  );
}

