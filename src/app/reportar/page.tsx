'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, AlertTriangle, MapPin, Camera, Send, ChevronDown, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Report {
  id: string;
  type: string;
  typeIcon: string;
  title: string;
  location: string;
  date: string;
  status: 'pending' | 'investigating' | 'resolved';
  votes: number;
}

export default function ReportarPage() {
  const { locale } = useI18n();

  const t = (es: string, de: string, en: string) =>
    locale === 'es' ? es : locale === 'de' ? de : en;

  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [showForm, setShowForm] = useState(false);

  const incidentTypes = [
    { id: 'dumping', icon: '🗑️', label: t('Vertido ilegal', 'Illegale Ablagerung', 'Illegal dumping') },
    { id: 'pollution', icon: '🏭', label: t('Contaminación', 'Verschmutzung', 'Pollution') },
    { id: 'deforestation', icon: '🪓', label: t('Tala ilegal', 'Illegale Abholzung', 'Illegal logging') },
    { id: 'water', icon: '💧', label: t('Contaminación de agua', 'Wasserverschmutzung', 'Water contamination') },
    { id: 'wildlife', icon: '🦊', label: t('Fauna en peligro', 'Gefährdete Fauna', 'Wildlife at risk') },
    { id: 'noise', icon: '🔊', label: t('Contaminación acústica', 'Lärmbelästigung', 'Noise pollution') },
  ];

  const recentReports: Report[] = [
    {
      id: '1',
      type: 'dumping',
      typeIcon: '🗑️',
      title: t('Vertido de escombros en zona protegida', 'Schuttablagerung im Schutzgebiet', 'Construction waste in protected area'),
      location: t('Parque Natural, Madrid', 'Naturpark, Madrid', 'Natural Park, Madrid'),
      date: t('Hace 3 horas', 'Vor 3 Stunden', '3 hours ago'),
      status: 'pending',
      votes: 12,
    },
    {
      id: '2',
      type: 'pollution',
      typeIcon: '🏭',
      title: t('Emisiones de humo negro en zona industrial', 'Schwarze Rauchemmissionen im Industriegebiet', 'Black smoke emissions in industrial zone'),
      location: t('Polígono Industrial, Barcelona', 'Industriegebiet, Barcelona', 'Industrial Zone, Barcelona'),
      date: t('Hace 6 horas', 'Vor 6 Stunden', '6 hours ago'),
      status: 'investigating',
      votes: 34,
    },
    {
      id: '3',
      type: 'water',
      typeIcon: '💧',
      title: t('Vertido de químicos al río local', 'Chemikalien in den Fluss eingeleitet', 'Chemicals dumped in local river'),
      location: t('Río Manzanares, Madrid', 'Fluss Manzanares, Madrid', 'Manzanares River, Madrid'),
      date: t('Hace 1 día', 'Vor 1 Tag', '1 day ago'),
      status: 'investigating',
      votes: 67,
    },
    {
      id: '4',
      type: 'deforestation',
      typeIcon: '🪓',
      title: t('Tala no autorizada de encinas centenarias', 'Unerlaubtes Fällen jahrhundertealter Eichen', 'Unauthorized felling of century-old oaks'),
      location: t('Sierra Norte, Madrid', 'Sierra Norte, Madrid', 'Sierra Norte, Madrid'),
      date: t('Hace 2 días', 'Vor 2 Tagen', '2 days ago'),
      status: 'resolved',
      votes: 145,
    },
  ];

  const statusConfig = {
    pending: { label: t('Pendiente', 'Ausstehend', 'Pending'), color: 'text-yellow-600 bg-yellow-50', icon: <Clock className="w-3.5 h-3.5" /> },
    investigating: { label: t('Investigando', 'In Untersuchung', 'Investigating'), color: 'text-blue-600 bg-blue-50', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    resolved: { label: t('Resuelto', 'Gelöst', 'Resolved'), color: 'text-green-600 bg-green-50', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t('Volver al inicio', 'Zurück zur Startseite', 'Back to home')}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('Reportar Incidencia Ambiental', 'Umweltvorfall melden', 'Report Environmental Incident')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {t('Ayuda a proteger el medio ambiente denunciando problemas', 'Hilf die Umwelt zu schützen, indem du Probleme meldest', 'Help protect the environment by reporting issues')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: t('Reportes totales', 'Gesamtberichte', 'Total reports'), value: '2,847', icon: '📋' },
            { label: t('Resueltos', 'Gelöst', 'Resolved'), value: '1,523', icon: '✅' },
            { label: t('En investigación', 'In Untersuchung', 'Investigating'), value: '412', icon: '🔍' },
            { label: t('Ciudades activas', 'Aktive Städte', 'Active cities'), value: '89', icon: '🏙️' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-xl text-center">
              <span className="text-2xl">{stat.icon}</span>
              <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Toggle form button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg mb-8"
        >
          <AlertTriangle className="w-5 h-5" />
          {t('Crear nuevo reporte', 'Neuen Bericht erstellen', 'Create new report')}
          <ChevronDown className={`w-5 h-5 transition-transform ${showForm ? 'rotate-180' : ''}`} />
        </button>

        {/* Report Form */}
        {showForm && (
          <div className="glass-card rounded-2xl p-8 mb-10 border-2 border-red-100 dark:border-red-900/30">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Nuevo reporte', 'Neuer Bericht', 'New report')}
            </h2>

            {/* Incident type selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('Tipo de incidencia', 'Art des Vorfalls', 'Incident type')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {incidentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                      selectedType === type.id
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300'
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span> {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" /> {t('Ubicación', 'Standort', 'Location')}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('Dirección o coordenadas...', 'Adresse oder Koordinaten...', 'Address or coordinates...')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Descripción', 'Beschreibung', 'Description')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={t('Describe lo que observaste...', 'Beschreibe, was du beobachtet hast...', 'Describe what you observed...')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            {/* Photo */}
            <div className="mb-6">
              <button className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-red-400 hover:text-red-500 transition-colors w-full justify-center">
                <Camera className="w-5 h-5" /> {t('Adjuntar foto (opcional)', 'Foto anhängen (optional)', 'Attach photo (optional)')}
              </button>
            </div>

            {/* Submit */}
            <button className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg">
              <Send className="w-5 h-5" /> {t('Enviar reporte', 'Bericht senden', 'Submit report')}
            </button>
          </div>
        )}

        {/* Recent Reports */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📋 {t('Reportes recientes', 'Neueste Berichte', 'Recent reports')}
          </h2>
          <div className="space-y-4">
            {recentReports.map((report) => {
              const status = statusConfig[report.status];
              return (
                <div key={report.id} className="glass-card rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{report.typeIcon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">{report.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {report.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {report.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                      <span className="text-sm text-gray-400">👍 {report.votes}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
