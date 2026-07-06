"use client";

import React from 'react';
import { useI18n, categoryLabel } from '@/lib/i18n';
import { realEvents2026 } from '@/data/events-2026-real';
import ImageWithFallback from '@/components/ImageWithFallback';
import Link from 'next/link';

export default function CoursesPage() {
    const { t, locale } = useI18n();

    // Filter for Education/Workshop events
    const courses = realEvents2026.filter(event =>
        event.category === 'Educación' ||
        (event.optional_categories && event.optional_categories.includes('Educación'))
    );

    const getLocalizedContent = (item: any, field: string) => {
        const localizedKey = `${field}_${locale}`;
        // If current locale is not Spanish (default) and there is a translation
        if (locale !== 'es' && item[localizedKey]) {
            return item[localizedKey];
        }
        // Fallback or default Spanish
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
                        {t("coursesAndWorkshops")}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                        {t("coursesAndWorkshopsDesc")}
                    </p>
                </div>

                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((event) => (
                            <Link
                                key={event.id}
                                href={`/eventos/${event.id}`}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex flex-col h-full group"
                            >
                                <div className="h-48 w-full rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
                                    <ImageWithFallback
                                        src={event.image_url}
                                        alt={getLocalizedContent(event, 'title')}
                                        category={event.category}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold rounded-lg shadow-sm text-emerald-700 dark:text-emerald-400">
                                        {event.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                                    {getLocalizedContent(event, 'title')}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
                                    {getLocalizedContent(event, 'description')}
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">📍 {event.city}, {event.country}</span>
                                    <span>📅 {event.date}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500">No available courses found at the moment.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
