"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n, categoryLabel, locationLabel } from "@/lib/i18n";
import { ensureEventImage } from "@/lib/eventImages";
import ImageWithFallback from "@/components/ImageWithFallback";

type Event = {
    id: string;
    title: string;
    title_en?: string;
    title_de?: string;
    title_fr?: string;
    date: string;
    city: string;
    country: string;
    category: string;
    image_url?: string;
    start_time?: string;
};

export default function NearbyEventsList() {
    const { t, locale } = useI18n();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvents() {
            try {
                const res = await fetch("/api/events");
                if (res.ok) {
                    const data = await res.json();
                    // Sort by date and take the first 5 for the "nearby/upcoming" look
                    const sorted = (Array.isArray(data) ? data : [])
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 5);
                    setEvents(sorted);
                }
            } catch (err) {
                console.error("Failed to load events", err);
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    const getEventTitle = (event: Event) => {
        if (locale === 'en' && event.title_en) return event.title_en;
        if (locale === 'de' && event.title_de) return event.title_de;
        if (locale === 'fr' && event.title_fr) return event.title_fr;
        return event.title;
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-slate-800 rounded-xl w-full" />
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('noNearbyEvents')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>📍</span> {t('eventsNearby')}
                </h2>
                <Link href="/eventos/disponibles" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                    {t('viewAll')} →
                </Link>
            </div>

            <div className="grid gap-4">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/eventos/${event.id}`}
                        className="group flex gap-4 p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 shadow-sm hover:shadow-md border-l-4 border-l-emerald-500"
                    >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-inner">
                            <ImageWithFallback
                                src={ensureEventImage(event)}
                                alt={getEventTitle(event)}
                                category={event.category}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                    {categoryLabel(event.category, locale)}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                    {event.date}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                                {getEventTitle(event)}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <span className="opacity-70">📍</span> {locationLabel(event.city, locale)}, {locationLabel(event.country, locale)}
                            </p>
                        </div>
                        <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">
                            <span className="text-emerald-600">→</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
