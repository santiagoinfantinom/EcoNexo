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
import { PROJECTS } from "@/data/projects";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSmartContext } from "@/context/SmartContext";

// New Smart Components
import GamificationHub from "@/components/GamificationHub";
import PreferencesModal from "@/components/PreferencesModal";
import RecommendedProjects from "@/components/RecommendedProjects";
import CityLeaderboard from "@/components/CityLeaderboard";

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(
  () => import("@/components/EuropeMap").then(mod => ({ default: mod.default })).catch(err => {
    console.error('Error loading EuropeMap:', err);
    // Return a fallback component if the map fails to load
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 relative">

      {/* Gamification Sidebar */}
      <GamificationHub />

      {/* Onboarding Modal */}
      <PreferencesModal
        isOpen={showOnboarding}
        onClose={completeOnboarding}
      />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4" style={{
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 25%, #0ea5e9 50%, #0284c7 75%, #0369a1 100%)'
      }}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            {t('welcomeMessageTitle')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white opacity-95 max-w-4xl mx-auto mb-6 sm:mb-8 px-2">
            {t('welcomeMessageDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <button
              onClick={() => setShowMap(!showMap)}
              className="btn-gls-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px]"
            >
              {showMap ? t('hideMap') : t('showMap')}
            </button>
            <Link
              href="/eventos"
              className="btn-gls-secondary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] inline-block text-center"
            >
              {t('exploreEvents')}
            </Link>
            <Link
              href="/trabajos"
              className="btn-gls-secondary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] inline-block text-center"
            >
              {t('findJobs')}
            </Link>
          </div>

          <div className="content-separator" />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">500+</div>
              <div className="text-sm sm:text-base text-gray-800 dark:text-white font-medium">{t('activeProjects')}</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">2,500+</div>
              <div className="text-sm sm:text-base text-gray-800 dark:text-white font-medium">{t('volunteers')}</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">50+</div>
              <div className="text-sm sm:text-base text-gray-800 dark:text-white font-medium">{t('cities')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Projects (Smart Matching) */}
      <RecommendedProjects />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Interactive Map Section */}
          {showMap && isClient && typeof window !== 'undefined' && (
            <section className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 px-3 sm:px-4 pt-3 sm:pt-4">
                🗺️ {t('interactiveMap')}
              </h2>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden h-[300px] sm:h-[400px] md:h-[500px]">
                <InteractiveMap projects={PROJECTS} region="europe" />
              </div>
            </section>
          )}

          {/* Featured Projects */}
          <section className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {t('featuredProjects')}
              </h2>
              <Link
                href="/slider-demo"
                className="text-sm text-green-600 dark:text-green-400 hover:underline opacity-70 hover:opacity-100"
                title="Ver página de demo del slider"
              >
                🔍 Demo
              </Link>
            </div>
            <FeaturedProjectsSlider />
          </section>
        </div>

        {/* Sidebar Column: Leaderboard & Categories */}
        <div className="space-y-8">
          <CityLeaderboard />

          {/* Categories Mini-Grid */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('categories')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/categorias/medio-ambiente" className="p-3 bg-green-50 dark:bg-slate-700/50 rounded-lg text-center hover:bg-green-100 transition-colors">
                <div className="text-2xl mb-1">🌱</div>
                <span className="text-xs font-medium">{categoryLabel('environment', locale)}</span>
              </Link>
              <Link href="/categorias/educacion" className="p-3 bg-blue-50 dark:bg-slate-700/50 rounded-lg text-center hover:bg-blue-100 transition-colors">
                <div className="text-2xl mb-1">📚</div>
                <span className="text-xs font-medium">{categoryLabel('education', locale)}</span>
              </Link>
              <Link href="/categorias/comunidad" className="p-3 bg-purple-50 dark:bg-slate-700/50 rounded-lg text-center hover:bg-purple-100 transition-colors">
                <div className="text-2xl mb-1">🤝</div>
                <span className="text-xs font-medium">{categoryLabel('community', locale)}</span>
              </Link>
              <Link href="/categorias/salud" className="p-3 bg-red-50 dark:bg-slate-700/50 rounded-lg text-center hover:bg-red-100 transition-colors">
                <div className="text-2xl mb-1">🏥</div>
                <span className="text-xs font-medium">{categoryLabel('health', locale)}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories (Full) */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-12">
            {t('exploreCategories')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/categorias/medio-ambiente"
              className="group bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                {t('environmentTitle')}
              </h3>
              <p className="text-green-700 dark:text-green-300">
                {t('environmentDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/educacion"
              className="group bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                {t('educationTitle')}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {t('educationDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/comunidad"
              className="group bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                {t('communityTitle')}
              </h3>
              <p className="text-purple-700 dark:text-purple-300">
                {t('communityDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/salud"
              className="group bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
                {t('healthTitle')}
              </h3>
              <p className="text-red-700 dark:text-red-300">
                {t('healthDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/oceanos"
              className="group bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900 dark:to-cyan-800 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-bold text-cyan-800 dark:text-cyan-200 mb-2">
                {t('oceansTitle')}
              </h3>
              <p className="text-cyan-700 dark:text-cyan-300">
                {t('oceansDescription')}
              </p>
            </Link>

            <Link
              href="/categorias/alimentacion"
              className="group bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">🍎</div>
              <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-2">
                {t('foodTitle')}
              </h3>
              <p className="text-orange-700 dark:text-orange-300">
                {t('foodDescription')}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Eco Tips */}
      <section className="py-16 px-4 bg-green-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-12">
            {t('ecoTipsTitle')}
          </h2>
          <EcoTips />
          <EcoTipsBulletPoints />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-white" style={{
        background: 'linear-gradient(90deg, #16a34a 0%, #15803d 20%, #0ea5e9 50%, #0284c7 80%, #0369a1 100%)'
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('readyToMakeDifference')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('readyDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                // Si el usuario está autenticado, redirigir a eventos
                if (user) {
                  router.push('/eventos');
                } else {
                  // Si no está autenticado, abrir modal de registro
                  setAuthMode("register");
                  setIsAuthModalOpen(true);
                }
              }}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('letsGo')}
            </button>
            <Link
              href="/chat"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
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