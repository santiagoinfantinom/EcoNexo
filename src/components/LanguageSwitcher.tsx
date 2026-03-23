"use client";
import { useI18n, Locale } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const FLAGS: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇬🇧",
  de: "🇩🇪",
};

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const order: Locale[] = ["en", "de", "es"];
  const next = order[(order.indexOf(locale) + 1) % order.length];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className}`}>
        <button
          aria-label="Change language"
          className="h-8 w-8 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-sm"
        >
          🌐
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-4 z-[100] flex flex-col gap-2">
      <button
        aria-label="Change language"
        onClick={() => { setLocale(next); try { trackEvent('language_change', { to: next }); } catch { } }}
        className="h-10 w-10 rounded-full bg-white/95 backdrop-blur border-2 border-green-500 shadow-lg flex items-center justify-center text-lg hover:scale-110 transition-transform"
        title={next.toUpperCase()}
      >
        {FLAGS[locale]}
      </button>
    </div>
  );
}


