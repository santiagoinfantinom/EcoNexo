"use client";
import { useI18n, Locale } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const FLAGS: Record<Locale, string> = { es: "🇪🇸", en: "🇬🇧", de: "🇩🇪" };

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const order: Locale[] = ["es", "en", "de"];
  const next = order[(order.indexOf(locale) + 1) % order.length];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder during SSR to avoid hydration mismatch
    return (
      <button
        aria-label="Change language"
        className="fixed left-4 top-4 z-50 h-10 w-10 rounded-full bg-white/90 backdrop-blur border shadow flex items-center justify-center text-xl"
        title="DE"
      >
        🇩🇪
      </button>
    );
  }

  return (
    <button
      aria-label="Change language"
      onClick={() => { setLocale(next); try { trackEvent('language_change', { to: next }); } catch {} }}
      className="fixed left-4 top-4 z-50 h-10 w-10 rounded-full bg-white/90 backdrop-blur border shadow flex items-center justify-center text-xl"
      title={next.toUpperCase()}
    >
      {FLAGS[locale]}
    </button>
  );
}


