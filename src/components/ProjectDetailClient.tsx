"use client";
import React from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { useI18n, projectNameLabel, locationLabel, categoryLabel, projectDescriptionLabel, impactTagLabel } from "@/lib/i18n";
import ProjectImage from "@/components/ProjectImage";
import { useAuth } from "@/lib/auth";
import { useSmartContext } from "@/context/SmartContext";

export default function ProjectDetailClient({ id, details, impactTags, paypalLink, stripeLink }: any) {
  const { t, locale } = useI18n();

return (
    <div className="p-8 text-white max-w-4xl mx-auto">
      {/* TÍTULO */}
      <h1 className="text-4xl font-bold mb-4">
        {locale === 'en' ? details.name_en : locale === 'de' ? details.name_de : details.name}
      </h1>
      
      {/* DATOS BÁSICOS */}
      <div className="space-y-4 bg-white/10 p-6 rounded-lg mb-8">
        <p><strong>{t("city")}:</strong> {details.city}</p>
        <p><strong>{t("volunteers")}:</strong> {details.volunteers}</p>
        
        {/* SECCIÓN DE DINERO RECAUDADO */}
        <div className="flex items-center gap-3 border-t border-white/20 pt-4 mt-4">
          <span className="text-3xl">💰</span>
          <div>
            <p className="text-sm opacity-80">{t("raised")} / {t("goal")}</p>
            <p className="text-xl font-bold">
              {details.budgetRaisedEur}€ / {details.budgetGoalEur}€
            </p>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">{t("description")}</h2>
        <p className="text-lg leading-relaxed">
          {locale === 'en' ? details.description_en : locale === 'de' ? details.description_de : details.description}
        </p>
      </div>

      {/* BOTÓN VOLVER */}
      <div className="mt-10">
        <BackButton href="/" label={t("backToMap") as string} />
      </div>
    </div>
  );
}