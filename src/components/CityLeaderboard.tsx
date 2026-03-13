"use client";

import React from 'react';
import Link from 'next/link';
import { TOP_CITIES } from '@/data/cityRanking';
import { ChevronRight } from 'lucide-react';


export default function CityLeaderboard() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                🏙️ Ranking EcoScore
            </h3>
            <div className="space-y-4">
                {TOP_CITIES.map((city) => (
                    <div key={city.name} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group cursor-default">
                        <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm
              ${city.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                city.rank === 2 ? 'bg-gray-300 text-gray-800' :
                                    city.rank === 3 ? 'bg-orange-300 text-orange-900' :
                                        'bg-gray-100 dark:bg-slate-700 text-gray-500'}
            `}>
                            {city.rank}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-800 dark:text-gray-200 truncate pr-2">{city.name}</span>
                                <span className="font-black text-xs text-green-600 dark:text-green-400">{city.ecoScore} pts</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full rounded-full group-hover:bg-green-400 transition-all duration-500"
                                    style={{ width: `${city.ecoScore}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 text-center">
                <Link
                    href="/ranking"
                    className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-bold transition-colors inline-flex items-center gap-2"
                >
                    Ver ranking completo <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    );
}
