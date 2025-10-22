"use client";
import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface SocialMediaProject {
  id: string;
  title: string;
  description: string;
  source: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  author: string;
  authorHandle: string;
  authorFollowers: number;
  postDate: string;
  location?: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  category: string;
  tags: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  sustainabilityScore: number; // 0-100
  verified: boolean;
  imageUrl?: string;
  postUrl: string;
}

interface SocialMediaDetectionProps {
  onProjectDetected?: (project: SocialMediaProject) => void;
  onProjectApproved?: (project: SocialMediaProject) => void;
  autoDetection?: boolean;
}

export default function SocialMediaDetection({ 
  onProjectDetected, 
  onProjectApproved,
  autoDetection = true 
}: SocialMediaDetectionProps) {
  const { t } = useI18n();
  const [detectedProjects, setDetectedProjects] = useState<SocialMediaProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [detectionEnabled, setDetectionEnabled] = useState(autoDetection);
  const [filters, setFilters] = useState({
    minFollowers: 1000,
    minEngagement: 10,
    minSustainabilityScore: 60,
    sources: ['twitter', 'instagram', 'facebook', 'linkedin']
  });

  // Mock detected projects (in real app, this would come from API)
  const mockDetectedProjects: SocialMediaProject[] = [
    {
      id: 'sm1',
      title: 'Limpieza de playas en Barcelona',
      description: '¡Únete a nuestra limpieza de playas este sábado! Vamos a recoger plásticos y residuos para proteger nuestro mar Mediterráneo. 🌊♻️ #CleanBeach #Barcelona #Sostenibilidad',
      source: 'instagram',
      author: 'Eco Barcelona',
      authorHandle: '@ecobarcelona',
      authorFollowers: 15420,
      postDate: '2024-01-15T10:30:00Z',
      location: {
        lat: 41.3851,
        lng: 2.1734,
        city: 'Barcelona',
        country: 'España'
      },
      category: 'environment',
      tags: ['CleanBeach', 'Barcelona', 'Sostenibilidad', 'Mediterráneo'],
      engagement: {
        likes: 342,
        shares: 89,
        comments: 45
      },
      sustainabilityScore: 85,
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80',
      postUrl: 'https://instagram.com/p/example1'
    },
    {
      id: 'sm2',
      title: 'Taller de compostaje urbano',
      description: 'Aprende a hacer compost en casa con nuestros talleres gratuitos. Reducir residuos orgánicos es clave para un futuro sostenible! 🥬🌱 #Compost #UrbanFarming #ZeroWaste',
      source: 'twitter',
      author: 'Madrid Verde',
      authorHandle: '@madridverde',
      authorFollowers: 8750,
      postDate: '2024-01-14T16:45:00Z',
      location: {
        lat: 40.4168,
        lng: -3.7038,
        city: 'Madrid',
        country: 'España'
      },
      category: 'education',
      tags: ['Compost', 'UrbanFarming', 'ZeroWaste', 'Taller'],
      engagement: {
        likes: 156,
        shares: 67,
        comments: 23
      },
      sustainabilityScore: 92,
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80',
      postUrl: 'https://twitter.com/status/example2'
    },
    {
      id: 'sm3',
      title: 'socialMediaCommunityReforestationBerlin',
      description: 'Community tree planting event this Sunday! Help us plant 500 native trees in Tempelhof Park. Bring friends and family! 🌳🌍 #Reforestation #Berlin #Community',
      source: 'facebook',
      author: 'Green Berlin Initiative',
      authorHandle: 'Green Berlin Initiative',
      authorFollowers: 23400,
      postDate: '2024-01-13T14:20:00Z',
      location: {
        lat: 52.5200,
        lng: 13.4050,
        city: 'Berlín',
        country: 'Alemania'
      },
      category: 'environment',
      tags: ['Reforestation', 'Berlin', 'Community', 'Trees'],
      engagement: {
        likes: 567,
        shares: 234,
        comments: 89
      },
      sustainabilityScore: 88,
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
      postUrl: 'https://facebook.com/posts/example3'
    },
    {
      id: 'sm4',
      title: 'Mercado de productos locales',
      description: 'Farmers market with organic products every Saturday. Support local farmers and reduce your carbon footprint! 🥕🌽 #LocalFood #Organic #FarmersMarket',
      source: 'linkedin',
      author: 'Sustainable Living Network',
      authorHandle: 'Sustainable Living Network',
      authorFollowers: 12500,
      postDate: '2024-01-12T09:15:00Z',
      location: {
        lat: 48.8566,
        lng: 2.3522,
        city: 'París',
        country: 'Francia'
      },
      category: 'community',
      tags: ['LocalFood', 'Organic', 'FarmersMarket', 'Sustainable'],
      engagement: {
        likes: 89,
        shares: 45,
        comments: 12
      },
      sustainabilityScore: 75,
      verified: false,
      imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80',
      postUrl: 'https://linkedin.com/posts/example4'
    }
  ];

  useEffect(() => {
    if (detectionEnabled) {
      startDetection();
    }
  }, [detectionEnabled]);

  const startDetection = async () => {
    setLoading(true);
    try {
      // Simulate API call to social media monitoring service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Filter projects based on criteria
      const filteredProjects = mockDetectedProjects.filter(project => 
        project.authorFollowers >= filters.minFollowers &&
        (project.engagement.likes + project.engagement.shares + project.engagement.comments) >= filters.minEngagement &&
        project.sustainabilityScore >= filters.minSustainabilityScore &&
        filters.sources.includes(project.source)
      );
      
      setDetectedProjects(filteredProjects);
      
      // Notify about new detections
      filteredProjects.forEach(project => {
        onProjectDetected?.(project);
      });
    } catch (error) {
      console.error('Error detecting projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveProject = (project: SocialMediaProject) => {
    onProjectApproved?.(project);
    setDetectedProjects(prev => prev.filter(p => p.id !== project.id));
  };

  const rejectProject = (projectId: string) => {
    setDetectedProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const getSourceIcon = (source: string): string => {
    switch (source) {
      case 'twitter': return '🐦';
      case 'instagram': return '📷';
      case 'facebook': return '📘';
      case 'linkedin': return '💼';
      case 'tiktok': return '🎵';
      default: return '📱';
    }
  };

  const getSourceColor = (source: string): string => {
    switch (source) {
      case 'twitter': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'instagram': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      case 'facebook': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'linkedin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'tiktok': return 'bg-black text-white dark:bg-white dark:text-black';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getSustainabilityColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
  };

  const formatEngagement = (engagement: SocialMediaProject['engagement']): string => {
    const total = engagement.likes + engagement.shares + engagement.comments;
    return `${total.toLocaleString()} interacciones`;
  };

  const formatFollowers = (followers: number): string => {
    if (followers >= 1000000) return `${(followers / 1000000).toFixed(1)}M`;
    if (followers >= 1000) return `${(followers / 1000).toFixed(1)}K`;
    return followers.toString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Detección Automática de Proyectos
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDetectionEnabled(!detectionEnabled)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              detectionEnabled
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-slate-600 dark:text-slate-300'
            }`}
          >
            {detectionEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={startDetection}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Escaneando...' : 'Escanear'}
          </button>
        </div>
      </div>

      {/* Detection Status */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${detectionEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {detectionEnabled ? 'Detección activa' : 'Detección pausada'}
          </span>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Monitoreando redes sociales para proyectos ambientales verificados
        </div>
      </div>

      {/* Detected Projects */}
      {detectedProjects.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-slate-500 dark:text-slate-400 mb-2">
            {loading ? 'Escaneando redes sociales...' : 'No se encontraron proyectos nuevos'}
          </div>
          {loading && (
            <div className="flex items-center justify-center mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {detectedProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
              <div className="flex items-start gap-4">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={t(project.title)}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      {t(project.title)}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(project.source)}`}>
                      {getSourceIcon(project.source)} {project.source}
                    </span>
                    {project.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span>👤 {project.author} ({formatFollowers(project.authorFollowers)} seguidores)</span>
                    <span>📅 {new Date(project.postDate).toLocaleDateString()}</span>
                    <span>📍 {project.location?.city}, {project.location?.country}</span>
                    <span>💬 {formatEngagement(project.engagement)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSustainabilityColor(project.sustainabilityScore)}`}>
                      🌱 {project.sustainabilityScore}% sostenible
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {project.category}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveProject(project)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      ✓ Aprobar
                    </button>
                    <button
                      onClick={() => rejectProject(project.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      ✗ Rechazar
                    </button>
                    <a
                      href={project.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Ver post
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detection Settings */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
          ⚙️ Configuración de Detección
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">
              Seguidores mínimos: {filters.minFollowers.toLocaleString()}
            </label>
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={filters.minFollowers}
              onChange={(e) => setFilters(prev => ({ ...prev, minFollowers: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">
              Puntuación mínima: {filters.minSustainabilityScore}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minSustainabilityScore}
              onChange={(e) => setFilters(prev => ({ ...prev, minSustainabilityScore: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
