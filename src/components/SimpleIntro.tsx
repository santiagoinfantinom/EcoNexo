'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

export default function SimpleIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { locale, setLocale } = useI18n();

  useEffect(() => {
    // Show intro after page loads
    const timer = setTimeout(() => {
      setShowIntro(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      icon: '🌍',
      title: 'Selecciona tu idioma',
      description: 'EcoNexo está disponible en español, inglés y alemán',
      buttons: [
        { label: '🇪🇸 Español', locale: 'es' },
        { label: '🇬🇧 English', locale: 'en' },
        { label: '🇩🇪 Deutsch', locale: 'de' }
      ]
    },
    {
      icon: '🗺️',
      title: 'Mapa de Proyectos',
      description: 'Explora proyectos sostenibles en toda Europa'
    },
    {
      icon: '📅',
      title: 'Eventos Ambientales',
      description: 'Descubre eventos y oportunidades de voluntariado'
    },
    {
      icon: '💼',
      title: 'Trabajos Verdes',
      description: 'Encuentra oportunidades de carrera sostenible'
    },
    {
      icon: '💬',
      title: 'Chat Comunitario',
      description: 'Conecta con la comunidad ambiental'
    },
    {
      icon: '👤',
      title: 'Perfil Personal',
      description: 'Gestiona tu cuenta y proyectos guardados'
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
      setShowIntro(false);
    }
  };

  const handleSkip = () => {
    setShowIntro(false);
  };

  if (!showIntro) return null;

  const currentStepData = steps[currentStep];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
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

        {currentStep === 0 ? (
          // Language selection
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentStepData.buttons?.map((button, index) => (
              <button
                key={index}
                onClick={() => handleLanguageSelect(button.locale as 'es' | 'en' | 'de')}
                style={{
                  width: '100%',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                {button.label}
              </button>
            ))}
          </div>
        ) : (
          // Feature introduction
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={handleSkip}
              style={{
                padding: '12px 24px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            >
              Saltar
            </button>
            <button
              onClick={handleNext}
              style={{
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              {currentStep === steps.length - 1 ? '¡Comenzar!' : 'Siguiente'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}