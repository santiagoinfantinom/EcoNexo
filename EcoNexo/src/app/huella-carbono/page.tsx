'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Leaf, Car, Zap, UtensilsCrossed, Home, Plane, ShoppingBag, Droplets } from 'lucide-react';

interface CategoryScore {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

export default function CarbonFootprintPage() {
  const { locale } = useI18n();

  const t = (es: string, de: string, en: string) =>
    locale === 'es' ? es : locale === 'de' ? de : en;

  const [transport, setTransport] = useState(3);
  const [energy, setEnergy] = useState(2);
  const [food, setFood] = useState(2);
  const [housing, setHousing] = useState(2);
  const [flights, setFlights] = useState(1);
  const [shopping, setShopping] = useState(2);
  const [water, setWater] = useState(1);

  const totalFootprint = (transport + energy + food + housing + flights + shopping + water).toFixed(1);
  const europeAvg = 8.4;

  const categories: CategoryScore[] = [
    { id: 'transport', icon: <Car className="w-5 h-5" />, label: t('Transporte', 'Transport', 'Transport'), value: transport, max: 5, unit: 't CO₂', color: 'bg-blue-500' },
    { id: 'energy', icon: <Zap className="w-5 h-5" />, label: t('Energía', 'Energie', 'Energy'), value: energy, max: 5, unit: 't CO₂', color: 'bg-yellow-500' },
    { id: 'food', icon: <UtensilsCrossed className="w-5 h-5" />, label: t('Alimentación', 'Ernährung', 'Food'), value: food, max: 5, unit: 't CO₂', color: 'bg-green-500' },
    { id: 'housing', icon: <Home className="w-5 h-5" />, label: t('Vivienda', 'Wohnen', 'Housing'), value: housing, max: 5, unit: 't CO₂', color: 'bg-purple-500' },
    { id: 'flights', icon: <Plane className="w-5 h-5" />, label: t('Vuelos', 'Flüge', 'Flights'), value: flights, max: 5, unit: 't CO₂', color: 'bg-red-500' },
    { id: 'shopping', icon: <ShoppingBag className="w-5 h-5" />, label: t('Consumo', 'Konsum', 'Shopping'), value: shopping, max: 5, unit: 't CO₂', color: 'bg-pink-500' },
    { id: 'water', icon: <Droplets className="w-5 h-5" />, label: t('Agua', 'Wasser', 'Water'), value: water, max: 5, unit: 't CO₂', color: 'bg-cyan-500' },
  ];

  const setters: Record<string, (v: number) => void> = {
    transport: setTransport,
    energy: setEnergy,
    food: setFood,
    housing: setHousing,
    flights: setFlights,
    shopping: setShopping,
    water: setWater,
  };

  const tips = [
    { icon: '🚲', text: t('Usa bicicleta o transporte público al menos 3 días/semana', 'Benutze mindestens 3 Tage/Woche das Fahrrad oder den ÖPNV', 'Use a bike or public transport at least 3 days/week') },
    { icon: '🥗', text: t('Reduce el consumo de carne roja a 1 vez/semana', 'Reduziere den Konsum von rotem Fleisch auf 1x/Woche', 'Reduce red meat consumption to once/week') },
    { icon: '💡', text: t('Cambia a proveedor de energía 100% renovable', 'Wechsle zu einem 100% erneuerbaren Energieanbieter', 'Switch to a 100% renewable energy provider') },
    { icon: '✈️', text: t('Toma máx. 1 vuelo corto al año — usa tren cuando posible', 'Max. 1 Kurzstreckenflug pro Jahr — nutze Züge wenn möglich', 'Take max 1 short flight/year — use trains when possible') },
    { icon: '🛒', text: t('Compra local y de segunda mano siempre que puedas', 'Kaufe lokal und gebraucht, wann immer du kannst', 'Buy local and second-hand whenever possible') },
    { icon: '💧', text: t('Duchas de 5 min y cierra el grifo al lavarte los dientes', 'Dusche 5 Min. und dreh den Hahn beim Zähneputzen zu', 'Take 5-min showers and turn off taps while brushing') },
  ];

  const footprintNum = parseFloat(totalFootprint);
  const rating = footprintNum <= 4 ? { label: t('¡Excelente!', 'Exzellent!', 'Excellent!'), color: 'text-green-600', bg: 'bg-green-50' }
    : footprintNum <= 8 ? { label: t('Bien', 'Gut', 'Good'), color: 'text-blue-600', bg: 'bg-blue-50' }
    : footprintNum <= 12 ? { label: t('Mejorable', 'Verbesserbar', 'Can improve'), color: 'text-yellow-600', bg: 'bg-yellow-50' }
    : { label: t('Alto', 'Hoch', 'High'), color: 'text-red-600', bg: 'bg-red-50' };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t('Volver al inicio', 'Zurück zur Startseite', 'Back to home')}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('Calculadora de Huella de Carbono', 'CO₂-Fußabdruck Rechner', 'Carbon Footprint Calculator')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {t('Ajusta los valores para estimar tu huella anual', 'Stelle die Werte ein, um deinen jährlichen Fußabdruck zu schätzen', 'Adjust the values to estimate your annual footprint')}
              </p>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className={`${rating.bg} dark:bg-gray-800 rounded-2xl p-8 mb-10 text-center shadow-lg border border-gray-100 dark:border-gray-700`}>
          <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{t('Tu huella estimada', 'Dein geschätzter Fußabdruck', 'Your estimated footprint')}</p>
          <div className="text-6xl font-bold text-gray-900 dark:text-white mb-1">{totalFootprint}</div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">t CO₂ / {t('año', 'Jahr', 'year')}</p>
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${rating.color} ${rating.bg}`}>{rating.label}</span>
          <p className="text-xs text-gray-400 mt-4">{t(`Media europea: ${europeAvg} t CO₂/año`, `Europäischer Durchschnitt: ${europeAvg} t CO₂/Jahr`, `European average: ${europeAvg} t CO₂/year`)}</p>
        </div>

        {/* Sliders */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {categories.map((cat) => (
            <div key={cat.id} className="glass-card p-5 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className={`${cat.color} text-white p-2 rounded-lg`}>{cat.icon}</div>
                <span className="font-semibold text-gray-800 dark:text-white">{cat.label}</span>
                <span className="ml-auto text-sm font-mono text-gray-500">{cat.value.toFixed(1)} {cat.unit}</span>
              </div>
              <input
                type="range"
                min={0}
                max={cat.max}
                step={0.1}
                value={cat.value}
                onChange={(e) => setters[cat.id](parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>{cat.max} {cat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            💡 {t('Consejos para reducir tu huella', 'Tipps zur Reduzierung deines Fußabdrucks', 'Tips to reduce your footprint')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tips.map((tip, i) => (
              <div key={i} className="glass-card p-5 rounded-xl flex items-start gap-3 hover:shadow-md transition-shadow">
                <span className="text-2xl">{tip.icon}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="glass-card p-8 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('Comparativa', 'Vergleich', 'Comparison')}
          </h3>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div>
              <div className="text-2xl font-bold text-green-600">2.0</div>
              <div className="text-xs text-gray-500">{t('Meta 2030', 'Ziel 2030', '2030 Target')}</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${rating.color}`}>{totalFootprint}</div>
              <div className="text-xs text-gray-500">{t('Tú', 'Du', 'You')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">{europeAvg}</div>
              <div className="text-xs text-gray-500">{t('Media UE', 'EU-Mittel', 'EU Avg')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
