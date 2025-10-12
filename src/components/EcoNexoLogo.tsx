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
        className="rounded-full bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center shadow-lg"
        style={{ width: size, height: size }}
      >
        <svg 
          width={size * 0.6} 
          height={size * 0.6} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Compound leaf design - central stem */}
          <path 
            d="M50 15 L50 85" 
            stroke="#4ade80" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          
          {/* Leaflet 1 - Top left */}
          <ellipse 
            cx="35" 
            cy="25" 
            rx="12" 
            ry="8" 
            fill="#4ade80" 
            transform="rotate(-20 35 25)"
          />
          
          {/* Leaflet 2 - Top right */}
          <ellipse 
            cx="65" 
            cy="25" 
            rx="12" 
            ry="8" 
            fill="#4ade80" 
            transform="rotate(20 65 25)"
          />
          
          {/* Leaflet 3 - Middle left */}
          <ellipse 
            cx="30" 
            cy="50" 
            rx="14" 
            ry="10" 
            fill="#4ade80" 
            transform="rotate(-15 30 50)"
          />
          
          {/* Leaflet 4 - Middle right */}
          <ellipse 
            cx="70" 
            cy="50" 
            rx="14" 
            ry="10" 
            fill="#4ade80" 
            transform="rotate(15 70 50)"
          />
          
          {/* Leaflet 5 - Bottom left */}
          <ellipse 
            cx="32" 
            cy="75" 
            rx="11" 
            ry="7" 
            fill="#4ade80" 
            transform="rotate(-10 32 75)"
          />
          
          {/* Leaflet 6 - Bottom right */}
          <ellipse 
            cx="68" 
            cy="75" 
            rx="11" 
            ry="7" 
            fill="#4ade80" 
            transform="rotate(10 68 75)"
          />
          
          {/* Subtle highlights for depth */}
          <ellipse 
            cx="35" 
            cy="25" 
            rx="8" 
            ry="5" 
            fill="#6ee7b7" 
            opacity="0.6"
            transform="rotate(-20 35 25)"
          />
          <ellipse 
            cx="65" 
            cy="25" 
            rx="8" 
            ry="5" 
            fill="#6ee7b7" 
            opacity="0.6"
            transform="rotate(20 65 25)"
          />
          <ellipse 
            cx="30" 
            cy="50" 
            rx="9" 
            ry="6" 
            fill="#6ee7b7" 
            opacity="0.5"
            transform="rotate(-15 30 50)"
          />
          <ellipse 
            cx="70" 
            cy="50" 
            rx="9" 
            ry="6" 
            fill="#6ee7b7" 
            opacity="0.5"
            transform="rotate(15 70 50)"
          />
        </svg>
      </div>
    </div>
  );
}
