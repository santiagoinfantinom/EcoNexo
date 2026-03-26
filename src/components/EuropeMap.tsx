"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import Link from "next/link";
import { useI18n, categoryLabel, projectNameLabel, locationLabel } from "@/lib/i18n";
import "leaflet/dist/leaflet.css";
import "@/styles/map-premium.css";
import { useEffect, useRef, useState } from "react";
import MapFilters from "./MapFilters";
import MapSearch from "./MapSearch";
import MapLayers from "./MapLayers";
import ImageWithFallback from "./ImageWithFallback";

type Project = {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  info_url?: string;
  category: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  address?: string;
  participants?: number;
  spots?: number;
  startsAt?: string;
  endsAt?: string;
  isPermanent?: boolean;
};

// Fix default marker icons in Leaflet when used with bundlers
function initializeLeafletIcons() {
  if (typeof window === "undefined" || !L) return;
  try {
    const DefaultIcon = L.icon({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    (L.Marker.prototype as unknown as { options: { icon: L.Icon } }).options.icon =
      DefaultIcon;
  } catch (error) {
    console.warn('Error initializing Leaflet icons:', error);
  }
}

export const MAP_REGIONS = {
  europe: {
    center: [50.1109, 8.6821] as [number, number],
    zoom: 4,
  },
  americas: {
    center: [20.0, -80.0] as [number, number],
    zoom: 3,
  },
  northAmerica: {
    center: [39.8283, -98.5795] as [number, number],
    zoom: 4,
  },
  southAmerica: {
    center: [-15.0, -60.0] as [number, number],
    zoom: 4,
  },
  asia: {
    center: [35.0, 105.0] as [number, number],
    zoom: 3,
  },
  africa: {
    center: [0.0, 20.0] as [number, number],
    zoom: 3,
  },
} as const;

export type MapRegion = keyof typeof MAP_REGIONS;

interface InteractiveMapProps {
  projects: Project[];
  region?: MapRegion;
  center?: [number, number];
  zoom?: number;
}

export default function InteractiveMap({
  projects,
  region = 'europe',
  center,
  zoom
}: InteractiveMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const { t, locale } = useI18n();
  const [baseFilteredProjects, setBaseFilteredProjects] = useState<Project[]>(projects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [filterMode, setFilterMode] = useState<'all' | 'today' | 'permanent'>('all');
  const [heatOn, setHeatOn] = useState<boolean>(false);
  const heatLayerRef = useRef<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [frequencyFilters, setFrequencyFilters] = useState<{ once: boolean; regular: boolean; permanent: boolean }>({ once: true, regular: true, permanent: true });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Cache for icons to avoid recreation
  const iconCache = useRef<Record<string, L.DivIcon>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeLeafletIcons();
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    function onCenter(e: Event) {
      const ce = e as CustomEvent<{ lat: number; lon: number }>;
      if (!mapRef.current || !ce.detail) return;
      mapRef.current.setView([ce.detail.lat, ce.detail.lon], 13, { animate: true });
      const circle = L.circle([ce.detail.lat, ce.detail.lon], { radius: 300, color: "#16a34a" }).addTo(mapRef.current);
      setTimeout(() => circle.remove(), 2500);
    }
    window.addEventListener("econexo:center", onCenter as EventListener);
    return () => window.removeEventListener("econexo:center", onCenter as EventListener);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handle = () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    };
    const id = setTimeout(handle, 0);
    window.addEventListener("resize", handle);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", handle);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const now = new Date();
    const isToday = (p: Project) => {
      if (p.isPermanent) return false;
      if (!p.startsAt && !p.endsAt) return false;
      const start = p.startsAt ? new Date(p.startsAt) : now;
      const end = p.endsAt ? new Date(p.endsAt) : now;
      const startDay = new Date(now); startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(now); endDay.setHours(23, 59, 59, 999);
      return (start <= endDay) && (end >= startDay);
    };
    const isPermanent = (p: Project) => Boolean(p.isPermanent || (!p.startsAt && !p.endsAt));

    let next = baseFilteredProjects.filter((p) => {
      if (filterMode === 'all') return true;
      if (filterMode === 'today') return isToday(p);
      return isPermanent(p);
    });
    if (selectedCategories.length > 0) {
      next = next.filter((p) => selectedCategories.includes(p.category));
    }
    next = next.filter((p) => frequencyFilters[getFrequency(p)]);
    setFilteredProjects(next);
  }, [baseFilteredProjects, filterMode, frequencyFilters, selectedCategories]);

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return;
    if (!heatOn) {
      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      return;
    }
    let cancelled = false;
    (async () => {
      if (!(L as any).heatLayer) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://unpkg.com/leaflet.heat/dist/leaflet-heat.js';
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load heatmap lib'));
          document.head.appendChild(s);
        });
      }
      if (cancelled) return;
      const points = filteredProjects.map((p) => [p.lat, p.lng, 0.6]);
      const layer = (L as any).heatLayer(points, { radius: 22, blur: 15, maxZoom: 12, minOpacity: 0.25 });
      layer.addTo(mapRef.current!);
      heatLayerRef.current = layer;
    })();
    return () => {
      cancelled = true;
    };
  }, [heatOn, filteredProjects]);

  const mapCenter = center || MAP_REGIONS[region].center;
  const mapZoom = zoom ?? MAP_REGIONS[region].zoom;


  const handleCenterOnLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoError(locale === 'es' ? "Geolocation no disponible." : locale === 'de' ? "Geolocation nicht verfügbar." : "Geolocation not available.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        mapRef.current?.setView([lat, lon], 13, { animate: true });
        const circle = L.circle([lat, lon], { radius: 300, color: "#16a34a", fillOpacity: 0.15 }).addTo(mapRef.current!);
        setTimeout(() => circle.remove(), 2500);
        setGeoError(null);
      },
      (err) => {
        setGeoError(locale === 'es' ? "Error al obtener ubicación." : locale === 'de' ? "Standortfehler." : "Location error.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  function getFrequency(p: Project): 'once' | 'regular' | 'permanent' {
    const isPermanent = Boolean(p.isPermanent || (!p.startsAt && !p.endsAt));
    if (isPermanent) return 'permanent';
    if (p.startsAt && p.endsAt) {
      const diffMs = new Date(p.endsAt).getTime() - new Date(p.startsAt).getTime();
      if (diffMs > 7 * 24 * 60 * 60 * 1000) return 'regular';
    }
    const text = ((p as any).description || '').toString().toLowerCase();
    if (/\b(cada|semanal|weekly|every|mensual|monthly)\b/.test(text)) return 'regular';
    return 'once';
  }

  function gradientForFrequency(freq: 'once' | 'regular' | 'permanent'): string {
    if (freq === 'once') return 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)';
    if (freq === 'regular') return 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)';
    return 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)';
  }


  function createGradientIcon(freq: 'once' | 'regular' | 'permanent'): L.DivIcon {
    if (iconCache.current[freq]) return iconCache.current[freq];

    const size = 20;
    const gradient = gradientForFrequency(freq);
    const isActive = freq === 'once';
    const html = `
      <div class="relative group">
        <div style="
          width:${size}px; height:${size}px;
          border-radius:50%; background:${gradient};
          border: 2px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ${isActive ? 'animation: econexo-pulse 1.5s infinite;' : ''}
        "></div>
      </div>`;
    
    const icon = L.divIcon({
      html,
      className: "econexo-premium-pin",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });

    iconCache.current[freq] = icon;
    return icon;
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0"
        preferCanvas={true}
        whenReady={() => {
          setTimeout(() => mapRef.current?.invalidateSize(), 100);
        }}
      >
        {/** @ts-ignore */}
        <SetMapRef onReady={(m: LeafletMap) => (mapRef.current = m)} />
        <MapLayers />

        {/* Optimized Marker rendering with clustering would go here, 
            but we'll start with memoized list for performance */}
        {filteredProjects.map((p) => {
          const freq = getFrequency(p);
          const name = (locale === 'en' && p.name_en) ? p.name_en : (locale === 'de' && p.name_de) ? p.name_de : projectNameLabel(p.id, p.name, locale as any);
          
          return (
            <Marker 
              key={`${p.id}-${locale}`} 
              position={[p.lat, p.lng]} 
              icon={createGradientIcon(freq)}
              // Use preferCanvas if possible at MapContainer level, 
              // but markers themselves can have simplified events
            >
              <Popup closeButton={false} className="premium-map-popup" keepInView={false}>
                <div className="project-popup-card">
                  {p.image_url ? (
                    <div className="relative">
                      <ImageWithFallback
                        src={p.image_url}
                        alt={p.name}
                        category={p.category}
                        width={300}
                        height={160}
                        className="project-popup-image"
                        loading="lazy"
                      />
                      <div 
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm z-10" 
                        style={{ background: gradientForFrequency(freq) }}
                      >
                        {t(freq)}
                      </div>
                    </div>
                  ) : (
                    <div className="h-4 w-full" style={{ background: gradientForFrequency(freq) }}></div>
                  )}
                  
                  <div className="project-popup-content">
                    <h3 className="project-popup-title">{name}</h3>
                    
                    <div className="flex items-center text-[11px] text-slate-500 mb-2">
                      <span className="mr-1.5 opacity-70">📍</span>
                      {locationLabel(p.city, locale as any)}, {locationLabel(p.country, locale as any)}
                    </div>
                    
                    <p className="project-popup-description">
                      {(locale === 'en' && p.description_en) ? p.description_en : (locale === 'de' && p.description_de) ? p.description_de : p.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 py-3 border-t border-slate-100 mt-2">
                      <span className="project-popup-tag">
                        {categoryLabel(p.category as any, locale as any)}
                      </span>
                      {p.spots !== undefined && (
                        <span className="text-[10px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 font-bold">
                          🪑 {p.spots} {t("availableSpots")}
                        </span>
                      )}
                    </div>
                    
                    <Link 
                      href={`/projects/${p.id}`} 
                      className="flex items-center justify-center w-full py-2.5 mt-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
                    >
                      {t("viewDetails")}
                      <span className="ml-1.5 text-xs opacity-60">→</span>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Unified Premium Toolbar */}
      <div className="absolute top-6 left-6 right-6 z-[1000] flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto map-premium-toolbar w-full sm:w-auto">
          <MapSearch allProjects={projects} onResults={setBaseFilteredProjects} />
          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
          <MapFilters
            allProjects={projects}
            onFilterChange={setBaseFilteredProjects}
            onCenterOnLocation={handleCenterOnLocation}
          />
        </div>

        <div className="pointer-events-auto map-premium-toolbar overflow-x-auto no-scrollbar max-w-full">
           {([
              { key: 'once', labelEs: 'Evento', labelEn: 'Event', labelDe: 'Event' },
              { key: 'regular', labelEs: 'Regular', labelEn: 'Regular', labelDe: 'Regelmäßig' },
              { key: 'permanent', labelEs: 'Permanente', labelEn: 'Permanent', labelDe: 'Dauerhaft' },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFrequencyFilters((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  frequencyFilters[opt.key] 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: gradientForFrequency(opt.key) }}></span>
                {locale === 'es' ? opt.labelEs : locale === 'de' ? opt.labelDe : opt.labelEn}
              </button>
            ))}
            <div className="h-5 w-[1px] bg-slate-200 mx-1"></div>
            <button 
              onClick={() => setHeatOn(!heatOn)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                heatOn ? 'bg-orange-500 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-1">🔥</span> Heatmap
            </button>
        </div>
      </div>

      {/* Floating Category Navigator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none w-full px-4 max-w-4xl">
        <div className="pointer-events-auto flex items-center gap-2 p-2 map-glass-panel rounded-full overflow-x-auto no-scrollbar overflow-y-hidden">
          <button
            onClick={() => setSelectedCategories([])}
            className={`category-chip ${
              selectedCategories.length === 0 ? 'category-chip-active' : 'category-chip-inactive'
            }`}
          >
            🌟 {locale === 'es' ? 'Todos' : locale === 'de' ? 'Alle' : 'All'}
          </button>
          {Array.from(new Set(projects.map((p) => p.category))).map((cat) => {
            const active = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat])}
                className={`category-chip ${
                  active ? 'category-chip-active' : 'category-chip-inactive'
                }`}
              >
                {categoryLabel(cat as any, locale as any)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-4">
        <div className="flex flex-col gap-2 p-1.5 map-glass-panel">
          <button 
            onClick={() => mapRef.current?.zoomIn()} 
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-slate-900 shadow-sm border border-slate-100 font-bold transition-all hover:scale-105"
          >
            +
          </button>
          <button 
            onClick={() => mapRef.current?.zoomOut()} 
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-slate-900 shadow-sm border border-slate-100 font-bold transition-all hover:scale-105"
          >
            −
          </button>
        </div>
        <button 
          onClick={handleCenterOnLocation}
          className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-900 hover:bg-black text-white shadow-lg transition-all hover:scale-110 active:scale-95 group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">📍</span>
        </button>
      </div>

      {geoError && (
        <div className="absolute bottom-24 right-6 z-[2000] animate-premium-fade bg-red-500 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-medium">
          {geoError}
        </div>
      )}

      <style jsx global>{`
        .leaflet-container { background: #f8fafc !important; }
        .econexo-premium-pin { border: none !important; background: none !important; }
        @keyframes econexo-pulse {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); transform: scale(0.95); }
          70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); transform: scale(1.1); }
          100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}

function SetMapRef({ onReady }: { onReady: (m: LeafletMap) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady(map as unknown as LeafletMap);
  }, [map, onReady]);
  return null;
}


