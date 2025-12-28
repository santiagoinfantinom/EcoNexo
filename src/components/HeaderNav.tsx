"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import EcoTips from "./EcoTips";
import { useEffect, useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import NotificationConsent from "./NotificationConsent";
import AuthButton from "./AuthButton";

export default function HeaderNav() {
  const { t, locale } = useI18n();
  const [showWelcome, setShowWelcome] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShowWelcome = () => {
    setShowWelcome(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  // Prevent hydration mismatch by ensuring consistent rendering
  if (!mounted) {
    return (
      <header className="bg-gls-primary text-gls-primary px-4 sm:px-6 lg:px-8 py-5 sm:py-6 relative shadow-lg">
        <div className="flex items-center justify-center mb-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-4xl sm:text-5xl drop-shadow-lg">🌿</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl text-brand font-black text-gls-primary tracking-tight drop-shadow-sm">
              EcoNexo
            </span>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-5"></div>
        <div className="flex items-center justify-between px-2 sm:px-4 mb-4">
          <div className="flex items-center">
            <AuthButton variant="outline" size="sm" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="btn-gls-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 shadow-md hover:shadow-lg">
              Support Us <span className="ml-1">💚</span>
            </button>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 lg:gap-8 xl:gap-10 text-sm lg:text-base mt-5 justify-center flex-wrap pb-2">
          <Link href="/" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">🗺️</span> MAP</Link>
          <Link href="/calendario" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">📅</span> CALENDAR</Link>
          <Link href="/trabajos" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">💼</span> JOBS</Link>
          <Link href="/chat" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">💬</span> CHAT</Link>
          <Link href="/matching" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">🎯</span> MATCHING</Link>
          <Link href="/rooms" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">🏠</span> ROOMS</Link>
          <Link href="/comunidad" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">👥</span> COMMUNITY</Link>
          <Link href="/perfil" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">👤</span> PROFILE</Link>
          <Link href="/about" className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10"><span className="mr-1">ℹ️</span> ABOUT US</Link>
        </nav>
      </header>
    );
  }

  return (
    <>
      {showWelcome && <WelcomeMessage onClose={handleCloseWelcome} />}
      <header className="bg-gls-primary text-gls-primary px-4 sm:px-6 lg:px-8 py-5 sm:py-6 relative shadow-lg">
      {/* Brand block estilo GLS Bank - Sin botones superpuestos */}
      <div className="flex items-center justify-center mb-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-4xl sm:text-5xl drop-shadow-lg">🌿</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl text-brand font-black text-gls-primary tracking-tight drop-shadow-sm">
            {t("app")}
          </span>
        </div>
      </div>
      
      {/* Separador sutil */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-5"></div>
      
      {/* Botones de acción debajo del banner */}
      <div className="flex items-center justify-between px-2 sm:px-4 mb-4">
        {/* Auth button a la izquierda */}
        <div className="flex items-center">
          <AuthButton variant="outline" size="sm" />
        </div>

        {/* CTA a la derecha */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="btn-gls-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 shadow-md hover:shadow-lg">
            {t("supportUs")} <span className="ml-1">💚</span>
          </button>
        </div>
      </div>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-center mt-3 mb-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/15 dark:bg-slate-700/50 rounded-xl text-gls-primary font-semibold hover:bg-white/25 dark:hover:bg-slate-700 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm border border-white/20"
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          <span className="text-sm">{mobileMenuOpen ? t("close") || "Cerrar" : t("menu") || "Menú"}</span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 mb-4 glass rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          <nav className="flex flex-col py-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="touch-target px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 border-b border-gray-200/50 dark:border-slate-700/50 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">🗺️</span> {t("map")}
            </Link>
            <Link
              href="/calendario"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 border-b border-gray-200/50 dark:border-slate-700/50 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">📅</span> {t("calendar")}
            </Link>
            <Link
              href="/trabajos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 border-b border-gray-200/50 dark:border-slate-700/50 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">💼</span> {t("jobs")}
            </Link>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 border-b border-gray-200/50 dark:border-slate-700/50 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">💬</span> {t("chat")}
            </Link>
            <Link
              href="/matching"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 border-b border-gray-200/50 dark:border-slate-700/50 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">🎯</span> {locale === 'es' ? 'Matching' : locale === 'de' ? 'Matching' : 'Matching'}
            </Link>
            <Link
              href="/rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 border-b border-gray-200/50 dark:border-slate-700/50 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">🏠</span> {locale === 'es' ? 'Rooms' : locale === 'de' ? 'Räume' : 'Rooms'}
            </Link>
            <Link
              href="/comunidad"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 border-b border-gray-200/50 dark:border-slate-700/50 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">👥</span> {locale === 'es' ? 'Comunidad' : locale === 'de' ? 'Gemeinschaft' : 'Community'}
            </Link>
            <Link
              href="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 border-b border-gray-200/50 dark:border-slate-700/50 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">👤</span> {t("profile")}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3.5 text-gls-primary font-semibold hover:bg-green-50/80 dark:hover:bg-slate-700/80 transition-all duration-150 active:bg-green-100 dark:active:bg-slate-600"
            >
              <span className="mr-2">ℹ️</span> {t("aboutUs")}
            </Link>
          </nav>
        </div>
      )}

      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden md:flex gap-6 lg:gap-8 xl:gap-10 text-sm lg:text-base mt-5 justify-center flex-wrap pb-2">
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15 hover-lift" 
          href="/"
        >
          <span className="mr-1">🗺️</span> {t("map")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15" 
          href="/calendario"
        >
          <span className="mr-1">📅</span> {t("calendar")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15" 
          href="/trabajos"
        >
          <span className="mr-1">💼</span> {t("jobs")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15" 
          href="/chat"
        >
          <span className="mr-1">💬</span> {t("chat")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15" 
          href="/matching"
        >
          <span className="mr-1">🎯</span> {locale === 'es' ? 'Matching' : locale === 'de' ? 'Matching' : 'Matching'}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15" 
          href="/rooms"
        >
          <span className="mr-1">🏠</span> {locale === 'es' ? 'Rooms' : locale === 'de' ? 'Räume' : 'Rooms'}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15" 
          href="/comunidad"
        >
          <span className="mr-1">👥</span> {locale === 'es' ? 'Comunidad' : locale === 'de' ? 'Gemeinschaft' : 'Community'}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15" 
          href="/perfil"
        >
          <span className="mr-1">👤</span> {t("profile")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-all duration-200 text-gls-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 active:bg-white/15" 
          href="/about"
        >
          <span className="mr-1">ℹ️</span> {t("aboutUs")}
        </Link>
      </nav>
    </header>
    </>
  );
}


