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
      <header className="bg-gls-primary text-gls-primary px-6 py-4 relative">
        <div className="flex items-center justify-center relative">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌿</span>
            <span className="text-2xl text-brand font-black text-gls-primary">EcoNexo</span>
          </div>
        </div>
        <nav className="flex gap-6 text-base mt-4 justify-center">
          <Link href="/" className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium">MAP</Link>
          <Link href="/eventos" className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium">EVENTS</Link>
          <Link href="/calendario" className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium">📅 CALENDAR</Link>
          <Link href="/trabajos" className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium">JOBS</Link>
          <Link href="/chat" className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium">CHAT</Link>
          <Link href="/comunidad" className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium">👥 COMMUNITY</Link>
          <Link href="/perfil" className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium">PROFILE</Link>
          <Link href="/about" className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium">ABOUT US</Link>
        </nav>
      </header>
    );
  }

  return (
    <>
      {showWelcome && <WelcomeMessage onClose={handleCloseWelcome} />}
      <header className="bg-gls-primary text-gls-primary px-6 py-4 relative">
      {/* Brand block estilo GLS Bank */}
      <div className="flex items-center justify-center relative">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <span className="text-2xl text-brand font-black text-gls-primary">{t("app")}</span>
        </div>
        
        {/* Auth button a la izquierda */}
        <div className="absolute left-0 sm:left-3 md:left-6 top-0 h-full flex items-center">
          <AuthButton variant="outline" size="sm" />
        </div>

        {/* CTA a la derecha */}
        <div className="absolute right-2 md:right-4 flex items-center gap-2">
          <button className="btn-gls-primary">
            {t("supportUs")} 💚
          </button>
        </div>
      </div>
      <nav className="flex gap-6 text-base mt-4 justify-center">
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/"
        >
          {t("map")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/eventos"
        >
          {t("events")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/calendario"
        >
          📅 {t("calendar")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/trabajos"
        >
          {t("jobs")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/chat"
        >
          {t("chat")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/comunidad"
        >
          {locale === 'es' ? '👥 Comunidad' : locale === 'de' ? '👥 Gemeinschaft' : '👥 Community'}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/perfil"
        >
          {t("profile")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/about"
        >
          {t("aboutUs")}
        </Link>
      </nav>
    </header>
    </>
  );
}


