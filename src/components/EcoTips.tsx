"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

type EcoTip = {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard";
};

const ECO_TIPS: Record<string, EcoTip[]> = {
  es: [
    {
      id: "bank",
      category: "Finanzas",
      title: "Cambia a un banco sostenible",
      description: "Los bancos tradicionales financian proyectos contaminantes. Busca bancos que inviertan en energías renovables y proyectos sostenibles.",
      impact: "high",
      difficulty: "medium"
    },
    {
      id: "transport",
      category: "Transporte",
      title: "Usa transporte público",
      description: "Reduce tu huella de carbono usando autobús, metro o tren en lugar del coche privado.",
      impact: "high",
      difficulty: "easy"
    },
    {
      id: "vegetarian",
      category: "Alimentación",
      title: "Reduce el consumo de carne",
      description: "La producción de carne genera más emisiones que el transporte. Prueba opciones vegetarianas o veganas.",
      impact: "high",
      difficulty: "medium"
    },
    {
      id: "energy",
      category: "Energía",
      title: "Cambia a energías renovables",
      description: "Contrata electricidad de fuentes renovables como solar o eólica para tu hogar.",
      impact: "high",
      difficulty: "easy"
    },
    {
      id: "waste",
      category: "Residuos",
      title: "Reduce, reutiliza, recicla",
      description: "Minimiza los residuos comprando productos con menos embalaje y reutilizando lo que puedas.",
      impact: "medium",
      difficulty: "easy"
    },
    {
      id: "water",
      category: "Agua",
      title: "Ahorra agua",
      description: "Instala dispositivos de ahorro de agua y reduce el tiempo en la ducha.",
      impact: "medium",
      difficulty: "easy"
    }
  ],
  en: [
    {
      id: "bank",
      category: "Finance",
      title: "Switch to a sustainable bank",
      description: "Traditional banks finance polluting projects. Look for banks that invest in renewable energy and sustainable projects.",
      impact: "high",
      difficulty: "medium"
    },
    {
      id: "transport",
      category: "Transport",
      title: "Use public transportation",
      description: "Reduce your carbon footprint by using bus, metro or train instead of private car.",
      impact: "high",
      difficulty: "easy"
    },
    {
      id: "vegetarian",
      category: "Food",
      title: "Reduce meat consumption",
      description: "Meat production generates more emissions than transport. Try vegetarian or vegan options.",
      impact: "high",
      difficulty: "medium"
    },
    {
      id: "energy",
      category: "Energy",
      title: "Switch to renewable energy",
      description: "Contract electricity from renewable sources like solar or wind for your home.",
      impact: "high",
      difficulty: "easy"
    },
    {
      id: "waste",
      category: "Waste",
      title: "Reduce, reuse, recycle",
      description: "Minimize waste by buying products with less packaging and reusing what you can.",
      impact: "medium",
      difficulty: "easy"
    },
    {
      id: "water",
      category: "Water",
      title: "Save water",
      description: "Install water-saving devices and reduce shower time.",
      impact: "medium",
      difficulty: "easy"
    }
  ],
  de: [
    {
      id: "bank",
      category: "Finanzen",
      title: "Wechsle zu einer nachhaltigen Bank",
      description: "Traditionelle Banken finanzieren umweltschädliche Projekte. Suche nach Banken, die in erneuerbare Energien investieren.",
      impact: "high",
      difficulty: "medium"
    },
    {
      id: "transport",
      category: "Transport",
      title: "Nutze öffentliche Verkehrsmittel",
      description: "Reduziere deinen CO2-Fußabdruck durch die Nutzung von Bus, U-Bahn oder Zug statt dem privaten Auto.",
      impact: "high",
      difficulty: "easy"
    },
    {
      id: "vegetarian",
      category: "Ernährung",
      title: "Reduziere den Fleischkonsum",
      description: "Die Fleischproduktion verursacht mehr Emissionen als der Transport. Probiere vegetarische oder vegane Optionen.",
      impact: "high",
      difficulty: "medium"
    },
    {
      id: "energy",
      category: "Energie",
      title: "Wechsle zu erneuerbaren Energien",
      description: "Beziehe Strom aus erneuerbaren Quellen wie Solar- oder Windenergie für dein Zuhause.",
      impact: "high",
      difficulty: "easy"
    },
    {
      id: "waste",
      category: "Abfall",
      title: "Reduziere, wiederverwende, recycel",
      description: "Minimiere Abfälle, indem du Produkte mit weniger Verpackung kaufst und wiederverwendest.",
      impact: "medium",
      difficulty: "easy"
    },
    {
      id: "water",
      category: "Wasser",
      title: "Spare Wasser",
      description: "Installiere wassersparende Geräte und reduziere die Duschzeit.",
      impact: "medium",
      difficulty: "easy"
    }
  ]
};

export default function EcoTips() {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const tips = ECO_TIPS[locale] || ECO_TIPS["es"];
  const categories = [...new Set(tips.map(tip => tip.category))];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const filteredTips = selectedCategory 
    ? tips.filter(tip => tip.category === selectedCategory)
    : tips;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-nav hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 text-slate-500 dark:text-slate-400"
      >
        {t("ecoTips")}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
          {/* Backdrop clickable */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {t("ecoTips")}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 dark:text-slate-400 mt-2">
                {t("ecoTipsDescription")}
              </p>
            </div>

            <div className="p-6 flex flex-col flex-1 min-h-0">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6 flex-shrink-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === null
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {t("all")}
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Tips Grid */}
              <div className="grid gap-4 flex-1 overflow-y-auto pr-2 min-h-0">
                {filteredTips.map(tip => (
                  <div
                    key={tip.id}
                    className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-slate-800 relative"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base leading-tight pr-2">
                        {tip.title}
                      </h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(tip.impact)}`}>
                          {tip.impact === "high" ? t("highImpact") : tip.impact === "medium" ? t("mediumImpact") : t("lowImpact")}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                          {tip.difficulty === "easy" ? t("easy") : tip.difficulty === "medium" ? t("medium") : t("hard")}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
                      {tip.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-slate-500 font-medium">
                        {tip.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
