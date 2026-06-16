"use client";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n, categoryLabel, projectNameLabel, locationLabel } from "@/lib/i18n";
import "leaflet/dist/leaflet.css";
import "@/styles/map-premium.css";

// --- Importaciones de tus otros componentes ---
import MapFilters from "./MapFilters";
import MapLayers from "./MapLayers";
import ImageWithFallback from "./ImageWithFallback";

// --- Configuración e Íconos ---
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// --- Componentes Auxiliares ---
function SetMapRef({ onReady }: { onReady: (m: LeafletMap) => void }) {
  const map = useMap();
  useEffect(() => { onReady(map as unknown as LeafletMap); }, [map, onReady]);
  return null;
}

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e: any) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);
  return position === null ? null : (
    <Marker position={position} icon={redIcon}>
      <Popup>¡Estás aquí!</Popup>
    </Marker>
  );
}

// --- Componente Principal ---
export default function InteractiveMap({ projects, region = 'europe', center, zoom }: any) {
  const mapRef = useRef<LeafletMap | null>(null);
  const { t, locale } = useI18n();
  const [isActivated, setIsActivated] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'today' | 'permanent'>('all');
  const [frequencyFilters, setFrequencyFilters] = useState({ once: true, regular: true, permanent: true });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Aquí faltaría tu lógica de filtrado 'filteredProjects' que ya tenías
  // La pongo simple para que funcione y luego la extiendes:
  const filteredProjects = projects; 

  if (!isActivated) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-900 rounded-3xl">
        <button onClick={() => setIsActivated(true)} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold">
          {t("activateMap")}
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Panel de Control Flotante */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 bg-white/90 p-4 rounded-xl shadow-lg">
        <h2 className="text-sm font-bold">{t("filters")}</h2>
        <MapFilters 
          filterMode={filterMode} 
          setFilterMode={setFilterMode}
          frequencyFilters={frequencyFilters}
          setFrequencyFilters={setFrequencyFilters}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>

      <MapContainer center={center || [50.11, 8.68]} zoom={zoom || 4} zoomControl={false} className="w-full h-full z-0">
        <SetMapRef onReady={(m: LeafletMap) => (mapRef.current = m)} />
        <LocationMarker />
        <MapLayers />
        
        {filteredProjects.map((p: any) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
             <Popup>{p.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}