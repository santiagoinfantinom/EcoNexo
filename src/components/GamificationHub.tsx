"use client";

import React, { useState } from 'react';
import { useSmartContext } from '@/context/SmartContext';
import { useI18n } from "@/lib/i18n";
import { Trophy, Star, ChevronLeft, ChevronRight, Users, User } from 'lucide-react';



export default function GamificationHub() {
    const { gamification, getGroupData } = useSmartContext();
    const { t } = useI18n();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'circle'>('personal');

    const groupData = getGroupData();

    // Calculate progress to next level (simple formula: 1000 points per level)
    const currentLevelBase = (gamification.level - 1) * 1000;
    const progress = ((gamification.points - currentLevelBase) / 1000) * 100;

    const BADGES_CONFIG: Record<string, { label: string; icon: string; desc: string }> = {
        // Onboarding & Basics
        'first_step': { label: t('badgeFirstStep'), icon: '🦶', desc: t('descFirstStep') },
        'explorer': { label: t('badgeExplorer'), icon: '🧭', desc: t('descExplorer') },
        'helper': { label: t('badgeHelper'), icon: '🤝', desc: t('descHelper') },

        // Events
        'first_event': { label: 'Primer Evento', icon: '🌱', desc: 'Asististe a tu primer evento' },
        'event_enthusiast': { label: 'Entusiasta', icon: '🎉', desc: 'Asististe a 5 eventos' },
        'event_master': { label: 'Maestro de Eventos', icon: '🏆', desc: 'Asististe a 10 eventos' },
        'event_creator': { label: 'Organizador', icon: '📋', desc: 'Creaste tu primer evento' },

        // Projects
        'project_joiner': { label: 'Colaborador', icon: '🤲', desc: 'Te uniste a tu primer proyecto' },
        'project_creator': { label: 'Creador', icon: '💡', desc: 'Creaste tu primer proyecto' },
        'project_veteran': { label: 'Veterano', icon: '⭐', desc: 'Completaste 5 proyectos' },

        // Community
        'connector': { label: 'Conector', icon: '🔗', desc: 'Hiciste tu primera conexión' },
        'mentor': { label: 'Mentor', icon: '👨‍🏫', desc: 'Te convertiste en mentor' },
        'marketplace_seller': { label: 'Vendedor Verde', icon: '🛒', desc: 'Publicaste en el marketplace' },

        // Sustainability
        'green_commuter': { label: 'Transporte Verde', icon: '🚲', desc: 'Usaste transporte sostenible' },
        'waste_warrior': { label: 'Guerrero Residuos', icon: '♻️', desc: 'Redujiste residuos' },
        'carbon_fighter': { label: 'Luchador Carbono', icon: '🌍', desc: 'Compensaste tu huella' },

        // Engagement
        'daily_streak_7': { label: 'Racha Semanal', icon: '🔥', desc: '7 días consecutivos' },
        'daily_streak_30': { label: 'Racha Mensual', icon: '💎', desc: '30 días consecutivos' },
        'profile_complete': { label: 'Perfil Completo', icon: '✅', desc: 'Completaste tu perfil' },
        'social_sharer': { label: 'Compartidor', icon: '📢', desc: 'Compartiste 10 veces' },
    };

    return (
        <>
            {/* Mobile Floating Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed left-4 bottom-20 z-40 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
                aria-label="Abrir panel de impacto"
            >
                <Trophy size={24} className="animate-pulse" />
            </button>

            {/* Mobile Fullscreen Modal */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-slate-900 overflow-y-auto">
                    <div className="p-6">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Cerrar"
                        >
                            <span className="text-xl">✕</span>
                        </button>

                        {/* Content */}
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white text-2xl">{t('yourImpact')}</h3>
                            <span className="text-orange-500 font-bold text-2xl">{gamification.points} XP</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                            <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-right mb-8">
                            {Math.round(1000 - (gamification.points - currentLevelBase))} {t('xpToLevel')} {gamification.level + 1}
                        </p>

                        {/* Badges */}
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-lg mb-4">{t('badges')} ({gamification.badges.length})</h4>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {Object.entries(BADGES_CONFIG).map(([id, config]) => {
                                const isUnlocked = gamification.badges.includes(id);
                                return (
                                    <div key={id} className={`aspect-square rounded-lg flex items-center justify-center text-3xl relative ${isUnlocked ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-slate-700 grayscale opacity-50'}`}>
                                        {config.icon}
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-black/80 text-white text-xs p-2 rounded opacity-0 hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
                                            <p className="font-bold">{config.label}</p>
                                            <p className="font-light opacity-80">{config.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Recent History */}
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-lg mb-3">{t('recentActivity')}</h4>
                        <div className="space-y-3 text-base text-gray-600 dark:text-gray-400">
                            {gamification.history.length === 0 ? (
                                <p className="italic opacity-60">{t('noActivityYet')}</p>
                            ) : (
                                gamification.history.slice().reverse().map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                        <Star size={16} className="text-yellow-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-8">
                            <a href="/impact" className="block w-full text-center py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all">
                                {t('viewFullImpact') || "Ver Impacto Completo"}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Bottom Bar */}
            <div className={`hidden md:block fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl z-40 transition-all duration-300 ${isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'}`}>
                <div className="flex flex-col bg-white dark:bg-slate-800 shadow-2xl rounded-t-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                    {/* Toggle Tab (Top of bar) */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-14 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center px-6 text-white gap-4 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                        aria-label={isExpanded ? "Minimizar panel de impacto" : "Expandir panel de impacto"}
                    >
                        <Trophy size={20} className="animate-pulse" />
                        <span className="font-bold tracking-wider">IMPACTO</span>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold">
                            Nv.{gamification.level}
                        </div>
                        <span className="text-orange-200 font-bold">{gamification.points} XP</span>
                        <div className="ml-auto">
                            {isExpanded ? (
                                <ChevronRight size={18} className="rotate-90" />
                            ) : (
                                <ChevronLeft size={18} className="rotate-90 animate-bounce" />
                            )}
                        </div>
                    </button>

                    {/* Content Area */}
                    <div className="p-6 max-h-[50vh] overflow-y-auto">
                        {/* Tabs */}
                        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mb-4 max-w-xs">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'personal' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <User size={14} /> {t('me') || "Yo"}
                            </button>
                            <button
                                onClick={() => setActiveTab('circle')}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'circle' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Users size={14} /> {t('circle') || "Círculo"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Stats Column */}
                            <div>
                                {activeTab === 'personal' ? (
                                    <>
                                        <div className="flex justify-between items-end mb-2">
                                            <h3 className="font-bold text-gray-800 dark:text-white text-lg">{t('yourImpact')}</h3>
                                            <span className="text-orange-500 font-bold text-xl">{gamification.points} XP</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mb-1">
                                            <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-right mb-4">
                                            {Math.round(1000 - (gamification.points - currentLevelBase))} {t('xpToLevel')} {gamification.level + 1}
                                        </p>
                                    </>
                                ) : (
                                    groupData ? (
                                        <>
                                            <div className="flex justify-between items-end mb-2">
                                                <h3 className="font-bold text-gray-800 dark:text-white text-lg truncate pr-2">{groupData.name}</h3>
                                                <span className="text-purple-500 font-bold text-xl whitespace-nowrap">{groupData.totalPoints} XP</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mb-1">
                                                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(groupData.totalPoints / groupData.nextGoal) * 100}%` }}></div>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mb-4">
                                                {groupData.nextGoal - groupData.totalPoints} para el siguiente hito
                                            </p>
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Miembros ({groupData.members.length})</h4>
                                            <div className="space-y-1 text-sm">
                                                {groupData.members.sort((a, b) => b.points - a.points).slice(0, 3).map((member) => (
                                                    <div key={member.id} className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-700/50 rounded">
                                                        <div className="flex items-center gap-2">
                                                            <span>{member.avatar}</span>
                                                            <span className={member.name === 'You' ? 'font-bold' : ''}>{member.name}</span>
                                                        </div>
                                                        <span className="font-mono text-xs text-purple-600 dark:text-purple-400">{member.points}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500">No perteneces a ningún círculo aún.</p>
                                    )
                                )}
                            </div>

                            {/* Badges Column (Personal Tab Only) */}
                            {activeTab === 'personal' && (
                                <div>
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">{t('badges')} ({gamification.badges.length})</h4>
                                    <div className="grid grid-cols-6 gap-2">
                                        {Object.entries(BADGES_CONFIG).slice(0, 12).map(([id, config]) => {
                                            const isUnlocked = gamification.badges.includes(id);
                                            return (
                                                <div key={id} className={`aspect-square rounded-lg flex items-center justify-center text-xl relative group cursor-help ${isUnlocked ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-slate-700 grayscale opacity-50'}`}>
                                                    {config.icon}
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-28 bg-black/80 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
                                                        <p className="font-bold">{config.label}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Activity Column (Personal Tab Only) */}
                            {activeTab === 'personal' && (
                                <div>
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">{t('recentActivity')}</h4>
                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                                        {gamification.history.length === 0 ? (
                                            <p className="italic opacity-60">{t('noActivityYet')}</p>
                                        ) : (
                                            gamification.history.slice().reverse().slice(0, 5).map((item, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <Star size={12} className="text-yellow-500 flex-shrink-0" />
                                                    <span className="truncate">{item}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <a href="/impact" className="inline-block px-6 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors">
                                {t('viewFullImpact') || "Ver Impacto Completo"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
