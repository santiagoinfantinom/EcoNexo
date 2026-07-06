import { useState, useEffect, useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'events' | 'projects' | 'community' | 'environment';
  unlockedAt?: Date;
}

export function useGamification() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);

  const loadUserProgress = useCallback(() => {
    // Load from localStorage or API
    const savedBadges = localStorage.getItem('econexo-badges');
    const savedAchievements = localStorage.getItem('econexo-achievements');
    const savedPoints = localStorage.getItem('econexo-points');

    if (savedBadges) setBadges(JSON.parse(savedBadges));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedPoints) {
      const points = parseInt(savedPoints);
      setTotalPoints(points);
      setLevel(calculateLevel(points));
    }
  }, []);

  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  const calculateLevel = (points: number): number => {
    return Math.floor(points / 100) + 1;
  };

  const addPoints = (points: number, reason: string) => {
    const newTotal = totalPoints + points;
    setTotalPoints(newTotal);
    setLevel(calculateLevel(newTotal));
    
    localStorage.setItem('econexo-points', newTotal.toString());
    trackEvent('Points Earned', { points, reason, totalPoints: newTotal });
    
    // Check for level up
    if (calculateLevel(newTotal) > level) {
      trackEvent('Level Up', { newLevel: calculateLevel(newTotal) });
    }
  };

  const unlockBadge = (badgeId: string) => {
    const badge = getAvailableBadges().find(b => b.id === badgeId);
    if (!badge) return;

    const unlockedBadge = { ...badge, unlockedAt: new Date() };
    const newBadges = [...badges, unlockedBadge];
    setBadges(newBadges);
    
    localStorage.setItem('econexo-badges', JSON.stringify(newBadges));
    trackEvent('Badge Unlocked', { badgeId, badgeName: badge.name });
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = getAvailableAchievements().find(a => a.id === achievementId);
    if (!achievement) return;

    const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
    const newAchievements = [...achievements, unlockedAchievement];
    setAchievements(newAchievements);
    
    localStorage.setItem('econexo-achievements', JSON.stringify(newAchievements));
    trackEvent('Achievement Unlocked', { achievementId, achievementTitle: achievement.title });
    
    // Add points for achievement
    addPoints(achievement.points, `Achievement: ${achievement.title}`);
  };

  const getAvailableBadges = (t?: (key: string) => string): UserBadge[] => [
    {
      id: 'first-event',
      name: t ? t('badgeFirstEvent') : 'badgeFirstEvent',
      description: 'Primera participación en un evento ecológico',
      icon: '🌱',
      color: 'green',
      maxProgress: 1
    },
    {
      id: 'eco-warrior',
      name: t ? t('badgeEcoWarrior') : 'badgeEcoWarrior',
      description: 'Participación completada en 10 eventos ecológicos',
      icon: '🛡️',
      color: 'blue',
      maxProgress: 10
    },
    {
      id: 'community-leader',
      name: t ? t('badgeCommunityLeader') : 'badgeCommunityLeader',
      description: 'Primera organización de un proyecto',
      icon: '👑',
      color: 'purple',
      maxProgress: 1
    },
    {
      id: 'green-job-hunter',
      name: t ? t('badgeGreenJobHunter') : 'badgeGreenJobHunter',
      description: 'Aplicación enviada a 5 trabajos sostenibles',
      icon: '💼',
      color: 'yellow',
      maxProgress: 5
    },
    {
      id: 'chat-master',
      name: t ? t('badgeChatMaster') : 'badgeChatMaster',
      description: 'Participación activa en 50 conversaciones',
      icon: '💬',
      color: 'pink',
      maxProgress: 50
    }
  ];

  const getAvailableAchievements = (t?: (key: string) => string): UserAchievement[] => [
    {
      id: 'eco-explorer',
      title: t ? t('achievementEcoExplorer') : 'achievementEcoExplorer',
      description: 'Exploración de todos los tipos de eventos disponibles',
      points: 50,
      category: 'events'
    },
    {
      id: 'project-pioneer',
      title: t ? t('achievementProjectPioneer') : 'achievementProjectPioneer',
      description: 'Primer proyecto sostenible creado',
      points: 100,
      category: 'projects'
    },
    {
      id: 'community-connector',
      title: t ? t('achievementCommunityConnector') : 'achievementCommunityConnector',
      description: 'Ayudaste a conectar a 10 personas',
      points: 75,
      category: 'community'
    },
    {
      id: 'carbon-neutral',
      title: t ? t('achievementCarbonNeutral') : 'achievementCarbonNeutral',
      description: 'Compensaste tu huella de carbono',
      points: 200,
      category: 'environment'
    }
  ];

  const getProgressForBadge = (badgeId: string): number => {
    // This would typically come from your backend
    // For now, return mock progress
    const mockProgress: Record<string, number> = {
      'first-event': 1,
      'eco-warrior': 3,
      'community-leader': 0,
      'green-job-hunter': 2,
      'chat-master': 15
    };
    return mockProgress[badgeId] || 0;
  };

  return {
    badges,
    achievements,
    totalPoints,
    level,
    addPoints,
    unlockBadge,
    unlockAchievement,
    getAvailableBadges,
    getAvailableAchievements,
    getProgressForBadge
  };
}
