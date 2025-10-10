"use client";
import dynamic from "next/dynamic";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import WelcomeMessage from "@/components/WelcomeMessage";

type CategoryKey = "environment" | "education" | "health" | "community" | "oceans" | "food";

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

// Category mapping for translations
const CATEGORY_MAPPING: Record<CategoryKey, Category> = {
  environment: "Medio ambiente",
  education: "Educación", 
  health: "Salud",
  community: "Comunidad",
  oceans: "Océanos",
  food: "Alimentación"
};

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
  const [showWelcome, setShowWelcome] = useState(false);
  const { t, locale } = useI18n();
  
  // Get translated category labels
  const getTranslatedCategory = (category: Category) => {
    return categoryLabel(category, locale);
  };
  
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

  // Mostrar mensaje de bienvenida para nuevos usuarios
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('econexo-welcome-seen');
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setShowWelcome(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  const filtered = useMemo(
    () =>
      (active === "Todas"
        ? (remote ?? DUMMY_PROJECTS)
        : (remote ?? DUMMY_PROJECTS).filter((p) => p.category === active)),
    [active, remote]
  );
  // TODO: fetch from API when env is set

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('econexo-welcome-seen', 'true');
  };

  return (
    <>
      {showWelcome && <WelcomeMessage onClose={handleCloseWelcome} />}
      <div className="layout-gls">
      {/* Sección izquierda estilo GLS Bank */}
      <div className="layout-gls-left">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-wider text-gls-primary opacity-80 mb-4">
            PROYECTOS SOSTENIBLES DESDE 2024
          </p>
          <h1 className="text-5xl font-bold text-gls-primary mb-6 leading-tight">
            Conectando Europa.<br />
            Transformando el futuro.
          </h1>
          <p className="text-lg text-gls-primary opacity-90 mb-8">
            Descubre proyectos ambientales, eventos comunitarios y oportunidades de voluntariado 
            que están construyendo un futuro más sostenible en toda Europa.
          </p>
          
          {/* Estadísticas de impacto estilo Ecosia */}
          <div className="impact-stats">
            <div className="stat-card">
              <div className="stat-number">1,247</div>
              <div className="stat-label">Proyectos activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15,892</div>
              <div className="stat-label">Voluntarios conectados</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección derecha estilo GLS Bank */}
      <div className="layout-gls-right">
        <div className="max-w-sm">
          <h2 className="text-2xl font-bold text-gls-secondary mb-4">
            EXPLORA PROYECTOS
          </h2>
          <p className="text-gls-secondary mb-6">
            Filtra por categoría y encuentra tu próxima oportunidad de impacto.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                active === "Todas" ? "btn-gls-primary" : "bg-white/20 text-gls-secondary hover:bg-white/30"
              }`}
              onClick={() => setActive("Todas")}
            >
              {locale === 'es' ? "Todas" : locale === 'de' ? "Alle" : "All"}
            </button>
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active === c
                    ? "btn-gls-primary"
                    : "bg-white/20 text-gls-secondary hover:bg-white/30"
                }`}
                onClick={() => setActive(c)}
              >
                {categoryLabel(c as any, locale as any)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sección del mapa - Full width */}
      <div className="col-span-2 bg-ecosia-dark p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gls-primary mb-6 text-center">
            Mapa de Proyectos Sostenibles
          </h2>
          
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center" style={{ padding: "8px" }}>
              <div
                className="overflow-hidden border-4 border-ecosia-green shadow-xl rounded-xl"
                style={{
                  height: "min(70vh, 80vw)",
                  width: "min(70vh, 80vw)",
                  maxWidth: "1000px",
                  maxHeight: "600px",
                }}
              >
                <Map projects={filtered} />
              </div>
            </div>
          </div>
          
          {/* Buscador estilo Ecosia */}
          <div className="flex justify-center">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const input = (e.currentTarget.elements.namedItem('q') as HTMLInputElement);
                const q = input?.value?.trim();
                if (!q) return;
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&addressdetails=1`, { 
                    headers: { 'Accept-Language': locale },
                    mode: 'cors'
                  });
                  if (!res.ok) {
                    console.warn("Geocoding service not available");
                    return;
                  }
                  const data = await res.json();
                  const first = Array.isArray(data) ? data[0] : null;
                  if (first) {
                    const lat = parseFloat(first.lat); const lon = parseFloat(first.lon);
                    window.dispatchEvent(new CustomEvent('econexo:center', { detail: { lat, lon } }));
                  }
                } catch (error) {
                  console.warn("Failed to geocode location:", error);
                }
              }}
              className="card-ecosia flex items-center gap-3"
            >
              <input 
                name="q" 
                placeholder={t('cityPh')} 
                className="outline-none text-sm bg-transparent w-48 text-gls-primary font-medium placeholder-opacity-60" 
              />
              <button className="btn-gls-primary text-sm">
                {locale === 'es' ? "Buscar" : locale === 'de' ? "Suchen" : "Search"}
              </button>
              <button 
                type="button" 
                className="btn-gls-secondary text-sm" 
                onClick={() => window.dispatchEvent(new CustomEvent('econexo:center', { detail: { lat: 50.1109, lon: 8.6821 } }))}
              >
                {locale === 'es' ? "Reset" : locale === 'de' ? "Zurücksetzen" : "Reset"}
              </button>
              <button 
                type="button" 
                className="btn-gls-secondary text-sm flex items-center gap-1" 
                onClick={() => {
                  if (!('geolocation' in navigator)) return;
                  navigator.geolocation.getCurrentPosition((pos) => {
                    const lat = pos.coords.latitude; const lon = pos.coords.longitude;
                    window.dispatchEvent(new CustomEvent('econexo:center', { detail: { lat, lon } }));
                  });
                }}
              >
                <span>📍</span>
                <span>GPS</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
