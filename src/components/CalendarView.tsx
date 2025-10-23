"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useGlobalConfig } from "@/hooks/useGlobalConfig";
import { BaseCard, BaseButton, BaseSelect, BaseTitle, BaseFilterPanel, BaseEmptyState, BaseLabel, BaseInput } from "@/components/ui";
import Link from "next/link";

type CalendarViewProps = {
  projects: any[];
  onProjectSelect: (project: any) => void;
};

export default function CalendarView({ projects, onProjectSelect }: CalendarViewProps) {
  const { t, locale } = useI18n();
  const { 
    getCardClasses, 
    getButtonClasses, 
    getInputClasses, 
    getTitleClasses, 
    getNavigationClasses,
    getCalendarClasses,
    getFilterClasses,
    getEventClasses,
    getEmptyClasses,
    combineClasses
  } = useGlobalConfig();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [monthCategory, setMonthCategory] = useState<'' | 'environment' | 'education' | 'community'>('');
  
  // Filter states for list view
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    dateRange: '',
    spotsAvailable: false,
    searchText: ''
  });

  // Mock events data - localized based on current locale (2025)
  const mockEvents = [
    // January 2025
    {
      id: 'e1',
      projectId: 'p1',
      title: locale === 'de' ? 'Einheimische Baumpflanzung' : 'Native tree planting',
      date: new Date(2025, 0, 15), // January 15, 2025
      time: '09:00',
      duration: 3,
      spots: 30,
      registered: 12,
      location: locale === 'es' ? 'Bosque Urbano Norte, Berlín' :
                locale === 'de' ? 'Stadtwald Nord, Berlin' : 'North Urban Forest, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Green City Initiative' : locale === 'de' ? 'Grüne Stadt Initiative' : 'Green City Initiative'
    },
    {
      id: 'e2',
      projectId: 'p2',
      title: locale === 'de' ? 'Solar-Energie Workshop' : 'Solar energy workshop',
      date: new Date(2025, 0, 22), // January 22, 2025
      time: '14:00',
      duration: 3,
      spots: 20,
      registered: 15,
      location: locale === 'es' ? 'Centro de Innovación Verde, Madrid' :
                locale === 'de' ? 'Grünes Innovationszentrum, Madrid' : 'Green Innovation Center, Madrid',
      category: 'education',
      organizer: locale === 'es' ? 'SolarTech Academy' : locale === 'de' ? 'SolarTech Akademie' : 'SolarTech Academy'
    },
    {
      id: 'e1b',
      projectId: 'p2',
      title: locale === 'es' ? 'Taller de reciclaje creativo' :
             locale === 'de' ? 'Kreatives Recycling-Workshop' : 'Creative recycling workshop',
      date: new Date(2025, 0, 3), // January 3, 2025
      time: '15:00',
      duration: 2,
      spots: 25,
      registered: 18,
      location: locale === 'es' ? 'Centro de Arte Verde, Madrid' :
                locale === 'de' ? 'Grünes Kunstzentrum, Madrid' : 'Green Art Center, Madrid',
      category: 'education',
      organizer: locale === 'es' ? 'Arte Sostenible' : locale === 'de' ? 'Nachhaltige Kunst' : 'Sustainable Art'
    },
    {
      id: 'e1c',
      projectId: 'p3',
      title: locale === 'es' ? 'Caminata ecológica matutina' :
             locale === 'de' ? 'Morgendlicher Öko-Spaziergang' : 'Morning eco-walk',
      date: new Date(2025, 0, 7), // January 7, 2025
      time: '08:00',
      duration: 2,
      spots: 20,
      registered: 14,
      location: locale === 'es' ? 'Parque Central, Barcelona' :
                locale === 'de' ? 'Zentralpark, Barcelona' : 'Central Park, Barcelona',
      category: 'community',
      organizer: locale === 'es' ? 'Caminantes Verdes' : locale === 'de' ? 'Grüne Wanderer' : 'Green Walkers'
    },
    {
      id: 'e1d',
      projectId: 'p4',
      title: locale === 'es' ? 'Instalación de paneles solares' :
             locale === 'de' ? 'Solarpanel-Installation' : 'Solar panel installation',
      date: new Date(2025, 0, 12), // January 12, 2025
      time: '10:00',
      duration: 4,
      spots: 15,
      registered: 11,
      location: locale === 'es' ? 'Escuela Verde, Milán' :
                locale === 'de' ? 'Grüne Schule, Mailand' : 'Green School, Milan',
      category: 'environment',
      organizer: locale === 'es' ? 'Solar Community' : locale === 'de' ? 'Solar-Gemeinschaft' : 'Solar Community'
    },
    {
      id: 'e1e',
      projectId: 'p5',
      title: locale === 'es' ? 'Conferencia sobre cambio climático' :
             locale === 'de' ? 'Klimawandel-Konferenz' : 'Climate change conference',
      date: new Date(2025, 0, 18), // January 18, 2025
      time: '18:00',
      duration: 2,
      spots: 100,
      registered: 75,
      location: locale === 'es' ? 'Auditorio Municipal, París' :
                locale === 'de' ? 'Stadtauditorium, Paris' : 'City Auditorium, Paris',
      category: 'education',
      organizer: locale === 'es' ? 'Instituto Climático' : locale === 'de' ? 'Klimainstitut' : 'Climate Institute'
    },
    {
      id: 'e1f',
      projectId: 'p6',
      title: locale === 'es' ? 'Mercado de productos orgánicos' :
             locale === 'de' ? 'Bio-Produktmarkt' : 'Organic products market',
      date: new Date(2025, 0, 25), // January 25, 2025
      time: '11:00',
      duration: 5,
      spots: 50,
      registered: 35,
      location: locale === 'es' ? 'Plaza Orgánica, Londres' :
                locale === 'de' ? 'Bio-Platz, London' : 'Organic Square, London',
      category: 'community',
      organizer: locale === 'es' ? 'Productos Orgánicos' : locale === 'de' ? 'Bio-Produkte' : 'Organic Products'
    },
    {
      id: 'e1g',
      projectId: 'p1',
      title: locale === 'es' ? 'Limpieza de playa' :
             locale === 'de' ? 'Strandreinigung' : 'Beach cleanup',
      date: new Date(2025, 0, 28), // January 28, 2025
      time: '09:30',
      duration: 3,
      spots: 40,
      registered: 28,
      location: locale === 'es' ? 'Playa Verde, Berlín' :
                locale === 'de' ? 'Grüner Strand, Berlin' : 'Green Beach, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Guardianes del Mar' : locale === 'de' ? 'Meeresschützer' : 'Ocean Guardians'
    },

    // February 2025
    {
      id: 'e3',
      projectId: 'p3',
      title: locale === 'es' ? 'Mercado de productos locales' :
             locale === 'de' ? 'Lokaler Produktmarkt' : 'Local products market',
      date: new Date(2025, 1, 8), // February 8, 2025
      time: '10:00',
      duration: 6,
      spots: 40,
      registered: 25,
      location: locale === 'es' ? 'Plaza del Mercado, Barcelona' :
                locale === 'de' ? 'Marktplatz, Barcelona' : 'Market Square, Barcelona',
      category: 'community',
      organizer: locale === 'es' ? 'Asociación de Productores Locales' : locale === 'de' ? 'Vereinigung lokaler Produzenten' : 'Local Producers Association'
    },
    {
      id: 'e4',
      projectId: 'p4',
      title: locale === 'de' ? 'Flussreinigung' : 'River cleanup',
      date: new Date(2025, 1, 14), // February 14, 2025
      time: '08:00',
      duration: 3,
      spots: 25,
      registered: 18,
      location: locale === 'es' ? 'Río Verde, Milán' :
                locale === 'de' ? 'Grüner Fluss, Mailand' : 'Green River, Milan',
      category: 'environment',
      organizer: locale === 'es' ? 'Guardianes del Río' : locale === 'de' ? 'Flusswächter' : 'River Guardians'
    },
    {
      id: 'e3b',
      projectId: 'p1',
      title: locale === 'es' ? 'Taller de jardinería urbana' :
             locale === 'de' ? 'Städtischer Gartenbau-Workshop' : 'Urban gardening workshop',
      date: new Date(2025, 1, 2), // February 2, 2025
      time: '14:00',
      duration: 3,
      spots: 20,
      registered: 16,
      location: locale === 'es' ? 'Jardín Comunitario, Berlín' :
                locale === 'de' ? 'Gemeinschaftsgarten, Berlin' : 'Community Garden, Berlin',
      category: 'education',
      organizer: locale === 'es' ? 'Jardineros Urbanos' : locale === 'de' ? 'Städtische Gärtner' : 'Urban Gardeners'
    },
    {
      id: 'e3c',
      projectId: 'p2',
      title: locale === 'es' ? 'Carrera solidaria por el medio ambiente' :
             locale === 'de' ? 'Umwelt-Solidaritätslauf' : 'Environmental solidarity run',
      date: new Date(2025, 1, 5), // February 5, 2025
      time: '10:00',
      duration: 2,
      spots: 100,
      registered: 85,
      location: locale === 'es' ? 'Parque del Retiro, Madrid' :
                locale === 'de' ? 'Retiro-Park, Madrid' : 'Retiro Park, Madrid',
      category: 'community',
      organizer: locale === 'es' ? 'Corredores Verdes' : locale === 'de' ? 'Grüne Läufer' : 'Green Runners'
    },
    {
      id: 'e3d',
      projectId: 'p4',
      title: locale === 'es' ? 'Construcción de hoteles para insectos' :
             locale === 'de' ? 'Insektenhotel-Bau' : 'Insect hotel building',
      date: new Date(2025, 1, 12), // February 12, 2025
      time: '16:00',
      duration: 2,
      spots: 15,
      registered: 12,
      location: locale === 'es' ? 'Parque Natural, Milán' :
                locale === 'de' ? 'Naturpark, Mailand' : 'Nature Park, Milan',
      category: 'environment',
      organizer: locale === 'es' ? 'Protectores de Insectos' : locale === 'de' ? 'Insektenschützer' : 'Insect Protectors'
    },
    {
      id: 'e3e',
      projectId: 'p5',
      title: locale === 'es' ? 'Seminario de energía renovable' :
             locale === 'de' ? 'Erneuerbare Energien-Seminar' : 'Renewable energy seminar',
      date: new Date(2025, 1, 16), // February 16, 2025
      time: '19:00',
      duration: 2,
      spots: 60,
      registered: 45,
      location: locale === 'es' ? 'Centro de Energía, París' :
                locale === 'de' ? 'Energiezentrum, Paris' : 'Energy Center, Paris',
      category: 'education',
      organizer: locale === 'es' ? 'Energía Verde' : locale === 'de' ? 'Grüne Energie' : 'Green Energy'
    },
    {
      id: 'e3f',
      projectId: 'p6',
      title: locale === 'es' ? 'Festival de comida vegana' :
             locale === 'de' ? 'Veganes Essensfestival' : 'Vegan food festival',
      date: new Date(2025, 1, 20), // February 20, 2025
      time: '12:00',
      duration: 6,
      spots: 200,
      registered: 150,
      location: locale === 'es' ? 'Plaza de la Alimentación, Londres' :
                locale === 'de' ? 'Ernährungsplatz, London' : 'Food Square, London',
      category: 'community',
      organizer: locale === 'es' ? 'Veganos Unidos' : locale === 'de' ? 'Vereinte Veganer' : 'United Vegans'
    },
    {
      id: 'e3g',
      projectId: 'p1',
      title: locale === 'es' ? 'Monitoreo de calidad del aire' :
             locale === 'de' ? 'Luftqualitätsüberwachung' : 'Air quality monitoring',
      date: new Date(2025, 1, 26), // February 26, 2025
      time: '13:00',
      duration: 3,
      spots: 12,
      registered: 9,
      location: locale === 'es' ? 'Distrito Industrial, Berlín' :
                locale === 'de' ? 'Industriegebiet, Berlin' : 'Industrial District, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Aire Limpio' : locale === 'de' ? 'Saubere Luft' : 'Clean Air'
    },

    // March 2025
    {
      id: 'e5',
      projectId: 'p5',
      title: locale === 'de' ? 'Klimawandel-Konferenz' : 'Climate change conference',
      date: new Date(2025, 2, 5), // March 5, 2025
      time: '18:00',
      duration: 2,
      spots: 200,
      registered: 150,
      location: locale === 'es' ? 'Auditorio Municipal, París' :
                locale === 'de' ? 'Stadtauditorium, Paris' : 'City Auditorium, Paris',
      category: 'education',
      organizer: locale === 'es' ? 'Instituto Climático Local' : locale === 'de' ? 'Lokales Klimainstitut' : 'Local Climate Institute'
    },
    {
      id: 'e6',
      projectId: 'p6',
      title: locale === 'de' ? 'Vertikale Gartenbau' : 'Vertical garden building',
      date: new Date(2025, 2, 18), // March 18, 2025
      time: '10:00',
      duration: 5,
      spots: 15,
      registered: 8,
      location: locale === 'es' ? 'Edificio Comercial Centro, Londres' :
                locale === 'de' ? 'Zentrum Geschäftsgebäude, London' : 'Downtown Commercial Building, London',
      category: 'environment',
      organizer: locale === 'es' ? 'Urban Green Solutions' : locale === 'de' ? 'Städtische Grüne Lösungen' : 'Urban Green Solutions'
    },
    {
      id: 'e5b',
      projectId: 'p1',
      title: locale === 'es' ? 'Plantación de árboles nativos' :
             locale === 'de' ? 'Einheimische Baumpflanzung' : 'Native tree planting',
      date: new Date(2025, 2, 1), // March 1, 2025
      time: '09:00',
      duration: 4,
      spots: 35,
      registered: 28,
      location: locale === 'es' ? 'Bosque Urbano, Berlín' :
                locale === 'de' ? 'Stadtwald, Berlin' : 'Urban Forest, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Plantadores Verdes' : locale === 'de' ? 'Grüne Pflanzer' : 'Green Planters'
    },
    {
      id: 'e5c',
      projectId: 'p2',
      title: locale === 'es' ? 'Taller de energía eólica' :
             locale === 'de' ? 'Windenergie-Workshop' : 'Wind energy workshop',
      date: new Date(2025, 2, 8), // March 8, 2025
      time: '16:00',
      duration: 3,
      spots: 25,
      registered: 20,
      location: locale === 'es' ? 'Centro de Energías Renovables, Madrid' :
                locale === 'de' ? 'Zentrum für erneuerbare Energien, Madrid' : 'Renewable Energy Center, Madrid',
      category: 'education',
      organizer: locale === 'es' ? 'Energía Eólica' : locale === 'de' ? 'Windenergie' : 'Wind Energy'
    },
    {
      id: 'e5d',
      projectId: 'p3',
      title: locale === 'es' ? 'Mercado de productos de temporada' :
             locale === 'de' ? 'Saisonproduktmarkt' : 'Seasonal products market',
      date: new Date(2025, 2, 12), // March 12, 2025
      time: '10:00',
      duration: 6,
      spots: 60,
      registered: 45,
      location: locale === 'es' ? 'Plaza de la Temporada, Barcelona' :
                locale === 'de' ? 'Saisonplatz, Barcelona' : 'Season Square, Barcelona',
      category: 'community',
      organizer: locale === 'es' ? 'Productores de Temporada' : locale === 'de' ? 'Saisonproduzenten' : 'Seasonal Producers'
    },
    {
      id: 'e5e',
      projectId: 'p4',
      title: locale === 'es' ? 'Construcción de jardines verticales' :
             locale === 'de' ? 'Vertikale Gartenbau' : 'Vertical garden building',
      date: new Date(2025, 2, 15), // March 15, 2025
      time: '11:00',
      duration: 4,
      spots: 18,
      registered: 14,
      location: locale === 'es' ? 'Edificio Comercial, Milán' :
                locale === 'de' ? 'Geschäftsgebäude, Mailand' : 'Commercial Building, Milan',
      category: 'environment',
      organizer: locale === 'es' ? 'Jardines Verticales' : locale === 'de' ? 'Vertikale Gärten' : 'Vertical Gardens'
    },
    {
      id: 'e5f',
      projectId: 'p6',
      title: locale === 'es' ? 'Cena comunitaria sostenible' :
             locale === 'de' ? 'Nachhaltiges Gemeinschaftsessen' : 'Sustainable community dinner',
      date: new Date(2025, 2, 22), // March 22, 2025
      time: '19:00',
      duration: 3,
      spots: 80,
      registered: 65,
      location: locale === 'es' ? 'Restaurante Verde, Londres' :
                locale === 'de' ? 'Grünes Restaurant, London' : 'Green Restaurant, London',
      category: 'community',
      organizer: locale === 'es' ? 'Cena Sostenible' : locale === 'de' ? 'Nachhaltiges Essen' : 'Sustainable Dining'
    },
    {
      id: 'e5g',
      projectId: 'p1',
      title: locale === 'es' ? 'Monitoreo de biodiversidad' :
             locale === 'de' ? 'Biodiversitätsüberwachung' : 'Biodiversity monitoring',
      date: new Date(2025, 2, 28), // March 28, 2025
      time: '07:00',
      duration: 4,
      spots: 15,
      registered: 12,
      location: locale === 'es' ? 'Reserva Natural, Berlín' :
                locale === 'de' ? 'Naturschutzgebiet, Berlin' : 'Nature Reserve, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Biodiversidad Verde' : locale === 'de' ? 'Grüne Biodiversität' : 'Green Biodiversity'
    },

    // April 2025
    {
      id: 'e7',
      projectId: 'p1',
      title: locale === 'es' ? 'Taller de compostaje' :
             locale === 'de' ? 'Kompostierungs-Workshop' : 'Composting workshop',
      date: new Date(2025, 3, 12), // April 12, 2025
      time: '15:00',
      duration: 2,
      spots: 20,
      registered: 16,
      location: locale === 'es' ? 'Jardín Comunitario Sur, Berlín' :
                locale === 'de' ? 'Südlicher Gemeinschaftsgarten, Berlin' : 'South Community Garden, Berlin',
      category: 'education',
      organizer: locale === 'es' ? 'Compost Masters' : locale === 'de' ? 'Kompost-Meister' : 'Compost Masters'
    },
    {
      id: 'e8',
      projectId: 'p2',
      title: locale === 'de' ? 'Ökologischer 5K-Lauf' : 'Eco-friendly 5K run',
      date: new Date(2025, 3, 22), // April 22, 2025 (Earth Day)
      time: '08:00',
      duration: 2,
      spots: 100,
      registered: 75,
      location: locale === 'es' ? 'Parque Central, Madrid' :
                locale === 'de' ? 'Zentralpark, Madrid' : 'Central Park, Madrid',
      category: 'community',
      organizer: locale === 'es' ? 'Runners Verdes' : locale === 'de' ? 'Grüne Läufer' : 'Green Runners'
    },

    // May 2025
    {
      id: 'e9',
      projectId: 'p3',
      title: locale === 'de' ? 'Solarpanel-Installation' : 'Solar panel installation',
      date: new Date(2025, 4, 10), // May 10, 2025
      time: '09:00',
      duration: 7,
      spots: 12,
      registered: 9,
      location: locale === 'es' ? 'Escuela Primaria Verde, Barcelona' :
                locale === 'de' ? 'Grüne Grundschule, Barcelona' : 'Green Elementary School, Barcelona',
      category: 'environment',
      organizer: locale === 'es' ? 'Solar Community' : locale === 'de' ? 'Solar-Gemeinschaft' : 'Solar Community'
    },
    {
      id: 'e10',
      projectId: 'p4',
      title: locale === 'es' ? 'Festival de sostenibilidad' :
             locale === 'de' ? 'Nachhaltigkeitsfestival' : 'Sustainability festival',
      date: new Date(2025, 4, 25), // May 25, 2025
      time: '16:00',
      duration: 6,
      spots: 200,
      registered: 120,
      location: locale === 'es' ? 'Centro Cultural, Milán' :
                locale === 'de' ? 'Kulturzentrum, Mailand' : 'Cultural Center, Milan',
      category: 'community',
      organizer: locale === 'es' ? 'Festival Verde' : locale === 'de' ? 'Grünes Festival' : 'Green Festival'
    },

    // June 2025
    {
      id: 'e11',
      projectId: 'p5',
      title: locale === 'es' ? 'Monitoreo de calidad del aire' :
             locale === 'de' ? 'Luftqualitätsüberwachung' : 'Air quality monitoring',
      date: new Date(2025, 5, 8), // June 8, 2025
      time: '13:00',
      duration: 4,
      spots: 8,
      registered: 6,
      location: locale === 'es' ? 'Distrito Industrial, París' :
                locale === 'de' ? 'Industriegebiet, Paris' : 'Industrial District, Paris',
      category: 'environment',
      organizer: locale === 'es' ? 'Aire Limpio' : locale === 'de' ? 'Saubere Luft' : 'Clean Air'
    },
    {
      id: 'e12',
      projectId: 'p6',
      title: locale === 'es' ? 'Cena vegana comunitaria' :
             locale === 'de' ? 'Gemeinschaftliches veganes Abendessen' : 'Community vegan dinner',
      date: new Date(2025, 5, 21), // June 21, 2025 (Summer Solstice)
      time: '19:00',
      duration: 2,
      spots: 50,
      registered: 35,
      location: locale === 'es' ? 'Restaurante Verde, Londres' :
                locale === 'de' ? 'Grünes Restaurant, London' : 'Green Restaurant, London',
      category: 'community',
      organizer: locale === 'es' ? 'Veganos Unidos' : locale === 'de' ? 'Vereinte Veganer' : 'United Vegans'
    },

    // July 2025
    {
      id: 'e13',
      projectId: 'p1',
      title: locale === 'de' ? 'Halbjährliche Umweltreflexion' : 'Semi-annual environmental reflection',
      date: new Date(2025, 6, 15), // July 15, 2025
      time: '17:00',
      duration: 2,
      spots: 40,
      registered: 28,
      location: locale === 'es' ? 'Biblioteca Pública, Berlín' :
                locale === 'de' ? 'Öffentliche Bibliothek, Berlin' : 'Public Library, Berlin',
      category: 'education',
      organizer: locale === 'es' ? 'Futuro Verde' : locale === 'de' ? 'Grüne Zukunft' : 'Green Future'
    },
    {
      id: 'e14',
      projectId: 'p2',
      title: locale === 'de' ? 'Nachhaltige Sommerfeier' : 'Sustainable summer celebration',
      date: new Date(2025, 6, 30), // July 30, 2025
      time: '20:00',
      duration: 4,
      spots: 150,
      registered: 90,
      location: locale === 'es' ? 'Plaza Principal, Madrid' :
                locale === 'de' ? 'Hauptplatz, Madrid' : 'Main Square, Madrid',
      category: 'community',
      organizer: locale === 'es' ? 'Verano Verde' : locale === 'de' ? 'Grüner Sommer' : 'Green Summer'
    },

    // October 2025
    {
      id: 'e15',
      projectId: 'p3',
      title: locale === 'de' ? 'Herbstpflanzung' : 'Autumn planting',
      date: new Date(2025, 9, 5), // October 5, 2025
      time: '10:00',
      duration: 4,
      spots: 25,
      registered: 18,
      location: locale === 'es' ? 'Parque del Otoño, Barcelona' :
                locale === 'de' ? 'Herbstpark, Barcelona' : 'Autumn Park, Barcelona',
      category: 'environment',
      organizer: locale === 'es' ? 'Plantadores del Otoño' : locale === 'de' ? 'Herbstpflanzer' : 'Autumn Planters'
    },
    // Extra October events to show immediately
    {
      id: 'e15b',
      projectId: 'p2',
      title: locale === 'es' ? 'Ruta en bici por carriles verdes' :
             locale === 'de' ? 'Radtour auf grünen Wegen' : 'Bike tour on green lanes',
      date: new Date(2025, 9, 8), // October 8, 2025 (Wed)
      time: '17:30',
      duration: 2,
      spots: 25,
      registered: 14,
      location: locale === 'es' ? 'Parque del Río, Madrid' :
                locale === 'de' ? 'Flusspark, Madrid' : 'River Park, Madrid',
      category: 'community',
      organizer: locale === 'es' ? 'Ciclistas Verdes' : locale === 'de' ? 'Grüne Radler' : 'Green Cyclists'
    },
    {
      id: 'e16b',
      projectId: 'p1',
      title: locale === 'es' ? 'Taller de compost en casa' :
             locale === 'de' ? 'Kompostieren zu Hause Workshop' : 'Home composting workshop',
      date: new Date(2025, 9, 15), // October 15, 2025 (Wed)
      time: '18:00',
      duration: 2,
      spots: 20,
      registered: 11,
      location: locale === 'es' ? 'Centro Vecinal, Berlín' :
                locale === 'de' ? 'Nachbarschaftszentrum, Berlin' : 'Community Center, Berlin',
      category: 'education',
      organizer: locale === 'es' ? 'Compost Masters' : locale === 'de' ? 'Kompost-Meister' : 'Compost Masters'
    },
    {
      id: 'e17b',
      projectId: 'p4',
      title: locale === 'es' ? 'Poda urbana responsable' :
             locale === 'de' ? 'Verantwortungsvoller Stadtbaumschnitt' : 'Responsible urban pruning',
      date: new Date(2025, 9, 29), // October 29, 2025 (Wed)
      time: '09:30',
      duration: 3,
      spots: 18,
      registered: 9,
      location: locale === 'es' ? 'Avenida Verde, Milán' :
                locale === 'de' ? 'Grüne Allee, Mailand' : 'Green Avenue, Milan',
      category: 'environment',
      organizer: locale === 'es' ? 'Arboristas Urbanos' : locale === 'de' ? 'Städtische Arboristen' : 'Urban Arborists'
    },
    {
      id: 'e16',
      projectId: 'p4',
      title: locale === 'de' ? 'Lebensmittelkonservierungsworkshop' : 'Food preservation workshop',
      date: new Date(2025, 9, 12), // October 12, 2025
      time: '14:00',
      duration: 3,
      spots: 20,
      registered: 15,
      location: locale === 'es' ? 'Centro Culinario Verde, Milán' :
                locale === 'de' ? 'Grünes Kulinarisches Zentrum, Mailand' : 'Green Culinary Center, Milan',
      category: 'education',
      organizer: locale === 'es' ? 'Cocina Sostenible' : locale === 'de' ? 'Nachhaltige Küche' : 'Sustainable Kitchen'
    },
    {
      id: 'e17',
      projectId: 'p5',
      title: locale === 'de' ? 'Herbstwaldreinigung' : 'Autumn forest cleanup',
      date: new Date(2025, 9, 19), // October 19, 2025
      time: '09:00',
      duration: 3,
      spots: 30,
      registered: 22,
      location: locale === 'es' ? 'Bosque de Otoño, París' :
                locale === 'de' ? 'Herbstwald, Paris' : 'Autumn Forest, Paris',
      category: 'environment',
      organizer: locale === 'es' ? 'Guardianes del Bosque' : locale === 'de' ? 'Waldwächter' : 'Forest Guardians'
    },
    {
      id: 'e18',
      projectId: 'p6',
      title: locale === 'es' ? 'Mercado de productos de temporada' :
             locale === 'de' ? 'Saisonproduktmarkt' : 'Seasonal products market',
      date: new Date(2025, 9, 26), // October 26, 2025
      time: '11:00',
      duration: 5,
      spots: 50,
      registered: 35,
      location: locale === 'es' ? 'Plaza de la Temporada, Londres' :
                locale === 'de' ? 'Saisonplatz, London' : 'Season Square, London',
      category: 'community',
      organizer: locale === 'es' ? 'Productores de Temporada' : locale === 'de' ? 'Saisonproduzenten' : 'Seasonal Producers'
    },

    // Additional Events - November 2025
    {
      id: 'e19',
      projectId: 'p1',
      title: locale === 'de' ? 'Vogelschutzunterstände bauen' : 'Building bird shelters',
      date: new Date(2025, 10, 3), // November 3, 2025 (Monday)
      time: '13:00',
      duration: 4,
      spots: 15,
      registered: 12,
      location: locale === 'es' ? 'Reserva Natural, Berlín' :
                locale === 'de' ? 'Naturschutzgebiet, Berlin' : 'Nature Reserve, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Protectores de Aves' : locale === 'de' ? 'Vogelschützer' : 'Bird Protectors'
    },
    {
      id: 'e20',
      projectId: 'p2',
      title: locale === 'de' ? 'Windenergie-Workshop' : 'Wind energy workshop',
      date: new Date(2025, 10, 7), // November 7, 2025 (Friday)
      time: '16:00',
      duration: 2,
      spots: 25,
      registered: 20,
      location: locale === 'es' ? 'Centro de Energías Renovables, Madrid' :
                locale === 'de' ? 'Zentrum für erneuerbare Energien, Madrid' : 'Renewable Energy Center, Madrid',
      category: 'education',
      organizer: locale === 'es' ? 'Energía Verde' : locale === 'de' ? 'Grüne Energie' : 'Green Energy'
    },
    {
      id: 'e21',
      projectId: 'p3',
      title: locale === 'de' ? 'Bio-Produktmesse' : 'Organic products fair',
      date: new Date(2025, 10, 10), // November 10, 2025 (Monday)
      time: '09:00',
      duration: 6,
      spots: 100,
      registered: 75,
      location: locale === 'es' ? 'Mercado Central, Barcelona' :
                locale === 'de' ? 'Zentralmarkt, Barcelona' : 'Central Market, Barcelona',
      category: 'community',
      organizer: locale === 'es' ? 'Productos Orgánicos' : locale === 'de' ? 'Bio-Produkte' : 'Organic Products'
    },
    {
      id: 'e22',
      projectId: 'p4',
      title: locale === 'de' ? 'Feuchtgebietssanierung' : 'Wetland restoration',
      date: new Date(2025, 10, 14), // November 14, 2025 (Friday)
      time: '08:00',
      duration: 5,
      spots: 20,
      registered: 16,
      location: locale === 'es' ? 'Humedales del Norte, Milán' :
                locale === 'de' ? 'Nordfeuchtgebiete, Mailand' : 'North Wetlands, Milan',
      category: 'environment',
      organizer: locale === 'es' ? 'Restauradores de Humedales' : locale === 'de' ? 'Feuchtgebietssanierer' : 'Wetland Restorers'
    },
    {
      id: 'e23',
      projectId: 'p5',
      title: locale === 'es' ? 'Conferencia sobre biodiversidad' :
             locale === 'de' ? 'Biodiversitätskonferenz' : 'Biodiversity conference',
      date: new Date(2025, 10, 17), // November 17, 2025 (Monday)
      time: '18:30',
      duration: 3,
      spots: 150,
      registered: 120,
      location: locale === 'es' ? 'Centro de Convenciones, París' :
                locale === 'de' ? 'Kongresszentrum, Paris' : 'Convention Center, Paris',
      category: 'education',
      organizer: locale === 'es' ? 'Instituto de Biodiversidad' : locale === 'de' ? 'Biodiversitätsinstitut' : 'Biodiversity Institute'
    },
    {
      id: 'e24',
      projectId: 'p6',
      title: locale === 'de' ? 'Gemeinschaftsgärten bauen' : 'Building community gardens',
      date: new Date(2025, 10, 21), // November 21, 2025 (Friday)
      time: '10:00',
      duration: 6,
      spots: 30,
      registered: 25,
      location: locale === 'es' ? 'Barrio Verde, Londres' :
                locale === 'de' ? 'Grüner Bezirk, London' : 'Green District, London',
      category: 'community',
      organizer: locale === 'es' ? 'Jardineros Comunitarios' : locale === 'de' ? 'Gemeinschaftsgärtner' : 'Community Gardeners'
    },
    {
      id: 'e25',
      projectId: 'p1',
      title: locale === 'es' ? 'Monitoreo de especies en peligro' :
             locale === 'de' ? 'Überwachung gefährdeter Arten' : 'Monitoring endangered species',
      date: new Date(2025, 10, 24), // November 24, 2025 (Monday)
      time: '07:00',
      duration: 4,
      spots: 12,
      registered: 10,
      location: locale === 'es' ? 'Reserva de Vida Silvestre, Berlín' :
                locale === 'de' ? 'Wildtierreservat, Berlin' : 'Wildlife Reserve, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Protectores de Vida Silvestre' : locale === 'de' ? 'Wildtierschützer' : 'Wildlife Protectors'
    },
    {
      id: 'e26',
      projectId: 'p2',
      title: locale === 'es' ? 'Taller de reciclaje creativo' :
             locale === 'de' ? 'Kreatives Recycling-Workshop' : 'Creative recycling workshop',
      date: new Date(2025, 10, 28), // November 28, 2025 (Friday)
      time: '15:00',
      duration: 3,
      spots: 20,
      registered: 18,
      location: locale === 'es' ? 'Centro de Arte Reciclado, Madrid' :
                locale === 'de' ? 'Recycling-Kunstzentrum, Madrid' : 'Recycled Art Center, Madrid',
      category: 'education',
      organizer: locale === 'es' ? 'Arte Reciclado' : locale === 'de' ? 'Recycling-Kunst' : 'Recycled Art'
    },

    // December 2025 Events
    {
      id: 'e27',
      projectId: 'p3',
      title: locale === 'de' ? 'Nachhaltiger Weihnachtsmarkt' : 'Sustainable Christmas market',
      date: new Date(2025, 11, 1), // December 1, 2025 (Monday)
      time: '12:00',
      duration: 8,
      spots: 200,
      registered: 150,
      location: locale === 'es' ? 'Plaza Navideña, Barcelona' :
                locale === 'de' ? 'Weihnachtsplatz, Barcelona' : 'Christmas Square, Barcelona',
      category: 'community',
      organizer: locale === 'es' ? 'Navidad Sostenible' : locale === 'de' ? 'Nachhaltiges Weihnachten' : 'Sustainable Christmas'
    },
    {
      id: 'e28',
      projectId: 'p4',
      title: locale === 'de' ? 'Winteraufforstung' : 'Winter reforestation',
      date: new Date(2025, 11, 5), // December 5, 2025 (Friday)
      time: '09:00',
      duration: 4,
      spots: 40,
      registered: 32,
      location: locale === 'es' ? 'Bosque de Invierno, Milán' :
                locale === 'de' ? 'Winterwald, Mailand' : 'Winter Forest, Milan',
      category: 'environment',
      organizer: locale === 'es' ? 'Reforestadores de Invierno' : locale === 'de' ? 'Winteraufforster' : 'Winter Reforesters'
    },
    {
      id: 'e29',
      projectId: 'p5',
      title: locale === 'de' ? 'Klimawandel-Seminar' : 'Climate change seminar',
      date: new Date(2025, 11, 8), // December 8, 2025 (Monday)
      time: '17:00',
      duration: 2,
      spots: 80,
      registered: 65,
      location: locale === 'es' ? 'Universidad Verde, París' :
                locale === 'de' ? 'Grüne Universität, Paris' : 'Green University, Paris',
      category: 'education',
      organizer: locale === 'es' ? 'Clima Verde' : locale === 'de' ? 'Grünes Klima' : 'Green Climate'
    },
    {
      id: 'e30',
      projectId: 'p6',
      title: locale === 'de' ? 'Ökologische Jahresendfeier' : 'Eco-friendly year-end celebration',
      date: new Date(2025, 11, 15), // December 15, 2025 (Monday)
      time: '19:00',
      duration: 4,
      spots: 120,
      registered: 95,
      location: locale === 'es' ? 'Centro Cultural Verde, Londres' :
                locale === 'de' ? 'Grünes Kulturzentrum, London' : 'Green Cultural Center, London',
      category: 'community',
      organizer: locale === 'es' ? 'Año Nuevo Verde' : locale === 'de' ? 'Grünes Neues Jahr' : 'Green New Year'
    },
    {
      id: 'e31',
      projectId: 'p1',
      title: locale === 'de' ? 'Meeresartenkonservierung' : 'Marine species conservation',
      date: new Date(2025, 11, 19), // December 19, 2025 (Friday)
      time: '11:00',
      duration: 3,
      spots: 25,
      registered: 20,
      location: locale === 'es' ? 'Centro Marino, Berlín' :
                locale === 'de' ? 'Meereszentrum, Berlin' : 'Marine Center, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Protectores Marinos' : locale === 'de' ? 'Meeresschützer' : 'Marine Protectors'
    },
    {
      id: 'e32',
      projectId: 'p2',
      title: locale === 'de' ? 'Wasserkraft-Workshop' : 'Hydroelectric energy workshop',
      date: new Date(2025, 11, 22), // December 22, 2025 (Monday)
      time: '14:00',
      duration: 3,
      spots: 18,
      registered: 15,
      location: locale === 'es' ? 'Centro Hidroeléctrico, Madrid' :
                locale === 'de' ? 'Wasserkraftzentrum, Madrid' : 'Hydroelectric Center, Madrid',
      category: 'education',
      organizer: locale === 'es' ? 'Energía Hidroeléctrica' : locale === 'de' ? 'Wasserkraft' : 'Hydroelectric Energy'
    },
    {
      id: 'e33',
      projectId: 'p3',
      title: locale === 'es' ? 'Fiesta de la sostenibilidad' :
             locale === 'de' ? 'Nachhaltigkeitsfest' : 'Sustainability party',
      date: new Date(2025, 11, 29), // December 29, 2025 (Monday)
      time: '20:00',
      duration: 5,
      spots: 150,
      registered: 120,
      location: locale === 'es' ? 'Plaza de la Sostenibilidad, Barcelona' :
                locale === 'de' ? 'Nachhaltigkeitsplatz, Barcelona' : 'Sustainability Square, Barcelona',
      category: 'community',
      organizer: locale === 'es' ? 'Sostenibilidad Total' : locale === 'de' ? 'Totale Nachhaltigkeit' : 'Total Sustainability'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString() &&
      (monthCategory ? event.category === monthCategory : true)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Filter functions
  const getFilteredEvents = () => {
    let filtered = mockEvents.filter(event => 
      event.date.getMonth() === currentMonth.getMonth() && 
      event.date.getFullYear() === currentMonth.getFullYear()
    );

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.dateRange) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(event => 
            event.date.toDateString() === today.toDateString()
          );
          break;
        case 'tomorrow':
          filtered = filtered.filter(event => 
            event.date.toDateString() === tomorrow.toDateString()
          );
          break;
        case 'week':
          filtered = filtered.filter(event => 
            event.date >= today && event.date <= nextWeek
          );
          break;
        case 'month':
          filtered = filtered.filter(event => 
            event.date >= today && event.date <= nextMonth
          );
          break;
      }
    }

    if (filters.spotsAvailable) {
      filtered = filtered.filter(event => event.registered < event.spots);
    }

    if (filters.searchText) {
      filtered = filtered.filter(event => 
        t(event.title).toLowerCase().includes(filters.searchText.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        event.organizer.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      dateRange: '',
      spotsAvailable: false,
      searchText: ''
    });
  };

  const getUniqueCategories = () => {
    return [...new Set(mockEvents.map(event => event.category))];
  };

  const getUniqueLocations = () => {
    return [...new Set(mockEvents.map(event => event.location))];
  };

  const weekDays = locale === 'es' ? 
    ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] :
    locale === 'de' ?
    ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] :
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <BaseCard variant="default" className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-4">
        <BaseTitle level="h2" className="mb-3 capitalize">
          {t("calendar")}
        </BaseTitle>
        <div className="flex gap-2">
          <BaseButton 
            variant={viewMode === 'month' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('month')}
          >
            {t("month")}
          </BaseButton>
          <BaseButton 
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('list')}
          >
            {t("list")}
          </BaseButton>
        </div>
      </div>

      {viewMode === 'month' && (
        <>
          {/* Month category filter */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <BaseSelect
              value={monthCategory}
              onChange={(e) => setMonthCategory(e.target.value as any)}
            >
              <option value="">{locale === 'es' ? 'Todas las categorías' : locale === 'de' ? 'Alle Kategorien' : 'All categories'}</option>
              <option value="environment">{locale === 'es' ? 'Medio Ambiente' : locale === 'de' ? 'Umwelt' : 'Environment'}</option>
              <option value="education">{locale === 'es' ? 'Educación' : locale === 'de' ? 'Bildung' : 'Education'}</option>
              <option value="community">{locale === 'es' ? 'Comunidad' : locale === 'de' ? 'Gemeinschaft' : 'Community'}</option>
            </BaseSelect>
          </div>
          {/* Month Navigation */}
          <div className={getNavigationClasses('container')}>
            <button
              onClick={() => navigateMonth('prev')}
              className={getNavigationClasses('button')}
            >
              ←
            </button>
            <h3 className="text-lg font-semibold text-white">{formatMonthYear(currentMonth)}</h3>
            <button
              onClick={() => navigateMonth('next')}
              className={getNavigationClasses('button')}
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week day headers */}
            {weekDays.map(day => (
              <div key={day} className={getCalendarClasses('weekDays')}>
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getDaysInMonth(currentMonth).map((day, index) => {
              const events = day ? getEventsForDate(day) : [];
              const isToday = day && day.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={combineClasses(
                    getCalendarClasses('dayCell'),
                    day ? getCalendarClasses('dayCellActive') : getCalendarClasses('dayCellInactive'),
                    isToday ? 'bg-green-50 dark:bg-green-900 border-green-500' : ''
                  )}
                >
                  {day && (
                    <>
                      <div className={combineClasses(
                        'text-sm font-semibold',
                        isToday ? getCalendarClasses('dayNumberToday') : getCalendarClasses('dayNumber')
                      )}>
                        {day.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {events.slice(0, 2).map(event => (
                          <Link
                            key={event.id}
                            href={`/eventos/${event.id}`}
                            className="text-xs px-1.5 py-0.5 rounded cursor-pointer truncate block hover:opacity-95 font-medium"
                            title={t(event.title)}
                            style={{
                              backgroundColor: event.category === 'environment' ? '#dcfce7' : event.category === 'education' ? '#dbeafe' : '#f3e8ff',
                              color: event.category === 'environment' ? '#166534' : event.category === 'education' ? '#1e3a8a' : '#6b21a8'
                            }}
                          >
                            <span className="inline-flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${
                                event.category === 'environment' ? 'bg-green-600' : event.category === 'education' ? 'bg-blue-700' : 'bg-purple-700'
                              }`} />
                              {t(event.title)}
                              <span className="ml-1 opacity-90">
                                ({event.registered}/{event.spots})
                              </span>
                            </span>
                          </Link>
                        ))}
                        {events.length > 2 && (
                          <div className={getCalendarClasses('eventText')}>
                            +{events.length - 2} {locale === 'es' ? 'más' : locale === 'de' ? 'mehr' : 'more'}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

                {viewMode === 'list' && (
                  <>
                    {/* Month Navigation and Filter Toggle */}
                    <div className={getNavigationClasses('container')}>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => navigateMonth('prev')}
                          className={getNavigationClasses('button')}
                        >
                          ←
                        </button>
                        <h3 className="text-lg font-semibold text-white">{formatMonthYear(currentMonth)}</h3>
                        <button
                          onClick={() => navigateMonth('next')}
                          className={getNavigationClasses('button')}
                        >
                          →
                        </button>
                      </div>
                      <BaseButton
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-3 py-1 text-sm"
                      >
                        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                      </BaseButton>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                      <BaseFilterPanel>
                          {/* Search */}
                          <div>
                            <BaseLabel>
                              {locale === 'es' ? 'Buscar' : locale === 'de' ? 'Suchen' : 'Search'}
                            </BaseLabel>
                            <BaseInput
                              type="text"
                              value={filters.searchText}
                              onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                              placeholder={locale === 'es' ? 'Título, ubicación, organizador...' : 
                                         locale === 'de' ? 'Titel, Ort, Organisator...' : 
                                         'Title, location, organizer...'}
                            />
                          </div>

                          {/* Category Filter */}
                          <div>
                            <BaseLabel>
                              {locale === 'es' ? 'Categoría' : locale === 'de' ? 'Kategorie' : 'Category'}
                            </BaseLabel>
                            <BaseSelect
                              value={filters.category}
                              onChange={(e) => setFilters({...filters, category: e.target.value})}
                            >
                              <option value="">{locale === 'es' ? 'Todas las categorías' : 
                                               locale === 'de' ? 'Alle Kategorien' : 
                                               'All categories'}</option>
                              {getUniqueCategories().map(category => (
                                <option key={category} value={category}>
                                  {category === 'environment' ? 
                                    (locale === 'es' ? 'Medio Ambiente' : 
                                     locale === 'de' ? 'Umwelt' : 'Environment') :
                                   category === 'education' ?
                                    (locale === 'es' ? 'Educación' : 
                                     locale === 'de' ? 'Bildung' : 'Education') :
                                   category === 'community' ?
                                    (locale === 'es' ? 'Comunidad' : 
                                     locale === 'de' ? 'Gemeinschaft' : 'Community') :
                                   category}
                                </option>
                              ))}
                            </BaseSelect>
                          </div>

                          {/* Location Filter */}
                          <div>
                            <BaseLabel>
                              {locale === 'es' ? 'Ubicación' : locale === 'de' ? 'Standort' : 'Location'}
                            </BaseLabel>
                            <BaseSelect
                              value={filters.location}
                              onChange={(e) => setFilters({...filters, location: e.target.value})}
                            >
                              <option value="">{locale === 'es' ? 'Todas las ubicaciones' : 
                                               locale === 'de' ? 'Alle Standorte' : 
                                               'All locations'}</option>
                              {getUniqueLocations().map(location => (
                                <option key={location} value={location}>{location}</option>
                              ))}
                            </BaseSelect>
                          </div>

                          {/* Date Range Filter */}
                          <div>
                            <BaseLabel>
                              {locale === 'es' ? 'Rango de fechas' : locale === 'de' ? 'Datumsbereich' : 'Date range'}
                            </BaseLabel>
                            <BaseSelect
                              value={filters.dateRange}
                              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                            >
                              <option value="">{locale === 'es' ? 'Todas las fechas' : 
                                               locale === 'de' ? 'Alle Daten' : 
                                               'All dates'}</option>
                              <option value="today">{locale === 'es' ? 'Hoy' : 
                                                   locale === 'de' ? 'Heute' : 'Today'}</option>
                              <option value="tomorrow">{locale === 'es' ? 'Mañana' : 
                                                       locale === 'de' ? 'Morgen' : 'Tomorrow'}</option>
                              <option value="week">{locale === 'es' ? 'Esta semana' : 
                                                   locale === 'de' ? 'Diese Woche' : 'This week'}</option>
                              <option value="month">{locale === 'es' ? 'Este mes' : 
                                                    locale === 'de' ? 'Diesen Monat' : 'This month'}</option>
                            </BaseSelect>
                          </div>

                          {/* Spots Available Filter */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="spotsAvailable"
                              checked={filters.spotsAvailable}
                              onChange={(e) => setFilters({...filters, spotsAvailable: e.target.checked})}
                              className="mr-2"
                            />
                            <BaseLabel htmlFor="spotsAvailable" variant="checkbox">
                              {locale === 'es' ? 'Solo con cupos disponibles' : 
                               locale === 'de' ? 'Nur mit verfügbaren Plätzen' : 
                               'Only with available spots'}
                            </BaseLabel>
                          </div>

                          {/* Clear Filters Button */}
                          <div className="flex items-end">
                            <BaseButton
                              variant="secondary"
                              onClick={clearFilters}
                              className="px-4 py-2 text-sm"
                            >
                              {locale === 'es' ? 'Limpiar Filtros' : 
                               locale === 'de' ? 'Filter löschen' : 
                               'Clear Filters'}
                            </BaseButton>
                          </div>
                      </BaseFilterPanel>
                    )}

                    {/* Filtered Events for Current Month */}
                    <div className="space-y-3">
                      {getFilteredEvents().map(event => {
                        const project = projects.find(p => p.id === event.projectId);
                        return (
                          <BaseCard key={event.id} variant="default">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <Link 
                                  href={`/eventos/${event.id}`}
                                  className={getEventClasses('title')}
                                >
                                  {t(event.title)}
                                </Link>
                                <p className={getEventClasses('location')}>{event.location}</p>
                                <div className={getEventClasses('details')}>
                                  <span>📅 {event.date.toLocaleDateString()}</span>
                                  <span>🕐 {event.time}</span>
                                  <span>⏱️ {event.duration}h</span>
                                  <span>👥 {event.registered}/{event.spots}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    event.category === 'environment' ? 'bg-green-100 text-green-800' :
                                    event.category === 'education' ? 'bg-blue-100 text-blue-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {event.category === 'environment' ? 
                                      (locale === 'es' ? 'Medio Ambiente' : 
                                       locale === 'de' ? 'Umwelt' : 'Environment') :
                                     event.category === 'education' ?
                                      (locale === 'es' ? 'Educación' : 
                                       locale === 'de' ? 'Bildung' : 'Education') :
                                     event.category === 'community' ?
                                      (locale === 'es' ? 'Comunidad' : 
                                       locale === 'de' ? 'Gemeinschaft' : 'Community') :
                                     event.category}
                                  </span>
                                </div>
                              </div>
                              {/* Optional website/image preview */}
                              {(() => {
                                const websitePreview = (event as any).website ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent((event as any).website)}?w=480` : undefined;
                                const headerImageSrc = (event as any).image_url || websitePreview;
                                return headerImageSrc ? (
                                  <div className="w-32 h-20 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={headerImageSrc}
                                      alt={t(event.title)}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      referrerPolicy="no-referrer"
                                      decoding="async"
                                      crossOrigin="anonymous"
                                    />
                                  </div>
                                ) : null;
                              })()}
                              <div className={getEventClasses('actions')}>
                                <Link
                                  href={`/eventos/${event.id}`}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  {t("viewEvent")}
                                </Link>
                                <Link
                                  href={`/eventos/${event.id}#join`}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                >
                                  {t("join")}
                                </Link>
                              </div>
                            </div>
                          </BaseCard>
                        );
                      })}
                      
                      {/* Show message if no events match filters */}
                      {getFilteredEvents().length === 0 && (
                        <BaseEmptyState
                          icon="🔍"
                          description={locale === 'es' ? 'No se encontraron eventos que coincidan con los filtros' : 
                                        locale === 'de' ? 'Keine Veranstaltungen gefunden, die den Filtern entsprechen' : 
                                        'No events found matching the filters'}
                          action={
                            <BaseButton
                              variant="primary"
                              onClick={clearFilters}
                              className="mt-2"
                            >
                              {locale === 'es' ? 'Limpiar Filtros' : 
                               locale === 'de' ? 'Filter löschen' : 
                               'Clear Filters'}
                            </BaseButton>
                          }
                        />
                      )}
                    </div>
                  </>
                )}
    </BaseCard>
  );
}
