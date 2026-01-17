export type Workshop = {
    id: string;
    title: string;
    title_en: string;
    title_de: string;
    description: string;
    description_en: string;
    description_de: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    location_en: string;
    location_de: string;
    organizer: string;
    category: "Circular Economy" | "Sustainable Development" | "Climate Resilience" | "Biodiversity" | "Policy" | "Community";
    capacity: number;
    image_url: string;
    registration_url?: string;
};

export const WORKSHOPS: Workshop[] = [
    {
        id: "ws_euro_sustain_2026",
        title: "Euro Sustainability Conference 2026",
        title_en: "Euro Sustainability Conference 2026",
        title_de: "Euro Nachhaltigkeitskonferenz 2026",
        description: "Enfoque en 'Economía Circular y Más Allá: Diseñando un Futuro Regenerativo', reuniendo a expertos e innovadores.",
        description_en: "Focus on 'Circular Economy and Beyond: Designing a Regenerative Future', bringing together experts and innovators.",
        description_de: "Fokus auf 'Kreislaufwirtschaft und darüber hinaus: Design einer regenerativen Zukunft', bringt Experten und Innovatoren zusammen.",
        date: "2026-05-25",
        time: "09:00",
        duration: "2 días",
        location: "Lisboa, Portugal",
        location_en: "Lisbon, Portugal",
        location_de: "Lissabon, Portugal",
        organizer: "Scient Online",
        category: "Circular Economy",
        capacity: 300,
        image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1280&auto=format&fit=crop"
    },
    {
        id: "ws_icsd_2026",
        title: "14ª Conferencia Internacional sobre Desarrollo Sostenible (ICSD)",
        title_en: "14th International Conference on Sustainable Development (ICSD)",
        title_de: "14. Internationale Konferenz für nachhaltige Entwicklung (ICSD)",
        description: "Abordando la sostenibilidad ambiental, económica y sociocultural bajo el lema 'Creando una base unificada'.",
        description_en: "Addressing environmental, economic, and socio-cultural sustainability under the theme 'Creating a Unified Foundation'.",
        description_de: "Adressierung von ökologischer, wirtschaftlicher und soziokultureller Nachhaltigkeit unter dem Motto 'Schaffung einer einheitlichen Grundlage'.",
        date: "2026-09-09",
        time: "10:00",
        duration: "2 días",
        location: "Roma, Italia",
        location_en: "Rome, Italy",
        location_de: "Rom, Italien",
        organizer: "ICSD Organization",
        category: "Sustainable Development",
        capacity: 500,
        image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1280&auto=format&fit=crop"
    },
    {
        id: "ws_eadi_2026",
        title: "EADI/IOB 2026: Forjando Futuros Sostenibles",
        title_en: "EADI/IOB 2026: Shaping Sustainable Futures",
        title_de: "EADI/IOB 2026: Gestaltung nachhaltiger Zukünfte",
        description: "Explora las dinámicas de la sostenibilidad frente a los desafíos globales, explorando soluciones globales y locales.",
        description_en: "Delves into the dynamics of sustainability in the face of global challenges, exploring both global and local solutions.",
        description_de: "Behandelt die Dynamik der Nachhaltigkeit angesichts globaler Herausforderungen und erforscht sowohl globale als auch lokale Lösungen.",
        date: "2026-06-29",
        time: "09:30",
        duration: "4 días",
        location: "Amberes, Bélgica",
        location_en: "Antwerp, Belgium",
        location_de: "Antwerpen, Belgien",
        organizer: "University of Antwerp",
        category: "Sustainable Development",
        capacity: 250,
        image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1280&auto=format&fit=crop"
    },
    {
        id: "ws_env_reporting_2026",
        title: "Taller de Informes Ambientales y Simplificación",
        title_en: "Environmental Reporting and Simplification Workshop",
        title_de: "Workshop für Umweltberichterstattung und Vereinfachung",
        description: "Taller online de la Comisión Europea sobre la reducción de la carga administrativa de la legislación ambiental.",
        description_en: "European Commission online workshop on reducing the administrative burden of environmental legislation.",
        description_de: "Online-Workshop der Europäischen Kommission zur Reduzierung des Verwaltungsaufwands der Umweltgesetzgebung.",
        date: "2026-01-26",
        time: "14:00",
        duration: "4 horas",
        location: "Online",
        location_en: "Online",
        location_de: "Online",
        organizer: "Comisión Europea",
        category: "Policy",
        capacity: 1000,
        image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1280&auto=format&fit=crop"
    },
    {
        id: "ws_esp_europe_2026",
        title: "ESP Europa 2026: Servicios Ecosistémicos",
        title_en: "ESP Europe 2026: Ecosystem Services",
        title_de: "ESP Europa 2026: Ökosystemdienstleistungen",
        description: "Explora cómo los servicios ecosistémicos pueden contribuir a un futuro positivo para la naturaleza y el bienestar.",
        description_en: "Exploring how ecosystem services can contribute to a nature-positive future and support human well-being.",
        description_de: "Erforschung, wie Ökosystemdienstleistungen zu einer naturpositiven Zukunft beitragen und das menschliche Wohlbefinden unterstützen können.",
        date: "2026-05-18",
        time: "09:00",
        duration: "5 días",
        location: "Praga, República Checa",
        location_en: "Prague, Czechia",
        location_de: "Prag, Tschechien",
        organizer: "Ecosystem Services Partnership",
        category: "Biodiversity",
        capacity: 400,
        image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1280&auto=format&fit=crop"
    },
    {
        id: "ws_climate_resilient_landscapes_2026",
        title: "Diseñando Paisajes Resilientes al Clima",
        title_en: "Designing Climate Resilient Landscapes",
        title_de: "Gestaltung klimaresilienter Landschaften",
        description: "Recopilación de ideas para la nueva guía de la UE sobre adaptación climática basada en el paisaje.",
        description_en: "Gathering insights for new EU guidance on landscape-based climate adaptation.",
        description_de: "Sammeln von Erkenntnissen für den neuen EU-Leitfaden zur landschaftsbasierten Klimaanpassung.",
        date: "2026-01-22",
        time: "09:00",
        duration: "1 día",
        location: "Espoo, Finlandia",
        location_en: "Espoo, Finland",
        location_de: "Espoo, Finnland",
        organizer: "Ecologic Institute",
        category: "Climate Resilience",
        capacity: 80,
        image_url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=1280&auto=format&fit=crop"
    },
    {
        id: "ws_biodiversity_resilience_2026",
        title: "Conferencia de Resiliencia Biológica y NBS",
        title_en: "Biodiversity & NBS Resilience Conference",
        title_de: "Konferenz für Biodiversität und NBS-Resilienz",
        description: "ICLEI Europa organiza este evento centrado en soluciones basadas en la naturaleza para la resiliencia.",
        description_en: "ICLEI Europe organizing this conference focused on nature-based solutions for resilience.",
        description_de: "ICLEI Europe organisiert diese Konferenz mit Fokus auf naturbasierten Lösungen für Resilienz.",
        date: "2026-02-03",
        time: "09:00",
        duration: "3 días",
        location: "Bruselas, Bélgica",
        location_en: "Brussels, Belgium",
        location_de: "Brüssel, Belgien",
        organizer: "ICLEI Europe",
        category: "Biodiversity",
        capacity: 200,
        image_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1280&auto=format&fit=crop"
    },
    {
        id: "ws_eco_friendly_sunday_2026",
        title: "Tercer Domingo Eco-Amigable",
        title_en: "Third Eco-Friendly Sunday",
        title_de: "Dritter umweltfreundlicher Sonntag",
        description: "Talleres para niños, discusiones con biólogos y demostraciones de agricultura local sostenible.",
        description_en: "Workshops for children, discussions with biologists, and showcasing local sustainable farming.",
        description_de: "Workshops für Kinder, Diskussionen mit Biologen und Präsentation lokaler nachhaltiger Landwirtschaft.",
        date: "2026-01-18",
        time: "10:30",
        duration: "5 horas",
        location: "Roma, Italia",
        location_en: "Rome, Italy",
        location_de: "Rom, Italien",
        organizer: "Roma Capitale",
        category: "Community",
        capacity: 150,
        image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1280&auto=format&fit=crop"
    }
];
