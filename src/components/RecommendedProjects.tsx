"use client";

import React, { useMemo } from 'react';
import { useSmartContext } from '@/context/SmartContext';
import { calculateMatchScore } from '@/lib/matching';
import { PROJECTS } from '@/data/projects';
import Link from 'next/link';
import { useI18n, categoryLabel } from '@/lib/i18n';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function RecommendedProjects() {
    const { preferences } = useSmartContext();
    const { t, locale } = useI18n();

    const recommendations = useMemo(() => {
        // If no prefs, return empty
        if (preferences.selectedCategories.length === 0 && preferences.selectedSkills.length === 0) {
            return [];
        }

        return PROJECTS
            .map(p => ({ ...p, matchScore: calculateMatchScore(p, preferences) }))
            .filter(p => p.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 3); // Top 3
    }, [preferences]);

    if (recommendations.length === 0) return null;

    return (
        <section className="py-12 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-y border-green-100 dark:border-slate-700">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-8">
                    <span className="text-2xl">✨</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                        {t('recommendedForYou')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map(project => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all p-5 border border-green-100 dark:border-slate-700 relative overflow-hidden"
                        >
                            {/* Match Badge */}
                            <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                                {project.matchScore}% {t('match')}
                            </div>

                            <div className="h-40 -mx-5 -mt-5 mb-4 overflow-hidden relative">
                                <ImageWithFallback
                                    src={project.image_url || '/assets/default-event.png'}
                                    alt={project.name}
                                    category={project.category}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-white font-medium text-sm">{project.city}</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1">
                                {locale === 'en' ? project.name_en : locale === 'de' ? project.name_de : project.name}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-xs">
                                    {categoryLabel(project.category, locale)}
                                </span>
                                {project.tags?.slice(0, 2).map(tag => (
                                    <span key={tag} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded text-xs capitalize">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
