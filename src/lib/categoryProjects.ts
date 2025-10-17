export interface CategoryProject {
  id: string;
  title: {
    es: string;
    en: string;
    de: string;
  };
  description: {
    es: string;
    en: string;
    de: string;
  };
  category: 'Medio ambiente' | 'Educación' | 'Salud' | 'Comunidad' | 'Océanos' | 'Alimentación';
  imageUrl: string;
  location: {
    es: string;
    en: string;
    de: string;
  };
  city: string;
  country: string;
  spots?: number;
  volunteers?: number;
  impact: {
    es: string;
    en: string;
    de: string;
  };
}

export const categoryProjects: Record<string, CategoryProject[]> = {
  'Medio ambiente': [
    {
      id: 'env-1',
      title: {
        es: 'Reforestación Urbana Berlín',
        en: 'Urban Reforestation Berlin',
        de: 'Städtische Aufforstung Berlin'
      },
      description: {
        es: 'Proyecto de plantación de árboles nativos en parques urbanos para mejorar la calidad del aire y crear corredores verdes.',
        en: 'Native tree planting project in urban parks to improve air quality and create green corridors.',
        de: 'Projekt zur Pflanzung einheimischer Bäume in Stadtparks zur Verbesserung der Luftqualität und Schaffung grüner Korridore.'
      },
      category: 'Medio ambiente',
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Berlín, Alemania',
        en: 'Berlin, Germany',
        de: 'Berlin, Deutschland'
      },
      city: 'Berlín',
      country: 'Alemania',
      spots: 25,
      volunteers: 150,
      impact: {
        es: '2,500 árboles plantados',
        en: '2,500 trees planted',
        de: '2.500 Bäume gepflanzt'
      }
    },
    {
      id: 'env-2',
      title: {
        es: 'Limpieza del Río Sena',
        en: 'Seine River Cleanup',
        de: 'Seine-Reinigung'
      },
      description: {
        es: 'Campaña de limpieza para eliminar plásticos y contaminantes del emblemático río parisino.',
        en: 'Cleanup campaign to eliminate plastics and pollutants from the emblematic Parisian river.',
        de: 'Säuberungskampagne zur Beseitigung von Plastik und Schadstoffen aus dem emblematischen Pariser Fluss.'
      },
      category: 'Medio ambiente',
      imageUrl: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'París, Francia',
        en: 'Paris, France',
        de: 'Paris, Frankreich'
      },
      city: 'París',
      country: 'Francia',
      spots: 40,
      volunteers: 200,
      impact: {
        es: '5 toneladas de residuos recogidos',
        en: '5 tons of waste collected',
        de: '5 Tonnen Abfall gesammelt'
      }
    },
    {
      id: 'env-3',
      title: {
        es: 'Huertos Comunitarios Madrid',
        en: 'Community Gardens Madrid',
        de: 'Gemeinschaftsgärten Madrid'
      },
      description: {
        es: 'Creación de espacios verdes urbanos para agricultura sostenible y educación ambiental.',
        en: 'Creation of urban green spaces for sustainable agriculture and environmental education.',
        de: 'Schaffung städtischer Grünflächen für nachhaltige Landwirtschaft und Umweltbildung.'
      },
      category: 'Medio ambiente',
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Madrid, España',
        en: 'Madrid, Spain',
        de: 'Madrid, Spanien'
      },
      city: 'Madrid',
      country: 'España',
      spots: 30,
      volunteers: 80,
      impact: {
        es: '15 huertos comunitarios activos',
        en: '15 active community gardens',
        de: '15 aktive Gemeinschaftsgärten'
      }
    },
    {
      id: 'env-4',
      title: {
        es: 'Protección de Aves Migratorias',
        en: 'Migratory Bird Protection',
        de: 'Zugvogelschutz'
      },
      description: {
        es: 'Monitoreo y protección de rutas migratorias de aves en el norte de Europa.',
        en: 'Monitoring and protection of bird migration routes in northern Europe.',
        de: 'Überwachung und Schutz von Vogelzugrouten in Nordeuropa.'
      },
      category: 'Medio ambiente',
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Copenhague, Dinamarca',
        en: 'Copenhagen, Denmark',
        de: 'Kopenhagen, Dänemark'
      },
      city: 'Copenhague',
      country: 'Dinamarca',
      spots: 15,
      volunteers: 60,
      impact: {
        es: '500 especies protegidas',
        en: '500 protected species',
        de: '500 geschützte Arten'
      }
    }
  ],
  'Educación': [
    {
      id: 'edu-1',
      title: {
        es: 'Talleres de Robótica Educativa',
        en: 'Educational Robotics Workshops',
        de: 'Bildungsrobotik-Workshops'
      },
      description: {
        es: 'Programa educativo para enseñar robótica y programación a niños y jóvenes usando materiales reciclados.',
        en: 'Educational program to teach robotics and programming to children and youth using recycled materials.',
        de: 'Bildungsprogramm zur Vermittlung von Robotik und Programmierung an Kinder und Jugendliche mit recycelten Materialien.'
      },
      category: 'Educación',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Madrid, España',
        en: 'Madrid, Spain',
        de: 'Madrid, Spanien'
      },
      city: 'Madrid',
      country: 'España',
      spots: 20,
      volunteers: 45,
      impact: {
        es: '300 estudiantes capacitados',
        en: '300 students trained',
        de: '300 Schüler ausgebildet'
      }
    },
    {
      id: 'edu-2',
      title: {
        es: 'Educación Ambiental Escolar',
        en: 'School Environmental Education',
        de: 'Schulische Umweltbildung'
      },
      description: {
        es: 'Programa de sensibilización ambiental en escuelas primarias y secundarias.',
        en: 'Environmental awareness program in primary and secondary schools.',
        de: 'Umweltbewusstseinsprogramm in Grund- und weiterführenden Schulen.'
      },
      category: 'Educación',
      imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Milán, Italia',
        en: 'Milan, Italy',
        de: 'Mailand, Italien'
      },
      city: 'Milán',
      country: 'Italia',
      spots: 35,
      volunteers: 90,
      impact: {
        es: '1,200 estudiantes educados',
        en: '1,200 students educated',
        de: '1.200 Schüler unterrichtet'
      }
    },
    {
      id: 'edu-3',
      title: {
        es: 'Bibliotecas Digitales Rurales',
        en: 'Rural Digital Libraries',
        de: 'Ländliche Digitale Bibliotheken'
      },
      description: {
        es: 'Instalación de puntos de acceso digital en comunidades rurales para reducir la brecha tecnológica.',
        en: 'Installation of digital access points in rural communities to reduce the technology gap.',
        de: 'Installation digitaler Zugangspunkte in ländlichen Gemeinden zur Verringerung der Technologielücke.'
      },
      category: 'Educación',
      imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Lisboa, Portugal',
        en: 'Lisbon, Portugal',
        de: 'Lissabon, Portugal'
      },
      city: 'Lisboa',
      country: 'Portugal',
      spots: 25,
      volunteers: 70,
      impact: {
        es: '50 comunidades conectadas',
        en: '50 communities connected',
        de: '50 Gemeinden verbunden'
      }
    },
    {
      id: 'edu-4',
      title: {
        es: 'Cursos de Sostenibilidad Online',
        en: 'Online Sustainability Courses',
        de: 'Online-Nachhaltigkeitskurse'
      },
      description: {
        es: 'Plataforma educativa gratuita sobre prácticas sostenibles y economía circular.',
        en: 'Free educational platform on sustainable practices and circular economy.',
        de: 'Kostenlose Bildungsplattform für nachhaltige Praktiken und Kreislaufwirtschaft.'
      },
      category: 'Educación',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Ámsterdam, Países Bajos',
        en: 'Amsterdam, Netherlands',
        de: 'Amsterdam, Niederlande'
      },
      city: 'Ámsterdam',
      country: 'Países Bajos',
      spots: 50,
      volunteers: 120,
      impact: {
        es: '5,000 usuarios registrados',
        en: '5,000 registered users',
        de: '5.000 registrierte Nutzer'
      }
    }
  ],
  'Salud': [
    {
      id: 'health-1',
      title: 'Clínica móvil comunitaria',
      description: 'Servicio médico itinerante que lleva atención sanitaria básica a comunidades desfavorecidas. Incluye chequeos, vacunación y educación preventiva.',
      category: 'Salud',
      imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1600&auto=format&fit=crop',
      location: 'Milán, Italia',
      city: 'Milán',
      country: 'Italia',
      spots: 12,
      volunteers: 30,
      impact: '2,000 pacientes atendidos'
    },
    {
      id: 'health-2',
      title: 'Programa de Salud Mental',
      description: 'Talleres, terapia grupal y acompañamiento comunitario para promover el bienestar mental en zonas urbanas.',
      category: 'Salud',
      imageUrl: 'https://images.unsplash.com/photo-1512250341731-1eec352fffd3?q=80&w=1600&auto=format&fit=crop',
      location: 'Viena, Austria',
      city: 'Viena',
      country: 'Austria',
      spots: 18,
      volunteers: 40,
      impact: '800 personas beneficiadas'
    },
    {
      id: 'health-3',
      title: 'Deporte Inclusivo',
      description: 'Actividades deportivas adaptadas para personas con discapacidades físicas y cognitivas.',
      category: 'Salud',
      imageUrl: 'https://images.unsplash.com/photo-1521417531039-75822a219b83?q=80&w=1600&auto=format&fit=crop',
      location: 'Barcelona, España',
      city: 'Barcelona',
      country: 'España',
      spots: 22,
      volunteers: 55,
      impact: '300 deportistas inclusivos'
    },
    {
      id: 'health-4',
      title: 'Nutrición Comunitaria',
      description: 'Talleres de cocina saludable y educación nutricional para familias de bajos recursos.',
      category: 'Salud',
      imageUrl: 'https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?q=80&w=1600&auto=format&fit=crop',
      location: 'Roma, Italia',
      city: 'Roma',
      country: 'Italia',
      spots: 28,
      volunteers: 65,
      impact: '1,500 familias educadas'
    }
  ],
  'Comunidad': [
    {
      id: 'comm-1',
      title: 'Centros vecinales inclusivos',
      description: 'Espacios comunitarios que fomentan la integración social y el apoyo mutuo entre vecinos.',
      category: 'Comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
      location: 'Estocolmo, Suecia',
      city: 'Estocolmo',
      country: 'Suecia',
      spots: 20,
      volunteers: 50,
      impact: '15 centros activos'
    },
    {
      id: 'comm-2',
      title: 'Red de Apoyo a Refugiados',
      description: 'Programa de integración y apoyo para familias refugiadas en comunidades locales.',
      category: 'Comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-5ce2d09da5c1?q=80&w=1600&auto=format&fit=crop',
      location: 'Berlín, Alemania',
      city: 'Berlín',
      country: 'Alemania',
      spots: 30,
      volunteers: 80,
      impact: '200 familias integradas'
    },
    {
      id: 'comm-3',
      title: 'Festivales Culturales',
      description: 'Eventos que celebran la diversidad cultural y promueven la cohesión social.',
      category: 'Comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1600&auto=format&fit=crop',
      location: 'Bruselas, Bélgica',
      city: 'Bruselas',
      country: 'Bélgica',
      spots: 40,
      volunteers: 100,
      impact: '50 festivales organizados'
    },
    {
      id: 'comm-4',
      title: 'Programa de Mentores Juveniles',
      description: 'Conecta jóvenes con mentores adultos para orientación académica y profesional.',
      category: 'Comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop',
      location: 'Dublín, Irlanda',
      city: 'Dublín',
      country: 'Irlanda',
      spots: 25,
      volunteers: 60,
      impact: '300 jóvenes mentorizados'
    }
  ],
  'Océanos': [
    {
      id: 'ocean-1',
      title: 'Recuperación de playas',
      description: 'Limpieza y restauración de ecosistemas costeros afectados por la contaminación marina.',
      category: 'Océanos',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      location: 'Marsella, Francia',
      city: 'Marsella',
      country: 'Francia',
      spots: 35,
      volunteers: 120,
      impact: '10 playas restauradas'
    },
    {
      id: 'ocean-2',
      title: 'Protección de Corales',
      description: 'Proyecto de restauración de arrecifes de coral en el Mediterráneo.',
      category: 'Océanos',
      imageUrl: 'https://images.unsplash.com/photo-1500417148159-68083bd7333a?q=80&w=1600&auto=format&fit=crop',
      location: 'Niza, Francia',
      city: 'Niza',
      country: 'Francia',
      spots: 15,
      volunteers: 45,
      impact: '5 hectáreas de coral protegidas'
    },
    {
      id: 'ocean-3',
      title: 'Monitoreo Marino',
      description: 'Ciencia ciudadana para estudiar la biodiversidad marina y el impacto del cambio climático.',
      category: 'Océanos',
      imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop',
      location: 'Valencia, España',
      city: 'Valencia',
      country: 'España',
      spots: 20,
      volunteers: 60,
      impact: '1,000 especies catalogadas'
    },
    {
      id: 'ocean-4',
      title: 'Pesca Sostenible',
      description: 'Educación sobre prácticas de pesca responsable y conservación marina.',
      category: 'Océanos',
      imageUrl: 'https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?q=80&w=1600&auto=format&fit=crop',
      location: 'Porto, Portugal',
      city: 'Porto',
      country: 'Portugal',
      spots: 18,
      volunteers: 50,
      impact: '200 pescadores capacitados'
    }
  ],
  'Alimentación': [
    {
      id: 'food-1',
      title: 'Huertos urbanos',
      description: 'Creación de espacios agrícolas urbanos para promover la alimentación local y sostenible.',
      category: 'Alimentación',
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1600&auto=format&fit=crop',
      location: 'Londres, Reino Unido',
      city: 'Londres',
      country: 'Reino Unido',
      spots: 25,
      volunteers: 70,
      impact: '20 huertos urbanos activos'
    },
    {
      id: 'food-2',
      title: 'Banco de Alimentos',
      description: 'Redistribución de alimentos excedentes para combatir el desperdicio y la inseguridad alimentaria.',
      category: 'Alimentación',
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop',
      location: 'Hamburgo, Alemania',
      city: 'Hamburgo',
      country: 'Alemania',
      spots: 30,
      volunteers: 85,
      impact: '5,000 familias alimentadas'
    },
    {
      id: 'food-3',
      title: 'Agricultura Regenerativa',
      description: 'Promoción de técnicas agrícolas que restauran la salud del suelo y la biodiversidad.',
      category: 'Alimentación',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
      location: 'Bordeaux, Francia',
      city: 'Bordeaux',
      country: 'Francia',
      spots: 20,
      volunteers: 55,
      impact: '100 hectáreas regeneradas'
    },
    {
      id: 'food-4',
      title: 'Cocina Sostenible',
      description: 'Talleres de cocina con ingredientes locales y técnicas de reducción de desperdicios.',
      category: 'Alimentación',
      imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop',
      location: 'Copenhague, Dinamarca',
      city: 'Copenhague',
      country: 'Dinamarca',
      spots: 22,
      volunteers: 60,
      impact: '800 personas capacitadas'
    }
  ]
};
