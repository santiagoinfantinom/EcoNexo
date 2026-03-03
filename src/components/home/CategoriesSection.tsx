"use client";

import { useI18n, categoryLabel } from "@/lib/i18n";
import Link from "next/link";
import {
    Sprout,
    BookOpen,
    Users,
    HeartPulse,
    Waves,
    Apple,
    ArrowRight,
} from "lucide-react";

export default function CategoriesSection() {
    const { t, locale } = useI18n();

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-white/50 dark:to-slate-900/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-green-600 font-semibold tracking-wider uppercase text-sm mb-2 block">{t('exploreCategories')}</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        {t('categories')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        href="/categorias/medio-ambiente"
                        className="group glass-card p-8 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300">
                            <Sprout className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            {t('environmentTitle')}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t('environmentDescription')}
                        </p>
                    </Link>

                    <Link
                        href="/categorias/educacion"
                        className="group glass-card p-8 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            {t('educationTitle')}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t('educationDescription')}
                        </p>
                    </Link>

                    <Link
                        href="/categorias/comunidad"
                        className="group glass-card p-8 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            {t('communityTitle')}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t('communityDescription')}
                        </p>
                    </Link>

                    <Link
                        href="/categorias/salud"
                        className="group glass-card p-8 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center mb-6 text-red-600 group-hover:scale-110 transition-transform duration-300">
                            <HeartPulse className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            {t('healthTitle')}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t('healthDescription')}
                        </p>
                    </Link>

                    <Link
                        href="/categorias/oceanos"
                        className="group glass-card p-8 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/50 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 group-hover:scale-110 transition-transform duration-300">
                            <Waves className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            {t('oceansTitle')}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t('oceansDescription')}
                        </p>
                    </Link>

                    <Link
                        href="/categorias/alimentacion"
                        className="group glass-card p-8 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform duration-300">
                            <Apple className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            {t('foodTitle')}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t('foodDescription')}
                        </p>
                    </Link>
                </div>
            </div>
        </section>
    );
}
