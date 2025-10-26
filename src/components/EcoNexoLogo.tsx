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
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
        }}
      >
        {/* Modern leaf icon with EcoNexo symbol */}
        <svg 
          width={size * 0.7} 
          height={size * 0.7} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer leaf shape */}
          <path 
            d="M50 10 C70 8, 85 18, 90 40 C95 62, 88 78, 72 82 C56 86, 44 82, 30 75 C16 68, 10 50, 12 35 C14 20, 30 12, 50 10 Z" 
            fill="#ffffff" 
            opacity="0.95"
          />
          
          {/* Inner detail */}
          <path 
            d="M50 18 C60 18, 68 22, 72 30 C76 38, 74 48, 68 52 C62 56, 52 56, 45 52 C38 48, 32 40, 32 32 C32 24, 40 18, 50 18 Z" 
            fill="#10b981" 
            opacity="0.5"
          />
          
          {/* Stem */}
          <path 
            d="M50 80 Q55 88, 62 92" 
            stroke="#ffffff" 
            strokeWidth="5" 
            strokeLinecap="round"
            opacity="0.9"
            fill="none"
          />
          
          {/* Connection symbol - circular nodes */}
          <circle cx="35" cy="30" r="3" fill="#10b981" opacity="0.8"/>
          <circle cx="65" cy="35" r="3" fill="#10b981" opacity="0.8"/>
          <circle cx="50" cy="50" r="3" fill="#10b981" opacity="0.8"/>
        </svg>
      </div>
    </div>
  );
}
