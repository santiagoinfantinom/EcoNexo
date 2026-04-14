"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper, RefreshCw } from "lucide-react";

export default function NoticiasPage() {
    const { t, locale } = useI18n();

    const [allNewsItems, setAllNewsItems] = useState<any[]>([]);
    const [displayedNews, setDisplayedNews] = useState<any[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        setLoadError(false);
        try {
            const res = await fetch(`/api/news?lang=${locale}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`News request failed (${res.status})`);
            const data = await res.json();
            if (data && Array.isArray(data.news)) {
                setAllNewsItems(data.news);
                setDisplayedNews(data.news.slice(0, 4));
            } else {
                setAllNewsItems([]);
                setDisplayedNews([]);
                setLoadError(true);
            }
        } catch (error) {
            console.error("Failed to fetch news:", error);
            setAllNewsItems([]);
            setDisplayedNews([]);
            setLoadError(true);
        } finally {
            setIsLoading(false);
        }
    }, [locale]);

    const loadRandomNews = () => {
        if (allNewsItems.length === 0) return;
        setIsRefreshing(true);
        // Shuffle and pick 4
        const shuffled = [...allNewsItems].sort(() => 0.5 - Math.random());
        setDisplayedNews(shuffled.slice(0, 4));
        
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return (
        <div className="min-h-screen bg-modern pb-20">
            <div className="animated-gradient-bg" />

            {/* Hero */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-gradient-hero opacity-95 transform -skew-y-2 origin-top-left scale-105" />
                <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
                    <span className="mb-4 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                        {locale === "es" ? "Inteligencia climática" : locale === "de" ? "Klima-Intelligence" : "Climate intelligence"}
                    </span>
                    <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-xl border border-white/20">
                        <Newspaper className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        {t('ecoNewsTitle')}
                    </h1>
                    <p className="text-xl text-green-50 max-w-2xl font-light">
                        {t('ecoNewsDescription')}
                    </p>
                    <p className="mt-4 text-sm text-white/80 max-w-2xl">
                        {locale === "es"
                            ? "Fuentes ambientales curadas para decisiones con impacto y contexto local."
                            : locale === "de"
                                ? "Kuratiertes Umwelt-Reporting für wirkungsorientierte Entscheidungen mit lokalem Kontext."
                                : "Curated environmental coverage for impact-driven decisions with local context."}
                    </p>
                </div>
            </section>

            {/* News List */}
            <main className="max-w-5xl mx-auto px-4">
                <div className="flex justify-end mb-6">
                    <button 
                        onClick={loadRandomNews}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/40 shadow-sm border border-white/40 dark:border-white/10 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 rounded-full transition-all text-gray-800 dark:text-gray-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{t('refresh') || 'Refresh'}</span>
                    </button>
                </div>
                {!isLoading && displayedNews.length === 0 && (
                    <div className="mb-6 rounded-xl border border-white/40 bg-white/70 dark:bg-slate-800/60 px-4 py-6 text-center">
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {locale === 'de'
                                ? 'Der News-Feed ist gerade nicht verfügbar. Bitte aktualisieren Sie in ein paar Sekunden.'
                                : locale === 'es'
                                    ? 'El feed de noticias no está disponible en este momento. Intenta actualizar en unos segundos.'
                                    : 'The news feed is currently unavailable. Please refresh in a few seconds.'}
                        </p>
                    </div>
                )}
                {loadError && !isLoading && displayedNews.length > 0 && (
                    <div className="mb-6 rounded-xl border border-amber-300/60 bg-amber-50/80 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
                        {locale === 'de'
                            ? 'Fallback-News werden angezeigt, da einige Quellen nicht erreichbar waren.'
                            : locale === 'es'
                                ? 'Mostrando noticias de respaldo porque algunas fuentes no estuvieron disponibles.'
                                : 'Showing fallback news because some sources were unavailable.'}
                    </div>
                )}
                <div className={`grid gap-6 md:gap-8 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                    {displayedNews.map((news, idx) => (
                        <a
                            key={idx}
                            href={news.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group glass-card overflow-hidden block rounded-2xl border border-white/40 shadow-sm"
                        >
                            <div className="flex flex-col sm:flex-row h-full">
                                <div className="sm:w-1/3 relative h-48 sm:h-auto overflow-hidden border-b sm:border-b-0 sm:border-r border-white/20">
                                    <img
                                        src={news.image}
                                        alt={news.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-bold rounded-full tracking-wider uppercase">
                                            {news.category}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            {news.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                        {news.title}
                                    </h3>
                                    <div className="mt-4 flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-2 transition-transform">
                                        {t('readMore')} <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
}
