export interface CategoryProject {
  id: string;
  title: string;
  description: string;
  category: 'Medio ambiente' | 'Educación' | 'Salud' | 'Comunidad' | 'Océanos' | 'Alimentación';
  imageUrl: string;
  location: string;
  city: string;
  country: string;
  spots?: number;
  volunteers?: number;
  impact: string;
}

export const categoryProjects: Record<string, CategoryProject[]> = {
  'Medio ambiente': [
    {
      id: 'env-1',
      title: 'Reforestación Urbana Berlín',
      description: 'Proyecto de plantación de árboles nativos en parques urbanos para mejorar la calidad del aire y crear corredores verdes.',
      category: 'Medio ambiente',
      imageUrl: '/images/projects/reforestacion-berlin.jpg',
      location: 'Berlín, Alemania',
      city: 'Berlín',
      country: 'Alemania',
      spots: 25,
      volunteers: 150,
      impact: '2,500 árboles plantados'
    },
    {
      id: 'env-2',
      title: 'Limpieza del Río Sena',
      description: 'Campaña de limpieza para eliminar plásticos y contaminantes del emblemático río parisino.',
      category: 'Medio ambiente',
      imageUrl: '/images/projects/limpieza-sena.jpg',
      location: 'París, Francia',
      city: 'París',
      country: 'Francia',
      spots: 40,
      volunteers: 200,
      impact: '5 toneladas de residuos recogidos'
    },
    {
      id: 'env-3',
      title: 'Huertos Comunitarios Madrid',
      description: 'Creación de espacios verdes urbanos para agricultura sostenible y educación ambiental.',
      category: 'Medio ambiente',
      imageUrl: '/images/projects/huertos-madrid.jpg',
      location: 'Madrid, España',
      city: 'Madrid',
      country: 'España',
      spots: 30,
      volunteers: 80,
      impact: '15 huertos comunitarios activos'
    },
    {
      id: 'env-4',
      title: 'Protección de Aves Migratorias',
      description: 'Monitoreo y protección de rutas migratorias de aves en el norte de Europa.',
      category: 'Medio ambiente',
      imageUrl: '/images/projects/aves-migratorias.jpg',
      location: 'Copenhague, Dinamarca',
      city: 'Copenhague',
      country: 'Dinamarca',
      spots: 15,
      volunteers: 60,
      impact: '500 especies protegidas'
    }
  ],
  'Educación': [
    {
      id: 'edu-1',
      title: 'Talleres de Robótica Educativa',
      description: 'Programa educativo para enseñar robótica y programación a niños y jóvenes usando materiales reciclados.',
      category: 'Educación',
      imageUrl: '/images/projects/robotica-educativa.jpg',
      location: 'Madrid, España',
      city: 'Madrid',
      country: 'España',
      spots: 20,
      volunteers: 45,
      impact: '300 estudiantes capacitados'
    },
    {
      id: 'edu-2',
      title: 'Educación Ambiental Escolar',
      description: 'Programa de sensibilización ambiental en escuelas primarias y secundarias.',
      category: 'Educación',
      imageUrl: '/images/projects/educacion-ambiental.jpg',
      location: 'Milán, Italia',
      city: 'Milán',
      country: 'Italia',
      spots: 35,
      volunteers: 90,
      impact: '1,200 estudiantes educados'
    },
    {
      id: 'edu-3',
      title: 'Bibliotecas Digitales Rurales',
      description: 'Instalación de puntos de acceso digital en comunidades rurales para reducir la brecha tecnológica.',
      category: 'Educación',
      imageUrl: '/images/projects/bibliotecas-digitales.jpg',
      location: 'Lisboa, Portugal',
      city: 'Lisboa',
      country: 'Portugal',
      spots: 25,
      volunteers: 70,
      impact: '50 comunidades conectadas'
    },
    {
      id: 'edu-4',
      title: 'Cursos de Sostenibilidad Online',
      description: 'Plataforma educativa gratuita sobre prácticas sostenibles y economía circular.',
      category: 'Educación',
      imageUrl: '/images/projects/cursos-sostenibilidad.jpg',
      location: 'Ámsterdam, Países Bajos',
      city: 'Ámsterdam',
      country: 'Países Bajos',
      spots: 50,
      volunteers: 120,
      impact: '5,000 usuarios registrados'
    }
  ],
  'Salud': [
    {
      id: 'health-1',
      title: 'Clínica móvil comunitaria',
      description: 'Servicio médico itinerante que lleva atención sanitaria básica a comunidades desfavorecidas.',
      category: 'Salud',
      imageUrl: '/images/projects/clinica-movil.jpg',
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
      description: 'Talleres y terapia grupal para promover el bienestar mental en comunidades urbanas.',
      category: 'Salud',
      imageUrl: '/images/projects/salud-mental.jpg',
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
      imageUrl: '/images/projects/deporte-inclusivo.jpg',
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
      imageUrl: '/images/projects/nutricion-comunitaria.jpg',
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
      imageUrl: '/images/projects/centros-vecinales.jpg',
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
      imageUrl: '/images/projects/apoyo-refugiados.jpg',
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
      imageUrl: '/images/projects/festivales-culturales.jpg',
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
      imageUrl: '/images/projects/mentores-juveniles.jpg',
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
      imageUrl: '/images/projects/recuperacion-playas.jpg',
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
      imageUrl: '/images/projects/proteccion-corales.jpg',
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
      imageUrl: '/images/projects/monitoreo-marino.jpg',
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
      imageUrl: '/images/projects/pesca-sostenible.jpg',
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
      imageUrl: '/images/projects/huertos-urbanos.jpg',
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
      imageUrl: '/images/projects/banco-alimentos.jpg',
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
      imageUrl: '/images/projects/agricultura-regenerativa.jpg',
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
      imageUrl: '/images/projects/cocina-sostenible.jpg',
      location: 'Copenhague, Dinamarca',
      city: 'Copenhague',
      country: 'Dinamarca',
      spots: 22,
      volunteers: 60,
      impact: '800 personas capacitadas'
    }
  ]
};
