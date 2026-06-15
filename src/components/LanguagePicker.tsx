"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useI18n, type Locale } from "@/lib/i18n";
import { markLanguageIntroComplete } from "@/lib/onboardingStorage";
import { trackEvent } from "@/lib/analytics";

const OPTIONS: { locale: Locale; label: string; flag: string }[] = [
  { locale: "en", label: "English", flag: "🇬🇧" },
  { locale: "de", label: "Deutsch", flag: "🇩🇪" },
  { locale: "es", label: "Español", flag: "🇪🇸" },
];

type LanguagePickerProps = {
  variant?: "compact" | "intro";
  className?: string;
  onSelect?: (locale: Locale) => void;
};

export default function LanguagePicker({
  variant = "compact",
  className = "",
  onSelect,
}: LanguagePickerProps) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.locale === locale) ?? OPTIONS[0];

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const selectLocale = (next: Locale) => {
    if (next !== locale) {
      setLocale(next);
      markLanguageIntroComplete();
      window.dispatchEvent(new Event("econexo-locale-changed"));
      try {
        trackEvent("language_change", { to: next });
      } catch {
        /* optional */
      }
      onSelect?.(next);
    }
    setOpen(false);
  };

  if (variant === "intro") {
    return (
      <IntroLanguageGrid
        className={className}
        locale={locale}
        onSelect={selectLocale}
        hint={t("changeLanguage")}
      />
    );
  }

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button
        type="button"
        aria-label={t("changeLanguage")}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 h-10 px-3 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur border border-emerald-500/40 shadow-lg text-sm font-semibold text-emerald-900 dark:text-emerald-100 hover:border-emerald-500 transition-colors"
      >
        <Globe className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline uppercase tracking-wide text-xs">
          {current.locale}
        </span>
        <ChevronDown
          className={`w-4 h-4 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <LanguageDropdown locale={locale} onSelect={selectLocale} />
      )}
    </div>
  );
}

function IntroLanguageGrid({
  className,
  locale,
  onSelect,
  hint,
}: {
  className: string;
  locale: Locale;
  onSelect: (l: Locale) => void;
  hint: string;
}) {
  return (
    <div className={`grid gap-3 ${className}`}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.locale}
          type="button"
          onClick={() => onSelect(opt.locale)}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 text-lg font-semibold transition-all ${
            locale === opt.locale
              ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md"
              : "border-gray-200 bg-white text-gray-800 hover:border-emerald-300 hover:bg-emerald-50/50"
          }`}
        >
          <span className="text-2xl">{opt.flag}</span>
          <span>{opt.label}</span>
        </button>
      ))}
      <p className="text-xs text-center text-gray-500 mt-1">{hint}</p>
    </div>
  );
}

function LanguageDropdown({
  locale,
  onSelect,
}: {
  locale: Locale;
  onSelect: (l: Locale) => void;
}) {
  return (
    <div
      role="listbox"
      className="absolute right-0 mt-2 min-w-[168px] rounded-xl border border-emerald-500/20 bg-white dark:bg-slate-900 shadow-xl overflow-hidden z-[200]"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.locale}
          type="button"
          role="option"
          aria-selected={locale === opt.locale}
          onClick={() => onSelect(opt.locale)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
            locale === opt.locale
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
          }`}
        >
          <span className="text-lg">{opt.flag}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
