"use client";

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { PROJECTS } from '@/data/projects';
import ImageWithFallback from '@/components/ImageWithFallback';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

export default function ProjectsPage() {
    const { t, locale } = useI18n();

    const getLocalizedContent = (item: any, field: string) => {
        const localizedKey = `${field}_${locale}`;
        if (locale !== 'es' && item[localizedKey]) {
            return item[localizedKey];
        }
        return item[field];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/explore" className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-block">
                        ← {t("back")}
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {t("featuredProjects")}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                        {t("featuredProjectsDesc")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROJECTS.map((project) => (
                        <div key={project.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex flex-col h-full group relative">
                            {/* Favorite Button - Absolute z-20 */}
                            <div className="absolute top-6 right-6 z-20">
                                <FavoriteButton
                                    type="project"
                                    id={project.id}
                                    data={project}
                                    className="bg-white/90 dark:bg-slate-900/90 w-10 h-10 flex items-center justify-center rounded-full shadow-sm hover:scale-110 transition-transform"
                                />
                            </div>

                            <Link href={`/projects/${project.id}`} className="block flex-1 flex flex-col h-full">
                                <div className="h-48 w-full rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
                                    <ImageWithFallback
                                        src={project.image_url || '/assets/default-project.png'}
                                        alt={getLocalizedContent(project, 'name')}
                                        category={project.category}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold rounded-lg shadow-sm text-emerald-700 dark:text-emerald-400 z-10">
                                        {project.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                                    {getLocalizedContent(project, 'name')}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
                                    {getLocalizedContent(project, 'description')}
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">📍 {project.city}, {project.country}</span>
                                    {project.spots && (
                                        <span>👥 {project.spots} spots</span>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
