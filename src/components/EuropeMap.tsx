"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { Map as LeafletMap } from "leaflet";
import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import "leaflet/dist/leaflet.css";
import "@/styles/map-premium.css";
import Link from "next/link";

import MapFilters from "./MapFilters";

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

function LocationMarker() {
  const { t } = useI18n();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();
  const hasLocated = useRef(false);

  useEffect(() => {
    if (hasLocated.current) return;
    map.on("locationfound", (e: any) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 13);
      hasLocated.current = true;
    });
    map.locate({ setView: false, maxZoom: 16 });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={greenIcon!}>
      <Popup><strong>{t("youAreHere")}</strong></Popup>
    </Marker>
  );
}

export default function InteractiveMap({ projects, center, zoom }: any) {
  const { t, locale } = useI18n();
  const [isActivated, setIsActivated] = useState(false);

const getTranslatedText = (project: any, field: string) => {
  const key = `${field}_${locale}`;
  // Si no existe la traducción, intenta mostrar el campo base (ej: project.title)
  // Si tampoco existe, muestra un texto genérico
  return project[key] || project[field] || project.name || "Sin título";
};

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
      <MapContainer key={`map-${locale}`} style={{ height: "600px", width: "100%" }} center={center || [50.11, 8.68]} zoom={zoom || 4}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />{Array.isArray(projects) && projects.map((project: any) => (
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