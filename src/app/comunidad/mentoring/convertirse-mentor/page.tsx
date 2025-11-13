"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";

export default function ConvertirseMentorPage() {
  const { t, locale } = useI18n();
  const [saving, setSaving] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          {locale === "de"
            ? "🎓 Mentor werden"
            : locale === "es"
            ? "🎓 Convertirse en Mentor"
            : "🎓 Become a Mentor"}
        </h1>
        <p className="text-gray-100 dark:text-gray-300 mb-8">
          {locale === "de"
            ? "Teile dein Wissen y apoya a aprendices en temas de sostenibilidad."
            : locale === "es"
            ? "Comparte tu conocimiento y apoya a aprendices en temas de sostenibilidad."
            : "Share your knowledge and support learners in sustainability topics."}
        </p>

        <form
          onSubmit={onSubmit}
          className="bg-white/80 dark:bg-slate-800/90 rounded-xl shadow-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              {locale === "de" ? "Áreas de experiencia" : locale === "es" ? "Áreas de experiencia" : "Expertise areas"}
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={
                locale === "de" ? "Energía, Circularidad…" : locale === "es" ? "Energía, Circularidad…" : "Energy, Circularity…"
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              {locale === "de" ? "Idiomas" : locale === "es" ? "Idiomas" : "Languages"}
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={locale === "de" ? "Deutsch, Englisch…" : locale === "es" ? "Español, Inglés…" : "German, English…"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
              {locale === "de" ? "Disponibilidad" : locale === "es" ? "Disponibilidad" : "Availability"}
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={locale === "de" ? "2 h/semana" : locale === "es" ? "2 h/semana" : "2 h/week"}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={saving}
          >
            {saving
              ? locale === "de"
                ? "Speichern…"
                : locale === "es"
                ? "Guardando…"
                : "Saving…"
              : locale === "de"
              ? "Ofrecer Mentoring"
              : locale === "es"
              ? "Ofrecer Mentoring"
              : "Offer Mentoring"}
          </button>
        </form>
      </div>
    </div>
  );
}
