"use client";

import React from 'react';
import { useSmartContext } from '@/context/SmartContext';
import { useI18n } from '@/lib/i18n';
import { Trophy, Star, TrendingUp, Award, Calendar, Share2, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ImpactPage() {
    const { gamification } = useSmartContext();
    const { t } = useI18n();

    // Calculate level progress
    const currentLevelBase = (gamification.level - 1) * 1000;
    const progress = ((gamification.points - currentLevelBase) / 1000) * 100;

    // Badge configuration with localization
    const getBadgesConfig = () => ({
        // Onboarding
        'first_step': { label: t('badgeFirstStep'), icon: '🦶', desc: t('descFirstStep'), category: t('categoryStarter') },
        'explorer': { label: t('badgeExplorer'), icon: '🧭', desc: t('descExplorer'), category: t('categoryStarter') },
        'helper': { label: t('badgeHelper'), icon: '🤝', desc: t('descHelper'), category: t('categoryStarter') },

        // Events
        'first_event': { label: t('badgeFirstEvent'), icon: '🌱', desc: t('descFirstEvent'), category: t('categoryLayoutEvents') || 'Events' },
        'event_enthusiast': { label: t('badgeEventEnthusiast'), icon: '🎉', desc: t('descEventEnthusiast'), category: t('categoryLayoutEvents') || 'Events' },
        'event_master': { label: t('badgeEventMaster'), icon: '🏆', desc: t('descEventMaster'), category: t('categoryLayoutEvents') || 'Events' },
        'event_creator': { label: t('badgeEventCreator'), icon: '📋', desc: t('descEventCreator'), category: t('categoryLayoutEvents') || 'Events' },

        // Projects
        'project_joiner': { label: t('badgeProjectJoiner'), icon: '🤲', desc: t('descProjectJoiner'), category: t('categoryProjects') },
        'project_creator': { label: t('badgeProjectCreator'), icon: '💡', desc: t('descProjectCreator'), category: t('categoryProjects') },
        'project_veteran': { label: t('badgeProjectVeteran'), icon: '⭐', desc: t('descProjectVeteran'), category: t('categoryProjects') },

        // Community
        'connector': { label: t('badgeConnector'), icon: '🔗', desc: t('descConnector'), category: t('categoryCommunity') },
        'mentor': { label: t('badgeMentor'), icon: '👨‍🏫', desc: t('descMentor'), category: t('categoryCommunity') },
        'marketplace_seller': { label: t('badgeMarketplaceSeller'), icon: '🛒', desc: t('descMarketplaceSeller'), category: t('categoryCommunity') },

        // Sustainability
        'green_commuter': { label: t('badgeGreenCommuter'), icon: '🚲', desc: t('descGreenCommuter'), category: t('categoryLifestyle') },
        'waste_warrior': { label: t('badgeWasteWarrior'), icon: '♻️', desc: t('descWasteWarrior'), category: t('categoryLifestyle') },
        'carbon_fighter': { label: t('badgeCarbonFighter'), icon: '🌍', desc: t('descCarbonFighter'), category: t('categoryLifestyle') },

        // Engagement
        'daily_streak_7': { label: t('badgeDailyStreak7'), icon: '🔥', desc: t('descDailyStreak7'), category: t('categoryEngagement') },
        'daily_streak_30': { label: t('badgeDailyStreak30'), icon: '💎', desc: t('descDailyStreak30'), category: t('categoryEngagement') },
        'profile_complete': { label: t('badgeProfileComplete'), icon: '✅', desc: t('descProfileComplete'), category: t('categoryEngagement') },
        'social_sharer': { label: t('badgeSocialSharer'), icon: '📢', desc: t('descSocialSharer'), category: t('categoryEngagement') },
    });

    const BADGES_CONFIG = getBadgesConfig() as Record<string, { label: string; icon: string; desc: string; category: string }>;

    // Group badges by category
    const badgesByCategory = Object.entries(BADGES_CONFIG).reduce((acc, [id, config]) => {
        if (!acc[config.category]) acc[config.category] = [];
        acc[config.category].push({ id, ...config });
        return acc;
    }, {} as Record<string, (typeof BADGES_CONFIG[string] & { id: string })[]>);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar/Level Circle */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl shadow-2xl">
                                🌿
                            </div>
                            <div className="absolute -bottom-3 -right-3 bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-emerald-600 shadow-lg">
                                {gamification.level}
                            </div>
                        </div>

                        {/* Text Info */}
                        <div className="text-center flex-1">
                            <h1 className="text-4xl font-bold mb-2">{t('yourImpact')}</h1>
                            <p className="text-emerald-100 text-lg mb-6 max-w-xl mx-auto">
                                {t('impactDescription')}
                            </p>

                            {/* Progress Bar Large */}
                            <div className="bg-emerald-900/30 rounded-full h-6 w-full max-w-md mx-auto relative overflow-hidden backdrop-blur-sm border border-emerald-500/30">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
                                    {Math.round(gamification.points)} / {gamification.level * 1000} XP
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-[120px]">
                                <Trophy className="mx-auto mb-2 text-yellow-300" size={24} />
                                <div className="text-2xl font-bold">{gamification.badges.length}</div>
                                <div className="text-xs text-emerald-100 uppercase tracking-wide">{t('impactMedals')}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-[120px]">
                                <Calendar className="mx-auto mb-2 text-blue-300" size={24} />
                                <div className="text-2xl font-bold">{gamification.streak}</div>
                                <div className="text-xs text-emerald-100 uppercase tracking-wide">{t('impactStreakDays')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-6 -mt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                            <Share2 size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{t('impactSocialImpact')}</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{gamification.shareCount || 0} <span className="text-sm font-normal text-slate-400">{t('impactShared')}</span></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                            <Award size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{t('impactTalleres')}</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{gamification.workshopCount || 0} <span className="text-sm font-normal text-slate-400">{t('impactCompleted')}</span></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{t('impactCity')}</div>
                            <div className="text-lg font-bold text-slate-800 dark:text-white truncate">Berlin <span className="text-sm font-normal text-green-500">#4 {t('impactRanking')}</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column: Badges */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Award className="text-orange-500" /> {t('impactBadgeCollection')}
                                </h2>
                                <span className="text-sm bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
                                    {gamification.badges.length} / {Object.keys(BADGES_CONFIG).length}
                                </span>
                            </div>

                            <div className="p-6 space-y-8">
                                {Object.entries(badgesByCategory).map(([category, badges]) => (
                                    <div key={category}>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-l-4 border-green-500 pl-3">
                                            {category}
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {badges.map((badge) => {
                                                const isUnlocked = gamification.badges.includes(badge.id);
                                                return (
                                                    <div
                                                        key={badge.id}
                                                        className={`
                                                            relative group aspect-square rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 border transition-all duration-300
                                                            ${isUnlocked
                                                                ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800/30'
                                                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                                                            }
                                                        `}
                                                    >
                                                        <div className="text-4xl mb-1 transform group-hover:scale-110 transition-transform">
                                                            {badge.icon}
                                                        </div>
                                                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">
                                                            {badge.label}
                                                        </div>

                                                        {!isUnlocked && (
                                                            <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <div className="bg-white dark:bg-slate-800 text-xs p-2 rounded shadow-lg text-slate-600 dark:text-slate-300 max-w-[90%] border border-slate-200 dark:border-slate-600">
                                                                    {badge.desc}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column: History */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="text-blue-500" /> {t('impactRecentActivity')}
                                </h2>
                            </div>
                            <div className="p-0">
                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {gamification.history.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500">
                                            {t('impactNoActivity')}
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {gamification.history.slice().reverse().map((item, i) => (
                                                <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-start gap-3">
                                                    <div className="mt-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 p-1.5 rounded-full">
                                                        <Star size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item}</div>
                                                        <div className="text-slate-400 text-xs mt-1">{t('impactJustNow')}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-xl mb-2">{t('impactKeepGoing')}</h3>
                                <p className="text-indigo-100 text-sm mb-4">
                                    {t('impactUnlockNextLevel', { level: gamification.level + 1 })}
                                </p>
                                <Link href="/explore" className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors shadow-md">
                                    {t('impactExploreProjects')}
                                </Link>
                            </div>
                            <Star className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32 rotate-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
