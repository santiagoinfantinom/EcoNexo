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
  },
];

export default PROJECTS;


