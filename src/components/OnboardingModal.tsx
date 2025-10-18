'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useI18n } from '@/lib/i18n';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
  actionText?: string;
}

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const { t, locale, setLocale } = useI18n();

  useEffect(() => {
    // FORCE SHOW ONBOARDING IN DEVELOPMENT - ALWAYS SHOW
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // ALWAYS show onboarding in development mode - ignore localStorage
      console.log('🔧 DEVELOPMENT MODE: Forcing onboarding to show');
      setShowLanguageSelection(true);
    } else {
      // Production logic: show onboarding for new users or if they haven't seen it recently
      const hasCompletedOnboarding = localStorage.getItem('econexo-onboarding-completed');
      const hasLanguagePreference = localStorage.getItem('econexo-language-set');
      const lastSeenOnboarding = localStorage.getItem('econexo-onboarding-last-seen');
      
      // Show onboarding if:
      // 1. Never completed onboarding, OR
      // 2. Haven't seen it in the last 7 days (for returning users)
      const shouldShowOnboarding = !hasCompletedOnboarding || 
        (lastSeenOnboarding && Date.now() - parseInt(lastSeenOnboarding) > 7 * 24 * 60 * 60 * 1000);
      
      if (shouldShowOnboarding) {
        if (!hasLanguagePreference) {
          // Show language selection first
          setShowLanguageSelection(true);
        } else {
          // Show onboarding with saved language
          setIsOpen(true);
        }
      }
    }
  }, []);

  const handleLanguageSelect = (selectedLocale: 'es' | 'en' | 'de') => {
    setLocale(selectedLocale);
    localStorage.setItem('econexo-language-set', 'true');
    localStorage.setItem('econexo-preferred-language', selectedLocale);
    setShowLanguageSelection(false);
    setIsOpen(true);
    trackEvent('Language Selected', { language: selectedLocale });
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: t('onboardingWelcome'),
      description: t('onboardingDescription'),
      icon: '🌱'
    },
    {
      id: 'map',
      title: t('onboardingMap'),
      description: t('onboardingMapDescription'),
      icon: '🗺️',
      action: 'explore-map',
      actionText: t('onboardingExploreMap')
    },
    {
      id: 'events',
      title: t('onboardingEvents'),
      description: t('onboardingEventsDescription'),
      icon: '📅',
      action: 'browse-events',
      actionText: t('onboardingViewEvents')
    },
    {
      id: 'projects',
      title: t('onboardingProjects'),
      description: t('onboardingProjectsDescription'),
      icon: '🚀',
      action: 'create-project',
      actionText: t('onboardingCreateProject')
    },
    {
      id: 'jobs',
      title: t('onboardingJobs'),
      description: t('onboardingJobsDescription'),
      icon: '💼',
      action: 'browse-jobs',
      actionText: t('onboardingViewJobs')
    },
    {
      id: 'community',
      title: t('onboardingCommunity'),
      description: t('onboardingCommunityDescription'),
      icon: '💬',
      action: 'join-chat',
      actionText: t('onboardingJoinChat')
    }
  ];

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.action) {
      trackEvent('Onboarding Action', { 
        step: currentStepData.id, 
        action: currentStepData.action 
      });
    }

    setCompletedSteps([...completedSteps, currentStepData.id]);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    trackEvent('Onboarding Skipped', { step: steps[currentStep].id });
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem('econexo-onboarding-completed', 'true');
    localStorage.setItem('econexo-onboarding-last-seen', Date.now().toString());
    setIsOpen(false);
    trackEvent('Onboarding Completed', { 
      completedSteps: completedSteps.length,
      totalSteps: steps.length 
    });
  };

  const handleAction = (action: string) => {
    trackEvent('Onboarding Action Clicked', { action });
    
    // Navigate to different sections
    switch (action) {
      case 'explore-map':
        window.location.href = '/#map';
        break;
      case 'browse-events':
        window.location.href = '/eventos';
        break;
      case 'create-project':
        window.location.href = '/proyectos';
        break;
      case 'browse-jobs':
        window.location.href = '/trabajos';
        break;
      case 'join-chat':
        window.location.href = '/chat';
        break;
    }
  };

  if (!isOpen && !showLanguageSelection) return null;

  // Language Selection Screen
  if (showLanguageSelection) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
          <div className="text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t('onboardingSelectLanguage')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('onboardingLanguageDescription')}
            </p>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                💡 {t('onboardingLanguageTip')}
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleLanguageSelect('es')}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🇪🇸 Español
              </button>
              <button
                onClick={() => handleLanguageSelect('en')}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => handleLanguageSelect('de')}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🇩🇪 Deutsch
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="text-center">
          <div className="text-6xl mb-4">{currentStepData.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {currentStepData.description}
          </p>

          {/* Action Button */}
          {currentStepData.action && (
            <button
              onClick={() => handleAction(currentStepData.action!)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors mb-4"
            >
              {currentStepData.actionText}
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700"
          >
            {t('onboardingSkip')}
          </button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            {currentStep === steps.length - 1 ? t('onboardingFinish') : t('onboardingNext')}
          </button>
        </div>
      </div>
    </div>
  );
}
