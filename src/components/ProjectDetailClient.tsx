"use client";
import React from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { useI18n } from "@/lib/i18n";

const LANG_KEY: Record<string, string> = { es: "spanish", en: "english", de: "german" };

export default function ProjectDetailClient({ id, details, impactTags, paypalLink, stripeLink }: any) {
  const { t, locale } = useI18n();

  // The testimonial is always stored in its original language plus translated
  // variants (same _en/_de convention as name/description). Fall back to a
  // translated default when a project has no testimonial of its own yet.
  const testimonialLang: "es" | "en" | "de" = details.testimonial ? (details.testimonialLang || "es") : "es";
  const testimonialText = details.testimonial
    ? (locale === "en" ? details.testimonial_en || details.testimonial
      : locale === "de" ? details.testimonial_de || details.testimonial
        : details.testimonial)
    : t("defaultTestimonial");
  const volunteerName = details.volunteerName || t("defaultVolunteerName");

  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
      {/* TÍTULO */}
      <h1 className="text-4xl font-bold mb-4">
        {locale === 'en' ? details.name_en : locale === 'de' ? details.name_de : details.name}
      </h1>
      
      {/* SECCIÓN DE DINERO Y BARRA DE PROGRESO */}
      <div className="bg-white/10 p-6 rounded-lg mb-8">
        <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-4">
          <span className="text-3xl">💰</span>
          <div className="w-full">
            <div className="flex justify-between text-sm opacity-80">
              <span>{t("raised")}</span>
              <span>{Math.floor((details.budgetRaisedEur / details.budgetGoalEur) * 100)}%</span>
            </div>
            <p className="text-xl font-bold">
              {details.budgetRaisedEur}€ / {details.budgetGoalEur}€
            </p>
            
            <div className="w-full bg-white/20 h-3 rounded-full mt-2">
              <div 
                className="bg-green-400 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((details.budgetRaisedEur / details.budgetGoalEur) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* KPI DE IMPACTO TANGIBLE */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌱</span>
          <p className="text-md italic">
            {Math.floor(details.budgetRaisedEur / (details.impactFactor || 20))} {t("treesPlanted")}
          </p>
        </div>
      </div>

      {/* DESCRIPCIÓN DINÁMICA */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">{t("description")}</h2>
        <p className="text-lg leading-relaxed">
          {locale === 'en' ? details.description_en : locale === 'de' ? details.description_de : details.description}
        </p>
      </div>

      {/* BOTÓN DE ACCIÓN DIRECTA */}
      <div className="mt-8">
        <button 
          onClick={() => window.location.href = paypalLink || "#"}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg transition-transform hover:scale-[1.02]"
        >
          {t("supportProject") || "Apoyar este proyecto"}
        </button>
      </div>

{/* PRUEBA SOCIAL */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">{t("communityVoice")}</h2>
        <div className="bg-white/5 p-6 rounded-lg border-l-4 border-green-500">
          <p className="text-lg italic mb-4">
            "{testimonialText}"
          </p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">V</span>
            </div>
            <div>
              <p className="font-semibold">{volunteerName}</p>
              <p className="text-xs opacity-60">
                {t("originallyWrittenIn", { lang: t(LANG_KEY[testimonialLang]) })}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* BOTÓN VOLVER */}
      <div className="mt-10">
        <BackButton href="/" label={t("backToMap") as string} />
      </div>
    </div>
  );
}