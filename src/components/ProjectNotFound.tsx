"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function ProjectNotFound() {
  const { t, locale } = useI18n();
  
  return (
    <div className="grid gap-4">
      <div className="text-lg font-semibold">
        {locale === 'es' ? "Proyecto no encontrado" : 
         locale === 'de' ? "Projekt nicht gefunden" : 
         "Project not found"}
      </div>
      <Link href="/" className="text-green-700 underline w-fit">
        {locale === 'es' ? "Volver al mapa" : 
         locale === 'de' ? "Zurück zur Karte" : 
         "Back to map"}
      </Link>
    </div>
  );
}
