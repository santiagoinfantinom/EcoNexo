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
        className={`relative shadow-2xl bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 transform rotate-45 transition-transform hover:rotate-[225deg] duration-700 ${isLarge ? 'p-1.5 rounded-3xl' : 'p-1 rounded-xl'}`}
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full bg-white rounded-[inherit] overflow-hidden">
          <Image
            src={isLarge ? "/logo-icon-v3.png" : "/logo-econexo.png"}
            alt="EcoNexo Logo"
            width={size}
            height={size}
            className="object-cover w-full h-full transform -rotate-45 scale-125"
            priority
          />
        </div>
      </div>
      {/* Visual separator - only for small header logos */}
      {size <= 100 && <div className="h-8 w-px bg-white/30 hidden sm:block mx-2"></div>}
    </div>
  );
}
