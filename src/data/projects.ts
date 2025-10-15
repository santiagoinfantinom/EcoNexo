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
    image_url: "/leaflet/marker-icon.png",
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
    image_url: "/next.svg",
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
    image_url: "/vercel.svg",
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
    image_url: "/file.svg",
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
    image_url: "/globe.svg",
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
    image_url: "/window.svg",
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
    image_url: "/leaflet/marker-icon.png",
    info_url: "https://www.citylab-berlin.org/",
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
    image_url: "/leaflet/marker-icon.png",
    info_url: "https://re-fresh.global/",
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
    image_url: "/leaflet/marker-icon.png",
    info_url: "http://kunstquartier-bethanien.de/",
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
    image_url: "/leaflet/marker-icon.png",
    info_url: "https://www.nachbarschaftsgarten-prinzenallee.de/",
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
  },
  // Paris
  { id: "par1", name: "Repair Café Paris", category: "Medio ambiente", lat: 48.8566, lng: 2.3522, city: "París", country: "Francia", info_url: "https://repaircafe.org/en/visit/repair-cafe-paris/" },
  { id: "par2", name: "La REcyclerie", category: "Medio ambiente", lat: 48.8934, lng: 2.3294, city: "París", country: "Francia", info_url: "https://www.larecyclerie.com/" },
  { id: "par3", name: "Les Grands Voisins", category: "Comunidad", lat: 48.8418, lng: 2.3293, city: "París", country: "Francia", info_url: "https://www.lesgrandsvoisins.org/" },
  { id: "par4", name: "Nature Urbaine (Rooftop Farm)", category: "Alimentación", lat: 48.8331, lng: 2.2882, city: "París", country: "Francia", info_url: "https://natureurbaine.paris/" },
  { id: "par5", name: "Zero Waste Paris", category: "Medio ambiente", lat: 48.8667, lng: 2.3333, city: "París", country: "Francia", info_url: "https://zerowasteparis.org/" },
  // Madrid
  { id: "mad1", name: "Huerto Urbano Madrid", category: "Alimentación", lat: 40.4168, lng: -3.7038, city: "Madrid", country: "España", info_url: "https://redhuertourbanoslareti.org/" },
  { id: "mad2", name: "Madrid Agrocomposta", category: "Medio ambiente", lat: 40.4310, lng: -3.7000, city: "Madrid", country: "España", info_url: "https://www.madrid.es/Agrocomposta" },
  { id: "mad3", name: "La Casa Encendida · Programación verde", category: "Comunidad", lat: 40.4066, lng: -3.7025, city: "Madrid", country: "España", info_url: "https://www.lacasaencendida.es/" },
  { id: "mad4", name: "Medialab Matadero · Ciudad Prototipo", category: "Educación", lat: 40.3909, lng: -3.6984, city: "Madrid", country: "España", info_url: "https://www.medialabmatadero.es/" },
  { id: "mad5", name: "Repair Café Madrid", category: "Medio ambiente", lat: 40.4380, lng: -3.7007, city: "Madrid", country: "España", info_url: "https://repaircafe.org/" },
  // Roma
  { id: "rom1", name: "Roma Circular Center", category: "Comunidad", lat: 41.9028, lng: 12.4964, city: "Roma", country: "Italia", info_url: "https://romacircularcenter.it/" },
  { id: "rom2", name: "Orti Urbani Garbatella", category: "Alimentación", lat: 41.8629, lng: 12.4828, city: "Roma", country: "Italia", info_url: "https://www.ortiurbaniroma.it/" },
  { id: "rom3", name: "Mercato Circolare Testaccio", category: "Medio ambiente", lat: 41.8762, lng: 12.4768, city: "Roma", country: "Italia", info_url: "https://www.mercatoditestaccio.it/" },
  { id: "rom4", name: "Retake Roma", category: "Comunidad", lat: 41.8986, lng: 12.4769, city: "Roma", country: "Italia", info_url: "https://retakeroma.org/" },
  { id: "rom5", name: "Riparazioni Solidali Roma", category: "Medio ambiente", lat: 41.9135, lng: 12.5113, city: "Roma", country: "Italia", info_url: "https://repaircafe.org/" },
  // Londres
  { id: "lon1", name: "London Community Garden", category: "Alimentación", lat: 51.5072, lng: -0.1276, city: "Londres", country: "Reino Unido", info_url: "https://www.london.gov.uk/programmes-strategies/environment-and-climate-change/food/london-grows" },
  { id: "lon2", name: "Circular Economy Club London", category: "Medio ambiente", lat: 51.5155, lng: -0.1410, city: "Londres", country: "Reino Unido", info_url: "https://www.circulareconomyclub.com/organizer/cec-london/" },
  { id: "lon3", name: "The Restart Project (Repair)", category: "Medio ambiente", lat: 51.5237, lng: -0.1040, city: "Londres", country: "Reino Unido", info_url: "https://therestartproject.org/" },
  { id: "lon4", name: "Incredible Edible Lambeth", category: "Alimentación", lat: 51.4625, lng: -0.1160, city: "Londres", country: "Reino Unido", info_url: "https://www.incredibleediblelambeth.org/" },
  { id: "lon5", name: "Impact Hub London (Sustainability)", category: "Comunidad", lat: 51.5203, lng: -0.0866, city: "Londres", country: "Reino Unido", info_url: "https://impacthub.net/location/london/" },
  // Estocolmo
  { id: "sto1", name: "Stockholm Makerspace Repair", category: "Medio ambiente", lat: 59.3293, lng: 18.0686, city: "Estocolmo", country: "Suecia", info_url: "https://www.makerspace.se/" },
  { id: "sto2", name: "Stadsodling Stockholm (Urban Farming)", category: "Alimentación", lat: 59.3340, lng: 18.0510, city: "Estocolmo", country: "Suecia", info_url: "https://www.stockholm.se/TrafikStadsplanering/Stadsodling/" },
  { id: "sto3", name: "Stockholm Resilience Centre outreach", category: "Educación", lat: 59.3620, lng: 18.0550, city: "Estocolmo", country: "Suecia", info_url: "https://www.stockholmresilience.org/" },
  { id: "sto4", name: "Återbruket Stockholm", category: "Medio ambiente", lat: 59.3135, lng: 18.0215, city: "Estocolmo", country: "Suecia", info_url: "https://aterbruketstockholm.se/" },
  { id: "sto5", name: "OpenLab Stockholm · Sustainable City", category: "Comunidad", lat: 59.3472, lng: 18.0735, city: "Estocolmo", country: "Suecia", info_url: "https://www.openlabsthlm.se/" },
];

export default PROJECTS;


