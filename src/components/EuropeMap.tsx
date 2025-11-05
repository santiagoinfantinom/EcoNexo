"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import Link from "next/link";
import { useI18n, categoryLabel, projectNameLabel, locationLabel } from "@/lib/i18n";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import MapFilters from "./MapFilters";
import MapSearch from "./MapSearch";
import MapLayers from "./MapLayers";

type Project = {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
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
const DefaultIcon = L.icon({
  iconUrl: typeof window !== "undefined" ? "/leaflet/marker-icon.png" : "",
  iconRetinaUrl:
    typeof window !== "undefined" ? "/leaflet/marker-icon-2x.png" : "",
  shadowUrl: typeof window !== "undefined" ? "/leaflet/marker-shadow.png" : "",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
if (typeof window !== "undefined") {
  (L.Marker.prototype as unknown as { options: { icon: L.Icon } }).options.icon =
    DefaultIcon;
}

export default function EuropeMap({ projects }: { projects: Project[] }) {
  const mapRef = useRef<LeafletMap | null>(null);
  const { t, locale } = useI18n();
  const [baseFilteredProjects, setBaseFilteredProjects] = useState<Project[]>(projects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [filterMode, setFilterMode] = useState<'all' | 'today' | 'permanent'>('all');
  const [heatOn, setHeatOn] = useState<boolean>(false);
  const heatLayerRef = useRef<any | null>(null);
  // Calendar overlay removed; calendar lives on its own page now
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [frequencyFilters, setFrequencyFilters] = useState<{ once: boolean; regular: boolean; permanent: boolean }>({ once: true, regular: true, permanent: true });
  // Listen to external center events from the page-level search bar
  useEffect(() => {
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
    const handle = () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    };
    // Invalidate after mount and on resize to avoid "thin line" rendering
    const id = setTimeout(handle, 0);
    window.addEventListener("resize", handle);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", handle);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handleCenterOnLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoError(locale === 'es' ? "Geolocation no está disponible en este dispositivo." : 
                 locale === 'de' ? "Geolocation ist auf diesem Gerät nicht verfügbar." : 
                 "Geolocation is not available on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        mapRef.current?.setView([lat, lon], 13, { animate: true });
        const circle = L.circle([lat, lon], { radius: 300, color: "#16a34a" }).addTo(mapRef.current!);
        setTimeout(() => circle.remove(), 2500);
        setGeoError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(locale === 'es' ? "Para centrar en tu ubicación, concede permiso de localización al navegador." :
                     locale === 'de' ? "Um auf deinen Standort zu zentrieren, gewähre dem Browser Standortberechtigung." :
                     "To center on your location, grant location permission to the browser.");
        } else {
          setGeoError(locale === 'es' ? "No se pudo obtener tu ubicación." :
                     locale === 'de' ? "Dein Standort konnte nicht ermittelt werden." :
                     "Could not get your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleProjectSelect = (project: Project | null) => {
    setSelectedProject(project);
    if (project) {
      mapRef.current?.setView([project.lat, project.lng], 13, { animate: true });
    }
  };

  // Frequency helpers
  function getFrequency(p: Project): 'once' | 'regular' | 'permanent' {
    // permanent if flagged or lacks dates
    const isPermanent = Boolean(p.isPermanent || (!p.startsAt && !p.endsAt));
    if (isPermanent) return 'permanent';
    // consider long range (> 7 days) as regular
    if (p.startsAt && p.endsAt) {
      const diffMs = new Date(p.endsAt).getTime() - new Date(p.startsAt).getTime();
      if (diffMs > 7 * 24 * 60 * 60 * 1000) return 'regular';
    }
    // heuristic: description mentions weekly/every/cada
    const text = ((p as any).description || '').toString().toLowerCase();
    if (/\b(cada|semanal|weekly|every|mensual|monthly)\b/.test(text)) return 'regular';
    return 'once';
  }

  function colorForFrequency(freq: 'once' | 'regular' | 'permanent'): string {
    if (freq === 'once') return '#ef4444'; // red
    if (freq === 'regular') return '#3b82f6'; // blue
    return '#16a34a'; // green
  }

  function gradientForFrequency(freq: 'once' | 'regular' | 'permanent'): string {
    // Modern, vibrant gradients per frequency
    if (freq === 'once') return 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'; // orange → red
    if (freq === 'regular') return 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'; // cyan → blue
    return 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'; // green → emerald
  }

  function createGradientIcon(freq: 'once' | 'regular' | 'permanent'): L.DivIcon {
    const size = 18;
    const gradient = gradientForFrequency(freq);
    // Soft glow using box-shadow; inner ring for contrast
    const html = `
      <span style="
        display:inline-block; width:${size}px; height:${size}px;
        border-radius:9999px; background:${gradient};
        box-shadow: 0 0 0 2px rgba(255,255,255,0.9), 0 8px 14px rgba(0,0,0,0.18);
        position: relative;
      ">
        <span style="
          position:absolute; inset:2px; border-radius:9999px;
          background: radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0) 60%);
        "></span>
      </span>`;
    return L.divIcon({
      html,
      className: "econexo-gradient-pin",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  }

  // Recompute filtered list when base filters, frequency or mode changes
  useEffect(() => {
    const now = new Date();
    const isToday = (p: Project) => {
      if (p.isPermanent) return false;
      if (!p.startsAt && !p.endsAt) return false;
      const start = p.startsAt ? new Date(p.startsAt) : now;
      const end = p.endsAt ? new Date(p.endsAt) : now;
      const startDay = new Date(now); startDay.setHours(0,0,0,0);
      const endDay = new Date(now); endDay.setHours(23,59,59,999);
      return (start <= endDay) && (end >= startDay);
    };
    const isPermanent = (p: Project) => Boolean(p.isPermanent || (!p.startsAt && !p.endsAt));

    // Start with base filtered list
    let next = baseFilteredProjects.filter((p) => {
      if (filterMode === 'all') return true;
      if (filterMode === 'today') return isToday(p);
      return isPermanent(p);
    });
    // Apply frequency filters
    next = next.filter((p) => frequencyFilters[getFrequency(p)]);
    setFilteredProjects(next);
  }, [baseFilteredProjects, filterMode, frequencyFilters]);

  // Heatmap toggle effect
  useEffect(() => {
    if (!mapRef.current) return;
    if (!heatOn) {
      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      return;
    }
    let cancelled = false;
    (async () => {
      // Load leaflet.heat dynamically from CDN to keep bundle small
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

  return (
    <>
    <div ref={containerRef} className="relative" style={{ height: "100%", width: "100%" }}>
    <MapContainer
      center={[50.1109, 8.6821]} // centro aproximado de Europa (Frankfurt)
      zoom={4}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: "100%", width: "100%", display: "block", position: "relative" }}
      whenReady={() => {
        // fuerza el render correcto dentro del contenedor circular
        setTimeout(() => mapRef.current?.invalidateSize(), 50);
        setTimeout(() => mapRef.current?.invalidateSize(), 300);
        setTimeout(() => mapRef.current?.invalidateSize(), 1000);
      }}
    >
      {/* Bridge to capture map instance safely */}
      {/** @ts-ignore */}
      <SetMapRef onReady={(m: LeafletMap) => (mapRef.current = m)} />
      
      {/* Map Layers */}
      <MapLayers />
      
      {/* Individual markers */}
      {filteredProjects.map((p) => {
        const freq = getFrequency(p);
        const icon = createGradientIcon(freq);
        return (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
          <Popup>
            <div className="grid gap-1">
              {p && (p as any).image_url && (
                <img src={(p as any).image_url} alt="Project" className="mb-2 rounded w-full max-w-[220px] h-auto" />
              )}
              <div className="font-medium">{(locale === 'en' && (p as any).name_en) ? (p as any).name_en : (locale === 'de' && (p as any).name_de) ? (p as any).name_de : projectNameLabel(p.id, p.name, locale as any)}</div>
              <div className="text-xs text-gray-600">{locationLabel(p.city, locale as any)}, {locationLabel(p.country, locale as any)}</div>
              {p.address && (
                <div className="text-xs text-gray-600">{p.address}</div>
              )}
              {(p.participants !== undefined || p.spots !== undefined) && (
                <div className="text-xs">
                  {p.participants !== undefined && (<span className="mr-2">👥 {p.participants}</span>)}
                  {p.spots !== undefined && (<span>🪑 {p.spots}</span>)}
                </div>
              )}
              <div className="text-xs">{t("category")}: {categoryLabel(p.category as any, locale as any)}</div>
              <div className="text-xs">
                {locale==='es'?'Frecuencia':locale==='de'?'Häufigkeit':'Frequency'}: {freq==='once'?(locale==='es'?'Una vez':locale==='de'?'Einmalig':'One-time'):freq==='regular'?(locale==='es'?'Regularmente':locale==='de'?'Regelmäßig':'Regular'):(locale==='es'?'Permanente':locale==='de'?'Dauerhaft':'Permanent')}
              </div>
              {p.spots !== undefined && (
                <div className="text-xs">{t("availableSpots")}: {p.spots}</div>
              )}
              <div className="flex gap-2 mt-1">
                <Link href={`/projects/${p.id}`} className="text-green-700 underline text-sm">
                  {locale === 'es' ? 'Detalles' : 'Details'}
                </Link>
                {(p as any).info_url && (
                  <a href={(p as any).info_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-sm">
                    {locale === 'de' ? 'Mehr Info' : locale === 'en' ? 'More info' : 'Más info'}
                  </a>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
        );
      })}
    </MapContainer>
    
    {/* Controles superpuestos - VISIBLES */}
    {/* Top Controls Bar */}
    <div className="absolute top-4 left-4 right-4 z-[5000] flex justify-between items-start pointer-events-none">
      {/* Map Filters */}
      <div className="pointer-events-auto flex items-center gap-2">
        <MapSearch allProjects={projects} onResults={setBaseFilteredProjects} />
        <MapFilters 
          allProjects={projects}
          onFilterChange={setBaseFilteredProjects}
          onCenterOnLocation={handleCenterOnLocation}
        />
        {/* Frequency legend & filter */}
        <div className="flex items-center gap-1 bg-white/80 rounded px-1 py-1">
          {([
            { key: 'once', labelEs: 'Una vez', labelEn: 'One-time', labelDe: 'Einmalig', color: '#ef4444' },
            { key: 'regular', labelEs: 'Regular', labelEn: 'Regular', labelDe: 'Regelmäßig', color: '#3b82f6' },
            { key: 'permanent', labelEs: 'Permanente', labelEn: 'Permanent', labelDe: 'Dauerhaft', color: '#16a34a' },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              className={`px-2 py-1 rounded text-xs border flex items-center gap-1 ${frequencyFilters[opt.key] ? 'bg-black text-white border-black' : 'text-black border-black'}`}
              onClick={() => setFrequencyFilters((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))}
              title={locale==='es'?opt.labelEs:locale==='de'?opt.labelDe:opt.labelEn}
            >
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: opt.key==='once' ? 'linear-gradient(135deg, #f97316, #ef4444)' : opt.key==='regular' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'linear-gradient(135deg, #22c55e, #10b981)' }} />
              <span>{locale==='es'?opt.labelEs:locale==='de'?opt.labelDe:opt.labelEn}</span>
            </button>
          ))}
        </div>
        {/* Events toggle */}
        <div className="flex items-center gap-1 bg-white/80 rounded px-1 py-1">
          <button className={`px-2 py-1 rounded text-xs border ${filterMode==='all' ? 'bg-black text-white border-black' : 'text-black border-black'}`} onClick={() => setFilterMode('all')}>
            {locale==='de'?'Alle':locale==='en'?'All':'Todos'}
          </button>
          <button className={`px-2 py-1 rounded text-xs border ${filterMode==='today' ? 'bg-black text-white border-black' : 'text-black border-black'}`} onClick={() => setFilterMode('today')}>
            {locale==='de'?'Heute':locale==='en'?'Today':'Hoy'}
          </button>
          <button className={`px-2 py-1 rounded text-xs border ${filterMode==='permanent' ? 'bg-black text-white border-black' : 'text-black border-black'}`} onClick={() => setFilterMode('permanent')}>
            {locale==='de'?'Dauerhaft':locale==='en'?'Permanent':'Permanentes'}
          </button>
        </div>
        {/* Heatmap toggle */}
        <div className="flex items-center gap-1 bg-white/80 rounded px-1 py-1 ml-2">
          <button className={`px-2 py-1 rounded text-xs border ${heatOn ? 'bg-black text-white border-black' : 'text-black border-black'}`} onClick={() => setHeatOn((v)=>!v)}>
            {heatOn ? (locale==='de'?'Heatmap an':'Heatmap On') : (locale==='de'?'Heatmap aus':'Heatmap Off')}
          </button>
        </div>
      </div>
      {/* Right Controls (calendar button removed) */}
      <div className="flex gap-2 pointer-events-auto" />
    </div>

    {/* Botón de ubicación (esquina inferior derecha) */}
    <div className={`pointer-events-auto absolute bottom-4 right-4 transition-all duration-300 z-[1500] opacity-100`}>
      <button
        onClick={handleCenterOnLocation}
        className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm border border-gray-300 shadow-md flex items-center justify-center text-lg text-gray-700 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-200"
        title={t("centerOnMyLocation")}
        aria-label={t("centerOnMyLocation")}
      >
        📍
      </button>
      {geoError && (
        <div className="absolute top-full mt-2 p-2 bg-red-500 text-white text-xs rounded shadow">
          {geoError}
        </div>
      )}
    </div>

    {/* Pan Controls */}
    <div className={`pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 transition-all duration-300 z-[3000] opacity-100`}>
      <button
        className="h-10 w-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-lg font-bold hover:bg-blue-700 hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
        onClick={() => mapRef.current?.panBy([0, -100], { animate: true })}
        title={locale === 'es' ? "Arriba" : 
               locale === 'de' ? "Nach oben" : 
               "Up"}
        aria-label={locale === 'es' ? "Arriba" : 
                   locale === 'de' ? "Nach oben" : 
                   "Up"}
      >
        ↑
      </button>
      <div className="flex gap-2">
        <button
          className="h-10 w-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-lg font-bold hover:bg-blue-700 hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
          onClick={() => mapRef.current?.panBy([-100, 0], { animate: true })}
          title={locale === 'es' ? "Izquierda" : 
                 locale === 'de' ? "Nach links" : 
                 "Left"}
          aria-label={locale === 'es' ? "Izquierda" : 
                     locale === 'de' ? "Nach links" : 
                     "Left"}
        >
          ←
        </button>
        <button
          className="h-10 w-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-lg font-bold hover:bg-blue-700 hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
          onClick={() => mapRef.current?.panBy([100, 0], { animate: true })}
          title={locale === 'es' ? "Derecha" : 
                 locale === 'de' ? "Nach rechts" : 
                 "Right"}
          aria-label={locale === 'es' ? "Derecha" : 
                     locale === 'de' ? "Nach rechts" : 
                     "Right"}
        >
          →
        </button>
      </div>
      <button
        className="h-10 w-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-lg font-bold hover:bg-blue-700 hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
        onClick={() => mapRef.current?.panBy([0, 100], { animate: true })}
        title={locale === 'es' ? "Abajo" : 
               locale === 'de' ? "Nach unten" : 
               "Down"}
        aria-label={locale === 'es' ? "Abajo" : 
                   locale === 'de' ? "Nach unten" : 
                   "Down"}
      >
        ↓
      </button>
    </div>

    {/* Zoom Controls */}
    <div className={`pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 transition-all duration-300 z-[3000] opacity-100`}>
      <button
        className="h-12 w-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center text-xl font-bold hover:bg-green-700 hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
        onClick={() => mapRef.current?.zoomIn()}
        title={locale === 'es' ? "Acercar" : 
               locale === 'de' ? "Hineinzoomen" : 
               "Zoom in"}
        aria-label={locale === 'es' ? "Acercar" : 
                   locale === 'de' ? "Hineinzoomen" : 
                   "Zoom in"}
      >
        +
      </button>
      <button
        className="h-12 w-12 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center text-xl font-bold hover:bg-red-700 hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
        onClick={() => mapRef.current?.zoomOut()}
        title={locale === 'es' ? "Alejar" : 
               locale === 'de' ? "Herauszoomen" : 
               "Zoom out"}
        aria-label={locale === 'es' ? "Alejar" : 
                   locale === 'de' ? "Herauszoomen" : 
                   "Zoom out"}
      >
        −
      </button>
    </div>


    {/* Asegurar que popups estén por encima de controles */}
    <style jsx>{`
      :global(.leaflet-popup) { z-index: 4000 !important; }
      :global(.leaflet-popup-content-wrapper) { z-index: 4000 !important; }
      :global(.leaflet-popup-tip) { z-index: 4000 !important; }
    `}</style>
    </div>

    {/* Calendar Modal removed */}
    </>
  );
}

function SetMapRef({ onReady }: { onReady: (m: LeafletMap) => void }) {
	// Using a nested component to access the react-leaflet map instance
	// without changing parent signatures.
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const map = useMap();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		onReady(map as unknown as LeafletMap);
	}, [map, onReady]);
	return null;
}


