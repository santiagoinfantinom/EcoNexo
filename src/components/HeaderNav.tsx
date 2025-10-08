"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export default function HeaderNav() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  return (
    <header className="grid place-items-center gap-2 px-6 py-4 relative">
      <div className="flex items-center gap-2 text-green-700 font-semibold">
        <span className="text-2xl">🌿</span>
        <span className="text-xl">{t("app")}</span>
      </div>
      <nav className="flex gap-4 text-sm">
        <Link className="hover:underline" href="/">{t("map")}</Link>
        <Link className="hover:underline" href="/eventos">{t("events")}</Link>
      </nav>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border px-3 py-1 text-sm bg-white/70 dark:bg-black/30 backdrop-blur"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}


