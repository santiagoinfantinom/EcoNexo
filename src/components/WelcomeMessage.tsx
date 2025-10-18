"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

interface WelcomeMessageProps {
  onClose: () => void;
}

export default function WelcomeMessage({ onClose }: WelcomeMessageProps) {
  const { t, locale } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const paypalUrl = process.env.NEXT_PUBLIC_PAYPAL_URL || '#';

  useEffect(() => {
    // Mostrar el mensaje después de un pequeño delay para mejor UX
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Delay para la animación
  };

  const values = [
    {
      icon: "🌱",
      title: t('sustainabilityTitle'),
      description: t('sustainabilityDescription')
    },
    {
      icon: "🤝",
      title: t('communityTitle'),
      description: t('communityDescription')
    },
    {
      icon: "🌍",
      title: t('globalImpactTitle'),
      description: t('globalImpactDescription')
    },
    {
      icon: "💡",
      title: t('innovationTitle'),
      description: t('innovationDescription')
    }
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-gls-primary rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Header */}
        <div className="bg-gls-secondary p-8 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🌿</span>
              <div>
                <h1 className="text-3xl font-bold text-gls-secondary">
                  {t('welcomeMessageTitle')}
                </h1>
                <p className="text-gls-secondary opacity-80 mt-2">
                  {t('welcomeMessageDescription')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gls-secondary hover:text-vibrant-rose transition-colors text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {values.map((value, index) => (
              <div key={index} className="card-ecosia">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{value.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gls-primary mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gls-primary opacity-90 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-ecosia-green/20 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-gls-primary mb-4">
              {t('readyToMakeDifference')}
            </h3>
            <p className="text-gls-primary opacity-90 mb-6">
              {t('readyDescription')}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  handleClose();
                  // Scroll to the main content area to start exploring
                  setTimeout(() => {
                    const mainContent = document.querySelector('.layout-gls-left');
                    if (mainContent) {
                      mainContent.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="btn-gls-primary px-8 py-3 text-lg"
              >
                {t('letsGo')}
              </button>
              <button
                onClick={() => {
                  handleClose();
                  // Scroll to the map section with better targeting
                  setTimeout(() => {
                    // Use the specific ID for the map section
                    const mapSection = document.getElementById('map-section');
                    
                    if (mapSection) {
                      mapSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                      });
                    } else {
                      // Fallback: try other selectors
                      const fallbackSection = document.querySelector('.col-span-2') || 
                                            document.querySelector('.layout-gls-right');
                      if (fallbackSection) {
                        fallbackSection.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start',
                          inline: 'nearest'
                        });
                      } else {
                        // Final fallback: scroll to top of page
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }
                  }, 200);
                }}
                className="btn-gls-secondary px-8 py-3 text-lg"
              >
                {t('viewMap')}
              </button>
            <button
              onClick={() => {
                if (!paypalUrl || paypalUrl === '#') return;
                window.open(paypalUrl, '_blank', 'noopener');
              }}
              className={`px-8 py-3 text-lg rounded-lg font-semibold transition-colors ${
                paypalUrl && paypalUrl !== '#'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              title={paypalUrl && paypalUrl !== '#' ? '' : (locale === 'de' ? 'Demnächst verfügbar' : locale === 'en' ? 'Coming soon' : 'Próximamente')}
              disabled={!paypalUrl || paypalUrl === '#'}
            >
              {t('supportUs')}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
