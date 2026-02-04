"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

type BadgeCategory = 'all' | 'events' | 'community' | 'lifestyle' | 'finance' | 'impact';

type Badge = {
    id: string;
    name_es: string;
    name_en: string;
    name_de: string;
    description_es: string;
    description_en: string;
    description_de: string;
    icon: string;
    requirement: number;
    category: BadgeCategory;
    color: string;
    target: string;
};

const BADGES: Badge[] = [
    // Events
    {
        id: "first-step",
        name_es: "Primer Paso",
        name_en: "First Step",
        name_de: "Erster Schritt",
        description_es: "Di tu primer paso hacia un mundo más sostenible",
        description_en: "Take your first step towards a more sustainable world",
        description_de: "Machen Sie Ihren ersten Schritt zu einer nachhaltigeren Welt",
        icon: "🌱",
        requirement: 1,
        category: "events",
        color: "bg-emerald-500",
        target: "eventos"
    },
    {
        id: "eco-warrior",
        name_es: "Guerrero Ecológico",
        name_en: "Eco Warrior",
        name_de: "Öko-Krieger",
        description_es: "Participa en 10 eventos ambientales",
        description_en: "Participate in 10 environmental events",
        description_de: "Nehmen Sie an 10 Umweltevents teil",
        icon: "🌍",
        requirement: 10,
        category: "events",
        color: "bg-blue-500",
        target: "eventos"
    },
    // Community
    {
        id: "community-leader",
        name_es: "Líder Comunitario",
        name_en: "Community Leader",
        name_de: "Community-Leader",
        description_es: "Crea y organiza 3 eventos comunitarios",
        description_en: "Create and organize 3 community events",
        description_de: "Erstellen und organisieren Sie 3 Community-Events",
        icon: "👥",
        requirement: 3,
        category: "community",
        color: "bg-purple-500",
        target: "comunidad"
    },
    {
        id: "chat-master",
        name_es: "Maestro del Chat",
        name_en: "Chat Master",
        name_de: "Chat-Meister",
        description_es: "Participa activamente en 20 conversaciones",
        description_en: "Actively participate in 20 conversations",
        description_de: "Nehmen Sie aktiv an 20 Gesprächen teil",
        icon: "💬",
        requirement: 20,
        category: "community",
        color: "bg-pink-500",
        target: "chat"
    },
    // Finance (NEW)
    {
        id: "ethical-banking",
        name_es: "Banca Ética",
        name_en: "Ethical Banking",
        name_de: "Ethisches Bankwesen",
        description_es: "Cambia tu cuenta a un banco sostenible",
        description_en: "Switch your account to a sustainable bank",
        description_de: "Wechseln Sie Ihr Konto zu einer nachhaltigen Bank",
        icon: "🏦",
        requirement: 1,
        category: "finance",
        color: "bg-yellow-600",
        target: "monetizacion"
    },
    {
        id: "green-investor",
        name_es: "Inversor Verde",
        name_en: "Green Investor",
        name_de: "Grüner Investor",
        description_es: "Invierte en 3 proyectos de impacto positivo",
        description_en: "Invest in 3 positive impact projects",
        description_de: "Investieren Sie in 3 Projekte mit positiver Auswirkung",
        icon: "📈",
        requirement: 3,
        category: "finance",
        color: "bg-green-600",
        target: "proyectos"
    },
    // Lifestyle (NEW)
    {
        id: "zero-waste-hero",
        name_es: "Héroe Zero Waste",
        name_en: "Zero Waste Hero",
        name_de: "Zero Waste Held",
        description_es: "Reduce tus residuos domésticos significativamente",
        description_en: "Reduce your household waste significantly",
        description_de: "Reduzieren Sie Ihren Haushaltsabfall erheblich",
        icon: "🗑️",
        requirement: 10,
        category: "lifestyle",
        color: "bg-slate-500",
        target: "explore"
    },
    {
        id: "green-commuter",
        name_es: "Viajero Verde",
        name_en: "Green Commuter",
        name_de: "Grüner Pendler",
        description_es: "Usa transporte sostenible durante un mes",
        description_en: "Use sustainable transport for a month",
        description_de: "Nutzen Sie einen Monat lang nachhaltige Verkehrsmittel",
        icon: "🚲",
        requirement: 30,
        category: "lifestyle",
        color: "bg-cyan-500",
        target: "explore"
    },
    // Impact & Conservation (NEW)
    {
        id: "ocean-guardian",
        name_es: "Guardián del Océano",
        name_en: "Ocean Guardian",
        name_de: "Hüter des Ozeans",
        description_es: "Participa en 5 limpiezas de playas o ríos",
        description_en: "Participate in 5 beach or river cleanups",
        description_de: "Nehmen Sie an 5 Strand- oder Flussreinigungen teil",
        icon: "🌊",
        requirement: 5,
        category: "impact",
        color: "bg-blue-700",
        target: "eventos"
    },
    {
        id: "solar-pioneer",
        name_es: "Pionero Solar",
        name_en: "Solar Pioneer",
        name_de: "Solar-Pionier",
        description_es: "Instala o apoya un proyecto de energía solar",
        description_en: "Install or support a solar energy project",
        description_de: "Installieren oder unterstützen Sie un Solarprojekt",
        icon: "☀️",
        requirement: 1,
        category: "impact",
        color: "bg-orange-500",
        target: "proyectos"
    },
    {
        id: "eco-explorer",
        name_es: "Explorador Ecológico",
        name_en: "Eco Explorer",
        name_de: "Öko-Entdecker",
        description_es: "Visita y evalúa 15 proyectos sostenibles",
        description_en: "Visit and evaluate 15 sustainable projects",
        description_de: "Besuchen und bewerten Sie 15 nachhaltige Projekte",
        icon: "🔍",
        requirement: 15,
        category: "impact",
        color: "bg-indigo-500",
        target: "explore"
    },
    {
        id: "carbon-neutral",
        name_es: "Carbono Neutral",
        name_en: "Carbon Neutral",
        name_de: "CO2-neutral",
        description_es: "Compensa 100kg de CO2",
        description_en: "Offset 100kg of CO2",
        description_de: "Kompensieren Sie 100kg CO2",
        icon: "♻️",
        requirement: 100,
        category: "impact",
        color: "bg-teal-500",
        target: "explore"
    },
    {
        id: "eco-educator",
        name_es: "Edu-Héroe",
        name_en: "Eco-Educator",
        name_de: "Öko-Lehrer",
        description_es: "Organiza o imparte un taller ambiental",
        description_en: "Organize or teach an environmental workshop",
        description_de: "Organisieren oder leiten Sie einen Umweltworkshop",
        icon: "📖",
        requirement: 1,
        category: "community",
        color: "bg-amber-600",
        target: "workshops"
    },
    {
        id: "local-foodie",
        name_es: "Consumidor Local",
        name_en: "Local Supporter",
        name_de: "Lokale Unterstützung",
        description_es: "Compra exclusivamente productos locales por un mes",
        description_en: "Buy exclusively local products for a month",
        description_de: "Kaufen Sie einen Monat lang ausschließlich lokale Produkte",
        icon: "🍎",
        requirement: 30,
        category: "lifestyle",
        color: "bg-red-500",
        target: "explore"
    },
    {
        id: "plant-based-diet",
        name_es: "Dieta Vegetal",
        name_en: "Plant-Based Diet",
        name_de: "Pflanzliche Ernährung",
        description_es: "Adopta una dieta vegetariana o vegana. Reduce entre 500-1500kg de CO2 al año",
        description_en: "Adopt a vegetarian or vegan diet. Reduce 500-1500kg of CO2 per year",
        description_de: "Ernähren Sie sich vegetarisch oder vegan. Reduzieren Sie 500-1500kg CO2 pro Jahr",
        icon: "🌿",
        requirement: 30,
        category: "lifestyle",
        color: "bg-lime-500",
        target: "explore"
    }
];

export default function BadgesPage() {
    const { t, locale } = useI18n();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<BadgeCategory>('all');
    const [userProgress, setUserProgress] = useState<Record<string, number>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load simulated progress
        const savedProgress = localStorage.getItem('econexo:badges-progress');
        if (savedProgress) {
            setUserProgress(JSON.parse(savedProgress));
        } else {
            setUserProgress({
                "first-step": 1,
                "eco-warrior": 3,
                "community-leader": 1,
                "ethical-banking": 0,
                "chat-master": 12,
                "zero-waste-hero": 4,
                "green-commuter": 15,
                "eco-explorer": 6,
                "carbon-neutral": 40
            });
        }
    }, []);

    if (!mounted) return null;

    const filteredBadges = selectedCategory === 'all'
        ? BADGES
        : BADGES.filter(b => b.category === selectedCategory);

    const getName = (badge: Badge) => {
        if (locale === 'en') return badge.name_en;
        if (locale === 'de') return badge.name_de;
        return badge.name_es;
    };

    const getDescription = (badge: Badge) => {
        if (locale === 'en') return badge.description_en;
        if (locale === 'de') return badge.description_de;
        return badge.description_es;
    };

    const isUnlocked = (badgeId: string, requirement: number) => {
        return (userProgress[badgeId] || 0) >= requirement;
    };

    const getProgress = (badgeId: string, requirement: number) => {
        const current = userProgress[badgeId] || 0;
        return Math.min(100, Math.round((current / requirement) * 100));
    };

    const categories: { id: BadgeCategory; label: string; icon: string }[] = [
        { id: 'all', label: locale === 'es' ? 'Todos' : locale === 'de' ? 'Alle' : 'All', icon: '🌟' },
        { id: 'events', label: locale === 'es' ? 'Eventos' : locale === 'de' ? 'Events' : 'Events', icon: '📅' },
        { id: 'community', label: locale === 'es' ? 'Comunidad' : locale === 'de' ? 'Gemeinschaft' : 'Community', icon: '🤝' },
        { id: 'lifestyle', label: locale === 'es' ? 'Estilo de Vida' : locale === 'de' ? 'Lebensstil' : 'Lifestyle', icon: '🌱' },
        { id: 'finance', label: locale === 'es' ? 'Finanzas' : locale === 'de' ? 'Finanzen' : 'Finance', icon: '💰' },
        { id: 'impact', label: locale === 'es' ? 'Impacto' : locale === 'de' ? 'Impact' : 'Impact', icon: '⚡' },
    ];

    return (
        <div className="min-h-screen bg-gls-primary relative pb-20">
            {/* Header / Hero */}
            <section className="relative py-16 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ecosia-green/20 via-transparent to-blue-500/10 -z-10" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        {locale === 'es' ? 'Tus ' : locale === 'de' ? 'Deine ' : 'Your '}
                        <span className="text-emerald-600">{locale === 'es' ? 'Insignias' : locale === 'de' ? 'Abzeichen' : 'Badges'}</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {locale === 'es'
                            ? 'Gana logros por cada acción positiva que realices. ¡Construyamos juntos un futuro más verde!'
                            : locale === 'de'
                                ? 'Verdiene Erfolge für jede positive Tat. Lassen Sie uns gemeinsam eine grünere Zukunft aufbauen!'
                                : 'Earn achievements for every positive action you take. Let\'s build a greener future together!'}
                    </p>
                </div>
            </section>

            {/* Category Navigation */}
            <div className="max-w-7xl mx-auto px-4 mb-12 sticky top-4 z-20">
                <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border-2 shadow-sm
                                ${selectedCategory === cat.id
                                    ? 'bg-emerald-600 text-white border-emerald-600 scale-105 shadow-emerald-200 dark:shadow-emerald-900/20'
                                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-600 dark:text-slate-300 border-transparent hover:border-emerald-200 dark:hover:border-emerald-900/30'}`}
                        >
                            <span>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Badges Grid */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBadges.map((badge) => {
                        const unlocked = isUnlocked(badge.id, badge.requirement);
                        const progress = getProgress(badge.id, badge.requirement);

                        return (
                            <Link
                                key={badge.id}
                                href={`/${badge.target}`}
                                className={`group relative rounded-3xl p-6 border transition-all duration-300 flex flex-col h-full
                                    ${unlocked
                                        ? 'bg-white dark:bg-slate-800 border-emerald-100 dark:border-emerald-900/30 shadow-xl shadow-emerald-500/5 hover:scale-[1.02] hover:-translate-y-1'
                                        : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100 hover:bg-white dark:hover:bg-slate-800'}`}
                            >
                                {/* Badge Icon */}
                                <div className="flex justify-center mb-6 relative">
                                    <div className={`w-28 h-28 rounded-full flex items-center justify-center text-6xl shadow-inner transition-transform duration-500 group-hover:rotate-12
                                        ${unlocked ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/20' : 'bg-slate-100 dark:bg-slate-800 grayscale opacity-40'}`}>
                                        {badge.icon}
                                    </div>
                                    {unlocked && (
                                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-800 animate-bounce-subtle">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center">
                                    <h3 className={`text-xl font-black mb-2 tracking-tight ${unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {getName(badge)}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                        {getDescription(badge)}
                                    </p>
                                </div>

                                {/* Progress Section */}
                                <div className="mt-auto">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            {locale === 'es' ? 'Progreso' : locale === 'de' ? 'Fortschritt' : 'Progress'}
                                        </span>
                                        <span className={`text-xs font-black ${unlocked ? 'text-emerald-600' : 'text-slate-500'}`}>
                                            {userProgress[badge.id] || 0} / {badge.requirement}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex p-0.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm
                                                ${unlocked ? badge.color : 'bg-slate-300 dark:bg-slate-700'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Hover Overlay for locked */}
                                {!unlocked && (
                                    <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                                            {locale === 'es' ? '¡Sigue así!' : locale === 'de' ? 'Mach weiter so!' : 'Keep going!'}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Empty State */}
            {filteredBadges.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🏜️</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {locale === 'es' ? 'No hay insignias en esta categoría' : 'No badges in this category'}
                    </h3>
                    <button onClick={() => setSelectedCategory('all')} className="mt-4 text-emerald-600 font-bold hover:underline">
                        {locale === 'es' ? 'Ver todas' : 'View all'}
                    </button>
                </div>
            )}
        </div>
    );
}
