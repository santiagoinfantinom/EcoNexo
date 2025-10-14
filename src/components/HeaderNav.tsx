"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import EcoTips from "./EcoTips";
import { useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import { useAuth } from "@/lib/auth";

export default function HeaderNav() {
  const { t } = useI18n();
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, loading, signInWithMagicLink, signInWithOAuth, signOut } = useAuth();
  const [email, setEmail] = useState("");

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
      <div className="flex items-center justify-center relative">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <span className="text-2xl text-brand font-black text-gls-primary">{t("app")}</span>
        </div>
        
        {/* Área de auth y CTA */}
        <div className="absolute right-0 flex items-center gap-2">
          {!loading && !user && (
            <div className="flex items-center gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                className="px-2 py-1 rounded bg-white/80 text-slate-800 text-sm"
              />
              <button
                onClick={async () => {
                  if (!email) return;
                  const { error } = await signInWithMagicLink(email);
                  alert(error ? t("emailInvalid") : t("checkYourEmail"));
                }}
                className="btn-gls-primary"
              >
                {t("login")}
              </button>
              <button
                onClick={async () => { await signInWithOAuth("google"); }}
                className="btn-gls-secondary"
                title="Google"
              >
                G
              </button>
            </div>
          )}
          {!loading && user && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{user.email}</span>
              <button onClick={async () => { await signOut(); }} className="btn-gls-secondary">
                {t("logout")}
              </button>
            </div>
          )}
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
    </header>
    </>
  );
}


