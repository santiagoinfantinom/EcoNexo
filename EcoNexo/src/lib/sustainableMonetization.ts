export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: 'environment' | 'education' | 'health' | 'community' | 'oceans' | 'food';
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: string;
  verified: boolean;
  impactMetrics: {
    co2Reduction?: number; // kg CO2
    treesPlanted?: number;
    wasteReduced?: number; // kg
    energySaved?: number; // kWh
    waterSaved?: number; // liters
    peopleHelped?: number;
  };
  images: string[];
  location: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Sponsorship {
  id: string;
  company: string;
  companyLogo: string;
  sustainabilityScore: number; // 0-100
  category: 'renewable-energy' | 'sustainable-transport' | 'circular-economy' | 'green-tech' | 'organic-food' | 'eco-fashion';
  offer: {
    title: string;
    description: string;
    discount: number; // percentage
    minPurchase?: number;
    maxDiscount?: number;
    validUntil: string;
  };
  requirements: string[];
  benefits: string[];
  impact: {
    co2Reduction: number;
    wasteReduction: number;
    renewableEnergy: number;
  };
  verified: boolean;
  bCorpCertified: boolean;
}

export interface PremiumSubscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  benefits: {
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    exclusiveEvents: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    teamCollaboration: boolean;
  };
  impactContribution: number; // percentage of revenue donated to environmental causes
}

export interface ImpactReport {
  id: string;
  donationId: string;
  title: string;
  description: string;
  metrics: {
    co2Reduced: number;
    treesPlanted: number;
    wasteReduced: number;
    energySaved: number;
    waterSaved: number;
    peopleHelped: number;
  };
  images: string[];
  videos?: string[];
  testimonials: {
    name: string;
    quote: string;
    role: string;
  }[];
  financialBreakdown: {
    totalDonated: number;
    administrativeCosts: number;
    projectCosts: number;
    impactCosts: number;
  };
  createdAt: string;
  verifiedBy: string;
}

export interface SustainableMonetization {
  donations: DonationCampaign[];
  sponsorships: Sponsorship[];
  premiumSubscriptions: PremiumSubscription[];
  impactReports: ImpactReport[];
}

export const PREMIUM_SUBSCRIPTIONS: PremiumSubscription[] = [
  {
    id: 'eco-explorer',
    name: 'Eco Explorer',
    price: 9.99,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Acceso a eventos exclusivos',
      'Análisis avanzados de impacto',
      'Soporte prioritario',
      'Badges especiales',
      'Notificaciones personalizadas'
    ],
    benefits: {
      advancedAnalytics: true,
      prioritySupport: true,
      exclusiveEvents: true,
      customBranding: false,
      apiAccess: false,
      teamCollaboration: false
    },
    impactContribution: 20
  },
  {
    id: 'eco-champion',
    name: 'Eco Champion',
    price: 19.99,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Todo de Eco Explorer',
      'Branding personalizado',
      'Acceso a API',
      'Colaboración en equipo',
      'Reportes detallados',
      'Mentorías exclusivas'
    ],
    benefits: {
      advancedAnalytics: true,
      prioritySupport: true,
      exclusiveEvents: true,
      customBranding: true,
      apiAccess: true,
      teamCollaboration: true
    },
    impactContribution: 30
  },
  {
    id: 'eco-organization',
    name: 'Eco Organization',
    price: 99.99,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Todo de Eco Champion',
      'Gestión de múltiples proyectos',
      'Dashboard personalizado',
      'Integración con herramientas empresariales',
      'Soporte dedicado',
      'Certificaciones de impacto'
    ],
    benefits: {
      advancedAnalytics: true,
      prioritySupport: true,
      exclusiveEvents: true,
      customBranding: true,
      apiAccess: true,
      teamCollaboration: true
    },
    impactContribution: 40
  }
];

export const SAMPLE_DONATION_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'reforestation-berlin',
    title: 'Reforestación Urbana Berlín',
    description: 'Plantación de 1000 árboles nativos en parques urbanos de Berlín para mejorar la calidad del aire y crear hábitats para la biodiversidad.',
    organization: 'Green Berlin Initiative',
    category: 'environment',
    targetAmount: 50000,
    currentAmount: 32450,
    currency: 'EUR',
    deadline: '2024-12-31',
    verified: true,
    impactMetrics: {
      co2Reduction: 25000,
      treesPlanted: 1000,
      peopleHelped: 5000
    },
    images: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1280&auto=format&fit=crop'
    ],
    location: {
      city: 'Berlín',
      country: 'Alemania',
      coordinates: [52.5200, 13.4050]
    },
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-10-15'
  },
  {
    id: 'ocean-cleanup-marseille',
    title: 'Limpieza de Océanos Marsella',
    description: 'Proyecto de limpieza de microplásticos en el Mediterráneo con tecnología innovadora de filtrado.',
    organization: 'Mediterranean Cleanup',
    category: 'oceans',
    targetAmount: 75000,
    currentAmount: 45600,
    currency: 'EUR',
    deadline: '2025-06-30',
    verified: true,
    impactMetrics: {
      wasteReduced: 100000,
      waterSaved: 5000000,
      peopleHelped: 10000
    },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop'
    ],
    location: {
      city: 'Marsella',
      country: 'Francia',
      coordinates: [43.2965, 5.3698]
    },
    status: 'active',
    createdAt: '2024-03-01',
    updatedAt: '2024-10-15'
  },
  {
    id: 'urban-gardens-madrid',
    title: 'Huertos Urbanos Madrid',
    description: 'Creación de 50 huertos comunitarios en barrios desfavorecidos de Madrid para promover la soberanía alimentaria.',
    organization: 'Madrid Verde',
    category: 'food',
    targetAmount: 30000,
    currentAmount: 30000,
    currency: 'EUR',
    verified: true,
    impactMetrics: {
      peopleHelped: 2000,
      energySaved: 5000,
      wasteReduced: 2000
    },
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1280&auto=format&fit=crop'
    ],
    location: {
      city: 'Madrid',
      country: 'España',
      coordinates: [40.4168, -3.7038]
    },
    status: 'completed',
    createdAt: '2024-01-01',
    updatedAt: '2024-09-30'
  }
];

export const SAMPLE_SPONSORSHIPS: Sponsorship[] = [
  {
    id: 'solar-energy-discount',
    company: 'SolarTech Europe',
    companyLogo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1280&auto=format&fit=crop',
    sustainabilityScore: 95,
    category: 'renewable-energy',
    offer: {
      title: 'Descuento en Paneles Solares',
      description: '20% de descuento en instalación de paneles solares para miembros de EcoNexo',
      discount: 20,
      minPurchase: 5000,
      maxDiscount: 2000,
      validUntil: '2024-12-31'
    },
    requirements: [
      'Ser miembro activo de EcoNexo',
      'Propiedad propia o autorización del propietario',
      'Evaluación técnica previa'
    ],
    benefits: [
      'Instalación profesional',
      'Garantía extendida de 25 años',
      'Monitoreo inteligente',
      'Financiación verde disponible'
    ],
    impact: {
      co2Reduction: 2000,
      wasteReduction: 100,
      renewableEnergy: 100
    },
    verified: true,
    bCorpCertified: true
  },
  {
    id: 'eco-transport-discount',
    company: 'GreenWheels',
    companyLogo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1280&auto=format&fit=crop',
    sustainabilityScore: 88,
    category: 'sustainable-transport',
    offer: {
      title: 'Descuento en Bicicletas Eléctricas',
      description: '15% de descuento en bicicletas eléctricas y accesorios',
      discount: 15,
      minPurchase: 1000,
      maxDiscount: 500,
      validUntil: '2024-11-30'
    },
    requirements: [
      'Ser miembro de EcoNexo',
      'Completar curso de seguridad vial',
      'Compromiso de uso sostenible'
    ],
    benefits: [
      'Bicicleta eléctrica premium',
      'Mantenimiento gratuito por 2 años',
      'Seguro incluido',
      'App de seguimiento'
    ],
    impact: {
      co2Reduction: 1500,
      wasteReduction: 50,
      renewableEnergy: 80
    },
    verified: true,
    bCorpCertified: false
  }
];

export class SustainableMonetizationService {
  private campaigns: DonationCampaign[] = SAMPLE_DONATION_CAMPAIGNS;
  private sponsorships: Sponsorship[] = SAMPLE_SPONSORSHIPS;
  private subscriptions: PremiumSubscription[] = PREMIUM_SUBSCRIPTIONS;

  async getDonationCampaigns(): Promise<DonationCampaign[]> {
    return this.campaigns.filter(campaign => campaign.status === 'active');
  }

  async getVerifiedCampaigns(): Promise<DonationCampaign[]> {
    return this.campaigns.filter(campaign => campaign.verified && campaign.status === 'active');
  }

  async getCampaignById(id: string): Promise<DonationCampaign | undefined> {
    return this.campaigns.find(campaign => campaign.id === id);
  }

  async getSponsorships(): Promise<Sponsorship[]> {
    return this.sponsorships.filter(sponsorship => sponsorship.verified);
  }

  async getBCorpSponsorships(): Promise<Sponsorship[]> {
    return this.sponsorships.filter(sponsorship => sponsorship.bCorpCertified);
  }

  async getPremiumSubscriptions(): Promise<PremiumSubscription[]> {
    return this.subscriptions;
  }

  async processDonation(campaignId: string, amount: number, donorInfo: any): Promise<boolean> {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'active') {
      throw new Error('Campaign is not active');
    }

    // Simulate donation processing
    campaign.currentAmount += amount;
    
    if (campaign.currentAmount >= campaign.targetAmount) {
      campaign.status = 'completed';
    }

    // Track donation for analytics
    console.log(`Donation processed: ${amount} ${campaign.currency} for ${campaign.title}`);
    
    return true;
  }

  async subscribeToPremium(subscriptionId: string, userInfo: any): Promise<boolean> {
    const subscription = this.subscriptions.find(sub => sub.id === subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Simulate subscription processing
    console.log(`Premium subscription activated: ${subscription.name} for user ${userInfo.email}`);
    
    return true;
  }

  async getImpactMetrics(): Promise<{
    totalDonations: number;
    totalImpact: {
      co2Reduced: number;
      treesPlanted: number;
      wasteReduced: number;
      energySaved: number;
      waterSaved: number;
      peopleHelped: number;
    };
    activeCampaigns: number;
    completedCampaigns: number;
    verifiedOrganizations: number;
  }> {
    const activeCampaigns = this.campaigns.filter(c => c.status === 'active');
    const completedCampaigns = this.campaigns.filter(c => c.status === 'completed');
    
    const totalDonations = this.campaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0);
    
    const totalImpact = this.campaigns.reduce((impact, campaign) => ({
      co2Reduced: impact.co2Reduced + (campaign.impactMetrics.co2Reduction || 0),
      treesPlanted: impact.treesPlanted + (campaign.impactMetrics.treesPlanted || 0),
      wasteReduced: impact.wasteReduced + (campaign.impactMetrics.wasteReduced || 0),
      energySaved: impact.energySaved + (campaign.impactMetrics.energySaved || 0),
      waterSaved: impact.waterSaved + (campaign.impactMetrics.waterSaved || 0),
      peopleHelped: impact.peopleHelped + (campaign.impactMetrics.peopleHelped || 0)
    }), {
      co2Reduced: 0,
      treesPlanted: 0,
      wasteReduced: 0,
      energySaved: 0,
      waterSaved: 0,
      peopleHelped: 0
    });

    return {
      totalDonations,
      totalImpact,
      activeCampaigns: activeCampaigns.length,
      completedCampaigns: completedCampaigns.length,
      verifiedOrganizations: this.campaigns.filter(c => c.verified).length
    };
  }
}

export const monetizationService = new SustainableMonetizationService();
