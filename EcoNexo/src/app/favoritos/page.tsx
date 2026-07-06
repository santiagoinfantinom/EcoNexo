"use client";

import { useI18n, categoryLabel, locationLabel } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { EVENT_DETAILS } from "@/data/eventDetails";
import { PROJECTS } from "@/data/projects";
import FavoriteButton from "@/components/FavoriteButton";
import { JOBS } from "@/data/jobs";

export default function FavoritesPage() {
    const { t, locale } = useI18n();
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would fetch from a database or a specific 'saved' localStorage key
        // For now, we'll demonstrate it with 'participated' events as a proxy for "interesting things"
        // plus look for a specific 'favorites' key we might implement later.

        const loadFavorites = () => {
            try {
                // 1. Get explicitly saved items (future proofing)
                const saved = JSON.parse(localStorage.getItem('econexo:saved') || '[]');

                // Deduplicate by type+id
                const rawCombined = [...saved].reduce((acc, current) => {
                    const x = acc.find((item: any) => item.id === current.id);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);

                // Hydrate missing data
                const hydrated = rawCombined.map((item: any) => {
                    // Try to find in PROJECTS
                    const p = PROJECTS.find((p: any) => p.id === item.id);
                    if (p) {
                        return {
                            ...item,
                            type: 'project',
                            title: item.title || p.name,
                            name: item.name || p.name,
                            image_url: item.image_url || p.image_url,
                            category: item.category || p.category,
                            city: item.city || p.city,
                            country: item.country || p.country
                        };
                    }
                    // Try to find in EVENT_DETAILS
                    else if (EVENT_DETAILS[item.id]) {
                        const e = EVENT_DETAILS[item.id];
                        return {
                            ...item,
                            type: 'event',
                            title: item.title || e.title,
                            image_url: item.image_url || e.image_url,
                            category: item.category || e.category,
                            city: item.city || (e.location ? e.location.split(',')[0].trim() : ''),
                            date: item.date || e.date
                        };
                    }
                    // Try to find in JOBS
                    const j = JOBS.find((job: any) => job.id === item.id);
                    if (j) {
                        const title = typeof j.title === 'string' ? j.title : (j.title?.[locale] || j.title?.es || j.title?.en);
                        const city = typeof j.city === 'string' ? j.city : (j.city?.[locale] || j.city?.es || j.city?.en);
                        const country = typeof j.country === 'string' ? j.country : (j.country?.[locale] || j.country?.es || j.country?.en);
                        return {
                            ...item,
                            type: 'job',
                            title: item.title || title,
                            name: item.name || title,
                            image_url: item.image_url || j.logo_url,
                            category: item.category || 'Empleo',
                            city: item.city || city,
                            country: item.country || country,
                            apply_url: item.apply_url || j.apply_url,
                        };
                    }
                    return item;
                });

                setSavedItems(hydrated);
            } catch (e) {
                console.error("Error loading favorites", e);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [locale]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-10 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-pulse text-xl text-slate-500">{t("loading") || "Cargando..."}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-3">
                    <span className="text-4xl">⭐</span>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        {locale === 'es' ? 'Mis Favoritos' : locale === 'de' ? 'Meine Favoriten' : 'My Favorites'}
                    </h1>
                </div>

                {savedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems.map((item) => (
                            <Link
                                key={`${item.type || 'project'}-${item.id}`}
                                href={item.type === 'job' ? (item.apply_url || '/trabajos') : `/${item.type === 'project' ? 'projects' : 'eventos'}/${item.id}`}
                                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all"
                                target={item.type === 'job' && typeof item.apply_url === 'string' && item.apply_url.startsWith('http') ? '_blank' : undefined}
                                rel={item.type === 'job' ? 'noopener noreferrer' : undefined}
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <ImageWithFallback
                                        src={item.image_url || "/window.svg"} // Fallback logic embedded
                                        alt={item.title || item.name}
                                        category={item.category}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur w-10 h-10 flex items-center justify-center rounded-full shadow-sm">
                                            <FavoriteButton
                                                type={item.type === 'job' ? 'job' : (item.type || 'project')}
                                                id={item.id}
                                                data={item}
                                                className="w-8 h-8 flex items-center justify-center"
                                                iconSize="text-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wide">
                                            {categoryLabel(item.category || "Comunidad", locale)}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2">
                                        {item.title || item.name}
                                    </h3>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            📍 {locationLabel(item.city || "", locale)}
                                        </span>
                                        {item.date && (
                                            <span className="flex items-center gap-1">
                                                📅 {item.date}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="text-6xl mb-4 opacity-50">✨</div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {locale === 'es' ? 'Aún no tienes favoritos' : locale === 'en' ? 'No favorites yet' : 'Noch keine Favoriten'}
                        </h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            {locale === 'es'
                                ? 'Guarda los eventos y proyectos que más te interesen para encontrarlos fácilmente aquí.'
                                : locale === 'de'
                                    ? 'Speichere Projekte, Veranstaltungen und Jobs, die dich interessieren, um sie hier schnell wiederzufinden.'
                                    : 'Save projects, events and jobs you are interested in to easily find them here.'}
                        </p>
                        <Link href="/explore" className="px-6 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/20">
                            {locale === 'es' ? 'Explorar EcoNexo' : 'Explore EcoNexo'}
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
