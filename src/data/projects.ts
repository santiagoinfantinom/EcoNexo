export type Category =
  | "Medio ambiente"
  | "Educación"
  | "Salud"
  | "Comunidad"
  | "Océanos"
  | "Alimentación";

export type Project = {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  info_url?: string;
  category: Category;
  lat: number;
  lng: number;
  city: string;
  country: string;
  spots?: number;
  address?: string;
  // Optional scheduling for event filtering
  startsAt?: string;
  endsAt?: string;
  isPermanent?: boolean;
};

// Canonical in-repo dataset used by map, API, and static params
export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Reforestación Urbana Berlín",
    name_en: "Berlin Urban Reforestation",
    name_de: "Urbane Aufforstung Berlin",
    category: "Medio ambiente",
    lat: 52.52,
    lng: 13.405,
    city: "Berlín",
    country: "Alemania",
    spots: 50,
    image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1280&auto=format&fit=crop",
    description: "Plantación de árboles nativos y creación de corredores verdes para mejorar calidad del aire y hábitats urbanos en Berlín.",
  },
  {
    id: "p2",
    name: "Taller de Robótica Educativa",
    name_en: "Educational Robotics Workshop",
    name_de: "Bildungsrobotik-Workshop",
    category: "Educación",
    lat: 40.4168,
    lng: -3.7038,
    city: "Madrid",
    country: "España",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop",
    description: "Talleres prácticos de programación y robótica para jóvenes con enfoque STEM e inclusión digital.",
  },
  {
    id: "p3",
    name: "Clínica móvil comunitaria",
    name_en: "Community Mobile Clinic",
    name_de: "Mobile Gemeinschaftsklinik",
    category: "Salud",
    lat: 45.4642,
    lng: 9.19,
    city: "Milán",
    country: "Italia",
    image_url: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1280&auto=format&fit=crop",
    description: "Unidad móvil que ofrece chequeos básicos y prevención en barrios con menor acceso sanitario.",
  },
  {
    id: "p4",
    name: "Recuperación de playas",
    name_en: "Beach Recovery",
    name_de: "Strandwiederherstellung",
    category: "Océanos",
    lat: 43.2965,
    lng: 5.3698,
    city: "Marsella",
    country: "Francia",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop",
    description: "Limpieza de costas, monitoreo de microplásticos y restauración de ecosistemas marinos en el litoral mediterráneo.",
  },
  {
    id: "p5",
    name: "Huertos urbanos",
    name_en: "Urban Gardens",
    name_de: "Städtische Gärten",
    category: "Alimentación",
    lat: 51.5072,
    lng: -0.1276,
    city: "Londres",
    country: "Reino Unido",
    image_url: "https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1280&auto=format&fit=crop",
    description: "Creación de huertos comunitarios para promover soberanía alimentaria y educación ambiental en barrios urbanos.",
  },
  {
    id: "p6",
    name: "Centros vecinales inclusivos",
    name_en: "Inclusive Neighborhood Centers",
    name_de: "Inklusive Nachbarschaftszentren",
    category: "Comunidad",
    lat: 59.3293,
    lng: 18.0686,
    city: "Estocolmo",
    country: "Suecia",
    image_url: "https://images.unsplash.com/photo-1520975922215-230d2d38f5a4?q=80&w=1280&auto=format&fit=crop",
    description: "Espacios comunitarios que ofrecen actividades culturales y apoyo mutuo para fortalecer la cohesión social.",
  },
  // Berlin real initiatives
  {
    id: "b1",
    name: "CityLAB Berlin",
    name_en: "CityLAB Berlin",
    name_de: "CityLAB Berlin",
    category: "Comunidad",
    lat: 52.4851,
    lng: 13.3950,
    city: "Berlín",
    country: "Alemania",
    spots: 10,
    image_url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1280&auto=format&fit=crop",
    info_url: "https://www.citylab-berlin.org/",
    address: "Platz der Luftbrücke 4, 12101 Berlin, Germany",
    isPermanent: true,
  },
  {
    id: "b2",
    name: "Re-Fresh Global (Textile Recycling)",
    name_en: "Re-Fresh Global (Textile Recycling)",
    name_de: "Re-Fresh Global (Textilrecycling)",
    category: "Medio ambiente",
    lat: 52.4973,
    lng: 13.3768,
    city: "Berlín",
    country: "Alemania",
    spots: 5,
    image_url: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1280&auto=format&fit=crop",
    info_url: "https://re-fresh.global/",
    address: "Luckenwalder Str. 6b, 10963 Berlin, Germany",
    isPermanent: true,
  },
  {
    id: "b3",
    name: "Kunstquartier Bethanien",
    name_en: "Kunstquartier Bethanien",
    name_de: "Kunstquartier Bethanien",
    category: "Comunidad",
    lat: 52.5030,
    lng: 13.4260,
    city: "Berlín",
    country: "Alemania",
    image_url: "https://images.unsplash.com/photo-1524592714635-5f1343f1d2f1?q=80&w=1280&auto=format&fit=crop",
    info_url: "http://kunstquartier-bethanien.de/",
     address: "Mariannenplatz 2, 10997 Berlin, Germany",
     isPermanent: true,
  },
  {
    id: "b4",
    name: "Prinzenallee Community Garden",
    name_en: "Prinzenallee Community Garden",
    name_de: "Gemeinschaftsgarten Prinzenallee",
    category: "Alimentación",
    lat: 52.5534,
    lng: 13.3858,
    city: "Berlín",
    country: "Alemania",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1280&auto=format&fit=crop",
    info_url: "https://www.nachbarschaftsgarten-prinzenallee.de/",
    address: "Prinzenallee 58, 13359 Berlin, Germany",
    isPermanent: true,
  },
  {
    id: "b5",
    name: "Repair Café Neukölln",
    name_en: "Repair Café Neukölln",
    name_de: "Repair Café Neukölln",
    category: "Medio ambiente",
    lat: 52.4794,
    lng: 13.4328,
    city: "Berlín",
    country: "Alemania",
    image_url: "/leaflet/marker-icon.png",
    info_url: "https://repaircafe.org/",
    address: "Karl-Marx-Str. 75, 12043 Berlin, Germany",
    // Event hoy (demo)
    startsAt: "2025-10-15T18:00:00+02:00",
    endsAt: "2025-10-15T21:00:00+02:00",
  },
  // Paris
  { id: "par1", name: "Repair Café Paris", name_de: "Repair Café Paris", category: "Medio ambiente", lat: 48.8566, lng: 2.3522, city: "París", country: "Francia", info_url: "https://repaircafe.org/en/visit/repair-cafe-paris/", image_url: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1280&auto=format&fit=crop", description: "Encuentros de reparación colaborativa donde voluntariado y vecinos arreglan aparatos para evitar residuos.", description_de: "Gemeinsame Reparaturtreffen, bei denen Geräte instand gesetzt und Abfall vermieden wird.", startsAt: "2025-10-15T17:30:00+02:00", endsAt: "2025-10-15T20:30:00+02:00" },
  { id: "par2", name: "La REcyclerie", name_de: "La REcyclerie", category: "Medio ambiente", lat: 48.8934, lng: 2.3294, city: "París", country: "Francia", info_url: "https://www.larecyclerie.com/", image_url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1280&auto=format&fit=crop", description: "Tercer lugar en antigua estación con talleres de reparación, compostaje y consumo responsable.", description_de: "Dritter Ort in einem alten Bahnhof mit Reparatur‑, Kompost‑ und Zero‑Waste‑Workshops.", isPermanent: true },
  { id: "par3", name: "Les Grands Voisins", name_de: "Les Grands Voisins", category: "Comunidad", lat: 48.8418, lng: 2.3293, city: "París", country: "Francia", info_url: "https://www.lesgrandsvoisins.org/", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1280&auto=format&fit=crop", description: "Ecosistema social y cultural que reactivó un complejo hospitalario con proyectos inclusivos y comunitarios.", description_de: "Soziales und kulturelles Ökosystem, das einen alten Krankenhauskomplex für inklusive Projekte reaktivierte." },
  { id: "par4", name: "Nature Urbaine (Rooftop Farm)", name_de: "Nature Urbaine (Dachfarm)", category: "Alimentación", lat: 48.8331, lng: 2.2882, city: "París", country: "Francia", info_url: "https://natureurbaine.paris/", image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1280&auto=format&fit=crop", description: "Gran granja en azotea dedicada a agricultura urbana, formación y alimentos de kilómetro cero.", description_de: "Große Dachfarm mit urbaner Landwirtschaft, Bildungsangeboten und lokaler Produktion." },
  { id: "par5", name: "Zero Waste Paris", name_de: "Zero Waste Paris", category: "Medio ambiente", lat: 48.8667, lng: 2.3333, city: "París", country: "Francia", info_url: "https://zerowasteparis.org/", image_url: "https://images.unsplash.com/photo-1483181957632-8b2800e1db66?q=80&w=1280&auto=format&fit=crop", description: "Asociación que impulsa la estrategia residuo‑cero con campañas, guías y apoyo a comercios y barrios.", description_de: "Verein, der Zero‑Waste‑Strategien mit Kampagnen, Leitfäden und Unterstützung für Läden und Viertel fördert." },
  // Madrid
  { id: "mad1", name: "Huerto Urbano Madrid", name_de: "Städtische Gemeinschaftsgärten Madrid", category: "Alimentación", lat: 40.4168, lng: -3.7038, city: "Madrid", country: "España", info_url: "https://redhuertourbanoslareti.org/", image_url: "https://images.unsplash.com/photo-1519003300449-41f31b720d5a?q=80&w=1280&auto=format&fit=crop", description: "Red de huertos comunitarios que impulsa agroecología, formación y vida de barrio en Madrid.", description_de: "Netzwerk von Gemeinschaftsgärten für Agrarökologie, Bildung und Nachbarschaftsleben in Madrid." },
  { id: "mad2", name: "Madrid Agrocomposta", name_de: "Madrid Agrocomposta", category: "Medio ambiente", lat: 40.4310, lng: -3.7000, city: "Madrid", country: "España", info_url: "https://www.madrid.es/Agrocomposta", image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1280&auto=format&fit=crop", description: "Programa municipal que convierte biorresiduos urbanos en compost para huertos locales.", description_de: "Kommunales Programm, das Bioabfälle zu Kompost für städtische Gärten verarbeitet." },
  { id: "mad3", name: "La Casa Encendida · Programación verde", name_de: "La Casa Encendida · Grünes Programm", category: "Comunidad", lat: 40.4066, lng: -3.7025, city: "Madrid", country: "España", info_url: "https://www.lacasaencendida.es/", image_url: "https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?q=80&w=1280&auto=format&fit=crop", description: "Centro cultural con ciclos de sostenibilidad, talleres y actividades ambientales para todos los públicos.", description_de: "Kulturzentrum mit Nachhaltigkeitsreihen, Workshops und Umweltaktivitäten für alle." },
  { id: "mad4", name: "Medialab Matadero · Ciudad Prototipo", name_de: "Medialab Matadero · Stadtprototyp", category: "Educación", lat: 40.3909, lng: -3.6984, city: "Madrid", country: "España", info_url: "https://www.medialabmatadero.es/", image_url: "https://images.unsplash.com/photo-1518081461904-9ac6e9602d9a?q=80&w=1280&auto=format&fit=crop", description: "Laboratorio de innovación ciudadana que explora prototipos para una ciudad más sostenible y abierta.", description_de: "Labor für bürgernahe Innovation, das Prototypen für eine nachhaltige, offene Stadt erprobt." },
  { id: "mad5", name: "Repair Café Madrid", name_de: "Repair Café Madrid", category: "Medio ambiente", lat: 40.4380, lng: -3.7007, city: "Madrid", country: "España", info_url: "https://repaircafe.org/", image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1280&auto=format&fit=crop", description: "Punto de encuentro para reparar objetos con ayuda de voluntariado, alargando su vida útil.", description_de: "Treffen zur gemeinschaftlichen Reparatur von Gegenständen, um deren Lebensdauer zu verlängern.", startsAt: "2025-10-15T18:00:00+02:00", endsAt: "2025-10-15T21:00:00+02:00" },
  // Roma
  { id: "rom1", name: "Roma Circular Center", name_de: "Roma Circular Center", category: "Comunidad", lat: 41.9028, lng: 12.4964, city: "Roma", country: "Italia", info_url: "https://romacircularcenter.it/", image_url: "https://images.unsplash.com/photo-1520340356584-8f7f6a89b6c3?q=80&w=1280&auto=format&fit=crop", description: "Plataforma municipal que acelera proyectos y negocios de economía circular en Roma.", description_de: "Städtische Plattform zur Beschleunigung zirkulärer Projekte und Unternehmen in Rom." },
  { id: "rom2", name: "Orti Urbani Garbatella", name_de: "Stadtgärten Garbatella", category: "Alimentación", lat: 41.8629, lng: 12.4828, city: "Roma", country: "Italia", info_url: "https://www.ortiurbaniroma.it/", image_url: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1280&auto=format&fit=crop", description: "Huertos urbanos gestionados por vecinos que fomentan agricultura comunitaria y educación ambiental.", description_de: "Von Nachbarn betriebene Stadtgärten, die Gemeinschaftsanbau und Umweltbildung fördern." },
  { id: "rom3", name: "Mercato Circolare Testaccio", name_de: "Kreislauf‑Markt Testaccio", category: "Medio ambiente", lat: 41.8762, lng: 12.4768, city: "Roma", country: "Italia", info_url: "https://www.mercatoditestaccio.it/", image_url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1280&auto=format&fit=crop", description: "Mercado de barrio que impulsa consumo responsable y circularidad con comercios locales.", description_de: "Stadtteilmarkt, der verantwortungsvollen Konsum und Zirkularität mit lokalen Läden fördert." },
  { id: "rom4", name: "Retake Roma", name_de: "Retake Roma", category: "Comunidad", lat: 41.8986, lng: 12.4769, city: "Roma", country: "Italia", info_url: "https://retakeroma.org/", image_url: "https://images.unsplash.com/photo-1520975922215-230d2d38f5a4?q=80&w=1280&auto=format&fit=crop", description: "Voluntariado ciudadano que organiza limpiezas y recuperación de espacios públicos.", description_de: "Bürgerschaftliches Engagement für Reinigungen und Wiedergewinnung öffentlicher Räume." },
  { id: "rom5", name: "Riparazioni Solidari Roma", name_de: "Solidarische Reparaturen Rom", category: "Medio ambiente", lat: 41.9135, lng: 12.5113, city: "Roma", country: "Italia", info_url: "https://repaircafe.org/", image_url: "https://images.unsplash.com/photo-1581091014534-8987c1d4ebd2?q=80&w=1280&auto=format&fit=crop", description: "Iniciativa solidaria de reparación que alarga la vida de aparatos y promueve reutilización.", description_de: "Solidarische Reparatur‑Initiative zur Lebensdauerverlängerung und Wiederverwendung." },
  // Londres
  { id: "lon1", name: "London Community Garden", name_de: "Gemeinschaftsgarten London", category: "Alimentación", lat: 51.5072, lng: -0.1276, city: "Londres", country: "Reino Unido", info_url: "https://www.london.gov.uk/programmes-strategies/environment-and-climate-change/food/london-grows", image_url: "https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1280&auto=format&fit=crop", description: "Red de huertos urbanos que promueve alimentos locales, biodiversidad y cohesión comunitaria en Londres.", description_de: "Netz von Stadtgärten zur Förderung lokaler Lebensmittel, Biodiversität und Gemeinschaft in London." },
  { id: "lon2", name: "Circular Economy Club London", name_de: "Circular Economy Club London", category: "Medio ambiente", lat: 51.5155, lng: -0.1410, city: "Londres", country: "Reino Unido", info_url: "https://www.circulareconomyclub.com/organizer/cec-london/", image_url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1280&auto=format&fit=crop", description: "Comunidad profesional que conecta iniciativas y expertos en economía circular en la ciudad.", description_de: "Professionelles Netzwerk, das Initiativen und Fachleute der Kreislaufwirtschaft verbindet." },
  { id: "lon3", name: "The Restart Project (Repair)", name_de: "The Restart Project (Repair)", category: "Medio ambiente", lat: 51.5237, lng: -0.1040, city: "Londres", country: "Reino Unido", info_url: "https://therestartproject.org/", image_url: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1280&auto=format&fit=crop", description: "Organiza Restart Parties para enseñar a reparar electrónica y reducir la chatarra tecnológica.", description_de: "Organisiert Restart‑Partys, um Elektronik zu reparieren und Elektroschrott zu reduzieren.", startsAt: "2025-10-15T18:30:00+01:00", endsAt: "2025-10-15T21:00:00+01:00" },
  { id: "lon4", name: "Incredible Edible Lambeth", name_de: "Incredible Edible Lambeth", category: "Alimentación", lat: 51.4625, lng: -0.1160, city: "Londres", country: "Reino Unido", info_url: "https://www.incredibleediblelambeth.org/", image_url: "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?q=80&w=1280&auto=format&fit=crop", description: "Red local que impulsa cultivos comestibles en espacios públicos y proyectos alimentarios de barrio.", description_de: "Lokales Netzwerk, das essbare Bepflanzung im öffentlichen Raum und Nachbarschafts‑Food‑Projekte fördert." },
  { id: "lon5", name: "Impact Hub London (Sustainability)", name_de: "Impact Hub London (Nachhaltigkeit)", category: "Comunidad", lat: 51.5203, lng: -0.0866, city: "Londres", country: "Reino Unido", info_url: "https://impacthub.net/location/london/", image_url: "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?q=80&w=1280&auto=format&fit=crop", description: "Comunidad de emprendimiento de impacto que acelera proyectos sociales y ambientales en Londres.", description_de: "Community für wirkungsorientiertes Unternehmertum, die soziale und ökologische Projekte beschleunigt." },
  // Estocolmo
  { id: "sto1", name: "Stockholm Makerspace Repair", name_de: "Stockholm Makerspace Repair", category: "Medio ambiente", lat: 59.3293, lng: 18.0686, city: "Estocolmo", country: "Suecia", info_url: "https://www.makerspace.se/", image_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1280&auto=format&fit=crop", description: "Espacio maker abierto con talleres de reparación y fabricación digital para extender la vida de los objetos.", description_de: "Offener Makerspace mit Reparatur‑ und Digital‑Fertigungskursen zur Lebensdauerverlängerung.", startsAt: "2025-10-15T18:00:00+02:00", endsAt: "2025-10-15T20:30:00+02:00" },
  { id: "sto2", name: "Stadsodling Stockholm (Urban Farming)", name_de: "Stadtbegrünung Stockholm (Urban Farming)", category: "Alimentación", lat: 59.3340, lng: 18.0510, city: "Estocolmo", country: "Suecia", info_url: "https://www.stockholm.se/TrafikStadsplanering/Stadsodling/", image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1280&auto=format&fit=crop", description: "Iniciativas municipales de agricultura urbana y compostaje para una ciudad más resiliente.", description_de: "Städtische Initiativen für Urban Farming und Kompostierung für eine resilientere Stadt." },
  { id: "sto3", name: "Stockholm Resilience Centre outreach", name_de: "Stockholm Resilience Centre – Outreach", category: "Educación", lat: 59.3620, lng: 18.0550, city: "Estocolmo", country: "Suecia", info_url: "https://www.stockholmresilience.org/", image_url: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1280&auto=format&fit=crop", description: "Centro de investigación de referencia mundial que divulga ciencia sobre resiliencia socio‑ecológica.", description_de: "Weltweit führendes Forschungszentrum, das Wissen über sozial‑ökologische Resilienz vermittelt." },
  { id: "sto4", name: "Återbruket Stockholm", name_de: "Återbruket Stockholm", category: "Medio ambiente", lat: 59.3135, lng: 18.0215, city: "Estocolmo", country: "Suecia", info_url: "https://aterbruketstockholm.se/", image_url: "https://images.unsplash.com/photo-1503685337896-6dca3f3163f0?q=80&w=1280&auto=format&fit=crop", description: "Centros municipales de reutilización donde donar, reparar y comprar artículos reacondicionados.", description_de: "Kommunale Wiederverwendungs‑Zentren zum Spenden, Reparieren und Kaufen aufbereiteter Gegenstände." },
  { id: "sto5", name: "OpenLab Stockholm · Sustainable City", name_de: "OpenLab Stockholm – Sustainable City", category: "Comunidad", lat: 59.3472, lng: 18.0735, city: "Estocolmo", country: "Suecia", info_url: "https://www.openlabsthlm.se/", image_url: "https://images.unsplash.com/photo-1532634726-8b9fb99825c7?q=80&w=1280&auto=format&fit=crop", description: "Plataforma de innovación pública que conecta universidad, empresas y administración para retos urbanos.", description_de: "Plattform für öffentliche Innovation, die Hochschulen, Wirtschaft und Verwaltung für urbane Herausforderungen verbindet." },
];

export default PROJECTS;


