"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function HeaderNav() {
  const { t } = useI18n();
  return (
    <header className="grid place-items-center gap-2 px-6 py-4 border-b">
      <div className="flex items-center gap-2 text-green-700 font-semibold">
        <span className="text-2xl">🌿</span>
        <span className="text-xl">{t("app")}</span>
      </div>
      <nav className="flex gap-4 text-sm">
        <Link className="hover:underline" href="/">{t("map")}</Link>
        <Link className="hover:underline" href="/eventos">{t("events")}</Link>
      </nav>
    </header>
  );
}


