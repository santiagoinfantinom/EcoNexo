"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '@/lib/matching';
import { useToast } from '@/components/ToastNotification';
import { useI18n } from '@/lib/i18n';

interface GamificationState {
    points: number;
    level: number;
    badges: string[];
    history: string[];
    lastLogin?: string;
    streak: number;
    shareCount: number;
    workshopCount: number;
    joinedProjectCount: number;
    currentGroupId?: string;
    karma: number;
    calendarSyncCount: number;
    activeQuests: UserQuest[];
    completedQuests: string[];
    lastUnlockedBadge?: { id: string; name: string; icon: string } | null;
}

export interface QuestStep {
    id: string;
    description: string;
    target: number;
    current: number;
    type: 'sync' | 'share' | 'join' | 'workshop';
}

export interface UserQuest {
    id: string;
    title: string;
    category: string;
    steps: QuestStep[];
    rewardXP: number;
    rewardKarma: number;
    isDone?: boolean;
}

export interface GroupMember {
    id: string;
    name: string;
    avatar: string;
    points: number;
}

export interface Group {
    id: string;
    name: string;
    totalPoints: number;
    members: GroupMember[];
    rank: number;
    nextGoal: number;
}

const MOCK_GROUPS: Record<string, Group> = {
    'berlin-sustainers': {
        id: 'berlin-sustainers',
        name: 'Berlin Sustainers',
        totalPoints: 12500,
        rank: 3,
        nextGoal: 15000,
        members: [
            { id: '1', name: 'You', avatar: '👤', points: 450 },
            { id: '2', name: 'Sarah', avatar: '👩‍🌾', points: 1200 },
            { id: '3', name: 'Hans', avatar: '👨‍🔧', points: 980 },
            { id: '4', name: 'Elena', avatar: '👩‍🔬', points: 850 },
            { id: '5', name: 'Marco', avatar: '🧔', points: 620 }
        ]
    }
};

interface SmartContextType {
    // Preferences
    preferences: UserPreferences;
    updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
    showOnboarding: boolean;
    completeOnboarding: () => void;

    // Gamification
    gamification: GamificationState;
    addPoints: (amount: number, reason: string) => void;
    unlockBadge: (badgeId: string, badgeName?: string, badgeIcon?: string) => void;
    clearLastBadge: () => void;
    getGroupData: () => Group | null;
    updateQuestProgress: (type: QuestStep['type'], category?: string) => void;
}


const defaultPreferences: UserPreferences = {
    selectedCategories: [],
    selectedSkills: []
};

const defaultGamification: GamificationState = {
    points: 0,
    level: 1,
    badges: [],
    history: [],
    streak: 0,
    shareCount: 0,
    workshopCount: 0,
    joinedProjectCount: 0,
    currentGroupId: 'berlin-sustainers', // Default mock assignment
    karma: 0,
    calendarSyncCount: 0,
    activeQuests: [],
    completedQuests: []
};

const SmartContext = createContext<SmartContextType | undefined>(undefined);

export function SmartProvider({ children }: { children: ReactNode }) {
    const { t } = useI18n(); // Helper hook
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [gamification, setGamification] = useState<GamificationState>(defaultGamification);

    // Load from localStorage on mount
    useEffect(() => {
        const savedPrefs = localStorage.getItem('econexo_preferences');
        const savedGamification = localStorage.getItem('econexo_gamification');
        const hasOnboarded = localStorage.getItem('econexo_onboarded');

        let currentGamification = defaultGamification;
        if (savedGamification) {
            currentGamification = JSON.parse(savedGamification);
            setGamification(currentGamification);
        }

        if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
        if (!hasOnboarded) setShowOnboarding(true);

        // Check for daily streak
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const lastLogin = currentGamification.lastLogin;

        if (lastLogin !== today) {
            setGamification(prev => {
                let newStreak = prev.streak || 0;
                const lastDate = lastLogin ? new Date(lastLogin) : null;
                const diffTime = lastDate ? now.getTime() - lastDate.getTime() : Infinity;
                const diffDays = diffTime / (1000 * 3600 * 24);

                if (diffDays <= 1.5) { // Consecutive day
                    newStreak += 1;
                } else {
                    newStreak = 1;
                }

                const updated = {
                    ...prev,
                    lastLogin: today,
                    streak: newStreak,
                    points: prev.points + 20,
                    history: [...prev.history, `${t('dailyLogin')} (+20 XP)`]
                };

                // Bonus for weekly streak
                if (newStreak === 7) {
                    updated.points += 50;
                    updated.history.push(`${t('weeklyStreak')} (+50 XP)`);
                    if (!updated.badges.includes('daily-streak-7')) {
                        updated.badges = [...updated.badges, 'daily-streak-7'];
                        unlockBadge('daily-streak-7', t('badgeDailyStreak7'), '🔥');
                    }
                }

                saveGamification(updated);
                return updated;
            });
        }

        // Initialize default quests if empty
        const activeQuests = currentGamification.activeQuests || [];
        const completedQuests = currentGamification.completedQuests || [];
        if (activeQuests.length === 0 && completedQuests.length === 0) {
            setGamification(prev => {
                const initialQuests: UserQuest[] = [
                    {
                        id: 'ocean-guardian',
                        title: t('questOceanGuardian') || 'Ocean Guardian',
                        category: 'oceans',
                        rewardXP: 500,
                        rewardKarma: 100,
                        steps: [
                            { id: 'og-1', type: 'join', target: 2, current: 0, description: t('questStepJoinOceans') || 'Join 2 ocean conservation events' },
                            { id: 'og-2', type: 'share', target: 1, current: 0, description: t('questStepShareOcean') || 'Share an ocean project' }
                        ]
                    },
                    {
                        id: 'urban-sustainer',
                        title: t('questUrbanSustainer') || 'Urban Sustainer',
                        category: 'community',
                        rewardXP: 300,
                        rewardKarma: 50,
                        steps: [
                            { id: 'us-1', type: 'sync', target: 3, current: 0, description: t('questStepSyncEvents') || 'Sync 3 events to your calendar' },
                            { id: 'us-2', type: 'workshop', target: 1, current: 0, description: t('questStepJoinWorkshop') || 'Attend an urban gardening workshop' }
                        ]
                    }
                ];
                const updated = { ...prev, activeQuests: initialQuests };
                saveGamification(updated);
                return updated;
            });
        }
    }, []);

    const { showToast } = useToast();

    // Persistence helpers
    const savePrefs = (prefs: UserPreferences) => localStorage.setItem('econexo_preferences', JSON.stringify(prefs));
    const saveGamification = (game: GamificationState) => localStorage.setItem('econexo_gamification', JSON.stringify(game));

    const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
        setPreferences(prev => {
            const updated = { ...prev, ...newPrefs };
            savePrefs(updated);
            return updated;
        });
    };

    const completeOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem('econexo_onboarded', 'true');
        // Award "First Step" badge if not present
        if (!gamification.badges.includes('first-step')) {
            unlockBadge('first-step', t('badgeFirstStep'), '🌱');
            addPoints(50, t('completedProfile'));
        }
    };

    const addPoints = (amount: number, reason: string) => {
        setGamification(prev => {
            const newPoints = prev.points + amount;
            const newLevel = Math.floor(newPoints / 1000) + 1;

            let newShareCount = prev.shareCount || 0;
            let newWorkshopCount = prev.workshopCount || 0;
            let newJoinedProjectCount = prev.joinedProjectCount || 0;
            let newBadges = [...prev.badges];

            if (reason.includes("Compartir") || reason.includes("Share")) {
                newShareCount += 1;
                if (newShareCount === 10 && !newBadges.includes('social-sharer')) {
                    newBadges.push('social-sharer');
                    unlockBadge('social-sharer', t('badgeSocialSharer'), '🗣️');
                }
            }

            if (reason.includes("taller") || reason.includes("workshop")) {
                newWorkshopCount += 1;
            }

            if (reason.includes("Unirse a proyecto") || reason.includes("Join project") || reason.includes("Voluntariado")) {
                newJoinedProjectCount += 1;
                if (newJoinedProjectCount === 5 && !newBadges.includes('project-joiner')) {
                    newBadges.push('project-joiner');
                    unlockBadge('project-joiner', t('badgeProjectJoiner'), '🤝');
                }
            }

            if (reason.includes("calendario") || reason.includes("calendar")) {
                prev.calendarSyncCount = (prev.calendarSyncCount || 0) + 1;
                if (prev.calendarSyncCount >= 3 && !newBadges.includes('calendar-sync-master')) {
                    newBadges.push('calendar-sync-master');
                    unlockBadge('calendar-sync-master', t('badgeCalendarSyncMaster'), '📅');
                }
            }

            // Karma logic: awarded for community-centric actions
            let karmaEarned = 0;
            if (reason.includes("Compartir") || reason.includes("Share") ||
                reason.includes("calendario") || reason.includes("calendar") ||
                reason.includes("Comunidad") || reason.includes("Community")) {
                karmaEarned = Math.floor(amount / 5);
            }

            // Level up check
            if (newLevel > prev.level) {
                showToast(`${t('levelUp')} ${newLevel}`, "success");
            }

            const updated = {
                ...prev,
                points: newPoints,
                level: newLevel,
                badges: newBadges,
                shareCount: newShareCount,
                workshopCount: newWorkshopCount,
                joinedProjectCount: newJoinedProjectCount,
                calendarSyncCount: prev.calendarSyncCount,
                karma: (prev.karma || 0) + karmaEarned,
                history: [...prev.history, `${reason} (+${amount} XP${karmaEarned > 0 ? `, +${karmaEarned} Karma` : ''})`]
            };
            saveGamification(updated);
            return updated;
        });
    };

    const unlockBadge = (badgeId: string, badgeName?: string, badgeIcon?: string) => {
        setGamification(prev => {
            if (prev.badges.includes(badgeId)) return prev;

            const displayName = badgeName || badgeId;
            showToast(`${t('newBadge')}: ${displayName}`, "success");

            const updated = {
                ...prev,
                badges: [...prev.badges, badgeId],
                lastUnlockedBadge: { id: badgeId, name: displayName, icon: badgeIcon || '🏆' }
            };
            saveGamification(updated);
            return updated;
        });
    };

    const clearLastBadge = () => {
        setGamification(prev => {
            const updated = { ...prev, lastUnlockedBadge: null };
            saveGamification(updated);
            return updated;
        });
    };

    const updateQuestProgress = (type: QuestStep['type'], category?: string) => {
        setGamification(prev => {
            let questCompleted = false;
            let completedQuestTitle = "";
            let xpReward = 0;
            let karmaReward = 0;

            const newActiveQuests = prev.activeQuests.map(quest => {
                // If category is provided, only progress quests of that category (or generic ones)
                if (category && quest.category !== 'all' && quest.category !== category) return quest;

                const newSteps = quest.steps.map(step => {
                    if (step.type === type && step.current < step.target) {
                        return { ...step, current: step.current + 1 };
                    }
                    return step;
                });

                const allDone = newSteps.every(s => s.current >= s.target);
                if (allDone && !questCompleted) {
                    questCompleted = true;
                    completedQuestTitle = quest.title;
                    xpReward = quest.rewardXP;
                    karmaReward = quest.rewardKarma;
                }

                return { ...quest, steps: newSteps, isDone: allDone };
            });

            if (questCompleted) {
                const questId = prev.activeQuests.find(q => q.title === completedQuestTitle)?.id || "";
                const updatedActive = newActiveQuests.filter(q => !q.isDone);
                const updatedCompleted = [...prev.completedQuests, questId];

                showToast(`${t('questCompleted') || 'Quest Completed'}: ${completedQuestTitle}`, "success");

                // Add rewards
                addPoints(xpReward, `${t('questCompletedXP') || 'Quest Reward'}: ${completedQuestTitle}`);
                // Note: addPoints already handles karma and points updates, but since we are inside setGamification,
                // it might be cleaner to just calculate final state here. 
                // However, for simplicity and reuse, I'll let the next render handle the point addition 
                // OR I can manually add them here.

                const finalState = {
                    ...prev,
                    activeQuests: updatedActive,
                    completedQuests: updatedCompleted,
                    points: prev.points + xpReward,
                    karma: prev.karma + karmaReward,
                    history: [...prev.history, `Quest ${completedQuestTitle} (+${xpReward} XP, +${karmaReward} Karma)`]
                };
                saveGamification(finalState);
                return finalState;
            }

            const finalState = { ...prev, activeQuests: newActiveQuests };
            saveGamification(finalState);
            return finalState;
        });
    };

    return (
        <SmartContext.Provider value={{
            preferences,
            updatePreferences,
            showOnboarding,
            completeOnboarding,
            gamification,
            addPoints,
            unlockBadge,
            clearLastBadge,
            getGroupData: () => gamification.currentGroupId ? MOCK_GROUPS[gamification.currentGroupId] : null,
            updateQuestProgress
        }}>
            {children}
        </SmartContext.Provider>
    );
}

export function useSmartContext() {
    const context = useContext(SmartContext);
    if (context === undefined) {
        throw new Error('useSmartContext must be used within a SmartProvider');
    }
    return context;
}
