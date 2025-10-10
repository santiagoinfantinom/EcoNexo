"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import EcoTips from "./EcoTips";
import { useState } from "react";
import WelcomeMessage from "./WelcomeMessage";

export default function HeaderNav() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(false);

  const handleShowWelcome = () => {
    setShowWelcome(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {showWelcome && <WelcomeMessage onClose={handleCloseWelcome} />}
      <header className="bg-gls-primary text-gls-primary px-6 py-4 relative">
      {/* Brand block estilo GLS Bank */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <span className="text-2xl text-brand font-black text-gls-primary">{t("app")}</span>
        </div>
        
        {/* Botón principal estilo GLS Bank */}
        <button className="btn-gls-primary">
          {t("supportUs")} 💚
        </button>
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
          href="/calendario"
        >
          {t("calendar")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/eventos"
        >
          {t("events")}
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
          href="/perfil"
        >
          {t("profile")}
        </Link>
        <EcoTips />
        <button
          onClick={handleShowWelcome}
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium"
          title={t("about")}
        >
          {t("about")}
        </button>
      </nav>
      
      {/* Theme Toggle estilo Ecosia */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute right-6 top-6 btn-gls-secondary text-sm"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
    </>
  );
}


