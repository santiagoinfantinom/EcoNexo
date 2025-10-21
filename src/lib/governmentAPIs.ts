export interface GovernmentAPI {
  country: string;
  name: string;
  baseUrl: string;
  endpoints: {
    environmentalData?: string;
    sustainabilityProjects?: string;
    greenJobs?: string;
    events?: string;
    regulations?: string;
  };
  apiKey?: string;
  rateLimit?: number;
  description: string;
}

export const GOVERNMENT_APIS: GovernmentAPI[] = [
  {
    country: "DE",
    name: "German Environment Agency API",
    baseUrl: "https://www.umweltbundesamt.de/api",
    endpoints: {
      environmentalData: "/environmental-data",
      sustainabilityProjects: "/sustainability-projects",
      greenJobs: "/green-jobs",
      events: "/environmental-events"
    },
    description: "Official German environmental data and sustainability initiatives"
  },
  {
    country: "FR",
    name: "Ministère de la Transition Écologique API",
    baseUrl: "https://www.ecologie.gouv.fr/api",
    endpoints: {
      environmentalData: "/donnees-environnementales",
      sustainabilityProjects: "/projets-durables",
      greenJobs: "/emplois-verts",
      events: "/evenements-environnementaux"
    },
    description: "French Ministry of Ecological Transition data"
  },
  {
    country: "IT",
    name: "Ministero della Transizione Ecologica API",
    baseUrl: "https://www.mite.gov.it/api",
    endpoints: {
      environmentalData: "/dati-ambientali",
      sustainabilityProjects: "/progetti-sostenibili",
      greenJobs: "/lavori-verdi",
      events: "/eventi-ambientali"
    },
    description: "Italian Ministry of Ecological Transition data"
  },
  {
    country: "NL",
    name: "Rijksoverheid Milieu API",
    baseUrl: "https://www.rijksoverheid.nl/api",
    endpoints: {
      environmentalData: "/milieu-data",
      sustainabilityProjects: "/duurzame-projecten",
      greenJobs: "/groene-banen",
      events: "/milieu-evenementen"
    },
    description: "Dutch government environmental data"
  },
  {
    country: "PL",
    name: "Ministerstwo Klimatu i Środowiska API",
    baseUrl: "https://www.gov.pl/web/klimat/api",
    endpoints: {
      environmentalData: "/dane-srodowiskowe",
      sustainabilityProjects: "/projekty-zrownowazone",
      greenJobs: "/zielone-prace",
      events: "/wydarzenia-srodowiskowe"
    },
    description: "Polish Ministry of Climate and Environment data"
  },
  {
    country: "ES",
    name: "MITECO API",
    baseUrl: "https://www.miteco.gob.es/api",
    endpoints: {
      environmentalData: "/datos-ambientales",
      sustainabilityProjects: "/proyectos-sostenibles",
      greenJobs: "/empleos-verdes",
      events: "/eventos-ambientales"
    },
    description: "Spanish Ministry for Ecological Transition data"
  },
  {
    country: "GB",
    name: "DEFRA API",
    baseUrl: "https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs/api",
    endpoints: {
      environmentalData: "/environmental-data",
      sustainabilityProjects: "/sustainability-projects",
      greenJobs: "/green-jobs",
      events: "/environmental-events"
    },
    description: "UK Department for Environment, Food and Rural Affairs data"
  },
  {
    country: "AT",
    name: "Bundesministerium für Klimaschutz API",
    baseUrl: "https://www.bmk.gv.at/api",
    endpoints: {
      environmentalData: "/umweltdaten",
      sustainabilityProjects: "/nachhaltigkeitsprojekte",
      greenJobs: "/gruene-jobs",
      events: "/umweltveranstaltungen"
    },
    description: "Austrian Federal Ministry for Climate Protection data"
  },
  {
    country: "DK",
    name: "Miljøstyrelsen API",
    baseUrl: "https://mst.dk/api",
    endpoints: {
      environmentalData: "/miljodata",
      sustainabilityProjects: "/baerekraftige-projekter",
      greenJobs: "/groenne-job",
      events: "/miljoe-begivenheder"
    },
    description: "Danish Environmental Protection Agency data"
  },
  {
    country: "SE",
    name: "Naturvårdsverket API",
    baseUrl: "https://www.naturvardsverket.se/api",
    endpoints: {
      environmentalData: "/miljodata",
      sustainabilityProjects: "/hallbara-projekt",
      greenJobs: "/grona-jobb",
      events: "/miljoe-evenemang"
    },
    description: "Swedish Environmental Protection Agency data"
  }
];

export interface EnvironmentalData {
  country: string;
  co2Emissions: number;
  renewableEnergyPercentage: number;
  airQualityIndex: number;
  wasteRecyclingRate: number;
  greenSpacePercentage: number;
  lastUpdated: string;
}

export interface SustainabilityProject {
  id: string;
  name: string;
  description: string;
  category: string;
  location: {
    city: string;
    country: string;
    coordinates: [number, number];
  };
  status: 'active' | 'planned' | 'completed';
  budget?: number;
  participants?: number;
  startDate?: string;
  endDate?: string;
  governmentFunding?: boolean;
}

export interface GreenJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline?: string;
  governmentSponsored?: boolean;
}

export class GovernmentAPIClient {
  private apiKey: string;
  private baseUrl: string;
  private rateLimit: number = 100; // requests per minute
  private lastRequestTime: number = 0;

  constructor(apiKey: string, baseUrl: string, rateLimit?: number) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.rateLimit = rateLimit || 100;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async rateLimitCheck(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 60000 / this.rateLimit; // Convert to milliseconds

    if (timeSinceLastRequest < minInterval) {
      await this.delay(minInterval - timeSinceLastRequest);
    }
    this.lastRequestTime = Date.now();
  }

  async fetchEnvironmentalData(): Promise<EnvironmentalData | null> {
    try {
      await this.rateLimitCheck();
      
      const response = await fetch(`${this.baseUrl}/environmental-data`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      return null;
    }
  }

  async fetchSustainabilityProjects(): Promise<SustainabilityProject[]> {
    try {
      await this.rateLimitCheck();
      
      const response = await fetch(`${this.baseUrl}/sustainability-projects`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching sustainability projects:', error);
      return [];
    }
  }

  async fetchGreenJobs(): Promise<GreenJob[]> {
    try {
      await this.rateLimitCheck();
      
      const response = await fetch(`${this.baseUrl}/green-jobs`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching green jobs:', error);
      return [];
    }
  }

  async fetchEnvironmentalEvents(): Promise<any[]> {
    try {
      await this.rateLimitCheck();
      
      const response = await fetch(`${this.baseUrl}/environmental-events`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching environmental events:', error);
      return [];
    }
  }
}

export function getGovernmentAPI(countryCode: string): GovernmentAPI | undefined {
  return GOVERNMENT_APIS.find(api => api.country === countryCode);
}

export function getAllGovernmentAPIs(): GovernmentAPI[] {
  return GOVERNMENT_APIS;
}

export function createAPIClient(countryCode: string, apiKey: string): GovernmentAPIClient | null {
  const api = getGovernmentAPI(countryCode);
  if (!api) {
    console.error(`No API configuration found for country: ${countryCode}`);
    return null;
  }

  return new GovernmentAPIClient(apiKey, api.baseUrl, api.rateLimit);
}
