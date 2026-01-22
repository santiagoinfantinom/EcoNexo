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
        src="/logo-new.png"
        alt="EcoNexo Logo"
        width={size * 2.2}
        height={size * 2.2}
        className="transition-transform hover:scale-105 duration-300 object-cover"
        style={{ marginTop: '25%', objectPosition: 'center 25%' }}
        priority
      />
    </div>
  );
}

