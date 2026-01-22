"use client";
import React, { useState } from 'react';
import {
    Zap,
    Trophy,
    Users,
    Flame,
    ChevronRight,
    Star,
    ShieldCheck,
    TrendingUp,
    Award,
    CircleDot
} from 'lucide-react';
import { useSmartContext, UserQuest } from '@/context/SmartContext';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamificationHub() {
    const { gamification, preferences } = useSmartContext();
    const { t } = useI18n();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'stats' | 'quests'>('stats');

    const levelProgress = (gamification.points % 1000) / 10;
    const nextLevelXP = 1000 - (gamification.points % 1000);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-80 glass-card p-0 shadow-2xl border border-white/20 dark:border-slate-700/50 mb-2 overflow-hidden flex flex-col max-h-[500px]"
                    >
                        {/* Tab Switcher */}
                        <div className="flex bg-slate-50 dark:bg-slate-900/50 p-1 border-b border-white/10">
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'stats'
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <TrendingUp className="w-3.5 h-3.5" /> Stats
                            </button>
                            <button
                                onClick={() => setActiveTab('quests')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'quests'
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <CircleDot className="w-3.5 h-3.5" /> Quests
                                {gamification.activeQuests.length > 0 && (
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                )}
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {activeTab === 'stats' ? (
                                <StatsPanel gamification={gamification} t={t} levelProgress={levelProgress} nextLevelXP={nextLevelXP} />
                            ) : (
                                <QuestsPanel gamification={gamification} t={t} />
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-white/10">
                            <button className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                                View Full Profile
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`relative group p-4 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3 ${isExpanded
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:-translate-y-1'
                    }`}
            >
                <div className="relative">
                    <Zap className={`w-6 h-6 ${isExpanded ? 'text-yellow-400' : 'text-slate-900 dark:text-white'}`} />
                    {!isExpanded && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                    )}
                </div>
                <div className="text-left pr-2">
                    <div className="text-[10px] font-bold uppercase tracking-tighter opacity-50 leading-none mb-1">LVL {gamification.level}</div>
                    <div className="text-sm font-black leading-none">{gamification.points} XP</div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
        </div>
    );
}

function StatsPanel({ gamification, t, levelProgress, nextLevelXP }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-400/10 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Community Rank</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-xs font-bold text-red-500">{gamification.streak || 1}d</span>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Level {gamification.level}</span>
                    <span className="text-xs text-slate-400">{nextLevelXP} XP to Lvl {gamification.level + 1}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/30 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Star className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Karma</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{gamification.karma || 0}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/30 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Users className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Impact</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{gamification.joinedProjectCount || 0}</div>
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Daily Challenges</h4>
                <div className="space-y-3">
                    <ChallengeItem
                        icon={<TrendingUp className="w-4 h-4 text-green-500" />}
                        title="Greener Planet"
                        desc="Sync 3 events this week"
                        progress={gamification.calendarSyncCount || 0}
                        max={3}
                    />
                    <ChallengeItem
                        icon={<Award className="w-4 h-4 text-orange-500" />}
                        title="Eco Voice"
                        desc="Share 10 projects"
                        progress={gamification.shareCount || 0}
                        max={10}
                    />
                </div>
            </div>
        </motion.div>
    );
}

function QuestsPanel({ gamification, t }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t('activeQuestsLabel') || 'Active Quests'}</h3>
            {gamification.activeQuests.length === 0 ? (
                <div className="text-center py-8">
                    <CircleDot className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No active quests. Stay tuned!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {gamification.activeQuests.map((quest: UserQuest) => (
                        <div key={quest.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/30">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{quest.title}</h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500 text-white rounded-full">
                                    +{quest.rewardXP} XP
                                </span>
                            </div>
                            <div className="space-y-3">
                                {quest.steps.map(step => (
                                    <div key={step.id}>
                                        <div className="flex justify-between text-[11px] mb-1">
                                            <span className="text-slate-600 dark:text-slate-400">{step.description}</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{step.current}/{step.target}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(step.current / step.target) * 100}%` }}
                                                className="h-full bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

function ChallengeItem({ icon, title, desc, progress, max }: { icon: React.ReactNode, title: string, desc: string, progress: number, max: number }) {
    const percentage = Math.min((progress / max) * 100, 100);
    const isCompleted = progress >= max;

    return (
        <div className="flex items-start gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/20">
            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/10' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                {isCompleted ? <ShieldCheck className="w-4 h-4 text-green-500" /> : icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h5 className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{title}</h5>
                    <span className="text-[10px] font-bold text-slate-400">{progress}/{max}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 truncate">{desc}</p>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                    />
                </div>
            </div>
        </div>
    )
}
