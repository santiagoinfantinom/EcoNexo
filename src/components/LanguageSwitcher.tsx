"use client";
import { useI18n, Locale } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const FLAGS: Record<Locale, string> = { es: "🇪🇸", en: "🇬🇧", de: "🇩🇪" };

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const order: Locale[] = ["en", "es", "de"];
  const next = order[(order.indexOf(locale) + 1) % order.length];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder during SSR to avoid hydration mismatch
    return (
      <div className="fixed left-4 top-4 z-[100] flex flex-col gap-2">
        <button
          aria-label="Change language"
          className="h-12 w-12 rounded-full bg-white/95 backdrop-blur border-2 border-green-500 shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
          title="DE"
        >
          🇩🇪
        </button>
        <button
          className="h-8 w-8 rounded-full bg-red-500/90 backdrop-blur border border-red-600 shadow-lg flex items-center justify-center text-xs hover:scale-110 transition-transform text-white"
          title="Reset onboarding"
        >
          ↻
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-4 z-[100] flex flex-col gap-2">
      <button
        aria-label="Change language"
        onClick={() => { setLocale(next); try { trackEvent('language_change', { to: next }); } catch {} }}
        className="h-12 w-12 rounded-full bg-white/95 backdrop-blur border-2 border-green-500 shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
        title={next.toUpperCase()}
      >
        {FLAGS[locale]}
      </button>
      
      {/* Temporary reset button for testing */}
      <button
        onClick={() => {
          localStorage.removeItem('econexo-onboarding-completed');
          localStorage.removeItem('econexo-language-set');
          localStorage.removeItem('econexo-onboarding-last-seen');
          window.location.reload();
        }}
        className="h-8 w-8 rounded-full bg-red-500/90 backdrop-blur border border-red-600 shadow-lg flex items-center justify-center text-xs hover:scale-110 transition-transform text-white"
        title="Reset onboarding"
      >
        ↻
      </button>
    </div>
  );
}


