"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { ActivityFeedItem } from "@/lib/social-types";
import UserAvatar from "@/components/UserAvatar";

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
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
            {locale === "es" ? "Network de ejecución climática" : locale === "de" ? "Klima-Execution-Network" : "Climate execution network"}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
          {t('communityPageTitle')}
        </h1>
        <p className="mb-8 max-w-3xl text-sm text-white/80">
          {locale === "es"
            ? "Conecta personas, grupos y mentorías para convertir intención en colaboración medible."
            : locale === "de"
              ? "Verbinde Menschen, Gruppen und Mentoring, um aus Intention messbare Zusammenarbeit zu machen."
              : "Connect people, groups, and mentoring to turn intention into measurable collaboration."}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/20">
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
                ? 'border-white text-white'
                : 'border-transparent text-white/80 hover:text-white'
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
              <div className="bg-transparent backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 font-sans">
                  {t('recentActivity')}
                </h2>
                {loading ? (
                  <div className="text-center py-8 text-white">{t('loading')}</div>
                ) : feed.length === 0 ? (
                  <div className="text-center py-8 text-white/90">
                    {t('noActivityYet')}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feed.map((item) => (
                      <div key={item.id} className="border-b border-white/20 pb-4">
                        <div className="flex items-start gap-3">
                          {(() => {
                            const isOwnActivity = !!user && item.user_id === user.id;
                            const ownAvatar = user?.profile?.avatar_url || user?.profile?.picture;
                            const avatarSrc = isOwnActivity && ownAvatar ? ownAvatar : (item.user_avatar || '/logo-econexo.png');
                            const displayName = isOwnActivity && user?.profile?.full_name
                              ? user.profile.full_name
                              : item.user_name;
                            return (
                              <>
                                <UserAvatar
                                  src={avatarSrc}
                                  alt={displayName}
                                  name={displayName}
                                  sizeClassName="w-12 h-12"
                                  className="rounded-2xl shadow-md border border-foreground/10 dark:border-white/10"
                                />
                                <div className="flex-1">
                                  <p className="text-sm text-white/80">
                                    <span className="font-semibold text-white">{displayName}</span>{' '}
                                    {t('createdAnEvent')}
                                  </p>
                                  <p className="font-medium mt-1 text-white">{item.activity_data.event_name}</p>
                                  <p className="text-xs text-white/70 mt-1 font-mono">
                                    {new Date(item.created_at).toLocaleDateString(locale)}
                                  </p>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="bg-transparent backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-white font-sans">
                    {t('localGroupsTitle')}
                  </h2>
                  <Link
                    href="/community/groups/new"
                    className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:shadow-xl transition-all hover-lift cursor-pointer"
                  >
                    {t('createGroupBtn')}
                  </Link>
                </div>
                <p className="text-white/80 mb-4">
                  {t('localGroupsDesc')}
                </p>
                <Link
                  href="/community/groups"
                  className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-xl transition-all hover-lift cursor-pointer"
                >
                  {t('viewAllGroups')}
                </Link>
              </div>
            )}

            {activeTab === 'mentoring' && (
              <div className="bg-transparent backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 font-sans">
                  {t('mentoringTitle')}
                </h2>
                <p className="text-white/90 mb-8 font-mono text-sm leading-relaxed">
                  {t('mentoringDesc')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/community/mentoring/buscar-mentor"
                    className="p-6 border border-white/30 rounded-2xl hover:bg-white/10 transition-all hover-lift group cursor-pointer bg-transparent"
                  >
                    <h3 className="font-bold text-white mb-3 font-sans text-xl group-hover:text-white/80 transition-colors">
                      {t('findMentorBtn')}
                    </h3>
                    <p className="text-sm text-white/85 font-mono">
                      {t('findMentorDesc')}
                    </p>
                  </Link>
                  <Link
                    href="/community/mentoring/convertirse-mentor"
                    className="p-6 border border-white/30 rounded-2xl hover:bg-white/10 transition-all hover-lift group cursor-pointer bg-transparent"
                  >
                    <h3 className="font-bold text-white mb-3 font-sans text-xl group-hover:text-white/80 transition-colors">
                      {t('becomeMentorBtn')}
                    </h3>
                    <p className="text-sm text-white/85 font-mono">
                      {t('shareKnowledgeDesc')}
                    </p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="bg-transparent backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-white font-sans">
                    {t('marketplaceTitle')}
                  </h2>
                  <Link
                    href="/community/marketplace/nuevo"
                    className="px-6 py-2 bg-cta text-white rounded-xl font-bold hover:shadow-xl transition-all hover-lift cursor-pointer"
                  >
                    {t('publishBtn')}
                  </Link>
                </div>
                <p className="text-white/90 font-mono text-sm leading-relaxed">
                  {t('marketplaceDesc')}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-transparent backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 font-sans">
                {t('yourImpact')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-mono text-sm uppercase tracking-widest">{t('karma')}</span>
                  <span className="font-bold text-primary text-lg">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-mono text-sm uppercase tracking-widest">
                    {t('reputation')}
                  </span>
                  <span className="font-bold text-secondary text-lg">0.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-mono text-sm uppercase tracking-widest">
                    {t('followers')}
                  </span>
                  <span className="font-bold text-cta text-lg">0</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-transparent backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 font-sans">
                {t('quickLinks')}
              </h3>
              <div className="space-y-3">
                <Link href="/perfil" className="block text-white hover:text-white/70 font-bold transition-all text-sm font-sans underline underline-offset-4 decoration-white/30">
                  {t('myProfileLabel')}
                </Link>
                <Link href="/eventos" className="block text-white hover:text-white/70 font-bold transition-all text-sm font-sans underline underline-offset-4 decoration-white/30">
                  {t('events')}
                </Link>
                <Link href="/proyectos" className="block text-white hover:text-white/70 font-bold transition-all text-sm font-sans underline underline-offset-4 decoration-white/30">
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

