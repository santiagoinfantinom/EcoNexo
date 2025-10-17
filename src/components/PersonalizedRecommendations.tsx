"use client";
import React, { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  interests: string[];
  pastEvents: string[];
  preferences: {
    maxDistance: number;
    preferredCategories: string[];
    preferredTimes: string[];
    difficulty: string[];
    accessibility: boolean;
  };
  impactScore: number;
  joinDate: string;
}

interface Event {
  id: string;
  title: string;
  title_en?: string;
  title_de?: string;
  description: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  website?: string;
  category: string;
  date: string;
  time: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  organizer: string;
  maxVolunteers: number;
  currentVolunteers: number;
  difficulty: 'easy' | 'medium' | 'hard';
  accessibility: boolean;
  cost: number;
  tags: string[];
  impact: 'low' | 'medium' | 'high';
}

interface PersonalizedRecommendationsProps {
  userId: string;
  events: Event[];
  onEventClick?: (event: Event) => void;
}

export default function PersonalizedRecommendations({ 
  userId, 
  events, 
  onEventClick 
}: PersonalizedRecommendationsProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendationReason, setRecommendationReason] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  useEffect(() => {
    if (userProfile && events.length > 0) {
      generateRecommendations();
    }
  }, [userProfile, events]);

  const loadUserProfile = async () => {
    // In a real app, this would fetch from API
    const mockProfile: UserProfile = {
      id: userId,
      name: "Usuario EcoNexo",
      location: {
        lat: 40.4168,
        lng: -3.7038,
        city: "Madrid",
        country: "España"
      },
      interests: ["environment", "education", "community"],
      pastEvents: ["e1", "e2", "e5"],
      preferences: {
        maxDistance: 25,
        preferredCategories: ["environment", "education"],
        preferredTimes: ["morning", "afternoon"],
        difficulty: ["easy", "medium"],
        accessibility: true
      },
      impactScore: 85,
      joinDate: "2024-01-15"
    };
    
    setUserProfile(mockProfile);
    setLoading(false);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getTimeOfDay = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const calculateRecommendationScore = (event: Event, profile: UserProfile): number => {
    let score = 0;
    const reasons: string[] = [];

    // Distance factor (closer = higher score)
    const distance = calculateDistance(
      profile.location.lat, 
      profile.location.lng, 
      event.location.lat, 
      event.location.lng
    );
    
    if (distance <= profile.preferences.maxDistance) {
      score += 30;
      reasons.push(`A solo ${distance.toFixed(1)} km de ti`);
    } else {
      score -= 20;
    }

    // Category preference
    if (profile.preferences.preferredCategories.includes(event.category)) {
      score += 25;
      reasons.push(`Coincide con tu interés en ${event.category}`);
    }

    // Time preference
    const eventTimeOfDay = getTimeOfDay(event.time);
    if (profile.preferences.preferredTimes.includes(eventTimeOfDay)) {
      score += 15;
      reasons.push(`En tu horario preferido (${eventTimeOfDay})`);
    }

    // Difficulty preference
    if (profile.preferences.difficulty.includes(event.difficulty)) {
      score += 10;
      reasons.push(`Nivel de dificultad adecuado`);
    }

    // Accessibility
    if (profile.preferences.accessibility && event.accessibility) {
      score += 10;
      reasons.push(`Evento accesible`);
    }

    // Cost preference (free events get bonus)
    if (event.cost === 0) {
      score += 15;
      reasons.push(`Evento gratuito`);
    }

    // Impact level (higher impact = higher score for engaged users)
    if (profile.impactScore > 70) {
      if (event.impact === 'high') {
        score += 20;
        reasons.push(`Alto impacto ambiental`);
      } else if (event.impact === 'medium') {
        score += 10;
      }
    }

    // Availability (events with spots get bonus)
    const spotsLeft = event.maxVolunteers - event.currentVolunteers;
    if (spotsLeft > 0) {
      score += 5;
      reasons.push(`${spotsLeft} plazas disponibles`);
    }

    // Past event similarity
    const hasSimilarPastEvent = profile.pastEvents.some(pastEventId => {
      // In real app, would check event similarity
      return Math.random() > 0.7; // Mock similarity
    });
    
    if (hasSimilarPastEvent) {
      score += 15;
      reasons.push(`Similar a eventos que te gustaron`);
    }

    // New organizer bonus (encourage exploration)
    const isNewOrganizer = !profile.pastEvents.includes(event.id);
    if (isNewOrganizer) {
      score += 5;
      reasons.push(`Nuevo organizador para explorar`);
    }

    return Math.max(0, Math.min(100, score));
  };

  const generateRecommendations = () => {
    if (!userProfile) return;

    const scoredEvents = events.map(event => ({
      event,
      score: calculateRecommendationScore(event, userProfile),
      reasons: []
    }));

    // Calculate reasons for each event
    scoredEvents.forEach(item => {
      const reasons: string[] = [];
      
      // Distance
      const distance = calculateDistance(
        userProfile.location.lat, 
        userProfile.location.lng, 
        item.event.location.lat, 
        item.event.location.lng
      );
      
      if (distance <= userProfile.preferences.maxDistance) {
        reasons.push(`A solo ${distance.toFixed(1)} km de ti`);
      }

      // Category
      if (userProfile.preferences.preferredCategories.includes(item.event.category)) {
        reasons.push(`Coincide con tu interés en ${item.event.category}`);
      }

      // Time
      const eventTimeOfDay = getTimeOfDay(item.event.time);
      if (userProfile.preferences.preferredTimes.includes(eventTimeOfDay)) {
        reasons.push(`En tu horario preferido`);
      }

      // Other factors
      if (item.event.cost === 0) {
        reasons.push(`Evento gratuito`);
      }

      if (item.event.impact === 'high') {
        reasons.push(`Alto impacto ambiental`);
      }

      const spotsLeft = item.event.maxVolunteers - item.event.currentVolunteers;
      if (spotsLeft > 0) {
        reasons.push(`${spotsLeft} plazas disponibles`);
      }

      item.reasons = reasons;
    });

    // Sort by score and take top 6
    const topRecommendations = scoredEvents
      .filter(item => item.score > 30) // Only show events with decent scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.event);

    // Store reasons for display
    const reasonMap: Record<string, string> = {};
    scoredEvents.forEach(item => {
      if (topRecommendations.some(rec => rec.id === item.event.id)) {
        reasonMap[item.event.id] = item.reasons.join(' • ');
      }
    });

    setRecommendations(topRecommendations);
    setRecommendationReason(reasonMap);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Muy bueno';
    if (score >= 40) return 'Bueno';
    return 'Regular';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Recomendaciones para ti
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Basado en tus preferencias y ubicación
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-slate-500 dark:text-slate-400 mb-2">
            No hay eventos que coincidan con tus preferencias en este momento
          </div>
          <div className="text-sm text-slate-400 dark:text-slate-500">
            Intenta ajustar tus filtros o expandir el rango de distancia
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((event) => (
            <div
              key={event.id}
              className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-start justify-between mb-2 gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    {event.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(85)}`}>
                    {getScoreLabel(85)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {85}% match
                  </span>
                </div>
              </div>

              {/* Optional website/image preview */}
              {(() => {
                const websitePreview = event.website ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(event.website)}?w=640` : undefined;
                const headerImageSrc = event.image_url || websitePreview;
                return headerImageSrc ? (
                  <div className="w-full h-36 overflow-hidden rounded-md border border-gray-200 mb-3">
                    <img
                      src={headerImageSrc}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      decoding="async"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : null;
              })()}

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {event.description.substring(0, 120)}...
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span>⏰ {event.time}</span>
                <span>📍 {event.location.address}</span>
                <span>👥 {event.currentVolunteers}/{event.maxVolunteers}</span>
              </div>

              <div className="text-xs text-green-600 dark:text-green-400">
                {recommendationReason[event.id]}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.category === 'environment' ? 'bg-green-100 text-green-800' :
                  event.category === 'education' ? 'bg-blue-100 text-blue-800' :
                  event.category === 'community' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  event.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.difficulty}
                </span>
                {event.accessibility && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ♿ Accesible
                  </span>
                )}
                {event.cost === 0 && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🆓 Gratis
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
          💡 Cómo funcionan las recomendaciones
        </h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• Ubicación: Priorizamos eventos cerca de ti</li>
          <li>• Intereses: Basado en tus categorías favoritas</li>
          <li>• Horarios: Consideramos tus momentos preferidos</li>
          <li>• Historial: Aprendemos de eventos anteriores</li>
          <li>• Disponibilidad: Solo eventos con plazas libres</li>
        </ul>
      </div>
    </div>
  );
}
