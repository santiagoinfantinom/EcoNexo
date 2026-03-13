import React, { useMemo } from 'react';
import { useSmartContext } from '@/context/SmartContext';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

interface Buddy {
    id: string;
    name: string;
    avatar: string;
    city: string;
    matchedSkills: string[];
    matchScore: number;
}

const MOCK_BUDDIES: Buddy[] = [
    {
        id: 'user_1',
        name: 'Laura M.',
        avatar: '👩‍🌾',
        city: 'Berlín',
        matchedSkills: ['gardening', 'tech'],
        matchScore: 90
    },
    {
        id: 'user_2',
        name: 'Carlos T.',
        avatar: '👨‍🔧',
        city: 'Madrid',
        matchedSkills: ['manual', 'social'],
        matchScore: 85
    },
    {
        id: 'user_3',
        name: 'Sophie R.',
        avatar: '👩‍🔬',
        city: 'París',
        matchedSkills: ['teaching', 'tech'],
        matchScore: 75
    },
    {
        id: 'user_4',
        name: 'Marco D.',
        avatar: '🧔',
        city: 'Berlín',
        matchedSkills: ['art', 'social'],
        matchScore: 60
    }
];

export default function EcoBuddiesList() {
    const { preferences } = useSmartContext();
    const { t, locale } = useI18n();

    // Calculate a dynamic score based on user skills (mock logic for demo)
    const buddies = useMemo(() => {
        return MOCK_BUDDIES.map(buddy => {
            let score = 50; // Base score
            const matchingCount = buddy.matchedSkills.filter(skill => preferences.selectedSkills.includes(skill)).length;
            score += (matchingCount * 20); // Boost by 20 per matching skill
            return { ...buddy, matchScore: Math.min(100, score) };
        }).sort((a, b) => b.matchScore - a.matchScore);
    }, [preferences.selectedSkills]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">🌱</span> {locale === 'en' ? 'Eco-Buddies' : locale === 'de' ? 'Eco-Freunde' : 'Eco-Buddies'}
                </h3>
                <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                    {locale === 'en' ? 'Matches' : locale === 'de' ? 'Übereinstimmungen' : 'Coincidencias'}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                {locale === 'en'
                    ? 'Connect with volunteers who share your skills and interests.'
                    : locale === 'de'
                        ? 'Vernetze dich mit Freiwilligen, die deine Fähigkeiten und Interessen teilen.'
                        : 'Conecta con voluntarios que comparten tus habilidades e intereses.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {buddies.slice(0, 4).map(buddy => (
                    <div key={buddy.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between bg-gray-50 dark:bg-slate-700/30 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl bg-white dark:bg-slate-600 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                                {buddy.avatar}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white">{buddy.name}</h4>
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <span>📍 {buddy.city}</span>
                                    <span>•</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold">{buddy.matchScore}% Match</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors font-medium cursor-pointer"
                            onClick={() => alert('Feature coming soon: Direct messaging')}
                        >
                            {locale === 'en' ? 'Say Hi 👋' : locale === 'de' ? 'Sag Hallo 👋' : 'Saludar 👋'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
