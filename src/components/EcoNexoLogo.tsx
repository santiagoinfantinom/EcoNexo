import React from 'react';
import Image from 'next/image';
import logoImg from '../../public/logo-econexo.png';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 60 }: EcoNexoLogoProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Image
        src={logoImg}
        alt="EcoNexo Logo"
        width={size}
        height={size}
        className="drop-shadow-md transition-transform hover:scale-105 duration-300"
        priority
      />
      {/* Vertical Separator Pipe - only for header context */}
      <div className="h-10 w-px bg-white/30 hidden sm:block mx-1"></div>
    </div>
  );
}
