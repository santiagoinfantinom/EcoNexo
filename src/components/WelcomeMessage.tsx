"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

interface WelcomeMessageProps {
  onClose: () => void;
}

export default function WelcomeMessage({ onClose }: WelcomeMessageProps) {
  const { t, locale } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

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
      title: locale === 'es' ? "Sostenibilidad" : locale === 'de' ? "Nachhaltigkeit" : "Sustainability",
      description: locale === 'es' 
        ? "Conectamos proyectos que construyen un futuro más verde y sostenible para Europa"
        : locale === 'de'
        ? "Wir verbinden Projekte, die eine grünere und nachhaltigere Zukunft für Europa aufbauen"
        : "We connect projects building a greener and more sustainable future for Europe"
    },
    {
      icon: "🤝",
      title: locale === 'es' ? "Comunidad" : locale === 'de' ? "Gemeinschaft" : "Community",
      description: locale === 'es'
        ? "Fomentamos la colaboración entre voluntarios, organizaciones y comunidades locales"
        : locale === 'de'
        ? "Wir fördern die Zusammenarbeit zwischen Freiwilligen, Organisationen und lokalen Gemeinden"
        : "We foster collaboration between volunteers, organizations and local communities"
    },
    {
      icon: "🌍",
      title: locale === 'es' ? "Impacto Global" : locale === 'de' ? "Globaler Einfluss" : "Global Impact",
      description: locale === 'es'
        ? "Cada acción local contribuye a un cambio positivo a escala europea"
        : locale === 'de'
        ? "Jede lokale Aktion trägt zu einem positiven Wandel auf europäischer Ebene bei"
        : "Every local action contributes to positive change at European scale"
    },
    {
      icon: "💡",
      title: locale === 'es' ? "Innovación" : locale === 'de' ? "Innovation" : "Innovation",
      description: locale === 'es'
        ? "Apoyamos soluciones creativas y tecnologías verdes para los desafíos ambientales"
        : locale === 'de'
        ? "Wir unterstützen kreative Lösungen und grüne Technologien für Umweltherausforderungen"
        : "We support creative solutions and green technologies for environmental challenges"
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
                  {locale === 'es' ? "¡Bienvenido a EcoNexo!" : locale === 'de' ? "Willkommen bei EcoNexo!" : "Welcome to EcoNexo!"}
                </h1>
                <p className="text-gls-secondary opacity-80 mt-2">
                  {locale === 'es' 
                    ? "Descubre nuestros valores y únete al movimiento sostenible"
                    : locale === 'de'
                    ? "Entdecke unsere Werte und werde Teil der nachhaltigen Bewegung"
                    : "Discover our values and join the sustainable movement"
                  }
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
              {locale === 'es' 
                ? "¿Listo para hacer la diferencia?"
                : locale === 'de'
                ? "Bereit, einen Unterschied zu machen?"
                : "Ready to make a difference?"
              }
            </h3>
            <p className="text-gls-primary opacity-90 mb-6">
              {locale === 'es'
                ? "Explora proyectos, únete a eventos y conecta con una comunidad comprometida con el futuro del planeta"
                : locale === 'de'
                ? "Erkunde Projekte, nimm an Veranstaltungen teil und verbinde dich mit einer Gemeinschaft, die sich für die Zukunft des Planeten engagiert"
                : "Explore projects, join events and connect with a community committed to the planet's future"
              }
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleClose}
                className="btn-gls-primary px-8 py-3 text-lg"
              >
                {locale === 'es' ? "¡Empezar!" : locale === 'de' ? "Los geht's!" : "Let's Go!"}
              </button>
              <button
                onClick={() => {
                  // Scroll to map section
                  const mapSection = document.querySelector('.layout-gls');
                  if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  handleClose();
                }}
                className="btn-gls-secondary px-8 py-3 text-lg"
              >
                {locale === 'es' ? "Ver Mapa" : locale === 'de' ? "Karte anzeigen" : "View Map"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
