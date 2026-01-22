"use client";
import React from 'react';
import Image from 'next/image';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 60 }: EcoNexoLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden bg-white shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-econexo-v3.png?v=6"
        alt="EcoNexo Logo"
        width={size}
        height={size}
        className="transition-transform hover:scale-105 duration-300 object-cover object-center"
        priority
      />
    </div>
  );
}

