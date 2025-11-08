"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { LocalGroup } from "@/lib/social-types";

export default function GruposPage() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [groups, setGroups] = useState<LocalGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my_groups' | 'nearby'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGroups();
  }, [filter, searchQuery]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockGroups: LocalGroup[] = [
        {
          id: '1',
          name: 'Berlín Sostenible',
          description: 'Comunidad de activistas ambientales en Berlín',
          city: 'Berlín',
          country: 'Alemania',
          region: 'Berlin',
          avatar_url: '/logo-econexo.png',
          cover_image_url: undefined,
          created_by: 'user1',
          created_by_name: 'María García',
          members_count: 45,
          events_count: 12,
          is_public: true,
          tags: ['Medio ambiente', 'Comunidad'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Madrid Verde',
          description: 'Iniciativas ecológicas en Madrid',
          city: 'Madrid',
          country: 'España',
          region: 'Madrid',
          avatar_url: '/logo-econexo.png',
          cover_image_url: undefined,
          created_by: 'user2',
          created_by_name: 'Juan Pérez',
          members_count: 32,
          events_count: 8,
          is_public: true,
          tags: ['Sostenibilidad', 'Educación'],
          created_at: new Date().toISOString()
        }
      ];
      setGroups(mockGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        group.name.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query) ||
        group.city.toLowerCase().includes(query) ||
        group.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              {locale === 'es' ? '👥 Grupos Locales' : locale === 'de' ? '👥 Lokale Gruppen' : '👥 Local Groups'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'es'
                ? 'Conecta con comunidades locales en tu ciudad o región'
                : locale === 'de'
                ? 'Verbinde dich mit lokalen Gemeinschaften in deiner Stadt oder Region'
                : 'Connect with local communities in your city or region'}
            </p>
          </div>
          {user && (
            <Link
              href="/comunidad/grupos/nuevo"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {locale === 'es' ? '+ Crear Grupo' : locale === 'de' ? '+ Gruppe erstellen' : '+ Create Group'}
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: locale === 'es' ? 'Todos' : locale === 'de' ? 'Alle' : 'All' },
              { id: 'my_groups', label: locale === 'es' ? 'Mis Grupos' : locale === 'de' ? 'Meine Gruppen' : 'My Groups' },
              { id: 'nearby', label: locale === 'es' ? 'Cercanos' : locale === 'de' ? 'In der Nähe' : 'Nearby' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'es' ? 'Buscar grupos...' : locale === 'de' ? 'Gruppen suchen...' : 'Search groups...'}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {locale === 'es'
                ? 'No se encontraron grupos'
                : locale === 'de'
                ? 'Keine Gruppen gefunden'
                : 'No groups found'}
            </p>
            {user && (
              <Link
                href="/comunidad/grupos/nuevo"
                className="mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {locale === 'es' ? 'Crear el primer grupo' : locale === 'de' ? 'Erste Gruppe erstellen' : 'Create the first group'}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Link
                key={group.id}
                href={`/comunidad/grupos/${group.id}`}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Cover Image */}
                {group.cover_image_url ? (
                  <img
                    src={group.cover_image_url}
                    alt={group.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-r from-green-500 to-blue-500"></div>
                )}

                <div className="p-6">
                  {/* Avatar and Name */}
                  <div className="flex items-start gap-3 -mt-12 mb-4">
                    <img
                      src={group.avatar_url || '/logo-econexo.png'}
                      alt={group.name}
                      className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{group.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        📍 {group.city}, {group.country}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {group.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                      {group.description}
                    </p>
                  )}

                  {/* Tags */}
                  {group.tags && group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span>{group.members_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{group.events_count} {locale === 'es' ? 'eventos' : locale === 'de' ? 'Events' : 'events'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

