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
          {t('becomeMentor')}
        </h1>
        <p className="text-gray-100 dark:text-gray-300 mb-8">
          {t('shareKnowledge')}
        </p>

        <form
          onSubmit={onSubmit}
          className="bg-white/80 dark:bg-slate-800/90 rounded-xl shadow-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
              {t('expertiseAreas')}
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={
                t('expertiseAreasPhMentoring')
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
              {t('languages')}
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={t('languagesPhMentoring')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
              {t('availability')}
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={t('availabilityPhMentoring')}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={saving}
          >
            {saving
              ? t('savingEllipsis')
              : t('offerMentoring')}
          </button>
        </form>
      </div>
    </div>
  );
}
