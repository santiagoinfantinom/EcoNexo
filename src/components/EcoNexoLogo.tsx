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
        className="rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg"
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          {/* Leaf emoji as main icon */}
          <div className="text-6xl mb-2">🌿</div>
          {/* EcoNexo text */}
          <div className="text-sm font-bold">EcoNexo</div>
        </div>
      </div>
    </div>
  );
}
