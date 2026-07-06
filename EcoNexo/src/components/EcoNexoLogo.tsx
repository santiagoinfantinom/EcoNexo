import React from 'react';
import Image from 'next/image';
import logoImg from '../../public/logo-econexo.png';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 60 }: EcoNexoLogoProps) {
  return (
    <div className={`flex items-center justify-center relative ${className}`}>
      <Image
        src={logoImg}
        alt="EcoNexo Logo"
        width={size}
        height={size}
        className="drop-shadow-md transition-transform hover:scale-105 duration-300 w-auto h-auto max-w-full max-h-full"
        priority
      />
    </div>
  );
}
