"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";

export default function BuscarMentorPage() {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          {locale === "de"
            ? "🔍 Mentor suchen"
            : locale === "es"
            ? "🔍 Buscar Mentor"
            : "🔍 Find Mentor"}
        </h1>
        <p className="text-gray-100 dark:text-gray-300 mb-8">
          {locale === "de"
            ? "Finde Expertinnen und Experten en Nachhaltigkeit nach Themen, Sprachen und Städten."
            : locale === "es"
            ? "Encuentra especialistas en sostenibilidad por temas, idiomas y ciudades."
            : "Find sustainability experts by topics, languages and cities."}
        </p>

        <div className="bg-white/80 dark:bg-slate-800/90 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                locale === "de"
                  ? "Tema, ciudad o idioma..."
                  : locale === "es"
                  ? "Tema, ciudad o idioma..."
                  : "Topic, city or language..."
              }
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              {locale === "de" ? "Suchen" : locale === "es" ? "Buscar" : "Search"}
            </button>
          </div>

          <div className="mt-6 text-gray-500 dark:text-gray-400">
            {locale === "de"
              ? "Resultados de ejemplo próximamente…"
              : locale === "es"
              ? "Resultados de ejemplo próximamente…"
              : "Sample results coming soon…"}
          </div>
        </div>
      </div>
    </div>
  );
}
