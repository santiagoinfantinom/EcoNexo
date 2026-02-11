"use client";

import { useI18n } from "@/lib/i18n";
import { useSmartContext } from "@/context/SmartContext";
import { useState } from "react";

export default function NuevoMarketplacePage() {
  const { t, locale } = useI18n();
  const { addPoints, unlockBadge, gamification } = useSmartContext();
  const [saving, setSaving] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);

      // Award points for marketplace listing
      addPoints(50, locale === 'es' ? 'Publicar en marketplace' : 'Marketplace listing');
      if (!gamification.badges.includes('marketplace_seller')) {
        unlockBadge('marketplace_seller');
        addPoints(100, locale === 'es' ? 'Insignia: Vendedor Verde' : 'Badge: Green Seller');
      }

      alert(locale === 'es' ? "¡Anuncio publicado con éxito!" : "Listing published successfully!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          {locale === "de"
            ? "🛒 Neuen Eintrag erstellen"
            : locale === "es"
              ? "🛒 Crear nuevo anuncio"
              : "🛒 Create new listing"}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg font-medium">
          {locale === "de"
            ? "Publica productos o servicios sostenibles."
            : locale === "es"
              ? "Publica productos o servicios sostenibles."
              : "Publish sustainable products or services."}
        </p>

        <form
          onSubmit={onSubmit}
          className="bg-white/80 dark:bg-slate-800/90 rounded-xl shadow-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
              {locale === "de" ? "Título" : locale === "es" ? "Título" : "Title"}
            </label>
            <input className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
              {locale === "de" ? "Descripción" : locale === "es" ? "Descripción" : "Description"}
            </label>
            <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
                {locale === "de" ? "Precio" : locale === "es" ? "Precio" : "Price"}
              </label>
              <input className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
                {locale === "de" ? "Ciudad" : locale === "es" ? "Ciudad" : "City"}
              </label>
              <input className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
              {locale === "de" ? "Imagen (URL)" : locale === "es" ? "Imagen (URL)" : "Image (URL)"}
            </label>
            <input className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white" />
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
                ? "Veröffentlichen"
                : locale === "es"
                  ? "Publicar"
                  : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
