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
        {/* Leaf icon - exact replica of the provided design */}
        <svg 
          width={size * 0.5} 
          height={size * 0.5} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Leaf body */}
          <path 
            d="M50 20 C60 15, 75 20, 80 35 C85 50, 75 65, 60 70 C45 75, 30 70, 25 55 C20 40, 30 25, 40 20 C45 18, 47 19, 50 20 Z" 
            fill="#ffffff" 
            opacity="0.9"
          />
          
          {/* Leaf stem */}
          <path 
            d="M50 70 Q55 75, 60 80" 
            stroke="#ffffff" 
            strokeWidth="3" 
            strokeLinecap="round"
            opacity="0.8"
            fill="none"
          />
          
          {/* Leaf center line */}
          <path 
            d="M50 25 L50 65" 
            stroke="#ffffff" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
}
