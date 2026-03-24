'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

export default function SimpleIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const { setLocale, t } = useI18n();

  useEffect(() => {
    // Check if intro has been shown before OR if user is already onboarded
    const hasSeenIntro = localStorage.getItem('econexo-intro-shown');
    const hasOnboarded = localStorage.getItem('econexo_onboarded');

    // Only show intro if neither flag is set.
    // If they are onboarded, we assume they've set their language or don't need the intro.
    if (!hasSeenIntro && !hasOnboarded) {
      // Show intro immediately (no delay)
      setShowIntro(true);
    }
  }, []);

  const languageStep = {
    icon: '🌍',
    title: t('welcomeIntroLanguageTitle'),
    description: t('welcomeIntroLanguageDescription'),
    buttons: [
      { label: '🇬🇧 English', locale: 'en' as const },
      { label: '🇩🇪 Deutsch', locale: 'de' as const },
      { label: '🇪🇸 Español', locale: 'es' as const },
    ]
  };

  const handleLanguageSelect = (selectedLocale: 'es' | 'en' | 'de') => {
    setLocale(selectedLocale);

    // Mark intro as shown and close
    localStorage.setItem('econexo-intro-shown', 'true');

    // Dispatch event to notify listeners (like OnboardingTour) that intro is done
    window.dispatchEvent(new Event('intro-completed'));

    setShowIntro(false);
  };


  if (!showIntro) return null;

  return (
    <div
      data-intro-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#064e3b', /* Emerald 900 solid background */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '20px',
        width: '100vw',
        height: '100vh',
        visibility: 'visible',
        opacity: 1,
        pointerEvents: 'auto'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
      >
        {/* Content */}
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>
          {languageStep.icon}
        </div>

        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          {languageStep.title}
        </h2>

        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
          {languageStep.description}
        </p>

        {/* Language selection buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
          {languageStep.buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleLanguageSelect(button.locale)}
              style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}