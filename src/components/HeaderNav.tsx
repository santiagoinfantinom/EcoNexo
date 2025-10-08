"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import EcoTips from "./EcoTips";

export default function HeaderNav() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  return (
    <header className="grid place-items-center gap-3 px-6 py-6 relative bg-gradient-to-b from-transparent via-transparent to-transparent">
      <div className="flex items-center gap-3 dark:text-slate-300 text-brand font-black" style={{ color: '#000000' }}>
        <span className="text-3xl">🌿</span>
        <span className="text-2xl">{t("app")}</span>
      </div>
      <nav className="flex gap-6 text-base">
        <Link 
          className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400" 
          href="/"
        >
          {t("map")}
        </Link>
        <Link 
          className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400" 
          href="/eventos"
        >
          {t("events")}
        </Link>
        <EcoTips />
      </nav>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 shadow-sm hover:shadow-md text-slate-600 dark:text-slate-300"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}


