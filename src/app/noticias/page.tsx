"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper, RefreshCw } from "lucide-react";

export default function NoticiasPage() {
    const { t } = useI18n();

    const allNewsItems = [
        {
            title: t('newsItem1Title'),
            category: t('newsItem1Category'),
            date: "Mar 5, 2026",
            link: "https://environment.ec.europa.eu/strategy/circular-economy-action-plan_en",
            image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem2Title'),
            category: t('newsItem2Category'),
            date: "Feb 28, 2026",
            link: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal_en",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem3Title'),
            category: t('newsItem3Category'),
            date: "Feb 20, 2026",
            link: "https://www.eea.europa.eu/en",
            image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem4Title'),
            category: t('newsItem4Category'),
            date: "Feb 10, 2026",
            link: "https://www.unep.org/regions/europe",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem5Title'),
            category: t('newsItem5Category'),
            date: "Mar 15, 2026",
            link: "https://www.unep.org/explore-topics/energy",
            image: "https://images.unsplash.com/photo-1509391366311-4569024c084f?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem6Title'),
            category: t('newsItem6Category'),
            date: "Mar 12, 2026",
            link: "https://www.unep.org/explore-topics/oceans-seas",
            image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem7Title'),
            category: t('newsItem7Category'),
            date: "Mar 8, 2026",
            link: "https://environment.ec.europa.eu/topics/urban-environment_en",
            image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem8Title'),
            category: t('newsItem8Category'),
            date: "Mar 1, 2026",
            link: "https://www.irena.org/Solar",
            image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem9Title'),
            category: t('newsItem9Category'),
            date: "Feb 25, 2026",
            link: "https://www.unep.org/explore-topics/forests",
            image: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: t('newsItem10Title'),
            category: t('newsItem10Category'),
            date: "Feb 15, 2026",
            link: "https://www.eea.europa.eu/en/topics/in-depth/transport-and-mobility",
            image: "https://images.unsplash.com/photo-1538592116845-11ee0b8015df?q=80&w=800&auto=format&fit=crop"
        }
    ];

    const [displayedNews, setDisplayedNews] = useState(allNewsItems.slice(0, 4));
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadRandomNews = () => {
        setIsRefreshing(true);
        // Shuffle and pick 4
        const shuffled = [...allNewsItems].sort(() => 0.5 - Math.random());
        setDisplayedNews(shuffled.slice(0, 4));
        
        setTimeout(() => setIsRefreshing(false), 500);
    };

    // Load random news on mount (which corresponds to "recarga la página" or "cliquea ahí")
    useEffect(() => {
        loadRandomNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-modern pb-20">
            <div className="animated-gradient-bg" />

            {/* Hero */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-gradient-hero opacity-95 transform -skew-y-2 origin-top-left scale-105" />
                <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-xl border border-white/20">
                        <Newspaper className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        {t('ecoNewsTitle')}
                    </h1>
                    <p className="text-xl text-green-50 max-w-2xl font-light">
                        {t('ecoNewsDescription')}
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
