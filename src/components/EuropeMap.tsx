"use client";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import Link from "next/link";
import { useI18n, categoryLabel, projectNameLabel } from "@/lib/i18n";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

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

  return (
    <>
    <div ref={containerRef} className="relative" style={{ height: "100%", width: "100%" }}>
    <MapContainer
      center={[50.1109, 8.6821]} // centro aproximado de Europa (Frankfurt)
      zoom={4}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: "100%", width: "100%", display: "block" }}
      whenReady={() => {
        // fuerza el render correcto dentro del contenedor circular
        setTimeout(() => mapRef.current?.invalidateSize(), 50);
        setTimeout(() => mapRef.current?.invalidateSize(), 300);
        setTimeout(() => mapRef.current?.invalidateSize(), 1000);
      }}
    >
      <ZoomControl position="topright" />
      <TileLayer
        attribution='&copy; OpenStreetMap & CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      />
      {projects.map((p) => (
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
      ))}
    </MapContainer>
    {/* Controles superpuestos */}
    <div className="pointer-events-none absolute inset-0">
      {/* Botón de ubicación (centrado sobre el mapa) */}
      <div className="pointer-events-auto absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => {
            if (!("geolocation" in navigator)) return;
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                mapRef.current?.setView([lat, lon], 13, { animate: true });
                const circle = L.circle([lat, lon], { radius: 300, color: "#16a34a" }).addTo(mapRef.current!);
                setTimeout(() => circle.remove(), 2500);
              },
              () => {},
              { enableHighAccuracy: true, timeout: 8000 }
            );
          }}
          className="h-10 w-10 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur border shadow flex items-center justify-center text-xl"
          title="Ubicación"
          aria-label="Ubicación"
        >
          📍
        </button>
      </div>

      {/* Arrows + zoom controls (top-right) */}
      <div className="pointer-events-auto absolute right-3 top-3 grid gap-2">
        <div className="grid grid-cols-3 gap-1">
          <span />
          <button
            className="h-8 w-8 rounded bg-white/90 dark:bg-black/50 border text-sm"
            onClick={() => mapRef.current?.panBy([0, -120])}
            title="Arriba"
          >↑</button>
          <span />
          <button
            className="h-8 w-8 rounded bg-white/90 dark:bg-black/50 border text-sm"
            onClick={() => mapRef.current?.panBy([-120, 0])}
            title="Izquierda"
          >←</button>
          <button
            className="h-8 w-8 rounded bg-white/90 dark:bg-black/50 border text-sm"
            onClick={() => mapRef.current?.panBy([0, 120])}
            title="Abajo"
          >↓</button>
          <button
            className="h-8 w-8 rounded bg-white/90 dark:bg-black/50 border text-sm"
            onClick={() => mapRef.current?.panBy([120, 0])}
            title="Derecha"
          >→</button>
        </div>
        <div className="flex flex-col gap-1">
          <button
            className="h-8 w-8 rounded bg-white/90 dark:bg-black/50 border text-lg leading-none"
            onClick={() => mapRef.current?.zoomIn()}
            title="Acercar"
          >+</button>
          <button
            className="h-8 w-8 rounded bg-white/90 dark:bg-black/50 border text-lg leading-none"
            onClick={() => mapRef.current?.zoomOut()}
            title="Alejar"
          >−</button>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}


