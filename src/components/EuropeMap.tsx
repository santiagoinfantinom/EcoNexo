"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import Link from "next/link";
import { useI18n, categoryLabel, projectNameLabel } from "@/lib/i18n";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import MapFilters from "./MapFilters";
import CalendarView from "./CalendarView";
import MapLayers from "./MapLayers";
import MarkerCluster from "./MarkerCluster";

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
  spots?: number;
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
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [useClustering, setUseClustering] = useState(true);
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
      setGeoError("Geolocation no está disponible en este dispositivo.");
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
          setGeoError("Para centrar en tu ubicación, concede permiso de localización al navegador.");
        } else {
          setGeoError("No se pudo obtener tu ubicación.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleProjectSelect = (project: Project | null) => {
    setSelectedProject(project);
    if (project) {
      mapRef.current?.setView([project.lat, project.lng], 13, { animate: true });
      setShowCalendar(false);
    }
  };

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
      
      {/* Conditional rendering: clustering or individual markers */}
      {useClustering ? (
        <MarkerCluster projects={filteredProjects} />
      ) : (
        filteredProjects.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div className="grid gap-1">
                <div className="font-medium">{(locale === 'en' && (p as any).name_en) ? (p as any).name_en : (locale === 'de' && (p as any).name_de) ? (p as any).name_de : projectNameLabel(p.id, p.name, locale as any)}</div>
                <div className="text-xs text-gray-600">{p.city}, {p.country}</div>
                <div className="text-xs">{t("category")}: {categoryLabel(p.category as any, locale as any)}</div>
                {p.spots !== undefined && (
                  <div className="text-xs">{t("availableSpots")}: {p.spots}</div>
                )}
                <Link
                  href={`/projects/${p.id}`}
                  className="text-green-700 underline text-sm mt-1"
                >
                  {t("viewDetails")}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))
      )}
    </MapContainer>
    
    {/* Controles superpuestos - VISIBLES */}
    {/* Top Controls Bar */}
    <div className="absolute top-4 left-4 right-4 z-[2000] flex justify-between items-start pointer-events-none">
      {/* Map Filters */}
      <div className="pointer-events-auto">
        <MapFilters 
          allProjects={projects}
          onFilterChange={setFilteredProjects}
          onCenterOnLocation={handleCenterOnLocation}
        />
      </div>

      {/* Right Controls */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onClick={() => setUseClustering(!useClustering)}
          className={`px-3 py-2 rounded-lg shadow-md transition-all text-sm font-medium hover:shadow-lg hover:scale-105 ${
            useClustering 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
          title={useClustering ? t("showAll") : t("clusterMarkers")}
        >
          {useClustering ? `🔗 ${t("cluster")}` : `📍 ${t("individual")}`}
        </button>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-3 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg hover:scale-105 transition-all text-sm font-medium"
        >
          📅 {t("calendar")}
        </button>
      </div>
    </div>

    {/* Botón de ubicación (centrado sobre el mapa) - ELEGANTE */}
    <div className="pointer-events-auto absolute inset-0 z-[1500] flex items-center justify-center">
      <button
        onClick={handleCenterOnLocation}
        className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm border border-gray-300 shadow-md flex items-center justify-center text-lg text-gray-700 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-200"
        title="Centrar en mi ubicación"
        aria-label="Centrar en mi ubicación"
      >
        📍
      </button>
      {geoError && (
        <div className="absolute top-full mt-2 p-2 bg-red-500 text-white text-xs rounded shadow">
          {geoError}
        </div>
      )}
    </div>

    {/* Zoom Controls - MUY VISIBLES */}
    <div className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 z-[3000] flex flex-col gap-3">
      <button
        className="h-12 w-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center text-xl font-bold hover:bg-green-700 hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
        onClick={() => mapRef.current?.zoomIn()}
        title="Acercar"
        aria-label="Acercar"
      >
        +
      </button>
      <button
        className="h-12 w-12 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center text-xl font-bold hover:bg-red-700 hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white"
        onClick={() => mapRef.current?.zoomOut()}
        title="Alejar"
        aria-label="Alejar"
      >
        −
      </button>
    </div>


    {/* Asegurar que popups estén por encima de controles */}
    <style jsx>{`
      :global(.leaflet-popup) { z-index: 1000; }
    `}</style>
    </div>

    {/* Calendar Modal */}
    {showCalendar && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
        <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
          <button
            onClick={() => setShowCalendar(false)}
            className="absolute top-4 right-4 z-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors font-bold text-lg"
            title="Cerrar calendario"
            aria-label="Cerrar calendario"
          >
            ×
          </button>
          <CalendarView 
            projects={projects}
            onProjectSelect={handleProjectSelect}
          />
        </div>
      </div>
    )}
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


