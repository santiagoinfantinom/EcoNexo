"use client";
import React, { useState } from 'react';
import SustainableRoutes from './SustainableRoutes';
import AdvancedFilters, { FilterOptions } from './AdvancedFilters';
import IntelligentClustering from './IntelligentClustering';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import ImpactAnalysis from './ImpactAnalysis';
import SocialMediaDetection from './SocialMediaDetection';

interface Event {
  id: string;
  title: string;
  title_en?: string;
  title_de?: string;
  description: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  lat: number;
  lng: number;
  category: string;
  date: string;
  maxVolunteers: number;
  currentVolunteers: number;
  impact: 'low' | 'medium' | 'high';
  time: string;
  duration: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  organizer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  accessibility: boolean;
  cost: number;
  tags: string[];
}

interface EcoNexoAdvancedProps {
  events: Event[];
  userId?: string;
  onEventClick?: (event: Event) => void;
}

export default function EcoNexoAdvanced({ 
  events, 
  userId = 'user123',
  onEventClick 
}: EcoNexoAdvancedProps) {
  const getDefaultDateRange = () => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const [activeFeature, setActiveFeature] = useState<string>('recommendations');
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: getDefaultDateRange(),
    distance: 50,
    impactType: [],
    difficulty: [],
    category: [],
    accessibility: false,
    freeOnly: false,
    maxCost: 100,
    organizer: [],
    language: []
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);

  const features = [
    { id: 'recommendations', name: 'Recomendaciones', icon: '🎯', description: 'Eventos personalizados para ti' },
    { id: 'filters', name: 'Filtros Avanzados', icon: '🔍', description: 'Busca eventos específicos' },
    { id: 'routes', name: 'Rutas Sostenibles', icon: '🛤️', description: 'Planifica rutas ecológicas' },
    { id: 'clustering', name: 'Clustering Inteligente', icon: '🗺️', description: 'Agrupa eventos cercanos' },
    { id: 'impact', name: 'Análisis de Impacto', icon: '📊', description: 'Calcula el impacto ambiental' },
    { id: 'social', name: 'Detección Social', icon: '📱', description: 'Proyectos desde redes sociales' }
  ];

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };

  const handleRouteCalculation = (start: [number, number], end: [number, number]) => {
    setRouteStart(start);
    setRouteEnd(end);
    setActiveFeature('routes');
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'recommendations':
        return (
          <PersonalizedRecommendations
            userId={userId}
            events={events as any}
            onEventClick={handleEventSelect as any}
          />
        );
      
      case 'filters':
        return (
          <AdvancedFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
        );
      
      case 'routes':
        return routeStart && routeEnd ? (
          <SustainableRoutes
            startLocation={routeStart}
            endLocation={routeEnd}
            onRouteSelect={(route) => {
              console.log('Selected route:', route);
            }}
          />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Rutas Sostenibles
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Selecciona un evento para calcular rutas sostenibles hacia él.
            </p>
          </div>
        );
      
      case 'clustering':
        return (
          <div className="h-96">
            <IntelligentClustering
              events={events as any}
              onClusterClick={(cluster) => {
                console.log('Cluster clicked:', cluster);
              }}
              onEventClick={handleEventSelect as any}
            />
          </div>
        );
      
      case 'impact':
        return selectedEvent ? (
          <ImpactAnalysis
            event={selectedEvent as any}
            onAnalysisComplete={(metrics) => {
              console.log('Impact analysis:', metrics);
            }}
          />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Análisis de Impacto
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Selecciona un evento para analizar su impacto ambiental.
            </p>
          </div>
        );
      
      
      case 'social':
        return (
          <SocialMediaDetection
            onProjectDetected={(project) => {
              console.log('Project detected:', project.title);
            }}
            onProjectApproved={(project) => {
              console.log('Project approved:', project.title);
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-modern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            EcoNexo Avanzado
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Funcionalidades avanzadas para una experiencia sostenible completa
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`p-4 rounded-lg text-center transition-all ${
                  activeFeature === feature.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-slate-600'
                }`}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="text-sm font-medium">{feature.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Feature Display */}
        <div className="mb-8">
          {renderActiveFeature()}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              🚀 Acciones Rápidas
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveFeature('recommendations')}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Ver mis recomendaciones
              </button>
              <button
                onClick={() => setActiveFeature('social')}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Detectar proyectos nuevos
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              📊 Estadísticas
            </h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Eventos disponibles:</span>
                <span className="font-medium">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Filtros activos:</span>
                <span className="font-medium">
                  {Object.values(filters).filter(v => 
                    Array.isArray(v) ? v.length > 0 : typeof v === 'boolean' ? v : false
                  ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Evento seleccionado:</span>
                <span className="font-medium">
                  {selectedEvent ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              🔧 Herramientas
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (selectedEvent) {
                    handleRouteCalculation(
                      [40.4168, -3.7038], // Madrid coordinates
                      [selectedEvent.location.lat, selectedEvent.location.lng]
                    );
                  }
                }}
                disabled={!selectedEvent}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calcular ruta al evento
              </button>
              <button
                onClick={() => setActiveFeature('impact')}
                disabled={!selectedEvent}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analizar impacto
              </button>
              <button
                onClick={() => setActiveFeature('clustering')}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Ver clustering de eventos
              </button>
            </div>
          </div>
        </div>

        {/* Selected Event Info */}
        {selectedEvent && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              📍 Evento Seleccionado
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {selectedEvent.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {selectedEvent.description.substring(0, 100)}...
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>📅 {new Date(selectedEvent.date).toLocaleDateString()}</span>
                  <span>👥 {selectedEvent.currentVolunteers}/{selectedEvent.maxVolunteers}</span>
                  <span>🎯 {selectedEvent.impact}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-3 py-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
              >
                Deseleccionar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
