"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import "leaflet/dist/leaflet.css";
import "@/styles/map-premium.css";
import Link from "next/link";
import { Locate, LocateFixed } from "lucide-react";

import MapFilters from "./MapFilters";
import { useUserLocation, haversineDistanceKm, type UserLocation } from "@/lib/useUserLocation";
import { useToast } from "./ToastNotification";

const redIcon = typeof window !== 'undefined' ? L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}) : null;

const greenIcon = typeof window !== 'undefined' ? L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}) : null;

function LocationMarker({ location }: { location: UserLocation | null }) {
  const { t } = useI18n();
  const map = useMap();
  const hasFlownRef = useRef<string | null>(null);

  useEffect(() => {
    if (!location) return;
    const key = `${location.lat},${location.lng}`;
    if (hasFlownRef.current === key) return;
    hasFlownRef.current = key;
    map.flyTo([location.lat, location.lng], 13);
  }, [location, map]);

  return !location ? null : (
    <Marker position={[location.lat, location.lng]} icon={greenIcon!}>
      <Popup><strong>{t("youAreHere")}</strong></Popup>
    </Marker>
  );
}

/** Flies the map to a point whenever MapSearch (country/city/project search) dispatches one. */
function MapCenterListener() {
  const map = useMap();

  useEffect(() => {
    const onCenter = (e: Event) => {
      const { lat, lon } = (e as CustomEvent<{ lat: number; lon: number }>).detail || ({} as any);
      if (typeof lat !== "number" || typeof lon !== "number") return;
      map.flyTo([lat, lon], Math.max(map.getZoom(), 6));
    };
    window.addEventListener("econexo:center", onCenter);
    return () => window.removeEventListener("econexo:center", onCenter);
  }, [map]);

  return null;
}

const NEARBY_RADIUS_KM = 50;

export default function InteractiveMap({ projects, center, zoom }: any) {
  const { t, locale } = useI18n();
  const [isActivated, setIsActivated] = useState(false);
  const { location, status: locationStatus, error: locationError, requestLocation } = useUserLocation();
  const [showNearbyPanel, setShowNearbyPanel] = useState(false);
  const { showToast } = useToast();

const getTranslatedText = (project: any, field: string) => {
  const key = `${field}_${locale}`;
  // Si no existe la traducción, intenta mostrar el campo base (ej: project.title)
  // Si tampoco existe, muestra un texto genérico
  return project[key] || project[field] || project.name || "Sin título";
};

  const locationErrorMessages: Record<string, string> = {
    permission: t("locationErrorPermission"),
    unavailable: t("locationErrorUnavailable"),
    timeout: t("locationErrorTimeout"),
    unsupported: t("locationErrorUnsupported"),
    insecure: t("locationErrorInsecure"),
  };

  const handleLocateMe = async () => {
    setShowNearbyPanel(true);
    const found = await requestLocation();
    if (!found) {
      showToast(locationErrorMessages[locationError || "unavailable"] || t("locationErrorUnavailable"), "error");
    }
  };

  // Let the existing "Explore near me" entry points (header button, mobile
  // bottom tab bar) trigger the same locate flow — they already dispatch
  // this event, it just had no listener.
  useEffect(() => {
    const onExploreNearMe = () => { handleLocateMe(); };
    window.addEventListener("econexo:explore-near-me", onExploreNearMe);
    return () => window.removeEventListener("econexo:explore-near-me", onExploreNearMe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationError]);

  const nearbyProjects = useMemo(() => {
    if (!location || !Array.isArray(projects)) return [];
    return projects
      .map((project: any) => ({
        project,
        distanceKm: haversineDistanceKm(location.lat, location.lng, project.lat, project.lng),
      }))
      .filter((p: any) => p.distanceKm <= NEARBY_RADIUS_KM)
      .sort((a: any, b: any) => a.distanceKm - b.distanceKm)
      .slice(0, 8);
  }, [location, projects]);

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
    <div
      className="relative w-full h-full"
      onWheel={(e) => {
        // scrollWheelZoom is off, but the Leaflet container's own
        // `overflow: hidden` stops the browser from chaining an unused wheel
        // scroll up to the page. Forward it manually so scrolling past the
        // map always works.
        window.scrollBy({ top: e.deltaY, left: 0 });
      }}
    >
      {/* Locate me button — especially useful on mobile where the full map is hard to scan */}
      <button
        type="button"
        onClick={handleLocateMe}
        aria-label={t("locateMe")}
        title={t("locateMe")}
        className="absolute top-3 right-3 z-[500] flex items-center gap-2 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 sm:px-4 shadow-lg border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
        disabled={locationStatus === "requesting"}
      >
        {locationStatus === "requesting" ? (
          <LocateFixed className="w-4 h-4 animate-pulse text-emerald-600" />
        ) : (
          <Locate className="w-4 h-4 text-emerald-600" />
        )}
        <span className="hidden sm:inline">
          {locationStatus === "requesting" ? t("locatingYou") : t("locateMe")}
        </span>
      </button>

      {showNearbyPanel && location && (
        <div className="absolute bottom-[calc(88px+env(safe-area-inset-bottom))] sm:bottom-3 left-3 right-3 sm:right-auto sm:w-80 z-[500] max-h-[35%] overflow-y-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-xl border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t("nearbyProjectsTitle")}</h4>
            <button
              type="button"
              onClick={() => setShowNearbyPanel(false)}
              aria-label="Close"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none px-1"
            >
              ×
            </button>
          </div>
          {nearbyProjects.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">{t("noNearbyProjects")}</p>
          ) : (
            <ul className="space-y-1.5">
              {nearbyProjects.map(({ project, distanceKm }: any) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <span className="text-sm text-slate-800 dark:text-slate-200 truncate">
                      {getTranslatedText(project, "name")}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                      {distanceKm < 1 ? "<1" : Math.round(distanceKm)} km
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <MapContainer key={`map-${locale}`} style={{ height: "600px", width: "100%" }} center={center || [50.11, 8.68]} zoom={zoom || 4} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker location={location} />
        <MapCenterListener />
        {Array.isArray(projects) && projects.map((project: any) => (
    <Marker 
      key={project.id} 
      position={[project.lat, project.lng]} 
      icon={redIcon!}
    >
      <Popup>
        <div style={{ padding: "10px", minWidth: "200px" }}>
          {/* Título */}
          <h3 style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>
            {getTranslatedText(project, "title")}
          </h3>
          
          {/* Detalles: Participantes y Fecha */}
          <ul style={{ fontSize: "13px", color: "#555", marginBottom: "12px", listStyle: "none", padding: 0 }}>
            <li><strong>{t("participants")}:</strong> {project.participants || 0}</li>
            <li><strong>{t("createdAt")}:</strong> {new Date(project.created_at).toLocaleDateString(locale)}</li>
          </ul>

          {/* Enlace a la página del proyecto */}
          <Link 
            href={`/projects/${project.id}`}
            style={{ 
              display: "block", 
              textAlign: "center", 
              backgroundColor: "#0070f3", 
              color: "#fff", 
              padding: "8px", 
              borderRadius: "5px", 
              textDecoration: "none",
              fontWeight: "bold" 
            }}
          >
            {t("viewProjectDetails")}
          </Link>
        </div>
      </Popup>
    </Marker>
  ))}
      </MapContainer>
    </div>
  );
}