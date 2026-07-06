export type ForumTopic = {
  id: string;
  title_es: string;
  title_en: string;
  title_de: string;
  description_es: string;
  description_en: string;
  description_de: string;
  category: string;
  posts: number;
  participants: number;
  lastActivity: string;
};

export const FORUM_TOPICS: ForumTopic[] = [
  {
    id: "1",
    title_es: "Cómo reducir residuos en casa",
    title_en: "How to reduce waste at home",
    title_de: "Wie man Abfall zu Hause reduziert",
    description_es: "Consejos prácticos para minimizar la generación de residuos en el hogar",
    description_en: "Practical tips to minimize waste generation at home",
    description_de: "Praktische Tipps zur Minimierung der Abfallerzeugung zu Hause",
    category: "Medio ambiente",
    posts: 45,
    participants: 23,
    lastActivity: "2026-01-07"
  },
  {
    id: "2",
    title_es: "Mejores prácticas de compostaje urbano",
    title_en: "Best practices for urban composting",
    title_de: "Best Practices für urbanes Kompostieren",
    description_es: "Aprende a compostar en espacios reducidos y apartamentos",
    description_en: "Learn to compost in small spaces and apartments",
    description_de: "Lernen Sie, in kleinen Räumen und Wohnungen zu kompostieren",
    category: "Alimentación",
    posts: 38,
    participants: 19,
    lastActivity: "2026-01-06"
  },
  {
    id: "3",
    title_es: "Energías renovables accesibles",
    title_en: "Accessible renewable energy",
    title_de: "Zugängliche erneuerbare Energien",
    description_es: "Opciones de energía solar y eólica para hogares y comunidades",
    description_en: "Solar and wind energy options for homes and communities",
    description_de: "Solar- und Windenergie-Optionen für Haushalte und Gemeinden",
    category: "Tecnología",
    posts: 52,
    participants: 31,
    lastActivity: "2026-01-07"
  },
  {
    id: "4",
    title_es: "Agricultura urbana y huertos comunitarios",
    title_en: "Urban agriculture and community gardens",
    title_de: "Urbane Landwirtschaft und Gemeinschaftsgärten",
    description_es: "Experiencias y consejos para crear y mantener huertos urbanos",
    description_en: "Experiences and tips for creating and maintaining urban gardens",
    description_de: "Erfahrungen und Tipps zum Anlegen und Pflegen von Stadtgärten",
    category: "Alimentación",
    posts: 67,
    participants: 42,
    lastActivity: "2026-01-07"
  },
  {
    id: "5",
    title_es: "Movilidad sostenible en la ciudad",
    title_en: "Sustainable urban mobility",
    title_de: "Nachhaltige urbane Mobilität",
    description_es: "Bicicletas, transporte público y alternativas ecológicas",
    description_en: "Bicycles, public transport and eco-friendly alternatives",
    description_de: "Fahrräder, öffentliche Verkehrsmittel und umweltfreundliche Alternativen",
    category: "Comunidad",
    posts: 41,
    participants: 27,
    lastActivity: "2026-01-06"
  },
  {
    id: "6",
    title_es: "Conservación de océanos y playas",
    title_en: "Ocean and beach conservation",
    title_de: "Ozean- und Strandschutz",
    description_es: "Iniciativas para proteger ecosistemas marinos y reducir plásticos",
    description_en: "Initiatives to protect marine ecosystems and reduce plastics",
    description_de: "Initiativen zum Schutz mariner Ökosysteme und zur Reduzierung von Plastik",
    category: "Océanos",
    posts: 29,
    participants: 18,
    lastActivity: "2026-01-05"
  },
  {
    id: "7",
    title_es: "Educación ambiental para niños",
    title_en: "Environmental education for children",
    title_de: "Umweltbildung für Kinder",
    description_es: "Recursos y actividades para enseñar sostenibilidad a los más jóvenes",
    description_en: "Resources and activities to teach sustainability to young people",
    description_de: "Ressourcen und Aktivitäten, um jungen Menschen Nachhaltigkeit beizubringen",
    category: "Educación",
    posts: 34,
    participants: 21,
    lastActivity: "2026-01-06"
  },
  {
    id: "8",
    title_es: "Economía circular y reutilización",
    title_en: "Circular economy and reuse",
    title_de: "Kreislaufwirtschaft und Wiederverwendung",
    description_es: "Proyectos de reciclaje creativo y segunda vida de productos",
    description_en: "Creative recycling projects and second life of products",
    description_de: "Kreative Recyclingprojekte und zweites Leben von Produkten",
    category: "Medio ambiente",
    posts: 56,
    participants: 33,
    lastActivity: "2026-01-07"
  }
];
