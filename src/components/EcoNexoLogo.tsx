"use client";
import React from 'react';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 150 }: EcoNexoLogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/20"
        style={{ 
          width: size, 
          height: size,
          background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
        }}
      >
        {/* Subtle inner glow effect */}
        <div 
          className="rounded-full bg-gradient-to-br from-white/20 to-transparent"
          style={{ 
            width: size * 0.6, 
            height: size * 0.6 
          }}
        />
      </div>
    </div>
  );
}
