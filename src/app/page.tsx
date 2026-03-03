"use client";

import { useI18n, categoryLabel } from "@/lib/i18n";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import WelcomeMessage from "@/components/WelcomeMessage";
import AuthModal from "@/components/AuthModal";
import FeaturedProjectsSlider from "@/components/FeaturedProjectsSlider";
import EcoTips from "@/components/EcoTips";
import EcoTipsBulletPoints from "@/components/EcoTipsBulletPoints";
import SocialMediaFeed from "@/components/SocialMediaFeed";
import { PROJECTS } from "@/data/projects";
import { useState, useEffect } from "react";
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
  ArrowRight
} from "lucide-react";

// New Smart Components
import GamificationHub from "@/components/GamificationHub";
import PreferencesModal from "@/components/PreferencesModal";
import RecommendedProjects from "@/components/RecommendedProjects";
import CityLeaderboard from "@/components/CityLeaderboard";

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

  // Context Hook
  const { showOnboarding, completeOnboarding } = useSmartContext();

  useEffect(() => {
    setIsClient(true);
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

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-sm">
              {t('welcomeMessageTitle')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              {t('welcomeMessageDescription')}
            </p>

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
                {t('exploreEvents')}
              </Link>

              <Link
                href="/trabajos"
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                {t('findJobs')}
              </Link>

            </div>
          </div>

          {/* Stats Cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">{t('activeProjects')}</div>
            </div>
            <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">{t('volunteers')}</div>
            </div>
            <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">{t('cities')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Projects (Smart Matching) */}
      <RecommendedProjects />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Interactive Map Section */}
          {showMap && isClient && typeof window !== 'undefined' && (
            <section
              className="glass-card p-2 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 mb-2">
                <MapIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {t('interactiveMap')}
                </h2>
              </div>
              <div className="rounded-xl overflow-hidden h-[400px] md:h-[500px] shadow-inner">
                <InteractiveMap projects={PROJECTS} region="europe" />
              </div>
            </section>
          )}

          {/* Featured Projects */}
          <section className="glass-card p-6 sm:p-8">
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
            <FeaturedProjectsSlider />
          </section>
        </div>

        {/* Sidebar Column: Leaderboard & Categories */}
        <div className="space-y-8">
          <CityLeaderboard />

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

      <SocialMediaFeed />

      {/* Eco Tips */}
      <section className="py-20 px-4 bg-green-50/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-12">
            {t('ecoTipsTitle')}
          </h2>
          <EcoTips />
          <div className="mt-12">
            <EcoTipsBulletPoints />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 pattern-dots opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
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