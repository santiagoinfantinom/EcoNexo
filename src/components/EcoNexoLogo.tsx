"use client";
import React from 'react';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 150 }: EcoNexoLogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 150 150" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-full bg-gradient-to-br from-green-400 to-emerald-600 p-4"
      >
        {/* Background circle */}
        <circle 
          cx="75" 
          cy="75" 
          r="70" 
          fill="url(#gradient)" 
          stroke="#ffffff" 
          strokeWidth="4"
        />
        
        {/* Leaf icon */}
        <path 
          d="M75 25 C85 25, 95 35, 95 45 C95 55, 85 65, 75 75 C65 65, 55 55, 55 45 C55 35, 65 25, 75 25 Z" 
          fill="#ffffff" 
          opacity="0.9"
        />
        
        {/* Leaf stem */}
        <path 
          d="M75 75 L75 95" 
          stroke="#ffffff" 
          strokeWidth="3" 
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* EcoNexo text */}
        <text 
          x="75" 
          y="110" 
          textAnchor="middle" 
          fill="#ffffff" 
          fontSize="12" 
          fontWeight="bold" 
          fontFamily="Arial, sans-serif"
        >
          EcoNexo
        </text>
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
