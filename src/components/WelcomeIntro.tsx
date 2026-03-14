'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthModal from './AuthModal';

export default function WelcomeIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { t, locale, setLocale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  useEffect(() => {
    // Show intro after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const features = useMemo(() => [
    {
      icon: '🌍',
      title: t('welcomeIntroLanguageTitle'),
      description: t('welcomeIntroLanguageDescription'),
      action: 'language'
    },
    {
      icon: '🗺️',
      title: t('welcomeIntroMapTitle'),
      description: t('welcomeIntroMapDescription'),
      action: 'map'
    },
    {
      icon: '📅',
      title: t('welcomeIntroEventsTitle'),
      description: t('welcomeIntroEventsDescription'),
      action: 'events'
    },
    {
      icon: '💼',
      title: t('welcomeIntroJobsTitle'),
      description: t('welcomeIntroJobsDescription'),
      action: 'jobs'
    },
    {
      icon: '💬',
      title: t('welcomeIntroChatTitle'),
      description: t('welcomeIntroChatDescription'),
      action: 'chat'
    },
    {
      icon: '👤',
      title: t('welcomeIntroProfileTitle'),
      description: t('welcomeIntroProfileDescription'),
      action: 'profile'
    }
  ], [t]);

  const handleLanguageSelect = (selectedLocale: 'es' | 'en' | 'de') => {
    setLocale(selectedLocale);
  };

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Cuando es el último paso y se hace clic en "Get Started"
      setIsVisible(false);
      // Si el usuario está autenticado, redirigir a eventos
      if (user) {
        router.push('/eventos');
      } else {
        // Si no está autenticado, abrir modal de registro
        setTimeout(() => {
          setAuthMode("register");
          setIsAuthModalOpen(true);
        }, 300);
      }
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / features.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="text-center">
          {currentStep === 0 ? (
            // Language selection
            <div>
              {/* Language buttons on top */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${locale === 'en' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} flex items-center justify-center gap-2`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => handleLanguageSelect('de')}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${locale === 'de' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} flex items-center justify-center gap-2`}
                >
                  🇩🇪 Deutsch
                </button>
                <button
                  onClick={() => handleLanguageSelect('es')}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${locale === 'es' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} flex items-center justify-center gap-2`}
                >
                  🇪🇸 Español
                </button>
              </div>

              <div className="text-8xl mb-6">🌍</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('welcomeIntroWelcomeTitle')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('welcomeIntroWelcomeDescription')}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  {t('welcomeIntroSkip')}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {t('welcomeIntroNext')}
                </button>
              </div>
            </div>
          ) : (
            // Feature introduction
            <div>
              <div className="text-8xl mb-6">{features[currentStep].icon}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {features[currentStep].title}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {features[currentStep].description}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  {t('welcomeIntroSkip')}
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {currentStep === features.length - 1
                    ? t('welcomeIntroGetStarted')
                    : t('welcomeIntroNext')
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </div>
  );
}
