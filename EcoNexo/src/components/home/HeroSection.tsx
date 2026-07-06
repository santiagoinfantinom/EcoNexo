"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import Link from "next/link";
import {
    Map as MapIcon,
    Search,
    ArrowRight,
} from "lucide-react";

interface HeroSectionProps {
    onToggleMap: () => void;
    showMap: boolean;
}

export default function HeroSection({ onToggleMap, showMap }: HeroSectionProps) {
    const { t } = useI18n();

    return (
        <section className="relative py-20 sm:py-24 md:py-32 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero opacity-95 transform -skew-y-3 origin-top-left scale-110"></div>

            <div className="relative max-w-7xl mx-auto text-center z-10">
                <div className="perf-fade-in-up">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-sm">
                        {t('welcomeMessageTitle')}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                        {t('welcomeMessageDescription')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button
                            onClick={onToggleMap}
                            className="btn-gls-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                        >
                            <MapIcon className="w-5 h-5" />
                            {showMap ? t('hideMap') : t('showMap')}
                        </button>

                        <Link
                            href="/eventos"
                            className="bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            {t('exploreEvents')}
                        </Link>

                        <Link
                            href="/trabajos"
                            className="bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                        >
                            <ArrowRight className="w-5 h-5" />
                            {t('findJobs')}
                        </Link>

                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto perf-fade-in-up-delay">
                    <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                        <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">{t('activeProjects')}</div>
                    </div>
                    <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-bold text-blue-600 mb-2">2,500+</div>
                        <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">{t('volunteers')}</div>
                    </div>
                    <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                        <div className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">{t('cities')}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
