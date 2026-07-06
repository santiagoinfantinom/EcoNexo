"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { useSmartContext } from "@/context/SmartContext";
import { PROJECTS } from "@/data/projects";
import { generateMissions, EcoMission, DIFFICULTY_LABELS } from "@/data/eco-missions";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Zap, Star, Navigation, RefreshCw, CheckCircle2, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { Capacitor } from "@capacitor/core";
import { Geolocation as CapacitorGeolocation } from "@capacitor/geolocation";

const LAST_LOCATION_KEY = "econexo_last_location";
const LOCATION_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MISSION_RADIUS_KEY = "econexo_mission_radius_km";

export default function MisionesPage() {
  const { locale } = useI18n();
  const { addPoints } = useSmartContext();
  const minuteLabel = locale === "es" ? "min" : locale === "de" ? "Min." : "min";
  const meterLabel = locale === "es" ? "m" : locale === "de" ? "m" : "m";
  const kilometerLabel = locale === "es" ? "km" : locale === "de" ? "km" : "km";
  const xpLabel = locale === "es" ? "XP" : locale === "de" ? "EP" : "XP";
  const karmaLabel = locale === "es" ? "Karma" : locale === "de" ? "Karma" : "Karma";
  const xpMeaning =
    locale === "es"
      ? "Puntos de experiencia para subir de nivel."
      : locale === "de"
        ? "Erfahrungspunkte zum Aufsteigen."
        : "Experience points to level up.";
  const karmaMeaning =
    locale === "es"
      ? "Tu reputación por impacto positivo se refleja en el perfil."
      : locale === "de"
        ? "Deine Impact-Reputation wird im Profil angezeigt."
        : "Your positive impact reputation is shown in your profile.";
  const difficultyMeaning =
    locale === "es"
      ? "Fácil: rápida · Mediana: requiere algo más de tiempo · Difícil: más esfuerzo o coordinación."
      : locale === "de"
        ? "Leicht: schnell · Mittel: braucht etwas mehr Zeit · Schwer: mehr Aufwand oder Koordination."
        : "Easy: quick · Medium: needs a bit more time · Hard: more effort or coordination.";

  const [missions, setMissions] = useState<EcoMission[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [locationError, setLocationError] = useState<"permission" | "unavailable" | "timeout" | "insecure" | "unsupported" | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const hasFreshCachedLocationRef = useRef(false);
  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  const persistLocation = useCallback((lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    setLocationStatus("granted");
    setLocationError(null);
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({ lat, lng, savedAt: Date.now() }));
  }, []);

  // Load completed missions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('econexo_completed_missions');
    if (saved) {
      setCompletedIds(new Set(JSON.parse(saved)));
    }

    const savedLocation = localStorage.getItem(LAST_LOCATION_KEY);
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation) as { lat: number; lng: number; savedAt?: number };
        const isFresh = typeof parsed.savedAt === "number" && (Date.now() - parsed.savedAt) <= LOCATION_CACHE_TTL_MS;
        if (typeof parsed.lat === "number" && typeof parsed.lng === "number" && isFresh) {
          hasFreshCachedLocationRef.current = true;
          setUserLocation({ lat: parsed.lat, lng: parsed.lng });
          setLocationStatus("granted");
        } else {
          localStorage.removeItem(LAST_LOCATION_KEY);
        }
      } catch {
        // Ignore corrupted cache
        localStorage.removeItem(LAST_LOCATION_KEY);
      }
    }

    const savedRadius = localStorage.getItem(MISSION_RADIUS_KEY);
    if (savedRadius) {
      const parsedRadius = Number(savedRadius);
      if ([5, 10, 25].includes(parsedRadius)) {
        setRadiusKm(parsedRadius);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MISSION_RADIUS_KEY, String(radiusKm));
  }, [radiusKm]);

  // Request geolocation with a hard timeout safeguard so UI never stays stuck in "requesting".
  const getCurrentPosition = useCallback((options: PositionOptions, hardTimeoutMs = 10000) => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      let didFinish = false;
      const hardTimeout = window.setTimeout(() => {
        if (didFinish) return;
        didFinish = true;
        reject(new Error("hard-timeout"));
      }, hardTimeoutMs);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (didFinish) return;
          didFinish = true;
          window.clearTimeout(hardTimeout);
          resolve(pos);
        },
        (err) => {
          if (didFinish) return;
          didFinish = true;
          window.clearTimeout(hardTimeout);
          reject(err);
        },
        options
      );
    });
  }, []);

  const requestLocation = useCallback(async (opts?: { forceFresh?: boolean }): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    const forceFresh = Boolean(opts?.forceFresh);
    const keepGrantedOnFailure = Boolean(userLocationRef.current);
    setLocationStatus('requesting');
    setLocationError(null);

    if (Capacitor.isNativePlatform()) {
      try {
        const permission = await CapacitorGeolocation.requestPermissions();
        if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
          setLocationStatus(keepGrantedOnFailure ? "granted" : "denied");
          setLocationError("permission");
          return false;
        }
        const nativePos = await CapacitorGeolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: forceFresh ? 0 : 60000,
        });
        persistLocation(nativePos.coords.latitude, nativePos.coords.longitude);
        return true;
      } catch {
        setLocationStatus(keepGrantedOnFailure ? "granted" : "denied");
        setLocationError("unavailable");
        return false;
      }
    }

    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!window.isSecureContext && !isLocalhost) {
      setLocationStatus("denied");
      setLocationError("insecure");
      return false;
    }

    if (!("geolocation" in navigator)) {
      setLocationStatus('denied');
      setLocationError("unsupported");
      return false;
    }

    if ("permissions" in navigator && typeof navigator.permissions.query === "function") {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "denied") {
          setLocationStatus(keepGrantedOnFailure ? "granted" : "denied");
          setLocationError("permission");
          return false;
        }
      } catch {
        // Ignore permissions API errors and continue with geolocation request.
      }
    }

    try {
      const pos = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: forceFresh ? 0 : 60000,
      }, 8000);
      persistLocation(pos.coords.latitude, pos.coords.longitude);
      return true;
    } catch {
      // Retry with less strict settings; some devices/browsers fail high-accuracy requests.
    }

    try {
      const fallbackPos = await getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: forceFresh ? 0 : 300000,
      }, 9000);
      persistLocation(fallbackPos.coords.latitude, fallbackPos.coords.longitude);
      return true;
    } catch (err) {
      const geolocationError = err as GeolocationPositionError;
      setLocationStatus(keepGrantedOnFailure ? "granted" : "denied");
      if (geolocationError?.code === 1) setLocationError("permission");
      else if (geolocationError?.code === 2) setLocationError("unavailable");
      else if (geolocationError?.code === 3) setLocationError("timeout");
      else setLocationError("unavailable");
      return false;
    }
  }, [getCurrentPosition, persistLocation]);

  // Auto-request location on mount
  useEffect(() => {
    if (hasFreshCachedLocationRef.current) return;
    requestLocation();
  }, [requestLocation]);

  // Generate missions when location changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!userLocation) {
        setMissions([]);
        setIsLoading(false);
        return;
      }
      const generated = generateMissions(
        PROJECTS,
        userLocation?.lat,
        userLocation?.lng,
        12
      );
      const nearbyMissions = generated.filter((mission) => mission.distanceKm === undefined || mission.distanceKm <= radiusKm);
      setMissions(nearbyMissions);
      setIsLoading(false);
    }, 600); // Small delay for UX feel
    return () => clearTimeout(timer);
  }, [radiusKm, userLocation]);

  const refreshMissions = () => {
    if (!userLocation) {
      requestLocation();
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const generated = generateMissions(
        PROJECTS,
        userLocation?.lat,
        userLocation?.lng,
        12
      );
      const nearbyMissions = generated.filter((mission) => mission.distanceKm === undefined || mission.distanceKm <= radiusKm);
      setMissions(nearbyMissions);
      setIsLoading(false);
    }, 500);
  };

  const locateAndRefresh = async () => {
    const located = await requestLocation({ forceFresh: true });
    if (!located) return;
    refreshMissions();
  };

  const completeMission = (mission: EcoMission) => {
    if (completedIds.has(mission.id)) return;

    setCelebratingId(mission.id);
    
    // Award points
    const localizedTitle = locale === "en"
      ? (mission.title_en || mission.title)
      : locale === "de"
        ? (mission.title_de || mission.title_en || mission.title)
        : mission.title;
    addPoints(mission.xpReward, `Mission: ${localizedTitle}`, mission.karmaReward);
    
    // Mark as completed
    const newCompleted = new Set(completedIds);
    newCompleted.add(mission.id);
    setCompletedIds(newCompleted);
    localStorage.setItem('econexo_completed_missions', JSON.stringify([...newCompleted]));

    // Clear celebration after animation
    setTimeout(() => setCelebratingId(null), 2000);
  };

  const getLocalizedTitle = (m: EcoMission) => 
    locale === 'en'
      ? (m.title_en || m.title || m.title_de)
      : locale === 'de'
        ? (m.title_de || m.title_en || m.title)
        : (m.title || m.title_en || m.title_de);
  
  const getLocalizedDesc = (m: EcoMission) =>
    locale === 'en'
      ? (m.description_en || m.description || m.description_de)
      : locale === 'de'
        ? (m.description_de || m.description_en || m.description)
        : (m.description || m.description_en || m.description_de);

  const getDiffLabel = (d: EcoMission['difficulty']) => {
    const l = DIFFICULTY_LABELS[d];
    return locale === 'en' ? l.en : locale === 'de' ? l.de : l.es;
  };

  const completedCount = missions.filter(m => completedIds.has(m.id)).length;
  const locationErrorText =
    locationError === "permission"
      ? (locale === "es" ? "Permiso de ubicación bloqueado. Actívalo en tu navegador." : locale === "de" ? "Standortberechtigung blockiert. Bitte im Browser aktivieren." : "Location permission is blocked. Enable it in your browser.")
      : locationError === "timeout"
        ? (locale === "es" ? "No pudimos obtener tu ubicación a tiempo. Reintenta." : locale === "de" ? "Standort konnte nicht rechtzeitig ermittelt werden. Bitte erneut versuchen." : "We couldn't get your location in time. Please try again.")
        : locationError === "insecure"
          ? (locale === "es" ? "La geolocalización requiere HTTPS (o localhost)." : locale === "de" ? "Geolokalisierung benötigt HTTPS (oder localhost)." : "Geolocation requires HTTPS (or localhost).")
          : locationError === "unsupported"
            ? (locale === "es" ? "Este navegador no soporta geolocalización." : locale === "de" ? "Dieser Browser unterstützt keine Geolokalisierung." : "This browser does not support geolocation.")
            : locationError === "unavailable"
              ? (locale === "es" ? "Ubicación no disponible en este momento." : locale === "de" ? "Standort ist derzeit nicht verfügbar." : "Location is currently unavailable.")
              : null;

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
                  onClick={locateAndRefresh}
                  disabled={locationStatus === "requesting"}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/30 transition"
                >
                  <MapPin className="w-3 h-3" />
                  {locale === 'es' ? 'Activar ubicación' : locale === 'de' ? 'Standort aktivieren' : 'Enable location'}
                </button>
              ) : (
                <button
                  onClick={locateAndRefresh}
                  disabled={locationStatus === "requesting"}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/30 transition disabled:opacity-60"
                >
                  <MapPin className="w-3 h-3" />
                  {locationStatus === "requesting"
                    ? (locale === 'es' ? 'Buscando...' : locale === 'de' ? 'Suche...' : 'Locating...')
                    : (locale === 'es' ? 'Ubicarme ahora' : locale === 'de' ? 'Jetzt orten' : 'Locate me now')}
                </button>
              )}
            </div>
            {userLocation && (
              <p className="mt-2 text-xs text-white/85">
                {locale === "es"
                  ? `Usando tu ubicación: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                  : locale === "de"
                    ? `Dein Standort: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                    : `Using your location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
              </p>
            )}
            {locationErrorText && (
              <p className="mt-2 text-xs text-red-100/95 font-medium">
                {locationErrorText}
              </p>
            )}
            {locationStatus === "requesting" && (
              <p className="mt-2 text-xs text-white/90">
                {locale === "es"
                  ? "Buscando ubicación actual (alta precisión y respaldo)..."
                  : locale === "de"
                    ? "Aktueller Standort wird gesucht (hohe Genauigkeit + Fallback)..."
                    : "Finding your current location (high accuracy + fallback)..."}
              </p>
            )}

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

            <div className="mt-3 flex items-center gap-2">
              {[5, 10, 25].map((option) => (
                <button
                  key={option}
                  onClick={() => setRadiusKm(option)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    radiusKm === option
                      ? "bg-white text-green-700"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {option} km
                </button>
              ))}
            </div>

            {/* Rewards and difficulty legend */}
            <div className="mt-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 p-3 space-y-1.5">
              <p className="text-[11px] md:text-xs text-green-50">
                {xpLabel}: {xpMeaning}
              </p>
              <p className="text-[11px] md:text-xs text-green-50">
                {karmaLabel}: {karmaMeaning}
              </p>
              <p className="text-[11px] md:text-xs text-green-50">
                {locale === "es" ? "Dificultad" : locale === "de" ? "Schwierigkeit" : "Difficulty"}: {difficultyMeaning}
              </p>
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
                        transition={{
                          scale: { type: "spring", stiffness: 380, damping: 14, mass: 0.7 },
                          rotate: { duration: 0.32, ease: "easeOut" },
                        }}
                      >
                        <Sparkles className="w-12 h-12 text-yellow-300" />
                      </motion.div>
                      <span className="text-white font-black text-lg">+{mission.xpReward} {xpLabel}</span>
                      <span className="text-green-100 text-sm font-medium">
                        {locale === 'es' ? 'Karma aplicado en tu perfil' : locale === 'de' ? 'Karma wird im Profil gutgeschrieben' : 'Karma is reflected in your profile'}
                      </span>
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
                            <Clock className="w-2.5 h-2.5" /> {mission.estimatedMinutes} {minuteLabel}
                          </span>
                          {mission.distanceKm !== undefined && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                              <MapPin className="w-2.5 h-2.5" /> 
                              {mission.distanceKm < 1 
                                ? `${Math.round(mission.distanceKm * 1000)}${meterLabel}` 
                                : `${mission.distanceKm} ${kilometerLabel}`}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                            <Zap className="w-2.5 h-2.5" /> {mission.xpReward} {xpLabel}
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
                      <Link
                        href="/perfil"
                        className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {locale === 'es' ? 'Tu karma total se ve en Perfil' : locale === 'de' ? 'Dein Karma siehst du im Profil' : 'See your total karma in Profile'}
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
              {locale === 'es' ? 'Activa tu ubicación para ver misiones cercanas' : locale === 'de' ? 'Aktiviere deinen Standort für Missionen in deiner Nähe' : 'Enable your location to see nearby missions'}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {locale === 'es' ? 'Toca "Ubicarme ahora" y te mostraremos acciones alrededor de ti.' : locale === 'de' ? 'Tippe auf "Jetzt orten", um Missionen in deiner Nähe zu sehen.' : 'Tap "Locate me now" and we will show missions around you.'}
            </p>
          </div>
        )}

        {/* Bottom spacer for mobile nav */}
        <div className="h-8" />
      </div>
    </div>
  );
}
