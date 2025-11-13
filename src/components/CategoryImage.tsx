"use client";
import React from 'react';

interface CategoryImageProps {
  category: 'salud' | 'medio-ambiente' | 'educacion' | 'comunidad' | 'oceanos' | 'alimentacion';
  className?: string;
}

export default function CategoryImage({ category, className = "" }: CategoryImageProps) {
  const getImageContent = () => {
    switch (category) {
      case 'salud':
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-500 to-red-600"></div>
            {/* Medical cross pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl opacity-90">🏥</div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full opacity-60"></div>
            <div className="absolute top-8 right-6 w-4 h-4 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-6 left-8 w-6 h-6 border border-white rounded-full opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-white rounded-full opacity-30"></div>
          </div>
        );
      
      case 'medio-ambiente':
        return (
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl opacity-90">🌱</div>
            </div>
            <div className="absolute top-6 left-6 w-6 h-6 border-2 border-white rounded-full opacity-50"></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-8 left-4 w-5 h-5 border border-white rounded-full opacity-60"></div>
            <div className="absolute bottom-6 right-6 w-3 h-3 bg-white rounded-full opacity-30"></div>
          </div>
        );
      
      case 'educacion':
        return (
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-blue-500 to-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl opacity-90">📚</div>
            </div>
            <div className="absolute top-4 left-4 w-7 h-7 border-2 border-white rounded-full opacity-50"></div>
            <div className="absolute top-6 right-6 w-5 h-5 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 border border-white rounded-full opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-white rounded-full opacity-30"></div>
          </div>
        );
      
      case 'comunidad':
        return (
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl opacity-90">🤝</div>
            </div>
            <div className="absolute top-5 left-5 w-6 h-6 border-2 border-white rounded-full opacity-50"></div>
            <div className="absolute top-3 right-3 w-4 h-4 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-7 left-3 w-5 h-5 border border-white rounded-full opacity-60"></div>
            <div className="absolute bottom-5 right-5 w-3 h-3 bg-white rounded-full opacity-30"></div>
          </div>
        );
      
      case 'oceanos':
        return (
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl opacity-90">🌊</div>
            </div>
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full opacity-50"></div>
            <div className="absolute top-6 right-4 w-5 h-5 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-6 left-6 w-6 h-6 border border-white rounded-full opacity-60"></div>
            <div className="absolute bottom-4 right-6 w-4 h-4 bg-white rounded-full opacity-30"></div>
          </div>
        );
      
      case 'alimentacion':
        return (
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400 via-green-500 to-lime-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl opacity-90">🌾</div>
            </div>
            <div className="absolute top-6 left-6 w-6 h-6 border-2 border-white rounded-full opacity-50"></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-4 left-4 w-5 h-5 border border-white rounded-full opacity-60"></div>
            <div className="absolute bottom-6 right-6 w-3 h-3 bg-white rounded-full opacity-30"></div>
          </div>
        );
      
      case 'tecnologia':
        return (
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-500 to-violet-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl opacity-90">💻</div>
            </div>
            <div className="absolute top-4 left-4 w-7 h-7 border-2 border-white rounded-full opacity-50"></div>
            <div className="absolute top-6 right-6 w-5 h-5 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 border border-white rounded-full opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-white rounded-full opacity-30"></div>
          </div>
        );
      
      default:
        return (
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-8xl opacity-90">🌍</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {getImageContent()}
    </div>
  );
}

