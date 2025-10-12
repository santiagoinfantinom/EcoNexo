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
        className="rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300"
        style={{ 
          width: size, 
          height: size,
          background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)'
        }}
      >
        {/* Leaf icon - simple and clean design */}
        <svg 
          width={size * 0.6} 
          height={size * 0.6} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simple leaf shape */}
          <path 
            d="M50 15 C65 10, 80 20, 85 40 C90 60, 80 75, 65 80 C50 85, 35 80, 20 75 C5 70, 10 50, 15 40 C20 30, 35 20, 50 15 Z" 
            fill="#ffffff" 
            opacity="0.95"
          />
          
          {/* Simple stem */}
          <path 
            d="M50 80 Q55 85, 60 90" 
            stroke="#ffffff" 
            strokeWidth="4" 
            strokeLinecap="round"
            opacity="0.9"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
