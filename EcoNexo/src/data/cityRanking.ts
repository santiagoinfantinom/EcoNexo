export interface CityRankingData {
    rank: number;
    name: string;
    country: string;
    points: number; // Total XP
    trend: 'up' | 'down' | 'same';
    activeProjects: number;
    monthlyEvents: number;
    population: string;
    populationNum: number;
    flagEmoji: string;

    // New Realistic Metrics
    ecoScore: number; // 0-100
    participationRate: number; // % of active population
    co2Saved: number; // tons/year
    growthLastMonth: number; // % growth
}

// Helper to calculate EcoScore (mental model for the data below)
// Score = (XP/Pop * 0.3) + (Events/Proj * 0.2) + (Projects/Pop * 0.3) + (Growth * 0.2)

export const CITY_RANKING: CityRankingData[] = [
    {
        rank: 1,
        name: 'Berlín',
        country: 'Alemania',
        points: 125000,
        trend: 'up',
        activeProjects: 87,
        monthlyEvents: 45,
        population: '3.7M',
        populationNum: 3700000,
        flagEmoji: '🇩🇪',
        ecoScore: 94.2,
        participationRate: 12.5,
        co2Saved: 1250,
        growthLastMonth: 8.4
    },
    {
        rank: 2,
        name: 'Copenhague',
        country: 'Dinamarca',
        points: 71200,
        trend: 'up',
        activeProjects: 49,
        monthlyEvents: 26,
        population: '644K',
        populationNum: 644000,
        flagEmoji: '🇩🇰',
        ecoScore: 92.8, // Higher EcoScore despite lower points due to population density
        participationRate: 18.2,
        co2Saved: 840,
        growthLastMonth: 12.1
    },
    {
        rank: 3,
        name: 'Ámsterdam',
        country: 'Países Bajos',
        points: 88000,
        trend: 'same',
        activeProjects: 61,
        monthlyEvents: 32,
        population: '872K',
        populationNum: 872000,
        flagEmoji: '🇳🇱',
        ecoScore: 91.5,
        participationRate: 15.4,
        co2Saved: 920,
        growthLastMonth: 5.2
    },
    {
        rank: 4,
        name: 'Madrid',
        country: 'España',
        points: 98000,
        trend: 'up',
        activeProjects: 72,
        monthlyEvents: 38,
        population: '3.3M',
        populationNum: 3300000,
        flagEmoji: '🇪🇸',
        ecoScore: 88.7,
        participationRate: 9.8,
        co2Saved: 1100,
        growthLastMonth: 7.5
    },
    {
        rank: 5,
        name: 'Estocolmo',
        country: 'Suecia',
        points: 68900,
        trend: 'same',
        activeProjects: 47,
        monthlyEvents: 24,
        population: '975K',
        populationNum: 975000,
        flagEmoji: '🇸🇪',
        ecoScore: 87.4,
        participationRate: 11.2,
        co2Saved: 780,
        growthLastMonth: 4.8
    },
    {
        rank: 6,
        name: 'París',
        country: 'Francia',
        points: 95400,
        trend: 'down',
        activeProjects: 68,
        monthlyEvents: 35,
        population: '2.2M',
        populationNum: 2200000,
        flagEmoji: '🇫🇷',
        ecoScore: 86.1,
        participationRate: 8.4,
        co2Saved: 1050,
        growthLastMonth: -2.1
    },
    {
        rank: 7,
        name: 'Viena',
        country: 'Austria',
        points: 65300,
        trend: 'up',
        activeProjects: 44,
        monthlyEvents: 22,
        population: '1.9M',
        populationNum: 1900000,
        flagEmoji: '🇦🇹',
        ecoScore: 85.3,
        participationRate: 7.6,
        co2Saved: 690,
        growthLastMonth: 6.3
    },
    {
        rank: 8,
        name: 'Barcelona',
        country: 'España',
        points: 76500,
        trend: 'up',
        activeProjects: 54,
        monthlyEvents: 28,
        population: '1.6M',
        populationNum: 1600000,
        flagEmoji: '🇪🇸',
        ecoScore: 84.9,
        participationRate: 10.5,
        co2Saved: 810,
        growthLastMonth: 9.1
    },
    {
        rank: 9,
        name: 'Londres',
        country: 'Reino Unido',
        points: 82000,
        trend: 'up',
        activeProjects: 58,
        monthlyEvents: 30,
        population: '9.0M',
        populationNum: 9000000,
        flagEmoji: '🇬🇧',
        ecoScore: 82.5,
        participationRate: 4.2,
        co2Saved: 1150,
        growthLastMonth: 3.5
    },
    {
        rank: 10,
        name: 'Lisboa',
        country: 'Portugal',
        points: 62100,
        trend: 'up',
        activeProjects: 41,
        monthlyEvents: 21,
        population: '505K',
        populationNum: 505000,
        flagEmoji: '🇵🇹',
        ecoScore: 81.2,
        participationRate: 9.2,
        co2Saved: 540,
        growthLastMonth: 10.8
    },
    {
        rank: 11,
        name: 'Múnich',
        country: 'Alemania',
        points: 58700,
        trend: 'down',
        activeProjects: 39,
        monthlyEvents: 19,
        population: '1.5M',
        populationNum: 1500000,
        flagEmoji: '🇩🇪',
        ecoScore: 78.4,
        participationRate: 6.8,
        co2Saved: 610,
        growthLastMonth: -1.5
    },
    {
        rank: 12,
        name: 'Bruselas',
        country: 'Bélgica',
        points: 55400,
        trend: 'same',
        activeProjects: 36,
        monthlyEvents: 18,
        population: '1.2M',
        populationNum: 1200000,
        flagEmoji: '🇧🇪',
        ecoScore: 76.9,
        participationRate: 5.4,
        co2Saved: 580,
        growthLastMonth: 2.3
    },
    {
        rank: 13,
        name: 'Oslo',
        country: 'Noruega',
        points: 46900,
        trend: 'same',
        activeProjects: 30,
        monthlyEvents: 15,
        population: '697K',
        populationNum: 697000,
        flagEmoji: '🇳🇴',
        ecoScore: 75.2,
        participationRate: 11.5,
        co2Saved: 490,
        growthLastMonth: 4.1
    },
    {
        rank: 14,
        name: 'Dublín',
        country: 'Irlanda',
        points: 52800,
        trend: 'up',
        activeProjects: 34,
        monthlyEvents: 17,
        population: '555K',
        populationNum: 555000,
        flagEmoji: '🇮🇪',
        ecoScore: 74.8,
        participationRate: 8.7,
        co2Saved: 450,
        growthLastMonth: 6.5
    },
    {
        rank: 15,
        name: 'Helsinki',
        country: 'Finlandia',
        points: 49500,
        trend: 'up',
        activeProjects: 32,
        monthlyEvents: 16,
        population: '656K',
        populationNum: 656000,
        flagEmoji: '🇫🇮',
        ecoScore: 73.1,
        participationRate: 10.2,
        co2Saved: 420,
        growthLastMonth: 5.8
    },
    {
        rank: 16,
        name: 'Varsovia',
        country: 'Polonia',
        points: 38900,
        trend: 'up',
        activeProjects: 24,
        monthlyEvents: 12,
        population: '1.8M',
        populationNum: 1800000,
        flagEmoji: '🇵🇱',
        ecoScore: 68.4,
        participationRate: 3.8,
        co2Saved: 510,
        growthLastMonth: 11.2
    },
    {
        rank: 17,
        name: 'Zúrich',
        country: 'Suiza',
        points: 36500,
        trend: 'same',
        activeProjects: 22,
        monthlyEvents: 11,
        population: '421K',
        populationNum: 421000,
        flagEmoji: '🇨🇭',
        ecoScore: 67.9,
        participationRate: 12.4,
        co2Saved: 380,
        growthLastMonth: 3.2
    },
    {
        rank: 18,
        name: 'Roma',
        country: 'Italia',
        points: 44200,
        trend: 'down',
        activeProjects: 28,
        monthlyEvents: 14,
        population: '2.9M',
        populationNum: 2900000,
        flagEmoji: '🇮🇹',
        ecoScore: 65.2,
        participationRate: 2.1,
        co2Saved: 620,
        growthLastMonth: -4.5
    },
    {
        rank: 19,
        name: 'Praga',
        country: 'República Checa',
        points: 41600,
        trend: 'up',
        activeProjects: 26,
        monthlyEvents: 13,
        population: '1.3M',
        populationNum: 1300000,
        flagEmoji: '🇨🇿',
        ecoScore: 64.7,
        participationRate: 4.5,
        co2Saved: 480,
        growthLastMonth: 5.4
    },
    {
        rank: 20,
        name: 'Atenas',
        country: 'Grecia',
        points: 34100,
        trend: 'down',
        activeProjects: 20,
        monthlyEvents: 10,
        population: '664K',
        populationNum: 664000,
        flagEmoji: '🇬🇷',
        ecoScore: 61.2,
        participationRate: 5.2,
        co2Saved: 340,
        growthLastMonth: -2.8
    },
    {
        rank: 21,
        name: 'Medellín',
        country: 'Colombia',
        points: 31800,
        trend: 'up',
        activeProjects: 18,
        monthlyEvents: 9,
        population: '2.5M',
        populationNum: 2500000,
        flagEmoji: '🇨🇴',
        ecoScore: 58.4,
        participationRate: 3.1,
        co2Saved: 290,
        growthLastMonth: 15.5 // Fast growth!
    },
    {
        rank: 22,
        name: 'Bogotá',
        country: 'Colombia',
        points: 29400,
        trend: 'up',
        activeProjects: 16,
        monthlyEvents: 8,
        population: '7.4M',
        populationNum: 7400000,
        flagEmoji: '🇨🇴',
        ecoScore: 55.1,
        participationRate: 1.2,
        co2Saved: 410,
        growthLastMonth: 12.8
    },
];

// Always sort by EcoScore for the ranking
export const SORTED_CITIES = [...CITY_RANKING].sort((a, b) => b.ecoScore - a.ecoScore)
    .map((city, index) => ({ ...city, rank: index + 1 }));

// Export a simplified version for the home page component
export const TOP_CITIES = SORTED_CITIES.slice(0, 5);
