"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { useSmartContext } from "@/context/SmartContext";
import { PROJECTS } from "@/data/projects";
import { generateMissions, EcoMission, DIFFICULTY_LABELS } from "@/data/eco-missions";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Zap, Star, Navigation, RefreshCw, CheckCircle2, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";

export default function MisionesPage() {
  const { locale } = useI18n();
  const { addPoints } = useSmartContext();

  const [missions, setMissions] = useState<EcoMission[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load completed missions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('econexo_completed_missions');
    if (saved) {
      setCompletedIds(new Set(JSON.parse(saved)));
    }
  }, []);

  // Request geolocation
  const requestLocation = useCallback(() => {
    setLocationStatus('requesting');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus('granted');
        },
        () => {
          setLocationStatus('denied');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationStatus('denied');
    }
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Generate missions when location changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const generated = generateMissions(
        PROJECTS,
        userLocation?.lat,
        userLocation?.lng,
        12
      );
      setMissions(generated);
      setIsLoading(false);
    }, 600); // Small delay for UX feel
    return () => clearTimeout(timer);
  }, [userLocation]);

  const refreshMissions = () => {
    setIsLoading(true);
    setTimeout(() => {
      const generated = generateMissions(
        PROJECTS,
        userLocation?.lat,
        userLocation?.lng,
        12
      );
      setMissions(generated);
      setIsLoading(false);
    }, 500);
  };

  const completeMission = (mission: EcoMission) => {
    if (completedIds.has(mission.id)) return;

    setCelebratingId(mission.id);
    
    // Award points
    addPoints(mission.xpReward, `Misión: ${mission.title}`, mission.karmaReward);
    
    // Mark as completed
    const newCompleted = new Set(completedIds);
    newCompleted.add(mission.id);
    setCompletedIds(newCompleted);
    localStorage.setItem('econexo_completed_missions', JSON.stringify([...newCompleted]));

    // Clear celebration after animation
    setTimeout(() => setCelebratingId(null), 2000);
  };

  const getLocalizedTitle = (m: EcoMission) => 
    locale === 'en' ? m.title_en : locale === 'de' ? m.title_de : m.title;
  
  const getLocalizedDesc = (m: EcoMission) =>
    locale === 'en' ? m.description_en : locale === 'de' ? m.description_de : m.description;

  const getDiffLabel = (d: EcoMission['difficulty']) => {
    const l = DIFFICULTY_LABELS[d];
    return locale === 'en' ? l.en : locale === 'de' ? l.de : l.es;
  };

  const completedCount = missions.filter(m => completedIds.has(m.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-green-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-green-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-6xl">🎯</div>
          <div className="absolute top-12 right-12 text-4xl">🌍</div>
          <div className="absolute bottom-6 left-1/3 text-5xl">⚡</div>
        </div>
        <div className="relative px-6 pt-20 pb-8 md:pt-24">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              {locale === 'es' ? '🎯 Eco-Misiones' : locale === 'de' ? '🎯 Öko-Missionen' : '🎯 Eco-Missions'}
            </h1>
            <p className="text-green-100 text-sm md:text-base font-medium">
              {locale === 'es' 
                ? 'Acciones rápidas de impacto real cerca de ti' 
                : locale === 'de' 
                  ? 'Schnelle Aktionen mit echtem Impact in deiner Nähe'
                  : 'Quick real-impact actions near you'}
            </p>

            {/* Location Status */}
            <div className="mt-4 flex items-center gap-2">
              {locationStatus === 'granted' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Navigation className="w-3 h-3" />
                  {locale === 'es' ? 'Ubicación activa' : locale === 'de' ? 'Standort aktiv' : 'Location active'}
                </span>
              ) : locationStatus === 'denied' ? (
                <button 
                  onClick={requestLocation}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/30 transition"
                >
                  <MapPin className="w-3 h-3" />
                  {locale === 'es' ? 'Activar ubicación' : 'Enable location'}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm animate-pulse">
                  <Navigation className="w-3 h-3" />
                  {locale === 'es' ? 'Buscando...' : 'Locating...'}
                </span>
              )}
            </div>

            {/* Stats Bar */}
            <div className="mt-5 flex items-center gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-bold text-sm">{completedCount}/{missions.length}</span>
              </div>
              <button 
                onClick={refreshMissions}
                className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/25 transition"
              >
                <RefreshCw className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">
                  {locale === 'es' ? 'Nuevas misiones' : locale === 'de' ? 'Neue Missionen' : 'New missions'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {missions.map((mission, index) => {
              const isCompleted = completedIds.has(mission.id);
              const isCelebrating = celebratingId === mission.id;
              const diffInfo = DIFFICULTY_LABELS[mission.difficulty];

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border overflow-hidden transition-all ${
                    isCompleted 
                      ? 'border-green-300 dark:border-green-700 opacity-70' 
                      : 'border-gray-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {/* Celebration overlay */}
                  {isCelebrating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-green-500/90 z-10 flex flex-col items-center justify-center gap-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                        transition={{ type: "spring" }}
                      >
                        <Sparkles className="w-12 h-12 text-yellow-300" />
                      </motion.div>
                      <span className="text-white font-black text-lg">+{mission.xpReward} XP</span>
                      <span className="text-green-100 text-sm font-medium">+{mission.karmaReward} Karma</span>
                    </motion.div>
                  )}

                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                        isCompleted 
                          ? 'bg-green-100 dark:bg-green-900/50' 
                          : 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-7 h-7 text-green-500" /> : mission.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm leading-tight mb-1 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          {getLocalizedTitle(mission)}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                          {getLocalizedDesc(mission)}
                        </p>

                        {/* Meta badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${diffInfo.color}`}>
                            {getDiffLabel(mission.difficulty)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                            <Clock className="w-2.5 h-2.5" /> {mission.estimatedMinutes} min
                          </span>
                          {mission.distanceKm !== undefined && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                              <MapPin className="w-2.5 h-2.5" /> 
                              {mission.distanceKm < 1 
                                ? `${Math.round(mission.distanceKm * 1000)}m` 
                                : `${mission.distanceKm} km`}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                            <Zap className="w-2.5 h-2.5" /> {mission.xpReward} XP
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                            <Star className="w-2.5 h-2.5" /> {mission.karmaReward} Karma
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action area */}
                    <div className="mt-4 flex items-center justify-between">
                      <Link 
                        href={`/projects/${mission.linkedProjectId}`}
                        className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline"
                      >
                        📍 {mission.city}
                      </Link>

                      {!isCompleted ? (
                        <motion.button
                          whileTap={{ scale: 0.93 }}
                          onClick={() => completeMission(mission)}
                          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-gray-900/10 active:shadow-sm transition-all"
                        >
                          {locale === 'es' ? '✅ Completar' : locale === 'de' ? '✅ Abschließen' : '✅ Complete'}
                        </motion.button>
                      ) : (
                        <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {locale === 'es' ? 'Completada' : locale === 'de' ? 'Abgeschlossen' : 'Completed'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Empty state */}
        {!isLoading && missions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
              {locale === 'es' ? 'No hay misiones disponibles' : 'No missions available'}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {locale === 'es' ? 'Activa tu ubicación para encontrar misiones cercanas' : 'Enable your location to find nearby missions'}
            </p>
          </div>
        )}

        {/* Bottom spacer for mobile nav */}
        <div className="h-8" />
      </div>
    </div>
  );
}
