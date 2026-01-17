"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { ActivityFeedItem } from "@/lib/social-types";

export default function ComunidadPage() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [feed, setFeed] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'mentoring' | 'marketplace'>('feed');

  useEffect(() => {
    // Load activity feed
    loadActivityFeed();
  }, []);

  const loadActivityFeed = async () => {
    try {
      // TODO: Replace with actual API call
      const mockFeed: ActivityFeedItem[] = [
        {
          id: '1',
          user_id: 'user1',
          user_name: 'María García',
          user_avatar: '/logo-econexo.png',
          activity_type: 'event_created',
          activity_data: { event_id: 'e1', event_name: 'Limpieza de playa' },
          created_at: new Date().toISOString()
        }
      ];
      setFeed(mockFeed);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8">
          {t('communityPageTitle')}
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'feed', label: t('tabFeed') },
            { id: 'groups', label: t('tabGroups') },
            { id: 'mentoring', label: t('tabMentoring') },
            { id: 'marketplace', label: t('tabMarketplace') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-green-600 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <div className="bg-white/80 dark:bg-slate-800/90 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white mb-4">
                  {t('recentActivity')}
                </h2>
                {loading ? (
                  <div className="text-center py-8">{t('loading')}</div>
                ) : feed.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {t('noActivityYet')}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feed.map((item) => (
                      <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={item.user_avatar || '/logo-econexo.png'}
                            alt={item.user_name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-semibold">{item.user_name}</span>{' '}
                              {t('createdAnEvent')}
                            </p>
                            <p className="font-medium mt-1 text-gray-800 dark:text-white">{item.activity_data.event_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(item.created_at).toLocaleDateString(locale)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="bg-white/80 dark:bg-slate-800/90 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white">
                    {t('localGroupsTitle')}
                  </h2>
                  <Link
                    href="/comunidad/grupos/nuevo"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {t('createGroupBtn')}
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('localGroupsDesc')}
                </p>
                <Link
                  href="/comunidad/grupos"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('viewAllGroups')}
                </Link>
              </div>
            )}

            {activeTab === 'mentoring' && (
              <div className="bg-white/80 dark:bg-slate-800/90 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white mb-4">
                  {t('mentoringTitle')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('mentoringDesc')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/comunidad/mentoring/buscar-mentor"
                    className="p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 bg-white/70 dark:bg-slate-800/60"
                  >
                    <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                      {t('findMentorBtn')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('findMentorDesc')}
                    </p>
                  </Link>
                  <Link
                    href="/comunidad/mentoring/convertirse-mentor"
                    className="p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white/70 dark:bg-slate-800/60"
                  >
                    <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                      {t('becomeMentorBtn')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('shareKnowledgeDesc')}
                    </p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="bg-white/80 dark:bg-slate-800/90 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white">
                    {t('marketplaceTitle')}
                  </h2>
                  <Link
                    href="/comunidad/marketplace/nuevo"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {t('publishBtn')}
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('marketplaceDesc')}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white/80 dark:bg-slate-800/90 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-extrabold text-gray-800 dark:text-white mb-4 drop-shadow-sm">
                {t('yourImpact')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{t('karma')}</span>
                  <span className="font-bold text-gray-800 dark:text-white">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    {t('reputation')}
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white">0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    {t('followers')}
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white">0</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/80 dark:bg-slate-800/90 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-extrabold text-gray-800 dark:text-white mb-4 drop-shadow-sm">
                {t('quickLinks')}
              </h3>
              <div className="space-y-2">
                <Link href="/perfil" className="block text-green-600 hover:underline">
                  {t('myProfileLabel')}
                </Link>
                <Link href="/eventos" className="block text-green-600 hover:underline">
                  {t('events')}
                </Link>
                <Link href="/proyectos" className="block text-green-600 hover:underline">
                  {t('adminProjects')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

