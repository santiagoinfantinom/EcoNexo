'use client';

import { useState, useEffect } from 'react';
import { useGamification } from '@/lib/gamification';
import { trackEvent } from '@/lib/analytics';

export function GamificationPanel() {
  const { 
    badges, 
    achievements, 
    totalPoints, 
    level, 
    getAvailableBadges, 
    getAvailableAchievements,
    getProgressForBadge 
  } = useGamification();
  
  const [activeTab, setActiveTab] = useState<'badges' | 'achievements' | 'leaderboard'>('badges');

  useEffect(() => {
    trackEvent('Gamification Panel Viewed');
  }, []);

  const availableBadges = getAvailableBadges();
  const availableAchievements = getAvailableAchievements();

  const renderBadges = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {availableBadges.map((badge) => {
        const userBadge = badges.find(b => b.id === badge.id);
        const progress = getProgressForBadge(badge.id);
        const isUnlocked = !!userBadge;
        const progressPercentage = badge.maxProgress ? (progress / badge.maxProgress) * 100 : 0;

        return (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              isUnlocked 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                {badge.icon}
              </span>
              <div>
                <h3 className={`font-semibold ${isUnlocked ? 'text-green-800' : 'text-gray-600'}`}>
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-500">{badge.description}</p>
              </div>
            </div>
            
            {badge.maxProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progreso</span>
                  <span className="text-gray-600">{progress}/{badge.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isUnlocked ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {isUnlocked && userBadge.unlockedAt && (
              <p className="text-xs text-green-600 mt-2">
                ✅ Desbloqueado el {new Date(userBadge.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      {availableAchievements.map((achievement) => {
        const userAchievement = achievements.find(a => a.id === achievement.id);
        const isUnlocked = !!userAchievement;

        return (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              isUnlocked 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  🏆
                </span>
                <div>
                  <h3 className={`font-semibold ${isUnlocked ? 'text-purple-800' : 'text-gray-600'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${isUnlocked ? 'text-purple-600' : 'text-gray-400'}`}>
                  +{achievement.points} pts
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {achievement.category}
                </div>
              </div>
            </div>

            {isUnlocked && userAchievement.unlockedAt && (
              <p className="text-xs text-purple-600 mt-2">
                ✅ Desbloqueado el {new Date(userAchievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Tu Nivel</h3>
            <p className="text-lg">Nivel {level}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalPoints}</div>
            <div className="text-sm opacity-90">Puntos Totales</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold text-gray-900 mb-4">🏆 Ranking Comunitario</h4>
        <div className="space-y-3">
          {[
            { name: 'María García', points: 1250, level: 13, avatar: '👩‍🌾' },
            { name: 'Carlos López', points: 980, level: 10, avatar: '👨‍💼' },
            { name: 'Ana Martín', points: 750, level: 8, avatar: '👩‍🔬' },
            { name: 'Tú', points: totalPoints, level: level, avatar: '👤', isCurrentUser: true },
            { name: 'Pedro Ruiz', points: 420, level: 5, avatar: '👨‍🎨' }
          ].map((user, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{user.avatar}</span>
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">Nivel {user.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{user.points} pts</div>
                <div className="text-sm text-gray-500">#{index + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">🎮 Gamificación</h2>
        <p className="text-gray-600 mt-1">Desbloquea badges, logros y compite con la comunidad</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'badges', name: 'Badges', icon: '🏅' },
            { id: 'achievements', name: 'Logros', icon: '🏆' },
            { id: 'leaderboard', name: 'Ranking', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'badges' && renderBadges()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </div>
    </div>
  );
}
