'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

export default function WelcomeIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { t, locale, setLocale } = useI18n();

  useEffect(() => {
    // Show intro after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const features = [
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
  ];

  const handleLanguageSelect = (selectedLocale: 'es' | 'en' | 'de') => {
    setLocale(selectedLocale);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
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
              <div className="text-8xl mb-6">🌍</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('welcomeIntroWelcomeTitle')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('welcomeIntroWelcomeDescription')}
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleLanguageSelect('es')}
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-medium text-lg flex items-center justify-center gap-3"
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-medium text-lg flex items-center justify-center gap-3"
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => handleLanguageSelect('de')}
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-medium text-lg flex items-center justify-center gap-3"
                >
                  🇩🇪 Deutsch
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
                  {currentStep === features.length - 1 ? 
                    (currentStep === features.length - 1 ? t('welcomeIntroGetStarted') : t('welcomeIntroNext'))
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
