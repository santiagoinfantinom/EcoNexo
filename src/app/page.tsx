"use client";
import dynamic from "next/dynamic";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";

type Category =
  | "Medio ambiente"
  | "Educación"
  | "Salud"
  | "Comunidad"
  | "Océanos"
  | "Alimentación";

type Project = {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  city: string;
  country: string;
  spots?: number;
};

const Map = dynamic(() => import("../components/EuropeMap"), { ssr: false });

const ALL_CATEGORIES: Category[] = [
  "Medio ambiente",
  "Educación",
  "Salud",
  "Comunidad",
  "Océanos",
  "Alimentación",
];

const DUMMY_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Reforestación Urbana Berlín",
    category: "Medio ambiente",
    lat: 52.52,
    lng: 13.405,
    city: "Berlín",
    country: "Alemania",
    spots: 50,
  },
  {
    id: "p2",
    name: "Taller de Robótica Educativa",
    category: "Educación",
    lat: 40.4168,
    lng: -3.7038,
    city: "Madrid",
    country: "España",
  },
  {
    id: "p3",
    name: "Clínica móvil comunitaria",
    category: "Salud",
    lat: 45.4642,
    lng: 9.19,
    city: "Milán",
    country: "Italia",
  },
  {
    id: "p4",
    name: "Recuperación de playas",
    category: "Océanos",
    lat: 43.2965,
    lng: 5.3698,
    city: "Marsella",
    country: "Francia",
  },
  {
    id: "p5",
    name: "Huertos urbanos",
    category: "Alimentación",
    lat: 51.5072,
    lng: -0.1276,
    city: "Londres",
    country: "Reino Unido",
  },
  {
    id: "p6",
    name: "Centros vecinales inclusivos",
    category: "Comunidad",
    lat: 59.3293,
    lng: 18.0686,
    city: "Estocolmo",
    country: "Suecia",
  },
];

export default function Home() {
  const [active, setActive] = useState<Category | "Todas">("Todas");
  const [remote, setRemote] = useState<Project[] | null>(null);
  const { t, locale } = useI18n();
  const COLOR_BY_CATEGORY: Record<Category, { bg: string; text: string; border: string }> = {
    "Medio ambiente": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" },
    "Educación": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
    "Salud": { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200" },
    "Comunidad": { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-200" },
    "Océanos": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200" },
    "Alimentación": { bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-200" },
  };
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return; // fallback a DUMMY_PROJECTS
        const data: Project[] = await res.json();
        if (Array.isArray(data) && data.length) setRemote(data);
      } catch {}
    }
    load();
  }, []);
  const filtered = useMemo(
    () =>
      (active === "Todas"
        ? (remote ?? DUMMY_PROJECTS)
        : (remote ?? DUMMY_PROJECTS).filter((p) => p.category === active)),
    [active, remote]
  );
  // TODO: fetch from API when env is set

  return (
    <div className="flex flex-col gap-2 bg-modern rounded-2xl p-1">
      <div className="flex flex-wrap gap-1 justify-center">
        <button
          className={`px-3 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 ${
            active === "Todas" ? "bg-green-600 text-white shadow-lg" : "bg-white/90 text-gray-700 hover:bg-white shadow-md"
          }`}
          onClick={() => setActive("Todas")}
        >
          {t("all")}
        </button>
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c}
            className={`px-3 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 ${
              active === c
                ? "bg-green-600 text-white shadow-lg"
                : `${COLOR_BY_CATEGORY[c].bg} ${COLOR_BY_CATEGORY[c].text} ${COLOR_BY_CATEGORY[c].border} hover:shadow-md`
            }`}
            onClick={() => setActive(c)}
          >
            {categoryLabel(c as any, locale as any)}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center" style={{ padding: "8px" }}>
          <div
            className="overflow-hidden border-4 border-green-600 shadow-xl rounded-xl"
            style={{
              height: "min(85vh, 90vw)",
              width: "min(85vh, 90vw)",
              maxWidth: "1200px",
              maxHeight: "800px",
            }}
          >
            <Map projects={filtered} />
          </div>
        </div>
      </div>
      {/* Buscador compacto bajo el mapa */}
      <div className="flex justify-center">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem('q') as HTMLInputElement);
            const q = input?.value?.trim();
            if (!q) return;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&addressdetails=1`, { headers: { 'Accept-Language': locale } });
              const data = await res.json();
              const first = Array.isArray(data) ? data[0] : null;
              if (first) {
                const lat = parseFloat(first.lat); const lon = parseFloat(first.lon);
                window.dispatchEvent(new CustomEvent('econexo:center', { detail: { lat, lon } }));
              }
            } catch {}
          }}
          className="bg-white/95 backdrop-blur border rounded-full shadow-lg flex items-center gap-2 px-3 py-2 font-medium"
        >
          <input name="q" placeholder={t('cityPh')} className="outline-none text-sm bg-transparent w-48 text-gray-700 font-medium" />
          <button className="text-sm bg-green-600 text-white rounded-full px-3 py-1 font-medium hover:bg-green-700 transition-colors">OK</button>
          <button type="button" className="text-sm border border-gray-300 rounded-full px-3 py-1 font-medium hover:bg-gray-50 transition-colors" onClick={() => window.dispatchEvent(new CustomEvent('econexo:center', { detail: { lat: 50.1109, lon: 8.6821 } }))}>Reset</button>
          <button type="button" className="text-sm border border-gray-300 rounded-full px-3 py-1 flex items-center gap-1 font-medium hover:bg-gray-50 transition-colors" onClick={() => {
            if (!('geolocation' in navigator)) return;
            navigator.geolocation.getCurrentPosition((pos) => {
              const lat = pos.coords.latitude; const lon = pos.coords.longitude;
              window.dispatchEvent(new CustomEvent('econexo:center', { detail: { lat, lon } }));
            });
          }}>
            <span>📍</span>
            <span>GPS</span>
          </button>
        </form>
      </div>
    </div>
  );
}
