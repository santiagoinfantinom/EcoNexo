"use client";
import { useI18n, Locale } from "@/lib/i18n";

const FLAGS: Record<Locale, string> = { es: "🇪🇸", en: "🇬🇧", de: "🇩🇪" };

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const order: Locale[] = ["es", "en", "de"];
  const next = order[(order.indexOf(locale) + 1) % order.length];
  return (
    <button
      aria-label="Change language"
      onClick={() => setLocale(next)}
      className="fixed left-4 top-4 z-50 h-10 w-10 rounded-full bg-white/90 backdrop-blur border shadow flex items-center justify-center text-xl"
      title={next.toUpperCase()}
    >
      {FLAGS[locale]}
    </button>
  );
}


