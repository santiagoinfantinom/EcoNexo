"use client";
import NearbyEventsList from '@/components/NearbyEventsList';
import { useState } from 'react';
import ProjectSubmissionModal from '@/components/ProjectSubmissionModal';

// Imports needed
import { realEvents2026 } from '@/data/events-2026-real';
import { ensureEventImage } from '@/lib/eventImages';
import ImageWithFallback from '@/components/ImageWithFallback';
import Link from 'next/link';
import { categoryLabel, locationLabel, useI18n } from '@/lib/i18n';

// Inside ExplorePage component
export default function ExplorePage() {
    const { t, locale } = useI18n();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    // Cross-lingual mapping for the tags
    const keywordMapping: Record<string, string[]> = {
        'biodiversity': ['biodiversity', 'biodiversidad', 'artenvielfalt', 'biodiversität'],
        'biodiversidad': ['biodiversity', 'biodiversidad', 'artenvielfalt', 'biodiversität'],
        'artenvielfalt': ['biodiversity', 'biodiversidad', 'artenvielfalt', 'biodiversität'],

        'solar energy': ['solar', 'solarenergie', 'energía solar', 'photovoltaic', 'fotovoltaica'],
        'energía solar': ['solar', 'solarenergie', 'energía solar', 'photovoltaic', 'fotovoltaica'],
        'solarenergie': ['solar', 'solarenergie', 'energía solar', 'photovoltaic', 'fotovoltaica'],

        'zero waste': ['zero waste', 'cero residuos', 'müllfrei', 'abfallvermeidung', 'residuo cero'],
        'cero residuos': ['zero waste', 'cero residuos', 'müllfrei', 'abfallvermeidung', 'residuo cero'],

        'reforestation': ['reforestation', 'reforestación', 'aufforstung', 'planting', 'pflanzung'],
        'reforestación': ['reforestation', 'reforestación', 'aufforstung', 'planting', 'pflanzung'],
        'aufforstung': ['reforestation', 'reforestación', 'aufforstung', 'planting', 'pflanzung']
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase().replace('#', '').trim();

        // Check if the query matches any known tag concept to expand search
        const expandedTerms = keywordMapping[lowerQuery] ? keywordMapping[lowerQuery] : [lowerQuery];

        const results = realEvents2026.filter(event => {
            // Check if ANY of the expanded terms match the event
            return expandedTerms.some(term =>
                event.title.toLowerCase().includes(term) ||
                (event.title_en && event.title_en.toLowerCase().includes(term)) ||
                (event.title_de && event.title_de.toLowerCase().includes(term)) ||
                event.city.toLowerCase().includes(term) ||
                event.country.toLowerCase().includes(term) ||
                event.category.toLowerCase().includes(term) ||
                (event.description && event.description.toLowerCase().includes(term)) ||
                (event.description_en && event.description_en.toLowerCase().includes(term)) ||
                (event.description_de && event.description_de.toLowerCase().includes(term))
            );
        }).slice(0, 9); // Limit to 9 results
        setSearchResults(results);
    };

    const getEventTitle = (event: any) => {
        if (locale === 'en' && event.title_en) return event.title_en;
        if (locale === 'de' && event.title_de) return event.title_de;
        return event.title;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        {t("explore")} <span className="text-emerald-600">EcoNexo</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                        {t("exploreDescription")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">🔍</span>
                                {t("impactSearch")}
                            </h2>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder={t("searchPlaceholderExplore")}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-100 dark:bg-slate-700 border-none rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                    🔎
                                </span>
                                {searchQuery && (
                                    <button
                                        onClick={() => handleSearch('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white px-2"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {['tagBiodiversity', 'tagSolarEnergy', 'tagZeroWaste', 'tagReforestation'].map(tagKey => (
                                    <button
                                        key={tagKey}
                                        onClick={() => handleSearch(t(tagKey))}
                                        className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400 transition-all"
                                    >
                                        #{t(tagKey)}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Search Results OR Default Content */}
                        {searchQuery ? (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t("searchResults")} "{searchQuery}"
                                    </h3>
                                    <span className="text-sm text-slate-500">{searchResults.length} {t("found")}</span>
                                </div>

                                {searchResults.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {searchResults.map((event) => (
                                            <Link
                                                key={event.id}
                                                href={`/eventos/${event.id}`}
                                                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex flex-col h-full group"
                                            >
                                                <div className="h-40 w-full rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
                                                    <ImageWithFallback
                                                        src={ensureEventImage(event)}
                                                        alt={getEventTitle(event)}
                                                        category={event.category}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold rounded-lg shadow-sm text-emerald-700 dark:text-emerald-400">
                                                        {categoryLabel(event.category, locale)}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                                                    {getEventTitle(event)}
                                                </h4>
                                                <div className="mt-auto pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1">📍 {event.city}, {event.country}</span>
                                                    <span>📅 {event.date}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                        <div className="text-4xl mb-2">🤔</div>
                                        <p className="text-slate-500">{t("noResultsFor")} "{searchQuery}"</p>
                                        <button onClick={() => handleSearch('')} className="text-emerald-600 font-bold mt-2 hover:underline">{t("clearSearch")}</button>
                                    </div>
                                )}
                            </section>
                        ) : (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold mb-2 text-white">{t("featuredProjects")}</h3>
                                        <p className="text-green-50 text-sm mb-4">{t("featuredProjectsDesc")}</p>
                                        <Link href="/proyectos" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-all backdrop-blur-sm text-white inline-block">
                                            {t("viewProjects")}
                                        </Link>
                                    </div>
                                    <span className="absolute -right-4 -bottom-4 text-7xl opacity-20 group-hover:scale-110 transition-transform">🌳</span>
                                </div>
                                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold mb-2">{t("coursesAndWorkshops")}</h3>
                                        <p className="text-indigo-50 text-sm mb-4">{t("coursesAndWorkshopsDesc")}</p>
                                        <Link href="/cursos" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-all backdrop-blur-sm inline-block">
                                            {t("exploreCourses")}
                                        </Link>
                                    </div>
                                    <span className="absolute -right-4 -bottom-4 text-7xl opacity-20 group-hover:scale-110 transition-transform">🎓</span>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <section className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <NearbyEventsList />
                        </section>

                        <section className="bg-green-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                            <h3 className="text-lg font-bold mb-2">{t("haveInitiative")}</h3>
                            <p className="text-emerald-100 text-sm mb-4">{t("registerInitiativeDesc")}</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                            >
                                {t("publishProject")}
                            </button>
                        </section>
                    </div>
                </div>
            </main>
            <ProjectSubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
