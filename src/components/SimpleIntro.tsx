'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import LanguagePicker from '@/components/LanguagePicker';
import {
  hasCompletedLanguageIntro,
  hasSavedLocale,
  markLanguageIntroComplete,
} from '@/lib/onboardingStorage';
import { X } from 'lucide-react';

export default function SimpleIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('econexo_onboarded');
    if (hasCompletedLanguageIntro() || hasSavedLocale() || hasOnboarded) {
      if (!hasCompletedLanguageIntro() && (hasSavedLocale() || hasOnboarded)) {
        markLanguageIntroComplete();
      }
      return;
    }
    setShowIntro(true);
  }, []);

  const closeIntro = () => {
    markLanguageIntroComplete();
    setShowIntro(false);
  };

  if (!showIntro) return null;

  return (
    <IntroOverlay data-intro-modal="true">
      <IntroCard>
        <button
          type="button"
          onClick={closeIntro}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label={t('welcomeIntroSkip')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-5xl mb-4" aria-hidden>
          🌍
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('welcomeIntroLanguageTitle')}
        </h2>
        <p className="text-base text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {t('welcomeIntroLanguageDescription')}
        </p>

        <LanguagePicker
          variant="intro"
          onSelect={() => setShowIntro(false)}
        />

        <button
          type="button"
          onClick={closeIntro}
          className="mt-6 text-sm font-medium text-gray-500 hover:text-emerald-700 underline-offset-2 hover:underline"
        >
          {t('welcomeIntroSkip')}
        </button>
      </IntroCard>
    </IntroOverlay>
  );
}

function IntroOverlay({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900"
      {...props}
    >
      {children}
    </div>
  );
}

function IntroCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-emerald-100 px-6 py-8 sm:px-10 sm:py-10 text-center">
      {children}
    </div>
  );
}
