"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import {
  Leaf,
  X,
  Plus,
  Star
} from "lucide-react";
import { useSmartContext } from "@/context/SmartContext";

type EcoTip = {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard";
};

export default function EcoTips() {
  const { t, locale } = useI18n();
  const { preferences } = useSmartContext();
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getEcoTips = (): EcoTip[] => {
    return [
      {
        id: "bank",
        category: t('ecoTipCategoryFinance'),
        title: t('ecoTipBankTitle'),
        description: t('ecoTipBankDescription'),
        impact: "high",
        difficulty: "medium"
      },
      {
        id: "transport",
        category: t('ecoTipCategoryTransport'),
        title: t('ecoTipTransportTitle'),
        description: t('ecoTipTransportDescription'),
        impact: "high",
        difficulty: "easy"
      },
      {
        id: "vegetarian",
        category: t('ecoTipCategoryFood'),
        title: t('ecoTipVegetarianTitle'),
        description: t('ecoTipVegetarianDescription'),
        impact: "high",
        difficulty: "medium"
      },
      {
        id: "energy",
        category: t('ecoTipCategoryEnergy'),
        title: t('ecoTipEnergyTitle'),
        description: t('ecoTipEnergyDescription'),
        impact: "high",
        difficulty: "easy"
      },
      {
        id: "waste",
        category: t('ecoTipCategoryWaste'),
        title: t('ecoTipWasteTitle'),
        description: t('ecoTipWasteDescription'),
        impact: "medium",
        difficulty: "easy"
      },
      {
        id: "water",
        category: t('ecoTipCategoryWater'),
        title: t('ecoTipWaterTitle'),
        description: t('ecoTipWaterDescription'),
        impact: "medium",
        difficulty: "easy"
      },
      {
        id: "oceans",
        category: t('ecoTipCategoryOceans') || "Oceans",
        title: t('ecoTipOceanTitle'),
        description: t('ecoTipOceanDescription'),
        impact: "high",
        difficulty: "easy"
      },
      {
        id: "health",
        category: t('ecoTipCategoryHealth') || "Health",
        title: t('ecoTipHealthTitle'),
        description: t('ecoTipHealthDescription'),
        impact: "medium",
        difficulty: "medium"
      },
      {
        id: "education",
        category: t('ecoTipCategoryEducation') || "Education",
        title: t('ecoTipEducationTitle'),
        description: t('ecoTipEducationDescription'),
        impact: "medium",
        difficulty: "easy"
      }
    ];
  };

  const tips = getEcoTips();
  const categories = (() => {
    const unique = [...new Set(tips.map(tip => tip.category))];
    const food = t('ecoTipCategoryFood');
    return unique.sort((a, b) => (a === food ? -1 : b === food ? 1 : 0));
  })();

  const filteredTips = selectedCategory
    ? tips.filter(tip => tip.category === selectedCategory)
    : tips;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
    }
  };

  const renderDescriptionWithLinks = (description: string) => {
    const parts = description.split(/(GLS Bank|Triodos Bank)/g);
    return parts.map((part, index) => {
      if (part === "GLS Bank" || part === "Triodos Bank") {
        const url = part === "GLS Bank" ? "https://www.gls.de" : "https://www.triodos.com";
        return (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline font-medium">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const TipCard = ({ tip, isRecommended }: { tip: EcoTip; isRecommended?: boolean }) => (
    <div className={`p-5 rounded-2xl border transition-all bg-background dark:bg-slate-900 group ${isRecommended
        ? "border-green-600/30 bg-green-50/10 dark:outline dark:outline-1 dark:outline-green-500/20"
        : "border-foreground/10 dark:border-slate-800"
      } hover:shadow-xl`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-tight pr-2 flex items-center gap-2">
          {isRecommended && <Star size={14} className="text-green-600 fill-current flex-shrink-0" />}
          {tip.title}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getImpactColor(tip.impact)}`}>
            {tip.impact === "high" ? t("highImpact") : tip.impact === "medium" ? t("mediumImpact") : t("lowImpact")}
          </span>
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(tip.difficulty)}`}>
            {tip.difficulty === "easy" ? t("easy") : tip.difficulty === "medium" ? t("medium") : t("hard")}
          </span>
        </div>
      </div>
      <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
        {renderDescriptionWithLinks(tip.description)}
      </p>
      <div className="flex justify-between items-center text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1">
          <Plus size={10} className="text-green-600" /> {tip.category}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-white hover:text-secondary transition-colors duration-200 font-bold px-2 py-1 flex items-center gap-1 cursor-pointer">
        <Leaf size={16} /> {t("ecoTips")}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="bg-background dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col relative z-10 border border-white/10">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("ecoTips")}</h2>
                <button onClick={() => setIsOpen(false)} className="text-foreground/40 hover:text-foreground/80 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-foreground/5 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 dark:text-slate-400 mt-2">{t("ecoTipsDescription")}</p>
            </div>

            <div className="p-6 flex flex-col flex-1 min-h-0">
              <div className="flex flex-wrap gap-2 mb-6 flex-shrink-0">
                <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === null ? "bg-green-600 text-white" : "bg-foreground/5 dark:bg-slate-800"}`}>
                  {t("all")}
                </button>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat ? "bg-green-600 text-white" : "bg-foreground/5 dark:bg-slate-800"}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 flex-1 overflow-y-auto pr-2 min-h-0">
                {!selectedCategory && preferences.selectedCategories.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Star size={12} className="fill-current" /> {t('recommendedForYou') || "Recommended for You"}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {tips
                        .filter(tip => {
                          const catKey = tip.category.toLowerCase();
                          return preferences.selectedCategories.some(pCat =>
                            catKey.includes(pCat.toLowerCase()) || pCat.toLowerCase().includes(catKey)
                          );
                        })
                        .map(tip => (
                          <TipCard key={`fav-${tip.id}`} tip={tip} isRecommended />
                        ))}
                    </div>
                    <div className="my-6 border-b border-gray-100 dark:border-slate-800" />
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {filteredTips.map(tip => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
