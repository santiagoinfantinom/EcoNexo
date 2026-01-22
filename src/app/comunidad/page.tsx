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
    <div className="min-h-screen bg-background dark:bg-slate-900">
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
              className={`px-6 py-3 font-bold transition-all border-b-2 cursor-pointer ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground/40 hover:text-foreground/60'
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
              <div className="bg-background dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-foreground/10 dark:border-white/10">
                <h2 className="text-3xl font-bold text-foreground mb-6 font-sans">
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
                            className="w-12 h-12 rounded-2xl shadow-md border border-foreground/10 dark:border-white/10"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-semibold">{item.user_name}</span>{' '}
                              {t('createdAnEvent')}
                            </p>
                            <p className="font-medium mt-1 text-gray-800 dark:text-white">{item.activity_data.event_name}</p>
                            <p className="text-xs text-foreground/40 mt-1 font-mono">
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
              <div className="bg-background dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-foreground/10 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-foreground font-sans">
                    {t('localGroupsTitle')}
                  </h2>
                  <Link
                    href="/comunidad/grupos/nuevo"
                    className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:shadow-xl transition-all hover-lift cursor-pointer"
                  >
                    {t('createGroupBtn')}
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('localGroupsDesc')}
                </p>
                <Link
                  href="/comunidad/grupos"
                  className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-xl transition-all hover-lift cursor-pointer"
                >
                  {t('viewAllGroups')}
                </Link>
              </div>
            )}

            {activeTab === 'mentoring' && (
              <div className="bg-background dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-foreground/10 dark:border-white/10">
                <h2 className="text-3xl font-bold text-foreground mb-6 font-sans">
                  {t('mentoringTitle')}
                </h2>
                <p className="text-foreground/60 mb-8 font-mono text-sm leading-relaxed">
                  {t('mentoringDesc')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/comunidad/mentoring/buscar-mentor"
                    className="p-6 border border-primary/20 rounded-2xl hover:bg-primary/5 transition-all hover-lift group cursor-pointer bg-background dark:bg-slate-900"
                  >
                    <h3 className="font-bold text-foreground mb-3 font-sans text-xl group-hover:text-primary transition-colors">
                      {t('findMentorBtn')}
                    </h3>
                    <p className="text-sm text-foreground/60 font-mono">
                      {t('findMentorDesc')}
                    </p>
                  </Link>
                  <Link
                    href="/comunidad/mentoring/convertirse-mentor"
                    className="p-6 border border-secondary/20 rounded-2xl hover:bg-secondary/5 transition-all hover-lift group cursor-pointer bg-background dark:bg-slate-900"
                  >
                    <h3 className="font-bold text-foreground mb-3 font-sans text-xl group-hover:text-secondary transition-colors">
                      {t('becomeMentorBtn')}
                    </h3>
                    <p className="text-sm text-foreground/60 font-mono">
                      {t('shareKnowledgeDesc')}
                    </p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="bg-background dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-foreground/10 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-foreground font-sans">
                    {t('marketplaceTitle')}
                  </h2>
                  <Link
                    href="/comunidad/marketplace/nuevo"
                    className="px-6 py-2 bg-cta text-white rounded-xl font-bold hover:shadow-xl transition-all hover-lift cursor-pointer"
                  >
                    {t('publishBtn')}
                  </Link>
                </div>
                <p className="text-foreground/60 font-mono text-sm leading-relaxed">
                  {t('marketplaceDesc')}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-background dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-foreground/10 dark:border-white/10">
              <h3 className="text-xl font-bold text-foreground mb-6 font-sans">
                {t('yourImpact')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60 font-mono text-sm uppercase tracking-widest">{t('karma')}</span>
                  <span className="font-bold text-primary text-lg">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60 font-mono text-sm uppercase tracking-widest">
                    {t('reputation')}
                  </span>
                  <span className="font-bold text-secondary text-lg">0.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60 font-mono text-sm uppercase tracking-widest">
                    {t('followers')}
                  </span>
                  <span className="font-bold text-cta text-lg">0</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-background dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-foreground/10 dark:border-white/10">
              <h3 className="text-xl font-bold text-foreground mb-6 font-sans">
                {t('quickLinks')}
              </h3>
              <div className="space-y-3">
                <Link href="/perfil" className="block text-primary hover:text-primary/70 font-bold transition-all text-sm font-sans underline underline-offset-4 decoration-primary/30">
                  {t('myProfileLabel')}
                </Link>
                <Link href="/eventos" className="block text-secondary hover:text-secondary/70 font-bold transition-all text-sm font-sans underline underline-offset-4 decoration-secondary/30">
                  {t('events')}
                </Link>
                <Link href="/proyectos" className="block text-cta hover:text-cta/70 font-bold transition-all text-sm font-sans underline underline-offset-4 decoration-cta/30">
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

