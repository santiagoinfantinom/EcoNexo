'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { monetizationService, DonationCampaign, Sponsorship, PremiumSubscription } from '@/lib/sustainableMonetization';
import { trackEvent } from '@/lib/analytics';

interface SustainableMonetizationProps {
  onDonation?: (campaignId: string, amount: number) => void;
  onSponsorshipClick?: (sponsorshipId: string) => void;
  onPremiumUpgrade?: (subscriptionId: string) => void;
}

export default function SustainableMonetization({ 
  onDonation, 
  onSponsorshipClick, 
  onPremiumUpgrade 
}: SustainableMonetizationProps) {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'donations' | 'sponsorships' | 'premium'>('donations');
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [subscriptions, setSubscriptions] = useState<PremiumSubscription[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campaignsData, sponsorshipsData, subscriptionsData, metricsData] = await Promise.all([
        monetizationService.getVerifiedCampaigns(),
        monetizationService.getSponsorships(),
        monetizationService.getPremiumSubscriptions(),
        monetizationService.getImpactMetrics()
      ]);

      setCampaigns(campaignsData);
      setSponsorships(sponsorshipsData);
      setSubscriptions(subscriptionsData);
      setImpactMetrics(metricsData);
    } catch (error) {
      console.error('Error loading monetization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async (campaignId: string, amount: number) => {
    try {
      await monetizationService.processDonation(campaignId, amount, {});
      onDonation?.(campaignId, amount);
      trackEvent('Donation Made', { campaignId, amount });
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error processing donation:', error);
    }
  };

  const handleSponsorshipClick = (sponsorshipId: string) => {
    onSponsorshipClick?.(sponsorshipId);
    trackEvent('Sponsorship Clicked', { sponsorshipId });
  };

  const handlePremiumUpgrade = async (subscriptionId: string) => {
    try {
      await monetizationService.subscribeToPremium(subscriptionId, {});
      onPremiumUpgrade?.(subscriptionId);
      trackEvent('Premium Subscription', { subscriptionId });
    } catch (error) {
      console.error('Error processing premium subscription:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gls-secondary mb-4">
          💰 Monetización Sostenible
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Apoya proyectos verificados, descubre ofertas sostenibles y accede a funciones premium que impulsan el impacto ambiental.
        </p>
      </div>

      {/* Impact Metrics */}
      {impactMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(impactMetrics.totalDonations, 'EUR')}
            </div>
            <div className="text-sm text-gray-600">Donaciones Totales</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {impactMetrics.totalImpact.co2Reduced.toLocaleString()} kg
            </div>
            <div className="text-sm text-gray-600">CO₂ Reducido</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {impactMetrics.totalImpact.treesPlanted.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Árboles Plantados</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {impactMetrics.totalImpact.peopleHelped.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Personas Ayudadas</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'donations', name: 'Donaciones', icon: '💚', count: campaigns.length },
            { id: 'sponsorships', name: 'Patrocinios', icon: '🤝', count: sponsorships.length },
            { id: 'premium', name: 'Premium', icon: '⭐', count: subscriptions.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'donations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={campaign.images[0]} 
                  alt={campaign.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      {campaign.category}
                    </span>
                    {campaign.verified && (
                      <span className="text-sm text-blue-600">✓ Verificado</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {campaign.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{formatCurrency(campaign.currentAmount, campaign.currency)}</span>
                      <span>{formatCurrency(campaign.targetAmount, campaign.currency)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${formatProgress(campaign.currentAmount, campaign.targetAmount)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatProgress(campaign.currentAmount, campaign.targetAmount).toFixed(1)}% completado
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    {campaign.impactMetrics.co2Reduction && (
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {campaign.impactMetrics.co2Reduction.toLocaleString()} kg
                        </div>
                        <div className="text-gray-500">CO₂ Reducido</div>
                      </div>
                    )}
                    {campaign.impactMetrics.treesPlanted && (
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {campaign.impactMetrics.treesPlanted}
                        </div>
                        <div className="text-gray-500">Árboles</div>
                      </div>
                    )}
                  </div>

                  {/* Donation Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDonation(campaign.id, 25)}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      €25
                    </button>
                    <button
                      onClick={() => handleDonation(campaign.id, 50)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      €50
                    </button>
                    <button
                      onClick={() => handleDonation(campaign.id, 100)}
                      className="flex-1 bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                    >
                      €100
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sponsorships' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sponsorships.map((sponsorship) => (
              <div key={sponsorship.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <img 
                      src={sponsorship.companyLogo} 
                      alt={sponsorship.company}
                      className="h-12 w-auto"
                    />
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {sponsorship.company}
                      </div>
                      <div className="text-xs text-gray-500">
                        Score: {sponsorship.sustainabilityScore}/100
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {sponsorship.offer.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {sponsorship.offer.description}
                  </p>

                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {sponsorship.offer.discount}% OFF
                      </div>
                      <div className="text-sm text-gray-600">
                        Hasta {formatCurrency(sponsorship.offer.maxDiscount || 0, 'EUR')}
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Beneficios:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {sponsorship.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {sponsorship.impact.co2Reduction} kg
                      </div>
                      <div className="text-gray-500">CO₂</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {sponsorship.impact.wasteReduction} kg
                      </div>
                      <div className="text-gray-500">Residuos</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {sponsorship.impact.renewableEnergy}%
                      </div>
                      <div className="text-gray-500">Renovable</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSponsorshipClick(sponsorship.id)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Ver Oferta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'premium' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                subscription.id === 'eco-champion' ? 'ring-2 ring-green-500' : ''
              }`}>
                {subscription.id === 'eco-champion' && (
                  <div className="bg-green-500 text-white text-center py-2 text-sm font-medium">
                    ⭐ Más Popular
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {subscription.name}
                  </h3>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(subscription.price, subscription.currency)}
                    </div>
                    <div className="text-gray-500">
                      / {subscription.interval === 'monthly' ? 'mes' : 'año'}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <div className="text-sm text-center">
                      <span className="font-semibold text-green-600">
                        {subscription.impactContribution}%
                      </span>
                      <span className="text-gray-600"> de los ingresos se donan a causas ambientales</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePremiumUpgrade(subscription.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      subscription.id === 'eco-champion'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    Suscribirse
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}