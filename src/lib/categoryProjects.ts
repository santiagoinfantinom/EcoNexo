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
  category: 'Medio ambiente' | 'Educación' | 'Salud' | 'Comunidad' | 'Océanos' | 'Alimentación' | 'Tecnología';
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
        es: '5,000 personas registradas',
        en: '5,000 registered users',
        de: '5.000 registrierte Nutzer'
      }
    }
  ],
  'Salud': [
    {
      id: 'health-1',
      title: {
        es: 'Clínica móvil comunitaria',
        en: 'Community Mobile Clinic',
        de: 'Mobile Gemeinschaftsklinik'
      },
      description: {
        es: 'Servicio médico itinerante que lleva atención sanitaria básica a comunidades desfavorecidas. Incluye chequeos, vacunación y educación preventiva.',
        en: 'Itinerant medical service that brings basic health care to disadvantaged communities. Includes checkups, vaccination and preventive education.',
        de: 'Mobiler medizinischer Dienst, der grundlegende Gesundheitsversorgung in benachteiligte Gemeinden bringt. Inklusive Untersuchungen, Impfungen und Präventionserziehung.'
      },
      category: 'Salud',
      imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Milán, Italia',
        en: 'Milan, Italy',
        de: 'Mailand, Italien'
      },
      city: 'Milán',
      country: 'Italia',
      spots: 12,
      volunteers: 30,
      impact: {
        es: '2,000 pacientes atendidos',
        en: '2,000 patients treated',
        de: '2.000 Patienten behandelt'
      }
    },
    {
      id: 'health-2',
      title: {
        es: 'Programa de Salud Mental',
        en: 'Mental Health Program',
        de: 'Psychische Gesundheitsprogramm'
      },
      description: {
        es: 'Talleres, terapia grupal y acompañamiento comunitario para promover el bienestar mental en zonas urbanas.',
        en: 'Workshops, group therapy and community support to promote mental well-being in urban areas.',
        de: 'Workshops, Gruppentherapie und Gemeinschaftsbetreuung zur Förderung des psychischen Wohlbefindens in städtischen Gebieten.'
      },
      category: 'Salud',
      imageUrl: 'https://images.unsplash.com/photo-1512250341731-1eec352fffd3?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Viena, Austria',
        en: 'Vienna, Austria',
        de: 'Wien, Österreich'
      },
      city: 'Viena',
      country: 'Austria',
      spots: 18,
      volunteers: 40,
      impact: {
        es: '800 personas beneficiadas',
        en: '800 people benefited',
        de: '800 Menschen profitiert'
      }
    },
    {
      id: 'health-3',
      title: {
        es: 'Deporte Inclusivo',
        en: 'Inclusive Sports',
        de: 'Inklusiver Sport'
      },
      description: {
        es: 'Actividades deportivas adaptadas para personas con discapacidades físicas y cognitivas.',
        en: 'Adapted sports activities for people with physical and cognitive disabilities.',
        de: 'Angepasste Sportaktivitäten für Menschen mit körperlichen und kognitiven Behinderungen.'
      },
      category: 'Salud',
      imageUrl: 'https://images.unsplash.com/photo-1521417531039-75822a219b83?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Barcelona, España',
        en: 'Barcelona, Spain',
        de: 'Barcelona, Spanien'
      },
      city: 'Barcelona',
      country: 'España',
      spots: 22,
      volunteers: 55,
      impact: {
        es: '300 deportistas inclusivos',
        en: '300 inclusive athletes',
        de: '300 inklusive Sportler'
      }
    },
    {
      id: 'health-4',
      title: {
        es: 'Nutrición Comunitaria',
        en: 'Community Nutrition',
        de: 'Gemeinschaftsernährung'
      },
      description: {
        es: 'Talleres de cocina saludable y educación nutricional para familias de bajos recursos.',
        en: 'Healthy cooking workshops and nutritional education for low-income families.',
        de: 'Gesunde Kochworkshops und Ernährungsbildung für Familien mit niedrigem Einkommen.'
      },
      category: 'Salud',
      imageUrl: 'https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Roma, Italia',
        en: 'Rome, Italy',
        de: 'Rom, Italien'
      },
      city: 'Roma',
      country: 'Italia',
      spots: 28,
      volunteers: 65,
      impact: {
        es: '1,500 familias educadas',
        en: '1,500 families educated',
        de: '1.500 Familien ausgebildet'
      }
    }
  ],
  'Comunidad': [
    {
      id: 'comm-1',
      title: {
        es: 'Centros vecinales inclusivos',
        en: 'Inclusive Neighborhood Centers',
        de: 'Inklusive Nachbarschaftszentren'
      },
      description: {
        es: 'Espacios comunitarios que fomentan la integración social y el apoyo mutuo entre vecinos.',
        en: 'Community spaces that foster social integration and mutual support among neighbors.',
        de: 'Gemeinschaftsräume, die soziale Integration und gegenseitige Unterstützung unter Nachbarn fördern.'
      },
      category: 'Comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Estocolmo, Suecia',
        en: 'Stockholm, Sweden',
        de: 'Stockholm, Schweden'
      },
      city: 'Estocolmo',
      country: 'Suecia',
      spots: 20,
      volunteers: 50,
      impact: {
        es: '15 centros activos',
        en: '15 active centers',
        de: '15 aktive Zentren'
      }
    },
    {
      id: 'comm-2',
      title: {
        es: 'Red de Apoyo a Refugiados',
        en: 'Refugee Support Network',
        de: 'Flüchtlingsunterstützungsnetzwerk'
      },
      description: {
        es: 'Programa de integración y apoyo para familias refugiadas en comunidades locales.',
        en: 'Integration and support program for refugee families in local communities.',
        de: 'Integrations- und Unterstützungsprogramm für Flüchtlingsfamilien in lokalen Gemeinden.'
      },
      category: 'Comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-5ce2d09da5c1?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Berlín, Alemania',
        en: 'Berlin, Germany',
        de: 'Berlin, Deutschland'
      },
      city: 'Berlín',
      country: 'Alemania',
      spots: 30,
      volunteers: 80,
      impact: {
        es: '200 familias integradas',
        en: '200 families integrated',
        de: '200 Familien integriert'
      }
    },
    {
      id: 'comm-3',
      title: {
        es: 'Festivales Culturales',
        en: 'Cultural Festivals',
        de: 'Kulturfestivals'
      },
      description: {
        es: 'Eventos que celebran la diversidad cultural y promueven la cohesión social.',
        en: 'Events that celebrate cultural diversity and promote social cohesion.',
        de: 'Veranstaltungen, die kulturelle Vielfalt feiern und sozialen Zusammenhalt fördern.'
      },
      category: 'Comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Bruselas, Bélgica',
        en: 'Brussels, Belgium',
        de: 'Brüssel, Belgien'
      },
      city: 'Bruselas',
      country: 'Bélgica',
      spots: 40,
      volunteers: 100,
      impact: {
        es: '50 festivales organizados',
        en: '50 festivals organized',
        de: '50 Festivals organisiert'
      }
    },
    {
      id: 'comm-4',
      title: {
        es: 'Programa de Mentores Juveniles',
        en: 'Youth Mentoring Program',
        de: 'Jugendmentoring-Programm'
      },
      description: {
        es: 'Conecta jóvenes con mentores adultos para orientación académica y profesional.',
        en: 'Connects young people with adult mentors for academic and professional guidance.',
        de: 'Verbindet junge Menschen mit erwachsenen Mentoren für akademische und berufliche Beratung.'
      },
      category: 'Comunidad',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Dublín, Irlanda',
        en: 'Dublin, Ireland',
        de: 'Dublin, Irland'
      },
      city: 'Dublín',
      country: 'Irlanda',
      spots: 25,
      volunteers: 60,
      impact: {
        es: '300 jóvenes mentorizados',
        en: '300 young people mentored',
        de: '300 Jugendliche betreut'
      }
    }
  ],
  'Océanos': [
    {
      id: 'ocean-1',
      title: {
        es: 'Recuperación de playas',
        en: 'Beach Recovery',
        de: 'Strandwiederherstellung'
      },
      description: {
        es: 'Limpieza y restauración de ecosistemas costeros afectados por la contaminación marina.',
        en: 'Cleanup and restoration of coastal ecosystems affected by marine pollution.',
        de: 'Reinigung und Wiederherstellung von Küstenökosystemen, die von Meeresverschmutzung betroffen sind.'
      },
      category: 'Océanos',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Marsella, Francia',
        en: 'Marseille, France',
        de: 'Marseille, Frankreich'
      },
      city: 'Marsella',
      country: 'Francia',
      spots: 35,
      volunteers: 120,
      impact: {
        es: '10 playas restauradas',
        en: '10 beaches restored',
        de: '10 Strände wiederhergestellt'
      }
    },
    {
      id: 'ocean-2',
      title: {
        es: 'Protección de Corales',
        en: 'Coral Protection',
        de: 'Korallenschutz'
      },
      description: {
        es: 'Proyecto de restauración de arrecifes de coral en el Mediterráneo.',
        en: 'Coral reef restoration project in the Mediterranean.',
        de: 'Korallenriff-Wiederherstellungsprojekt im Mittelmeer.'
      },
      category: 'Océanos',
      imageUrl: 'https://images.unsplash.com/photo-1500417148159-68083bd7333a?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Niza, Francia',
        en: 'Nice, France',
        de: 'Nizza, Frankreich'
      },
      city: 'Niza',
      country: 'Francia',
      spots: 15,
      volunteers: 45,
      impact: {
        es: '5 hectáreas de coral protegidas',
        en: '5 hectares of coral protected',
        de: '5 Hektar Korallen geschützt'
      }
    },
    {
      id: 'ocean-3',
      title: {
        es: 'Monitoreo Marino',
        en: 'Marine Monitoring',
        de: 'Meeresüberwachung'
      },
      description: {
        es: 'Ciencia ciudadana para estudiar la biodiversidad marina y el impacto del cambio climático.',
        en: 'Citizen science to study marine biodiversity and the impact of climate change.',
        de: 'Bürgerwissenschaft zur Erforschung der Meeresbiodiversität und der Auswirkungen des Klimawandels.'
      },
      category: 'Océanos',
      imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Valencia, España',
        en: 'Valencia, Spain',
        de: 'Valencia, Spanien'
      },
      city: 'Valencia',
      country: 'España',
      spots: 20,
      volunteers: 60,
      impact: {
        es: '1,000 especies catalogadas',
        en: '1,000 species catalogued',
        de: '1.000 Arten katalogisiert'
      }
    },
    {
      id: 'ocean-4',
      title: {
        es: 'Pesca Sostenible',
        en: 'Sustainable Fishing',
        de: 'Nachhaltige Fischerei'
      },
      description: {
        es: 'Educación sobre prácticas de pesca responsable y conservación marina.',
        en: 'Education on responsible fishing practices and marine conservation.',
        de: 'Bildung über verantwortungsvolle Fischereipraktiken und Meeresschutz.'
      },
      category: 'Océanos',
      imageUrl: 'https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Porto, Portugal',
        en: 'Porto, Portugal',
        de: 'Porto, Portugal'
      },
      city: 'Porto',
      country: 'Portugal',
      spots: 18,
      volunteers: 50,
      impact: {
        es: '200 pescadores capacitados',
        en: '200 fishermen trained',
        de: '200 Fischer ausgebildet'
      }
    }
  ],
  'Alimentación': [
    {
      id: 'food-1',
      title: {
        es: 'Huertos urbanos',
        en: 'Urban Gardens',
        de: 'Städtische Gärten'
      },
      description: {
        es: 'Creación de espacios agrícolas urbanos para promover la alimentación local y sostenible.',
        en: 'Creation of urban agricultural spaces to promote local and sustainable food.',
        de: 'Schaffung städtischer landwirtschaftlicher Räume zur Förderung lokaler und nachhaltiger Ernährung.'
      },
      category: 'Alimentación',
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Londres, Reino Unido',
        en: 'London, United Kingdom',
        de: 'London, Vereinigtes Königreich'
      },
      city: 'Londres',
      country: 'Reino Unido',
      spots: 25,
      volunteers: 70,
      impact: {
        es: '20 huertos urbanos activos',
        en: '20 active urban gardens',
        de: '20 aktive Stadtgärten'
      }
    },
    {
      id: 'food-2',
      title: {
        es: 'Banco de Alimentos',
        en: 'Food Bank',
        de: 'Tafel'
      },
      description: {
        es: 'Redistribución de alimentos excedentes para combatir el desperdicio y la inseguridad alimentaria.',
        en: 'Redistribution of surplus food to combat waste and food insecurity.',
        de: 'Umverteilung von überschüssigen Lebensmitteln zur Bekämpfung von Verschwendung und Ernährungsunsicherheit.'
      },
      category: 'Alimentación',
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Hamburgo, Alemania',
        en: 'Hamburg, Germany',
        de: 'Hamburg, Deutschland'
      },
      city: 'Hamburgo',
      country: 'Alemania',
      spots: 30,
      volunteers: 85,
      impact: {
        es: '5,000 familias alimentadas',
        en: '5,000 families fed',
        de: '5.000 Familien ernährt'
      }
    },
    {
      id: 'food-3',
      title: {
        es: 'Agricultura Regenerativa',
        en: 'Regenerative Agriculture',
        de: 'Regenerative Landwirtschaft'
      },
      description: {
        es: 'Promoción de técnicas agrícolas que restauran la salud del suelo y la biodiversidad.',
        en: 'Promotion of agricultural techniques that restore soil health and biodiversity.',
        de: 'Förderung landwirtschaftlicher Techniken, die die Bodengesundheit und Biodiversität wiederherstellen.'
      },
      category: 'Alimentación',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Bordeaux, Francia',
        en: 'Bordeaux, France',
        de: 'Bordeaux, Frankreich'
      },
      city: 'Bordeaux',
      country: 'Francia',
      spots: 20,
      volunteers: 55,
      impact: {
        es: '100 hectáreas regeneradas',
        en: '100 hectares regenerated',
        de: '100 Hektar regeneriert'
      }
    },
    {
      id: 'food-4',
      title: {
        es: 'Cocina Sostenible',
        en: 'Sustainable Cooking',
        de: 'Nachhaltiges Kochen'
      },
      description: {
        es: 'Talleres de cocina con ingredientes locales y técnicas de reducción de desperdicios.',
        en: 'Cooking workshops with local ingredients and waste reduction techniques.',
        de: 'Kochworkshops mit lokalen Zutaten und Abfallreduktionstechniken.'
      },
      category: 'Alimentación',
      imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Copenhague, Dinamarca',
        en: 'Copenhagen, Denmark',
        de: 'Kopenhagen, Dänemark'
      },
      city: 'Copenhague',
      country: 'Dinamarca',
      spots: 22,
      volunteers: 60,
      impact: {
        es: '800 personas capacitadas',
        en: '800 people trained',
        de: '800 Menschen ausgebildet'
      }
    }
  ],
  'Tecnología': [
    {
      id: 'tech-1',
      title: {
        es: 'Hackathon Verde',
        en: 'Green Hackathon',
        de: 'Grünes Hackathon'
      },
      description: {
        es: 'Hackathon de 48 horas para desarrollar soluciones tecnológicas sostenibles. Incluye talleres de IoT, blockchain y apps de consumo responsable.',
        en: '48-hour hackathon to develop sustainable technological solutions. Includes IoT workshops, blockchain and responsible consumption apps.',
        de: '48-Stunden-Hackathon zur Entwicklung nachhaltiger technologischer Lösungen. Beinhaltet IoT-Workshops, Blockchain und Apps für verantwortungsvollen Konsum.'
      },
      category: 'Tecnología',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Madrid, España',
        en: 'Madrid, Spain',
        de: 'Madrid, Spanien'
      },
      city: 'Madrid',
      country: 'España',
      spots: 100,
      volunteers: 65,
      impact: {
        es: '15 proyectos desarrollados',
        en: '15 projects developed',
        de: '15 entwickelte Projekte'
      }
    },
    {
      id: 'tech-2',
      title: {
        es: 'Laboratorio de Innovación Sostenible',
        en: 'Sustainable Innovation Lab',
        de: 'Nachhaltiges Innovationslabor'
      },
      description: {
        es: 'Espacio colaborativo para desarrollar tecnologías verdes: sensores IoT, apps de economía circular y plataformas de energía renovable.',
        en: 'Collaborative space to develop green technologies: IoT sensors, circular economy apps and renewable energy platforms.',
        de: 'Kollaborativer Raum zur Entwicklung grüner Technologien: IoT-Sensoren, Apps für Kreislaufwirtschaft und Plattformen für erneuerbare Energien.'
      },
      category: 'Tecnología',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Berlín, Alemania',
        en: 'Berlin, Germany',
        de: 'Berlin, Deutschland'
      },
      city: 'Berlín',
      country: 'Alemania',
      spots: 50,
      volunteers: 32,
      impact: {
        es: '20 prototipos creados',
        en: '20 prototypes created',
        de: '20 Prototypen erstellt'
      }
    },
    {
      id: 'tech-3',
      title: {
        es: 'Smart City Lab',
        en: 'Smart City Lab',
        de: 'Smart City Lab'
      },
      description: {
        es: 'Desarrollo de soluciones de ciudad inteligente: gestión de residuos con sensores, optimización de transporte público y eficiencia energética.',
        en: 'Development of smart city solutions: waste management with sensors, public transport optimization and energy efficiency.',
        de: 'Entwicklung von Smart-City-Lösungen: Abfallmanagement mit Sensoren, Optimierung des öffentlichen Verkehrs und Energieeffizienz.'
      },
      category: 'Tecnología',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'Londres, Reino Unido',
        en: 'London, United Kingdom',
        de: 'London, Vereinigtes Königreich'
      },
      city: 'Londres',
      country: 'Reino Unido',
      spots: 40,
      volunteers: 28,
      impact: {
        es: '5 ciudades implementando soluciones',
        en: '5 cities implementing solutions',
        de: '5 Städte implementieren Lösungen'
      }
    },
    {
      id: 'tech-4',
      title: {
        es: 'Blockchain para Transparencia Ambiental',
        en: 'Blockchain for Environmental Transparency',
        de: 'Blockchain für Umwelttransparenz'
      },
      description: {
        es: 'Workshop sobre uso de blockchain para rastrear cadenas de suministro sostenibles y certificaciones ambientales verificables.',
        en: 'Workshop on using blockchain to track sustainable supply chains and verifiable environmental certifications.',
        de: 'Workshop zur Verwendung von Blockchain zur Verfolgung nachhaltiger Lieferketten und überprüfbarer Umweltzertifizierungen.'
      },
      category: 'Tecnología',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
      location: {
        es: 'París, Francia',
        en: 'Paris, France',
        de: 'Paris, Frankreich'
      },
      city: 'París',
      country: 'Francia',
      spots: 25,
      volunteers: 18,
      impact: {
        es: '10 cadenas de suministro rastreadas',
        en: '10 supply chains tracked',
        de: '10 Lieferketten verfolgt'
      }
    }
  ]
};
