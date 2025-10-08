"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export default function HeaderNav() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  return (
    <header className="grid place-items-center gap-3 px-6 py-6 relative bg-gradient-to-b from-transparent to-transparent">
      <div className="flex items-center gap-3 text-green-600 dark:text-green-400 text-brand">
        <span className="text-3xl">🌿</span>
        <span className="text-2xl">{t("app")}</span>
      </div>
      <nav className="flex gap-6 text-base">
        <Link 
          className="text-nav hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 text-gray-700 dark:text-gray-300" 
          href="/"
        >
          {t("map")}
        </Link>
        <Link 
          className="text-nav hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 text-gray-700 dark:text-gray-300" 
          href="/eventos"
        >
          {t("events")}
        </Link>
      </nav>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}


