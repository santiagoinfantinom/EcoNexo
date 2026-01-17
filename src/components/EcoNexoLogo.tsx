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
      className={`rounded-full p-1 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-lg ${className}`}
      style={{
        boxShadow: '0 0 12px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
      }}
    >
      <Image
        src="/logo-econexo.png"
        alt="EcoNexo Logo"
        width={size}
        height={size}
        className="drop-shadow-md transition-transform hover:scale-105 duration-300 opacity-90 rounded-full ml-1"
        priority
      />
    </div>
  );
}

