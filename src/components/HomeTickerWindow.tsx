"use client";

import Link from "next/link";
import React from "react";
import { useI18n } from "@/lib/i18n";

export default function HomeTickerWindow() {
    const { t } = useI18n();

    const ecoLinks = [
        { title: t('tickerTitle1'), url: "#" },
        { title: t('tickerTitle2'), url: "#" },
        { title: t('tickerTitle3'), url: "#" },
        { title: t('tickerTitle4'), url: "#" },
        { title: t('tickerTitle5'), url: "#" },
        { title: t('tickerTitle6'), url: "#" },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]">
            <div className="glass-card bg-white/90 dark:bg-slate-900/90 overflow-hidden shadow-xl border border-green-500/20 rounded-2xl">
                {/* Header/Title */}
                <div className="bg-green-600/10 dark:bg-green-500/20 px-4 py-2 border-b border-green-500/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Eco News
                    </span>
                </div>

                {/* Scrolling Content */}
                <div className="h-32 relative overflow-hidden group">
                    <div className="absolute w-full animate-[scroll-up_20s_linear_infinite] group-hover:[animation-play-state:paused] flex flex-col pt-32 pb-4">
                        {/* Render 3 times to ensure smooth infinite scroll */}
                        {[...ecoLinks, ...ecoLinks, ...ecoLinks].map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className="px-4 py-3 block border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                title={link.title}
                            >
                                <div className="flex gap-3 items-start">
                                    <span className="text-sm mt-0.5 opacity-80">🌱</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug line-clamp-2">
                                        {link.title}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Gradient Overlays for smooth entry/exit */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white dark:from-slate-900 to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none z-10" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-100% / 3)); }
        }
      `}} />
        </div>
    );
}
