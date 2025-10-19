'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

export default function SimpleIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    console.log('🔧 SimpleIntro: useEffect ejecutándose');
    
    // Check if intro has been shown before
    const hasSeenIntro = localStorage.getItem('econexo-intro-shown');
    console.log('🔧 SimpleIntro: hasSeenIntro =', hasSeenIntro);
    
    if (!hasSeenIntro) {
      console.log('🔧 SimpleIntro: Mostrando intro...');
      
      // Force English as default
      setLocale('en');
      localStorage.setItem('econexo:locale', 'en');
      localStorage.setItem('econexo-language-set', 'true');
      localStorage.setItem('econexo-preferred-language', 'en');
      
      // Show intro immediately (no delay)
      console.log('🔧 SimpleIntro: Mostrando intro inmediatamente');
      setShowIntro(true);
    } else {
      console.log('🔧 SimpleIntro: Intro ya se mostró antes, no mostrando');
    }
  }, [setLocale]);

  const steps = [
    {
      icon: '🌍',
      title: 'Choose Your Language',
      description: 'EcoNexo is available in multiple languages',
      buttons: [
        { label: '🇪🇸 Español', locale: 'es' },
        { label: '🇬🇧 English', locale: 'en' },
        { label: '🇩🇪 Deutsch', locale: 'de' }
      ]
    },
    {
      icon: '🗺️',
      title: 'Explore the Map',
      description: 'Discover environmental projects near you'
    },
    {
      icon: '📅',
      title: 'Join Events',
      description: 'Participate in community environmental activities'
    },
    {
      icon: '💼',
      title: 'Find Jobs',
      description: 'Discover green career opportunities'
    },
    {
      icon: '💬',
      title: 'Community Chat',
      description: 'Connect with like-minded environmentalists'
    },
    {
      icon: '👤',
      title: 'Your Profile',
      description: 'Track your environmental impact and achievements'
    }
  ];

  const handleLanguageSelect = (selectedLocale: 'es' | 'en' | 'de') => {
    setLocale(selectedLocale);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark intro as shown and close
      localStorage.setItem('econexo-intro-shown', 'true');
      setShowIntro(false);
    }
  };

  const handleSkip = () => {
    // Mark intro as shown and close
    localStorage.setItem('econexo-intro-shown', 'true');
    setShowIntro(false);
  };

  console.log('🔧 SimpleIntro: showIntro =', showIntro);
  if (!showIntro) return null;

  const currentStepData = steps[currentStep];
  console.log('🔧 SimpleIntro: RENDERIZANDO MODAL con step =', currentStep);

  return (
    <div 
      data-intro-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        {/* Progress bar */}
        <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '8px', height: '8px', marginBottom: '32px' }}>
          <div 
            style={{ 
              backgroundColor: '#10b981', 
              height: '8px', 
              borderRadius: '8px',
              transition: 'width 0.5s ease',
              width: `${((currentStep + 1) / steps.length) * 100}%`
            }}
          />
        </div>

        {/* Content */}
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>
          {currentStepData.icon}
        </div>
        
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          {currentStepData.title}
        </h2>
        
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
          {currentStepData.description}
        </p>

        {/* Language selection buttons */}
        {currentStep === 0 && currentStepData.buttons && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {currentStepData.buttons.map((button, index) => (
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
        )}

        {/* Navigation buttons */}
        {currentStep > 0 && (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={handleSkip}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}