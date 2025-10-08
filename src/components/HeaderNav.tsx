"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import EcoTips from "./EcoTips";

export default function HeaderNav() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  return (
    <header className="grid place-items-center gap-6 px-6 py-6 relative bg-gradient-to-b from-transparent via-transparent to-transparent">
      {/* Brand block with persistent white background */}
      <div className="rounded-xl bg-white shadow-sm px-4 py-2">
        <div className="flex items-center gap-3 text-black text-brand font-black">
          <span className="text-3xl">🌿</span>
          <span className="text-2xl" style={{ 
            color: '#000000',
            textShadow: '0.5px 0.5px 0 white, -0.5px -0.5px 0 white, 0.5px -0.5px 0 white, -0.5px 0.5px 0 white',
            WebkitTextStroke: '0.5px white'
          }}>{t("app")}</span>
        </div>
      </div>
      <nav className="flex gap-6 text-base mt-2 md:mt-4">
        <Link 
          className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400" 
          href="/"
        >
          {t("map")}
        </Link>
        <Link 
          className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400" 
          href="/calendario"
        >
          {t("calendar")}
        </Link>
        <Link 
          className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400" 
          href="/eventos"
        >
          {t("events")}
        </Link>
        <Link 
          className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400" 
          href="/trabajos"
        >
          {t("jobs")}
        </Link>
        <Link 
          className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400" 
          href="/chat"
        >
          {t("chat")}
        </Link>
        <Link 
          className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400" 
          href="/perfil"
        >
          {t("profile")}
        </Link>
        <EcoTips />
      </nav>
      
      {/* Support Us Button */}
      <button
        onClick={() => window.open('https://www.paypal.com/donate/?hosted_button_id=ECONEXO_DONATE_BUTTON', '_blank')}
        className="absolute right-6 top-6 rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all duration-200 shadow-sm hover:shadow-md text-slate-600 dark:text-slate-300 font-medium"
        title={t("supportUs")}
        aria-label={t("supportUs")}
      >
        💚 {t("supportUs")}
      </button>
      
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute right-6 top-20 rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 shadow-sm hover:shadow-md text-slate-600 dark:text-slate-300"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}


