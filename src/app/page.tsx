"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import WelcomeMessage from "@/components/WelcomeMessage";
import FeaturedProjectsSlider from "@/components/FeaturedProjectsSlider";
import EcoTips from "@/components/EcoTips";
import EcoTipsBulletPoints from "@/components/EcoTipsBulletPoints";
import { PROJECTS } from "@/data/projects";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import("@/components/EuropeMap").then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-600 via-green-700 to-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t('welcomeMessageTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-95 max-w-4xl mx-auto mb-8">
            {t('welcomeMessageDescription')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => setShowMap(!showMap)}
              className="btn-gls-primary text-lg px-8 py-4"
            >
              {showMap ? t('hideMap') : t('showMap')}
            </button>
            <Link 
              href="/eventos"
              className="btn-gls-secondary text-lg px-8 py-4"
            >
              {t('exploreEvents')}
            </Link>
            <Link 
              href="/trabajos"
              className="btn-gls-secondary text-lg px-8 py-4"
            >
              {t('findJobs')}
            </Link>
          </div>

          <div className="content-separator" />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-800 dark:text-white font-medium">{t('activeProjects')}</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-800 dark:text-white font-medium">{t('volunteers')}</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-800 dark:text-white font-medium">{t('cities')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      {showMap && isClient && (
        <section className="py-8 px-6 md:px-10 xl:px-16 bg-white/50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-8">
              🗺️ {t('interactiveMap')}
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden" style={{ height: "650px", width: "100%" }}>
              {/* 
                Map region options:
                - region="europe" (default)
                - region="americas" (entire Americas)
                - region="northAmerica" (USA/Canada/Mexico)
                - region="southAmerica" (South America)
                - region="asia" or region="africa"
                Or use custom: center={[lat, lng]} zoom={level}
              */}
              <InteractiveMap projects={PROJECTS} region="europe" />
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-12">
            {t('featuredProjects')}
          </h2>
          <FeaturedProjectsSlider />
        </div>
      </section>

      {/* Categories */}
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
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('readyToMakeDifference')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('readyDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowWelcome(true)}
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
    </div>
  );
}