"use client";

import { useI18n } from "@/lib/i18n";
import React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useState } from "react";

export default function NoticiasPage() {
    const { t } = useI18n();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode] = useState<"login" | "register">("register");

    const newsItems = [
        { title: t('tickerTitle1'), category: "Environment", date: "Hoy" },
        { title: t('tickerTitle2'), category: "Policy", date: "Ayer" },
        { title: t('tickerTitle3'), category: "Community", date: "Mar 1" },
        { title: t('tickerTitle4'), category: "Technology", date: "Feb 28" },
        { title: t('tickerTitle5'), category: "Lifestyle", date: "Feb 27" },
        { title: t('tickerTitle6'), category: "Society", date: "Feb 26" },
    ];

    return (
        <div className="min-h-screen bg-modern pb-20">
            <div className="animated-gradient-bg" />

            {/* Hero Section */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-gradient-hero opacity-95 transform -skew-y-2 origin-top-left scale-105"></div>
                <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-xl border border-white/20">
                        <Newspaper className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-sm">
                        Eco News
                    </h1>
                    <p className="text-xl text-green-50 max-w-2xl font-light">
                        Mantente al día con las últimas novedades en sostenibilidad, proyectos ecológicos y políticas ambientales en toda Europa.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4">
                <div className="grid gap-6 md:gap-8">
                    {newsItems.map((news, idx) => (
                        <Link
                            key={idx}
                            href="#"
                            className="group glass-card overflow-hidden hover:scale-[1.01] transition-all block rounded-2xl border border-white/40 shadow-sm"
                        >
                            <div className="flex flex-col sm:flex-row h-full">

                                <div className="sm:w-1/3 bg-green-900/10 p-8 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-white/20 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="text-5xl drop-shadow-lg z-10 relative group-hover:scale-110 transition-transform duration-300">
                                        {idx % 3 === 0 ? "🌱" : idx % 3 === 1 ? "🌍" : "♻️"}
                                    </span>
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
                                        Leer más <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="btn-gls-primary px-8 py-4 rounded-xl text-lg shadow-xl"
                    >
                        Suscríbete al Newsletter
                    </button>
                </div>
            </main>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
            />
        </div>
    );
}
