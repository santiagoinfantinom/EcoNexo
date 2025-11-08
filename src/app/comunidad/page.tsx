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
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
          {locale === 'es' ? '🌍 Comunidad EcoNexo' : locale === 'de' ? '🌍 EcoNexo Gemeinschaft' : '🌍 EcoNexo Community'}
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'feed', label: locale === 'es' ? '📰 Feed' : locale === 'de' ? '📰 Feed' : '📰 Feed' },
            { id: 'groups', label: locale === 'es' ? '👥 Grupos' : locale === 'de' ? '👥 Gruppen' : '👥 Groups' },
            { id: 'mentoring', label: locale === 'es' ? '🎓 Mentoring' : locale === 'de' ? '🎓 Mentoring' : '🎓 Mentoring' },
            { id: 'marketplace', label: locale === 'es' ? '🛒 Marketplace' : locale === 'de' ? '🛒 Marktplatz' : '🛒 Marketplace' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
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
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {locale === 'es' ? 'Actividad Reciente' : locale === 'de' ? 'Aktuelle Aktivität' : 'Recent Activity'}
                </h2>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : feed.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {locale === 'es' ? 'No hay actividad aún' : locale === 'de' ? 'Noch keine Aktivität' : 'No activity yet'}
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">{item.user_name}</span>{' '}
                              {locale === 'es' ? 'creó un evento' : locale === 'de' ? 'hat ein Event erstellt' : 'created an event'}
                            </p>
                            <p className="font-medium mt-1">{item.activity_data.event_name}</p>
                            <p className="text-xs text-gray-500 mt-1">
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
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {locale === 'es' ? 'Grupos Locales' : locale === 'de' ? 'Lokale Gruppen' : 'Local Groups'}
                  </h2>
                  <Link
                    href="/comunidad/grupos/nuevo"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {locale === 'es' ? '+ Crear Grupo' : locale === 'de' ? '+ Gruppe erstellen' : '+ Create Group'}
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {locale === 'es' 
                    ? 'Conecta con comunidades locales en tu ciudad o región'
                    : locale === 'de'
                    ? 'Verbinde dich mit lokalen Gemeinschaften in deiner Stadt oder Region'
                    : 'Connect with local communities in your city or region'}
                </p>
                <Link
                  href="/comunidad/grupos"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {locale === 'es' ? 'Ver Todos los Grupos' : locale === 'de' ? 'Alle Gruppen anzeigen' : 'View All Groups'}
                </Link>
              </div>
            )}

            {activeTab === 'mentoring' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {locale === 'es' ? 'Mentoring' : locale === 'de' ? 'Mentoring' : 'Mentoring'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {locale === 'es'
                    ? 'Conecta con expertos o encuentra aprendices en sostenibilidad'
                    : locale === 'de'
                    ? 'Verbinde dich mit Experten oder finde Lernende in Nachhaltigkeit'
                    : 'Connect with experts or find learners in sustainability'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/comunidad/mentoring/buscar-mentor"
                    className="p-4 border-2 border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <h3 className="font-bold mb-2">
                      {locale === 'es' ? '🔍 Buscar Mentor' : locale === 'de' ? '🔍 Mentor suchen' : '🔍 Find Mentor'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === 'es' ? 'Encuentra un experto que te guíe' : locale === 'de' ? 'Finde einen Experten, der dich führt' : 'Find an expert to guide you'}
                    </p>
                  </Link>
                  <Link
                    href="/comunidad/mentoring/convertirse-mentor"
                    className="p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <h3 className="font-bold mb-2">
                      {locale === 'es' ? '🎓 Convertirse en Mentor' : locale === 'de' ? '🎓 Mentor werden' : '🎓 Become a Mentor'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {locale === 'es' ? 'Comparte tu conocimiento' : locale === 'de' ? 'Teile dein Wissen' : 'Share your knowledge'}
                    </p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {locale === 'es' ? 'Marketplace Ecológico' : locale === 'de' ? 'Öko-Marktplatz' : 'Eco Marketplace'}
                  </h2>
                  <Link
                    href="/comunidad/marketplace/nuevo"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {locale === 'es' ? '+ Publicar' : locale === 'de' ? '+ Veröffentlichen' : '+ Publish'}
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {locale === 'es'
                    ? 'Compra, vende o intercambia productos y servicios sostenibles'
                    : locale === 'de'
                    ? 'Kaufe, verkaufe oder tausche nachhaltige Produkte und Dienstleistungen'
                    : 'Buy, sell or exchange sustainable products and services'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="font-bold mb-4">
                {locale === 'es' ? 'Tu Impacto' : locale === 'de' ? 'Dein Impact' : 'Your Impact'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Karma</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {locale === 'es' ? 'Reputación' : locale === 'de' ? 'Reputation' : 'Reputation'}
                  </span>
                  <span className="font-bold">0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {locale === 'es' ? 'Seguidores' : locale === 'de' ? 'Follower' : 'Followers'}
                  </span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="font-bold mb-4">
                {locale === 'es' ? 'Enlaces Rápidos' : locale === 'de' ? 'Schnelllinks' : 'Quick Links'}
              </h3>
              <div className="space-y-2">
                <Link href="/perfil" className="block text-green-600 hover:underline">
                  {locale === 'es' ? 'Mi Perfil' : locale === 'de' ? 'Mein Profil' : 'My Profile'}
                </Link>
                <Link href="/eventos" className="block text-green-600 hover:underline">
                  {locale === 'es' ? 'Eventos' : locale === 'de' ? 'Events' : 'Events'}
                </Link>
                <Link href="/proyectos" className="block text-green-600 hover:underline">
                  {locale === 'es' ? 'Proyectos' : locale === 'de' ? 'Projekte' : 'Projects'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

