"use client";

import { useI18n } from "@/lib/i18n";
import React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

export default function NoticiasPage() {
    const { t } = useI18n();

    const newsItems = [
        {
            title: "EU Adopts New Packaging and Waste Regulation for 2030",
            category: "♻️ Circular Economy",
            date: "Mar 5, 2026",
            link: "https://environment.ec.europa.eu/strategy/circular-economy-action-plan_en",
            image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: "EU Deforestation Regulation Delay: Core Obligations Shift to December 2026",
            category: "📋 Policy",
            date: "Feb 28, 2026",
            link: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal_en",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: "EU Green Week 2026: Focus on the Nature-Positive Economy",
            category: "🌿 Environment",
            date: "Feb 20, 2026",
            link: "https://www.eea.europa.eu/en",
            image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop"
        },
        {
            title: "New Water and Air Quality Laws Mandate Corporate Responsibility",
            category: "💧 Sustainability",
            date: "Feb 10, 2026",
            link: "https://www.unep.org/regions/europe",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop"
        },
    ];

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
                        Eco News
                    </h1>
                    <p className="text-xl text-green-50 max-w-2xl font-light">
                        {t('ecoTipsDescription') || 'Stay up to date with the latest sustainability news and environmental policies across Europe.'}
                    </p>
                </div>
            </section>

            {/* News List */}
            <main className="max-w-5xl mx-auto px-4">
                <div className="grid gap-6 md:gap-8">
                    {newsItems.map((news, idx) => (
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
                                        {t('viewAll') || 'Read more'} <ArrowRight className="w-4 h-4 ml-1" />
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
