"use client";
import React from 'react';

interface ProjectSpecificImageProps {
  project: {
    id: string;
    title?: {
      es: string;
      en: string;
      de: string;
    };
    name?: string;
    description?: {
      es: string;
      en: string;
      de: string;
    };
    category: string;
    location?: {
      es: string;
      en: string;
      de: string;
    };
    city: string;
    country: string;
    image_url?: string;
    imageUrl?: string;
  };
  className?: string;
  locale?: 'es' | 'en' | 'de';
}

export default function ProjectSpecificImage({ project, className = "", locale = 'es' }: ProjectSpecificImageProps) {
  // If project has an image url, use it directly (supports image_url and imageUrl)
  const directImage = project.image_url || project.imageUrl;
  if (directImage) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <img 
          src={directImage} 
          alt={project.title?.en || project.name || 'Project image'} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Project title overlay */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-black bg-opacity-60 text-white text-sm font-bold px-2 py-1 rounded">
            {project.title?.en || project.name || 'Project'}
          </div>
        </div>
      </div>
    );
  }

  const getProjectSpecificContent = () => {
    const titleEs = project.title?.es?.toLowerCase() || project.name?.toLowerCase() || '';
    const titleEn = project.title?.en?.toLowerCase() || '';
    const titleDe = project.title?.de?.toLowerCase() || '';
    const descriptionEs = project.description?.es?.toLowerCase() || '';
    const descriptionEn = project.description?.en?.toLowerCase() || '';
    const descriptionDe = project.description?.de?.toLowerCase() || '';
    const city = project.city?.toLowerCase() || '';
    const country = project.country?.toLowerCase() || '';
    
    // Combine all language versions for better matching
    const allText = `${titleEs} ${titleEn} ${titleDe} ${descriptionEs} ${descriptionEn} ${descriptionDe}`;
    
    // Determine project-specific visual elements based on content
    let emoji = "🌱";
    let gradientColors = "from-emerald-400 via-green-500 to-emerald-600";
    let accentColor = "emerald-400";
    
    // Project-specific logic based on title and description (multi-language)
    if (allText.includes('reforestación') || allText.includes('árbol') || allText.includes('baum') || allText.includes('tree') || allText.includes('aufforstung')) {
      emoji = "🌳";
      gradientColors = "from-green-400 via-emerald-500 to-green-600";
      accentColor = "green-400";
    } else if (allText.includes('limpieza') || allText.includes('cleanup') || allText.includes('reinigung') || allText.includes('säuberung')) {
      emoji = "🧹";
      gradientColors = "from-blue-400 via-cyan-500 to-blue-600";
      accentColor = "blue-400";
    } else if (allText.includes('río') || allText.includes('river') || allText.includes('fluss') || allText.includes('seine')) {
      emoji = "🌊";
      gradientColors = "from-cyan-400 via-blue-500 to-cyan-600";
      accentColor = "cyan-400";
    } else if (allText.includes('jardín') || allText.includes('garden') || allText.includes('garten') || allText.includes('huerto') || allText.includes('gemeinschaftsgärten')) {
      emoji = "🌿";
      gradientColors = "from-lime-400 via-green-500 to-lime-600";
      accentColor = "lime-400";
    } else if (allText.includes('energía') || allText.includes('energy') || allText.includes('energie') || allText.includes('solar')) {
      emoji = "☀️";
      gradientColors = "from-yellow-400 via-orange-500 to-yellow-600";
      accentColor = "yellow-400";
    } else if (allText.includes('reciclaje') || allText.includes('recycling') || allText.includes('recycling')) {
      emoji = "♻️";
      gradientColors = "from-green-400 via-lime-500 to-green-600";
      accentColor = "green-400";
    } else if (allText.includes('biodiversidad') || allText.includes('biodiversity') || allText.includes('biodiversität')) {
      emoji = "🦋";
      gradientColors = "from-purple-400 via-pink-500 to-purple-600";
      accentColor = "purple-400";
    } else if (allText.includes('agua') || allText.includes('water') || allText.includes('wasser')) {
      emoji = "💧";
      gradientColors = "from-blue-400 via-cyan-500 to-blue-600";
      accentColor = "blue-400";
    } else if (allText.includes('aire') || allText.includes('air') || allText.includes('luft')) {
      emoji = "💨";
      gradientColors = "from-sky-400 via-blue-500 to-sky-600";
      accentColor = "sky-400";
    } else if (allText.includes('marino') || allText.includes('marine') || allText.includes('meer')) {
      emoji = "🐠";
      gradientColors = "from-blue-400 via-indigo-500 to-blue-600";
      accentColor = "blue-400";
    }
    
    // City-specific adjustments
    if (city.includes('berlin') || city.includes('berlín')) {
      emoji = "🏙️";
      gradientColors = "from-gray-400 via-slate-500 to-gray-600";
      accentColor = "gray-400";
    } else if (city.includes('paris')) {
      emoji = "🗼";
      gradientColors = "from-blue-400 via-indigo-500 to-blue-600";
      accentColor = "blue-400";
    } else if (city.includes('madrid')) {
      emoji = "🌞";
      gradientColors = "from-yellow-400 via-orange-500 to-yellow-600";
      accentColor = "yellow-400";
    } else if (city.includes('amsterdam')) {
      emoji = "🚲";
      gradientColors = "from-orange-400 via-red-500 to-orange-600";
      accentColor = "orange-400";
    } else if (city.includes('copenhague') || city.includes('copenhagen')) {
      emoji = "🏠";
      gradientColors = "from-red-400 via-pink-500 to-red-600";
      accentColor = "red-400";
    }
    
    return { emoji, gradientColors, accentColor };
  };

  const { emoji, gradientColors, accentColor } = getProjectSpecificContent();

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Dynamic gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors}`}></div>
      
      {/* Main project emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-8xl opacity-90">{emoji}</div>
      </div>
      
      {/* Decorative elements - positioned based on project ID for uniqueness */}
      <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full opacity-60"></div>
      <div className="absolute top-8 right-6 w-4 h-4 bg-white rounded-full opacity-40"></div>
      <div className="absolute bottom-6 left-8 w-6 h-6 border border-white rounded-full opacity-50"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-white rounded-full opacity-30"></div>
      
      {/* Additional unique elements based on project ID */}
      {project.id.includes('env-1') && (
        <>
          <div className="absolute top-12 left-12 w-2 h-2 bg-white rounded-full opacity-50"></div>
          <div className="absolute bottom-12 right-12 w-4 h-4 border border-white rounded-full opacity-40"></div>
        </>
      )}
      {project.id.includes('env-2') && (
        <>
          <div className="absolute top-16 left-16 w-3 h-3 bg-white rounded-full opacity-60"></div>
          <div className="absolute bottom-16 right-16 w-2 h-2 border border-white rounded-full opacity-50"></div>
        </>
      )}
      {project.id.includes('env-3') && (
        <>
          <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full opacity-40"></div>
          <div className="absolute bottom-20 right-20 w-3 h-3 border border-white rounded-full opacity-60"></div>
        </>
      )}
      
      {/* Project title overlay */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="bg-black/30 backdrop-blur-sm rounded px-2 py-1">
          <div className="text-white text-xs font-medium truncate">
            {project.title?.en || project.title?.es || project.title?.de || 'Project'}
          </div>
        </div>
      </div>
    </div>
  );
}