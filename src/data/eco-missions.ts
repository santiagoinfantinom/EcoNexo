import { Project, Category } from './projects';

export type MissionDifficulty = 'easy' | 'medium' | 'hard';

export interface EcoMission {
  id: string;
  title: string;
  title_en: string;
  title_de: string;
  description: string;
  description_en: string;
  description_de: string;
  icon: string;
  xpReward: number;
  karmaReward: number;
  difficulty: MissionDifficulty;
  estimatedMinutes: number;
  category: Category;
  // Linked to a real project
  linkedProjectId: string;
  linkedProjectName: string;
  distanceKm?: number;
  city?: string;
  country?: string;
}

// Templates per category — these generate contextual missions from real projects
interface MissionTemplate {
  titlePattern: string;
  titlePattern_en: string;
  titlePattern_de: string;
  descPattern: string;
  descPattern_en: string;
  descPattern_de: string;
  icon: string;
  xpReward: number;
  karmaReward: number;
  difficulty: MissionDifficulty;
  estimatedMinutes: number;
}

const TEMPLATES: Record<string, MissionTemplate[]> = {
  'Medio ambiente': [
    {
      titlePattern: 'Limpieza Express cerca de {project}',
      titlePattern_en: 'Express Cleanup near {project}',
      titlePattern_de: 'Express-Aufräumaktion bei {project}',
      descPattern: 'Recoge al menos 5 piezas de basura alrededor de {project}. ¡Cada pequeña acción cuenta!',
      descPattern_en: 'Pick up at least 5 pieces of litter around {project}. Every small action counts!',
      descPattern_de: 'Sammle mindestens 5 Müllstücke rund um {project}. Jede kleine Aktion zählt!',
      icon: '🧹', xpReward: 80, karmaReward: 15, difficulty: 'easy', estimatedMinutes: 15
    },
    {
      titlePattern: 'Foto-reporte ambiental en {city}',
      titlePattern_en: 'Environmental Photo Report in {city}',
      titlePattern_de: 'Umwelt-Fotobericht in {city}',
      descPattern: 'Documenta con 3 fotos el estado de espacios verdes cercanos a {project}.',
      descPattern_en: 'Document with 3 photos the state of green spaces near {project}.',
      descPattern_de: 'Dokumentiere mit 3 Fotos den Zustand der Grünflächen bei {project}.',
      icon: '📸', xpReward: 60, karmaReward: 10, difficulty: 'easy', estimatedMinutes: 10
    },
    {
      titlePattern: 'Inspección de reciclaje en {city}',
      titlePattern_en: 'Recycling Inspection in {city}',
      titlePattern_de: 'Recycling-Inspektion in {city}',
      descPattern: 'Verifica que los contenedores de reciclaje del barrio estén correctamente señalizados.',
      descPattern_en: 'Check that the neighborhood recycling bins are properly marked.',
      descPattern_de: 'Überprüfe, ob die Recycling-Behälter richtig gekennzeichnet sind.',
      icon: '♻️', xpReward: 100, karmaReward: 20, difficulty: 'medium', estimatedMinutes: 25
    },
  ],
  'Alimentación': [
    {
      titlePattern: 'Visita al huerto de {project}',
      titlePattern_en: 'Visit {project} garden',
      titlePattern_de: 'Besuch im Garten von {project}',
      descPattern: 'Visita el huerto comunitario de {project} y aprende qué se cultiva esta temporada.',
      descPattern_en: 'Visit the community garden at {project} and learn what is growing this season.',
      descPattern_de: 'Besuche den Gemeinschaftsgarten bei {project} und erfahre, was in dieser Saison waechst.',
      icon: '🌱', xpReward: 70, karmaReward: 12, difficulty: 'easy', estimatedMinutes: 20
    },
    {
      titlePattern: 'Compra local cerca de {project}',
      titlePattern_en: 'Buy local near {project}',
      titlePattern_de: 'Lokal einkaufen bei {project}',
      descPattern: 'Compra un producto local de km 0 en tu mercado más cercano.',
      descPattern_en: 'Buy a local km-0 product at your nearest market.',
      descPattern_de: 'Kaufe ein lokales Produkt auf dem nächsten Markt.',
      icon: '🛒', xpReward: 50, karmaReward: 8, difficulty: 'easy', estimatedMinutes: 15
    },
  ],
  'Océanos': [
    {
      titlePattern: 'Mini limpieza costera en {city}',
      titlePattern_en: 'Mini Coastal Cleanup in {city}',
      titlePattern_de: 'Mini-Küstenreinigung in {city}',
      descPattern: 'Dedica 15 minutos a recolectar plásticos en la costa más cercana a {project}.',
      descPattern_en: 'Spend 15 minutes collecting plastics on the coast nearest to {project}.',
      descPattern_de: 'Verbringe 15 Minuten Plastik an der Küste bei {project} zu sammeln.',
      icon: '🏖️', xpReward: 120, karmaReward: 25, difficulty: 'medium', estimatedMinutes: 20
    },
  ],
  'Comunidad': [
    {
      titlePattern: 'Conéctate con {project}',
      titlePattern_en: 'Connect with {project}',
      titlePattern_de: 'Verbinde dich mit {project}',
      descPattern: 'Visita {project} y pregunta cómo puedes ayudar como voluntario.',
      descPattern_en: 'Visit {project} and ask how you can help as a volunteer.',
      descPattern_de: 'Besuche {project} und frage, wie du als Freiwilliger helfen kannst.',
      icon: '🤝', xpReward: 90, karmaReward: 18, difficulty: 'easy', estimatedMinutes: 15
    },
  ],
  'Educación': [
    {
      titlePattern: 'Comparte conocimiento de {project}',
      titlePattern_en: 'Share knowledge from {project}',
      titlePattern_de: 'Teile Wissen von {project}',
      descPattern: 'Cuéntale a 3 personas lo que hace {project}. ¡Educa e inspira!',
      descPattern_en: 'Tell 3 people about what {project} does. Educate and inspire!',
      descPattern_de: 'Erzähle 3 Personen, was {project} macht. Bilde und inspiriere!',
      icon: '📚', xpReward: 60, karmaReward: 10, difficulty: 'easy', estimatedMinutes: 10
    },
  ],
  'Salud': [
    {
      titlePattern: 'Caminata saludable hacia {project}',
      titlePattern_en: 'Healthy Walk to {project}',
      titlePattern_de: 'Gesunder Spaziergang zu {project}',
      descPattern: 'Camina hasta {project} en vez de usar transporte motorizado. ¡Tu salud y el planeta lo agradecen!',
      descPattern_en: 'Walk to {project} instead of using motorized transport. Your health and the planet thank you!',
      descPattern_de: 'Geh zu Fuß zu {project} statt mit dem Auto. Deine Gesundheit und der Planet danken es dir!',
      icon: '🚶', xpReward: 70, karmaReward: 10, difficulty: 'easy', estimatedMinutes: 30
    },
  ],
  'Tecnología': [
    {
      titlePattern: 'Reto digital en {project}',
      titlePattern_en: 'Digital Challenge at {project}',
      titlePattern_de: 'Digitale Herausforderung bei {project}',
      descPattern: 'Crea un post en redes sociales etiquetando a {project} y contando su impacto.',
      descPattern_en: 'Create a social media post tagging {project} and sharing their impact.',
      descPattern_de: 'Erstelle einen Social-Media-Beitrag und markiere {project} mit ihrem Impact.',
      icon: '💻', xpReward: 55, karmaReward: 8, difficulty: 'easy', estimatedMinutes: 10
    },
  ],
};

/**
 * Calculate distance between two coordinates in km (Haversine formula)
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate nearby eco-missions based on user's location and real project data.
 * If no location is provided, returns global missions from random cities.
 */
export function generateMissions(
  projects: Project[],
  userLat?: number,
  userLng?: number,
  maxResults: number = 12
): EcoMission[] {
  const missions: EcoMission[] = [];
  
  // Sort projects by distance if user location is available
  let sortedProjects = [...projects];
  
  if (userLat !== undefined && userLng !== undefined) {
    sortedProjects = sortedProjects
      .map(p => ({
        ...p,
        distance: haversineDistance(userLat, userLng, p.lat, p.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 30); // Take 30 nearest projects
  } else {
    // Shuffle and take random subset for global missions
    sortedProjects = sortedProjects
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);
  }

  for (const project of sortedProjects) {
    const categoryTemplates = TEMPLATES[project.category];
    if (!categoryTemplates || categoryTemplates.length === 0) continue;

    // Pick a random template for this project
    const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
    const projectName = project.name;
    const cityName = project.city || '';

    const distance =
      userLat !== undefined && userLng !== undefined
        ? haversineDistance(userLat, userLng, project.lat, project.lng)
        : undefined;

    missions.push({
      id: `mission-${project.id}-${template.icon}`,
      title: template.titlePattern.replace('{project}', projectName).replace('{city}', cityName),
      title_en: template.titlePattern_en.replace('{project}', projectName).replace('{city}', cityName),
      title_de: template.titlePattern_de.replace('{project}', projectName).replace('{city}', cityName),
      description: template.descPattern.replace('{project}', projectName).replace('{city}', cityName),
      description_en: template.descPattern_en.replace('{project}', projectName).replace('{city}', cityName),
      description_de: template.descPattern_de.replace('{project}', projectName).replace('{city}', cityName),
      icon: template.icon,
      xpReward: template.xpReward,
      karmaReward: template.karmaReward,
      difficulty: template.difficulty,
      estimatedMinutes: template.estimatedMinutes,
      category: project.category,
      linkedProjectId: project.id,
      linkedProjectName: projectName,
      distanceKm: distance ? Math.round(distance * 10) / 10 : undefined,
      city: project.city,
      country: project.country,
    });

    if (missions.length >= maxResults) break;
  }

  return missions;
}

export const DIFFICULTY_LABELS = {
  easy: { es: 'Fácil', en: 'Easy', de: 'Einfach', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  medium: { es: 'Media', en: 'Medium', de: 'Mittel', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  hard: { es: 'Difícil', en: 'Hard', de: 'Schwer', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
};
