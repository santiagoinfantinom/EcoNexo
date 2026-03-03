"use client";
import React from 'react';
import Image from 'next/image';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 60 }: EcoNexoLogoProps) {
  const isLarge = size > 100;

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 ${isLarge ? 'p-1.5' : 'p-1'}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo-econexo.png"
          alt="EcoNexo Logo"
          width={size}
          height={size}
          className="object-cover w-full h-full rounded-full scale-110"
          priority
        />
      </div>
      {/* Visual separator - only for small header logos */}
      {size <= 100 && <div className="h-8 w-px bg-white/30 hidden sm:block mx-2"></div>}
    </div>
  );
}
