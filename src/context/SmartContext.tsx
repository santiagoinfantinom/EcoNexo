"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '@/lib/matching';
import { useToast } from '@/components/ToastNotification';

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
    unlockBadge: (badgeId: string) => void;
    getGroupData: () => Group | null;
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
    currentGroupId: 'berlin-sustainers' // Default mock assignment
};

const SmartContext = createContext<SmartContextType | undefined>(undefined);

export function SmartProvider({ children }: { children: ReactNode }) {
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
                    history: [...prev.history, `Inicio de sesión diario (+20 XP)`]
                };

                // Bonus for weekly streak
                if (newStreak === 7) {
                    updated.points += 50;
                    updated.history.push("Racha de 7 días (+50 XP)");
                    if (!updated.badges.includes('daily_streak_7')) {
                        updated.badges = [...updated.badges, 'daily_streak_7'];
                    }
                }

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
        if (!gamification.badges.includes('first_step')) {
            unlockBadge('first_step');
            addPoints(50, 'Completar perfil');
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
                if (newShareCount === 10 && !newBadges.includes('social_sharer')) {
                    newBadges.push('social_sharer');
                }
            }

            if (reason.includes("taller") || reason.includes("workshop")) {
                newWorkshopCount += 1;
            }

            if (reason.includes("Unirse a proyecto") || reason.includes("Join project") || reason.includes("Voluntariado")) {
                newJoinedProjectCount += 1;
                if (newJoinedProjectCount === 5 && !newBadges.includes('project_joiner')) {
                    newBadges.push('project_joiner');
                }
            }

            // Level up check
            if (newLevel > prev.level) {
                showToast(`¡Nivel Siguiente! Has alcanzado el nivel ${newLevel}`, "success");
            }

            // Show toast for points (optional, maybe only for big amounts or user preference)
            // For now, always show for clear feedback
            if (amount > 0) showToast(`+${amount} XP: ${reason}`, "info");

            const updated = {
                ...prev,
                points: newPoints,
                level: newLevel,
                badges: newBadges,
                shareCount: newShareCount,
                workshopCount: newWorkshopCount,
                joinedProjectCount: newJoinedProjectCount,
                history: [...prev.history, `${reason} (+${amount})`]
            };
            saveGamification(updated);
            return updated;
        });
    };

    const unlockBadge = (badgeId: string) => {
        setGamification(prev => {
            if (prev.badges.includes(badgeId)) return prev;

            showToast("¡Nueva Medalla Desbloqueada!", "success");

            const updated = { ...prev, badges: [...prev.badges, badgeId] };
            saveGamification(updated);
            return updated;
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
            getGroupData: () => gamification.currentGroupId ? MOCK_GROUPS[gamification.currentGroupId] : null
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
