"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { UserProfile, FollowStatus } from "@/lib/social-types";

interface PublicProfileProps {
  userId: string;
}

export default function PublicProfile({ userId }: PublicProfileProps) {
  const { t, locale } = useI18n();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followStatus, setFollowStatus] = useState<FollowStatus>('none');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
    if (currentUser?.id && currentUser.id !== userId) {
      checkFollowStatus();
    }
  }, [userId, currentUser]);

  const loadProfile = async () => {
    try {
      // TODO: Replace with actual API call
      const mockProfile: UserProfile = {
        id: userId,
        full_name: 'Usuario Ejemplo',
        avatar_url: '/logo-econexo.png',
        bio: 'Apasionado por la sostenibilidad y el medio ambiente',
        city: 'Berlín',
        country: 'Alemania',
        karma: 1250,
        reputation_score: 4.5,
        followers_count: 45,
        following_count: 32,
        events_created: 12,
        events_attended: 28,
        projects_created: 5,
        reviews_count: 15,
        is_mentor: true,
        is_mentee: false,
        expertise_areas: ['Medio ambiente', 'Energía renovable'],
        created_at: new Date().toISOString()
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    // TODO: Implement actual follow status check
    setFollowStatus('none');
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      // TODO: Implement actual follow/unfollow API call
      setIsFollowing(!isFollowing);
      if (!isFollowing) {
        setProfile(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
      } else {
        setProfile(prev => prev ? { ...prev, followers_count: prev.followers_count - 1 } : null);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8 text-gray-500">
        {locale === 'es' ? 'Perfil no encontrado' : locale === 'de' ? 'Profil nicht gefunden' : 'Profile not found'}
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500"></div>

      {/* Profile Header */}
      <div className="px-6 pb-6 -mt-16">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-4">
            <img
              src={profile.avatar_url || '/logo-econexo.png'}
              alt={profile.full_name}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.full_name}</h1>
              {profile.city && profile.country && (
                <p className="text-gray-600 dark:text-gray-400">
                  📍 {profile.city}, {profile.country}
                </p>
              )}
            </div>
          </div>
          {!isOwnProfile && currentUser && (
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isFollowing
                ? (locale === 'es' ? 'Siguiendo' : locale === 'de' ? 'Folgen' : 'Following')
                : (locale === 'es' ? 'Seguir' : locale === 'de' ? 'Folgen' : 'Follow')}
            </button>
          )}
        </div>

        {profile.bio && (
          <p className="mt-4 text-gray-700 dark:text-gray-300">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{profile.karma}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Karma</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{profile.reputation_score.toFixed(1)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {locale === 'es' ? 'Reputación' : locale === 'de' ? 'Reputation' : 'Reputation'}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{profile.followers_count}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {locale === 'es' ? 'Seguidores' : locale === 'de' ? 'Follower' : 'Followers'}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{profile.events_attended}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {locale === 'es' ? 'Eventos' : locale === 'de' ? 'Events' : 'Events'}
            </div>
          </div>
        </div>

        {/* Expertise Areas */}
        {profile.expertise_areas && profile.expertise_areas.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              {locale === 'es' ? 'Áreas de Experiencia' : locale === 'de' ? 'Expertise-Bereiche' : 'Expertise Areas'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.expertise_areas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mentor Badge */}
        {profile.is_mentor && (
          <div className="mt-4 flex items-center gap-2 text-blue-600">
            <span>🎓</span>
            <span className="font-medium">
              {locale === 'es' ? 'Mentor disponible' : locale === 'de' ? 'Mentor verfügbar' : 'Mentor available'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

