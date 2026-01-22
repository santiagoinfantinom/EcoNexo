"use client";

import React, { useState, useMemo } from 'react';
import { CITY_RANKING, CityRankingData } from '@/data/cityRanking';
import Link from 'next/link';
// import GamificationHub from "@/components/GamificationHubNew";

export default function RankingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'ecoScore' | 'points'>('ecoScore');

    // Get unique countries for filter
    const countries = useMemo(() => {
        const uniqueCountries = Array.from(new Set(CITY_RANKING.map(city => city.country)));
        return uniqueCountries.sort();
    }, []);

    // Filter and sort cities based on search, country and sortBy
    const filteredCities = useMemo(() => {
        const filtered = CITY_RANKING.filter(city => {
            const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                city.country.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCountry = selectedCountry === 'all' || city.country === selectedCountry;
            return matchesSearch && matchesCountry;
        });

        const sorted = [...filtered].sort((a, b) => b[sortBy] - a[sortBy]);

        // Re-assign rank based on current sort
        return sorted.map((city, index) => ({ ...city, displayRank: index + 1 }));
    }, [searchQuery, selectedCountry, sortBy]);

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            case 'same': return '➡️';
            default: return '';
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up': return 'text-green-600 dark:text-green-400';
            case 'down': return 'text-red-600 dark:text-red-400';
            case 'same': return 'text-gray-600 dark:text-gray-400';
            default: return '';
        }
    };

    const getMedalEmoji = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
            {/* <GamificationHub /> */}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-4 transition-colors"
                    >
                        ← Volver al inicio
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                                🏙️ Ranking de Impacto Urbano
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Un sistema de puntuación realista basado en actividad, eficiencia y sostenibilidad relativa.
                            </p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                            <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-300 block mb-1">Cálculo EcoScore</span>
                            <p className="text-[10px] text-green-600 dark:text-green-400 leading-tight max-w-xs">
                                Basado en Densidad XP (30%), Vitalidad Comunitaria (30%), Eficiencia Proyectos (20%) e Impacto CO2 (20%).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                🔍 Buscar ciudad
                            </label>
                            <input
                                type="text"
                                placeholder="Escribe el nombre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Country Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                🌍 Filtrar por país
                            </label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            >
                                <option value="all">Todos los países</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ⚖️ Ordenar por
                            </label>
                            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                                <button
                                    onClick={() => setSortBy('ecoScore')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${sortBy === 'ecoScore' ? 'bg-white dark:bg-slate-600 shadow text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    EcoScore
                                </button>
                                <button
                                    onClick={() => setSortBy('points')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${sortBy === 'points' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    Total XP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ranking Table/Grid */}
                <div className="space-y-4">
                    {filteredCities.map((city) => (
                        <div
                            key={city.name}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                                {/* Rank & Medal */}
                                <div className="flex items-center justify-between xl:justify-start gap-4 shrink-0">
                                    <div className={`
                                        w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-inner
                                        ${city.displayRank === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900' :
                                            city.displayRank === 2 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800' :
                                                city.displayRank === 3 ? 'bg-gradient-to-br from-orange-200 to-orange-400 text-orange-900' :
                                                    'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'}
                                    `}>
                                        {getMedalEmoji(city.displayRank) || city.displayRank}
                                    </div>
                                    <div className="xl:hidden flex items-center gap-2">
                                        <span className="text-2xl">{city.flagEmoji}</span>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{city.name}</h3>
                                    </div>
                                    <div className="xl:hidden text-right">
                                        <div className="text-3xl font-black text-green-600 dark:text-green-400 leading-none">
                                            {city.ecoScore}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">EcoScore</span>
                                    </div>
                                </div>

                                {/* Main Info & Score Breakdown */}
                                <div className="flex-1">
                                    <div className="hidden xl:flex items-center gap-3 mb-4">
                                        <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                                            {city.name}
                                        </h3>
                                        <span className="text-3xl filter drop-shadow-sm">{city.flagEmoji}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {city.country}
                                        </span>
                                        <div className="ml-auto flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-4xl font-black text-green-600 dark:text-green-400 leading-none">
                                                    {city.ecoScore}
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">EcoScore Realista</span>
                                            </div>
                                            <div className="w-px h-10 bg-gray-200 dark:bg-slate-700 mx-2" />
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{getTrendIcon(city.trend)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* EcoScore Breakdown Visualizer */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                <span>Impacto/Pob</span>
                                                <span className="text-green-600">{city.participationRate}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-green-500 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.min(city.participationRate * 5, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                <span>Ahorro CO2</span>
                                                <span className="text-blue-600">{city.co2Saved}t</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${(city.co2Saved / 1300) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                <span>Crecimiento</span>
                                                <span className={city.growthLastMonth >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                    {city.growthLastMonth}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`${city.growthLastMonth >= 0 ? 'bg-emerald-500' : 'bg-red-500'} h-full rounded-full transition-all duration-1000`}
                                                    style={{ width: `${Math.abs(city.growthLastMonth) * 4}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                <span>Eficiencia</span>
                                                <span className="text-purple-600">{Math.round((city.activeProjects / city.populationNum) * 1000000)} pts</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.min((city.activeProjects / city.populationNum) * 5000000, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Stats Row */}
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">💎</div>
                                            <div>
                                                <div className="text-sm font-black text-gray-800 dark:text-white leading-tight">{city.points.toLocaleString()}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">XP Acumulado</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">📊</div>
                                            <div>
                                                <div className="text-sm font-black text-gray-800 dark:text-white leading-tight">{city.activeProjects}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">Proyectos</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">📅</div>
                                            <div>
                                                <div className="text-sm font-black text-gray-800 dark:text-white leading-tight">{city.monthlyEvents}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">Eventos /mes</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold">👥</div>
                                            <div>
                                                <div className="text-sm font-black text-gray-800 dark:text-white leading-tight">{city.population}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">Población</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* No results */}
                    {filteredCities.length === 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-200 dark:border-slate-700">
                            <div className="text-6xl mb-4 grayscale opacity-50">🏙️</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                No se encontraron ciudades
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                                Intenta buscar con otros términos o cambia los filtros de país.
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Card: Methodology */}
                <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
                    <div className="px-8 py-10">
                        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                            <span className="bg-green-500 text-white w-8 h-8 rounded flex items-center justify-center text-sm">?</span>
                            ¿Cómo calculamos el EcoScore?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-3">
                                <div className="text-green-600 font-bold flex items-center gap-2">
                                    <span className="text-lg">📈</span> Densidad de Impacto
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    No se trata de cuántos puntos tienes, sino de la cantidad de impacto por habitante. Las ciudades pequeñas pueden liderar si su población es muy activa.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="text-blue-600 font-bold flex items-center gap-2">
                                    <span className="text-lg">🌱</span> Eficiencia Ambiental
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Medimos la reducción estimada de CO2 basada en el tipo de proyectos activos (energía, transporte, reforestación) dentro de cada ciudad.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="text-purple-600 font-bold flex items-center gap-2">
                                    <span className="text-lg">🤝</span> Fuerza Comunitaria
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Penalizamos la inactividad y premiamos la vitalidad de los eventos mensuales y la tasa de finalización de proyectos propuestos.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="text-emerald-600 font-bold flex items-center gap-2">
                                    <span className="text-lg">🔥</span> Momentum de Crecimiento
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    El cambio porcentual en la participación durante los últimos 30 días ayuda a identificar las ciudades que están despertando su conciencia ecológica.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
