"use client";

import { useI18n, categoryLabel } from "@/lib/i18n";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import { useSmartContext } from "@/context/SmartContext";
import {
  Sprout,
  BookOpen,
  Users,
  HeartPulse,
  Waves,
  Apple,
  Map as MapIcon,
  Search,
  ArrowRight,
  Flame,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Handshake
} from "lucide-react";

// Dynamic Import Heavy Components
const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });
const WelcomeMessage = dynamic(() => import("@/components/WelcomeMessage"), { ssr: false });
const GamificationHub = dynamic(() => import("@/components/GamificationHub"), { ssr: false });
const PreferencesModal = dynamic(() => import("@/components/PreferencesModal"), { ssr: false });
const RecommendedProjects = dynamic(() => import("@/components/RecommendedProjects"), { ssr: false });
const CityLeaderboard = dynamic(() => import("@/components/CityLeaderboard"), { ssr: false });
const FeaturedProjectsSlider = dynamic(() => import("@/components/FeaturedProjectsSlider"));
const SocialMediaFeed = dynamic(() => import("@/components/SocialMediaFeed"));
const EcoTips = dynamic(() => import("@/components/EcoTips"));
const EcoTipsBulletPoints = dynamic(() => import("@/components/EcoTipsBulletPoints"));
const StreakBanner = dynamic(() => import("@/components/StreakBanner"), { ssr: false });

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(
  () => import("@/components/EuropeMap").then(mod => ({ default: mod.default })).catch(err => {
    console.error('Error loading EuropeMap:', err);
    return {
      default: () => (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              El mapa no está disponible temporalmente.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [heroPulseIndex, setHeroPulseIndex] = useState(0);
  const [liveImpact, setLiveImpact] = useState({
    co2: 12840,
    trees: 3210,
    volunteers: 2500,
  });
  const investorCopy = {
    badge: locale === "es" ? "Plataforma lista para escalar" : locale === "de" ? "Skalierbare Plattform" : "Platform ready to scale",
    title: locale === "es" ? "Activamos comunidades para acelerar impacto climático medible" : locale === "de" ? "Wir aktivieren Communities für messbare Klimawirkung" : "We activate communities to scale measurable climate impact",
    subtitle: locale === "es"
      ? "EcoNexo conecta ciudadanía, proyectos y organizaciones en una experiencia social con gamificación, datos locales y rutas claras de acción."
      : locale === "de"
        ? "EcoNexo verbindet Bürger*innen, Projekte und Organisationen in einer sozialen Erfahrung mit Gamification, lokalen Daten und klaren Handlungswegen."
        : "EcoNexo connects citizens, projects, and organizations in one social experience with gamification, local data, and clear action paths.",
  };

  // Lazy loading observers for different sections
  const { ref: mapRef, inView: mapInView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });
  const { ref: featuredRef, inView: featuredInView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });
  const { ref: leaderboardRef, inView: leaderboardInView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });
  const { ref: socialRef, inView: socialInView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });
  const { ref: tipsRef, inView: tipsInView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });

  const [mapProjects, setMapProjects] = useState<any[]>([]);

  useEffect(() => {
    if (mapInView && mapProjects.length === 0) {
      import('@/data/projects').then(mod => {
        setMapProjects(mod.PROJECTS);
      });
    }
  }, [mapInView, mapProjects.length]);

  // Context Hook
  const { showOnboarding, completeOnboarding } = useSmartContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setHeroPulseIndex((prev) => (prev + 1) % 3);
      setLiveImpact((prev) => ({
        co2: prev.co2 + 3,
        trees: prev.trees + (prev.co2 % 2 === 0 ? 1 : 0),
        volunteers: prev.volunteers + (prev.co2 % 6 === 0 ? 1 : 0),
      }));
    }, 3500);
    return () => clearInterval(pulseTimer);
  }, []);

  return (
    <div className="min-h-screen bg-modern relative overflow-hidden">
      {/* Background Decoration */}
      <div className="animated-gradient-bg" />

      {/* Gamification Sidebar */}
      <GamificationHub />

      {/* Onboarding Modal */}
      <PreferencesModal
        isOpen={showOnboarding}
        onClose={completeOnboarding}
      />

      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95 transform -skew-y-3 origin-top-left scale-110"></div>
        <div className="absolute top-10 right-10 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-8 left-8 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              {investorCopy.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-sm">
              {investorCopy.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              {investorCopy.subtitle}
            </p>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-sm">
              {[
                locale === "es" ? "Cada accion cuenta" : locale === "de" ? "Jede Aktion zahlt" : "Every action counts",
                locale === "es" ? "Conecta con proyectos reales" : locale === "de" ? "Verbinde dich mit echten Projekten" : "Connect with real projects",
                locale === "es" ? "Convierte motivacion en impacto" : locale === "de" ? "Mach Motivation zu Wirkung" : "Turn motivation into impact",
              ].map((item, idx) => (
                <span
                  key={item}
                  className={`rounded-full border border-white/35 px-3 py-1.5 text-white/95 transition-all ${heroPulseIndex === idx ? "bg-white/30 scale-105" : "bg-white/10"
                    }`}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => setShowMap(!showMap)}
                className="btn-gls-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <MapIcon className="w-5 h-5" />
                {showMap ? t('hideMap') : t('showMap')}
              </button>

              <Link
                href="/eventos"
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {locale === "es" ? "Ver pipeline de eventos" : locale === "de" ? "Event-Pipeline ansehen" : "View event pipeline"}
              </Link>

              <Link
                href="/trabajos"
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                {locale === "es" ? "Talento y oportunidades" : locale === "de" ? "Talente und Chancen" : "Talent and opportunities"}
              </Link>

            </div>
            <div className="mb-14 flex flex-wrap justify-center gap-2 text-xs">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-white/90">
                {locale === "es" ? "B2C + B2B2G readiness" : locale === "de" ? "B2C + B2B2G readiness" : "B2C + B2B2G readiness"}
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-white/90">
                {locale === "es" ? "Comunidad, datos y ejecución" : locale === "de" ? "Community, Daten und Umsetzung" : "Community, data, and execution"}
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-white/90">
                {locale === "es" ? "Escalable por ciudad" : locale === "de" ? "Pro Stadt skalierbar" : "Scalable city by city"}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            <div className="glass-card p-6 text-center transform hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl font-bold text-green-600 mb-2">{liveImpact.trees.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">
                {locale === "es" ? "Iniciativas activas" : locale === "de" ? "Aktive Initiativen" : "Active initiatives"}
              </div>
            </div>
            <div className="glass-card p-6 text-center transform hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">{liveImpact.volunteers.toLocaleString()}+</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">
                {locale === "es" ? "Personas movilizadas" : locale === "de" ? "Aktive Personen" : "People mobilized"}
              </div>
            </div>
            <div className="glass-card p-6 text-center transform hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl font-bold text-purple-600 mb-2">{liveImpact.co2.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">
                {locale === "es" ? "Kg CO2 evitados" : locale === "de" ? "Kg CO2 eingespart" : "Kg CO2 avoided"}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto text-left">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-emerald-200">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {locale === "es" ? "Tracción" : locale === "de" ? "Traction" : "Traction"}
                </span>
              </div>
              <p className="text-sm text-white/90">
                {locale === "es" ? "Actividad diaria y crecimiento orgánico de comunidad." : locale === "de" ? "Tägliche Aktivität und organisches Community-Wachstum." : "Daily activity and organic community growth."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-cyan-200">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {locale === "es" ? "Confianza" : locale === "de" ? "Vertrauen" : "Trust"}
                </span>
              </div>
              <p className="text-sm text-white/90">
                {locale === "es" ? "Arquitectura preparada para datos reales y alianzas institucionales." : locale === "de" ? "Architektur bereit für Realdaten und institutionelle Partnerschaften." : "Architecture ready for real-world data and institutional partnerships."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-amber-200">
                <Handshake className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {locale === "es" ? "Escalabilidad" : locale === "de" ? "Skalierbarkeit" : "Scalability"}
                </span>
              </div>
              <p className="text-sm text-white/90">
                {locale === "es" ? "Modelo replicable por ciudad para expansión internacional." : locale === "de" ? "Replizierbares Modell pro Stadt für internationale Expansion." : "City-by-city replicable model for international expansion."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Streak Banner */}
      <StreakBanner />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Interactive Map Section */}
          <section
            ref={mapRef}
            className="glass-card p-2 overflow-hidden border-2 border-emerald-200/40 dark:border-emerald-900/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 mb-2">
              <div className="flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {t('interactiveMap')}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Flame className="h-3.5 w-3.5" />
                {locale === "es" ? "Experiencia central" : locale === "de" ? "Kern-Erlebnis" : "Core experience"}
              </span>
            </div>
            <p className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-300">
              {locale === "es" ? "Descubre iniciativas en tiempo real, filtra por impacto y entra directo a colaborar." : locale === "de" ? "Entdecke Initiativen in Echtzeit, filtere nach Wirkung und mach direkt mit." : "Discover initiatives in real time, filter by impact, and jump in to collaborate."}
            </p>
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              <Link href="/eventos/disponibles" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200">
                {locale === "es" ? "Eventos cercanos" : locale === "de" ? "Nahe Events" : "Nearby events"}
              </Link>
              <Link href="/proyectos-comunitarios" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200">
                {locale === "es" ? "Proyectos comunitarios" : locale === "de" ? "Community Projekte" : "Community projects"}
              </Link>
              <Link href="/explore" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200">
                {locale === "es" ? "Ver tendencias" : locale === "de" ? "Trends ansehen" : "See trends"}
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden h-[460px] md:h-[620px] shadow-inner bg-gray-100 dark:bg-gray-800 flex justify-center items-center">
              {showMap && isClient && typeof window !== 'undefined' ? (
                mapInView && mapProjects.length > 0 ? (
                  <InteractiveMap projects={mapProjects} region="europe" />
                ) : (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                    <span className="text-gray-500">Cargando mapa...</span>
                  </div>
                )
              ) : null}
            </div>
          </section>

          {/* Recommended Projects (Smart Matching) */}
          <RecommendedProjects />

          <section ref={featuredRef} className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="text-yellow-500">✨</span> {t('featuredProjects')}
              </h2>
              <Link
                href="/slider-demo"
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 flex items-center gap-1 transition-colors"
              >
                <Search className="w-4 h-4" />
                Demo Slider
              </Link>
            </div>
            {featuredInView ? <FeaturedProjectsSlider /> : <div className="h-64 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />}
          </section>
        </div>

        <div ref={leaderboardRef} className="space-y-8">
          {leaderboardInView ? <CityLeaderboard /> : <div className="h-64 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />}

          {/* Categories Mini-Grid */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              {t('categories')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/categorias/medio-ambiente" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-all hover:scale-105 group">
                <Sprout className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-semibold text-green-800 dark:text-green-300 block">{categoryLabel('environment', locale)}</span>
              </Link>
              <Link href="/categorias/educacion" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all hover:scale-105 group">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:-rotate-12 transition-transform" />
                <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 block">{categoryLabel('education', locale)}</span>
              </Link>
              <Link href="/categorias/comunidad" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all hover:scale-105 group">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-purple-800 dark:text-purple-300 block">{categoryLabel('community', locale)}</span>
              </Link>
              <Link href="/categorias/salud" className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:scale-105 group">
                <HeartPulse className="w-8 h-8 text-red-600 mx-auto mb-2 group-hover:pulse transition-transform" />
                <span className="text-xs font-semibold text-red-800 dark:text-red-300 block">{categoryLabel('health', locale)}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories (Full) */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-white/50 dark:to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-2 block">{t('exploreCategories')}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {t('categories')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/categorias/medio-ambiente"
              className="group glass-card p-8 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
            >
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                {t('environmentTitle')}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('environmentDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/educacion"
              className="group glass-card p-8 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                {t('educationTitle')}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('educationDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/comunidad"
              className="group glass-card p-8 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
            >
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                {t('communityTitle')}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('communityDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/salud"
              className="group glass-card p-8 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center mb-6 text-red-600 group-hover:scale-110 transition-transform duration-300">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                {t('healthTitle')}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('healthDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/oceanos"
              className="group glass-card p-8 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors"
            >
              <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/50 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 group-hover:scale-110 transition-transform duration-300">
                <Waves className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                {t('oceansTitle')}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('oceansDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/alimentacion"
              className="group glass-card p-8 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors"
            >
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform duration-300">
                <Apple className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                {t('foodTitle')}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('foodDescription')}
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section ref={socialRef}>
        {socialInView ? <SocialMediaFeed /> : <div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl m-4" />}
      </section>

      <section ref={tipsRef} className="py-20 px-4 bg-green-50/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-12">
            {t('ecoTipsTitle')}
          </h2>
          {tipsInView ? (
            <>
              <EcoTips />
              <div className="mt-12">
                <EcoTipsBulletPoints />
              </div>
            </>
          ) : (
            <div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 pattern-dots opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="mb-4 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
            {locale === "es" ? "Siguiente fase de crecimiento" : locale === "de" ? "Nächste Wachstumsphase" : "Next growth phase"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">
            {t('readyToMakeDifference')}
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-50/90 font-light">
            {t('readyDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => {
                if (user) {
                  router.push('/eventos');
                } else {
                  setAuthMode("register");
                  setIsAuthModalOpen(true);
                }
              }}
              className="bg-white text-green-600 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300"
            >
              {t('letsGo')}
            </button>
            <Link
              href="/chat"
              className="bg-transparent border-2 border-white/50 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              {t('joinCommunity')}
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80">
            {locale === "es"
              ? "Demo preparada para partners, instituciones y personas inversoras."
              : locale === "de"
                ? "Demo bereit für Partner, Institutionen und Investor*innen."
                : "Demo-ready for partners, institutions, and investors."}
          </p>
        </div>
      </section>

      {/* Welcome Modal */}
      {showWelcome && <WelcomeMessage onClose={() => setShowWelcome(false)} />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </div>
  );
}