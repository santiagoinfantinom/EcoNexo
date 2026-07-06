'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Recycle, Search, Plus, MapPin, Clock, Tag, Heart } from 'lucide-react';

interface SwapItem {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  user: string;
  timeAgo: string;
  condition: string;
  wantsInReturn: string;
}

export default function TruequePage() {
  const { locale } = useI18n();

  const t = (es: string, de: string, en: string) =>
    locale === 'es' ? es : locale === 'de' ? de : en;

  const [activeTab, setActiveTab] = useState<'all' | 'seeds' | 'tools' | 'books' | 'clothes' | 'electronics'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as const, label: t('Todo', 'Alles', 'All'), icon: '🔄' },
    { id: 'seeds' as const, label: t('Semillas', 'Samen', 'Seeds'), icon: '🌱' },
    { id: 'tools' as const, label: t('Herramientas', 'Werkzeuge', 'Tools'), icon: '🔧' },
    { id: 'books' as const, label: t('Libros', 'Bücher', 'Books'), icon: '📖' },
    { id: 'clothes' as const, label: t('Ropa', 'Kleidung', 'Clothes'), icon: '👕' },
    { id: 'electronics' as const, label: t('Electrónica', 'Elektronik', 'Electronics'), icon: '📱' },
  ];

  const items: SwapItem[] = [
    {
      id: '1',
      title: t('Semillas de tomate ecológico', 'Bio-Tomatensamen', 'Organic tomato seeds'),
      category: 'seeds',
      location: t('Madrid, España', 'Madrid, Spanien', 'Madrid, Spain'),
      image: '🍅',
      user: 'María G.',
      timeAgo: t('hace 2h', 'vor 2 Std.', '2h ago'),
      condition: t('Nuevo', 'Neu', 'New'),
      wantsInReturn: t('Semillas de albahaca o pimiento', 'Basilikum- oder Paprikasamen', 'Basil or pepper seeds'),
    },
    {
      id: '2',
      title: t('Set de herramientas de jardín', 'Gartenwerkzeug-Set', 'Garden tool set'),
      category: 'tools',
      location: t('Barcelona, España', 'Barcelona, Spanien', 'Barcelona, Spain'),
      image: '🧰',
      user: 'Carlos P.',
      timeAgo: t('hace 5h', 'vor 5 Std.', '5h ago'),
      condition: t('Buen estado', 'Guter Zustand', 'Good condition'),
      wantsInReturn: t('Macetas o compostadora', 'Töpfe oder Komposter', 'Pots or composter'),
    },
    {
      id: '3',
      title: t('"Cradle to Cradle" de McDonough', '"Cradle to Cradle" von McDonough', '"Cradle to Cradle" by McDonough'),
      category: 'books',
      location: t('Berlín, Alemania', 'Berlin, Deutschland', 'Berlin, Germany'),
      image: '📗',
      user: 'Anna K.',
      timeAgo: t('hace 1d', 'vor 1 Tag', '1d ago'),
      condition: t('Buen estado', 'Guter Zustand', 'Good condition'),
      wantsInReturn: t('Cualquier libro de sostenibilidad', 'Jedes Nachhaltigkeitsbuch', 'Any sustainability book'),
    },
    {
      id: '4',
      title: t('Ropa de algodón orgánico (M)', 'Bio-Baumwollkleidung (M)', 'Organic cotton clothes (M)'),
      category: 'clothes',
      location: t('París, Francia', 'Paris, Frankreich', 'Paris, France'),
      image: '👕',
      user: 'Sophie L.',
      timeAgo: t('hace 3h', 'vor 3 Std.', '3h ago'),
      condition: t('Como nuevo', 'Wie neu', 'Like new'),
      wantsInReturn: t('Ropa talla S o accesorios eco', 'Kleidung Größe S oder öko-Zubehör', 'Size S clothes or eco accessories'),
    },
    {
      id: '5',
      title: t('Monitor LED 24" bajo consumo', '24" LED Monitor energiesparend', '24" Low-power LED monitor'),
      category: 'electronics',
      location: t('Ámsterdam, Países Bajos', 'Amsterdam, Niederlande', 'Amsterdam, Netherlands'),
      image: '🖥️',
      user: 'Jan V.',
      timeAgo: t('hace 6h', 'vor 6 Std.', '6h ago'),
      condition: t('Funcional', 'Funktional', 'Working'),
      wantsInReturn: t('Teclado o ratón inalámbrico', 'Tastatur oder kabellose Maus', 'Keyboard or wireless mouse'),
    },
    {
      id: '6',
      title: t('Plantones de lavanda (x10)', 'Lavendel-Setzlinge (x10)', 'Lavender seedlings (x10)'),
      category: 'seeds',
      location: t('Lisboa, Portugal', 'Lissabon, Portugal', 'Lisbon, Portugal'),
      image: '💜',
      user: 'Pedro S.',
      timeAgo: t('hace 4h', 'vor 4 Std.', '4h ago'),
      condition: t('Fresco', 'Frisch', 'Fresh'),
      wantsInReturn: t('Plantones de romero o menta', 'Rosmarin- oder Minz-Setzlinge', 'Rosemary or mint seedlings'),
    },
  ];

  const filtered = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t('Volver al inicio', 'Zurück zur Startseite', 'Back to home')}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-lime-100 dark:bg-lime-900/30 rounded-2xl">
              <Recycle className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('Trueque Verde', 'Grüner Tausch', 'Green Swap')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {t('Intercambia objetos con la comunidad — sin dinero, solo trueque', 'Tausche Gegenstände mit der Community — kein Geld, nur Tausch', 'Swap items with the community — no money, just trading')}
              </p>
            </div>
          </div>
        </div>

        {/* Search + Publish */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('Buscar objetos...', 'Gegenstände suchen...', 'Search items...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-lime-600 text-white rounded-xl font-semibold hover:bg-lime-700 transition-colors shadow-lg">
            <Plus className="w-5 h-5" /> {t('Publicar', 'Veröffentlichen', 'Publish')}
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? 'bg-lime-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-lime-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: t('Objetos activos', 'Aktive Objekte', 'Active items'), value: '1,247', icon: '📦' },
            { label: t('Trueques completados', 'Abgeschlossene Tausche', 'Completed swaps'), value: '3,891', icon: '🤝' },
            { label: t('kg CO₂ ahorrados', 'kg CO₂ gespart', 'kg CO₂ saved'), value: '12,340', icon: '🌍' },
            { label: t('Usuarios activos', 'Aktive Nutzer', 'Active users'), value: '856', icon: '👥' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-xl text-center">
              <span className="text-2xl">{stat.icon}</span>
              <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
              <div className="bg-gradient-to-br from-lime-50 to-green-50 dark:from-gray-800 dark:to-gray-700 p-8 text-center text-6xl">
                {item.image}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-lime-600 bg-lime-50 dark:bg-lime-900/30 px-2 py-0.5 rounded-full">{item.condition}</span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-lime-600 transition-colors">{item.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <MapPin className="w-3 h-3" /> {item.location}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Clock className="w-3 h-3" /> {item.user} · {item.timeAgo}
                </div>
                <div className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                  <Tag className="w-3 h-3 mt-0.5 text-lime-500 flex-shrink-0" />
                  <span><strong>{t('Busca:', 'Sucht:', 'Wants:')}</strong> {item.wantsInReturn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-500 text-lg">{t('No se encontraron objetos', 'Keine Gegenstände gefunden', 'No items found')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
