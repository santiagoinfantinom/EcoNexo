"use client";
import dynamic from "next/dynamic";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import WelcomeMessage from "@/components/WelcomeMessage";
import MobileFeatures from "@/components/MobileFeatures";
import Link from "next/link";

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
  name_en?: string;
  name_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
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

// Category to URL mapping
const CATEGORY_URLS: Record<Category, string> = {
  "Medio ambiente": "/categorias/medio-ambiente",
  "Educación": "/categorias/educacion",
  "Salud": "/categorias/salud",
  "Comunidad": "/categorias/comunidad",
  "Océanos": "/categorias/oceanos",
  "Alimentación": "/categorias/alimentacion"
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
    name_en: "Berlin Urban Reforestation",
    name_de: "Urbane Aufforstung Berlin",
    description: "Proyecto de plantación de árboles nativos en parques urbanos para mejorar la calidad del aire y crear corredores verdes en la ciudad.",
    description_en: "Native tree planting project in urban parks to improve air quality and create green corridors in the city.",
    description_de: "Projekt zur Pflanzung einheimischer Bäume in Stadtparks zur Verbesserung der Luftqualität und Schaffung grüner Korridore.",
    image_url: "/leaflet/marker-icon.png",
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
    name_en: "Educational Robotics Workshop",
    name_de: "Bildungsrobotik-Workshop",
    description: "Talleres prácticos de programación y construcción de robots para jóvenes, promoviendo habilidades STEM y pensamiento crítico.",
    description_en: "Practical workshops on programming and robot building for youth, promoting STEM skills and critical thinking.",
    description_de: "Praktische Workshops zu Programmierung und Roboterbau für Jugendliche, Förderung von MINT-Fähigkeiten und kritischem Denken.",
    image_url: "/next.svg",
    category: "Educación",
    lat: 40.4168,
    lng: -3.7038,
    city: "Madrid",
    country: "España",
  },
  {
    id: "p3",
    name: "Clínica móvil comunitaria",
    name_en: "Community Mobile Clinic",
    name_de: "Mobile Gemeinschaftsklinik",
    description: "Servicio médico itinerante que lleva atención sanitaria básica a comunidades desatendidas y zonas rurales.",
    description_en: "Mobile medical service bringing basic healthcare to underserved communities and rural areas.",
    description_de: "Mobiler medizinischer Dienst, der grundlegende Gesundheitsversorgung in unterversorgte Gemeinden und ländliche Gebiete bringt.",
    image_url: "/vercel.svg",
    category: "Salud",
    lat: 45.4642,
    lng: 9.19,
    city: "Milán",
    country: "Italia",
  },
  {
    id: "p4",
    name: "Recuperación de playas",
    name_en: "Beach Recovery",
    name_de: "Strandwiederherstellung",
    description: "Campaña de limpieza y restauración de ecosistemas costeros, eliminando contaminación y protegiendo la vida marina.",
    description_en: "Beach cleanup and coastal ecosystem restoration campaign, removing pollution and protecting marine life.",
    description_de: "Strandreinigung und Küstenökosystem-Restaurierungskampagne zur Entfernung von Verschmutzung und zum Schutz des Meereslebens.",
    image_url: "/file.svg",
    category: "Océanos",
    lat: 43.2965,
    lng: 5.3698,
    city: "Marsella",
    country: "Francia",
  },
  {
    id: "p5",
    name: "Huertos urbanos",
    name_en: "Urban Gardens",
    name_de: "Städtische Gärten",
    description: "Creación de espacios verdes comunitarios para agricultura sostenible y educación ambiental en entornos urbanos.",
    description_en: "Creation of community green spaces for sustainable agriculture and environmental education in urban settings.",
    description_de: "Schaffung von Gemeinschaftsgrünflächen für nachhaltige Landwirtschaft und Umweltbildung in städtischen Umgebungen.",
    image_url: "/globe.svg",
    category: "Alimentación",
    lat: 51.5072,
    lng: -0.1276,
    city: "Londres",
    country: "Reino Unido",
  },
  {
    id: "p6",
    name: "Centros vecinales inclusivos",
    name_en: "Inclusive Neighborhood Centers",
    name_de: "Inklusive Nachbarschaftszentren",
    description: "Espacios comunitarios que fomentan la inclusión social, el intercambio cultural y el apoyo mutuo entre vecinos.",
    description_en: "Community spaces that promote social inclusion, cultural exchange and mutual support among neighbors.",
    description_de: "Gemeinschaftsräume, die soziale Inklusion, kulturellen Austausch und gegenseitige Unterstützung unter Nachbarn fördern.",
    image_url: "/window.svg",
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
  const [showIntro, setShowIntro] = useState(true);
  const [mobileLocation, setMobileLocation] = useState<{lat: number, lng: number} | null>(null);
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

  // Mostrar mensaje de bienvenida INMEDIATAMENTE para nuevos usuarios
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('econexo-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
    try {
      const dismissed = localStorage.getItem('econexo:intro-dismissed');
      if (dismissed === 'true') setShowIntro(false);
    } catch {}
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

  const handleLocationUpdate = (location: {latitude: number, longitude: number, accuracy: number}) => {
    setMobileLocation({lat: location.latitude, lng: location.longitude});
    // Centrar el mapa en la ubicación móvil
    window.dispatchEvent(new CustomEvent('econexo:center', { 
      detail: { lat: location.latitude, lon: location.longitude } 
    }));
  };

  const handleImageCapture = (imageUrl: string) => {
    // Aquí podrías implementar lógica para subir la imagen
    console.log('Image captured:', imageUrl);
    // Por ejemplo, mostrar un modal para usar la imagen en un evento
  };

  return (
    <>
      {showWelcome && <WelcomeMessage onClose={handleCloseWelcome} />}
      {showIntro && (
        <section className="bg-ecosia-green text-gls-secondary px-6 py-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider opacity-80 mb-2">{t('sustainableProjectsSince2024')}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">{t('connectingEurope')}<br />{t('transformingFuture')}</h1>
              <p className="text-base md:text-lg opacity-90">{t('discoverEnvironmentalProjects')}</p>
            </div>
            <button
              onClick={() => { setShowIntro(false); try { localStorage.setItem('econexo:intro-dismissed','true'); } catch {} }}
              className="btn-gls-primary whitespace-nowrap"
            >
              {locale === 'de' ? 'Weiter' : locale === 'en' ? 'Continue' : 'Continuar'}
            </button>
          </div>
        </section>
      )}
      <div className="layout-gls">
      {/* Sección izquierda estilo GLS Bank */}
      <div className="layout-gls-left relative z-10">
        <div className="max-w-2xl">
          <MobileFeatures 
            onLocationUpdate={handleLocationUpdate}
            onImageCapture={handleImageCapture}
          />
          <p className="text-sm uppercase tracking-wider text-gls-primary opacity-80 mb-4">
            {t('sustainableProjectsSince2024')}
          </p>
          <h1 className="text-5xl font-bold text-gls-primary mb-6 leading-tight">
            {t('connectingEurope')}<br />
            {t('transformingFuture')}
          </h1>
          <p className="text-lg text-gls-primary opacity-90 mb-8">
            {t('discoverEnvironmentalProjects')}
          </p>
          
          {/* Estadísticas de impacto estilo Ecosia */}
          <div className="impact-stats">
            <div className="stat-card">
              <div className="stat-number">1,247</div>
              <div className="stat-label">{t('activeProjects')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15,892</div>
              <div className="stat-label">{t('connectedVolunteers')}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección derecha estilo GLS Bank */}
      <div className="layout-gls-right relative z-10">
        <div className="max-w-sm">
          <h2 className="text-2xl font-bold text-gls-secondary mb-4">
            {t('exploreProjects')}
          </h2>
          <p className="text-gls-secondary mb-6">
            {t('filterByCategoryAndFind')}
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                active === "Todas" ? "btn-gls-primary" : "bg-white/20 text-gls-secondary hover:bg-white/30"
              }`}
              onClick={() => setActive("Todas")}
            >
              {t('all')}
            </button>
            {ALL_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={CATEGORY_URLS[c]}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-center block ${
                  active === c
                    ? "btn-gls-primary"
                    : "bg-white/20 text-gls-secondary hover:bg-white/30"
                }`}
              >
                {categoryLabel(c as any, locale as any)}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sección del mapa - Full width */}
      <div id="map-section" className="col-span-2 bg-ecosia-dark p-8 relative z-0 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gls-primary mb-6 text-center">
            {t('sustainableProjectsMap')}
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
                {t('search')}
              </button>
              <button 
                type="button" 
                className="btn-gls-secondary text-sm" 
                onClick={() => window.dispatchEvent(new CustomEvent('econexo:center', { detail: { lat: 50.1109, lon: 8.6821 } }))}
              >
                {t('reset')}
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
