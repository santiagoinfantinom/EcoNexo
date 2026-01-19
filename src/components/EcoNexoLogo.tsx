"use client";
import React from 'react';
import Image from 'next/image';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 60 }: EcoNexoLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src="/logo-econexo-v3.png"
        alt="EcoNexo Logo"
        width={size}
        height={size}
        className="transition-transform hover:scale-105 duration-300 object-cover object-center rounded-full"
        priority
      />
    </div>
  );
}

