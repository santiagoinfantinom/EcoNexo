"use client";
import React, { useState, useEffect } from 'react';

interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  organizer: string;
  category: string;
  image: string;
  impact: {
    co2Reduction: number;
    treesPlanted: number;
    peopleHelped: number;
  };
  verified: boolean;
}

interface Sponsorship {
  id: string;
  companyName: string;
  logo: string;
  description: string;
  category: string;
  discount: number; // percentage
  conditions: string[];
  sustainability: {
    carbonNeutral: boolean;
    renewableEnergy: boolean;
    wasteReduction: boolean;
    socialResponsibility: boolean;
  };
}

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

interface SustainableMonetizationProps {
  onDonation?: (campaign: DonationCampaign, amount: number) => void;
  onSponsorshipClick?: (sponsorship: Sponsorship) => void;
  onPremiumUpgrade?: (feature: PremiumFeature) => void;
}

export default function SustainableMonetization({ 
  onDonation, 
  onSponsorshipClick, 
  onPremiumUpgrade 
}: SustainableMonetizationProps) {
  const [activeTab, setActiveTab] = useState<'donations' | 'sponsorships' | 'premium'>('donations');
  const [donationAmount, setDonationAmount] = useState<number>(25);
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);

  const donationCampaigns: DonationCampaign[] = [
    {
      id: 'd1',
      title: 'Reforestación Urbana Madrid',
      description: 'Plantar 1000 árboles nativos en parques urbanos de Madrid para mejorar la calidad del aire y crear corredores verdes.',
      targetAmount: 15000,
      currentAmount: 8750,
      deadline: '2024-12-31',
      organizer: 'Green Madrid Initiative',
      category: 'environment',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
      impact: {
        co2Reduction: 500,
        treesPlanted: 1000,
        peopleHelped: 50000
      },
      verified: true
    },
    {
      id: 'd2',
      title: 'Energía Solar Comunitaria',
      description: 'Instalar paneles solares en centros comunitarios para reducir costos energéticos y promover energías renovables.',
      targetAmount: 25000,
      currentAmount: 18200,
      deadline: '2025-03-15',
      organizer: 'Solar Community Coop',
      category: 'energy',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80',
      impact: {
        co2Reduction: 1200,
        treesPlanted: 0,
        peopleHelped: 2000
      },
      verified: true
    },
    {
      id: 'd3',
      title: 'Educación Ambiental Rural',
      description: 'Llevar programas de educación ambiental a escuelas rurales para formar la próxima generación de ecologistas.',
      targetAmount: 8000,
      currentAmount: 3200,
      deadline: '2025-01-30',
      organizer: 'Rural Education Foundation',
      category: 'education',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80',
      impact: {
        co2Reduction: 200,
        treesPlanted: 100,
        peopleHelped: 500
      },
      verified: false
    }
  ];

  const sponsorships: Sponsorship[] = [
    {
      id: 's1',
      companyName: 'EcoBike',
      logo: '🚴',
      description: 'Bicicletas eléctricas sostenibles con materiales reciclados',
      category: 'transport',
      discount: 15,
      conditions: ['Compra mínima €500', 'Registro en EcoNexo'],
      sustainability: {
        carbonNeutral: true,
        renewableEnergy: true,
        wasteReduction: true,
        socialResponsibility: true
      }
    },
    {
      id: 's2',
      companyName: 'GreenEnergy Solutions',
      logo: '⚡',
      description: 'Instalación de paneles solares residenciales',
      category: 'energy',
      discount: 20,
      conditions: ['Primera instalación', 'Evaluación energética'],
      sustainability: {
        carbonNeutral: true,
        renewableEnergy: true,
        wasteReduction: false,
        socialResponsibility: true
      }
    },
    {
      id: 's3',
      companyName: 'Sustainable Fashion Co',
      logo: '👕',
      description: 'Ropa sostenible hecha con materiales orgánicos',
      category: 'fashion',
      discount: 25,
      conditions: ['Compra mínima €100', 'Miembro EcoNexo'],
      sustainability: {
        carbonNeutral: false,
        renewableEnergy: true,
        wasteReduction: true,
        socialResponsibility: true
      }
    }
  ];

  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'p1',
      name: 'EcoNexo Pro',
      description: 'Acceso completo a análisis avanzados y herramientas premium',
      price: 9.99,
      period: 'monthly',
      features: [
        'Análisis de impacto detallado',
        'Recomendaciones personalizadas avanzadas',
        'Acceso a eventos exclusivos',
        'Certificados de participación digitales',
        'Soporte prioritario',
        'Sin anuncios'
      ],
      popular: true
    },
    {
      id: 'p2',
      name: 'EcoNexo Pro Anual',
      description: 'Ahorra 20% con la suscripción anual',
      price: 95.99,
      period: 'yearly',
      features: [
        'Todo lo de EcoNexo Pro',
        'Ahorro del 20%',
        'Acceso beta a nuevas funciones',
        'Reportes mensuales personalizados',
        'Mentoría ambiental personalizada'
      ]
    },
    {
      id: 'p3',
      name: 'EcoNexo Business',
      description: 'Para organizadores y empresas sostenibles',
      price: 29.99,
      period: 'monthly',
      features: [
        'Dashboard de gestión avanzado',
        'Analytics de eventos detallados',
        'Herramientas de marketing sostenible',
        'Integración con redes sociales',
        'Gestión de voluntarixs',
        'Reportes de impacto automáticos'
      ]
    }
  ];

  const handleDonation = (campaign: DonationCampaign) => {
    onDonation?.(campaign, donationAmount);
    // Reset form
    setSelectedCampaign(null);
    setDonationAmount(25);
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min(100, (current / target) * 100);
  };

  const getDaysLeft = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSustainabilityScore = (sustainability: Sponsorship['sustainability']): number => {
    const factors = Object.values(sustainability);
    return Math.round((factors.filter(Boolean).length / factors.length) * 100);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Monetización Sostenible
        </h3>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              activeTab === 'donations'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            💰 Donaciones
          </button>
          <button
            onClick={() => setActiveTab('sponsorships')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              activeTab === 'sponsorships'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            🤝 Patrocinios
          </button>
          <button
            onClick={() => setActiveTab('premium')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              activeTab === 'premium'
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            ⭐ Premium
          </button>
        </div>
      </div>

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Apoya proyectos ambientales verificados y transparentes
          </div>
          
          {donationCampaigns.map((campaign) => (
            <div key={campaign.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      {campaign.title}
                    </h4>
                    {campaign.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {campaign.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {campaign.impact.co2Reduction}kg
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">CO₂ reducido</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {campaign.impact.treesPlanted}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Árboles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {campaign.impact.peopleHelped.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Personas</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                      <span>Progreso</span>
                      <span>€{campaign.currentAmount.toLocaleString()} / €{campaign.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(campaign.currentAmount, campaign.targetAmount)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {getDaysLeft(campaign.deadline)} días restantes
                    </div>
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Donar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sponsorships Tab */}
      {activeTab === 'sponsorships' && (
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Descuentos exclusivos de empresas comprometidas con la sostenibilidad
          </div>
          
          {sponsorships.map((sponsorship) => (
            <div key={sponsorship.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{sponsorship.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      {sponsorship.companyName}
                    </h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      -{sponsorship.discount}% descuento
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {sponsorship.description}
                  </p>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Puntuación de Sostenibilidad: {getSustainabilityScore(sponsorship.sustainability)}%
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(sponsorship.sustainability).map(([key, value]) => (
                        <span
                          key={key}
                          className={`px-2 py-1 rounded-full text-xs ${
                            value
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Condiciones:
                    </div>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {sponsorship.conditions.map((condition, index) => (
                        <li key={index}>• {condition}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => onSponsorshipClick?.(sponsorship)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Ver Oferta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Premium Tab */}
      {activeTab === 'premium' && (
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Desbloquea funciones avanzadas y apoya el desarrollo de EcoNexo
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {premiumFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`border rounded-lg p-6 relative ${
                  feature.popular
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-slate-600'
                }`}
              >
                {feature.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {feature.name}
                  </h4>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    €{feature.price}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      /{feature.period === 'monthly' ? 'mes' : 'año'}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 text-center">
                  {feature.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {feature.features.map((feat, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-green-600">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => onPremiumUpgrade?.(feature)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    feature.popular
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-slate-600 text-white hover:bg-slate-700'
                  }`}
                >
                  Suscribirse
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Donar a {selectedCampaign.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cantidad (€)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        donationAmount === amount
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      €{amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  min="1"
                />
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Tu donación de €{donationAmount} ayudará a:
                </div>
                <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                  <li>• Reducir {Math.round((donationAmount / selectedCampaign.targetAmount) * selectedCampaign.impact.co2Reduction)}kg de CO₂</li>
                  <li>• Plantar {Math.round((donationAmount / selectedCampaign.targetAmount) * selectedCampaign.impact.treesPlanted)} árboles</li>
                  <li>• Ayudar a {Math.round((donationAmount / selectedCampaign.targetAmount) * selectedCampaign.impact.peopleHelped)} personas</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDonation(selectedCampaign)}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Donar €{donationAmount}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
