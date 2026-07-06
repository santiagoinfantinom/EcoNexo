"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import EcoNexoLogo from "./EcoNexoLogo";

export default function CreateEventFAB() {
  const { t } = useI18n();
  return (
    <Link
      href="/eventos"
      className="fixed bottom-6 right-6 z-[999] inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
      aria-label={t("createEvent")}
    >
      <EcoNexoLogo size={24} className="bg-white/20 p-1" />
      <span className="hidden sm:block font-semibold">{t("createEvent")}</span>
    </Link>
  );
}


