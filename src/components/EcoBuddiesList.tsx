import React, { useMemo, useState } from 'react';
import { useSmartContext } from '@/context/SmartContext';
import { useI18n } from '@/lib/i18n';

export interface Buddy {
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

interface EcoBuddiesListProps {
    onSayHi?: (buddy: Buddy) => void;
}

export default function EcoBuddiesList({ onSayHi }: EcoBuddiesListProps) {
    const { preferences } = useSmartContext();
    const { t, locale } = useI18n();
    const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);

    // Calculate a dynamic score based on user skills (mock logic for demo)
    const buddies = useMemo(() => {
        return MOCK_BUDDIES.map(buddy => {
            let score = 50; // Base score
            const matchingCount = buddy.matchedSkills.filter(skill => preferences.selectedSkills.includes(skill)).length;
            score += (matchingCount * 20); // Boost by 20 per matching skill
            return { ...buddy, matchScore: Math.min(100, score) };
        }).sort((a, b) => b.matchScore - a.matchScore);
    }, [preferences.selectedSkills]);

    const formatInterest = (skill: string) => {
        const skillKeyMap: Record<string, string> = {
            gardening: "buddySkillGardening",
            tech: "buddySkillTech",
            manual: "buddySkillManual",
            social: "buddySkillSocial",
            teaching: "buddySkillTeaching",
            art: "buddySkillArt",
        };
        const translated = t(skillKeyMap[skill] || skill);
        if (translated && translated !== skill) return translated;
        return skill.charAt(0).toUpperCase() + skill.slice(1);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">🌱</span> {t("ecoBuddies")}
                </h3>
                <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                    {t("matchesLabel")}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                {t("ecoBuddiesDesc")}
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
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBuddy(buddy)}
                                        className="text-green-600 dark:text-green-400 font-bold underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                                        aria-label={`${buddy.matchScore}% ${t("match")} - ${locale === 'es' ? 'Ver intereses en común' : locale === 'de' ? 'Gemeinsame Interessen anzeigen' : 'View common interests'}`}
                                    >
                                        {buddy.matchScore}% {t("match")}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                if (onSayHi) {
                                    onSayHi(buddy);
                                    return;
                                }
                                alert(t("comingSoonMessaging"));
                            }}
                        >
                            {t("sayHi")}
                        </button>
                    </div>
                ))}
            </div>

            {selectedBuddy && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedBuddy(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={locale === 'es' ? 'Intereses en común' : locale === 'de' ? 'Gemeinsame Interessen' : 'Common interests'}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-2xl p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {locale === 'es' ? 'Intereses en común' : locale === 'de' ? 'Gemeinsame Interessen' : 'Common interests'}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedBuddy.name}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedBuddy(null)}
                                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white font-bold"
                                aria-label={locale === 'es' ? 'Cerrar' : locale === 'de' ? 'Schließen' : 'Close'}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedBuddy.matchedSkills.map((skill) => (
                                <span
                                    key={`${selectedBuddy.id}-${skill}`}
                                    className="inline-flex items-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-3 py-1 text-xs font-semibold"
                                >
                                    {formatInterest(skill)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
