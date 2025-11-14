"use client";
import React from "react";
import { useI18n, locationLabel } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventRegistrationForm from "./EventRegistrationForm";
import EventAdministrators from "./EventAdministrators";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";
import { ensureEventImage } from "@/lib/eventImages";

type EventDetails = {
  id: string;
  title: string;
  title_en?: string;
  title_de?: string;
  description: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  website?: string; // Optional website for deriving a preview image
  date: string;
  time: string;
  duration: number;
  location: string;
  location_en?: string;
  location_de?: string;
  organizer: string;
  organizer_en?: string;
  organizer_de?: string;
  category: string;
  maxVolunteers: number;
  minVolunteers?: number;
  currentVolunteers: number;
  requirements: string[];
  requirements_en?: string[];
  requirements_de?: string[];
  benefits: string[];
  benefits_en?: string[];
  benefits_de?: string[];
  contact: string;
};

// Mock event details - in a real app, this would come from an API
const EVENT_DETAILS: Record<string, EventDetails> = {
  "e1": {
    id: "e1",
    title: "Plantación de Árboles Nativos",
    title_en: "Native Tree Planting",
    title_de: "Pflanzung einheimischer Bäume",
    description: "Únete a nuestra jornada de reforestación comunitaria en el Bosque Urbano Norte de Berlín. Durante esta actividad de 3 horas, plantaremos especies nativas de la región que ayudarán a restaurar el ecosistema local, mejorar la calidad del aire y proporcionar hábitat para la fauna urbana. Aprenderás técnicas de plantación adecuadas, cómo identificar especies nativas, y la importancia de cada especie para el ecosistema. Los árboles que plantemos serán monitoreados durante los próximos años para asegurar su crecimiento saludable. Esta es una oportunidad perfecta para contribuir directamente a la mejora del medio ambiente urbano y aprender sobre conservación práctica.",
    description_en: "Join our community reforestation day at Berlin's North Urban Forest. During this 3-hour activity, we'll plant native species from the region that will help restore the local ecosystem, improve air quality, and provide habitat for urban wildlife. You'll learn proper planting techniques, how to identify native species, and the importance of each species for the ecosystem. The trees we plant will be monitored over the coming years to ensure their healthy growth. This is a perfect opportunity to directly contribute to urban environmental improvement and learn about practical conservation.",
    description_de: "Schließen Sie sich unserem Gemeinschaftsaufforstungstag im Nordstädtischen Wald Berlins an. Während dieser 3-stündigen Aktivität pflanzen wir einheimische Arten der Region, die dazu beitragen, das lokale Ökosystem wiederherzustellen, die Luftqualität zu verbessern und Lebensraum für städtische Wildtiere zu schaffen. Sie lernen geeignete Pflanztechniken, wie man einheimische Arten identifiziert, und die Bedeutung jeder Art für das Ökosystem. Die von uns gepflanzten Bäume werden in den kommenden Jahren überwacht, um ihr gesundes Wachstum sicherzustellen. Dies ist eine perfekte Gelegenheit, direkt zur Verbesserung der städtischen Umwelt beizutragen und mehr über praktischen Naturschutz zu lernen.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.greencityinitiative.org",
    date: "2025-01-15",
    time: "09:00",
    duration: 3,
    location: "Bosque Urbano Norte, Berlín",
    location_en: "North Urban Forest, Berlin",
    location_de: "Nordstädtischer Wald, Berlin",
    organizer: "Green City Initiative",
    organizer_en: "Green City Initiative",
    organizer_de: "Grüne Stadt Initiative",
    category: "environment",
    maxVolunteers: 30,
    currentVolunteers: 12,
    requirements: ["Ropa cómoda y resistente", "Botas de trabajo o zapatos cerrados", "Guantes de jardinería", "Agua para hidratación", "Protector solar", "Sombrero (opcional)"],
    requirements_en: ["Comfortable and durable clothing", "Work boots or closed shoes", "Gardening gloves", "Water for hydration", "Sunscreen", "Hat (optional)"],
    requirements_de: ["Bequeme und strapazierfähige Kleidung", "Arbeitsstiefel oder geschlossene Schuhe", "Gartenhandschuhe", "Wasser zur Hydratation", "Sonnencreme", "Hut (optional)"],
    benefits: ["Certificado de participación", "Almuerzo incluido", "Material educativo sobre especies nativas", "Guía de identificación de árboles", "Seguimiento del crecimiento de tus árboles", "Experiencia práctica en reforestación"],
    benefits_en: ["Participation certificate", "Lunch included", "Educational material on native species", "Tree identification guide", "Follow-up on your trees' growth", "Hands-on reforestation experience"],
    benefits_de: ["Teilnahmezertifikat", "Mittagessen inbegriffen", "Bildungsmaterial über einheimische Arten", "Baumidentifikationsführer", "Nachverfolgung des Wachstums Ihrer Bäume", "Praktische Erfahrung in der Aufforstung"],
    contact: "info@greencity.org"
  },
  "e2": {
    id: "e2",
    title: "Taller Práctico de Energía Solar Residencial",
    title_en: "Practical Residential Solar Energy Workshop",
    title_de: "Praktischer Workshop für Wohnsolar-Energie",
    description: "Descubre cómo puedes generar tu propia energía limpia en casa con este taller práctico de 3 horas sobre instalación y beneficios de paneles solares residenciales. Aprenderás los fundamentos de la energía solar fotovoltaica, cómo funcionan los paneles solares, y los componentes necesarios para una instalación residencial completa. Realizaremos una demostración práctica de instalación de paneles, aprenderás a calcular el potencial de ahorro energético y económico de tu hogar, y conocerás las subvenciones y ayudas disponibles. También exploraremos el mantenimiento de sistemas solares, la vida útil de los equipos, y cómo integrar la energía solar con otras fuentes de energía renovable. Al finalizar, tendrás toda la información necesaria para tomar decisiones informadas sobre energía solar en tu hogar y podrás calcular el retorno de inversión de una instalación solar personalizada.",
    description_en: "Discover how you can generate your own clean energy at home with this 3-hour practical workshop on installation and benefits of residential solar panels. You'll learn the fundamentals of photovoltaic solar energy, how solar panels work, and the components needed for a complete residential installation. We'll conduct a practical demonstration of panel installation, you'll learn to calculate the energy and economic savings potential of your home, and you'll learn about available grants and subsidies. We'll also explore solar system maintenance, equipment lifespan, and how to integrate solar energy with other renewable energy sources. At the end, you'll have all the information needed to make informed decisions about solar energy in your home and be able to calculate the return on investment of a customized solar installation.",
    description_de: "Entdecken Sie, wie Sie Ihre eigene saubere Energie zu Hause erzeugen können, mit diesem 3-stündigen praktischen Workshop über Installation und Vorteile von Wohnsolarpanelen. Sie lernen die Grundlagen der photovoltaischen Solarenergie, wie Solarpanels funktionieren und die Komponenten, die für eine vollständige Wohninstallation benötigt werden. Wir führen eine praktische Demonstration der Panelinstallation durch, Sie lernen, das Energie- und Wirtschaftseinsparungspotenzial Ihres Hauses zu berechnen, und Sie erfahren mehr über verfügbare Zuschüsse und Subventionen. Wir werden auch die Wartung von Solarsystemen, die Lebensdauer der Ausrüstung und die Integration von Solarenergie mit anderen erneuerbaren Energiequellen erkunden. Am Ende haben Sie alle Informationen, die Sie benötigen, um fundierte Entscheidungen über Solarenergie in Ihrem Zuhause zu treffen, und können die Rendite einer maßgeschneiderten Solarinstallation berechnen.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    website: "https://www.solartechacademy.org",
    date: "2025-01-22",
    time: "14:00",
    duration: 3,
    location: "Centro de Innovación Verde, Madrid",
    location_en: "Green Innovation Center, Madrid",
    location_de: "Grünes Innovationszentrum, Madrid",
    organizer: "SolarTech Academy",
    organizer_en: "SolarTech Academy",
    organizer_de: "SolarTech Akademie",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Cuaderno para tomar notas", "Calculadora (opcional, proporcionamos algunas)", "Ropa cómoda", "Interés en energías renovables", "Conocimientos básicos de electricidad (recomendado pero no obligatorio)", "Dispositivo móvil con calculadora (opcional)"],
    requirements_en: ["Notebook for taking notes", "Calculator (optional, we provide some)", "Comfortable clothing", "Interest in renewable energy", "Basic knowledge of electricity (recommended but not required)", "Mobile device with calculator (optional)"],
    requirements_de: ["Notizbuch zum Mitschreiben", "Taschenrechner (optional, wir stellen einige zur Verfügung)", "Bequeme Kleidung", "Interesse an erneuerbaren Energien", "Grundkenntnisse in Elektrizität (empfohlen, aber nicht erforderlich)", "Mobilgerät mit Taschenrechner (optional)"],
    benefits: ["Certificado de formación en energía solar", "Manual técnico completo sobre instalaciones solares", "Pausa para café y refrigerios incluidos", "Calculadora de ahorro energético personalizada", "Acceso a recursos online adicionales", "Lista de proveedores certificados", "Oportunidades de networking con otros participantes"],
    benefits_en: ["Solar energy training certificate", "Complete technical manual on solar installations", "Coffee break and refreshments included", "Personalized energy savings calculator", "Access to additional online resources", "List of certified suppliers", "Networking opportunities with other participants"],
    benefits_de: ["Ausbildungszertifikat für Solarenergie", "Vollständiges technisches Handbuch über Solarinstallationen", "Kaffeepause und Erfrischungen inbegriffen", "Personalisierter Energiesparrechner", "Zugang zu zusätzlichen Online-Ressourcen", "Liste zertifizierter Lieferanten", "Netzwerkmöglichkeiten mit anderen Teilnehmern"],
    contact: "training@solartech.edu"
  },
  "e3": {
    id: "e3",
    title: "Mercado de Productos Locales y Artesanías Sostenibles",
    title_en: "Local Products and Sustainable Crafts Market",
    title_de: "Markt für lokale Produkte und nachhaltige Handwerkskunst",
    description: "Sumérgete en la riqueza de la producción local en nuestro mercado especializado de productos orgánicos y artesanías sostenibles en la Plaza del Mercado de Barcelona. Durante todo el día, más de 30 productores y artesanos locales presentarán sus productos frescos, ecológicos y hechos a mano. Podrás conocer directamente a los agricultores y artesanos, aprender sobre sus métodos de producción sostenible, y descubrir productos únicos que reflejan la cultura y tradiciones locales. El mercado incluye productos frescos de temporada, conservas artesanales, productos de panadería tradicional, artesanías textiles, cerámica sostenible, y mucho más. También habrá talleres demostrativos sobre técnicas tradicionales, charlas sobre agricultura ecológica, y actividades para toda la familia. Esta es una oportunidad perfecta para apoyar la economía local, reducir tu huella de carbono comprando productos de proximidad, y descubrir la calidad y sabor de los productos locales.",
    description_en: "Immerse yourself in the richness of local production at our specialized market of organic products and sustainable crafts at Barcelona's Market Square. Throughout the day, more than 30 local producers and artisans will showcase their fresh, ecological, and handmade products. You'll be able to meet farmers and artisans directly, learn about their sustainable production methods, and discover unique products that reflect local culture and traditions. The market includes fresh seasonal products, artisanal preserves, traditional bakery products, textile crafts, sustainable ceramics, and much more. There will also be demonstration workshops on traditional techniques, talks on organic farming, and activities for the whole family. This is a perfect opportunity to support the local economy, reduce your carbon footprint by buying local products, and discover the quality and flavor of local products.",
    description_de: "Tauchen Sie ein in den Reichtum der lokalen Produktion auf unserem spezialisierten Markt für Bio-Produkte und nachhaltige Handwerkskunst auf dem Marktplatz von Barcelona. Den ganzen Tag über präsentieren mehr als 30 lokale Produzenten und Handwerker ihre frischen, ökologischen und handgefertigten Produkte. Sie können Landwirte und Handwerker direkt treffen, etwas über ihre nachhaltigen Produktionsmethoden lernen und einzigartige Produkte entdecken, die die lokale Kultur und Traditionen widerspiegeln. Der Markt umfasst frische saisonale Produkte, handwerkliche Konserven, traditionelle Bäckereiprodukte, Textilhandwerk, nachhaltige Keramik und vieles mehr. Es wird auch Demonstrationsworkshops zu traditionellen Techniken, Vorträge über ökologischen Landbau und Aktivitäten für die ganze Familie geben. Dies ist eine perfekte Gelegenheit, die lokale Wirtschaft zu unterstützen, Ihren CO2-Fußabdruck durch den Kauf lokaler Produkte zu reduzieren und die Qualität und den Geschmack lokaler Produkte zu entdecken.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.productoreslocales.org",
    date: "2025-02-08",
    time: "10:00",
    duration: 6,
    location: "Plaza del Mercado, Barcelona",
    location_en: "Market Square, Barcelona",
    location_de: "Marktplatz, Barcelona",
    organizer: "Asociación de Productores Locales",
    organizer_en: "Local Producers Association",
    organizer_de: "Vereinigung lokaler Produzenten",
    category: "community",
    maxVolunteers: 40,
    currentVolunteers: 25,
    requirements: ["Dinero en efectivo (algunos puestos no aceptan tarjeta)", "Bolsa reutilizable o carrito de compras", "Ropa cómoda para caminar", "Agua para hidratación", "Opcional: recipientes para llevar productos frescos", "Cámara para documentar productos (opcional)"],
    requirements_en: ["Cash (some stalls don't accept cards)", "Reusable bag or shopping cart", "Comfortable walking clothes", "Water for hydration", "Optional: containers to carry fresh products", "Camera to document products (optional)"],
    requirements_de: ["Bargeld (einige Stände akzeptieren keine Karten)", "Wiederverwendbare Tasche oder Einkaufswagen", "Bequeme Gehkleidung", "Wasser zur Hydratation", "Optional: Behälter zum Transportieren frischer Produkte", "Kamera zur Dokumentation von Produkten (optional)"],
    benefits: ["Descuentos especiales del 15% en todos los productos", "Degustaciones gratuitas de productos premium", "Red de contactos con productores locales", "Guía de productos locales y sus beneficios", "Talleres demostrativos gratuitos", "Material educativo sobre consumo responsable", "Oportunidades de networking con productores y otros consumidores"],
    benefits_en: ["Special 15% discounts on all products", "Free tastings of premium products", "Network of contacts with local producers", "Guide to local products and their benefits", "Free demonstration workshops", "Educational material on responsible consumption", "Networking opportunities with producers and other consumers"],
    benefits_de: ["Spezielle Rabatte von 15% auf alle Produkte", "Kostenlose Verkostungen von Premium-Produkten", "Netzwerk von Kontakten mit lokalen Produzenten", "Leitfaden zu lokalen Produkten und ihren Vorteilen", "Kostenlose Demonstrationsworkshops", "Bildungsmaterial über verantwortungsvollen Konsum", "Netzwerkmöglichkeiten mit Produzenten und anderen Verbrauchern"],
    contact: "mercado@productoreslocales.es"
  },
  "e4": {
    id: "e4",
    title: "Limpieza del Río Verde y Protección de Ecosistemas Acuáticos",
    title_en: "Green River Cleanup and Aquatic Ecosystem Protection",
    title_de: "Grüner Fluss Reinigung und Schutz aquatischer Ökosysteme",
    description: "Únete a nuestra jornada de limpieza y conservación del Río Verde en Milán para mejorar la calidad del agua y proteger la vida acuática. Durante esta actividad de 3 horas, trabajaremos en la recolección y clasificación de residuos a lo largo de las orillas del río, identificando los tipos de contaminantes más comunes y su impacto en el ecosistema acuático. Aprenderás sobre la importancia de los ríos urbanos como corredores ecológicos, las especies que dependen de ellos, y cómo la contaminación afecta a toda la cadena alimentaria. Realizaremos actividades de clasificación de residuos para su reciclaje adecuado, medición de parámetros básicos de calidad del agua, y educación ambiental sobre la prevención de la contaminación fluvial. Los datos recopilados serán utilizados para crear un informe sobre el estado del río y proponer medidas de protección. Esta es una oportunidad perfecta para contribuir directamente a la mejora de nuestro entorno natural y aprender sobre la importancia de proteger nuestros recursos hídricos.",
    description_en: "Join our cleanup and conservation day at Milan's Green River to improve water quality and protect aquatic life. During this 3-hour activity, we'll work on collecting and sorting waste along the riverbanks, identifying the most common types of pollutants and their impact on the aquatic ecosystem. You'll learn about the importance of urban rivers as ecological corridors, the species that depend on them, and how pollution affects the entire food chain. We'll carry out waste sorting activities for proper recycling, basic water quality parameter measurements, and environmental education on preventing river pollution. The data collected will be used to create a report on the river's condition and propose protection measures. This is a perfect opportunity to directly contribute to improving our natural environment and learn about the importance of protecting our water resources.",
    description_de: "Schließen Sie sich unserem Reinigungs- und Naturschutztag am Grünen Fluss in Mailand an, um die Wasserqualität zu verbessern und das Wasserleben zu schützen. Während dieser 3-stündigen Aktivität arbeiten wir an der Sammlung und Sortierung von Abfällen entlang der Flussufer, identifizieren die häufigsten Arten von Schadstoffen und ihre Auswirkungen auf das aquatische Ökosystem. Sie lernen die Bedeutung städtischer Flüsse als ökologische Korridore, die Arten, die von ihnen abhängen, und wie Verschmutzung die gesamte Nahrungskette beeinflusst. Wir führen Abfallsortierungsaktivitäten für ordnungsgemäßes Recycling, Messungen grundlegender Wasserqualitätsparameter und Umweltbildung zur Verhinderung von Flussverschmutzung durch. Die gesammelten Daten werden verwendet, um einen Bericht über den Zustand des Flusses zu erstellen und Schutzmaßnahmen vorzuschlagen. Dies ist eine perfekte Gelegenheit, direkt zur Verbesserung unserer natürlichen Umwelt beizutragen und mehr über die Bedeutung des Schutzes unserer Wasserressourcen zu erfahren.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    website: "https://www.riverguardians.org",
    date: "2025-02-14",
    time: "08:00",
    duration: 3,
    location: "Río Verde, Milán",
    location_en: "Green River, Milan",
    location_de: "Grüner Fluss, Mailand",
    organizer: "River Guardians",
    organizer_en: "River Guardians",
    organizer_de: "Flusswächter",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 18,
    requirements: ["Guantes de trabajo resistentes", "Ropa cómoda y que puedas ensuciar", "Botas impermeables o zapatos cerrados resistentes al agua", "Agua para hidratación", "Protector solar", "Sombrero o gorra", "Ropa de repuesto (por si te mojas)"],
    requirements_en: ["Resistant work gloves", "Comfortable clothes you can get dirty", "Waterproof boots or closed water-resistant shoes", "Water for hydration", "Sunscreen", "Hat or cap", "Spare clothes (in case you get wet)"],
    requirements_de: ["Widerstandsfähige Arbeitshandschuhe", "Bequeme Kleidung, die schmutzig werden kann", "Wasserdichte Stiefel oder geschlossene wasserfeste Schuhe", "Wasser zur Hydratation", "Sonnencreme", "Hut oder Mütze", "Wechselkleidung (falls Sie nass werden)"],
    benefits: ["Certificado de participación en conservación fluvial", "Refrigerios y bebidas incluidas", "Material educativo sobre ecosistemas acuáticos", "Guía de identificación de especies acuáticas", "Acceso al informe final sobre el estado del río", "Experiencia práctica en conservación ambiental", "Oportunidades de participar en futuras actividades de monitoreo"],
    benefits_en: ["River conservation participation certificate", "Snacks and drinks included", "Educational material on aquatic ecosystems", "Aquatic species identification guide", "Access to final report on river condition", "Hands-on environmental conservation experience", "Opportunities to participate in future monitoring activities"],
    benefits_de: ["Teilnahmezertifikat für Flussnaturschutz", "Snacks und Getränke inbegriffen", "Bildungsmaterial über aquatische Ökosysteme", "Leitfaden zur Identifizierung aquatischer Arten", "Zugang zum Abschlussbericht über den Flusszustand", "Praktische Erfahrung im Umweltschutz", "Möglichkeiten zur Teilnahme an zukünftigen Überwachungsaktivitäten"],
    contact: "rio@guardianes.es"
  },
  "e5": {
    id: "e5",
    title: "Conferencia sobre Cambio Climático y Acción Colectiva",
    title_en: "Climate Change and Collective Action Conference",
    title_de: "Konferenz über Klimawandel und kollektives Handeln",
    description: "Asiste a esta conferencia informativa y motivadora sobre los efectos del cambio climático y las acciones concretas que podemos tomar individual y colectivamente para mitigarlo. Durante esta sesión de 2 horas en el Auditorio Municipal de París, expertos en climatología, activistas ambientales y líderes comunitarios compartirán los últimos datos científicos sobre el cambio climático, sus impactos actuales y futuros, y las soluciones prácticas que están funcionando en diferentes partes del mundo. Exploraremos temas como la transición energética, la movilidad sostenible, la agricultura regenerativa, y la economía circular. La conferencia incluirá presentaciones interactivas, sesiones de preguntas y respuestas, y espacios de networking para conectar con otras personas comprometidas con la acción climática. También presentaremos casos de éxito de comunidades que han logrado reducir significativamente sus emisiones y adaptarse al cambio climático. Esta es una oportunidad única para informarte, inspirarte y encontrar formas concretas de contribuir a la solución del mayor desafío de nuestro tiempo.",
    description_en: "Attend this informative and motivating conference on the effects of climate change and the concrete actions we can take individually and collectively to mitigate it. During this 2-hour session at Paris's Municipal Auditorium, experts in climatology, environmental activists, and community leaders will share the latest scientific data on climate change, its current and future impacts, and practical solutions that are working in different parts of the world. We'll explore topics such as energy transition, sustainable mobility, regenerative agriculture, and the circular economy. The conference will include interactive presentations, Q&A sessions, and networking spaces to connect with other people committed to climate action. We'll also present success stories from communities that have significantly reduced their emissions and adapted to climate change. This is a unique opportunity to inform yourself, get inspired, and find concrete ways to contribute to solving the greatest challenge of our time.",
    description_de: "Nehmen Sie an dieser informativen und motivierenden Konferenz über die Auswirkungen des Klimawandels und die konkreten Maßnahmen teil, die wir individuell und kollektiv ergreifen können, um ihn zu mildern. Während dieser 2-stündigen Sitzung im Städtischen Auditorium von Paris werden Experten für Klimatologie, Umweltaktivisten und Gemeindeführer die neuesten wissenschaftlichen Daten über den Klimawandel, seine aktuellen und zukünftigen Auswirkungen und praktische Lösungen teilen, die in verschiedenen Teilen der Welt funktionieren. Wir werden Themen wie Energiewende, nachhaltige Mobilität, regenerative Landwirtschaft und Kreislaufwirtschaft erkunden. Die Konferenz umfasst interaktive Präsentationen, Frage-und-Antwort-Sitzungen und Networking-Räume, um sich mit anderen Menschen zu verbinden, die sich für Klimaschutzmaßnahmen einsetzen. Wir werden auch Erfolgsgeschichten von Gemeinschaften präsentieren, die ihre Emissionen erheblich reduziert und sich an den Klimawandel angepasst haben. Dies ist eine einzigartige Gelegenheit, sich zu informieren, sich inspirieren zu lassen und konkrete Wege zu finden, um zur Lösung der größten Herausforderung unserer Zeit beizutragen.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.climateinstitute.org",
    date: "2025-03-05",
    time: "18:00",
    duration: 2,
    location: "Auditorio Municipal, París",
    location_en: "Municipal Auditorium, Paris",
    location_de: "Städtisches Auditorium, Paris",
    organizer: "Local Climate Institute",
    organizer_en: "Local Climate Institute",
    organizer_de: "Lokales Klimainstitut",
    category: "education",
    maxVolunteers: 200,
    currentVolunteers: 150,
    requirements: ["Registro previo obligatorio (plazas limitadas)", "Documento de identidad para verificación", "Cuaderno para tomar notas (opcional)", "Preguntas preparadas para la sesión de Q&A (opcional)", "Dispositivo móvil para networking (opcional)"],
    requirements_en: ["Mandatory prior registration (limited places)", "Identity document for verification", "Notebook for taking notes (optional)", "Prepared questions for Q&A session (optional)", "Mobile device for networking (optional)"],
    requirements_de: ["Verbindliche vorherige Anmeldung (begrenzte Plätze)", "Ausweisdokument zur Überprüfung", "Notizbuch zum Mitschreiben (optional)", "Vorbereitete Fragen für die Q&A-Sitzung (optional)", "Mobilgerät für Networking (optional)"],
    benefits: ["Certificado de asistencia acreditado", "Material informativo completo sobre cambio climático", "Acceso a recursos online exclusivos", "Oportunidades de networking con expertos y activistas", "Guía práctica de acciones climáticas", "Descuentos en futuros eventos del instituto", "Participación en grupos de acción climática local"],
    benefits_en: ["Accredited attendance certificate", "Complete informative material on climate change", "Access to exclusive online resources", "Networking opportunities with experts and activists", "Practical guide to climate actions", "Discounts on future institute events", "Participation in local climate action groups"],
    benefits_de: ["Akkreditiertes Teilnahmezertifikat", "Vollständiges Informationsmaterial über Klimawandel", "Zugang zu exklusiven Online-Ressourcen", "Netzwerkmöglichkeiten mit Experten und Aktivisten", "Praktischer Leitfaden für Klimaschutzmaßnahmen", "Rabatte auf zukünftige Veranstaltungen des Instituts", "Teilnahme an lokalen Klimaschutzgruppen"],
    contact: "clima@instituto.es"
  },
  "e6": {
    id: "e6",
    title: "Construcción de Jardines Verticales Urbanos",
    title_en: "Urban Vertical Gardens Construction",
    title_de: "Bau städtischer vertikaler Gärten",
    description: "Aprende a construir jardines verticales en edificios urbanos para mejorar la calidad del aire y la biodiversidad urbana en este taller práctico de 5 horas. Trabajaremos en el Edificio Comercial Centro de Londres, donde instalaremos un jardín vertical completo que servirá como ejemplo y espacio verde para la comunidad. Aprenderás sobre los diferentes sistemas de jardinería vertical, la selección de plantas adecuadas para cada orientación y clima, el diseño de estructuras de soporte, y los sistemas de riego eficientes. También exploraremos los beneficios ambientales de los jardines verticales: reducción de la temperatura urbana, mejora de la calidad del aire, absorción de CO2, y creación de hábitats para polinizadores urbanos. Realizaremos actividades prácticas de instalación, plantación, y configuración del sistema de riego. El jardín que construyamos será mantenido por la comunidad y monitoreado para evaluar su impacto ambiental. Esta es una oportunidad única para aprender técnicas de jardinería urbana innovadoras y contribuir a la creación de espacios verdes en entornos urbanos densos.",
    description_en: "Learn to build vertical gardens on urban buildings to improve air quality and urban biodiversity in this 5-hour practical workshop. We'll work at London's Commercial Center Building, where we'll install a complete vertical garden that will serve as an example and green space for the community. You'll learn about different vertical gardening systems, selecting appropriate plants for each orientation and climate, designing support structures, and efficient irrigation systems. We'll also explore the environmental benefits of vertical gardens: reducing urban temperature, improving air quality, CO2 absorption, and creating habitats for urban pollinators. We'll carry out practical installation, planting, and irrigation system setup activities. The garden we build will be maintained by the community and monitored to evaluate its environmental impact. This is a unique opportunity to learn innovative urban gardening techniques and contribute to creating green spaces in dense urban environments.",
    description_de: "Lernen Sie, vertikale Gärten an städtischen Gebäuden zu bauen, um die Luftqualität und die städtische Biodiversität in diesem 5-stündigen praktischen Workshop zu verbessern. Wir arbeiten am Geschäftszentrum Gebäude in London, wo wir einen vollständigen vertikalen Garten installieren, der als Beispiel und Grünfläche für die Gemeinschaft dienen wird. Sie lernen verschiedene vertikale Gartensysteme, die Auswahl geeigneter Pflanzen für jede Ausrichtung und jedes Klima, das Design von Tragstrukturen und effiziente Bewässerungssysteme kennen. Wir werden auch die Umweltvorteile vertikaler Gärten erkunden: Reduzierung der städtischen Temperatur, Verbesserung der Luftqualität, CO2-Absorption und Schaffung von Lebensräumen für städtische Bestäuber. Wir führen praktische Installations-, Pflanz- und Bewässerungssystemeinrichtungsaktivitäten durch. Der von uns gebaute Garten wird von der Gemeinschaft gepflegt und überwacht, um seine Umweltauswirkungen zu bewerten. Dies ist eine einzigartige Gelegenheit, innovative städtische Gartentechniken zu erlernen und zur Schaffung von Grünflächen in dichten städtischen Umgebungen beizutragen.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.urbangreensolutions.org",
    date: "2025-03-18",
    time: "10:00",
    duration: 5,
    location: "Edificio Comercial Centro, Londres",
    location_en: "Commercial Center Building, London",
    location_de: "Geschäftszentrum Gebäude, London",
    organizer: "Urban Green Solutions",
    organizer_en: "Urban Green Solutions",
    organizer_de: "Städtische Grüne Lösungen",
    category: "environment",
    maxVolunteers: 15,
    currentVolunteers: 8,
    requirements: ["Herramientas básicas de jardinería (proporcionamos si no tienes)", "Ropa de trabajo que puedas ensuciar", "Almuerzo (o podemos coordinar comida compartida)", "Guantes de jardinería", "Agua para hidratación", "Protector solar", "Cuaderno para tomar notas (opcional)"],
    requirements_en: ["Basic gardening tools (we provide if you don't have)", "Work clothes you can get dirty", "Lunch (or we can coordinate shared meal)", "Gardening gloves", "Water for hydration", "Sunscreen", "Notebook for taking notes (optional)"],
    requirements_de: ["Grundlegende Gartengeräte (wir stellen zur Verfügung, wenn Sie keine haben)", "Arbeitskleidung, die schmutzig werden kann", "Mittagessen (oder wir können gemeinsames Essen koordinieren)", "Gartenhandschuhe", "Wasser zur Hydratation", "Sonnencreme", "Notizbuch zum Mitschreiben (optional)"],
    benefits: ["Técnicas completas de jardinería vertical", "Plantas y esquejes para llevar a casa", "Certificado de participación en jardinería urbana", "Manual completo de construcción de jardines verticales", "Acceso a recursos online sobre mantenimiento", "Oportunidades de participar en futuros proyectos", "Experiencia práctica en construcción sostenible"],
    benefits_en: ["Complete vertical gardening techniques", "Plants and cuttings to take home", "Urban gardening participation certificate", "Complete manual on building vertical gardens", "Access to online maintenance resources", "Opportunities to participate in future projects", "Hands-on experience in sustainable construction"],
    benefits_de: ["Vollständige vertikale Gartentechniken", "Pflanzen und Stecklinge zum Mitnehmen", "Teilnahmezertifikat für städtische Gartenarbeit", "Vollständiges Handbuch zum Bau vertikaler Gärten", "Zugang zu Online-Wartungsressourcen", "Möglichkeiten zur Teilnahme an zukünftigen Projekten", "Praktische Erfahrung im nachhaltigen Bauen"],
    contact: "vertical@urbangreen.es"
  },
  "e7": {
    id: "e7",
    title: "Taller Práctico de Compostaje Doméstico",
    title_en: "Practical Home Composting Workshop",
    title_de: "Praktischer Workshop für Kompostierung zu Hause",
    description: "Aprende técnicas de compostaje doméstico para reducir residuos orgánicos y crear fertilizante natural para tus plantas en este taller práctico de 2 horas en el Jardín Comunitario Sur de Berlín. Descubrirás cómo transformar tus residuos de cocina y jardín en abono rico en nutrientes, reduciendo hasta un 30% de tus residuos domésticos. Aprenderás sobre los diferentes métodos de compostaje: compostaje en montón, compostaje en contenedor, vermicompostaje (con lombrices), y bokashi (fermentación). Exploraremos qué materiales se pueden compostar, la proporción correcta de materiales verdes y marrones, cómo mantener la humedad y temperatura adecuadas, y cómo solucionar problemas comunes como malos olores o plagas. Realizaremos actividades prácticas de construcción de una compostera, preparación de materiales, y mantenimiento del proceso. También aprenderás a usar el compost terminado y cómo integrarlo en tu jardín o macetas. Este taller es perfecto para principiantes y personas que quieren mejorar sus técnicas de compostaje.",
    description_en: "Learn home composting techniques to reduce organic waste and create natural fertilizer for your plants in this 2-hour practical workshop at Berlin's South Community Garden. You'll discover how to transform your kitchen and garden waste into nutrient-rich compost, reducing up to 30% of your household waste. You'll learn about different composting methods: pile composting, container composting, vermicomposting (with worms), and bokashi (fermentation). We'll explore what materials can be composted, the correct ratio of green and brown materials, how to maintain proper moisture and temperature, and how to solve common problems like bad odors or pests. We'll carry out practical activities of building a composter, preparing materials, and maintaining the process. You'll also learn to use finished compost and how to integrate it into your garden or pots. This workshop is perfect for beginners and people who want to improve their composting techniques.",
    description_de: "Lernen Sie Techniken für die Kompostierung zu Hause, um organische Abfälle zu reduzieren und natürlichen Dünger für Ihre Pflanzen in diesem 2-stündigen praktischen Workshop im Süd Gemeinschaftsgarten Berlins zu schaffen. Sie werden entdecken, wie Sie Ihre Küchen- und Gartenabfälle in nährstoffreichen Kompost verwandeln können und dabei bis zu 30% Ihrer Haushaltsabfälle reduzieren. Sie lernen verschiedene Kompostierungsmethoden kennen: Haufenkompostierung, Behälterkompostierung, Wurmkompostierung (mit Würmern) und Bokashi (Fermentation). Wir werden erkunden, welche Materialien kompostiert werden können, das richtige Verhältnis von grünen und braunen Materialien, wie man die richtige Feuchtigkeit und Temperatur aufrechterhält, und wie man häufige Probleme wie schlechte Gerüche oder Schädlinge löst. Wir führen praktische Aktivitäten zum Bau eines Komposters, zur Vorbereitung von Materialien und zur Wartung des Prozesses durch. Sie lernen auch, fertigen Kompost zu verwenden und wie Sie ihn in Ihren Garten oder Ihre Töpfe integrieren können. Dieser Workshop ist perfekt für Anfänger und Menschen, die ihre Kompostierungstechniken verbessern möchten.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.compostmasters.org",
    date: "2025-04-12",
    time: "15:00",
    duration: 2,
    location: "Jardín Comunitario Sur, Berlín",
    location_en: "South Community Garden, Berlin",
    location_de: "Süd Gemeinschaftsgarten, Berlin",
    organizer: "Compost Masters",
    organizer_en: "Compost Masters",
    organizer_de: "Kompost Meister",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 16,
    requirements: ["Cuaderno para tomar notas", "Ropa cómoda que puedas ensuciar", "Guantes de jardinería (opcional)", "Interés en reducir residuos", "Opcional: trae muestras de residuos orgánicos de tu casa"],
    requirements_en: ["Notebook for taking notes", "Comfortable clothes you can get dirty", "Gardening gloves (optional)", "Interest in reducing waste", "Optional: bring samples of organic waste from your home"],
    requirements_de: ["Notizbuch zum Mitschreiben", "Bequeme Kleidung, die schmutzig werden kann", "Gartenhandschuhe (optional)", "Interesse an Abfallreduzierung", "Optional: bringen Sie Proben von organischen Abfällen aus Ihrem Zuhause mit"],
    benefits: ["Kit completo de compostaje para empezar", "Manual digital completo sobre compostaje", "Seguimiento online durante 3 meses", "Acceso a comunidad de compostadores", "Guía de solución de problemas", "Certificado de participación", "Descuentos en composteras profesionales"],
    benefits_en: ["Complete composting kit to get started", "Complete digital manual on composting", "Online follow-up for 3 months", "Access to composter community", "Troubleshooting guide", "Participation certificate", "Discounts on professional composters"],
    benefits_de: ["Vollständiges Kompostierungs-Kit zum Einstieg", "Vollständiges digitales Handbuch über Kompostierung", "Online-Nachbetreuung für 3 Monate", "Zugang zur Kompostierer-Gemeinschaft", "Leitfaden zur Fehlerbehebung", "Teilnahmezertifikat", "Rabatte auf professionelle Komposter"],
    contact: "compost@masters.es"
  },
  "e8": {
    id: "e8",
    title: "Carrera Ecológica 5K por la Sostenibilidad",
    title_en: "Eco-Friendly 5K Race for Sustainability",
    title_de: "Ökologischer 5K-Lauf für Nachhaltigkeit",
    description: "Únete a nuestra carrera 5K con enfoque ecológico en el Parque Central de Madrid. Recorreremos rutas verdes mientras promovemos el deporte sostenible y la conciencia ambiental. Esta carrera está diseñada para ser completamente sostenible: utilizaremos vasos reutilizables en las estaciones de hidratación, medallas hechas de materiales reciclados, y todo el evento será carbono neutral mediante la plantación de árboles. La ruta atraviesa los espacios verdes más bellos del parque, pasando por jardines botánicos, lagos naturales, y áreas de conservación. Durante la carrera, habrá puntos informativos sobre conservación ambiental y estaciones de hidratación con agua filtrada. Al finalizar, celebraremos con una feria de productos sostenibles, música en vivo con energía solar, y actividades para toda la familia. Los fondos recaudados se destinarán a proyectos de reforestación urbana. Esta es una oportunidad perfecta para combinar tu pasión por el running con tu compromiso ambiental y conocer a otras personas que comparten tus valores.",
    description_en: "Join our eco-friendly 5K race at Madrid's Central Park. We'll run through green routes while promoting sustainable sports and environmental awareness. This race is designed to be completely sustainable: we'll use reusable cups at hydration stations, medals made from recycled materials, and the entire event will be carbon neutral through tree planting. The route passes through the park's most beautiful green spaces, passing botanical gardens, natural lakes, and conservation areas. During the race, there will be informational points about environmental conservation and hydration stations with filtered water. At the end, we'll celebrate with a sustainable products fair, live music powered by solar energy, and activities for the whole family. Funds raised will go to urban reforestation projects. This is a perfect opportunity to combine your passion for running with your environmental commitment and meet other people who share your values.",
    description_de: "Nehmen Sie an unserem umweltfreundlichen 5K-Lauf im Zentralpark von Madrid teil. Wir laufen durch grüne Routen und fördern nachhaltigen Sport und Umweltbewusstsein. Dieser Lauf ist darauf ausgelegt, vollständig nachhaltig zu sein: Wir verwenden wiederverwendbare Becher an den Hydratationsstationen, Medaillen aus recycelten Materialien, und die gesamte Veranstaltung wird durch Baumpflanzungen kohlenstoffneutral sein. Die Route führt durch die schönsten Grünflächen des Parks, vorbei an botanischen Gärten, natürlichen Seen und Naturschutzgebieten. Während des Laufs gibt es Informationspunkte über Umweltschutz und Hydratationsstationen mit gefiltertem Wasser. Am Ende feiern wir mit einer Messe für nachhaltige Produkte, Live-Musik mit Solarenergie und Aktivitäten für die ganze Familie. Die gesammelten Mittel gehen an städtische Aufforstungsprojekte. Dies ist eine perfekte Gelegenheit, Ihre Leidenschaft für das Laufen mit Ihrem Umweltengagement zu verbinden und andere Menschen zu treffen, die Ihre Werte teilen.",
    image_url: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop",
    website: "https://www.greenrunners.org",
    date: "2025-04-22",
    time: "08:00",
    duration: 2,
    location: "Parque Central, Madrid",
    location_en: "Central Park, Madrid",
    location_de: "Zentralpark, Madrid",
    organizer: "Green Runners",
    organizer_en: "Green Runners",
    organizer_de: "Grüne Läufer",
    category: "community",
    maxVolunteers: 100,
    currentVolunteers: 75,
    requirements: ["Registro previo obligatorio", "Certificado médico de aptitud física (válido 1 año)", "Ropa deportiva cómoda", "Zapatillas de running adecuadas", "Botella de agua reutilizable", "Identificación personal"],
    requirements_en: ["Mandatory prior registration", "Medical certificate of physical fitness (valid 1 year)", "Comfortable sports clothes", "Appropriate running shoes", "Reusable water bottle", "Personal identification"],
    requirements_de: ["Verbindliche vorherige Anmeldung", "Ärztliches Attest der körperlichen Fitness (gültig 1 Jahr)", "Bequeme Sportkleidung", "Geeignete Laufschuhe", "Wiederverwendbare Wasserflasche", "Persönlicher Ausweis"],
    benefits: ["Medalla ecológica hecha de materiales reciclados", "Kit de hidratación sostenible", "Descuentos del 20% en tiendas verdes asociadas", "Certificado de participación carbono neutral", "Acceso a la feria de productos sostenibles", "Fotografías profesionales del evento", "Oportunidades de networking con otros corredores ecológicos"],
    benefits_en: ["Eco-friendly medal made from recycled materials", "Sustainable hydration kit", "20% discounts at associated green stores", "Carbon neutral participation certificate", "Access to sustainable products fair", "Professional event photographs", "Networking opportunities with other eco-runners"],
    benefits_de: ["Umweltfreundliche Medaille aus recycelten Materialien", "Nachhaltiges Hydratations-Kit", "20% Rabatte in verbundenen grünen Läden", "Kohlenstoffneutrales Teilnahmezertifikat", "Zugang zur Messe für nachhaltige Produkte", "Professionelle Event-Fotografien", "Netzwerkmöglichkeiten mit anderen Öko-Läufern"],
    contact: "carrera@greenrunners.es"
  },
  "e9": {
    id: "e9",
    title: "Instalación de Paneles Solares en Escuela Primaria",
    title_en: "Solar Panels Installation at Elementary School",
    title_de: "Solarpanel-Installation an Grundschule",
    description: "Participa en la instalación de paneles solares en la Escuela Primaria Verde de Barcelona para promover las energías renovables y educar a la próxima generación sobre energía limpia. Durante esta jornada completa de 7 horas, instalaremos un sistema fotovoltaico completo que proporcionará energía limpia a la escuela y servirá como herramienta educativa para los estudiantes. Aprenderás sobre el diseño de sistemas solares, la instalación de paneles en techos, el cableado eléctrico seguro, la conexión a la red eléctrica, y el mantenimiento de sistemas fotovoltaicos. Trabajaremos bajo la supervisión de técnicos certificados y seguiremos todos los protocolos de seguridad. Los estudiantes de la escuela participarán en actividades educativas paralelas sobre energía solar, y el sistema será monitoreado para mostrar su producción de energía en tiempo real. Esta instalación reducirá significativamente la huella de carbono de la escuela y servirá como ejemplo para otras instituciones educativas. Esta es una oportunidad única para adquirir experiencia práctica en instalación solar mientras contribuyes a la transición energética y la educación ambiental.",
    description_en: "Participate in the installation of solar panels at Barcelona's Green Elementary School to promote renewable energy and educate the next generation about clean energy. During this full 7-hour day, we'll install a complete photovoltaic system that will provide clean energy to the school and serve as an educational tool for students. You'll learn about solar system design, roof panel installation, safe electrical wiring, grid connection, and photovoltaic system maintenance. We'll work under the supervision of certified technicians and follow all safety protocols. School students will participate in parallel educational activities about solar energy, and the system will be monitored to show its real-time energy production. This installation will significantly reduce the school's carbon footprint and serve as an example for other educational institutions. This is a unique opportunity to gain hands-on experience in solar installation while contributing to the energy transition and environmental education.",
    description_de: "Nehmen Sie an der Installation von Solarpanelen an der Grünen Grundschule in Barcelona teil, um erneuerbare Energien zu fördern und die nächste Generation über saubere Energie zu bilden. Während dieses vollständigen 7-stündigen Tages installieren wir ein vollständiges Photovoltaiksystem, das der Schule saubere Energie liefert und als Bildungsinstrument für Schüler dient. Sie lernen Solarsystemdesign, Dachpanelinstallation, sichere elektrische Verkabelung, Netzanschluss und Wartung von Photovoltaiksystemen kennen. Wir arbeiten unter Aufsicht zertifizierter Techniker und befolgen alle Sicherheitsprotokolle. Die Schüler der Schule werden an parallelen Bildungsaktivitäten über Solarenergie teilnehmen, und das System wird überwacht, um seine Energieerzeugung in Echtzeit zu zeigen. Diese Installation wird den CO2-Fußabdruck der Schule erheblich reduzieren und als Beispiel für andere Bildungseinrichtungen dienen. Dies ist eine einzigartige Gelegenheit, praktische Erfahrungen in der Solarinstallation zu sammeln und gleichzeitig zur Energiewende und Umweltbildung beizutragen.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    website: "https://www.solarcommunity.org",
    date: "2025-05-10",
    time: "09:00",
    duration: 7,
    location: "Escuela Primaria Verde, Barcelona",
    location_en: "Green Elementary School, Barcelona",
    location_de: "Grüne Grundschule, Barcelona",
    organizer: "Solar Community",
    organizer_en: "Solar Community",
    organizer_de: "Solar Gemeinschaft",
    category: "environment",
    maxVolunteers: 12,
    currentVolunteers: 9,
    requirements: ["Experiencia básica en electricidad o construcción (recomendado)", "Herramientas de seguridad (proporcionamos)", "Ropa de trabajo resistente", "Calzado de seguridad con puntera de acero", "Casco de seguridad (proporcionamos)", "Gafas de protección (proporcionamos)", "Condición física adecuada para trabajo en altura"],
    requirements_en: ["Basic experience in electricity or construction (recommended)", "Safety tools (we provide)", "Resistant work clothes", "Safety shoes with steel toe", "Safety helmet (we provide)", "Protection glasses (we provide)", "Adequate physical condition for work at height"],
    requirements_de: ["Grundkenntnisse in Elektrizität oder Bauwesen (empfohlen)", "Sicherheitswerkzeuge (wir stellen zur Verfügung)", "Widerstandsfähige Arbeitskleidung", "Sicherheitsschuhe mit Stahlkappe", "Sicherheitshelm (wir stellen zur Verfügung)", "Schutzbrille (wir stellen zur Verfügung)", "Angemessene körperliche Verfassung für Arbeiten in der Höhe"],
    benefits: ["Certificación técnica en instalación solar", "Material educativo completo sobre energía solar", "Visita técnica guiada del sistema instalado", "Acceso a recursos online sobre mantenimiento", "Experiencia práctica certificada", "Oportunidades de networking con profesionales del sector", "Participación en proyecto educativo de impacto real"],
    benefits_en: ["Technical certification in solar installation", "Complete educational material on solar energy", "Guided technical visit of installed system", "Access to online maintenance resources", "Certified hands-on experience", "Networking opportunities with sector professionals", "Participation in real-impact educational project"],
    benefits_de: ["Technische Zertifizierung in Solarinstallation", "Vollständiges Bildungsmaterial über Solarenergie", "Geführter technischer Besuch des installierten Systems", "Zugang zu Online-Wartungsressourcen", "Zertifizierte praktische Erfahrung", "Netzwerkmöglichkeiten mit Fachleuten des Sektors", "Teilnahme an einem Bildungsprojekt mit realer Wirkung"],
    contact: "solar@community.es"
  },
  "e10": {
    id: "e10",
    title: "Festival Anual de Sostenibilidad y Consumo Responsable",
    title_en: "Annual Sustainability and Responsible Consumption Festival",
    title_de: "Jährliches Festival für Nachhaltigkeit und verantwortungsvollen Konsum",
    description: "Celebra la sostenibilidad en nuestro festival anual más grande en el Centro Cultural de Milán. Durante 6 horas, disfrutarás de una experiencia completa con más de 20 talleres prácticos, charlas inspiradoras de expertos en sostenibilidad, música en vivo con energía renovable, y una amplia variedad de comida local orgánica y vegana. El festival incluye zonas temáticas: área de talleres prácticos (jardinería, reciclaje, energía renovable), zona de charlas y conferencias, mercado de productos sostenibles, área de comida con food trucks ecológicos, zona infantil con actividades educativas, y escenario principal con música y entretenimiento. También habrá demostraciones de tecnologías sostenibles, exposiciones de arte reciclado, y espacios de networking para conectar con otras personas comprometidas con la sostenibilidad. Los fondos recaudados se destinarán a proyectos locales de conservación ambiental. Este es el evento perfecto para toda la familia, donde podrás aprender, disfrutar, y conectarte con la comunidad sostenible mientras celebras nuestro compromiso con el planeta.",
    description_en: "Celebrate sustainability at our biggest annual festival at Milan's Cultural Center. For 6 hours, you'll enjoy a complete experience with more than 20 practical workshops, inspiring talks from sustainability experts, live music powered by renewable energy, and a wide variety of local organic and vegan food. The festival includes themed areas: practical workshops area (gardening, recycling, renewable energy), talks and conferences zone, sustainable products market, food area with eco-friendly food trucks, children's area with educational activities, and main stage with music and entertainment. There will also be demonstrations of sustainable technologies, recycled art exhibitions, and networking spaces to connect with other people committed to sustainability. Funds raised will go to local environmental conservation projects. This is the perfect event for the whole family, where you can learn, enjoy, and connect with the sustainable community while celebrating our commitment to the planet.",
    description_de: "Feiern Sie Nachhaltigkeit auf unserem größten jährlichen Festival im Kulturzentrum von Mailand. Während 6 Stunden genießen Sie eine vollständige Erfahrung mit mehr als 20 praktischen Workshops, inspirierenden Vorträgen von Nachhaltigkeitsexperten, Live-Musik mit erneuerbarer Energie und einer Vielzahl lokaler Bio- und veganer Lebensmittel. Das Festival umfasst Themenbereiche: Bereich für praktische Workshops (Gartenarbeit, Recycling, erneuerbare Energien), Zone für Vorträge und Konferenzen, Markt für nachhaltige Produkte, Essbereich mit umweltfreundlichen Food-Trucks, Kinderbereich mit Bildungsaktivitäten und Hauptbühne mit Musik und Unterhaltung. Es wird auch Demonstrationen nachhaltiger Technologien, Ausstellungen von recyceltem Kunsthandwerk und Networking-Räume geben, um sich mit anderen Menschen zu verbinden, die sich für Nachhaltigkeit einsetzen. Die gesammelten Mittel gehen an lokale Umweltschutzprojekte. Dies ist das perfekte Event für die ganze Familie, bei dem Sie lernen, genießen und sich mit der nachhaltigen Gemeinschaft verbinden können, während Sie unser Engagement für den Planeten feiern.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.greenfestival.org",
    date: "2025-05-25",
    time: "16:00",
    duration: 6,
    location: "Centro Cultural, Milán",
    location_en: "Cultural Center, Milan",
    location_de: "Kulturzentrum, Mailand",
    organizer: "Green Festival",
    organizer_en: "Green Festival",
    organizer_de: "Grünes Festival",
    category: "community",
    maxVolunteers: 200,
    currentVolunteers: 120,
    requirements: ["Entrada gratuita con registro previo", "Ropa cómoda para caminar", "Bolsa reutilizable para productos", "Agua para hidratación", "Opcional: cámara para documentar el evento", "Espíritu de celebración y aprendizaje"],
    requirements_en: ["Free entry with prior registration", "Comfortable walking clothes", "Reusable bag for products", "Water for hydration", "Optional: camera to document the event", "Spirit of celebration and learning"],
    requirements_de: ["Freier Eintritt mit vorheriger Anmeldung", "Bequeme Gehkleidung", "Wiederverwendbare Tasche für Produkte", "Wasser zur Hydratation", "Optional: Kamera zur Dokumentation des Events", "Geist der Feier und des Lernens"],
    benefits: ["Acceso VIP a todas las áreas", "Degustaciones gratuitas de productos premium", "Red de contactos con expositores y participantes", "Guía completa del festival", "Descuentos exclusivos en productos sostenibles", "Acceso prioritario a talleres populares", "Certificado de participación en el festival"],
    benefits_en: ["VIP access to all areas", "Free tastings of premium products", "Network of contacts with exhibitors and participants", "Complete festival guide", "Exclusive discounts on sustainable products", "Priority access to popular workshops", "Festival participation certificate"],
    benefits_de: ["VIP-Zugang zu allen Bereichen", "Kostenlose Verkostungen von Premium-Produkten", "Netzwerk von Kontakten mit Ausstellern und Teilnehmern", "Vollständiger Festival-Führer", "Exklusive Rabatte auf nachhaltige Produkte", "Prioritätszugang zu beliebten Workshops", "Festival-Teilnahmezertifikat"],
    contact: "festival@green.es"
  },
  "e11": {
    id: "e11",
    title: "Monitoreo Ciudadano de Calidad del Aire",
    title_en: "Citizen Air Quality Monitoring",
    title_de: "Bürgerüberwachung der Luftqualität",
    description: "Aprende a usar sensores de calidad del aire y participa en el monitoreo ciudadano de la contaminación atmosférica en el Distrito Industrial de París. Durante esta actividad de 4 horas, te convertirás en un científico ciudadano capacitado para medir y reportar la calidad del aire en tu comunidad. Aprenderás sobre los diferentes tipos de contaminantes atmosféricos (PM2.5, PM10, NO2, O3), cómo funcionan los sensores de calidad del aire, y cómo interpretar los datos que recopilan. Realizaremos mediciones en diferentes puntos del distrito industrial, aprenderás a instalar y mantener sensores, y cómo compartir tus datos con la red global de monitoreo ciudadano. También exploraremos el impacto de la contaminación del aire en la salud pública y cómo los datos ciudadanos pueden influir en las políticas ambientales. Los datos que recopilemos serán utilizados para crear un mapa de calidad del aire del distrito y proponer medidas de mejora. Esta es una oportunidad única para contribuir a la ciencia ciudadana y aprender sobre un problema ambiental crítico que afecta directamente tu salud y la de tu comunidad.",
    description_en: "Learn to use air quality sensors and participate in citizen monitoring of atmospheric pollution in Paris's Industrial District. During this 4-hour activity, you'll become a trained citizen scientist capable of measuring and reporting air quality in your community. You'll learn about different types of atmospheric pollutants (PM2.5, PM10, NO2, O3), how air quality sensors work, and how to interpret the data they collect. We'll take measurements at different points in the industrial district, you'll learn to install and maintain sensors, and how to share your data with the global citizen monitoring network. We'll also explore the impact of air pollution on public health and how citizen data can influence environmental policies. The data we collect will be used to create an air quality map of the district and propose improvement measures. This is a unique opportunity to contribute to citizen science and learn about a critical environmental problem that directly affects your health and that of your community.",
    description_de: "Lernen Sie, Luftqualitätssensoren zu verwenden und nehmen Sie an der Bürgerüberwachung der Luftverschmutzung im Industriegebiet von Paris teil. Während dieser 4-stündigen Aktivität werden Sie ein ausgebildeter Bürgerwissenschaftler, der in der Lage ist, die Luftqualität in Ihrer Gemeinschaft zu messen und zu melden. Sie lernen verschiedene Arten von Luftschadstoffen (PM2.5, PM10, NO2, O3) kennen, wie Luftqualitätssensoren funktionieren und wie Sie die von ihnen gesammelten Daten interpretieren. Wir werden Messungen an verschiedenen Punkten im Industriegebiet durchführen, Sie lernen, Sensoren zu installieren und zu warten, und wie Sie Ihre Daten mit dem globalen Bürgerüberwachungsnetzwerk teilen können. Wir werden auch die Auswirkungen der Luftverschmutzung auf die öffentliche Gesundheit erkunden und wie Bürgermessdaten die Umweltpolitik beeinflussen können. Die von uns gesammelten Daten werden verwendet, um eine Luftqualitätskarte des Bezirks zu erstellen und Verbesserungsmaßnahmen vorzuschlagen. Dies ist eine einzigartige Gelegenheit, zur Bürgerwissenschaft beizutragen und mehr über ein kritisches Umweltproblem zu erfahren, das Ihre Gesundheit und die Ihrer Gemeinschaft direkt beeinflusst.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.cleanair.org",
    date: "2025-06-08",
    time: "13:00",
    duration: 4,
    location: "Distrito Industrial, París",
    location_en: "Industrial District, Paris",
    location_de: "Industriegebiet, Paris",
    organizer: "Clean Air",
    organizer_en: "Clean Air",
    organizer_de: "Saubere Luft",
    category: "environment",
    maxVolunteers: 8,
    currentVolunteers: 6,
    requirements: ["Conocimientos básicos de tecnología", "Smartphone con Android o iOS", "Ropa cómoda para caminar", "Agua para hidratación", "Cuaderno para tomar notas (opcional)", "Interés en ciencia ciudadana"],
    requirements_en: ["Basic knowledge of technology", "Smartphone with Android or iOS", "Comfortable walking clothes", "Water for hydration", "Notebook for taking notes (optional)", "Interest in citizen science"],
    requirements_de: ["Grundkenntnisse in Technologie", "Smartphone mit Android oder iOS", "Bequeme Gehkleidung", "Wasser zur Hydratation", "Notizbuch zum Mitschreiben (optional)", "Interesse an Bürgerwissenschaft"],
    benefits: ["Sensor de calidad del aire personal para llevar a casa", "App de monitoreo completa con acceso de por vida", "Certificado de participación en ciencia ciudadana", "Acceso a la red global de monitoreo ciudadano", "Guía completa de interpretación de datos", "Material educativo sobre contaminación atmosférica", "Oportunidades de participar en proyectos futuros"],
    benefits_en: ["Personal air quality sensor to take home", "Complete monitoring app with lifetime access", "Citizen science participation certificate", "Access to global citizen monitoring network", "Complete data interpretation guide", "Educational material on atmospheric pollution", "Opportunities to participate in future projects"],
    benefits_de: ["Persönlicher Luftqualitätssensor zum Mitnehmen", "Vollständige Überwachungs-App mit lebenslangem Zugang", "Teilnahmezertifikat für Bürgerwissenschaft", "Zugang zum globalen Bürgerüberwachungsnetzwerk", "Vollständiger Leitfaden zur Dateninterpretation", "Bildungsmaterial über Luftverschmutzung", "Möglichkeiten zur Teilnahme an zukünftigen Projekten"],
    contact: "aire@clean.es"
  },
  "e12": {
    id: "e12",
    title: "Cena Comunitaria Vegana y Sostenible",
    title_en: "Community Vegan and Sustainable Dinner",
    title_de: "Gemeinschaftliches veganes und nachhaltiges Abendessen",
    description: "Únete a nuestra cena comunitaria vegana en el Restaurante Verde de Londres para promover una alimentación más sostenible y saludable. Durante esta velada de 2 horas, disfrutarás de un menú completo de 4 platos preparado con ingredientes 100% vegetales, locales y de temporada. El menú incluye entrantes creativos, plato principal nutritivo, postre delicioso, y bebidas naturales. Durante la cena, aprenderás sobre los beneficios ambientales y de salud de una dieta basada en plantas, descubrirás nuevas recetas veganas, y conocerás a otras personas interesadas en alimentación sostenible. También habrá una charla breve sobre nutrición vegana, cómo planificar comidas equilibradas sin productos animales, y cómo reducir tu huella de carbono a través de la alimentación. El restaurante utiliza prácticas sostenibles como cero desperdicios, energía renovable, y proveedores locales. Esta es una oportunidad perfecta para disfrutar de comida deliciosa, aprender sobre alimentación sostenible, y conectarte con una comunidad comprometida con el bienestar personal y planetario.",
    description_en: "Join our community vegan dinner at London's Green Restaurant to promote more sustainable and healthy eating. During this 2-hour evening, you'll enjoy a complete 4-course menu prepared with 100% plant-based, local, and seasonal ingredients. The menu includes creative starters, nutritious main course, delicious dessert, and natural drinks. During dinner, you'll learn about the environmental and health benefits of a plant-based diet, discover new vegan recipes, and meet other people interested in sustainable eating. There will also be a brief talk on vegan nutrition, how to plan balanced meals without animal products, and how to reduce your carbon footprint through food choices. The restaurant uses sustainable practices such as zero waste, renewable energy, and local suppliers. This is a perfect opportunity to enjoy delicious food, learn about sustainable eating, and connect with a community committed to personal and planetary well-being.",
    description_de: "Schließen Sie sich unserem gemeinschaftlichen veganen Abendessen im Grünen Restaurant in London an, um nachhaltigeres und gesünderes Essen zu fördern. Während dieses 2-stündigen Abends genießen Sie ein vollständiges 4-Gänge-Menü, das mit 100% pflanzlichen, lokalen und saisonalen Zutaten zubereitet wird. Das Menü umfasst kreative Vorspeisen, nahrhaftes Hauptgericht, köstliches Dessert und natürliche Getränke. Während des Abendessens lernen Sie die Umwelt- und Gesundheitsvorteile einer pflanzlichen Ernährung kennen, entdecken neue vegane Rezepte und treffen andere Menschen, die sich für nachhaltiges Essen interessieren. Es wird auch einen kurzen Vortrag über vegane Ernährung geben, wie man ausgewogene Mahlzeiten ohne tierische Produkte plant und wie man seinen CO2-Fußabdruck durch Lebensmittelauswahl reduziert. Das Restaurant verwendet nachhaltige Praktiken wie Null-Abfall, erneuerbare Energien und lokale Lieferanten. Dies ist eine perfekte Gelegenheit, köstliches Essen zu genießen, etwas über nachhaltiges Essen zu lernen und sich mit einer Gemeinschaft zu verbinden, die sich dem persönlichen und planetarischen Wohlbefinden verschrieben hat.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.unitedvegans.org",
    date: "2025-06-21",
    time: "19:00",
    duration: 2,
    location: "Restaurante Verde, Londres",
    location_en: "Green Restaurant, London",
    location_de: "Grünes Restaurant, London",
    organizer: "United Vegans",
    organizer_en: "United Vegans",
    organizer_de: "Vereinte Veganer",
    category: "community",
    maxVolunteers: 50,
    currentVolunteers: 35,
    requirements: ["Registro previo obligatorio", "Contribución voluntaria sugerida (cubre costos de ingredientes)", "Apertura a probar nuevos sabores", "Interés en alimentación sostenible", "Opcional: trae un plato vegano para compartir"],
    requirements_en: ["Mandatory prior registration", "Suggested voluntary contribution (covers ingredient costs)", "Openness to trying new flavors", "Interest in sustainable eating", "Optional: bring a vegan dish to share"],
    requirements_de: ["Verbindliche vorherige Anmeldung", "Vorgeschlagener freiwilliger Beitrag (deckt Zutatenkosten)", "Offenheit für neue Geschmacksrichtungen", "Interesse an nachhaltigem Essen", "Optional: bringen Sie ein veganes Gericht zum Teilen mit"],
    benefits: ["Cena completa de 4 platos veganos", "Recetario vegano digital con más de 50 recetas", "Red de contactos con otros comensales", "Charla sobre nutrición vegana", "Guía de alimentación sostenible", "Descuentos en futuros eventos", "Certificado de participación"],
    benefits_en: ["Complete 4-course vegan dinner", "Digital vegan cookbook with more than 50 recipes", "Network of contacts with other diners", "Talk on vegan nutrition", "Sustainable eating guide", "Discounts on future events", "Participation certificate"],
    benefits_de: ["Vollständiges 4-Gänge-veganes Abendessen", "Digitales veganes Kochbuch mit mehr als 50 Rezepten", "Netzwerk von Kontakten mit anderen Gästen", "Vortrag über vegane Ernährung", "Leitfaden für nachhaltiges Essen", "Rabatte auf zukünftige Veranstaltungen", "Teilnahmezertifikat"],
    contact: "vegano@united.es"
  },
  "e13": {
    id: "e13",
    title: "Sesión de Reflexión Ambiental y Planificación Estratégica",
    title_en: "Environmental Reflection and Strategic Planning Session",
    title_de: "Umweltreflexions- und strategische Planungssitzung",
    description: "Participa en nuestra sesión de reflexión sobre los logros ambientales del primer semestre y planifica acciones futuras en la Biblioteca Pública de Berlín. Durante esta sesión interactiva de 2 horas, revisaremos colectivamente los proyectos y actividades ambientales realizadas durante los primeros 6 meses del año, analizaremos qué funcionó bien y qué podemos mejorar, y estableceremos objetivos claros para el segundo semestre. Utilizaremos técnicas de facilitación participativa para que todos puedan compartir sus experiencias, aprendizajes y propuestas. Crearemos un plan de acción colaborativo que incluya nuevas iniciativas, mejoras a proyectos existentes, y estrategias para aumentar el impacto de nuestras acciones. También identificaremos oportunidades de colaboración entre diferentes grupos y organizaciones, y estableceremos métricas para medir nuestro progreso. Esta sesión es esencial para mantener la cohesión del grupo, aprender de nuestras experiencias, y asegurar que nuestras acciones futuras sean más efectivas y alineadas con nuestros objetivos de sostenibilidad.",
    description_en: "Participate in our reflection session on environmental achievements of the first semester and plan future actions at Berlin's Public Library. During this interactive 2-hour session, we'll collectively review the environmental projects and activities carried out during the first 6 months of the year, analyze what worked well and what we can improve, and establish clear objectives for the second semester. We'll use participatory facilitation techniques so everyone can share their experiences, learnings, and proposals. We'll create a collaborative action plan that includes new initiatives, improvements to existing projects, and strategies to increase the impact of our actions. We'll also identify collaboration opportunities between different groups and organizations, and establish metrics to measure our progress. This session is essential to maintain group cohesion, learn from our experiences, and ensure that our future actions are more effective and aligned with our sustainability objectives.",
    description_de: "Nehmen Sie an unserer Reflexionssitzung über die Umweltleistungen des ersten Semesters teil und planen Sie zukünftige Aktionen in der Öffentlichen Bibliothek von Berlin. Während dieser interaktiven 2-stündigen Sitzung werden wir gemeinsam die Umweltprojekte und -aktivitäten überprüfen, die in den ersten 6 Monaten des Jahres durchgeführt wurden, analysieren, was gut funktioniert hat und was wir verbessern können, und klare Ziele für das zweite Semester festlegen. Wir werden partizipative Moderationsmethoden verwenden, damit jeder seine Erfahrungen, Erkenntnisse und Vorschläge teilen kann. Wir erstellen einen kollaborativen Aktionsplan, der neue Initiativen, Verbesserungen bestehender Projekte und Strategien zur Steigerung der Wirkung unserer Aktionen umfasst. Wir werden auch Kooperationsmöglichkeiten zwischen verschiedenen Gruppen und Organisationen identifizieren und Metriken zur Messung unseres Fortschritts festlegen. Diese Sitzung ist wichtig, um den Gruppenzusammenhalt aufrechtzuerhalten, aus unseren Erfahrungen zu lernen und sicherzustellen, dass unsere zukünftigen Aktionen effektiver und mit unseren Nachhaltigkeitszielen ausgerichtet sind.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.greenfuture.org",
    date: "2025-07-15",
    time: "17:00",
    duration: 2,
    location: "Biblioteca Pública, Berlín",
    location_en: "Public Library, Berlin",
    location_de: "Öffentliche Bibliothek, Berlin",
    organizer: "Green Future",
    organizer_en: "Green Future",
    organizer_de: "Grüne Zukunft",
    category: "education",
    maxVolunteers: 40,
    currentVolunteers: 28,
    requirements: ["Participación activa y constructiva", "Cuaderno para tomar notas", "Preparación previa: pensar en logros y desafíos del semestre", "Apertura al diálogo y feedback", "Compromiso con acciones futuras"],
    requirements_en: ["Active and constructive participation", "Notebook for taking notes", "Prior preparation: think about semester achievements and challenges", "Openness to dialogue and feedback", "Commitment to future actions"],
    requirements_de: ["Aktive und konstruktive Teilnahme", "Notizbuch zum Mitschreiben", "Vorbereitung: über Semesterleistungen und Herausforderungen nachdenken", "Offenheit für Dialog und Feedback", "Engagement für zukünftige Aktionen"],
    benefits: ["Informe semestral completo de logros", "Plan de acción colaborativo para el segundo semestre", "Certificado de participación en planificación estratégica", "Acceso a recursos y herramientas de planificación", "Oportunidades de liderazgo en nuevos proyectos", "Red fortalecida de colaboradores", "Métricas de impacto para seguimiento"],
    benefits_en: ["Complete semester report of achievements", "Collaborative action plan for second semester", "Strategic planning participation certificate", "Access to planning resources and tools", "Leadership opportunities in new projects", "Strengthened network of collaborators", "Impact metrics for follow-up"],
    benefits_de: ["Vollständiger Semesterbericht der Leistungen", "Kollaborativer Aktionsplan für das zweite Semester", "Teilnahmezertifikat für strategische Planung", "Zugang zu Planungsressourcen und -werkzeugen", "Führungsmöglichkeiten in neuen Projekten", "Gestärktes Netzwerk von Mitarbeitern", "Wirkungsmetriken für Nachverfolgung"],
    contact: "futuro@green.es"
  },
  "e14": {
    id: "e14",
    title: "Celebración Sostenible de Verano al Aire Libre",
    title_en: "Sustainable Outdoor Summer Celebration",
    title_de: "Nachhaltige Open-Air-Sommerfeier",
    description: "Celebra el verano de manera sostenible en la Plaza Principal de Madrid con música en vivo, comida local y actividades eco-friendly. Durante esta celebración de 4 horas al atardecer, disfrutarás de una experiencia completa que combina entretenimiento, gastronomía sostenible y conciencia ambiental. El evento incluye música en vivo de artistas locales con energía solar, una amplia variedad de comida local orgánica y vegana de food trucks ecológicos, talleres rápidos sobre sostenibilidad, actividades para niños con materiales reciclados, y espacios de networking. Todo el evento está diseñado para ser carbono neutral: utilizaremos energía renovable, vasos y platos reutilizables, separación de residuos, y compensación de emisiones mediante plantación de árboles. También habrá demostraciones de tecnologías sostenibles, exposiciones de arte ambiental, y un mercado de productos locales. Los fondos recaudados se destinarán a proyectos de conservación ambiental local. Esta es la celebración perfecta para toda la familia, donde podrás disfrutar del verano mientras apoyas la sostenibilidad y te conectas con la comunidad verde.",
    description_en: "Celebrate summer sustainably at Madrid's Main Square with live music, local food and eco-friendly activities. During this 4-hour sunset celebration, you'll enjoy a complete experience that combines entertainment, sustainable gastronomy and environmental awareness. The event includes live music from local artists powered by solar energy, a wide variety of local organic and vegan food from eco-friendly food trucks, quick sustainability workshops, activities for children with recycled materials, and networking spaces. The entire event is designed to be carbon neutral: we'll use renewable energy, reusable cups and plates, waste separation, and emission offsetting through tree planting. There will also be demonstrations of sustainable technologies, environmental art exhibitions, and a local products market. Funds raised will go to local environmental conservation projects. This is the perfect celebration for the whole family, where you can enjoy summer while supporting sustainability and connecting with the green community.",
    description_de: "Feiern Sie den Sommer nachhaltig auf dem Hauptplatz von Madrid mit Live-Musik, lokalen Lebensmitteln und umweltfreundlichen Aktivitäten. Während dieser 4-stündigen Sonnenuntergangsfeier genießen Sie eine vollständige Erfahrung, die Unterhaltung, nachhaltige Gastronomie und Umweltbewusstsein kombiniert. Die Veranstaltung umfasst Live-Musik von lokalen Künstlern mit Solarenergie, eine Vielzahl lokaler Bio- und veganer Lebensmittel von umweltfreundlichen Food-Trucks, schnelle Nachhaltigkeitsworkshops, Aktivitäten für Kinder mit recycelten Materialien und Networking-Räume. Die gesamte Veranstaltung ist darauf ausgelegt, kohlenstoffneutral zu sein: Wir verwenden erneuerbare Energien, wiederverwendbare Becher und Teller, Abfalltrennung und Emissionsausgleich durch Baumpflanzungen. Es wird auch Demonstrationen nachhaltiger Technologien, Umweltkunstausstellungen und einen lokalen Produktmarkt geben. Die gesammelten Mittel gehen an lokale Umweltschutzprojekte. Dies ist die perfekte Feier für die ganze Familie, bei der Sie den Sommer genießen können, während Sie Nachhaltigkeit unterstützen und sich mit der grünen Gemeinschaft verbinden.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.greensummer.org",
    date: "2025-07-30",
    time: "20:00",
    duration: 4,
    location: "Plaza Principal, Madrid",
    location_en: "Main Square, Madrid",
    location_de: "Hauptplatz, Madrid",
    organizer: "Green Summer",
    organizer_en: "Green Summer",
    organizer_de: "Grüner Sommer",
    category: "community",
    maxVolunteers: 150,
    currentVolunteers: 90,
    requirements: ["Entrada gratuita con registro previo", "Ropa cómoda para el clima de verano", "Botella de agua reutilizable", "Manta o silla plegable (opcional)", "Espíritu festivo y sostenible"],
    requirements_en: ["Free entry with prior registration", "Comfortable clothes for summer weather", "Reusable water bottle", "Blanket or folding chair (optional)", "Festive and sustainable spirit"],
    requirements_de: ["Freier Eintritt mit vorheriger Anmeldung", "Bequeme Kleidung für Sommerwetter", "Wiederverwendbare Wasserflasche", "Decke oder Klappstuhl (optional)", "Festlicher und nachhaltiger Geist"],
    benefits: ["Acceso VIP a áreas exclusivas", "Degustaciones gratuitas de productos premium", "Souvenirs ecológicos hechos localmente", "Acceso prioritario a talleres", "Fotografías profesionales del evento", "Descuentos en productos sostenibles", "Certificado de participación carbono neutral"],
    benefits_en: ["VIP access to exclusive areas", "Free tastings of premium products", "Eco-friendly souvenirs made locally", "Priority access to workshops", "Professional event photographs", "Discounts on sustainable products", "Carbon neutral participation certificate"],
    benefits_de: ["VIP-Zugang zu exklusiven Bereichen", "Kostenlose Verkostungen von Premium-Produkten", "Lokal hergestellte umweltfreundliche Souvenirs", "Prioritätszugang zu Workshops", "Professionelle Event-Fotografien", "Rabatte auf nachhaltige Produkte", "Kohlenstoffneutrales Teilnahmezertifikat"],
    contact: "verano@green.es"
  },
  "e15": {
    id: "e15",
    title: "Plantación de Especies Otoñales y Preparación para el Invierno",
    title_en: "Autumn Species Planting and Winter Preparation",
    title_de: "Herbstartenpflanzung und Wintervorbereitung",
    description: "Únete a nuestra plantación de especies otoñales en el Parque del Otoño de Barcelona para preparar el ecosistema para el invierno y asegurar su resiliencia durante los meses fríos. Durante esta actividad de 4 horas, plantaremos especies nativas especialmente seleccionadas para el otoño que son resistentes al frío y proporcionan alimento y refugio para la fauna durante el invierno. Aprenderás sobre la importancia de la plantación otoñal, qué especies son más adecuadas para esta temporada, técnicas de plantación que aseguran el éxito durante el invierno, y cómo proteger las plantas jóvenes del frío. Realizaremos actividades de preparación del suelo, plantación de árboles y arbustos, aplicación de mantillo protector, y construcción de refugios para fauna. También aprenderás sobre el ciclo de vida de las plantas en otoño, cómo preparan sus sistemas para el invierno, y la importancia de la biodiversidad estacional. Las plantas que plantemos serán monitoreadas durante el invierno y la primavera para evaluar su adaptación. Esta es una oportunidad perfecta para contribuir a la resiliencia del ecosistema y aprender sobre la preparación de espacios verdes para las estaciones frías.",
    description_en: "Join our planting of autumn species at Barcelona's Autumn Park to prepare the ecosystem for winter and ensure its resilience during the cold months. During this 4-hour activity, we'll plant native species specially selected for autumn that are cold-resistant and provide food and shelter for wildlife during winter. You'll learn about the importance of autumn planting, which species are most suitable for this season, planting techniques that ensure success during winter, and how to protect young plants from the cold. We'll carry out soil preparation activities, planting of trees and shrubs, application of protective mulch, and building wildlife refuges. You'll also learn about the life cycle of plants in autumn, how they prepare their systems for winter, and the importance of seasonal biodiversity. The plants we plant will be monitored during winter and spring to evaluate their adaptation. This is a perfect opportunity to contribute to ecosystem resilience and learn about preparing green spaces for cold seasons.",
    description_de: "Schließen Sie sich unserer Pflanzung von Herbstarten im Park des Herbstes in Barcelona an, um das Ökosystem auf den Winter vorzubereiten und seine Widerstandsfähigkeit während der kalten Monate sicherzustellen. Während dieser 4-stündigen Aktivität pflanzen wir einheimische Arten, die speziell für den Herbst ausgewählt wurden und kälteresistent sind und Nahrung und Unterschlupf für Wildtiere im Winter bieten. Sie lernen die Bedeutung der Herbstpflanzung, welche Arten für diese Saison am besten geeignet sind, Pflanztechniken, die den Erfolg im Winter sicherstellen, und wie man junge Pflanzen vor der Kälte schützt. Wir führen Bodenvorbereitungsaktivitäten, Pflanzung von Bäumen und Sträuchern, Anwendung von Schutzmulch und Bau von Wildtierunterkünften durch. Sie lernen auch den Lebenszyklus von Pflanzen im Herbst, wie sie ihre Systeme auf den Winter vorbereiten, und die Bedeutung der saisonalen Biodiversität kennen. Die von uns gepflanzten Pflanzen werden im Winter und Frühling überwacht, um ihre Anpassung zu bewerten. Dies ist eine perfekte Gelegenheit, zur Widerstandsfähigkeit des Ökosystems beizutragen und zu lernen, wie man Grünflächen für kalte Jahreszeiten vorbereitet.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.autumnplanters.org",
    date: "2025-10-05",
    time: "10:00",
    duration: 4,
    location: "Parque del Otoño, Barcelona",
    location_en: "Autumn Park, Barcelona",
    location_de: "Park des Herbstes, Barcelona",
    organizer: "Autumn Planters",
    organizer_en: "Autumn Planters",
    organizer_de: "Herbstpflanzer",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 18,
    requirements: ["Ropa cómoda y abrigada (el clima puede ser fresco)", "Guantes de jardinería resistentes", "Agua para hidratación", "Botas o zapatos cerrados", "Herramientas básicas (proporcionamos si no tienes)", "Protector solar (aunque sea otoño)"],
    requirements_en: ["Comfortable and warm clothes (weather can be cool)", "Resistant gardening gloves", "Water for hydration", "Boots or closed shoes", "Basic tools (we provide if you don't have)", "Sunscreen (even though it's autumn)"],
    requirements_de: ["Bequeme und warme Kleidung (Wetter kann kühl sein)", "Widerstandsfähige Gartenhandschuhe", "Wasser zur Hydratation", "Stiefel oder geschlossene Schuhe", "Grundwerkzeuge (wir stellen zur Verfügung, wenn Sie keine haben)", "Sonnencreme (obwohl es Herbst ist)"],
    benefits: ["Plantas y esquejes para llevar a casa", "Certificado de participación en plantación otoñal", "Refrigerio y bebidas calientes incluidas", "Guía de especies otoñales y su cuidado", "Acceso a recursos online sobre preparación invernal", "Oportunidades de participar en monitoreo invernal", "Experiencia práctica en jardinería estacional"],
    benefits_en: ["Plants and cuttings to take home", "Autumn planting participation certificate", "Snack and hot drinks included", "Guide to autumn species and their care", "Access to online resources on winter preparation", "Opportunities to participate in winter monitoring", "Hands-on experience in seasonal gardening"],
    benefits_de: ["Pflanzen und Stecklinge zum Mitnehmen", "Teilnahmezertifikat für Herbstpflanzung", "Snack und heiße Getränke inbegriffen", "Leitfaden zu Herbstarten und ihrer Pflege", "Zugang zu Online-Ressourcen zur Wintervorbereitung", "Möglichkeiten zur Teilnahme an Winterüberwachung", "Praktische Erfahrung in saisonaler Gartenarbeit"],
    contact: "otono@planters.es"
  },
  "e15b": {
    id: "e15b",
    title: "Ruta en bici por la ciudad",
    title_en: "City Bike Tour",
    title_de: "Stadtradtour",
    description: "Descubre los espacios verdes y proyectos sostenibles más importantes de París en esta ruta guiada en bicicleta de 2 horas por el centro histórico. Nuestro recorrido de aproximadamente 15 km te llevará por parques urbanos, jardines comunitarios, edificios con certificación ecológica, y proyectos de movilidad sostenible. Aprenderás sobre la historia de la infraestructura verde de París, cómo la ciudad está transformando espacios urbanos en áreas verdes, y los beneficios ambientales de la movilidad en bicicleta. El guía compartirá información sobre iniciativas locales de sostenibilidad, cómo los ciudadanos pueden participar en proyectos verdes, y consejos prácticos para usar la bicicleta como medio de transporte diario. También visitaremos puntos de interés como sistemas de bicicletas compartidas, carriles bici innovadores, y espacios verdes que han sido restaurados por la comunidad. Esta es una forma perfecta de combinar ejercicio, turismo sostenible, y aprendizaje sobre sostenibilidad urbana. El ritmo es moderado y adecuado para ciclistas de todos los niveles. Al finalizar, recibirás un mapa verde completo de la ciudad con todos los puntos de interés sostenible.",
    description_en: "Discover the most important green spaces and sustainable projects in Paris on this 2-hour guided bike tour through the historic center. Our approximately 15 km route will take you through urban parks, community gardens, eco-certified buildings, and sustainable mobility projects. You'll learn about the history of Paris's green infrastructure, how the city is transforming urban spaces into green areas, and the environmental benefits of bicycle mobility. The guide will share information about local sustainability initiatives, how citizens can participate in green projects, and practical tips for using bicycles as daily transportation. We'll also visit points of interest such as bike-sharing systems, innovative bike lanes, and green spaces that have been restored by the community. This is a perfect way to combine exercise, sustainable tourism, and learning about urban sustainability. The pace is moderate and suitable for cyclists of all levels. At the end, you'll receive a complete green map of the city with all sustainable points of interest.",
    description_de: "Entdecken Sie die wichtigsten grünen Räume und nachhaltigen Projekte in Paris auf dieser 2-stündigen geführten Radtour durch das historische Zentrum. Unsere etwa 15 km lange Route führt Sie durch Stadtparks, Gemeinschaftsgärten, ökologisch zertifizierte Gebäude und nachhaltige Mobilitätsprojekte. Sie lernen die Geschichte der grünen Infrastruktur von Paris kennen, wie die Stadt städtische Räume in Grünflächen verwandelt, und die Umweltvorteile der Fahrradmobilität. Der Führer teilt Informationen über lokale Nachhaltigkeitsinitiativen, wie Bürger an grünen Projekten teilnehmen können, und praktische Tipps zur Nutzung von Fahrrädern als tägliches Verkehrsmittel. Wir besuchen auch Sehenswürdigkeiten wie Fahrradverleihsysteme, innovative Fahrradwege und Grünflächen, die von der Gemeinschaft restauriert wurden. Dies ist eine perfekte Möglichkeit, Bewegung, nachhaltigen Tourismus und Lernen über urbane Nachhaltigkeit zu kombinieren. Das Tempo ist moderat und für Radfahrer aller Niveaus geeignet. Am Ende erhalten Sie eine vollständige grüne Karte der Stadt mit allen nachhaltigen Sehenswürdigkeiten.",
    image_url: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop",
    website: "https://www.greenbikes.org",
    date: "2025-10-08",
    time: "10:00",
    duration: 2,
    location: "Centro Histórico, París",
    location_en: "Historic Center, Paris",
    location_de: "Historisches Zentrum, Paris",
    organizer: "Green Bikes",
    organizer_en: "Green Bikes",
    organizer_de: "Grüne Fahrräder",
    category: "community",
    maxVolunteers: 30,
    currentVolunteers: 10,
    requirements: ["Bicicleta propia en buen estado (o alquiler disponible con descuento)", "Casco obligatorio", "Botella de agua", "Ropa cómoda para andar en bicicleta", "Calzado adecuado para pedalear", "Condición física básica para pedalear durante 2 horas", "Conocimientos básicos de manejo de bicicleta"],
    requirements_en: ["Own bicycle in good condition (or rental available with discount)", "Mandatory helmet", "Water bottle", "Comfortable clothes for cycling", "Appropriate footwear for pedaling", "Basic physical condition to pedal for 2 hours", "Basic bicycle handling skills"],
    requirements_de: ["Eigenes Fahrrad in gutem Zustand (oder Miete mit Rabatt verfügbar)", "Verbindlicher Helm", "Wasserflasche", "Bequeme Kleidung zum Radfahren", "Angemessenes Schuhwerk zum Treten", "Grundlegende körperliche Verfassung zum 2-stündigen Radfahren", "Grundlegende Fahrradhandhabungsfähigkeiten"],
    benefits: ["Guía turística profesional especializada en sostenibilidad", "Mapa verde completo de la ciudad con puntos de interés", "Descuentos del 20% en restaurantes y cafés locales sostenibles", "Acceso a información sobre proyectos verdes de la ciudad", "Certificado de participación", "Fotos del recorrido compartidas digitalmente", "Descuento en futuras rutas guiadas", "Lista de recursos de movilidad sostenible"],
    benefits_en: ["Professional tour guide specialized in sustainability", "Complete green map of the city with points of interest", "20% discounts at local sustainable restaurants and cafes", "Access to information about city green projects", "Participation certificate", "Tour photos shared digitally", "Discount on future guided tours", "List of sustainable mobility resources"],
    benefits_de: ["Professioneller Reiseführer, spezialisiert auf Nachhaltigkeit", "Vollständige grüne Karte der Stadt mit Sehenswürdigkeiten", "20% Rabatt in lokalen nachhaltigen Restaurants und Cafés", "Zugang zu Informationen über städtische grüne Projekte", "Teilnahmezertifikat", "Tour-Fotos digital geteilt", "Rabatt auf zukünftige geführte Touren", "Liste nachhaltiger Mobilitätsressourcen"],
    contact: "bici@green.es"
  },
  "e16": {
    id: "e16",
    title: "Taller de Conservación de Alimentos Tradicional y Moderno",
    title_en: "Traditional and Modern Food Preservation Workshop",
    title_de: "Workshop: Traditionelle und moderne Lebensmittelkonservierung",
    description: "Aprende técnicas tradicionales y modernas para conservar alimentos y reducir el desperdicio en este taller práctico de 3 horas en el Centro Culinario Verde de Milán. Descubrirás cómo nuestros antepasados conservaban alimentos sin refrigeración y cómo adaptar esas técnicas a la vida moderna. Aprenderás sobre diferentes métodos de conservación: deshidratación, enlatado, fermentación, encurtido, conservas en aceite, y técnicas modernas como el envasado al vacío. Realizaremos actividades prácticas donde conservarás tus propios alimentos: prepararás conservas de tomate, mermeladas naturales, vegetales encurtidos, y frutas deshidratadas. También aprenderás sobre seguridad alimentaria, cómo identificar alimentos en mal estado, almacenamiento adecuado, y cómo reducir el desperdicio mediante técnicas de conservación. Exploraremos cómo la conservación de alimentos puede ayudarte a ahorrar dinero, comer más saludablemente, y reducir tu impacto ambiental. Al finalizar, te llevarás los alimentos que conservaste y un manual completo con todas las técnicas aprendidas.",
    description_en: "Learn traditional and modern techniques to preserve food and reduce waste in this 3-hour practical workshop at Milan's Green Culinary Center. You'll discover how our ancestors preserved food without refrigeration and how to adapt those techniques to modern life. You'll learn about different preservation methods: dehydration, canning, fermentation, pickling, oil preserves, and modern techniques like vacuum sealing. We'll carry out practical activities where you'll preserve your own food: you'll prepare tomato preserves, natural jams, pickled vegetables, and dried fruits. You'll also learn about food safety, how to identify spoiled food, proper storage, and how to reduce waste through preservation techniques. We'll explore how food preservation can help you save money, eat healthier, and reduce your environmental impact. At the end, you'll take home the food you preserved and a complete manual with all the techniques learned.",
    description_de: "Lernen Sie traditionelle und moderne Techniken zur Konservierung von Lebensmitteln und zur Reduzierung von Abfällen in diesem 3-stündigen praktischen Workshop im Grünen Kulinarischen Zentrum von Mailand. Sie werden entdecken, wie unsere Vorfahren Lebensmittel ohne Kühlung konservierten und wie Sie diese Techniken an das moderne Leben anpassen können. Sie lernen verschiedene Konservierungsmethoden kennen: Dehydratisierung, Einmachen, Fermentation, Einlegen, Ölkonserven und moderne Techniken wie Vakuumversiegelung. Wir führen praktische Aktivitäten durch, bei denen Sie Ihre eigenen Lebensmittel konservieren: Sie bereiten Tomatenkonserven, natürliche Marmeladen, eingelegtes Gemüse und getrocknete Früchte zu. Sie lernen auch etwas über Lebensmittelsicherheit, wie man verdorbene Lebensmittel erkennt, ordnungsgemäße Lagerung und wie man Abfälle durch Konservierungstechniken reduziert. Wir werden erkunden, wie die Lebensmittelkonservierung Ihnen helfen kann, Geld zu sparen, gesünder zu essen und Ihre Umweltauswirkungen zu reduzieren. Am Ende nehmen Sie die von Ihnen konservierten Lebensmittel und ein vollständiges Handbuch mit allen erlernten Techniken mit nach Hause.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.sustainablekitchen.org",
    date: "2025-10-12",
    time: "14:00",
    duration: 3,
    location: "Centro Culinario Verde, Milán",
    location_en: "Green Culinary Center, Milan",
    location_de: "Grünes Kulinarisches Zentrum, Mailand",
    organizer: "Sustainable Kitchen",
    organizer_en: "Sustainable Kitchen",
    organizer_de: "Nachhaltige Küche",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Delantal de cocina", "Cuaderno para tomar notas", "Recipientes de vidrio con tapa (proporcionamos algunos)", "Ropa cómoda", "Interés en reducir desperdicios", "Opcional: trae frutas o verduras de temporada para conservar"],
    requirements_en: ["Kitchen apron", "Notebook for taking notes", "Glass containers with lid (we provide some)", "Comfortable clothes", "Interest in reducing waste", "Optional: bring seasonal fruits or vegetables to preserve"],
    requirements_de: ["Küchenschürze", "Notizbuch zum Mitschreiben", "Glasbehälter mit Deckel (wir stellen einige zur Verfügung)", "Bequeme Kleidung", "Interesse an Abfallreduzierung", "Optional: bringen Sie saisonale Früchte oder Gemüse zum Konservieren mit"],
    benefits: ["Alimentos conservados que preparaste para llevar a casa", "Recetario completo con más de 30 recetas de conservación", "Certificado de participación", "Manual completo de técnicas de conservación", "Guía de seguridad alimentaria", "Acceso a recursos online adicionales", "Descuentos en equipos de conservación"],
    benefits_en: ["Preserved food you prepared to take home", "Complete cookbook with more than 30 preservation recipes", "Participation certificate", "Complete manual on preservation techniques", "Food safety guide", "Access to additional online resources", "Discounts on preservation equipment"],
    benefits_de: ["Konservierte Lebensmittel, die Sie zubereitet haben, zum Mitnehmen", "Vollständiges Kochbuch mit mehr als 30 Konservierungsrezepten", "Teilnahmezertifikat", "Vollständiges Handbuch über Konservierungstechniken", "Leitfaden zur Lebensmittelsicherheit", "Zugang zu zusätzlichen Online-Ressourcen", "Rabatte auf Konservierungsausrüstung"],
    contact: "conservacion@sustainable.es"
  },
  "e16b": {
    id: "e16b",
    title: "Workshop: Kompostieren zu Hause",
    title_en: "Home Composting Workshop",
    title_de: "Workshop: Kompostieren zu Hause",
    description: "Lerne die Grundlagen des Kompostierens zu Hause in diesem praktischen 2-stündigen Workshop, der perfekt für Anfänger und Familien geeignet ist. Du wirst verschiedene Kompostierungsmethoden kennenlernen, die für städtische Umgebungen geeignet sind: Kompostbehälter, Wurmkompostierung (Vermicomposting), Bokashi-Fermentation, und Kompostierung im Freien. Wir erklären, welche Materialien kompostierbar sind, welche vermieden werden sollten, und wie man das richtige Verhältnis von grünen zu braunen Materialien erreicht. Du lernst, wie man einen Komposthaufen startet, wie man ihn pflegt, Probleme wie Gerüche oder Schädlinge löst, und wie man erkennt, wann der Kompost fertig ist. Der Workshop beinhaltet praktische Übungen, bei denen du deinen eigenen kleinen Kompostbehälter einrichten wirst. Wir behandeln auch Themen wie die Vorteile von Kompost für den Garten, wie Kompostierung zur Reduzierung von Abfällen beiträgt, und wie man Kompost in verschiedenen Größen von Wohnungen bis zu Gärten verwendet. Am Ende wirst du alle Informationen haben, die du brauchst, um erfolgreich zu Hause zu kompostieren und deine eigenen nährstoffreichen Dünger herzustellen.",
    description_en: "Learn the basics of home composting in this practical 2-hour workshop, perfect for beginners and families. You'll learn about different composting methods suitable for urban environments: compost bins, vermicomposting, Bokashi fermentation, and outdoor composting. We'll explain which materials are compostable, which should be avoided, and how to achieve the right ratio of green to brown materials. You'll learn how to start a compost pile, how to maintain it, solve problems like odors or pests, and how to recognize when compost is ready. The workshop includes practical exercises where you'll set up your own small compost bin. We'll also cover topics like the benefits of compost for the garden, how composting contributes to waste reduction, and how to use compost in different sizes from apartments to gardens. At the end, you'll have all the information you need to successfully compost at home and produce your own nutrient-rich fertilizer.",
    description_de: "Lernen Sie die Grundlagen des Kompostierens zu Hause in diesem praktischen 2-stündigen Workshop, der perfekt für Anfänger und Familien geeignet ist. Sie lernen verschiedene Kompostierungsmethoden kennen, die für städtische Umgebungen geeignet sind: Kompostbehälter, Wurmkompostierung (Vermicomposting), Bokashi-Fermentation und Kompostierung im Freien. Wir erklären, welche Materialien kompostierbar sind, welche vermieden werden sollten, und wie man das richtige Verhältnis von grünen zu braunen Materialien erreicht. Sie lernen, wie man einen Komposthaufen startet, wie man ihn pflegt, Probleme wie Gerüche oder Schädlinge löst und wie man erkennt, wann der Kompost fertig ist. Der Workshop beinhaltet praktische Übungen, bei denen Sie Ihren eigenen kleinen Kompostbehälter einrichten werden. Wir behandeln auch Themen wie die Vorteile von Kompost für den Garten, wie Kompostierung zur Reduzierung von Abfällen beiträgt und wie man Kompost in verschiedenen Größen von Wohnungen bis zu Gärten verwendet. Am Ende haben Sie alle Informationen, die Sie brauchen, um erfolgreich zu Hause zu kompostieren und Ihren eigenen nährstoffreichen Dünger herzustellen.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.compostmasters.org",
    date: "2025-10-15",
    time: "18:00",
    duration: 2,
    location: "Nachbarschaftszentrum, Berlin",
    location_en: "Neighborhood Center, Berlin",
    location_de: "Nachbarschaftszentrum, Berlin",
    organizer: "Compost Masters",
    organizer_en: "Compost Masters",
    organizer_de: "Kompost Meister",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 11,
    requirements: ["Notizbuch zum Mitschreiben", "Saubere organische Küchenabfälle (optional, zum Üben)", "Ropa, die schmutzig werden kann", "Interesse an Abfallreduzierung und Gartenarbeit", "Optional: kleiner Behälter für den Kompost (wir stellen auch welche zur Verfügung)"],
    requirements_en: ["Notebook for taking notes", "Clean organic kitchen waste (optional, for practice)", "Clothes that can get dirty", "Interest in waste reduction and gardening", "Optional: small container for compost (we also provide some)"],
    requirements_de: ["Notizbuch zum Mitschreiben", "Saubere organische Küchenabfälle (optional, zum Üben)", "Kleidung, die schmutzig werden kann", "Interesse an Abfallreduzierung und Gartenarbeit", "Optional: kleiner Behälter für den Kompost (wir stellen auch welche zur Verfügung)"],
    benefits: ["Kompostierungs-Kit für den Start zu Hause", "Praktisches Handbuch mit Schritt-für-Schritt-Anleitungen", "Online-Support-Gruppe für Fragen und Tipps", "Zugang zu Video-Tutorials", "Liste lokaler Kompostierungsressourcen", "Zertifikat der Teilnahme", "Rabatt auf Kompostierungsausrüstung", "Zugang zu monatlichen Kompostierungs-Treffen"],
    benefits_en: ["Composting kit to get started at home", "Practical manual with step-by-step instructions", "Online support group for questions and tips", "Access to video tutorials", "List of local composting resources", "Participation certificate", "Discount on composting equipment", "Access to monthly composting meetings"],
    benefits_de: ["Kompostierungs-Kit für den Start zu Hause", "Praktisches Handbuch mit Schritt-für-Schritt-Anleitungen", "Online-Support-Gruppe für Fragen und Tipps", "Zugang zu Video-Tutorials", "Liste lokaler Kompostierungsressourcen", "Teilnahmezertifikat", "Rabatt auf Kompostierungsausrüstung", "Zugang zu monatlichen Kompostierungs-Treffen"],
    contact: "compost@masters.de"
  },
  "e17": {
    id: "e17",
    title: "Limpieza del Bosque Otoñal y Mantenimiento del Ecosistema",
    title_en: "Autumn Forest Cleanup and Ecosystem Maintenance",
    title_de: "Herbstwaldreinigung und Ökosystempflege",
    description: "Participa en la limpieza del bosque otoñal para mantener el ecosistema saludable durante el cambio de estación. Durante esta actividad de 3 horas, trabajaremos en la recolección de residuos, limpieza de senderos, y mantenimiento de áreas naturales que son especialmente importantes durante la transición al invierno. Aprenderás sobre la importancia de mantener los bosques limpios para la salud del ecosistema, cómo los residuos afectan a la fauna y flora durante el invierno, y las mejores prácticas para la conservación forestal. Realizaremos actividades de clasificación de residuos para reciclaje, limpieza de áreas de anidación, y preparación de refugios para animales. También aprenderás sobre las especies que habitan el bosque durante el otoño, cómo se preparan para el invierno, y cómo podemos ayudarlas. Los datos recopilados sobre tipos de residuos serán utilizados para crear campañas de concienciación. Esta es una oportunidad perfecta para contribuir a la salud del ecosistema forestal y aprender sobre la importancia de mantener nuestros espacios naturales limpios y saludables durante todo el año.",
    description_en: "Participate in the autumn forest cleanup to keep the ecosystem healthy during the season change. During this 3-hour activity, we'll work on waste collection, trail cleaning, and maintenance of natural areas that are especially important during the transition to winter. You'll learn about the importance of keeping forests clean for ecosystem health, how waste affects wildlife and flora during winter, and best practices for forest conservation. We'll carry out waste sorting activities for recycling, cleaning of nesting areas, and preparing animal refuges. You'll also learn about the species that inhabit the forest during autumn, how they prepare for winter, and how we can help them. Data collected on types of waste will be used to create awareness campaigns. This is a perfect opportunity to contribute to forest ecosystem health and learn about the importance of keeping our natural spaces clean and healthy throughout the year.",
    description_de: "Nehmen Sie an der Herbstwaldreinigung teil, um das Ökosystem während des Jahreszeitenwechsels gesund zu halten. Während dieser 3-stündigen Aktivität arbeiten wir an der Abfallsammlung, Wegreinigung und Wartung von Naturgebieten, die während des Übergangs zum Winter besonders wichtig sind. Sie lernen die Bedeutung der Sauberhaltung von Wäldern für die Ökosystemgesundheit, wie Abfälle Wildtiere und Flora im Winter beeinflussen, und bewährte Praktiken für den Waldschutz kennen. Wir führen Abfallsortierungsaktivitäten für Recycling, Reinigung von Nistgebieten und Vorbereitung von Tierunterkünften durch. Sie lernen auch die Arten kennen, die den Wald im Herbst bewohnen, wie sie sich auf den Winter vorbereiten, und wie wir ihnen helfen können. Die gesammelten Daten über Abfallarten werden verwendet, um Sensibilisierungskampagnen zu erstellen. Dies ist eine perfekte Gelegenheit, zur Gesundheit des Waldökosystems beizutragen und mehr über die Bedeutung der Sauberhaltung unserer Naturräume das ganze Jahr über zu erfahren.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.forestguardians.org",
    date: "2025-10-19",
    time: "09:00",
    duration: 3,
    location: "Bosque de Otoño, París",
    location_en: "Autumn Forest, Paris",
    location_de: "Herbstwald, Paris",
    organizer: "Forest Guardians",
    organizer_en: "Forest Guardians",
    organizer_de: "Waldschützer",
    category: "environment",
    maxVolunteers: 30,
    currentVolunteers: 22,
    requirements: ["Ropa resistente y abrigada", "Guantes de trabajo resistentes", "Botas o zapatos cerrados", "Agua para hidratación", "Bolsa para recoger residuos (proporcionamos)", "Protector solar", "Ropa de repuesto (opcional)"],
    requirements_en: ["Resistant and warm clothing", "Resistant work gloves", "Boots or closed shoes", "Water for hydration", "Bag for collecting waste (we provide)", "Sunscreen", "Spare clothes (optional)"],
    requirements_de: ["Widerstandsfähige und warme Kleidung", "Widerstandsfähige Arbeitshandschuhe", "Stiefel oder geschlossene Schuhe", "Wasser zur Hydratation", "Tasche zum Sammeln von Abfällen (wir stellen zur Verfügung)", "Sonnencreme", "Wechselkleidung (optional)"],
    benefits: ["Certificado de participación en conservación forestal", "Refrigerio y bebidas calientes incluidas", "Material educativo sobre ecosistemas forestales", "Guía de identificación de especies otoñales", "Acceso a datos del estudio de residuos", "Experiencia práctica en conservación", "Oportunidades de participar en futuras actividades"],
    benefits_en: ["Forest conservation participation certificate", "Snack and hot drinks included", "Educational material on forest ecosystems", "Guide to identifying autumn species", "Access to waste study data", "Hands-on conservation experience", "Opportunities to participate in future activities"],
    benefits_de: ["Teilnahmezertifikat für Waldschutz", "Snack und heiße Getränke inbegriffen", "Bildungsmaterial über Waldökosysteme", "Leitfaden zur Identifizierung von Herbstarten", "Zugang zu Abfallstudien-Daten", "Praktische Erfahrung im Naturschutz", "Möglichkeiten zur Teilnahme an zukünftigen Aktivitäten"],
    contact: "bosque@guardians.es"
  },
  "e17b": {
    id: "e17b",
    title: "Taller Práctico de Huertos Urbanos en Espacios Pequeños",
    title_en: "Practical Urban Garden Workshop for Small Spaces",
    title_de: "Praktischer Workshop für städtische Gärten in kleinen Räumen",
    description: "Aprende a crear y mantener un huerto urbano en espacios pequeños para cultivar tus propios alimentos en este taller práctico de 3 horas en el Jardín Comunitario de Londres. Descubrirás cómo maximizar el espacio disponible, ya sea en balcones, terrazas, patios pequeños, o incluso en interiores con luz natural. Aprenderás sobre selección de contenedores adecuados, mezclas de sustrato para macetas, sistemas de riego eficientes, y cómo elegir las mejores plantas para espacios pequeños. Realizaremos actividades prácticas de preparación de contenedores, siembra de diferentes tipos de vegetales y hierbas, instalación de sistemas de riego, y diseño de huertos verticales. También aprenderás sobre fertilización orgánica, control de plagas sin químicos, y cómo mantener tu huerto durante todo el año. Exploraremos técnicas avanzadas como cultivo en capas, asociación de cultivos, y rotación de plantas. Al finalizar, tendrás todo el conocimiento necesario para comenzar tu propio huerto urbano y podrás llevarte plantas y semillas para empezar inmediatamente.",
    description_en: "Learn to create and maintain an urban garden in small spaces to grow your own food in this 3-hour practical workshop at London's Community Garden. You'll discover how to maximize available space, whether on balconies, terraces, small patios, or even indoors with natural light. You'll learn about selecting appropriate containers, potting soil mixes, efficient irrigation systems, and how to choose the best plants for small spaces. We'll carry out practical activities of container preparation, sowing different types of vegetables and herbs, installing irrigation systems, and designing vertical gardens. You'll also learn about organic fertilization, pest control without chemicals, and how to maintain your garden throughout the year. We'll explore advanced techniques like layered growing, crop association, and plant rotation. At the end, you'll have all the knowledge needed to start your own urban garden and can take home plants and seeds to start immediately.",
    description_de: "Lernen Sie, einen städtischen Garten in kleinen Räumen zu schaffen und zu pflegen, um Ihr eigenes Essen in diesem 3-stündigen praktischen Workshop im Gemeinschaftsgarten von London anzubauen. Sie werden entdecken, wie Sie den verfügbaren Platz maximieren können, sei es auf Balkonen, Terrassen, kleinen Höfen oder sogar in Innenräumen mit natürlichem Licht. Sie lernen die Auswahl geeigneter Behälter, Blumenerde-Mischungen, effiziente Bewässerungssysteme und die Auswahl der besten Pflanzen für kleine Räume kennen. Wir führen praktische Aktivitäten zur Behältervorbereitung, Aussaat verschiedener Gemüse- und Kräutersorten, Installation von Bewässerungssystemen und Gestaltung vertikaler Gärten durch. Sie lernen auch etwas über organische Düngung, Schädlingsbekämpfung ohne Chemikalien und wie Sie Ihren Garten das ganze Jahr über pflegen. Wir werden fortgeschrittene Techniken wie Schichtanbau, Pflanzenverband und Fruchtfolge erkunden. Am Ende haben Sie alle Kenntnisse, die Sie benötigen, um Ihren eigenen städtischen Garten zu beginnen, und können Pflanzen und Samen mit nach Hause nehmen, um sofort zu beginnen.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.urbangardens.org",
    date: "2025-10-15",
    time: "16:00",
    duration: 3,
    location: "Jardín Comunitario, Londres",
    location_en: "Community Garden, London",
    location_de: "Gemeinschaftsgarten, London",
    organizer: "Urban Gardens",
    organizer_en: "Urban Gardens",
    organizer_de: "Städtische Gärten",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Ropa cómoda que puedas ensuciar", "Cuaderno para tomar notas", "Semillas o plantas pequeñas (opcional, proporcionamos algunas)", "Guantes de jardinería (opcional)", "Interés en cultivar tus propios alimentos", "Opcional: trae contenedores reciclados para usar"],
    requirements_en: ["Comfortable clothes you can get dirty", "Notebook for taking notes", "Seeds or small plants (optional, we provide some)", "Gardening gloves (optional)", "Interest in growing your own food", "Optional: bring recycled containers to use"],
    requirements_de: ["Bequeme Kleidung, die schmutzig werden kann", "Notizbuch zum Mitschreiben", "Samen oder kleine Pflanzen (optional, wir stellen einige zur Verfügung)", "Gartenhandschuhe (optional)", "Interesse am Anbau eigener Lebensmittel", "Optional: bringen Sie recycelte Behälter zum Verwenden mit"],
    benefits: ["Kit completo de semillas para empezar", "Manual completo de huertos urbanos", "Seguimiento online durante 6 meses", "Plantas y esquejes para llevar a casa", "Guía de plantas para espacios pequeños", "Acceso a comunidad de jardineros urbanos", "Descuentos en suministros de jardinería"],
    benefits_en: ["Complete seed kit to get started", "Complete urban garden manual", "Online follow-up for 6 months", "Plants and cuttings to take home", "Guide to plants for small spaces", "Access to urban gardener community", "Discounts on gardening supplies"],
    benefits_de: ["Vollständiges Samen-Kit zum Einstieg", "Vollständiges Handbuch für städtische Gärten", "Online-Nachbetreuung für 6 Monate", "Pflanzen und Stecklinge zum Mitnehmen", "Leitfaden zu Pflanzen für kleine Räume", "Zugang zur Gemeinschaft städtischer Gärtner", "Rabatte auf Gartensupplies"],
    contact: "huerto@urban.es"
  },
  "e18": {
    id: "e18",
    title: "Mercado de Productos de Temporada y Alimentos Locales",
    title_en: "Seasonal Products and Local Food Market",
    title_de: "Markt für Saisonprodukte und lokale Lebensmittel",
    description: "Descubre productos de temporada en nuestro mercado especializado en alimentos locales y sostenibles en la Plaza de la Temporada de Londres. Durante todo el día, más de 40 productores locales presentarán sus productos frescos de temporada, cultivados siguiendo prácticas sostenibles y respetuosas con el medio ambiente. Podrás encontrar frutas y verduras de temporada en su punto óptimo de maduración, productos lácteos artesanales, panadería tradicional, miel local, conservas caseras, y mucho más. Cada producto viene con la historia de su origen, información sobre el productor, y consejos sobre cómo prepararlo. El mercado incluye talleres sobre cocina de temporada, charlas sobre agricultura sostenible, degustaciones guiadas, y actividades para niños sobre alimentación saludable. También habrá música en vivo, food trucks con opciones locales, y espacios para compartir recetas. Aprenderás sobre la importancia de comer según las estaciones, cómo identificar productos de calidad, y cómo apoyar la economía local. Esta es una oportunidad perfecta para descubrir nuevos sabores, conocer a los productores de tu región, y adoptar hábitos alimentarios más sostenibles y saludables.",
    description_en: "Discover seasonal products at our specialized market for local and sustainable food at London's Season Square. Throughout the day, more than 40 local producers will showcase their fresh seasonal products, grown following sustainable and environmentally respectful practices. You'll find seasonal fruits and vegetables at their optimal ripeness, artisanal dairy products, traditional bakery, local honey, homemade preserves, and much more. Each product comes with the story of its origin, information about the producer, and tips on how to prepare it. The market includes workshops on seasonal cooking, talks on sustainable agriculture, guided tastings, and activities for children about healthy eating. There will also be live music, food trucks with local options, and spaces to share recipes. You'll learn about the importance of eating according to seasons, how to identify quality products, and how to support the local economy. This is a perfect opportunity to discover new flavors, meet producers from your region, and adopt more sustainable and healthy eating habits.",
    description_de: "Entdecken Sie Saisonprodukte auf unserem spezialisierten Markt für lokale und nachhaltige Lebensmittel auf dem Saisonplatz von London. Den ganzen Tag über präsentieren mehr als 40 lokale Produzenten ihre frischen Saisonprodukte, die nach nachhaltigen und umweltfreundlichen Praktiken angebaut werden. Sie finden saisonale Früchte und Gemüse in optimaler Reife, handwerkliche Milchprodukte, traditionelle Bäckerei, lokalen Honig, hausgemachte Konserven und vieles mehr. Jedes Produkt kommt mit der Geschichte seines Ursprungs, Informationen über den Produzenten und Tipps zur Zubereitung. Der Markt umfasst Workshops zur saisonalen Küche, Vorträge über nachhaltige Landwirtschaft, geführte Verkostungen und Aktivitäten für Kinder über gesunde Ernährung. Es wird auch Live-Musik, Food-Trucks mit lokalen Optionen und Räume zum Teilen von Rezepten geben. Sie lernen die Bedeutung des Essens nach Jahreszeiten, wie man Qualitätsprodukte identifiziert und wie man die lokale Wirtschaft unterstützt. Dies ist eine perfekte Gelegenheit, neue Geschmacksrichtungen zu entdecken, Produzenten aus Ihrer Region zu treffen und nachhaltigere und gesündere Essgewohnheiten anzunehmen.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.seasonalproducers.org",
    date: "2025-10-26",
    time: "11:00",
    duration: 5,
    location: "Plaza de la Temporada, Londres",
    location_en: "Season Square, London",
    location_de: "Saisonplatz, London",
    organizer: "Seasonal Producers",
    organizer_en: "Seasonal Producers",
    organizer_de: "Saisonproduzenten",
    category: "community",
    maxVolunteers: 50,
    currentVolunteers: 35,
    requirements: ["Bolsa reutilizable o carrito de compras", "Dinero en efectivo (algunos puestos no aceptan tarjeta)", "Ropa cómoda para caminar", "Agua para hidratación", "Opcional: recipientes para llevar productos frescos", "Espíritu de descubrimiento culinario"],
    requirements_en: ["Reusable bag or shopping cart", "Cash (some stalls don't accept cards)", "Comfortable walking clothes", "Water for hydration", "Optional: containers to carry fresh products", "Spirit of culinary discovery"],
    requirements_de: ["Wiederverwendbare Tasche oder Einkaufswagen", "Bargeld (einige Stände akzeptieren keine Karten)", "Bequeme Gehkleidung", "Wasser zur Hydratation", "Optional: Behälter zum Transportieren frischer Produkte", "Geist der kulinarischen Entdeckung"],
    benefits: ["Descuentos especiales del 10-15% en todos los productos", "Degustaciones gratuitas de productos premium", "Red de contactos con productores locales", "Guía de productos de temporada y sus beneficios", "Talleres de cocina de temporada gratuitos", "Recetario digital con más de 40 recetas", "Certificado de participación en consumo sostenible"],
    benefits_en: ["Special 10-15% discounts on all products", "Free tastings of premium products", "Network of contacts with local producers", "Guide to seasonal products and their benefits", "Free seasonal cooking workshops", "Digital cookbook with more than 40 recipes", "Sustainable consumption participation certificate"],
    benefits_de: ["Spezielle Rabatte von 10-15% auf alle Produkte", "Kostenlose Verkostungen von Premium-Produkten", "Netzwerk von Kontakten mit lokalen Produzenten", "Leitfaden zu Saisonprodukten und ihren Vorteilen", "Kostenlose Workshops zur saisonalen Küche", "Digitales Kochbuch mit mehr als 40 Rezepten", "Teilnahmezertifikat für nachhaltigen Konsum"],
    contact: "temporada@producers.es"
  },
  "e18b": {
    id: "e18b",
    title: "Charla sobre consumo responsable",
    title_en: "Responsible Consumption Talk",
    title_de: "Vortrag über verantwortungsvollen Konsum",
    description: "Descubre cómo tus decisiones de compra diarias pueden tener un impacto positivo significativo en el medio ambiente y la sociedad en esta charla educativa de 1.5 horas. Aprenderás sobre los principios del consumo responsable, cómo identificar productos sostenibles, entender etiquetas ecológicas y certificaciones, y cómo reducir tu huella ambiental a través de decisiones de compra inteligentes. Exploraremos temas como la economía circular, el impacto de la moda rápida, cómo reducir el desperdicio de alimentos, y cómo apoyar empresas con prácticas éticas y sostenibles. La charla incluye ejemplos prácticos de cómo evaluar productos antes de comprarlos, estrategias para reducir el consumo innecesario, y cómo construir un estilo de vida más sostenible sin sacrificar calidad de vida. También discutiremos cómo el consumo responsable puede ahorrarte dinero a largo plazo y cómo puedes influir en las empresas para que adopten prácticas más sostenibles. Esta charla es perfecta para cualquier persona que quiera tomar decisiones más informadas y responsables en su vida diaria.",
    description_en: "Discover how your daily purchasing decisions can have a significant positive impact on the environment and society in this 1.5-hour educational talk. You'll learn about the principles of responsible consumption, how to identify sustainable products, understand eco-labels and certifications, and how to reduce your environmental footprint through smart purchasing decisions. We'll explore topics like the circular economy, the impact of fast fashion, how to reduce food waste, and how to support companies with ethical and sustainable practices. The talk includes practical examples of how to evaluate products before buying them, strategies to reduce unnecessary consumption, and how to build a more sustainable lifestyle without sacrificing quality of life. We'll also discuss how responsible consumption can save you money in the long run and how you can influence companies to adopt more sustainable practices. This talk is perfect for anyone who wants to make more informed and responsible decisions in their daily life.",
    description_de: "Entdecken Sie, wie Ihre täglichen Kaufentscheidungen einen erheblichen positiven Einfluss auf die Umwelt und die Gesellschaft haben können, in diesem 1,5-stündigen Bildungsvortrag. Sie lernen die Prinzipien des verantwortungsvollen Konsums kennen, wie man nachhaltige Produkte identifiziert, Öko-Labels und Zertifizierungen versteht und wie man seinen ökologischen Fußabdruck durch intelligente Kaufentscheidungen reduziert. Wir werden Themen wie die Kreislaufwirtschaft, die Auswirkungen der Fast Fashion, wie man Lebensmittelverschwendung reduziert und wie man Unternehmen mit ethischen und nachhaltigen Praktiken unterstützt, erkunden. Der Vortrag enthält praktische Beispiele dafür, wie man Produkte vor dem Kauf bewertet, Strategien zur Reduzierung unnötigen Konsums und wie man einen nachhaltigeren Lebensstil aufbaut, ohne die Lebensqualität zu opfern. Wir werden auch diskutieren, wie verantwortungsvoller Konsum Ihnen langfristig Geld sparen kann und wie Sie Unternehmen beeinflussen können, nachhaltigere Praktiken anzunehmen. Dieser Vortrag ist perfekt für alle, die in ihrem täglichen Leben informiertere und verantwortungsvollere Entscheidungen treffen möchten.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.consciousconsumption.org",
    date: "2025-10-29",
    time: "18:00",
    duration: 1.5,
    location: "Biblioteca Central, Berlín",
    location_en: "Central Library, Berlin",
    location_de: "Zentralbibliothek, Berlin",
    organizer: "Conscious Consumption",
    organizer_en: "Conscious Consumption",
    organizer_de: "Bewusster Konsum",
    category: "education",
    maxVolunteers: 50,
    currentVolunteers: 30,
    requirements: ["Registro previo obligatorio (plazas limitadas)", "Participación activa y preguntas", "Cuaderno o dispositivo para tomar notas (opcional)", "Interés en sostenibilidad y consumo responsable", "Disponibilidad para sesión de 1.5 horas"],
    requirements_en: ["Mandatory prior registration (limited spots)", "Active participation and questions", "Notebook or device for taking notes (optional)", "Interest in sustainability and responsible consumption", "Availability for 1.5-hour session"],
    requirements_de: ["Verbindliche Voranmeldung (begrenzte Plätze)", "Aktive Teilnahme und Fragen", "Notizbuch oder Gerät zum Mitschreiben (optional)", "Interesse an Nachhaltigkeit und verantwortungsvollem Konsum", "Verfügbarkeit für 1,5-stündige Sitzung"],
    benefits: ["Guía completa de consumo responsable en formato digital", "Certificado de participación", "Red de contactos con otros consumidores conscientes", "Lista de recursos y herramientas para consumo sostenible", "Acceso a comunidad online de consumo responsable", "Descuentos en productos y servicios sostenibles", "Material educativo adicional sobre sostenibilidad", "Oportunidad de participar en futuros eventos"],
    benefits_en: ["Complete responsible consumption guide in digital format", "Participation certificate", "Contact network with other conscious consumers", "List of resources and tools for sustainable consumption", "Access to online responsible consumption community", "Discounts on sustainable products and services", "Additional educational material on sustainability", "Opportunity to participate in future events"],
    benefits_de: ["Vollständiger Leitfaden für verantwortungsvollen Konsum im digitalen Format", "Teilnahmezertifikat", "Kontaktnetzwerk mit anderen bewussten Verbrauchern", "Liste von Ressourcen und Tools für nachhaltigen Konsum", "Zugang zur Online-Community für verantwortungsvollen Konsum", "Rabatte auf nachhaltige Produkte und Dienstleistungen", "Zusätzliches Bildungsmaterial zur Nachhaltigkeit", "Gelegenheit zur Teilnahme an zukünftigen Veranstaltungen"],
    contact: "consumo@conscious.es"
  },
  "e19": {
    id: "e19",
    title: "Construcción de Refugios para Aves Migratorias",
    title_en: "Migratory Bird Shelters Construction",
    title_de: "Vogelschutzunterkünfte für Zugvögel Bau",
    description: "Únete a nuestro proyecto de conservación para construir refugios seguros para aves migratorias en la Reserva Natural de Berlín. Durante esta actividad de 4 horas, aprenderás sobre las especies migratorias que visitan nuestra región, sus necesidades de hábitat y cómo construir refugios duraderos que las protejan durante sus viajes estacionales. Trabajaremos con materiales naturales y técnicas de construcción sostenible. Los refugios que construyamos serán monitoreados durante todo el año para evaluar su uso y efectividad. Esta es una oportunidad única para contribuir directamente a la conservación de la biodiversidad y aprender sobre la importancia de proteger las rutas migratorias de las aves.",
    description_en: "Join our conservation project to build safe shelters for migratory birds in Berlin's Nature Reserve. During this 4-hour activity, you'll learn about the migratory species that visit our region, their habitat needs, and how to build durable shelters that protect them during their seasonal journeys. We'll work with natural materials and sustainable construction techniques. The shelters we build will be monitored throughout the year to evaluate their use and effectiveness. This is a unique opportunity to directly contribute to biodiversity conservation and learn about the importance of protecting bird migration routes.",
    description_de: "Schließen Sie sich unserem Naturschutzprojekt an, um sichere Unterkünfte für Zugvögel im Naturschutzgebiet Berlin zu bauen. Während dieser 4-stündigen Aktivität lernen Sie die Zugvogelarten kennen, die unsere Region besuchen, ihre Lebensraumbedürfnisse und wie man dauerhafte Unterkünfte baut, die sie während ihrer saisonalen Reisen schützen. Wir arbeiten mit natürlichen Materialien und nachhaltigen Bautechniken. Die von uns gebauten Unterkünfte werden das ganze Jahr über überwacht, um ihre Nutzung und Wirksamkeit zu bewerten. Dies ist eine einzigartige Gelegenheit, direkt zum Schutz der Biodiversität beizutragen und mehr über die Bedeutung des Schutzes von Vogelzugrouten zu erfahren.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.birdprotectors.org",
    date: "2025-11-03",
    time: "13:00",
    duration: 4,
    location: "Reserva Natural, Berlín",
    location_en: "Nature Reserve, Berlin",
    location_de: "Naturschutzgebiet, Berlin",
    organizer: "Bird Protectors",
    organizer_en: "Bird Protectors",
    organizer_de: "Vogelschützer",
    category: "environment",
    maxVolunteers: 15,
    minVolunteers: 5,
    currentVolunteers: 12,
    requirements: ["Ropa cómoda y resistente al agua", "Botas de campo o zapatos cerrados", "Guantes de trabajo", "Agua para hidratación", "Protector solar (si hace sol)", "Opcional: cámara para documentar el proceso"],
    requirements_en: ["Comfortable and waterproof clothing", "Field boots or closed shoes", "Work gloves", "Water for hydration", "Sunscreen (if sunny)", "Optional: camera to document the process"],
    requirements_de: ["Bequeme und wasserfeste Kleidung", "Feldstiefel oder geschlossene Schuhe", "Arbeitshandschuhe", "Wasser zur Hydratation", "Sonnencreme (bei Sonnenschein)", "Optional: Kamera zur Dokumentation des Prozesses"],
    benefits: ["Refugio para aves que podrás adoptar y monitorear", "Guía completa de identificación de aves migratorias", "Certificado de participación en conservación", "Material educativo sobre migración de aves", "Acceso a futuras actividades de monitoreo", "Experiencia práctica en construcción sostenible"],
    benefits_en: ["Bird shelter you can adopt and monitor", "Complete guide to identifying migratory birds", "Conservation participation certificate", "Educational material on bird migration", "Access to future monitoring activities", "Hands-on experience in sustainable construction"],
    benefits_de: ["Vogelunterkunft, die Sie adoptieren und überwachen können", "Vollständiger Leitfaden zur Identifizierung von Zugvögeln", "Teilnahmezertifikat für Naturschutz", "Bildungsmaterial über Vogelzug", "Zugang zu zukünftigen Überwachungsaktivitäten", "Praktische Erfahrung im nachhaltigen Bauen"],
    contact: "aves@protectors.es"
  },
  "e20": {
    id: "e20",
    title: "Taller Práctico de Energía Eólica",
    title_en: "Practical Wind Energy Workshop",
    title_de: "Praktischer Windenergie-Workshop",
    description: "Sumérgete en el mundo de la energía eólica en este taller práctico de 2 horas en el Centro de Energías Renovables de Madrid. Aprenderás los principios fundamentales de la energía eólica, cómo funcionan los aerogeneradores, y construirás tu propio generador eólico pequeño funcional. El taller incluye teoría sobre el potencial eólico en España, diseño de turbinas, y prácticas de instalación segura. También exploraremos las oportunidades laborales en el sector de energías renovables y cómo la energía eólica contribuye a la transición energética. Al finalizar, te llevarás el generador que construiste y un manual completo para proyectos futuros. Ideal para estudiantes, profesionales del sector energético, y cualquier persona interesada en energías renovables.",
    description_en: "Dive into the world of wind energy in this 2-hour practical workshop at Madrid's Renewable Energy Center. You'll learn the fundamental principles of wind energy, how wind turbines work, and build your own small functional wind generator. The workshop includes theory on wind potential in Spain, turbine design, and safe installation practices. We'll also explore job opportunities in the renewable energy sector and how wind energy contributes to the energy transition. At the end, you'll take home the generator you built and a complete manual for future projects. Ideal for students, energy sector professionals, and anyone interested in renewable energy.",
    description_de: "Tauchen Sie ein in die Welt der Windenergie in diesem 2-stündigen praktischen Workshop im Zentrum für erneuerbare Energien in Madrid. Sie lernen die Grundprinzipien der Windenergie, wie Windturbinen funktionieren, und bauen Ihren eigenen kleinen funktionsfähigen Windgenerator. Der Workshop umfasst Theorie über das Windpotenzial in Spanien, Turbinendesign und sichere Installationspraktiken. Wir werden auch Beschäftigungsmöglichkeiten im Sektor der erneuerbaren Energien und wie Windenergie zur Energiewende beiträgt, erkunden. Am Ende nehmen Sie den von Ihnen gebauten Generator und ein vollständiges Handbuch für zukünftige Projekte mit nach Hause. Ideal für Studenten, Fachkräfte im Energiesektor und alle, die sich für erneuerbare Energien interessieren.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    website: "https://www.greenenergy.org",
    date: "2025-11-07",
    time: "16:00",
    duration: 2,
    location: "Centro de Energías Renovables, Madrid",
    location_en: "Renewable Energy Center, Madrid",
    location_de: "Zentrum für erneuerbare Energien, Madrid",
    organizer: "Green Energy",
    organizer_en: "Green Energy",
    organizer_de: "Grüne Energie",
    category: "education",
    maxVolunteers: 25,
    minVolunteers: 8,
    currentVolunteers: 20,
    requirements: ["Conocimientos básicos de electricidad (recomendado)", "Ropa cómoda", "Gafas de seguridad (proporcionadas)", "Cuaderno para tomar notas", "Interés en energías renovables"],
    requirements_en: ["Basic knowledge of electricity (recommended)", "Comfortable clothing", "Safety glasses (provided)", "Notebook for taking notes", "Interest in renewable energy"],
    requirements_de: ["Grundkenntnisse in Elektrizität (empfohlen)", "Bequeme Kleidung", "Schutzbrille (gestellt)", "Notizbuch zum Mitschreiben", "Interesse an erneuerbaren Energien"],
    benefits: ["Generador eólico funcional que construiste", "Manual técnico completo de energía eólica", "Certificado de participación", "Material educativo sobre energías renovables", "Acceso a recursos online adicionales", "Oportunidades de networking en el sector"],
    benefits_en: ["Functional wind generator you built", "Complete technical manual on wind energy", "Participation certificate", "Educational material on renewable energy", "Access to additional online resources", "Networking opportunities in the sector"],
    benefits_de: ["Funktionsfähiger Windgenerator, den Sie gebaut haben", "Vollständiges technisches Handbuch zur Windenergie", "Teilnahmezertifikat", "Bildungsmaterial über erneuerbare Energien", "Zugang zu zusätzlichen Online-Ressourcen", "Netzwerkmöglichkeiten im Sektor"],
    contact: "eolica@greenenergy.es"
  },
  "e21": {
    id: "e21",
    title: "Feria de Productos Orgánicos y Locales",
    title_en: "Organic and Local Products Fair",
    title_de: "Bio- und lokale Produkte Messe",
    description: "Descubre la mejor selección de productos orgánicos y locales en nuestra feria especializada en el Mercado Central de Barcelona. Durante todo el día, más de 50 productores certificados presentarán sus productos frescos, artesanales y sostenibles. Podrás conocer directamente a los agricultores, aprender sobre sus métodos de cultivo ecológico, y descubrir productos únicos que no encontrarás en supermercados convencionales. La feria incluye talleres sobre conservación de alimentos, degustaciones guiadas, charlas sobre agricultura sostenible, y actividades para niños. También habrá música en vivo, food trucks con opciones veganas y vegetarianas, y un mercado de trueque. Esta es una oportunidad perfecta para apoyar la economía local, conocer la procedencia de tus alimentos, y aprender sobre consumo responsable y sostenible.",
    description_en: "Discover the best selection of organic and local products at our specialized fair at Barcelona's Central Market. Throughout the day, more than 50 certified producers will showcase their fresh, artisanal, and sustainable products. You'll be able to meet farmers directly, learn about their organic farming methods, and discover unique products you won't find in conventional supermarkets. The fair includes workshops on food preservation, guided tastings, talks on sustainable agriculture, and activities for children. There will also be live music, vegan and vegetarian food trucks, and a swap market. This is a perfect opportunity to support the local economy, learn about where your food comes from, and discover responsible and sustainable consumption.",
    description_de: "Entdecken Sie die beste Auswahl an Bio- und lokalen Produkten auf unserer spezialisierten Messe im Zentralmarkt von Barcelona. Den ganzen Tag über präsentieren mehr als 50 zertifizierte Produzenten ihre frischen, handwerklichen und nachhaltigen Produkte. Sie können die Landwirte direkt treffen, etwas über ihre ökologischen Anbaumethoden lernen und einzigartige Produkte entdecken, die Sie in herkömmlichen Supermärkten nicht finden werden. Die Messe umfasst Workshops zur Lebensmittelkonservierung, geführte Verkostungen, Vorträge über nachhaltige Landwirtschaft und Aktivitäten für Kinder. Es wird auch Live-Musik, vegane und vegetarische Food-Trucks und einen Tauschmarkt geben. Dies ist eine perfekte Gelegenheit, die lokale Wirtschaft zu unterstützen, mehr über die Herkunft Ihrer Lebensmittel zu erfahren und verantwortungsvollen und nachhaltigen Konsum kennenzulernen.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.organicproducts.org",
    date: "2025-11-10",
    time: "09:00",
    duration: 6,
    location: "Mercado Central, Barcelona",
    location_en: "Central Market, Barcelona",
    location_de: "Zentralmarkt, Barcelona",
    organizer: "Organic Products",
    organizer_en: "Organic Products",
    organizer_de: "Bio-Produkte",
    category: "community",
    maxVolunteers: 100,
    minVolunteers: 30,
    currentVolunteers: 75,
    requirements: ["Bolsa reutilizable o carrito", "Dinero en efectivo (algunos puestos no aceptan tarjeta)", "Ropa cómoda", "Agua para hidratación", "Opcional: recipientes para llevar productos"],
    requirements_en: ["Reusable bag or cart", "Cash (some stalls don't accept cards)", "Comfortable clothing", "Water for hydration", "Optional: containers to carry products"],
    requirements_de: ["Wiederverwendbare Tasche oder Einkaufswagen", "Bargeld (einige Stände akzeptieren keine Karten)", "Bequeme Kleidung", "Wasser zur Hydratation", "Optional: Behälter zum Transportieren von Produkten"],
    benefits: ["Descuentos exclusivos del 10-20% en todos los productos", "Degustaciones gratuitas de productos premium", "Acceso a la red de productores locales", "Guía de productos orgánicos y sus beneficios", "Talleres educativos gratuitos", "Certificado de participación en consumo responsable", "Oportunidades de networking con productores"],
    benefits_en: ["Exclusive 10-20% discounts on all products", "Free tastings of premium products", "Access to local producer network", "Guide to organic products and their benefits", "Free educational workshops", "Responsible consumption participation certificate", "Networking opportunities with producers"],
    benefits_de: ["Exklusive Rabatte von 10-20% auf alle Produkte", "Kostenlose Verkostungen von Premium-Produkten", "Zugang zum lokalen Produzentennetzwerk", "Leitfaden zu Bio-Produkten und ihren Vorteilen", "Kostenlose Bildungs-Workshops", "Teilnahmezertifikat für verantwortungsvollen Konsum", "Netzwerkmöglichkeiten mit Produzenten"],
    contact: "organico@products.es"
  },
  "e22": {
    id: "e22",
    title: "Restauración de Humedales y Ecosistemas Acuáticos",
    title_en: "Wetlands and Aquatic Ecosystems Restoration",
    title_de: "Feuchtgebiets- und aquatische Ökosystemrestaurierung",
    description: "Únete a nuestro proyecto de restauración ecológica en los Humedales del Norte de Milán. Durante esta jornada de 5 horas, trabajaremos en la restauración de un ecosistema acuático degradado, mejorando la calidad del agua, reintroduciendo vegetación nativa, y creando hábitats para especies acuáticas amenazadas. Aprenderás sobre la importancia de los humedales como filtros naturales, su papel en la regulación del clima, y las técnicas de restauración ecológica. Realizaremos actividades como limpieza de canales, plantación de especies acuáticas nativas, construcción de refugios para fauna, y monitoreo de calidad del agua. Los humedales que restauremos serán monitoreados durante los próximos años para evaluar la recuperación del ecosistema. Esta es una oportunidad única para contribuir a la conservación de uno de los ecosistemas más importantes y amenazados del planeta.",
    description_en: "Join our ecological restoration project at Milan's Northern Wetlands. During this 5-hour day, we'll work on restoring a degraded aquatic ecosystem, improving water quality, reintroducing native vegetation, and creating habitats for threatened aquatic species. You'll learn about the importance of wetlands as natural filters, their role in climate regulation, and ecological restoration techniques. We'll carry out activities such as channel cleaning, planting native aquatic species, building wildlife refuges, and water quality monitoring. The wetlands we restore will be monitored over the coming years to evaluate ecosystem recovery. This is a unique opportunity to contribute to the conservation of one of the planet's most important and threatened ecosystems.",
    description_de: "Schließen Sie sich unserem ökologischen Restaurierungsprojekt in den nördlichen Feuchtgebieten Mailands an. Während dieses 5-stündigen Tages arbeiten wir an der Wiederherstellung eines degradierten aquatischen Ökosystems, verbessern die Wasserqualität, führen einheimische Vegetation wieder ein und schaffen Lebensräume für bedrohte aquatische Arten. Sie lernen die Bedeutung von Feuchtgebieten als natürliche Filter, ihre Rolle bei der Klimaregulierung und Techniken der ökologischen Restaurierung kennen. Wir führen Aktivitäten wie Kanalreinigung, Pflanzung einheimischer aquatischer Arten, Bau von Wildtierunterkünften und Wasserqualitätsüberwachung durch. Die von uns restaurierten Feuchtgebiete werden in den kommenden Jahren überwacht, um die Ökosystemerholung zu bewerten. Dies ist eine einzigartige Gelegenheit, zum Schutz eines der wichtigsten und bedrohtesten Ökosysteme des Planeten beizutragen.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    website: "https://www.wetlandrestorers.org",
    date: "2025-11-14",
    time: "08:00",
    duration: 5,
    location: "Humedales del Norte, Milán",
    location_en: "Northern Wetlands, Milan",
    location_de: "Nördliche Feuchtgebiete, Mailand",
    organizer: "Wetland Restorers",
    organizer_en: "Wetland Restorers",
    organizer_de: "Feuchtgebietsrestaurierer",
    category: "environment",
    maxVolunteers: 20,
    minVolunteers: 6,
    currentVolunteers: 16,
    requirements: ["Ropa impermeable completa", "Botas de agua altas", "Guantes resistentes al agua", "Agua para hidratación", "Protector solar", "Ropa de repuesto (por si te mojas)", "Gafas de sol"],
    requirements_en: ["Complete waterproof clothing", "High water boots", "Water-resistant gloves", "Water for hydration", "Sunscreen", "Spare clothes (in case you get wet)", "Sunglasses"],
    requirements_de: ["Vollständige wasserdichte Kleidung", "Hohe Wasserstiefel", "Wasserfeste Handschuhe", "Wasser zur Hydratation", "Sonnencreme", "Wechselkleidung (falls Sie nass werden)", "Sonnenbrille"],
    benefits: ["Certificado de participación en restauración ecológica", "Material educativo sobre humedales", "Refrigerio y almuerzo incluido", "Guía de identificación de especies acuáticas", "Acceso a futuras actividades de monitoreo", "Experiencia práctica en conservación de ecosistemas"],
    benefits_en: ["Ecological restoration participation certificate", "Educational material on wetlands", "Snack and lunch included", "Aquatic species identification guide", "Access to future monitoring activities", "Hands-on experience in ecosystem conservation"],
    benefits_de: ["Teilnahmezertifikat für ökologische Restaurierung", "Bildungsmaterial über Feuchtgebiete", "Erfrischung und Mittagessen inbegriffen", "Leitfaden zur Identifizierung aquatischer Arten", "Zugang zu zukünftigen Überwachungsaktivitäten", "Praktische Erfahrung im Ökosystemschutz"],
    contact: "humedales@restorers.es"
  },
  "e23": {
    id: "e23",
    title: "Conferencia sobre Biodiversidad y Conservación de Ecosistemas",
    title_en: "Biodiversity and Ecosystem Conservation Conference",
    title_de: "Konferenz über Biodiversität und Ökosystemschutz",
    description: "Asiste a esta conferencia sobre la importancia de la biodiversidad y las amenazas actuales en el Centro de Convenciones de París. Durante esta sesión de 3 horas, expertos en biología, ecología y conservación compartirán los últimos descubrimientos científicos sobre la crisis de biodiversidad global, las especies en peligro de extinción, y las estrategias efectivas de conservación que están funcionando en diferentes partes del mundo. Exploraremos temas como la pérdida de hábitats, el cambio climático y su impacto en la biodiversidad, especies invasoras, y la importancia de los corredores ecológicos. La conferencia incluirá presentaciones de casos de éxito de proyectos de conservación, sesiones interactivas de preguntas y respuestas, y espacios de networking para conectar con investigadores, conservacionistas y activistas. También aprenderás sobre cómo puedes contribuir a la conservación de la biodiversidad desde tu comunidad, qué acciones individuales tienen mayor impacto, y cómo participar en proyectos de ciencia ciudadana. Esta es una oportunidad única para entender uno de los desafíos ambientales más críticos de nuestro tiempo y encontrar formas concretas de contribuir a su solución.",
    description_en: "Attend this conference on the importance of biodiversity and current threats at Paris's Convention Center. During this 3-hour session, experts in biology, ecology, and conservation will share the latest scientific discoveries about the global biodiversity crisis, endangered species, and effective conservation strategies that are working in different parts of the world. We'll explore topics such as habitat loss, climate change and its impact on biodiversity, invasive species, and the importance of ecological corridors. The conference will include presentations of success stories from conservation projects, interactive Q&A sessions, and networking spaces to connect with researchers, conservationists, and activists. You'll also learn about how you can contribute to biodiversity conservation from your community, which individual actions have the greatest impact, and how to participate in citizen science projects. This is a unique opportunity to understand one of the most critical environmental challenges of our time and find concrete ways to contribute to its solution.",
    description_de: "Nehmen Sie an dieser Konferenz über die Bedeutung der Biodiversität und aktuelle Bedrohungen im Kongresszentrum von Paris teil. Während dieser 3-stündigen Sitzung werden Experten für Biologie, Ökologie und Naturschutz die neuesten wissenschaftlichen Entdeckungen über die globale Biodiversitätskrise, gefährdete Arten und wirksame Naturschutzstrategien teilen, die in verschiedenen Teilen der Welt funktionieren. Wir werden Themen wie Lebensraumverlust, Klimawandel und seine Auswirkungen auf die Biodiversität, invasive Arten und die Bedeutung ökologischer Korridore erkunden. Die Konferenz umfasst Präsentationen von Erfolgsgeschichten aus Naturschutzprojekten, interaktive Frage-und-Antwort-Sitzungen und Networking-Räume, um sich mit Forschern, Naturschützern und Aktivisten zu verbinden. Sie lernen auch, wie Sie zur Erhaltung der Biodiversität aus Ihrer Gemeinschaft beitragen können, welche individuellen Maßnahmen die größte Wirkung haben und wie Sie an Bürgerwissenschaftsprojekten teilnehmen können. Dies ist eine einzigartige Gelegenheit, eine der kritischsten Umweltherausforderungen unserer Zeit zu verstehen und konkrete Wege zu finden, zu ihrer Lösung beizutragen.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.biodiversityinstitute.org",
    date: "2025-11-17",
    time: "18:30",
    duration: 3,
    location: "Centro de Convenciones, París",
    location_en: "Convention Center, Paris",
    location_de: "Kongresszentrum, Paris",
    organizer: "Biodiversity Institute",
    organizer_en: "Biodiversity Institute",
    organizer_de: "Biodiversitätsinstitut",
    category: "education",
    maxVolunteers: 150,
    minVolunteers: 50,
    currentVolunteers: 120,
    requirements: ["Registro previo obligatorio (plazas limitadas)", "Documento de identidad para verificación", "Cuaderno para tomar notas (opcional)", "Preguntas preparadas para la sesión de Q&A (opcional)", "Dispositivo móvil para networking (opcional)"],
    requirements_en: ["Mandatory prior registration (limited places)", "Identity document for verification", "Notebook for taking notes (optional)", "Prepared questions for Q&A session (optional)", "Mobile device for networking (optional)"],
    requirements_de: ["Verbindliche vorherige Anmeldung (begrenzte Plätze)", "Ausweisdokument zur Überprüfung", "Notizbuch zum Mitschreiben (optional)", "Vorbereitete Fragen für die Q&A-Sitzung (optional)", "Mobilgerät für Networking (optional)"],
    benefits: ["Certificado de asistencia acreditado", "Material informativo completo sobre biodiversidad", "Acceso a recursos online exclusivos", "Oportunidades de networking con expertos y conservacionistas", "Guía práctica de acciones para conservar biodiversidad", "Descuentos en futuros eventos del instituto", "Participación en proyectos de ciencia ciudadana"],
    benefits_en: ["Accredited attendance certificate", "Complete informative material on biodiversity", "Access to exclusive online resources", "Networking opportunities with experts and conservationists", "Practical guide to actions to conserve biodiversity", "Discounts on future institute events", "Participation in citizen science projects"],
    benefits_de: ["Akkreditiertes Teilnahmezertifikat", "Vollständiges Informationsmaterial über Biodiversität", "Zugang zu exklusiven Online-Ressourcen", "Netzwerkmöglichkeiten mit Experten und Naturschützern", "Praktischer Leitfaden für Maßnahmen zur Erhaltung der Biodiversität", "Rabatte auf zukünftige Veranstaltungen des Instituts", "Teilnahme an Bürgerwissenschaftsprojekten"],
    contact: "biodiversidad@institute.es"
  },
  "e24": {
    id: "e24",
    title: "Construcción de Jardines Comunitarios y Agricultura Urbana",
    title_en: "Community Gardens Construction and Urban Agriculture",
    title_de: "Bau von Gemeinschaftsgärten und urbane Landwirtschaft",
    description: "Ayuda a construir jardines comunitarios en el Barrio Verde de Londres para promover la agricultura urbana y la cohesión social. Durante esta jornada completa de 6 horas, trabajaremos en la creación de un nuevo jardín comunitario que servirá como espacio verde, fuente de alimentos frescos, y punto de encuentro para la comunidad. Aprenderás sobre diseño de jardines comunitarios, preparación del suelo, construcción de camas elevadas, instalación de sistemas de riego comunitario, y organización de parcelas individuales y compartidas. También exploraremos cómo los jardines comunitarios fortalecen los lazos sociales, mejoran la seguridad alimentaria, y crean espacios verdes en áreas urbanas. Realizaremos actividades prácticas de construcción, plantación de especies de temporada, y establecimiento de reglas y organización comunitaria. El jardín será gestionado colectivamente por los participantes y servirá como modelo para otros barrios. Esta es una oportunidad única para contribuir a la creación de un espacio verde comunitario duradero, aprender sobre agricultura urbana, y conectarte con tu comunidad mientras trabajas por un objetivo común.",
    description_en: "Help build community gardens in London's Green Neighborhood to promote urban agriculture and social cohesion. During this full 6-hour day, we'll work on creating a new community garden that will serve as a green space, source of fresh food, and meeting point for the community. You'll learn about community garden design, soil preparation, raised bed construction, installation of community irrigation systems, and organization of individual and shared plots. We'll also explore how community gardens strengthen social bonds, improve food security, and create green spaces in urban areas. We'll carry out practical construction activities, planting of seasonal species, and establishment of rules and community organization. The garden will be collectively managed by participants and will serve as a model for other neighborhoods. This is a unique opportunity to contribute to creating a lasting community green space, learn about urban agriculture, and connect with your community while working toward a common goal.",
    description_de: "Helfen Sie beim Bau von Gemeinschaftsgärten im Grünen Viertel von London, um urbane Landwirtschaft und sozialen Zusammenhalt zu fördern. Während dieses vollständigen 6-stündigen Tages arbeiten wir an der Schaffung eines neuen Gemeinschaftsgartens, der als Grünfläche, Quelle für frisches Essen und Treffpunkt für die Gemeinschaft dienen wird. Sie lernen das Design von Gemeinschaftsgärten, Bodenvorbereitung, Bau von Hochbeeten, Installation von Gemeinschaftsbewässerungssystemen und Organisation von individuellen und gemeinsamen Parzellen kennen. Wir werden auch erkunden, wie Gemeinschaftsgärten soziale Bindungen stärken, die Ernährungssicherheit verbessern und Grünflächen in städtischen Gebieten schaffen. Wir führen praktische Bauaktivitäten, Pflanzung saisonaler Arten und Einrichtung von Regeln und Gemeinschaftsorganisation durch. Der Garten wird gemeinsam von den Teilnehmern verwaltet und dient als Modell für andere Viertel. Dies ist eine einzigartige Gelegenheit, zur Schaffung eines dauerhaften gemeinschaftlichen Grünraums beizutragen, etwas über urbane Landwirtschaft zu lernen und sich mit Ihrer Gemeinschaft zu verbinden, während Sie an einem gemeinsamen Ziel arbeiten.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.communitygardeners.org",
    date: "2025-11-21",
    time: "10:00",
    duration: 6,
    location: "Barrio Verde, Londres",
    location_en: "Green Neighborhood, London",
    location_de: "Grünes Viertel, London",
    organizer: "Community Gardeners",
    organizer_en: "Community Gardeners",
    organizer_de: "Gemeinschaftsgärtner",
    category: "community",
    maxVolunteers: 30,
    minVolunteers: 10,
    currentVolunteers: 25,
    requirements: ["Herramientas básicas de jardinería (proporcionamos si no tienes)", "Ropa de trabajo que puedas ensuciar", "Almuerzo (o podemos coordinar comida compartida)", "Guantes de jardinería", "Agua para hidratación", "Protector solar", "Espíritu de trabajo en equipo"],
    requirements_en: ["Basic gardening tools (we provide if you don't have)", "Work clothes you can get dirty", "Lunch (or we can coordinate shared meal)", "Gardening gloves", "Water for hydration", "Sunscreen", "Teamwork spirit"],
    requirements_de: ["Grundlegende Gartengeräte (wir stellen zur Verfügung, wenn Sie keine haben)", "Arbeitskleidung, die schmutzig werden kann", "Mittagessen (oder wir können gemeinsames Essen koordinieren)", "Gartenhandschuhe", "Wasser zur Hydratation", "Sonnencreme", "Teamwork-Geist"],
    benefits: ["Parcela personal o compartida en el jardín comunitario", "Kit completo de semillas para empezar", "Certificado de participación en construcción comunitaria", "Manual completo de jardinería comunitaria", "Acceso a herramientas y recursos del jardín", "Oportunidades de liderazgo en la gestión del jardín", "Red de contactos con otros jardineros comunitarios"],
    benefits_en: ["Personal or shared plot in the community garden", "Complete seed kit to get started", "Community construction participation certificate", "Complete community gardening manual", "Access to garden tools and resources", "Leadership opportunities in garden management", "Network of contacts with other community gardeners"],
    benefits_de: ["Persönliche oder gemeinsame Parzelle im Gemeinschaftsgarten", "Vollständiges Samen-Kit zum Einstieg", "Teilnahmezertifikat für Gemeinschaftsbau", "Vollständiges Handbuch für Gemeinschaftsgartenarbeit", "Zugang zu Gartengeräten und Ressourcen", "Führungsmöglichkeiten in der Gartenverwaltung", "Netzwerk von Kontakten mit anderen Gemeinschaftsgärtnern"],
    contact: "jardines@community.es"
  },
  "e25": {
    id: "e25",
    title: "Monitoreo de Especies en Peligro de Extinción",
    title_en: "Endangered Species Monitoring",
    title_de: "Überwachung gefährdeter Arten",
    description: "Participa en el monitoreo de especies en peligro de extinción en nuestra Reserva de Vida Silvestre de Berlín. Durante esta actividad temprana de 4 horas, te convertirás en un científico ciudadano capacitado para identificar, registrar y monitorear especies amenazadas. Aprenderás sobre las técnicas de monitoreo de vida silvestre, cómo identificar especies por sus huellas, excrementos, nidos y comportamientos, y cómo registrar datos científicos de manera precisa. Realizaremos transectos de monitoreo en diferentes hábitats, aprenderás a usar cámaras trampa, identificarás signos de presencia animal, y registrarás datos sobre distribución y comportamiento. También exploraremos las amenazas que enfrentan estas especies, las estrategias de conservación en curso, y cómo los datos ciudadanos contribuyen a la protección de especies. Los datos recopilados serán utilizados por biólogos profesionales para evaluar el estado de las poblaciones y ajustar estrategias de conservación. Esta es una oportunidad única para contribuir directamente a la conservación de especies en peligro y aprender sobre la vida silvestre de tu región.",
    description_en: "Participate in monitoring endangered species at our Wildlife Reserve in Berlin. During this early 4-hour activity, you'll become a trained citizen scientist capable of identifying, recording, and monitoring threatened species. You'll learn about wildlife monitoring techniques, how to identify species by their tracks, droppings, nests and behaviors, and how to record scientific data accurately. We'll conduct monitoring transects in different habitats, you'll learn to use camera traps, identify signs of animal presence, and record data on distribution and behavior. We'll also explore the threats these species face, ongoing conservation strategies, and how citizen data contributes to species protection. The data collected will be used by professional biologists to assess population status and adjust conservation strategies. This is a unique opportunity to directly contribute to endangered species conservation and learn about your region's wildlife.",
    description_de: "Nehmen Sie an der Überwachung gefährdeter Arten in unserem Wildtierreservat in Berlin teil. Während dieser frühen 4-stündigen Aktivität werden Sie ein ausgebildeter Bürgerwissenschaftler, der in der Lage ist, bedrohte Arten zu identifizieren, aufzuzeichnen und zu überwachen. Sie lernen Techniken zur Überwachung von Wildtieren, wie man Arten anhand ihrer Spuren, Exkremente, Nester und Verhaltensweisen identifiziert, und wie man wissenschaftliche Daten genau aufzeichnet. Wir führen Überwachungstranssekte in verschiedenen Lebensräumen durch, Sie lernen, Kamerafallen zu verwenden, Anzeichen von Tierpräsenz zu identifizieren und Daten über Verbreitung und Verhalten aufzuzeichnen. Wir werden auch die Bedrohungen erkunden, denen diese Arten ausgesetzt sind, laufende Naturschutzstrategien und wie Bürgermessdaten zum Artenschutz beitragen. Die gesammelten Daten werden von professionellen Biologen verwendet, um den Populationsstatus zu bewerten und Naturschutzstrategien anzupassen. Dies ist eine einzigartige Gelegenheit, direkt zum Schutz gefährdeter Arten beizutragen und mehr über die Tierwelt Ihrer Region zu erfahren.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.wildlifeprotectors.org",
    date: "2025-11-24",
    time: "07:00",
    duration: 4,
    location: "Reserva de Vida Silvestre, Berlín",
    location_en: "Wildlife Reserve, Berlin",
    location_de: "Wildtierreservat, Berlin",
    organizer: "Wildlife Protectors",
    organizer_en: "Wildlife Protectors",
    organizer_de: "Wildtierschützer",
    category: "environment",
    maxVolunteers: 12,
    minVolunteers: 4,
    currentVolunteers: 10,
    requirements: ["Binoculares (proporcionamos algunos si no tienes)", "Cuaderno de campo resistente al agua", "Ropa cómoda y abrigada (actividad temprana)", "Botas de campo", "Cámara o smartphone para fotografías (opcional)", "Agua para hidratación", "Paciencia y atención al detalle"],
    requirements_en: ["Binoculars (we provide some if you don't have)", "Water-resistant field notebook", "Comfortable and warm clothes (early activity)", "Field boots", "Camera or smartphone for photos (optional)", "Water for hydration", "Patience and attention to detail"],
    requirements_de: ["Fernglas (wir stellen einige zur Verfügung, wenn Sie keines haben)", "Wasserdichtes Feldnotizbuch", "Bequeme und warme Kleidung (frühe Aktivität)", "Feldstiefel", "Kamera oder Smartphone für Fotos (optional)", "Wasser zur Hydratation", "Geduld und Aufmerksamkeit für Details"],
    benefits: ["Guía completa de identificación de especies", "Certificado de participación en ciencia ciudadana", "Acceso VIP a futuras actividades de monitoreo", "Acceso a datos científicos del proyecto", "Fotografías profesionales de especies observadas", "Oportunidades de participar en proyectos de conservación", "Experiencia práctica en investigación de vida silvestre"],
    benefits_en: ["Complete species identification guide", "Citizen science participation certificate", "VIP access to future monitoring activities", "Access to project scientific data", "Professional photographs of observed species", "Opportunities to participate in conservation projects", "Hands-on experience in wildlife research"],
    benefits_de: ["Vollständiger Leitfaden zur Artenidentifizierung", "Teilnahmezertifikat für Bürgerwissenschaft", "VIP-Zugang zu zukünftigen Überwachungsaktivitäten", "Zugang zu wissenschaftlichen Projektdaten", "Professionelle Fotografien beobachteter Arten", "Möglichkeiten zur Teilnahme an Naturschutzprojekten", "Praktische Erfahrung in der Wildtierforschung"],
    contact: "vidasilvestre@protectors.es"
  },
  "e26": {
    id: "e26",
    title: "Taller de Reciclaje Creativo y Arte Sostenible",
    title_en: "Creative Recycling and Sustainable Art Workshop",
    title_de: "Workshop für kreatives Recycling und nachhaltige Kunst",
    description: "Aprende a crear objetos útiles y artísticos a partir de materiales reciclados en este taller práctico de 3 horas en el Centro de Arte Reciclado de Madrid. Descubrirás cómo transformar residuos comunes en obras de arte funcionales y decorativas, reduciendo tu huella de residuos mientras desarrollas tu creatividad. Aprenderás técnicas de reciclaje creativo: transformación de botellas de plástico en macetas y decoraciones, creación de joyería con materiales reciclados, construcción de muebles con pallets, y arte con papel y cartón reciclado. Realizaremos proyectos prácticos donde crearás al menos 2 objetos que te llevarás a casa: uno funcional y uno artístico. También exploraremos cómo el arte reciclado puede ser una fuente de ingresos, cómo organizar talleres en tu comunidad, y cómo inspirar a otros a reducir residuos. El taller incluye una sesión sobre identificación de materiales reciclables, técnicas de limpieza y preparación, y acabados profesionales. Esta es una oportunidad perfecta para desarrollar habilidades creativas mientras contribuyes a la economía circular y aprendes a ver los residuos como recursos valiosos.",
    description_en: "Learn to create useful and artistic objects from recycled materials in this 3-hour practical workshop at Madrid's Recycled Art Center. You'll discover how to transform common waste into functional and decorative works of art, reducing your waste footprint while developing your creativity. You'll learn creative recycling techniques: transforming plastic bottles into planters and decorations, creating jewelry with recycled materials, building furniture with pallets, and art with recycled paper and cardboard. We'll carry out practical projects where you'll create at least 2 objects to take home: one functional and one artistic. We'll also explore how recycled art can be a source of income, how to organize workshops in your community, and how to inspire others to reduce waste. The workshop includes a session on identifying recyclable materials, cleaning and preparation techniques, and professional finishes. This is a perfect opportunity to develop creative skills while contributing to the circular economy and learning to see waste as valuable resources.",
    description_de: "Lernen Sie, nützliche und künstlerische Objekte aus recycelten Materialien in diesem 3-stündigen praktischen Workshop im Recycling-Kunstzentrum von Madrid zu erstellen. Sie werden entdecken, wie Sie gewöhnlichen Abfall in funktionale und dekorative Kunstwerke verwandeln können, während Sie Ihre Kreativität entwickeln und Ihren Abfallfußabdruck reduzieren. Sie lernen kreative Recycling-Techniken: Umwandlung von Plastikflaschen in Pflanzgefäße und Dekorationen, Herstellung von Schmuck mit recycelten Materialien, Bau von Möbeln mit Paletten und Kunst mit recyceltem Papier und Pappe. Wir führen praktische Projekte durch, bei denen Sie mindestens 2 Objekte erstellen, die Sie mit nach Hause nehmen: eines funktional und eines künstlerisch. Wir werden auch erkunden, wie recycelte Kunst eine Einkommensquelle sein kann, wie man Workshops in Ihrer Gemeinschaft organisiert und wie man andere inspiriert, Abfälle zu reduzieren. Der Workshop umfasst eine Sitzung zur Identifizierung recycelbarer Materialien, Reinigungs- und Vorbereitungstechniken und professionelle Oberflächen. Dies ist eine perfekte Gelegenheit, kreative Fähigkeiten zu entwickeln, während Sie zur Kreislaufwirtschaft beitragen und lernen, Abfall als wertvolle Ressource zu sehen.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.recycledart.org",
    date: "2025-11-28",
    time: "15:00",
    duration: 3,
    location: "Centro de Arte Reciclado, Madrid",
    location_en: "Recycled Art Center, Madrid",
    location_de: "Recycling-Kunstzentrum, Madrid",
    organizer: "Recycled Art",
    organizer_en: "Recycled Art",
    organizer_de: "Recycling-Kunst",
    category: "education",
    maxVolunteers: 20,
    minVolunteers: 6,
    currentVolunteers: 18,
    requirements: ["Materiales reciclados de casa (botellas, cartón, papel, etc.)", "Herramientas básicas (proporcionamos si no tienes)", "Ropa cómoda que puedas ensuciar", "Delantal o ropa de trabajo (opcional)", "Creatividad y ganas de crear", "Opcional: trae materiales específicos que quieras transformar"],
    requirements_en: ["Recycled materials from home (bottles, cardboard, paper, etc.)", "Basic tools (we provide if you don't have)", "Comfortable clothes you can get dirty", "Apron or work clothes (optional)", "Creativity and desire to create", "Optional: bring specific materials you want to transform"],
    requirements_de: ["Recycelte Materialien von zu Hause (Flaschen, Pappe, Papier usw.)", "Grundwerkzeuge (wir stellen zur Verfügung, wenn Sie keine haben)", "Bequeme Kleidung, die schmutzig werden kann", "Schürze oder Arbeitskleidung (optional)", "Kreativität und Lust zu schaffen", "Optional: bringen Sie spezifische Materialien mit, die Sie transformieren möchten"],
    benefits: ["Objetos creados por ti para llevar a casa", "Manual completo de técnicas de reciclaje creativo", "Certificado de participación", "Guía de materiales reciclables y sus usos", "Acceso a comunidad online de artistas recicladores", "Descuentos en materiales y herramientas", "Oportunidades de exponer tus creaciones"],
    benefits_en: ["Objects you created to take home", "Complete manual on creative recycling techniques", "Participation certificate", "Guide to recyclable materials and their uses", "Access to online community of recycling artists", "Discounts on materials and tools", "Opportunities to exhibit your creations"],
    benefits_de: ["Von Ihnen erstellte Objekte zum Mitnehmen", "Vollständiges Handbuch über kreative Recycling-Techniken", "Teilnahmezertifikat", "Leitfaden zu recycelbaren Materialien und ihren Verwendungen", "Zugang zur Online-Gemeinschaft von Recycling-Künstlern", "Rabatte auf Materialien und Werkzeuge", "Möglichkeiten, Ihre Kreationen auszustellen"],
    contact: "reciclaje@art.es"
  },
  "e27": {
    id: "e27",
    title: "Mercado Navideño Sostenible y Consumo Responsable",
    title_en: "Sustainable Christmas Market and Responsible Consumption",
    title_de: "Nachhaltiger Weihnachtsmarkt und verantwortungsvoller Konsum",
    description: "Descubre productos navideños sostenibles en nuestro mercado especializado con enfoque ecológico en la Plaza Navideña de Barcelona. Durante todo el día, más de 50 artesanos y productores locales presentarán sus productos navideños hechos con materiales sostenibles, técnicas tradicionales, y prácticas éticas. Podrás encontrar decoraciones navideñas ecológicas, regalos artesanales únicos, comida navideña local y orgánica, juguetes sostenibles para niños, y mucho más. Cada producto viene con información sobre su origen sostenible, el impacto ambiental reducido, y cómo mantenerlo o reciclarlo después de las fiestas. El mercado incluye talleres sobre cómo celebrar una Navidad más sostenible, charlas sobre consumo responsable durante las fiestas, actividades para niños sobre reciclaje navideño, y música en vivo con energía renovable. También habrá demostraciones de cómo hacer decoraciones navideñas con materiales reciclados, y espacios para compartir ideas sobre regalos sostenibles. Aprenderás sobre cómo reducir el desperdicio durante las fiestas, cómo elegir regalos con menor impacto ambiental, y cómo crear tradiciones navideñas más sostenibles. Esta es una oportunidad perfecta para encontrar regalos únicos y responsables mientras apoyas la economía local y reduces tu huella ambiental durante las fiestas.",
    description_en: "Discover sustainable Christmas products at our specialized eco-friendly market at Barcelona's Christmas Square. Throughout the day, more than 50 local artisans and producers will showcase their Christmas products made with sustainable materials, traditional techniques, and ethical practices. You'll find eco-friendly Christmas decorations, unique artisanal gifts, local and organic Christmas food, sustainable toys for children, and much more. Each product comes with information about its sustainable origin, reduced environmental impact, and how to maintain or recycle it after the holidays. The market includes workshops on how to celebrate a more sustainable Christmas, talks on responsible consumption during the holidays, activities for children about Christmas recycling, and live music powered by renewable energy. There will also be demonstrations of how to make Christmas decorations with recycled materials, and spaces to share ideas about sustainable gifts. You'll learn about how to reduce waste during the holidays, how to choose gifts with lower environmental impact, and how to create more sustainable Christmas traditions. This is a perfect opportunity to find unique and responsible gifts while supporting the local economy and reducing your environmental footprint during the holidays.",
    description_de: "Entdecken Sie nachhaltige Weihnachtsprodukte auf unserem spezialisierten umweltfreundlichen Markt auf dem Weihnachtsplatz von Barcelona. Den ganzen Tag über präsentieren mehr als 50 lokale Handwerker und Produzenten ihre Weihnachtsprodukte, die mit nachhaltigen Materialien, traditionellen Techniken und ethischen Praktiken hergestellt werden. Sie finden umweltfreundliche Weihnachtsdekorationen, einzigartige handwerkliche Geschenke, lokale und biologische Weihnachtsnahrung, nachhaltige Spielzeuge für Kinder und vieles mehr. Jedes Produkt kommt mit Informationen über seinen nachhaltigen Ursprung, reduzierte Umweltauswirkungen und wie man es nach den Feiertagen pflegt oder recycelt. Der Markt umfasst Workshops darüber, wie man ein nachhaltigeres Weihnachten feiert, Vorträge über verantwortungsvollen Konsum während der Feiertage, Aktivitäten für Kinder über Weihnachtsrecycling und Live-Musik mit erneuerbarer Energie. Es wird auch Demonstrationen geben, wie man Weihnachtsdekorationen mit recycelten Materialien herstellt, und Räume, um Ideen über nachhaltige Geschenke auszutauschen. Sie lernen, wie Sie Abfälle während der Feiertage reduzieren, wie Sie Geschenke mit geringerer Umweltbelastung auswählen und wie Sie nachhaltigere Weihnachtstraditionen schaffen können. Dies ist eine perfekte Gelegenheit, einzigartige und verantwortungsvolle Geschenke zu finden, während Sie die lokale Wirtschaft unterstützen und Ihren Umweltfußabdruck während der Feiertage reduzieren.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.sustainablechristmas.org",
    date: "2025-12-01",
    time: "12:00",
    duration: 8,
    location: "Plaza Navideña, Barcelona",
    location_en: "Christmas Square, Barcelona",
    location_de: "Weihnachtsplatz, Barcelona",
    organizer: "Sustainable Christmas",
    organizer_en: "Sustainable Christmas",
    organizer_de: "Nachhaltiges Weihnachten",
    category: "community",
    maxVolunteers: 200,
    currentVolunteers: 150,
    requirements: ["Bolsa reutilizable o carrito de compras", "Dinero en efectivo (algunos puestos no aceptan tarjeta)", "Ropa cómoda para caminar", "Agua para hidratación", "Lista de regalos (opcional)", "Espíritu navideño sostenible"],
    requirements_en: ["Reusable bag or shopping cart", "Cash (some stalls don't accept cards)", "Comfortable walking clothes", "Water for hydration", "Gift list (optional)", "Sustainable Christmas spirit"],
    requirements_de: ["Wiederverwendbare Tasche oder Einkaufswagen", "Bargeld (einige Stände akzeptieren keine Karten)", "Bequeme Gehkleidung", "Wasser zur Hydratation", "Geschenkeliste (optional)", "Nachhaltiger Weihnachtsgeist"],
    benefits: ["Descuentos especiales del 15% en todos los productos", "Degustaciones gratuitas de productos navideños premium", "Souvenirs ecológicos navideños", "Guía completa de consumo navideño sostenible", "Talleres gratuitos sobre decoración sostenible", "Recetario de comida navideña local", "Certificado de participación en consumo responsable"],
    benefits_en: ["Special 15% discounts on all products", "Free tastings of premium Christmas products", "Eco-friendly Christmas souvenirs", "Complete guide to sustainable Christmas consumption", "Free workshops on sustainable decoration", "Local Christmas food cookbook", "Responsible consumption participation certificate"],
    benefits_de: ["Spezielle Rabatte von 15% auf alle Produkte", "Kostenlose Verkostungen von Premium-Weihnachtsprodukten", "Umweltfreundliche Weihnachtssouvenirs", "Vollständiger Leitfaden für nachhaltigen Weihnachtskonsum", "Kostenlose Workshops zur nachhaltigen Dekoration", "Lokales Weihnachtskochbuch", "Teilnahmezertifikat für verantwortungsvollen Konsum"],
    contact: "navidad@sustainable.es"
  },
  "e28": {
    id: "e28",
    title: "Reforestación de Invierno y Preparación para la Primavera",
    title_en: "Winter Reforestation and Spring Preparation",
    title_de: "Winteraufforstung und Frühlingsvorbereitung",
    description: "Participa en la reforestación de invierno en el Bosque de Invierno de Milán para preparar el bosque para la próxima primavera. Durante esta actividad de 4 horas, plantaremos especies nativas especialmente seleccionadas para la plantación invernal que tienen mayor tasa de supervivencia cuando se plantan durante los meses fríos. Aprenderás sobre la importancia de la reforestación invernal, qué especies son más adecuadas para esta temporada, técnicas de plantación que aseguran el éxito durante el invierno, y cómo proteger las plántulas jóvenes del frío y las heladas. Realizaremos actividades de preparación del suelo, plantación de árboles jóvenes, aplicación de mantillo protector, construcción de protectores contra el viento, y marcado de árboles para seguimiento. También aprenderás sobre el ciclo de vida de los árboles durante el invierno, cómo preparan sus sistemas para la primavera, y la importancia de la biodiversidad forestal. Los árboles que plantemos serán monitoreados durante el invierno y la primavera para evaluar su adaptación y crecimiento. Esta es una oportunidad perfecta para contribuir a la restauración forestal y aprender sobre la importancia de la reforestación estacional mientras trabajas en un entorno natural invernal único.",
    description_en: "Participate in winter reforestation at Milan's Winter Forest to prepare the forest for next spring. During this 4-hour activity, we'll plant native species specially selected for winter planting that have higher survival rates when planted during cold months. You'll learn about the importance of winter reforestation, which species are most suitable for this season, planting techniques that ensure success during winter, and how to protect young seedlings from cold and frost. We'll carry out soil preparation activities, planting of young trees, application of protective mulch, construction of wind protectors, and tree marking for monitoring. You'll also learn about the life cycle of trees during winter, how they prepare their systems for spring, and the importance of forest biodiversity. The trees we plant will be monitored during winter and spring to evaluate their adaptation and growth. This is a perfect opportunity to contribute to forest restoration and learn about the importance of seasonal reforestation while working in a unique winter natural environment.",
    description_de: "Nehmen Sie an der Winteraufforstung im Winterwald von Mailand teil, um den Wald für den nächsten Frühling vorzubereiten. Während dieser 4-stündigen Aktivität pflanzen wir einheimische Arten, die speziell für die Winterpflanzung ausgewählt wurden und höhere Überlebensraten haben, wenn sie während der kalten Monate gepflanzt werden. Sie lernen die Bedeutung der Winteraufforstung, welche Arten für diese Saison am besten geeignet sind, Pflanztechniken, die den Erfolg im Winter sicherstellen, und wie man junge Sämlinge vor Kälte und Frost schützt. Wir führen Bodenvorbereitungsaktivitäten, Pflanzung junger Bäume, Anwendung von Schutzmulch, Bau von Windschutz und Baummarkierung zur Überwachung durch. Sie lernen auch den Lebenszyklus von Bäumen im Winter, wie sie ihre Systeme auf den Frühling vorbereiten, und die Bedeutung der Waldbiodiversität kennen. Die von uns gepflanzten Bäume werden im Winter und Frühling überwacht, um ihre Anpassung und ihr Wachstum zu bewerten. Dies ist eine perfekte Gelegenheit, zur Waldrestaurierung beizutragen und mehr über die Bedeutung der saisonalen Aufforstung zu erfahren, während Sie in einer einzigartigen winterlichen Naturumgebung arbeiten.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.winterreforesters.org",
    date: "2025-12-05",
    time: "09:00",
    duration: 4,
    location: "Bosque de Invierno, Milán",
    location_en: "Winter Forest, Milan",
    location_de: "Winterwald, Mailand",
    organizer: "Winter Reforesters",
    organizer_en: "Winter Reforesters",
    organizer_de: "Winteraufforster",
    category: "environment",
    maxVolunteers: 40,
    currentVolunteers: 32,
    requirements: ["Ropa abrigada y resistente al agua", "Guantes de trabajo resistentes al frío", "Botas impermeables", "Agua para hidratación", "Herramientas básicas (proporcionamos si no tienes)", "Protector solar (aunque sea invierno)", "Ropa de repuesto (por si te mojas)"],
    requirements_en: ["Warm and water-resistant clothing", "Cold-resistant work gloves", "Waterproof boots", "Water for hydration", "Basic tools (we provide if you don't have)", "Sunscreen (even though it's winter)", "Spare clothes (in case you get wet)"],
    requirements_de: ["Warme und wasserfeste Kleidung", "Kältebeständige Arbeitshandschuhe", "Wasserdichte Stiefel", "Wasser zur Hydratation", "Grundwerkzeuge (wir stellen zur Verfügung, wenn Sie keine haben)", "Sonnencreme (obwohl es Winter ist)", "Wechselkleidung (falls Sie nass werden)"],
    benefits: ["Árbol personal que plantaste con seguimiento", "Certificado de participación en reforestación invernal", "Refrigerio caliente y bebidas incluidas", "Guía de especies forestales y su cuidado", "Acceso a recursos online sobre reforestación", "Oportunidades de participar en monitoreo primaveral", "Experiencia práctica en restauración forestal"],
    benefits_en: ["Personal tree you planted with follow-up", "Winter reforestation participation certificate", "Hot snack and drinks included", "Guide to forest species and their care", "Access to online resources on reforestation", "Opportunities to participate in spring monitoring", "Hands-on experience in forest restoration"],
    benefits_de: ["Persönlicher Baum, den Sie gepflanzt haben, mit Nachverfolgung", "Teilnahmezertifikat für Winteraufforstung", "Heißer Snack und Getränke inbegriffen", "Leitfaden zu Waldarten und ihrer Pflege", "Zugang zu Online-Ressourcen über Aufforstung", "Möglichkeiten zur Teilnahme an Frühlingsüberwachung", "Praktische Erfahrung in der Waldrestaurierung"],
    contact: "invierno@reforesters.es"
  },
  "e29": {
    id: "e29",
    title: "Seminario Especializado sobre Avances en la Lucha contra el Cambio Climático",
    title_en: "Specialized Seminar on Advances in the Fight Against Climate Change",
    title_de: "Spezialisiertes Seminar über Fortschritte im Kampf gegen den Klimawandel",
    description: "Asiste a este seminario especializado sobre los últimos avances en la lucha contra el cambio climático en la Universidad Verde de París. Durante esta sesión de 2 horas, investigadores y expertos en climatología compartirán los descubrimientos científicos más recientes, tecnologías innovadoras de mitigación y adaptación, y estrategias políticas que están demostrando efectividad en diferentes partes del mundo. Exploraremos temas como tecnologías de captura de carbono, soluciones basadas en la naturaleza, transición energética acelerada, y políticas climáticas efectivas. El seminario incluirá presentaciones de casos de estudio de ciudades y países que están logrando reducciones significativas de emisiones, análisis de tecnologías emergentes, y discusiones sobre barreras y oportunidades para la acción climática. También aprenderás sobre cómo puedes aplicar estos conocimientos en tu comunidad, qué tecnologías están disponibles para individuos y organizaciones, y cómo participar en iniciativas de acción climática. Esta es una oportunidad única para estar al día con los últimos avances científicos y tecnológicos en la lucha contra el cambio climático y encontrar formas prácticas de contribuir a la solución.",
    description_en: "Attend this specialized seminar on the latest advances in the fight against climate change at Paris's Green University. During this 2-hour session, researchers and climatology experts will share the most recent scientific discoveries, innovative mitigation and adaptation technologies, and policy strategies that are proving effective in different parts of the world. We'll explore topics such as carbon capture technologies, nature-based solutions, accelerated energy transition, and effective climate policies. The seminar will include presentations of case studies from cities and countries achieving significant emission reductions, analysis of emerging technologies, and discussions on barriers and opportunities for climate action. You'll also learn about how you can apply this knowledge in your community, what technologies are available for individuals and organizations, and how to participate in climate action initiatives. This is a unique opportunity to stay up-to-date with the latest scientific and technological advances in the fight against climate change and find practical ways to contribute to the solution.",
    description_de: "Nehmen Sie an diesem spezialisierten Seminar über die neuesten Fortschritte im Kampf gegen den Klimawandel an der Grünen Universität von Paris teil. Während dieser 2-stündigen Sitzung werden Forscher und Klimatologieexperten die neuesten wissenschaftlichen Entdeckungen, innovative Minderungs- und Anpassungstechnologien und politische Strategien teilen, die sich in verschiedenen Teilen der Welt als wirksam erweisen. Wir werden Themen wie Kohlenstoffabscheidungstechnologien, naturbasierte Lösungen, beschleunigte Energiewende und wirksame Klimapolitik erkunden. Das Seminar umfasst Präsentationen von Fallstudien aus Städten und Ländern, die erhebliche Emissionsreduzierungen erreichen, Analysen neuer Technologien und Diskussionen über Barrieren und Chancen für Klimaschutzmaßnahmen. Sie lernen auch, wie Sie dieses Wissen in Ihrer Gemeinschaft anwenden können, welche Technologien für Einzelpersonen und Organisationen verfügbar sind und wie Sie an Klimaschutzinitiativen teilnehmen können. Dies ist eine einzigartige Gelegenheit, auf dem neuesten Stand der neuesten wissenschaftlichen und technologischen Fortschritte im Kampf gegen den Klimawandel zu bleiben und praktische Wege zu finden, zur Lösung beizutragen.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.greenclimate.org",
    date: "2025-12-08",
    time: "17:00",
    duration: 2,
    location: "Universidad Verde, París",
    location_en: "Green University, Paris",
    location_de: "Grüne Universität, Paris",
    organizer: "Green Climate",
    organizer_en: "Green Climate",
    organizer_de: "Grünes Klima",
    category: "education",
    maxVolunteers: 80,
    currentVolunteers: 65,
    requirements: ["Registro previo obligatorio", "Conocimientos básicos sobre cambio climático (recomendado)", "Cuaderno para tomar notas", "Preguntas preparadas para la sesión de Q&A (opcional)", "Dispositivo móvil para acceder a recursos online (opcional)"],
    requirements_en: ["Mandatory prior registration", "Basic knowledge about climate change (recommended)", "Notebook for taking notes", "Prepared questions for Q&A session (optional)", "Mobile device to access online resources (optional)"],
    requirements_de: ["Verbindliche vorherige Anmeldung", "Grundkenntnisse über Klimawandel (empfohlen)", "Notizbuch zum Mitschreiben", "Vorbereitete Fragen für die Q&A-Sitzung (optional)", "Mobilgerät für Zugang zu Online-Ressourcen (optional)"],
    benefits: ["Certificado universitario acreditado", "Material académico completo sobre avances climáticos", "Acceso a recursos online exclusivos", "Oportunidades de networking con investigadores", "Guía práctica de tecnologías climáticas disponibles", "Descuentos en futuros eventos académicos", "Participación en grupos de investigación climática"],
    benefits_en: ["Accredited university certificate", "Complete academic material on climate advances", "Access to exclusive online resources", "Networking opportunities with researchers", "Practical guide to available climate technologies", "Discounts on future academic events", "Participation in climate research groups"],
    benefits_de: ["Akkreditiertes Universitätszertifikat", "Vollständiges akademisches Material über Klimafortschritte", "Zugang zu exklusiven Online-Ressourcen", "Netzwerkmöglichkeiten mit Forschern", "Praktischer Leitfaden zu verfügbaren Klimatechnologien", "Rabatte auf zukünftige akademische Veranstaltungen", "Teilnahme an Klimaforschungsgruppen"],
    contact: "clima@universidad.es"
  },
  "e30": {
    id: "e30",
    title: "Celebración Ecológica de Año Nuevo y Propósitos Sostenibles",
    title_en: "Eco-Friendly New Year Celebration and Sustainable Resolutions",
    title_de: "Umweltfreundliche Neujahrsfeier und nachhaltige Vorsätze",
    description: "Celebra el fin de año de manera ecológica en el Centro Cultural Verde de Londres con música, comida local y actividades sostenibles. Durante esta celebración de 4 horas, disfrutarás de una experiencia completa que combina entretenimiento, gastronomía sostenible y reflexión sobre propósitos ambientales para el nuevo año. El evento incluye música en vivo de artistas locales con energía renovable, una amplia variedad de comida local orgánica y vegana, talleres sobre cómo establecer propósitos sostenibles para el nuevo año, actividades para niños sobre cuidado del medio ambiente, y espacios de networking. Todo el evento está diseñado para ser carbono neutral: utilizaremos energía renovable, vasos y platos reutilizables, separación completa de residuos, y compensación de emisiones mediante plantación de árboles. También habrá una ceremonia simbólica de propósitos sostenibles donde los participantes compartirán sus compromisos ambientales para el próximo año, demostraciones de tecnologías sostenibles, y un mercado de productos ecológicos. Los fondos recaudados se destinarán a proyectos de conservación ambiental local. Esta es la celebración perfecta para cerrar el año de manera consciente y comenzar el nuevo año con propósitos sostenibles mientras te conectas con una comunidad comprometida con el planeta.",
    description_en: "Celebrate the end of the year in an eco-friendly way at London's Green Cultural Center with music, local food and sustainable activities. During this 4-hour celebration, you'll enjoy a complete experience that combines entertainment, sustainable gastronomy and reflection on environmental resolutions for the new year. The event includes live music from local artists powered by renewable energy, a wide variety of local organic and vegan food, workshops on how to set sustainable resolutions for the new year, activities for children about environmental care, and networking spaces. The entire event is designed to be carbon neutral: we'll use renewable energy, reusable cups and plates, complete waste separation, and emission offsetting through tree planting. There will also be a symbolic ceremony of sustainable resolutions where participants will share their environmental commitments for the next year, demonstrations of sustainable technologies, and an eco-friendly products market. Funds raised will go to local environmental conservation projects. This is the perfect celebration to close the year consciously and start the new year with sustainable resolutions while connecting with a community committed to the planet.",
    description_de: "Feiern Sie das Jahresende auf umweltfreundliche Weise im Grünen Kulturzentrum von London mit Musik, lokalen Lebensmitteln und nachhaltigen Aktivitäten. Während dieser 4-stündigen Feier genießen Sie eine vollständige Erfahrung, die Unterhaltung, nachhaltige Gastronomie und Reflexion über Umweltvorsätze für das neue Jahr kombiniert. Die Veranstaltung umfasst Live-Musik von lokalen Künstlern mit erneuerbarer Energie, eine Vielzahl lokaler Bio- und veganer Lebensmittel, Workshops darüber, wie man nachhaltige Vorsätze für das neue Jahr setzt, Aktivitäten für Kinder über Umweltschutz und Networking-Räume. Die gesamte Veranstaltung ist darauf ausgelegt, kohlenstoffneutral zu sein: Wir verwenden erneuerbare Energien, wiederverwendbare Becher und Teller, vollständige Abfalltrennung und Emissionsausgleich durch Baumpflanzungen. Es wird auch eine symbolische Zeremonie nachhaltiger Vorsätze geben, bei der die Teilnehmer ihre Umweltverpflichtungen für das nächste Jahr teilen, Demonstrationen nachhaltiger Technologien und einen Markt für umweltfreundliche Produkte. Die gesammelten Mittel gehen an lokale Umweltschutzprojekte. Dies ist die perfekte Feier, um das Jahr bewusst zu beenden und das neue Jahr mit nachhaltigen Vorsätzen zu beginnen, während Sie sich mit einer Gemeinschaft verbinden, die sich dem Planeten verschrieben hat.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.greennewyear.org",
    date: "2025-12-15",
    time: "19:00",
    duration: 4,
    location: "Centro Cultural Verde, Londres",
    location_en: "Green Cultural Center, London",
    location_de: "Grünes Kulturzentrum, London",
    organizer: "Green New Year",
    organizer_en: "Green New Year",
    organizer_de: "Grünes Neujahr",
    category: "community",
    maxVolunteers: 120,
    currentVolunteers: 95,
    requirements: ["Entrada gratuita con registro previo", "Ropa cómoda para celebrar", "Botella de agua reutilizable", "Espíritu festivo y sostenible", "Opcional: trae tus propósitos sostenibles para compartir"],
    requirements_en: ["Free entry with prior registration", "Comfortable clothes to celebrate", "Reusable water bottle", "Festive and sustainable spirit", "Optional: bring your sustainable resolutions to share"],
    requirements_de: ["Freier Eintritt mit vorheriger Anmeldung", "Bequeme Kleidung zum Feiern", "Wiederverwendbare Wasserflasche", "Festlicher und nachhaltiger Geist", "Optional: bringen Sie Ihre nachhaltigen Vorsätze zum Teilen mit"],
    benefits: ["Acceso VIP a áreas exclusivas", "Degustaciones gratuitas de productos premium", "Souvenirs ecológicos de año nuevo", "Guía de propósitos sostenibles para el nuevo año", "Talleres sobre cómo mantener propósitos ambientales", "Fotografías profesionales del evento", "Certificado de participación carbono neutral"],
    benefits_en: ["VIP access to exclusive areas", "Free tastings of premium products", "Eco-friendly New Year souvenirs", "Guide to sustainable resolutions for the new year", "Workshops on how to maintain environmental resolutions", "Professional event photographs", "Carbon neutral participation certificate"],
    benefits_de: ["VIP-Zugang zu exklusiven Bereichen", "Kostenlose Verkostungen von Premium-Produkten", "Umweltfreundliche Neujahrssouvenirs", "Leitfaden zu nachhaltigen Vorsätzen für das neue Jahr", "Workshops darüber, wie man Umweltvorsätze aufrechterhält", "Professionelle Event-Fotografien", "Kohlenstoffneutrales Teilnahmezertifikat"],
    contact: "añonuevo@green.es"
  },
  "e31": {
    id: "e31",
    title: "Conservación Marina y Protección de Ecosistemas Oceánicos",
    title_en: "Marine Conservation and Ocean Ecosystem Protection",
    title_de: "Meeresschutz und Schutz mariner Ökosysteme",
    description: "Aprende sobre la conservación de especies marinas y participa en actividades de protección del océano en el Centro Marino de Berlín. Durante esta actividad de 3 horas, te sumergirás en el fascinante mundo de la conservación marina y aprenderás sobre las amenazas que enfrentan nuestros océanos y las especies que los habitan. Aprenderás sobre la importancia de los océanos para la vida en la Tierra, las principales amenazas como la contaminación plástica, la sobrepesca, el cambio climático y la acidificación de los océanos, y las estrategias de conservación que están funcionando en diferentes partes del mundo. Realizaremos actividades prácticas de identificación de especies marinas, análisis de muestras de agua, identificación de microplásticos, y diseño de campañas de concienciación. También exploraremos cómo puedes contribuir a la conservación marina desde tierra firme, qué productos evitar para proteger los océanos, y cómo participar en proyectos de ciencia ciudadana marina. El centro incluye acuarios educativos, exposiciones interactivas, y acceso a datos de monitoreo oceánico. Esta es una oportunidad única para entender la importancia crítica de nuestros océanos y encontrar formas concretas de contribuir a su protección.",
    description_en: "Learn about marine species conservation and participate in ocean protection activities at Berlin's Marine Center. During this 3-hour activity, you'll dive into the fascinating world of marine conservation and learn about the threats facing our oceans and the species that inhabit them. You'll learn about the importance of oceans for life on Earth, major threats such as plastic pollution, overfishing, climate change and ocean acidification, and conservation strategies that are working in different parts of the world. We'll carry out practical activities of marine species identification, water sample analysis, microplastic identification, and awareness campaign design. We'll also explore how you can contribute to marine conservation from land, what products to avoid to protect oceans, and how to participate in marine citizen science projects. The center includes educational aquariums, interactive exhibitions, and access to ocean monitoring data. This is a unique opportunity to understand the critical importance of our oceans and find concrete ways to contribute to their protection.",
    description_de: "Lernen Sie etwas über den Schutz mariner Arten und nehmen Sie an Aktivitäten zum Schutz der Ozeane im Meereszentrum von Berlin teil. Während dieser 3-stündigen Aktivität tauchen Sie in die faszinierende Welt des Meeresschutzes ein und lernen die Bedrohungen kennen, denen unsere Ozeane und die Arten, die sie bewohnen, ausgesetzt sind. Sie lernen die Bedeutung der Ozeane für das Leben auf der Erde, große Bedrohungen wie Plastikverschmutzung, Überfischung, Klimawandel und Versauerung der Ozeane sowie Naturschutzstrategien kennen, die in verschiedenen Teilen der Welt funktionieren. Wir führen praktische Aktivitäten zur Identifizierung mariner Arten, Wasserprobenanalyse, Mikroplastikidentifizierung und Gestaltung von Sensibilisierungskampagnen durch. Wir werden auch erkunden, wie Sie vom Land aus zum Meeresschutz beitragen können, welche Produkte Sie vermeiden sollten, um die Ozeane zu schützen, und wie Sie an marinen Bürgerwissenschaftsprojekten teilnehmen können. Das Zentrum umfasst Bildungsaquarien, interaktive Ausstellungen und Zugang zu Ozeanüberwachungsdaten. Dies ist eine einzigartige Gelegenheit, die kritische Bedeutung unserer Ozeane zu verstehen und konkrete Wege zu finden, zu ihrem Schutz beizutragen.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    website: "https://www.marineprotectors.org",
    date: "2025-12-19",
    time: "11:00",
    duration: 3,
    location: "Centro Marino, Berlín",
    location_en: "Marine Center, Berlin",
    location_de: "Meereszentrum, Berlin",
    organizer: "Marine Protectors",
    organizer_en: "Marine Protectors",
    organizer_de: "Meeresschützer",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 20,
    requirements: ["Ropa cómoda", "Cuaderno para tomar notas", "Interés en conservación marina", "Opcional: cámara o smartphone para fotografías", "Agua para hidratación"],
    requirements_en: ["Comfortable clothes", "Notebook for taking notes", "Interest in marine conservation", "Optional: camera or smartphone for photos", "Water for hydration"],
    requirements_de: ["Bequeme Kleidung", "Notizbuch zum Mitschreiben", "Interesse am Meeresschutz", "Optional: Kamera oder Smartphone für Fotos", "Wasser zur Hydratation"],
    benefits: ["Guía completa de especies marinas y conservación", "Certificado de participación en conservación marina", "Material educativo completo sobre ecosistemas oceánicos", "Acceso a datos de monitoreo oceánico", "Guía práctica de acciones para proteger los océanos", "Oportunidades de participar en proyectos de ciencia ciudadana marina", "Descuentos en futuras actividades marinas"],
    benefits_en: ["Complete guide to marine species and conservation", "Marine conservation participation certificate", "Complete educational material on ocean ecosystems", "Access to ocean monitoring data", "Practical guide to actions to protect oceans", "Opportunities to participate in marine citizen science projects", "Discounts on future marine activities"],
    benefits_de: ["Vollständiger Leitfaden zu marinen Arten und Naturschutz", "Teilnahmezertifikat für Meeresschutz", "Vollständiges Bildungsmaterial über Ozeanökosysteme", "Zugang zu Ozeanüberwachungsdaten", "Praktischer Leitfaden für Maßnahmen zum Schutz der Ozeane", "Möglichkeiten zur Teilnahme an marinen Bürgerwissenschaftsprojekten", "Rabatte auf zukünftige Meeresaktivitäten"],
    contact: "marino@protectors.es"
  },
  "e32": {
    id: "e32",
    title: "Taller Práctico de Energía Hidroeléctrica y Generadores Pequeños",
    title_en: "Practical Hydroelectric Energy and Small Generators Workshop",
    title_de: "Praktischer Workshop für Wasserkraft und kleine Generatoren",
    description: "Aprende sobre energía hidroeléctrica y participa en la construcción de pequeños generadores hidráulicos en este taller práctico de 3 horas en el Centro Hidroeléctrico de Madrid. Descubrirás cómo funciona la energía hidroeléctrica, los principios físicos detrás de la conversión de energía cinética del agua en electricidad, y cómo construir sistemas hidroeléctricos a pequeña escala. Aprenderás sobre diferentes tipos de turbinas hidráulicas, diseño de sistemas de captación de agua, cálculo de potencia generada, y cómo integrar generadores hidroeléctricos pequeños en sistemas de energía renovable. Realizaremos actividades prácticas donde construirás tu propio generador hidráulico funcional, aprenderás a medir la potencia generada, y cómo optimizar el diseño para diferentes flujos de agua. También exploraremos el impacto ambiental de la energía hidroeléctrica, cómo minimizar los efectos negativos, y las mejores prácticas para proyectos hidroeléctricos sostenibles. El taller incluye una visita a un sistema hidroeléctrico real en funcionamiento y demostraciones de diferentes tecnologías. Esta es una oportunidad única para entender una de las fuentes de energía renovable más importantes del mundo y aprender a construir sistemas hidroeléctricos prácticos para uso doméstico o comunitario.",
    description_en: "Learn about hydroelectric energy and participate in the construction of small hydraulic generators in this 3-hour practical workshop at Madrid's Hydroelectric Center. You'll discover how hydroelectric energy works, the physical principles behind converting water's kinetic energy into electricity, and how to build small-scale hydroelectric systems. You'll learn about different types of hydraulic turbines, water collection system design, power generation calculation, and how to integrate small hydroelectric generators into renewable energy systems. We'll carry out practical activities where you'll build your own functional hydraulic generator, learn to measure generated power, and how to optimize the design for different water flows. We'll also explore the environmental impact of hydroelectric energy, how to minimize negative effects, and best practices for sustainable hydroelectric projects. The workshop includes a visit to a real operating hydroelectric system and demonstrations of different technologies. This is a unique opportunity to understand one of the world's most important renewable energy sources and learn to build practical hydroelectric systems for domestic or community use.",
    description_de: "Lernen Sie etwas über Wasserkraft und nehmen Sie an der Konstruktion kleiner Wassergeneratoren in diesem 3-stündigen praktischen Workshop im Wasserkraftzentrum von Madrid teil. Sie werden entdecken, wie Wasserkraft funktioniert, die physikalischen Prinzipien hinter der Umwandlung der kinetischen Energie des Wassers in Elektrizität und wie man kleine Wasserkraftsysteme baut. Sie lernen verschiedene Arten von Wasserturbinen, Design von Wassersammlungssystemen, Berechnung der Stromerzeugung und wie man kleine Wasserkraftgeneratoren in erneuerbare Energiesysteme integriert. Wir führen praktische Aktivitäten durch, bei denen Sie Ihren eigenen funktionierenden Wassergenerator bauen, lernen, die erzeugte Leistung zu messen, und wie Sie das Design für verschiedene Wasserströme optimieren. Wir werden auch die Umweltauswirkungen der Wasserkraft erkunden, wie man negative Auswirkungen minimiert und bewährte Praktiken für nachhaltige Wasserkraftprojekte. Der Workshop umfasst einen Besuch eines echten funktionierenden Wasserkraftsystems und Demonstrationen verschiedener Technologien. Dies ist eine einzigartige Gelegenheit, eine der wichtigsten erneuerbaren Energiequellen der Welt zu verstehen und zu lernen, praktische Wasserkraftsysteme für den häuslichen oder gemeinschaftlichen Gebrauch zu bauen.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    website: "https://www.hydroelectricenergy.org",
    date: "2025-12-22",
    time: "14:00",
    duration: 3,
    location: "Centro Hidroeléctrico, Madrid",
    location_en: "Hydroelectric Center, Madrid",
    location_de: "Wasserkraftzentrum, Madrid",
    organizer: "Hydroelectric Energy",
    organizer_en: "Hydroelectric Energy",
    organizer_de: "Wasserkraft Energie",
    category: "education",
    maxVolunteers: 18,
    currentVolunteers: 15,
    requirements: ["Conocimientos básicos de física (recomendado pero no obligatorio)", "Ropa cómoda que puedas ensuciar", "Cuaderno para tomar notas", "Herramientas básicas (proporcionamos)", "Interés en energías renovables", "Opcional: calculadora para cálculos"],
    requirements_en: ["Basic knowledge of physics (recommended but not required)", "Comfortable clothes you can get dirty", "Notebook for taking notes", "Basic tools (we provide)", "Interest in renewable energy", "Optional: calculator for calculations"],
    requirements_de: ["Grundkenntnisse in Physik (empfohlen, aber nicht erforderlich)", "Bequeme Kleidung, die schmutzig werden kann", "Notizbuch zum Mitschreiben", "Grundwerkzeuge (wir stellen zur Verfügung)", "Interesse an erneuerbaren Energien", "Optional: Taschenrechner für Berechnungen"],
    benefits: ["Kit completo de construcción de generador hidráulico", "Manual técnico completo sobre energía hidroeléctrica", "Certificado de participación en energía renovable", "Guía de cálculo de potencia y diseño", "Acceso a recursos online sobre sistemas hidroeléctricos", "Visita guiada a sistema hidroeléctrico real", "Oportunidades de participar en proyectos comunitarios"],
    benefits_en: ["Complete hydraulic generator construction kit", "Complete technical manual on hydroelectric energy", "Renewable energy participation certificate", "Power calculation and design guide", "Access to online resources on hydroelectric systems", "Guided visit to real hydroelectric system", "Opportunities to participate in community projects"],
    benefits_de: ["Vollständiges Bausatz für Wassergenerator", "Vollständiges technisches Handbuch über Wasserkraft", "Teilnahmezertifikat für erneuerbare Energien", "Leitfaden zur Leistungsberechnung und Design", "Zugang zu Online-Ressourcen über Wasserkraftsysteme", "Geführter Besuch eines echten Wasserkraftsystems", "Möglichkeiten zur Teilnahme an Gemeinschaftsprojekten"],
    contact: "hidro@energy.es"
  },
  "e33": {
    id: "e33",
    title: "Gran Fiesta de Fin de Año Sostenible y Celebración Comunitaria",
    title_en: "Big Sustainable End-of-Year Party and Community Celebration",
    title_de: "Große nachhaltige Jahresendfeier und Gemeinschaftsfeier",
    description: "Celebra el fin de año de manera sostenible en nuestra gran fiesta comunitaria en la Plaza de la Sostenibilidad de Barcelona. Durante esta celebración de 5 horas, disfrutarás de una experiencia completa que combina entretenimiento, gastronomía sostenible, música en vivo, y actividades para toda la familia. El evento incluye música en vivo de artistas locales con energía renovable, una amplia variedad de comida local orgánica y vegana de food trucks ecológicos, talleres rápidos sobre sostenibilidad, actividades para niños con materiales reciclados, espacios de networking, y una ceremonia simbólica de propósitos sostenibles para el nuevo año. Todo el evento está diseñado para ser completamente carbono neutral: utilizaremos energía renovable, vasos y platos reutilizables, separación completa de residuos con estaciones de reciclaje, y compensación de emisiones mediante plantación de árboles. También habrá demostraciones de tecnologías sostenibles, exposiciones de arte ambiental, un mercado de productos locales, y espacios para compartir ideas sobre cómo vivir de manera más sostenible en el nuevo año. Los fondos recaudados se destinarán a proyectos locales de conservación ambiental. Esta es la celebración perfecta para cerrar el año de manera consciente y comenzar el nuevo año con propósitos sostenibles mientras te conectas con una comunidad comprometida con el planeta.",
    description_en: "Celebrate the end of the year sustainably at our big community party at Barcelona's Sustainability Square. During this 5-hour celebration, you'll enjoy a complete experience that combines entertainment, sustainable gastronomy, live music, and activities for the whole family. The event includes live music from local artists powered by renewable energy, a wide variety of local organic and vegan food from eco-friendly food trucks, quick sustainability workshops, activities for children with recycled materials, networking spaces, and a symbolic ceremony of sustainable resolutions for the new year. The entire event is designed to be completely carbon neutral: we'll use renewable energy, reusable cups and plates, complete waste separation with recycling stations, and emission offsetting through tree planting. There will also be demonstrations of sustainable technologies, environmental art exhibitions, a local products market, and spaces to share ideas about how to live more sustainably in the new year. Funds raised will go to local environmental conservation projects. This is the perfect celebration to close the year consciously and start the new year with sustainable resolutions while connecting with a community committed to the planet.",
    description_de: "Feiern Sie das Jahresende nachhaltig auf unserer großen Gemeinschaftsfeier auf dem Nachhaltigkeitsplatz von Barcelona. Während dieser 5-stündigen Feier genießen Sie eine vollständige Erfahrung, die Unterhaltung, nachhaltige Gastronomie, Live-Musik und Aktivitäten für die ganze Familie kombiniert. Die Veranstaltung umfasst Live-Musik von lokalen Künstlern mit erneuerbarer Energie, eine Vielzahl lokaler Bio- und veganer Lebensmittel von umweltfreundlichen Food-Trucks, schnelle Nachhaltigkeitsworkshops, Aktivitäten für Kinder mit recycelten Materialien, Networking-Räume und eine symbolische Zeremonie nachhaltiger Vorsätze für das neue Jahr. Die gesamte Veranstaltung ist darauf ausgelegt, vollständig kohlenstoffneutral zu sein: Wir verwenden erneuerbare Energien, wiederverwendbare Becher und Teller, vollständige Abfalltrennung mit Recyclingstationen und Emissionsausgleich durch Baumpflanzungen. Es wird auch Demonstrationen nachhaltiger Technologien, Umweltkunstausstellungen, einen lokalen Produktmarkt und Räume geben, um Ideen darüber auszutauschen, wie man im neuen Jahr nachhaltiger leben kann. Die gesammelten Mittel gehen an lokale Umweltschutzprojekte. Dies ist die perfekte Feier, um das Jahr bewusst zu beenden und das neue Jahr mit nachhaltigen Vorsätzen zu beginnen, während Sie sich mit einer Gemeinschaft verbinden, die sich dem Planeten verschrieben hat.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.totalsustainability.org",
    date: "2025-12-29",
    time: "20:00",
    duration: 5,
    location: "Plaza de la Sostenibilidad, Barcelona",
    location_en: "Sustainability Square, Barcelona",
    location_de: "Nachhaltigkeitsplatz, Barcelona",
    organizer: "Total Sustainability",
    organizer_en: "Total Sustainability",
    organizer_de: "Totale Nachhaltigkeit",
    category: "community",
    maxVolunteers: 150,
    currentVolunteers: 120,
    requirements: ["Entrada gratuita con registro previo obligatorio", "Ropa cómoda para celebrar", "Botella de agua reutilizable", "Espíritu festivo y sostenible", "Opcional: trae tus propósitos sostenibles para compartir", "Opcional: manta o silla plegable para sentarse"],
    requirements_en: ["Free entry with mandatory prior registration", "Comfortable clothes to celebrate", "Reusable water bottle", "Festive and sustainable spirit", "Optional: bring your sustainable resolutions to share", "Optional: blanket or folding chair to sit"],
    requirements_de: ["Freier Eintritt mit verbindlicher vorheriger Anmeldung", "Bequeme Kleidung zum Feiern", "Wiederverwendbare Wasserflasche", "Festlicher und nachhaltiger Geist", "Optional: bringen Sie Ihre nachhaltigen Vorsätze zum Teilen mit", "Optional: Decke oder Klappstuhl zum Sitzen"],
    benefits: ["Acceso VIP a áreas exclusivas con mejor vista", "Degustaciones gratuitas de productos premium locales", "Souvenirs ecológicos hechos localmente", "Guía completa de propósitos sostenibles para el nuevo año", "Talleres sobre cómo mantener propósitos ambientales", "Fotografías profesionales del evento compartidas digitalmente", "Certificado de participación carbono neutral", "Acceso prioritario a todas las actividades", "Descuentos especiales en productos sostenibles del mercado", "Oportunidad de participar en la ceremonia de propósitos sostenibles"],
    benefits_en: ["VIP access to exclusive areas with better view", "Free tastings of premium local products", "Eco-friendly souvenirs made locally", "Complete guide to sustainable resolutions for the new year", "Workshops on how to maintain environmental resolutions", "Professional event photographs shared digitally", "Carbon neutral participation certificate", "Priority access to all activities", "Special discounts on sustainable market products", "Opportunity to participate in sustainable resolutions ceremony"],
    benefits_de: ["VIP-Zugang zu exklusiven Bereichen mit besserer Aussicht", "Kostenlose Verkostungen von Premium-Lokalprodukten", "Lokal hergestellte umweltfreundliche Souvenirs", "Vollständiger Leitfaden zu nachhaltigen Vorsätzen für das neue Jahr", "Workshops darüber, wie man Umweltvorsätze aufrechterhält", "Professionelle Event-Fotografien digital geteilt", "Kohlenstoffneutrales Teilnahmezertifikat", "Prioritätszugang zu allen Aktivitäten", "Spezielle Rabatte auf nachhaltige Marktprodukte", "Möglichkeit zur Teilnahme an der Zeremonie nachhaltiger Vorsätze"],
    contact: "sostenibilidad@total.es"
  },
  "e34": {
    id: "e34",
    title: "Hackathon Verde: Tecnología para el Planeta",
    title_en: "Green Hackathon: Technology for the Planet",
    title_de: "Grünes Hackathon: Technologie für den Planeten",
    description: "Únete a nuestro hackathon intensivo de 48 horas donde desarrolladores, diseñadores y emprendedores trabajarán en equipo para crear soluciones tecnológicas innovadoras que aborden los desafíos ambientales más urgentes. Este evento reúne a los mejores talentos tecnológicos para desarrollar prototipos funcionales en áreas como: monitoreo ambiental con IoT, aplicaciones de consumo responsable, plataformas de economía circular, sistemas de blockchain para transparencia en cadenas de suministro sostenibles, herramientas de análisis de huella de carbono, y soluciones de energía renovable. El hackathon incluye talleres especializados sobre IoT para monitoreo ambiental, desarrollo de apps sostenibles con React Native y Flutter, integración de blockchain para trazabilidad ecológica, y diseño UX centrado en la sostenibilidad. Contarás con mentores expertos en tecnología verde, acceso a APIs ambientales, hardware IoT (sensores, placas Arduino, Raspberry Pi), y espacios de trabajo colaborativos. Las categorías de premios incluyen: mejor solución de impacto ambiental, mejor uso de tecnología IoT, mejor app de consumo responsable, mejor integración de blockchain, y premio del público. Además de los premios en efectivo, los proyectos ganadores recibirán incubación, acceso a inversores, y apoyo para llevar sus soluciones al mercado. Este es el evento perfecto para desarrolladores que quieren usar sus habilidades para hacer una diferencia real en el planeta.",
    description_en: "Join our intensive 48-hour hackathon where developers, designers, and entrepreneurs will work in teams to create innovative technological solutions that address the most urgent environmental challenges. This event brings together the best tech talent to develop functional prototypes in areas such as: environmental monitoring with IoT, responsible consumption applications, circular economy platforms, blockchain systems for transparency in sustainable supply chains, carbon footprint analysis tools, and renewable energy solutions. The hackathon includes specialized workshops on IoT for environmental monitoring, sustainable app development with React Native and Flutter, blockchain integration for ecological traceability, and sustainability-centered UX design. You'll have expert mentors in green technology, access to environmental APIs, IoT hardware (sensors, Arduino boards, Raspberry Pi), and collaborative workspaces. Prize categories include: best environmental impact solution, best use of IoT technology, best responsible consumption app, best blockchain integration, and audience award. In addition to cash prizes, winning projects will receive incubation, access to investors, and support to bring their solutions to market. This is the perfect event for developers who want to use their skills to make a real difference on the planet.",
    description_de: "Nehmen Sie an unserem intensiven 48-Stunden-Hackathon teil, bei dem Entwickler, Designer und Unternehmer in Teams zusammenarbeiten, um innovative technologische Lösungen zu entwickeln, die die dringendsten Umweltprobleme angehen. Diese Veranstaltung bringt die besten Tech-Talente zusammen, um funktionale Prototypen in Bereichen wie Umweltüberwachung mit IoT, Anwendungen für verantwortungsvollen Konsum, Plattformen für Kreislaufwirtschaft, Blockchain-Systeme für Transparenz in nachhaltigen Lieferketten, Tools zur Analyse des CO2-Fußabdrucks und Lösungen für erneuerbare Energien zu entwickeln. Das Hackathon umfasst spezialisierte Workshops zu IoT für Umweltüberwachung, Entwicklung nachhaltiger Apps mit React Native und Flutter, Blockchain-Integration für ökologische Rückverfolgbarkeit und nachhaltigkeitsorientiertes UX-Design. Sie haben Experten-Mentoren für grüne Technologie, Zugang zu Umwelt-APIs, IoT-Hardware (Sensoren, Arduino-Boards, Raspberry Pi) und kollaborative Arbeitsräume. Die Preiskategorien umfassen: beste Lösung für Umweltauswirkungen, beste Nutzung von IoT-Technologie, beste App für verantwortungsvollen Konsum, beste Blockchain-Integration und Publikumspreis. Zusätzlich zu Geldpreisen erhalten die Gewinnerprojekte Inkubation, Zugang zu Investoren und Unterstützung, um ihre Lösungen auf den Markt zu bringen. Dies ist die perfekte Veranstaltung für Entwickler, die ihre Fähigkeiten nutzen möchten, um einen echten Unterschied auf dem Planeten zu bewirken.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    website: "https://www.greenhackathon.org",
    date: "2025-11-15",
    time: "09:00",
    duration: 48,
    location: "Centro de Innovación Tecnológica, Madrid",
    location_en: "Technology Innovation Center, Madrid",
    location_de: "Technologie-Innovationszentrum, Madrid",
    organizer: "Green Tech Hub",
    organizer_en: "Green Tech Hub",
    organizer_de: "Grünes Tech-Zentrum",
    category: "technology",
    maxVolunteers: 100,
    minVolunteers: 30,
    currentVolunteers: 65,
    requirements: ["Laptop con sistema operativo actualizado", "Conocimientos básicos de programación (cualquier lenguaje)", "IDE o editor de código instalado (VS Code, IntelliJ, etc.)", "Cuenta de GitHub", "Ideas innovadoras o disposición para trabajar en equipo", "Disponibilidad para las 48 horas completas (se permiten descansos)", "Cargador de laptop y extensión de energía", "Ropa cómoda para trabajar", "Dispositivo móvil para pruebas (opcional pero recomendado)", "Conocimientos básicos de Git (recomendado)"],
    requirements_en: ["Laptop with updated operating system", "Basic programming knowledge (any language)", "IDE or code editor installed (VS Code, IntelliJ, etc.)", "GitHub account", "Innovative ideas or willingness to work in a team", "Availability for the full 48 hours (breaks allowed)", "Laptop charger and power extension", "Comfortable work clothing", "Mobile device for testing (optional but recommended)", "Basic Git knowledge (recommended)"],
    requirements_de: ["Laptop mit aktualisiertem Betriebssystem", "Grundkenntnisse in Programmierung (beliebige Sprache)", "IDE oder Code-Editor installiert (VS Code, IntelliJ usw.)", "GitHub-Konto", "Innovative Ideen oder Bereitschaft zur Teamarbeit", "Verfügbarkeit für die vollen 48 Stunden (Pausen erlaubt)", "Laptop-Ladegerät und Stromverlängerung", "Bequeme Arbeitskleidung", "Mobilgerät zum Testen (optional, aber empfohlen)", "Grundkenntnisse in Git (empfohlen)"],
    benefits: ["Premios en efectivo (total €15,000 distribuidos en 5 categorías)", "Mentoría técnica especializada durante todo el evento", "Acceso a hardware IoT (sensores, Arduino, Raspberry Pi)", "APIs ambientales gratuitas para uso en proyectos", "Oportunidades de networking con inversores y emprendedores", "Incubación para proyectos ganadores", "Certificado de participación profesional", "Comida y bebidas incluidas durante las 48 horas", "Espacios de descanso y áreas de networking", "Acceso a recursos educativos y documentación técnica", "Posibilidad de continuar desarrollando el proyecto después del evento", "Exposición mediática para proyectos destacados"],
    benefits_en: ["Cash prizes (total €15,000 distributed across 5 categories)", "Specialized technical mentorship throughout the event", "Access to IoT hardware (sensors, Arduino, Raspberry Pi)", "Free environmental APIs for use in projects", "Networking opportunities with investors and entrepreneurs", "Incubation for winning projects", "Professional participation certificate", "Food and drinks included during the 48 hours", "Rest areas and networking spaces", "Access to educational resources and technical documentation", "Possibility to continue developing the project after the event", "Media exposure for outstanding projects"],
    benefits_de: ["Geldpreise (insgesamt €15.000 verteilt auf 5 Kategorien)", "Spezialisiertes technisches Mentoring während der gesamten Veranstaltung", "Zugang zu IoT-Hardware (Sensoren, Arduino, Raspberry Pi)", "Kostenlose Umwelt-APIs zur Verwendung in Projekten", "Netzwerkmöglichkeiten mit Investoren und Unternehmern", "Inkubation für Gewinnerprojekte", "Professionelles Teilnahmezertifikat", "Essen und Getränke während der 48 Stunden inbegriffen", "Ruhebereiche und Netzwerkräume", "Zugang zu Bildungsressourcen und technischer Dokumentation", "Möglichkeit, das Projekt nach der Veranstaltung weiterzuentwickeln", "Medienpräsenz für herausragende Projekte"],
    contact: "hackathon@greentech.org"
  },
  "e35": {
    id: "e35",
    title: "Taller de IoT para Monitoreo Ambiental",
    title_en: "IoT Workshop for Environmental Monitoring",
    title_de: "IoT-Workshop für Umweltüberwachung",
    description: "Sumérgete en el mundo del Internet de las Cosas (IoT) aplicado al monitoreo ambiental en este taller práctico de 6 horas. Aprenderás a construir sensores IoT completos desde cero para monitorear calidad del aire (CO2, partículas PM2.5, humedad), humedad del suelo, temperatura ambiente, y niveles de ruido. El taller cubre todo el proceso: desde la selección de componentes y el montaje físico del circuito, hasta la programación con Arduino IDE, la calibración de sensores, y la conexión a plataformas en la nube como ThingSpeak, Adafruit IO, o tu propio servidor. Trabajarás con sensores reales como DHT22 (temperatura y humedad), MQ135 (calidad del aire), sensores de humedad del suelo, y módulos WiFi como ESP8266 o ESP32 para conectividad. Aprenderás a programar en C++ para Arduino, a usar librerías de sensores, a implementar protocolos de comunicación (HTTP, MQTT), y a visualizar datos en tiempo real en dashboards web. También cubriremos aspectos importantes como el consumo energético de sensores IoT, estrategias de bajo consumo para baterías, y mejores prácticas para despliegues en campo. Al finalizar, tendrás un sensor IoT completamente funcional que podrás llevar a casa, junto con el código fuente y las instrucciones para replicarlo. Este taller es ideal para desarrolladores, makers, estudiantes de ingeniería, y cualquier persona interesada en tecnología ambiental práctica.",
    description_en: "Dive into the world of the Internet of Things (IoT) applied to environmental monitoring in this 6-hour hands-on workshop. You'll learn to build complete IoT sensors from scratch to monitor air quality (CO2, PM2.5 particles, humidity), soil moisture, ambient temperature, and noise levels. The workshop covers the entire process: from component selection and physical circuit assembly, to programming with Arduino IDE, sensor calibration, and connection to cloud platforms like ThingSpeak, Adafruit IO, or your own server. You'll work with real sensors like DHT22 (temperature and humidity), MQ135 (air quality), soil moisture sensors, and WiFi modules like ESP8266 or ESP32 for connectivity. You'll learn to program in C++ for Arduino, use sensor libraries, implement communication protocols (HTTP, MQTT), and visualize real-time data on web dashboards. We'll also cover important aspects such as IoT sensor power consumption, low-power strategies for batteries, and best practices for field deployments. At the end, you'll have a fully functional IoT sensor that you can take home, along with the source code and instructions to replicate it. This workshop is ideal for developers, makers, engineering students, and anyone interested in practical environmental technology.",
    description_de: "Tauchen Sie ein in die Welt des Internet der Dinge (IoT) angewendet auf Umweltüberwachung in diesem 6-stündigen praktischen Workshop. Sie lernen, vollständige IoT-Sensoren von Grund auf zu bauen, um Luftqualität (CO2, PM2.5-Partikel, Feuchtigkeit), Bodenfeuchtigkeit, Umgebungstemperatur und Geräuschpegel zu überwachen. Der Workshop deckt den gesamten Prozess ab: von der Komponentenauswahl und dem physischen Schaltungsaufbau bis zur Programmierung mit Arduino IDE, Sensorkalibrierung und Verbindung zu Cloud-Plattformen wie ThingSpeak, Adafruit IO oder Ihrem eigenen Server. Sie arbeiten mit echten Sensoren wie DHT22 (Temperatur und Feuchtigkeit), MQ135 (Luftqualität), Bodenfeuchtigkeitssensoren und WiFi-Modulen wie ESP8266 oder ESP32 für Konnektivität. Sie lernen, in C++ für Arduino zu programmieren, Sensorbibliotheken zu verwenden, Kommunikationsprotokolle (HTTP, MQTT) zu implementieren und Echtzeitdaten auf Web-Dashboards zu visualisieren. Wir behandeln auch wichtige Aspekte wie den Stromverbrauch von IoT-Sensoren, Strategien für niedrigen Stromverbrauch für Batterien und bewährte Praktiken für Feldbereitstellungen. Am Ende haben Sie einen voll funktionsfähigen IoT-Sensor, den Sie mit nach Hause nehmen können, zusammen mit dem Quellcode und Anleitungen zur Replikation. Dieser Workshop ist ideal für Entwickler, Maker, Ingenieurstudenten und alle, die sich für praktische Umwelttechnologie interessieren.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    website: "https://www.iotenvironment.org",
    date: "2025-11-22",
    time: "10:00",
    duration: 6,
    location: "Fab Lab, Berlín",
    location_en: "Fab Lab, Berlin",
    location_de: "Fab Lab, Berlin",
    organizer: "IoT Environmental",
    organizer_en: "IoT Environmental",
    organizer_de: "IoT Umwelt",
    category: "technology",
    maxVolunteers: 25,
    minVolunteers: 8,
    currentVolunteers: 18,
    requirements: ["Laptop con puerto USB", "Arduino IDE instalado (versión 1.8 o superior)", "Kit Arduino básico con ESP8266 o ESP32 (opcional, proporcionamos algunos)", "Conocimientos básicos de electrónica y programación (recomendado)", "Cuenta de GitHub (opcional, para compartir código)", "Cable USB para conectar Arduino", "Herramientas básicas: multímetro, soldador (opcional)", "Dispositivo móvil con WiFi para pruebas (opcional)", "Cuaderno para tomar notas", "Conocimientos básicos de inglés técnico (la documentación está en inglés)"],
    requirements_en: ["Laptop with USB port", "Arduino IDE installed (version 1.8 or higher)", "Basic Arduino kit with ESP8266 or ESP32 (optional, we provide some)", "Basic knowledge of electronics and programming (recommended)", "GitHub account (optional, for sharing code)", "USB cable to connect Arduino", "Basic tools: multimeter, soldering iron (optional)", "Mobile device with WiFi for testing (optional)", "Notebook for taking notes", "Basic knowledge of technical English (documentation is in English)"],
    requirements_de: ["Laptop mit USB-Anschluss", "Arduino IDE installiert (Version 1.8 oder höher)", "Grund-Arduino-Kit mit ESP8266 oder ESP32 (optional, wir stellen einige zur Verfügung)", "Grundkenntnisse in Elektronik und Programmierung (empfohlen)", "GitHub-Konto (optional, zum Teilen von Code)", "USB-Kabel zum Anschließen von Arduino", "Grundwerkzeuge: Multimeter, Lötkolben (optional)", "Mobilgerät mit WiFi zum Testen (optional)", "Notizbuch zum Mitschreiben", "Grundkenntnisse in technischem Englisch (Dokumentation ist auf Englisch)"],
    benefits: ["Sensor IoT completamente funcional para llevar a casa", "Código fuente completo con comentarios detallados", "Certificado de participación profesional", "Acceso gratuito a plataforma cloud (ThingSpeak o Adafruit IO) por 6 meses", "Guía completa de componentes y dónde comprarlos", "Documentación técnica completa del proyecto", "Acceso a comunidad online de participantes", "Descuento en kits Arduino y componentes", "Tutoriales adicionales en video", "Soporte técnico post-taller por email", "Posibilidad de unirte a proyectos de monitoreo ambiental comunitario", "Acceso a datos históricos de sensores ambientales"],
    benefits_en: ["Fully functional IoT sensor to take home", "Complete source code with detailed comments", "Professional participation certificate", "Free access to cloud platform (ThingSpeak or Adafruit IO) for 6 months", "Complete component guide and where to buy them", "Complete technical documentation of the project", "Access to online community of participants", "Discount on Arduino kits and components", "Additional video tutorials", "Post-workshop technical support by email", "Possibility to join community environmental monitoring projects", "Access to historical environmental sensor data"],
    benefits_de: ["Voll funktionsfähiger IoT-Sensor zum Mitnehmen", "Vollständiger Quellcode mit detaillierten Kommentaren", "Professionelles Teilnahmezertifikat", "Kostenloser Zugang zur Cloud-Plattform (ThingSpeak oder Adafruit IO) für 6 Monate", "Vollständiger Komponentenführer und wo man sie kauft", "Vollständige technische Dokumentation des Projekts", "Zugang zur Online-Community der Teilnehmer", "Rabatt auf Arduino-Kits und Komponenten", "Zusätzliche Video-Tutorials", "Technischer Support nach dem Workshop per E-Mail", "Möglichkeit, sich Gemeinschaftsprojekten zur Umweltüberwachung anzuschließen", "Zugang zu historischen Umwelt-Sensordaten"],
    contact: "iot@environment.org"
  },
  "e36": {
    id: "e36",
    title: "Desarrollo de Apps Sostenibles",
    title_en: "Sustainable Apps Development",
    title_de: "Entwicklung nachhaltiger Apps",
    description: "Aprende a desarrollar aplicaciones móviles que promuevan la sostenibilidad y el consumo responsable en este workshop intensivo de 4 horas. Trabajarás con React Native para crear una app completa desde cero que integre APIs ambientales, funcionalidades de consumo responsable, y diseño UX centrado en la sostenibilidad. El taller cubre: configuración del entorno de desarrollo React Native, estructura de proyectos móviles sostenibles, integración con APIs ambientales (calidad del aire, huella de carbono, productos ecológicos), diseño de interfaces que promuevan comportamientos sostenibles, implementación de funcionalidades como calculadora de huella de carbono, guía de productos ecológicos, y seguimiento de hábitos sostenibles. Aprenderás técnicas avanzadas como optimización de rendimiento para reducir consumo de batería, diseño de UX que incentive acciones ecológicas, integración con sensores del dispositivo (GPS, cámara), y mejores prácticas de desarrollo sostenible. También exploraremos cómo monetizar apps sostenibles de manera ética, estrategias de marketing verde, y cómo medir el impacto real de tu aplicación en el comportamiento de los usuarios. Durante el workshop desarrollarás una app funcional que podrás continuar mejorando después del evento. El código fuente completo, junto con documentación y guías de publicación para App Store y Google Play, estarán incluidos. Este workshop es perfecto para desarrolladores móviles que quieren usar sus habilidades para crear impacto positivo, emprendedores tecnológicos interesados en sostenibilidad, y diseñadores UX que buscan especializarse en diseño ecológico.",
    description_en: "Learn to develop mobile applications that promote sustainability and responsible consumption in this intensive 4-hour workshop. You'll work with React Native to create a complete app from scratch that integrates environmental APIs, responsible consumption features, and sustainability-centered UX design. The workshop covers: React Native development environment setup, sustainable mobile project structure, integration with environmental APIs (air quality, carbon footprint, eco-friendly products), design of interfaces that promote sustainable behaviors, implementation of features like carbon footprint calculator, eco-friendly product guide, and sustainable habit tracking. You'll learn advanced techniques such as performance optimization to reduce battery consumption, UX design that incentivizes ecological actions, integration with device sensors (GPS, camera), and best practices for sustainable development. We'll also explore how to monetize sustainable apps ethically, green marketing strategies, and how to measure the real impact of your application on user behavior. During the workshop you'll develop a functional app that you can continue improving after the event. Complete source code, along with documentation and publishing guides for App Store and Google Play, will be included. This workshop is perfect for mobile developers who want to use their skills to create positive impact, tech entrepreneurs interested in sustainability, and UX designers looking to specialize in eco-friendly design.",
    description_de: "Lernen Sie, mobile Anwendungen zu entwickeln, die Nachhaltigkeit und verantwortungsvollen Konsum fördern, in diesem intensiven 4-stündigen Workshop. Sie arbeiten mit React Native, um eine vollständige App von Grund auf zu erstellen, die Umwelt-APIs, Funktionen für verantwortungsvollen Konsum und nachhaltigkeitsorientiertes UX-Design integriert. Der Workshop deckt ab: Einrichtung der React Native-Entwicklungsumgebung, Struktur nachhaltiger mobiler Projekte, Integration mit Umwelt-APIs (Luftqualität, CO2-Fußabdruck, umweltfreundliche Produkte), Gestaltung von Schnittstellen, die nachhaltiges Verhalten fördern, Implementierung von Funktionen wie CO2-Fußabdruck-Rechner, Leitfaden für umweltfreundliche Produkte und Nachverfolgung nachhaltiger Gewohnheiten. Sie lernen fortgeschrittene Techniken wie Leistungsoptimierung zur Reduzierung des Batterieverbrauchs, UX-Design, das ökologische Aktionen fördert, Integration mit Gerätesensoren (GPS, Kamera) und bewährte Praktiken für nachhaltige Entwicklung. Wir werden auch untersuchen, wie man nachhaltige Apps ethisch monetarisiert, grüne Marketingstrategien und wie man die tatsächliche Auswirkung Ihrer Anwendung auf das Benutzerverhalten misst. Während des Workshops entwickeln Sie eine funktionale App, die Sie nach der Veranstaltung weiter verbessern können. Vollständiger Quellcode zusammen mit Dokumentation und Veröffentlichungsleitfäden für App Store und Google Play sind enthalten. Dieser Workshop ist perfekt für mobile Entwickler, die ihre Fähigkeiten nutzen möchten, um positive Auswirkungen zu erzielen, Tech-Unternehmer, die sich für Nachhaltigkeit interessieren, und UX-Designer, die sich auf umweltfreundliches Design spezialisieren möchten.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    website: "https://www.sustainableapps.org",
    date: "2025-11-28",
    time: "14:00",
    duration: 4,
    location: "Tech Campus, Barcelona",
    location_en: "Tech Campus, Barcelona",
    location_de: "Tech Campus, Barcelona",
    organizer: "Sustainable Developers",
    organizer_en: "Sustainable Developers",
    organizer_de: "Nachhaltige Entwickler",
    category: "technology",
    maxVolunteers: 30,
    minVolunteers: 10,
    currentVolunteers: 22,
    requirements: ["Laptop con sistema operativo macOS, Windows o Linux", "Node.js instalado (versión 16 o superior)", "Conocimientos básicos de JavaScript (ES6+)", "Conocimientos básicos de React (recomendado pero no obligatorio)", "Cuenta de GitHub", "Editor de código instalado (VS Code recomendado)", "Xcode instalado (para macOS, para desarrollo iOS)", "Android Studio instalado (opcional, para desarrollo Android)", "Dispositivo móvil iOS o Android para pruebas (recomendado)", "Cuaderno para tomar notas", "Conocimientos básicos de terminal/consola"],
    requirements_en: ["Laptop with macOS, Windows or Linux operating system", "Node.js installed (version 16 or higher)", "Basic JavaScript knowledge (ES6+)", "Basic React knowledge (recommended but not required)", "GitHub account", "Code editor installed (VS Code recommended)", "Xcode installed (for macOS, for iOS development)", "Android Studio installed (optional, for Android development)", "iOS or Android mobile device for testing (recommended)", "Notebook for taking notes", "Basic terminal/console knowledge"],
    requirements_de: ["Laptop mit macOS, Windows oder Linux-Betriebssystem", "Node.js installiert (Version 16 oder höher)", "Grundkenntnisse in JavaScript (ES6+)", "Grundkenntnisse in React (empfohlen, aber nicht erforderlich)", "GitHub-Konto", "Code-Editor installiert (VS Code empfohlen)", "Xcode installiert (für macOS, für iOS-Entwicklung)", "Android Studio installiert (optional, für Android-Entwicklung)", "iOS- oder Android-Mobilgerät zum Testen (empfohlen)", "Notizbuch zum Mitschreiben", "Grundkenntnisse in Terminal/Konsole"],
    benefits: ["App funcional completa desarrollada durante el taller", "Código fuente completo con comentarios y documentación", "Guía completa de publicación para App Store y Google Play", "Certificado de participación profesional", "Acceso a APIs ambientales gratuitas por 3 meses", "Plantilla de proyecto React Native reutilizable", "Guía de diseño UX para apps sostenibles", "Acceso a comunidad online de desarrolladores sostenibles", "Descuento en herramientas de desarrollo y servicios cloud", "Tutoriales adicionales en video sobre temas avanzados", "Soporte técnico post-taller por email", "Oportunidad de presentar tu app en eventos de tecnología verde", "Acceso a recursos de marketing verde para apps"],
    benefits_en: ["Complete functional app developed during the workshop", "Complete source code with comments and documentation", "Complete publishing guide for App Store and Google Play", "Professional participation certificate", "Free access to environmental APIs for 3 months", "Reusable React Native project template", "UX design guide for sustainable apps", "Access to online community of sustainable developers", "Discount on development tools and cloud services", "Additional video tutorials on advanced topics", "Post-workshop technical support by email", "Opportunity to present your app at green tech events", "Access to green marketing resources for apps"],
    benefits_de: ["Vollständige funktionale App, die während des Workshops entwickelt wurde", "Vollständiger Quellcode mit Kommentaren und Dokumentation", "Vollständiger Veröffentlichungsleitfaden für App Store und Google Play", "Professionelles Teilnahmezertifikat", "Kostenloser Zugang zu Umwelt-APIs für 3 Monate", "Wiederverwendbare React Native-Projektvorlage", "UX-Design-Leitfaden für nachhaltige Apps", "Zugang zur Online-Community nachhaltiger Entwickler", "Rabatt auf Entwicklungstools und Cloud-Dienste", "Zusätzliche Video-Tutorials zu fortgeschrittenen Themen", "Technischer Support nach dem Workshop per E-Mail", "Möglichkeit, Ihre App bei grünen Tech-Veranstaltungen zu präsentieren", "Zugang zu grünen Marketingressourcen für Apps"],
    contact: "apps@sustainable.org"
  },
  "e37": {
    id: "e37",
    title: "Blockchain para Sostenibilidad",
    title_en: "Blockchain for Sustainability",
    title_de: "Blockchain für Nachhaltigkeit",
    description: "Explora cómo la tecnología blockchain puede mejorar la transparencia en cadenas de suministro sostenibles, certificaciones ambientales y tokens de impacto ecológico.",
    description_en: "Explore how blockchain technology can improve transparency in sustainable supply chains, environmental certifications and ecological impact tokens.",
    description_de: "Erkunde, wie Blockchain-Technologie die Transparenz in nachhaltigen Lieferketten, Umweltzertifizierungen und ökologischen Impact-Token verbessern kann.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    website: "https://www.blockchainsustainability.org",
    date: "2025-12-05",
    time: "16:00",
    duration: 3,
    location: "Blockchain Hub, París",
    location_en: "Blockchain Hub, Paris",
    location_de: "Blockchain Hub, Paris",
    organizer: "Green Blockchain",
    organizer_en: "Green Blockchain",
    organizer_de: "Grüne Blockchain",
    category: "technology",
    maxVolunteers: 40,
    currentVolunteers: 28,
    requirements: ["Laptop", "Conocimientos básicos de blockchain", "Cuenta en MetaMask"],
    requirements_en: ["Laptop", "Basic blockchain knowledge", "MetaMask account"],
    requirements_de: ["Laptop", "Grundkenntnisse in Blockchain", "MetaMask-Konto"],
    benefits: ["Certificado NFT", "Acceso a red blockchain", "Material educativo"],
    benefits_en: ["NFT certificate", "Blockchain network access", "Educational material"],
    benefits_de: ["NFT-Zertifikat", "Blockchain-Netzwerk-Zugang", "Bildungsmaterial"],
    contact: "blockchain@green.org"
  },
  "e38": {
    id: "e38",
    title: "Machine Learning para Clima",
    title_en: "Machine Learning for Climate",
    title_de: "Maschinelles Lernen für Klima",
    description: "Aprende a usar machine learning para predecir patrones climáticos, optimizar consumo energético y analizar datos ambientales. Python, TensorFlow y datasets climáticos reales.",
    description_en: "Learn to use machine learning to predict weather patterns, optimize energy consumption and analyze environmental data. Python, TensorFlow and real climate datasets.",
    description_de: "Lerne, maschinelles Lernen zu verwenden, um Wettermuster vorherzusagen, den Energieverbrauch zu optimieren und Umweltdaten zu analysieren. Python, TensorFlow und echte Klimadatensätze.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    website: "https://www.mlclimate.org",
    date: "2025-12-10",
    time: "10:00",
    duration: 5,
    location: "AI Research Center, Londres",
    location_en: "AI Research Center, London",
    location_de: "KI-Forschungszentrum, London",
    organizer: "Climate AI",
    organizer_en: "Climate AI",
    organizer_de: "Klima KI",
    category: "technology",
    maxVolunteers: 35,
    currentVolunteers: 25,
    requirements: ["Laptop", "Python 3.8+", "Conocimientos básicos de machine learning"],
    requirements_en: ["Laptop", "Python 3.8+", "Basic machine learning knowledge"],
    requirements_de: ["Laptop", "Python 3.8+", "Grundkenntnisse im maschinellen Lernen"],
    benefits: ["Modelo entrenado", "Dataset completo", "Certificado"],
    benefits_en: ["Trained model", "Complete dataset", "Certificate"],
    benefits_de: ["Trainiertes Modell", "Vollständiger Datensatz", "Zertifikat"],
    contact: "ml@climate.org"
  },
  "e39": {
    id: "e39",
    title: "Smart City Solutions",
    title_en: "Smart City Solutions",
    title_de: "Smart City Lösungen",
    description: "Desarrolla soluciones tecnológicas para ciudades inteligentes: gestión de residuos con sensores, optimización de transporte público, eficiencia energética y participación ciudadana digital.",
    description_en: "Develop technological solutions for smart cities: waste management with sensors, public transport optimization, energy efficiency and digital citizen participation.",
    description_de: "Entwickle technologische Lösungen für Smart Cities: Abfallmanagement mit Sensoren, Optimierung des öffentlichen Verkehrs, Energieeffizienz und digitale Bürgerbeteiligung.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    website: "https://www.smartcitysolutions.org",
    date: "2025-12-12",
    time: "09:00",
    duration: 6,
    location: "Innovation Hub, Milán",
    location_en: "Innovation Hub, Milan",
    location_de: "Innovationszentrum, Mailand",
    organizer: "Smart City Lab",
    organizer_en: "Smart City Lab",
    organizer_de: "Smart City Lab",
    category: "technology",
    maxVolunteers: 45,
    currentVolunteers: 32,
    requirements: ["Laptop", "Conocimientos de programación", "Ideas de proyecto"],
    requirements_en: ["Laptop", "Programming knowledge", "Project ideas"],
    requirements_de: ["Laptop", "Programmierkenntnisse", "Projektideen"],
    benefits: ["Prototipo funcional", "Presentación a autoridades", "Certificado"],
    benefits_en: ["Functional prototype", "Presentation to authorities", "Certificate"],
    benefits_de: ["Funktionaler Prototyp", "Präsentation vor Behörden", "Zertifikat"],
    contact: "smartcity@lab.org"
  },
  "e40": {
    id: "e40",
    title: "Open Source para el Medio Ambiente",
    title_en: "Open Source for the Environment",
    title_de: "Open Source für die Umwelt",
    description: "Contribuye a proyectos open source que ayudan al medio ambiente. Aprende Git, contribuye código, documenta proyectos y colabora con desarrolladores globales.",
    description_en: "Contribute to open source projects that help the environment. Learn Git, contribute code, document projects and collaborate with global developers.",
    description_de: "Trage zu Open-Source-Projekten bei, die der Umwelt helfen. Lerne Git, trage Code bei, dokumentiere Projekte und arbeite mit Entwicklern weltweit zusammen.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    website: "https://www.opensourcegreen.org",
    date: "2025-12-18",
    time: "13:00",
    duration: 4,
    location: "Coding Space, Madrid",
    location_en: "Coding Space, Madrid",
    location_de: "Programmierraum, Madrid",
    organizer: "Open Source Green",
    organizer_en: "Open Source Green",
    organizer_de: "Open Source Grün",
    category: "technology",
    maxVolunteers: 50,
    currentVolunteers: 35,
    requirements: ["Laptop", "Cuenta en GitHub", "Conocimientos básicos de Git"],
    requirements_en: ["Laptop", "GitHub account", "Basic Git knowledge"],
    requirements_de: ["Laptop", "GitHub-Konto", "Grundkenntnisse in Git"],
    benefits: ["Contribuciones verificables", "Networking", "Certificado"],
    benefits_en: ["Verifiable contributions", "Networking", "Certificate"],
    benefits_de: ["Überprüfbare Beiträge", "Netzwerken", "Zertifikat"],
    contact: "opensource@green.org"
  },
  "e1b": {
    id: "e1b",
    title: "Taller de Reciclaje Creativo y Arte Sostenible",
    title_en: "Creative Recycling and Sustainable Art Workshop",
    title_de: "Workshop für kreatives Recycling und nachhaltige Kunst",
    description: "Aprende a crear objetos útiles y artísticos a partir de materiales reciclados en este taller práctico de 2 horas en el Centro de Arte Verde de Madrid. Descubrirás cómo transformar residuos comunes en obras de arte funcionales y decorativas, reduciendo tu huella de residuos mientras desarrollas tu creatividad. Aprenderás técnicas de reciclaje creativo: transformación de botellas de plástico en macetas y decoraciones, creación de joyería con materiales reciclados, construcción de muebles con pallets, y arte con papel y cartón reciclado. Realizaremos proyectos prácticos donde crearás al menos 2 objetos que te llevarás a casa: uno funcional y uno artístico. También exploraremos cómo el arte reciclado puede ser una fuente de ingresos, cómo organizar talleres en tu comunidad, y cómo inspirar a otros a reducir residuos. El taller incluye una sesión sobre identificación de materiales reciclables, técnicas de limpieza y preparación, y acabados profesionales. Esta es una oportunidad perfecta para desarrollar habilidades creativas mientras contribuyes a la economía circular y aprendes a ver los residuos como recursos valiosos.",
    description_en: "Learn to create useful and artistic objects from recycled materials in this 2-hour hands-on workshop at Madrid's Green Art Center. You'll discover how to transform common waste into functional and decorative works of art, reducing your waste footprint while developing your creativity. You'll learn creative recycling techniques: transforming plastic bottles into planters and decorations, creating jewelry with recycled materials, building furniture with pallets, and art with recycled paper and cardboard. We'll carry out practical projects where you'll create at least 2 objects to take home: one functional and one artistic. We'll also explore how recycled art can be a source of income, how to organize workshops in your community, and how to inspire others to reduce waste. The workshop includes a session on identifying recyclable materials, cleaning and preparation techniques, and professional finishes. This is a perfect opportunity to develop creative skills while contributing to the circular economy and learning to see waste as valuable resources.",
    description_de: "Lernen Sie, nützliche und künstlerische Objekte aus recycelten Materialien in diesem 2-stündigen praktischen Workshop im Grünen Kunstzentrum von Madrid zu erstellen. Sie werden entdecken, wie Sie gewöhnlichen Abfall in funktionale und dekorative Kunstwerke verwandeln können, während Sie Ihre Kreativität entwickeln und Ihren Abfallfußabdruck reduzieren. Sie lernen kreative Recycling-Techniken: Umwandlung von Plastikflaschen in Pflanzgefäße und Dekorationen, Herstellung von Schmuck mit recycelten Materialien, Bau von Möbeln mit Paletten und Kunst mit recyceltem Papier und Pappe. Wir führen praktische Projekte durch, bei denen Sie mindestens 2 Objekte erstellen, die Sie mit nach Hause nehmen: eines funktional und eines künstlerisch. Wir werden auch erkunden, wie recycelte Kunst eine Einkommensquelle sein kann, wie man Workshops in Ihrer Gemeinschaft organisiert und wie man andere inspiriert, Abfälle zu reduzieren. Der Workshop umfasst eine Sitzung zur Identifizierung recycelbarer Materialien, Reinigungs- und Vorbereitungstechniken und professionelle Oberflächen. Dies ist eine perfekte Gelegenheit, kreative Fähigkeiten zu entwickeln, während Sie zur Kreislaufwirtschaft beitragen und lernen, Abfall als wertvolle Ressource zu sehen.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.sustainableart.org",
    date: "2025-01-03",
    time: "15:00",
    duration: 2,
    location: "Centro de Arte Verde, Madrid",
    location_en: "Green Art Center, Madrid",
    location_de: "Grünes Kunstzentrum, Madrid",
    organizer: "Sustainable Art",
    organizer_en: "Sustainable Art",
    organizer_de: "Nachhaltige Kunst",
    category: "education",
    maxVolunteers: 25,
    currentVolunteers: 18,
    requirements: ["Materiales reciclados de casa (botellas, cartón, papel, etc.)", "Herramientas básicas (proporcionamos si no tienes)", "Ropa cómoda que puedas ensuciar", "Delantal o ropa de trabajo (opcional)", "Creatividad y ganas de crear", "Opcional: trae materiales específicos que quieras transformar"],
    requirements_en: ["Recycled materials from home (bottles, cardboard, paper, etc.)", "Basic tools (we provide if you don't have)", "Comfortable clothes you can get dirty", "Apron or work clothes (optional)", "Creativity and desire to create", "Optional: bring specific materials you want to transform"],
    requirements_de: ["Recycelte Materialien von zu Hause (Flaschen, Pappe, Papier usw.)", "Grundwerkzeuge (wir stellen zur Verfügung, wenn Sie keine haben)", "Bequeme Kleidung, die schmutzig werden kann", "Schürze oder Arbeitskleidung (optional)", "Kreativität und Lust zu schaffen", "Optional: bringen Sie spezifische Materialien mit, die Sie transformieren möchten"],
    benefits: ["Objetos creados por ti para llevar a casa", "Manual completo de técnicas de reciclaje creativo", "Certificado de participación", "Guía de materiales reciclables y sus usos", "Acceso a comunidad online de artistas recicladores", "Descuentos en materiales y herramientas", "Oportunidades de exponer tus creaciones"],
    benefits_en: ["Objects you created to take home", "Complete manual on creative recycling techniques", "Participation certificate", "Guide to recyclable materials and their uses", "Access to online community of recycling artists", "Discounts on materials and tools", "Opportunities to exhibit your creations"],
    benefits_de: ["Von Ihnen erstellte Objekte zum Mitnehmen", "Vollständiges Handbuch über kreative Recycling-Techniken", "Teilnahmezertifikat", "Leitfaden zu recycelbaren Materialien und ihren Verwendungen", "Zugang zur Online-Gemeinschaft von Recycling-Künstlern", "Rabatte auf Materialien und Werkzeuge", "Möglichkeiten, Ihre Kreationen auszustellen"],
    contact: "arte@sustainable.es"
  },
  "e1c": {
    id: "e1c",
    title: "Caminata Ecológica Matutina y Conexión con la Naturaleza",
    title_en: "Morning Eco-Walk and Connection with Nature",
    title_de: "Morgendlicher Öko-Spaziergang und Verbindung mit der Natur",
    description: "Únete a nuestra caminata matutina por los espacios verdes del Parque Central de Barcelona para promover el ejercicio y la conexión con la naturaleza. Durante esta caminata de 2 horas al amanecer, exploraremos los diferentes ecosistemas del parque, aprenderás sobre la flora y fauna urbana, y disfrutarás de los beneficios del ejercicio al aire libre en un entorno natural. La caminata incluye paradas educativas donde aprenderás sobre las especies de árboles y plantas del parque, identificación de aves urbanas, y la importancia de los espacios verdes para la salud mental y física. También realizaremos ejercicios de mindfulness en la naturaleza, técnicas de respiración consciente, y actividades de observación de la naturaleza. Al finalizar, compartiremos un desayuno saludable con productos locales mientras conversamos sobre cómo incorporar más naturaleza en nuestra vida diaria. Esta es una oportunidad perfecta para comenzar el día de manera saludable, conectarte con la naturaleza urbana, y conocer a otras personas que comparten tu interés por el bienestar y la sostenibilidad.",
    description_en: "Join our morning walk through Barcelona's Central Park green spaces to promote exercise and connection with nature. During this 2-hour sunrise walk, we'll explore the park's different ecosystems, you'll learn about urban flora and fauna, and enjoy the benefits of outdoor exercise in a natural setting. The walk includes educational stops where you'll learn about the park's tree and plant species, urban bird identification, and the importance of green spaces for mental and physical health. We'll also carry out mindfulness exercises in nature, conscious breathing techniques, and nature observation activities. At the end, we'll share a healthy breakfast with local products while discussing how to incorporate more nature into our daily lives. This is a perfect opportunity to start the day healthily, connect with urban nature, and meet other people who share your interest in well-being and sustainability.",
    description_de: "Schließen Sie sich unserem morgendlichen Spaziergang durch die Grünflächen des Zentralparks von Barcelona an, um Bewegung und Verbindung mit der Natur zu fördern. Während dieses 2-stündigen Sonnenaufgangsspaziergangs erkunden wir die verschiedenen Ökosysteme des Parks, Sie lernen etwas über städtische Flora und Fauna und genießen die Vorteile von Bewegung im Freien in einer natürlichen Umgebung. Der Spaziergang umfasst Bildungsstopps, bei denen Sie etwas über die Baum- und Pflanzenarten des Parks, die Identifizierung städtischer Vögel und die Bedeutung von Grünflächen für die geistige und körperliche Gesundheit lernen. Wir führen auch Achtsamkeitsübungen in der Natur, bewusste Atemtechniken und Naturbeobachtungsaktivitäten durch. Am Ende teilen wir ein gesundes Frühstück mit lokalen Produkten, während wir darüber diskutieren, wie wir mehr Natur in unser tägliches Leben integrieren können. Dies ist eine perfekte Gelegenheit, den Tag gesund zu beginnen, sich mit der städtischen Natur zu verbinden und andere Menschen zu treffen, die Ihr Interesse an Wohlbefinden und Nachhaltigkeit teilen.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.greenwalkers.org",
    date: "2025-01-07",
    time: "08:00",
    duration: 2,
    location: "Parque Central, Barcelona",
    location_en: "Central Park, Barcelona",
    location_de: "Zentralpark, Barcelona",
    organizer: "Green Walkers",
    organizer_en: "Green Walkers",
    organizer_de: "Grüne Wanderer",
    category: "community",
    maxVolunteers: 20,
    currentVolunteers: 14,
    requirements: ["Ropa cómoda y abrigada (actividad temprana)", "Calzado deportivo adecuado para caminar", "Agua para hidratación", "Protector solar", "Opcional: binoculares para observar aves", "Espíritu de conexión con la naturaleza"],
    requirements_en: ["Comfortable and warm clothes (early activity)", "Appropriate sports shoes for walking", "Water for hydration", "Sunscreen", "Optional: binoculars for bird watching", "Spirit of connection with nature"],
    requirements_de: ["Bequeme und warme Kleidung (frühe Aktivität)", "Geeignete Sportschuhe zum Gehen", "Wasser zur Hydratation", "Sonnencreme", "Optional: Fernglas zur Vogelbeobachtung", "Geist der Verbindung mit der Natur"],
    benefits: ["Guía completa de naturaleza urbana", "Desayuno saludable con productos locales incluido", "Red de contactos con otros caminantes ecológicos", "Técnicas de mindfulness en la naturaleza", "Guía de identificación de aves urbanas", "Acceso a futuras caminatas ecológicas", "Certificado de participación"],
    benefits_en: ["Complete urban nature guide", "Healthy breakfast with local products included", "Network of contacts with other eco-walkers", "Mindfulness techniques in nature", "Urban bird identification guide", "Access to future eco-walks", "Participation certificate"],
    benefits_de: ["Vollständiger Leitfaden für städtische Natur", "Gesundes Frühstück mit lokalen Produkten inbegriffen", "Netzwerk von Kontakten mit anderen Öko-Wanderern", "Achtsamkeitstechniken in der Natur", "Leitfaden zur Identifizierung städtischer Vögel", "Zugang zu zukünftigen Öko-Spaziergängen", "Teilnahmezertifikat"],
    contact: "caminata@green.es"
  },
  "e1d": {
    id: "e1d",
    title: "Instalación de Paneles Solares en Escuela y Educación en Energía Renovable",
    title_en: "Solar Panel Installation at School and Renewable Energy Education",
    title_de: "Solarpanel-Installation an Schule und Bildung für erneuerbare Energien",
    description: "Participa en la instalación de paneles solares en la Escuela Verde de Milán para promover las energías renovables y educar a la próxima generación sobre energía limpia. Durante esta actividad de 4 horas, instalaremos un sistema fotovoltaico completo que proporcionará energía limpia a la escuela y servirá como herramienta educativa para los estudiantes. Aprenderás sobre el diseño de sistemas solares, la instalación de paneles en techos, el cableado eléctrico seguro, la conexión a la red eléctrica, y el mantenimiento de sistemas fotovoltaicos. Trabajaremos bajo la supervisión de técnicos certificados y seguiremos todos los protocolos de seguridad. Los estudiantes de la escuela participarán en actividades educativas paralelas sobre energía solar, y el sistema será monitoreado para mostrar su producción de energía en tiempo real. Esta instalación reducirá significativamente la huella de carbono de la escuela y servirá como ejemplo para otras instituciones educativas. Esta es una oportunidad única para adquirir experiencia práctica en instalación solar mientras contribuyes a la transición energética y la educación ambiental.",
    description_en: "Participate in the installation of solar panels at Milan's Green School to promote renewable energy and educate the next generation about clean energy. During this 4-hour activity, we'll install a complete photovoltaic system that will provide clean energy to the school and serve as an educational tool for students. You'll learn about solar system design, roof panel installation, safe electrical wiring, grid connection, and photovoltaic system maintenance. We'll work under the supervision of certified technicians and follow all safety protocols. School students will participate in parallel educational activities about solar energy, and the system will be monitored to show its real-time energy production. This installation will significantly reduce the school's carbon footprint and serve as an example for other educational institutions. This is a unique opportunity to gain hands-on experience in solar installation while contributing to the energy transition and environmental education.",
    description_de: "Nehmen Sie an der Installation von Solarpanelen an der Grünen Schule in Mailand teil, um erneuerbare Energien zu fördern und die nächste Generation über saubere Energie zu bilden. Während dieser 4-stündigen Aktivität installieren wir ein vollständiges Photovoltaiksystem, das der Schule saubere Energie liefert und als Bildungsinstrument für Schüler dient. Sie lernen Solarsystemdesign, Dachpanelinstallation, sichere elektrische Verkabelung, Netzanschluss und Wartung von Photovoltaiksystemen kennen. Wir arbeiten unter Aufsicht zertifizierter Techniker und befolgen alle Sicherheitsprotokolle. Die Schüler der Schule werden an parallelen Bildungsaktivitäten über Solarenergie teilnehmen, und das System wird überwacht, um seine Energieerzeugung in Echtzeit zu zeigen. Diese Installation wird den CO2-Fußabdruck der Schule erheblich reduzieren und als Beispiel für andere Bildungseinrichtungen dienen. Dies ist eine einzigartige Gelegenheit, praktische Erfahrungen in der Solarinstallation zu sammeln und gleichzeitig zur Energiewende und Umweltbildung beizutragen.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    website: "https://www.solarcommunity.org",
    date: "2025-01-12",
    time: "10:00",
    duration: 4,
    location: "Escuela Verde, Milán",
    location_en: "Green School, Milan",
    location_de: "Grüne Schule, Mailand",
    organizer: "Solar Community",
    organizer_en: "Solar Community",
    organizer_de: "Solar-Gemeinschaft",
    category: "environment",
    maxVolunteers: 15,
    currentVolunteers: 11,
    requirements: ["Experiencia básica en electricidad o construcción (recomendado)", "Herramientas de seguridad (proporcionamos)", "Ropa de trabajo resistente", "Calzado de seguridad con puntera de acero", "Casco de seguridad (proporcionamos)", "Gafas de protección (proporcionamos)", "Condición física adecuada para trabajo en altura"],
    requirements_en: ["Basic experience in electricity or construction (recommended)", "Safety tools (we provide)", "Resistant work clothes", "Safety shoes with steel toe", "Safety helmet (we provide)", "Protection glasses (we provide)", "Adequate physical condition for work at height"],
    requirements_de: ["Grundkenntnisse in Elektrizität oder Bauwesen (empfohlen)", "Sicherheitswerkzeuge (wir stellen zur Verfügung)", "Widerstandsfähige Arbeitskleidung", "Sicherheitsschuhe mit Stahlkappe", "Sicherheitshelm (wir stellen zur Verfügung)", "Schutzbrille (wir stellen zur Verfügung)", "Angemessene körperliche Verfassung für Arbeiten in der Höhe"],
    benefits: ["Certificación técnica en instalación solar", "Material educativo completo sobre energía solar", "Visita técnica guiada del sistema instalado", "Acceso a recursos online sobre mantenimiento", "Experiencia práctica certificada", "Oportunidades de networking con profesionales del sector", "Participación en proyecto educativo de impacto real"],
    benefits_en: ["Technical certification in solar installation", "Complete educational material on solar energy", "Guided technical visit of installed system", "Access to online maintenance resources", "Certified hands-on experience", "Networking opportunities with sector professionals", "Participation in real-impact educational project"],
    benefits_de: ["Technische Zertifizierung in Solarinstallation", "Vollständiges Bildungsmaterial über Solarenergie", "Geführter technischer Besuch des installierten Systems", "Zugang zu Online-Wartungsressourcen", "Zertifizierte praktische Erfahrung", "Netzwerkmöglichkeiten mit Fachleuten des Sektors", "Teilnahme an einem Bildungsprojekt mit realer Wirkung"],
    contact: "solar@community.es"
  },
  "e1e": {
    id: "e1e",
    title: "Conferencia sobre Cambio Climático y Acción Colectiva",
    title_en: "Climate Change and Collective Action Conference",
    title_de: "Konferenz über Klimawandel und kollektives Handeln",
    description: "Asiste a esta conferencia informativa y motivadora sobre los efectos del cambio climático y las acciones concretas que podemos tomar individual y colectivamente para mitigarlo en el Auditorio Municipal de París. Durante esta sesión de 2 horas, expertos en climatología, activistas ambientales y líderes comunitarios compartirán los últimos datos científicos sobre el cambio climático, sus impactos actuales y futuros, y las soluciones prácticas que están funcionando en diferentes partes del mundo. Exploraremos temas como la transición energética, la movilidad sostenible, la agricultura regenerativa, y la economía circular. La conferencia incluirá presentaciones interactivas, sesiones de preguntas y respuestas, y espacios de networking para conectar con otras personas comprometidas con la acción climática. También presentaremos casos de éxito de comunidades que han logrado reducir significativamente sus emisiones y adaptarse al cambio climático. Esta es una oportunidad única para informarte, inspirarte y encontrar formas concretas de contribuir a la solución del mayor desafío de nuestro tiempo.",
    description_en: "Attend this informative and motivating conference on the effects of climate change and the concrete actions we can take individually and collectively to mitigate it at Paris's City Auditorium. During this 2-hour session, experts in climatology, environmental activists, and community leaders will share the latest scientific data on climate change, its current and future impacts, and practical solutions that are working in different parts of the world. We'll explore topics such as energy transition, sustainable mobility, regenerative agriculture, and the circular economy. The conference will include interactive presentations, Q&A sessions, and networking spaces to connect with other people committed to climate action. We'll also present success stories from communities that have significantly reduced their emissions and adapted to climate change. This is a unique opportunity to inform yourself, get inspired, and find concrete ways to contribute to solving the greatest challenge of our time.",
    description_de: "Nehmen Sie an dieser informativen und motivierenden Konferenz über die Auswirkungen des Klimawandels und die konkreten Maßnahmen teil, die wir individuell und kollektiv ergreifen können, um ihn zu mildern, im Stadtauditorium von Paris. Während dieser 2-stündigen Sitzung werden Experten für Klimatologie, Umweltaktivisten und Gemeindeführer die neuesten wissenschaftlichen Daten über den Klimawandel, seine aktuellen und zukünftigen Auswirkungen und praktische Lösungen teilen, die in verschiedenen Teilen der Welt funktionieren. Wir werden Themen wie Energiewende, nachhaltige Mobilität, regenerative Landwirtschaft und Kreislaufwirtschaft erkunden. Die Konferenz umfasst interaktive Präsentationen, Frage-und-Antwort-Sitzungen und Networking-Räume, um sich mit anderen Menschen zu verbinden, die sich für Klimaschutzmaßnahmen einsetzen. Wir werden auch Erfolgsgeschichten von Gemeinschaften präsentieren, die ihre Emissionen erheblich reduziert und sich an den Klimawandel angepasst haben. Dies ist eine einzigartige Gelegenheit, sich zu informieren, sich inspirieren zu lassen und konkrete Wege zu finden, um zur Lösung der größten Herausforderung unserer Zeit beizutragen.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.climateinstitute.org",
    date: "2025-01-18",
    time: "18:00",
    duration: 2,
    location: "Auditorio Municipal, París",
    location_en: "City Auditorium, Paris",
    location_de: "Stadtauditorium, Paris",
    organizer: "Climate Institute",
    organizer_en: "Climate Institute",
    organizer_de: "Klimainstitut",
    category: "education",
    maxVolunteers: 100,
    currentVolunteers: 75,
    requirements: ["Registro previo obligatorio (plazas limitadas)", "Documento de identidad para verificación", "Cuaderno para tomar notas (opcional)", "Preguntas preparadas para la sesión de Q&A (opcional)", "Dispositivo móvil para networking (opcional)"],
    requirements_en: ["Mandatory prior registration (limited places)", "Identity document for verification", "Notebook for taking notes (optional)", "Prepared questions for Q&A session (optional)", "Mobile device for networking (optional)"],
    requirements_de: ["Verbindliche vorherige Anmeldung (begrenzte Plätze)", "Ausweisdokument zur Überprüfung", "Notizbuch zum Mitschreiben (optional)", "Vorbereitete Fragen für die Q&A-Sitzung (optional)", "Mobilgerät für Networking (optional)"],
    benefits: ["Certificado de asistencia acreditado", "Material informativo completo sobre cambio climático", "Acceso a recursos online exclusivos", "Oportunidades de networking con expertos y activistas", "Guía práctica de acciones climáticas", "Descuentos en futuros eventos del instituto", "Participación en grupos de acción climática local"],
    benefits_en: ["Accredited attendance certificate", "Complete informative material on climate change", "Access to exclusive online resources", "Networking opportunities with experts and activists", "Practical guide to climate actions", "Discounts on future institute events", "Participation in local climate action groups"],
    benefits_de: ["Akkreditiertes Teilnahmezertifikat", "Vollständiges Informationsmaterial über Klimawandel", "Zugang zu exklusiven Online-Ressourcen", "Netzwerkmöglichkeiten mit Experten und Aktivisten", "Praktischer Leitfaden für Klimaschutzmaßnahmen", "Rabatte auf zukünftige Veranstaltungen des Instituts", "Teilnahme an lokalen Klimaschutzgruppen"],
    contact: "clima@instituto.es"
  },
  "e1f": {
    id: "e1f",
    title: "Mercado de Productos Orgánicos Locales y Certificados",
    title_en: "Local and Certified Organic Products Market",
    title_de: "Markt für lokale und zertifizierte Bio-Produkte",
    description: "Descubre productos orgánicos locales en nuestro mercado especializado con productores certificados en la Plaza Orgánica de Londres. Durante todo el día, más de 30 productores orgánicos certificados presentarán sus productos frescos, cultivados siguiendo estrictos estándares orgánicos y prácticas sostenibles. Podrás encontrar frutas y verduras orgánicas de temporada, productos lácteos orgánicos artesanales, panadería orgánica tradicional, miel orgánica local, productos de cuidado personal orgánicos, y mucho más. Cada producto viene con certificación orgánica verificada, información sobre el productor y sus prácticas agrícolas, y consejos sobre cómo prepararlo y conservarlo. El mercado incluye talleres sobre agricultura orgánica, charlas sobre los beneficios de los productos orgánicos para la salud y el medio ambiente, degustaciones guiadas, y actividades para niños sobre alimentación saludable. También habrá música en vivo, food trucks con opciones orgánicas, y espacios para compartir recetas. Aprenderás sobre la importancia de consumir productos orgánicos, cómo identificar productos realmente orgánicos, y cómo apoyar la agricultura sostenible. Esta es una oportunidad perfecta para descubrir productos de alta calidad, conocer a los productores de tu región, y adoptar hábitos alimentarios más saludables y sostenibles.",
    description_en: "Discover local organic products at our specialized market with certified producers at London's Organic Square. Throughout the day, more than 30 certified organic producers will showcase their fresh products, grown following strict organic standards and sustainable practices. You'll find seasonal organic fruits and vegetables, artisanal organic dairy products, traditional organic bakery, local organic honey, organic personal care products, and much more. Each product comes with verified organic certification, information about the producer and their farming practices, and tips on how to prepare and preserve it. The market includes workshops on organic farming, talks on the benefits of organic products for health and the environment, guided tastings, and activities for children about healthy eating. There will also be live music, food trucks with organic options, and spaces to share recipes. You'll learn about the importance of consuming organic products, how to identify truly organic products, and how to support sustainable agriculture. This is a perfect opportunity to discover high-quality products, meet producers from your region, and adopt healthier and more sustainable eating habits.",
    description_de: "Entdecken Sie lokale Bio-Produkte auf unserem spezialisierten Markt mit zertifizierten Produzenten auf dem Bio-Platz von London. Den ganzen Tag über präsentieren mehr als 30 zertifizierte Bio-Produzenten ihre frischen Produkte, die nach strengen Bio-Standards und nachhaltigen Praktiken angebaut werden. Sie finden saisonale Bio-Früchte und -Gemüse, handwerkliche Bio-Milchprodukte, traditionelle Bio-Bäckerei, lokalen Bio-Honig, Bio-Pflegeprodukte und vieles mehr. Jedes Produkt kommt mit verifizierter Bio-Zertifizierung, Informationen über den Produzenten und seine Anbaupraktiken sowie Tipps zur Zubereitung und Konservierung. Der Markt umfasst Workshops über ökologischen Landbau, Vorträge über die Vorteile von Bio-Produkten für Gesundheit und Umwelt, geführte Verkostungen und Aktivitäten für Kinder über gesunde Ernährung. Es wird auch Live-Musik, Food-Trucks mit Bio-Optionen und Räume zum Teilen von Rezepten geben. Sie lernen die Bedeutung des Konsums von Bio-Produkten, wie man wirklich biologische Produkte identifiziert und wie man nachhaltige Landwirtschaft unterstützt. Dies ist eine perfekte Gelegenheit, hochwertige Produkte zu entdecken, Produzenten aus Ihrer Region zu treffen und gesündere und nachhaltigere Essgewohnheiten anzunehmen.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.organicproducts.org",
    date: "2025-01-25",
    time: "11:00",
    duration: 5,
    location: "Plaza Orgánica, Londres",
    location_en: "Organic Square, London",
    location_de: "Bio-Platz, London",
    organizer: "Organic Products",
    organizer_en: "Organic Products",
    organizer_de: "Bio-Produkte",
    category: "community",
    maxVolunteers: 50,
    currentVolunteers: 35,
    requirements: ["Bolsa reutilizable o carrito de compras", "Dinero en efectivo (algunos puestos no aceptan tarjeta)", "Ropa cómoda para caminar", "Agua para hidratación", "Opcional: recipientes para llevar productos frescos", "Interés en productos orgánicos y saludables"],
    requirements_en: ["Reusable bag or shopping cart", "Cash (some stalls don't accept cards)", "Comfortable walking clothes", "Water for hydration", "Optional: containers to carry fresh products", "Interest in organic and healthy products"],
    requirements_de: ["Wiederverwendbare Tasche oder Einkaufswagen", "Bargeld (einige Stände akzeptieren keine Karten)", "Bequeme Gehkleidung", "Wasser zur Hydratation", "Optional: Behälter zum Transportieren frischer Produkte", "Interesse an Bio- und gesunden Produkten"],
    benefits: ["Descuentos especiales del 10-15% en todos los productos", "Degustaciones gratuitas de productos premium", "Red de contactos con productores orgánicos certificados", "Guía completa de productos orgánicos y sus beneficios", "Talleres gratuitos sobre agricultura orgánica", "Recetario digital con más de 40 recetas orgánicas", "Certificado de participación en consumo orgánico"],
    benefits_en: ["Special 10-15% discounts on all products", "Free tastings of premium products", "Network of contacts with certified organic producers", "Complete guide to organic products and their benefits", "Free workshops on organic farming", "Digital cookbook with more than 40 organic recipes", "Organic consumption participation certificate"],
    benefits_de: ["Spezielle Rabatte von 10-15% auf alle Produkte", "Kostenlose Verkostungen von Premium-Produkten", "Netzwerk von Kontakten mit zertifizierten Bio-Produzenten", "Vollständiger Leitfaden zu Bio-Produkten und ihren Vorteilen", "Kostenlose Workshops über ökologischen Landbau", "Digitales Kochbuch mit mehr als 40 Bio-Rezepten", "Teilnahmezertifikat für Bio-Konsum"],
    contact: "organico@products.es"
  },
  "e1g": {
    id: "e1g",
    title: "Limpieza de Playa y Protección del Ecosistema Marino",
    title_en: "Beach Cleanup and Marine Ecosystem Protection",
    title_de: "Strandreinigung und Schutz des Meeresökosystems",
    description: "Participa en la limpieza de la Playa Verde de Berlín para proteger el ecosistema marino y mantener nuestras costas limpias. Durante esta actividad de 3 horas, trabajaremos en la recolección y clasificación de residuos a lo largo de la playa, identificando los tipos de contaminantes más comunes y su impacto en el ecosistema marino. Aprenderás sobre la importancia de las playas limpias para la vida marina, cómo los residuos afectan a las especies costeras, y las mejores prácticas para la conservación costera. Realizaremos actividades de clasificación de residuos para su reciclaje adecuado, identificación de microplásticos, y educación ambiental sobre la prevención de la contaminación marina. También aprenderás sobre las especies que habitan en las costas, cómo se ven afectadas por la contaminación, y cómo podemos ayudarlas. Los datos recopilados sobre tipos de residuos serán utilizados para crear campañas de concienciación y proponer medidas de protección. Esta es una oportunidad perfecta para contribuir directamente a la protección de nuestros océanos y aprender sobre la importancia de mantener nuestras costas limpias y saludables.",
    description_en: "Participate in the cleanup of Berlin's Green Beach to protect the marine ecosystem and keep our coasts clean. During this 3-hour activity, we'll work on collecting and sorting waste along the beach, identifying the most common types of pollutants and their impact on the marine ecosystem. You'll learn about the importance of clean beaches for marine life, how waste affects coastal species, and best practices for coastal conservation. We'll carry out waste sorting activities for proper recycling, microplastic identification, and environmental education on preventing marine pollution. You'll also learn about the species that inhabit the coasts, how they are affected by pollution, and how we can help them. Data collected on types of waste will be used to create awareness campaigns and propose protection measures. This is a perfect opportunity to directly contribute to protecting our oceans and learn about the importance of keeping our coasts clean and healthy.",
    description_de: "Nehmen Sie an der Reinigung des Grünen Strandes von Berlin teil, um das Meeresökosystem zu schützen und unsere Küsten sauber zu halten. Während dieser 3-stündigen Aktivität arbeiten wir an der Sammlung und Sortierung von Abfällen entlang des Strandes, identifizieren die häufigsten Arten von Schadstoffen und ihre Auswirkungen auf das Meeresökosystem. Sie lernen die Bedeutung sauberer Strände für das Meeresleben, wie Abfälle Küstenarten beeinflussen, und bewährte Praktiken für den Küstenschutz kennen. Wir führen Abfallsortierungsaktivitäten für ordnungsgemäßes Recycling, Mikroplastikidentifizierung und Umweltbildung zur Verhinderung von Meeresverschmutzung durch. Sie lernen auch die Arten kennen, die die Küsten bewohnen, wie sie von Verschmutzung betroffen sind, und wie wir ihnen helfen können. Die gesammelten Daten über Abfallarten werden verwendet, um Sensibilisierungskampagnen zu erstellen und Schutzmaßnahmen vorzuschlagen. Dies ist eine perfekte Gelegenheit, direkt zum Schutz unserer Ozeane beizutragen und mehr über die Bedeutung der Sauberhaltung unserer Küsten zu erfahren.",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    website: "https://www.oceanguardians.org",
    date: "2025-01-28",
    time: "09:30",
    duration: 3,
    location: "Playa Verde, Berlín",
    location_en: "Green Beach, Berlin",
    location_de: "Grüner Strand, Berlin",
    organizer: "Ocean Guardians",
    organizer_en: "Ocean Guardians",
    organizer_de: "Meeresschützer",
    category: "environment",
    maxVolunteers: 40,
    currentVolunteers: 28,
    requirements: ["Guantes de trabajo resistentes", "Ropa cómoda y que puedas ensuciar", "Protector solar", "Sombrero o gorra", "Agua para hidratación", "Botas o zapatos cerrados", "Ropa de repuesto (por si te mojas)"],
    requirements_en: ["Resistant work gloves", "Comfortable clothes you can get dirty", "Sunscreen", "Hat or cap", "Water for hydration", "Boots or closed shoes", "Spare clothes (in case you get wet)"],
    requirements_de: ["Widerstandsfähige Arbeitshandschuhe", "Bequeme Kleidung, die schmutzig werden kann", "Sonnencreme", "Hut oder Mütze", "Wasser zur Hydratation", "Stiefel oder geschlossene Schuhe", "Wechselkleidung (falls Sie nass werden)"],
    benefits: ["Certificado de participación en conservación costera", "Refrigerio y bebidas incluidas", "Material educativo sobre ecosistemas marinos", "Guía de identificación de especies costeras", "Acceso a datos del estudio de residuos marinos", "Experiencia práctica en conservación marina", "Oportunidades de participar en futuras actividades de monitoreo"],
    benefits_en: ["Coastal conservation participation certificate", "Snack and drinks included", "Educational material on marine ecosystems", "Coastal species identification guide", "Access to marine waste study data", "Hands-on marine conservation experience", "Opportunities to participate in future monitoring activities"],
    benefits_de: ["Teilnahmezertifikat für Küstenschutz", "Snack und Getränke inbegriffen", "Bildungsmaterial über Meeresökosysteme", "Leitfaden zur Identifizierung von Küstenarten", "Zugang zu Meeresabfallstudien-Daten", "Praktische Erfahrung im Meeresschutz", "Möglichkeiten zur Teilnahme an zukünftigen Überwachungsaktivitäten"],
    contact: "playa@guardians.es"
  },
  "e3b": {
    id: "e3b",
    title: "Taller de jardinería urbana",
    title_en: "Urban Gardening Workshop",
    title_de: "Städtischer Gartenbau-Workshop",
    description: "Descubre cómo cultivar tus propios alimentos frescos y saludables incluso en espacios urbanos reducidos con este taller práctico de 3 horas sobre jardinería urbana. Aprenderás técnicas específicas para maximizar el espacio disponible, incluyendo jardinería vertical, cultivo en contenedores, y sistemas de riego eficientes. Exploraremos qué vegetales y hierbas crecen mejor en espacios pequeños, cómo preparar el suelo adecuadamente, y métodos orgánicos para prevenir plagas y enfermedades. También cubriremos temas de compostaje urbano, rotación de cultivos, y cómo aprovechar la luz natural en interiores y balcones. Al finalizar, tendrás los conocimientos prácticos para comenzar tu propio huerto urbano y recibirás un kit de inicio con semillas seleccionadas para tu región.",
    description_en: "Discover how to grow your own fresh and healthy food even in small urban spaces with this 3-hour practical workshop on urban gardening. You'll learn specific techniques to maximize available space, including vertical gardening, container growing, and efficient irrigation systems. We'll explore which vegetables and herbs grow best in small spaces, how to properly prepare soil, and organic methods to prevent pests and diseases. We'll also cover urban composting, crop rotation, and how to take advantage of natural light indoors and on balconies. At the end, you'll have the practical knowledge to start your own urban garden and receive a starter kit with selected seeds for your region.",
    description_de: "Entdecken Sie, wie Sie Ihr eigenes frisches und gesundes Essen auch in kleinen städtischen Räumen anbauen können, mit diesem 3-stündigen praktischen Workshop über städtischen Gartenbau. Sie lernen spezifische Techniken, um den verfügbaren Raum zu maximieren, einschließlich vertikaler Gartenarbeit, Containeranbau und effizienter Bewässerungssysteme. Wir werden erkunden, welche Gemüse und Kräuter am besten in kleinen Räumen wachsen, wie man den Boden richtig vorbereitet und organische Methoden zur Vorbeugung von Schädlingen und Krankheiten. Wir werden auch städtisches Kompostieren, Fruchtfolge und die Nutzung von natürlichem Licht in Innenräumen und auf Balkonen behandeln. Am Ende haben Sie das praktische Wissen, um Ihren eigenen städtischen Garten zu beginnen und erhalten ein Starter-Kit mit ausgewählten Samen für Ihre Region.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.urbangardeners.org",
    date: "2025-02-02",
    time: "14:00",
    duration: 3,
    location: "Jardín Comunitario, Berlín",
    location_en: "Community Garden, Berlin",
    location_de: "Gemeinschaftsgarten, Berlin",
    organizer: "Urban Gardeners",
    organizer_en: "Urban Gardeners",
    organizer_de: "Städtische Gärtner",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 16,
    requirements: ["Ropa cómoda que pueda ensuciarse", "Cuaderno para tomar notas", "Guantes de jardinería (opcional, proporcionamos algunos)", "Botella de agua", "Interés en agricultura urbana", "Disponibilidad para trabajar al aire libre"],
    requirements_en: ["Comfortable clothes that can get dirty", "Notebook for taking notes", "Gardening gloves (optional, we provide some)", "Water bottle", "Interest in urban agriculture", "Availability to work outdoors"],
    requirements_de: ["Bequeme Kleidung, die schmutzig werden kann", "Notizbuch zum Mitschreiben", "Gartenhandschuhe (optional, wir stellen einige zur Verfügung)", "Wasserflasche", "Interesse an städtischer Landwirtschaft", "Verfügbarkeit für Arbeiten im Freien"],
    benefits: ["Kit completo de semillas para huerto urbano", "Manual ilustrado de jardinería urbana", "Seguimiento personalizado durante 3 meses", "Acceso a comunidad online de jardineros urbanos", "Descuento en materiales de jardinería", "Certificado de participación"],
    benefits_en: ["Complete seed kit for urban garden", "Illustrated urban gardening manual", "Personalized follow-up for 3 months", "Access to online community of urban gardeners", "Discount on gardening materials", "Participation certificate"],
    benefits_de: ["Vollständiges Samen-Kit für städtischen Garten", "Illustriertes Handbuch für städtischen Gartenbau", "Personalisierte Nachbetreuung für 3 Monate", "Zugang zur Online-Community städtischer Gärtner", "Rabatt auf Gartenmaterialien", "Teilnahmezertifikat"],
    contact: "jardineria@urban.es"
  },
  "e3c": {
    id: "e3c",
    title: "Carrera solidaria por el medio ambiente",
    title_en: "Environmental Solidarity Run",
    title_de: "Umwelt-Solidaritätslauf",
    description: "Únete a nuestra carrera solidaria de 5K y 10K en el hermoso Parque del Retiro de Madrid para recaudar fondos que apoyarán proyectos ambientales locales de reforestación, limpieza de espacios naturales y educación ecológica. Esta carrera está diseñada para corredores de todos los niveles, desde principiantes hasta atletas experimentados. El recorrido atraviesa las zonas más verdes del parque, ofreciendo un ambiente natural y relajante. Todos los fondos recaudados se destinarán directamente a iniciativas locales de conservación ambiental, incluyendo la plantación de árboles nativos, la restauración de hábitats y programas educativos en escuelas. Además de la carrera, habrá actividades paralelas como stands informativos sobre sostenibilidad, talleres rápidos de reciclaje, y una feria de productos ecológicos. Es una oportunidad perfecta para combinar ejercicio físico, conciencia ambiental y apoyo a la comunidad.",
    description_en: "Join our solidarity 5K and 10K run in beautiful Retiro Park in Madrid to raise funds that will support local environmental projects including reforestation, natural space cleanup, and ecological education. This race is designed for runners of all levels, from beginners to experienced athletes. The route passes through the greenest areas of the park, offering a natural and relaxing atmosphere. All funds raised will go directly to local environmental conservation initiatives, including planting native trees, habitat restoration, and educational programs in schools. In addition to the race, there will be parallel activities such as informational stands on sustainability, quick recycling workshops, and an eco-friendly products fair. It's a perfect opportunity to combine physical exercise, environmental awareness, and community support.",
    description_de: "Schließen Sie sich unserem Solidaritätslauf über 5K und 10K im schönen Retiro-Park in Madrid an, um Spenden zu sammeln, die lokale Umweltprojekte unterstützen, einschließlich Aufforstung, Reinigung natürlicher Räume und ökologischer Bildung. Dieser Lauf ist für Läufer aller Niveaus konzipiert, von Anfängern bis zu erfahrenen Athleten. Die Route führt durch die grünsten Bereiche des Parks und bietet eine natürliche und entspannende Atmosphäre. Alle gesammelten Mittel gehen direkt an lokale Umweltschutzinitiativen, einschließlich der Pflanzung einheimischer Bäume, der Wiederherstellung von Lebensräumen und Bildungsprogrammen in Schulen. Zusätzlich zum Lauf gibt es parallele Aktivitäten wie Informationsstände zur Nachhaltigkeit, schnelle Recycling-Workshops und eine Messe für umweltfreundliche Produkte. Es ist eine perfekte Gelegenheit, körperliche Bewegung, Umweltbewusstsein und Gemeinschaftsunterstützung zu kombinieren.",
    image_url: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop",
    website: "https://www.greenrunners.org",
    date: "2025-02-05",
    time: "10:00",
    duration: 2,
    location: "Parque del Retiro, Madrid",
    location_en: "Retiro Park, Madrid",
    location_de: "Retiro-Park, Madrid",
    organizer: "Green Runners",
    organizer_en: "Green Runners",
    organizer_de: "Grüne Läufer",
    category: "community",
    maxVolunteers: 100,
    currentVolunteers: 85,
    requirements: ["Registro previo obligatorio (plazas limitadas)", "Ropa deportiva cómoda", "Zapatillas de running adecuadas", "Botella de agua reutilizable", "Documento de identidad", "Certificado médico (recomendado para distancias de 10K)", "Edad mínima: 16 años (con autorización parental para menores)"],
    requirements_en: ["Mandatory prior registration (limited spots)", "Comfortable sports clothes", "Appropriate running shoes", "Reusable water bottle", "ID document", "Medical certificate (recommended for 10K distances)", "Minimum age: 16 years (with parental authorization for minors)"],
    requirements_de: ["Verbindliche Voranmeldung (begrenzte Plätze)", "Bequeme Sportkleidung", "Angemessene Laufschuhe", "Wiederverwendbare Wasserflasche", "Ausweisdokument", "Ärztliches Attest (empfohlen für 10K-Distanzen)", "Mindestalter: 16 Jahre (mit elterlicher Genehmigung für Minderjährige)"],
    benefits: ["Medalla conmemorativa ecológica (hecha de materiales reciclados)", "Kit completo de hidratación ecológica", "Camiseta técnica de la carrera", "Descuentos en tiendas de running asociadas", "Acceso gratuito a actividades paralelas", "Certificado digital de participación", "Fotos profesionales del evento", "Snacks saludables post-carrera"],
    benefits_en: ["Commemorative eco-friendly medal (made from recycled materials)", "Complete eco-friendly hydration kit", "Technical race t-shirt", "Discounts at associated running stores", "Free access to parallel activities", "Digital participation certificate", "Professional event photos", "Healthy post-race snacks"],
    benefits_de: ["Gedenkmedaille aus umweltfreundlichen Materialien (aus recycelten Materialien)", "Vollständiges umweltfreundliches Hydratations-Kit", "Technisches Renn-T-Shirt", "Rabatte in verbundenen Laufgeschäften", "Kostenloser Zugang zu parallelen Aktivitäten", "Digitales Teilnahmezertifikat", "Professionelle Event-Fotos", "Gesunde Snacks nach dem Lauf"],
    contact: "carrera@green.es"
  },
  "e3d": {
    id: "e3d",
    title: "Construcción de hoteles para insectos",
    title_en: "Insect Hotel Building",
    title_de: "Insektenhotel-Bau",
    description: "Participa en la construcción de refugios para insectos beneficiosos que son esenciales para la biodiversidad urbana y la polinización. Durante este taller práctico de 2 horas, aprenderás a construir hoteles para insectos usando materiales naturales y reciclados. Estos refugios proporcionan espacios seguros para abejas solitarias, mariquitas, crisopas y otros insectos beneficiosos que ayudan a controlar plagas naturalmente y polinizan plantas. Aprenderás sobre la importancia de cada especie, cómo diseñar refugios específicos para diferentes tipos de insectos, y dónde ubicarlos estratégicamente para maximizar su efectividad. También exploraremos cómo estos hoteles contribuyen a la salud del ecosistema urbano y cómo puedes construir uno para tu propio jardín o balcón. Al finalizar, cada participante se llevará su propio hotel de insectos completamente funcional y listo para instalar.",
    description_en: "Participate in building shelters for beneficial insects that are essential for urban biodiversity and pollination. During this 2-hour practical workshop, you'll learn to build insect hotels using natural and recycled materials. These shelters provide safe spaces for solitary bees, ladybugs, lacewings, and other beneficial insects that help control pests naturally and pollinate plants. You'll learn about the importance of each species, how to design specific shelters for different types of insects, and where to place them strategically to maximize their effectiveness. We'll also explore how these hotels contribute to urban ecosystem health and how you can build one for your own garden or balcony. At the end, each participant will take home their own fully functional insect hotel ready to install.",
    description_de: "Nehmen Sie am Bau von Unterkünften für nützliche Insekten teil, die für die städtische Biodiversität und Bestäubung unerlässlich sind. In diesem 2-stündigen praktischen Workshop lernen Sie, Insektenhotels aus natürlichen und recycelten Materialien zu bauen. Diese Unterkünfte bieten sichere Räume für Solitärbienen, Marienkäfer, Florfliegen und andere nützliche Insekten, die Schädlinge natürlich bekämpfen und Pflanzen bestäuben. Sie lernen die Bedeutung jeder Art kennen, wie man spezifische Unterkünfte für verschiedene Insektentypen entwirft und wo man sie strategisch platziert, um ihre Wirksamkeit zu maximieren. Wir werden auch erkunden, wie diese Hotels zur Gesundheit des städtischen Ökosystems beitragen und wie Sie eines für Ihren eigenen Garten oder Balkon bauen können. Am Ende nimmt jeder Teilnehmer sein eigenes voll funktionsfähiges Insektenhotel mit nach Hause, das installiert werden kann.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.insectprotectors.org",
    date: "2025-02-12",
    time: "16:00",
    duration: 2,
    location: "Parque Natural, Milán",
    location_en: "Nature Park, Milan",
    location_de: "Naturpark, Mailand",
    organizer: "Insect Protectors",
    organizer_en: "Insect Protectors",
    organizer_de: "Insektenschützer",
    category: "environment",
    maxVolunteers: 15,
    currentVolunteers: 12,
    requirements: ["Ropa cómoda que pueda ensuciarse", "Guantes de trabajo (opcional)", "Herramientas básicas (proporcionamos si no tienes)", "Materiales naturales como cañas, piñas, cortezas (algunos proporcionados)", "Interés en biodiversidad y conservación", "Disponibilidad para trabajar con materiales naturales"],
    requirements_en: ["Comfortable clothes that can get dirty", "Work gloves (optional)", "Basic tools (we provide if you don't have them)", "Natural materials like reeds, pine cones, barks (some provided)", "Interest in biodiversity and conservation", "Availability to work with natural materials"],
    requirements_de: ["Bequeme Kleidung, die schmutzig werden kann", "Arbeitshandschuhe (optional)", "Grundwerkzeuge (wir stellen zur Verfügung, wenn Sie keine haben)", "Natürliche Materialien wie Schilf, Tannenzapfen, Rinden (einige werden bereitgestellt)", "Interesse an Biodiversität und Naturschutz", "Verfügbarkeit für die Arbeit mit natürlichen Materialien"],
    benefits: ["Hotel de insectos personal completamente funcional", "Guía completa de especies de insectos beneficiosos", "Manual de construcción y mantenimiento", "Certificado de participación", "Materiales adicionales para futuros proyectos", "Acceso a comunidad online de conservación de insectos", "Información sobre dónde instalar tu hotel para máxima efectividad"],
    benefits_en: ["Fully functional personal insect hotel", "Complete guide to beneficial insect species", "Construction and maintenance manual", "Participation certificate", "Additional materials for future projects", "Access to online insect conservation community", "Information on where to install your hotel for maximum effectiveness"],
    benefits_de: ["Voll funktionsfähiges persönliches Insektenhotel", "Vollständiger Leitfaden für nützliche Insektenarten", "Bau- und Wartungshandbuch", "Teilnahmezertifikat", "Zusätzliche Materialien für zukünftige Projekte", "Zugang zur Online-Community für Insektenschutz", "Informationen darüber, wo Sie Ihr Hotel für maximale Wirksamkeit installieren können"],
    contact: "insectos@protectors.es"
  },
  "e3e": {
    id: "e3e",
    title: "Seminario de energía renovable",
    title_en: "Renewable Energy Seminar",
    title_de: "Erneuerbare Energien-Seminar",
    description: "Explora las últimas innovaciones y tendencias en energía renovable y comprende su papel crucial en la transición hacia un futuro sostenible. Este seminario de 2 horas cubre tecnologías emergentes en energía solar, eólica, hidroeléctrica y geotérmica, así como sistemas de almacenamiento de energía y redes inteligentes. Analizaremos casos de estudio reales de implementaciones exitosas en Europa, los desafíos técnicos y económicos actuales, y las oportunidades de inversión y empleo en el sector de energías limpias. También discutiremos políticas energéticas, incentivos gubernamentales disponibles, y cómo las comunidades pueden participar activamente en la transición energética. Los expertos invitados compartirán sus experiencias en proyectos de gran escala y responderán preguntas sobre viabilidad técnica y económica. Este seminario es ideal para profesionales del sector, estudiantes, emprendedores y cualquier persona interesada en entender el presente y futuro de la energía renovable.",
    description_en: "Explore the latest innovations and trends in renewable energy and understand its crucial role in the transition to a sustainable future. This 2-hour seminar covers emerging technologies in solar, wind, hydroelectric, and geothermal energy, as well as energy storage systems and smart grids. We'll analyze real case studies of successful implementations in Europe, current technical and economic challenges, and investment and employment opportunities in the clean energy sector. We'll also discuss energy policies, available government incentives, and how communities can actively participate in the energy transition. Guest experts will share their experiences with large-scale projects and answer questions about technical and economic feasibility. This seminar is ideal for sector professionals, students, entrepreneurs, and anyone interested in understanding the present and future of renewable energy.",
    description_de: "Erkunden Sie die neuesten Innovationen und Trends in erneuerbaren Energien und verstehen Sie ihre entscheidende Rolle beim Übergang zu einer nachhaltigen Zukunft. Dieses 2-stündige Seminar behandelt aufkommende Technologien in Solarenergie, Windkraft, Wasserkraft und Geothermie sowie Energiespeichersysteme und intelligente Netze. Wir werden echte Fallstudien erfolgreicher Umsetzungen in Europa analysieren, aktuelle technische und wirtschaftliche Herausforderungen sowie Investitions- und Beschäftigungsmöglichkeiten im Sektor sauberer Energien. Wir werden auch Energiepolitik, verfügbare staatliche Anreize und wie Gemeinden aktiv am Energiewandel teilnehmen können, diskutieren. Gastexperten werden ihre Erfahrungen mit groß angelegten Projekten teilen und Fragen zur technischen und wirtschaftlichen Machbarkeit beantworten. Dieses Seminar ist ideal für Fachleute des Sektors, Studenten, Unternehmer und alle, die daran interessiert sind, die Gegenwart und Zukunft erneuerbarer Energien zu verstehen.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    website: "https://www.greenenergy.org",
    date: "2025-02-16",
    time: "19:00",
    duration: 2,
    location: "Centro de Energía, París",
    location_en: "Energy Center, Paris",
    location_de: "Energiezentrum, Paris",
    organizer: "Green Energy",
    organizer_en: "Green Energy",
    organizer_de: "Grüne Energie",
    category: "education",
    maxVolunteers: 60,
    currentVolunteers: 45,
    requirements: ["Registro previo obligatorio (plazas limitadas)", "Cuaderno o dispositivo para tomar notas", "Interés en energía renovable y sostenibilidad", "Conocimientos básicos de energía (recomendado pero no obligatorio)", "Preguntas preparadas para la sesión de Q&A (opcional)"],
    requirements_en: ["Mandatory prior registration (limited spots)", "Notebook or device for taking notes", "Interest in renewable energy and sustainability", "Basic knowledge of energy (recommended but not required)", "Prepared questions for Q&A session (optional)"],
    requirements_de: ["Verbindliche Voranmeldung (begrenzte Plätze)", "Notizbuch oder Gerät zum Mitschreiben", "Interesse an erneuerbaren Energien und Nachhaltigkeit", "Grundkenntnisse in Energie (empfohlen, aber nicht erforderlich)", "Vorbereitete Fragen für die Q&A-Sitzung (optional)"],
    benefits: ["Certificado de participación profesional", "Material educativo completo en formato digital", "Acceso a presentaciones y recursos adicionales", "Oportunidades de networking con profesionales del sector", "Lista de contactos de expertos y empresas", "Descuentos en cursos avanzados de energía renovable", "Acceso a comunidad online exclusiva de participantes"],
    benefits_en: ["Professional participation certificate", "Complete educational material in digital format", "Access to presentations and additional resources", "Networking opportunities with sector professionals", "Contact list of experts and companies", "Discounts on advanced renewable energy courses", "Access to exclusive online community of participants"],
    benefits_de: ["Professionelles Teilnahmezertifikat", "Vollständiges Bildungsmaterial im digitalen Format", "Zugang zu Präsentationen und zusätzlichen Ressourcen", "Netzwerkmöglichkeiten mit Fachleuten des Sektors", "Kontaktliste von Experten und Unternehmen", "Rabatte auf fortgeschrittene Kurse für erneuerbare Energien", "Zugang zur exklusiven Online-Community der Teilnehmer"],
    contact: "energia@green.es"
  },
  "e3f": {
    id: "e3f",
    title: "Festival de comida vegana",
    title_en: "Vegan Food Festival",
    title_de: "Veganes Essensfestival",
    description: "Únete a nuestro festival gastronómico vegano más grande del año, donde podrás descubrir la increíble diversidad y sabor de la cocina basada en plantas. Durante 6 horas, disfrutarás de más de 30 puestos de comida de chefs reconocidos y restaurantes locales, ofreciendo desde platos tradicionales reinventados hasta innovaciones culinarias veganas. El festival incluye talleres prácticos de cocina donde aprenderás técnicas para preparar comidas veganas nutritivas y deliciosas, charlas sobre nutrición basada en plantas con nutricionistas certificados, y demostraciones en vivo de preparación de platos. También habrá una zona de mercado con productos veganos locales, suplementos nutricionales, y libros de cocina. Los niños tendrán su propio espacio con actividades educativas sobre alimentación saludable. Este evento es perfecto tanto para veganos experimentados como para curiosos que quieren explorar opciones más sostenibles y saludables. Todos los alimentos son 100% veganos, sin ingredientes de origen animal, y muchos son también orgánicos y locales.",
    description_en: "Join our largest vegan gastronomic festival of the year, where you can discover the incredible diversity and flavor of plant-based cuisine. During 6 hours, you'll enjoy more than 30 food stalls from recognized chefs and local restaurants, offering everything from reinvented traditional dishes to vegan culinary innovations. The festival includes practical cooking workshops where you'll learn techniques to prepare nutritious and delicious vegan meals, talks on plant-based nutrition with certified nutritionists, and live demonstrations of dish preparation. There will also be a market area with local vegan products, nutritional supplements, and cookbooks. Children will have their own space with educational activities about healthy eating. This event is perfect for both experienced vegans and curious people who want to explore more sustainable and healthy options. All foods are 100% vegan, with no animal-derived ingredients, and many are also organic and local.",
    description_de: "Schließen Sie sich unserem größten veganen gastronomischen Festival des Jahres an, wo Sie die unglaubliche Vielfalt und den Geschmack der pflanzlichen Küche entdecken können. Während 6 Stunden genießen Sie mehr als 30 Essensstände von anerkannten Köchen und lokalen Restaurants, die alles von neu interpretierten traditionellen Gerichten bis hin zu veganen kulinarischen Innovationen anbieten. Das Festival umfasst praktische Kochworkshops, in denen Sie Techniken lernen, um nahrhafte und köstliche vegane Mahlzeiten zuzubereiten, Vorträge über pflanzliche Ernährung mit zertifizierten Ernährungswissenschaftlern und Live-Demonstrationen der Zubereitung von Gerichten. Es wird auch einen Marktbereich mit lokalen veganen Produkten, Nahrungsergänzungsmitteln und Kochbüchern geben. Kinder haben ihren eigenen Raum mit Bildungsaktivitäten über gesunde Ernährung. Diese Veranstaltung ist perfekt für sowohl erfahrene Veganer als auch Neugierige, die nachhaltigere und gesündere Optionen erkunden möchten. Alle Lebensmittel sind zu 100% vegan, ohne tierische Inhaltsstoffe, und viele sind auch biologisch und lokal.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.unitedvegans.org",
    date: "2025-02-20",
    time: "12:00",
    duration: 6,
    location: "Plaza de la Alimentación, Londres",
    location_en: "Food Square, London",
    location_de: "Ernährungsplatz, London",
    organizer: "United Vegans",
    organizer_en: "United Vegans",
    organizer_de: "Vereinte Veganer",
    category: "community",
    maxVolunteers: 200,
    currentVolunteers: 150,
    requirements: ["Entrada gratuita con registro previo (obligatorio)", "Apetito y curiosidad por la comida vegana", "Ropa cómoda para estar de pie", "Efectivo o tarjeta para compras adicionales (opcional)", "Botella de agua reutilizable", "Bolsa reutilizable para compras (opcional)"],
    requirements_en: ["Free entry with prior registration (mandatory)", "Appetite and curiosity for vegan food", "Comfortable clothes for standing", "Cash or card for additional purchases (optional)", "Reusable water bottle", "Reusable bag for purchases (optional)"],
    requirements_de: ["Kostenloser Eintritt mit Voranmeldung (obligatorisch)", "Appetit und Neugier auf veganes Essen", "Bequeme Kleidung zum Stehen", "Bargeld oder Karte für zusätzliche Einkäufe (optional)", "Wiederverwendbare Wasserflasche", "Wiederverwendbare Tasche für Einkäufe (optional)"],
    benefits: ["Degustaciones gratuitas en múltiples puestos", "Recetario vegano completo en formato digital", "Acceso a todas las charlas y talleres", "Red de contactos con chefs y restaurantes veganos", "Descuentos exclusivos en restaurantes participantes", "Muestra de productos veganos", "Certificado digital de participación", "Acceso prioritario a futuros eventos"],
    benefits_en: ["Free tastings at multiple stalls", "Complete vegan recipe book in digital format", "Access to all talks and workshops", "Contact network with vegan chefs and restaurants", "Exclusive discounts at participating restaurants", "Sample of vegan products", "Digital participation certificate", "Priority access to future events"],
    benefits_de: ["Kostenlose Kostproben an mehreren Ständen", "Vollständiges veganes Rezeptbuch im digitalen Format", "Zugang zu allen Vorträgen und Workshops", "Kontaktnetzwerk mit veganen Köchen und Restaurants", "Exklusive Rabatte in teilnehmenden Restaurants", "Probe von veganen Produkten", "Digitales Teilnahmezertifikat", "Prioritätszugang zu zukünftigen Veranstaltungen"],
    contact: "vegano@united.es"
  },
  "e3g": {
    id: "e3g",
    title: "Monitoreo de calidad del aire",
    title_en: "Air Quality Monitoring",
    title_de: "Luftqualitätsüberwachung",
    description: "Conviértete en un científico ciudadano y aprende a monitorear la calidad del aire en tu comunidad usando tecnología de sensores avanzados. Durante este taller práctico de 3 horas, aprenderás cómo funcionan los sensores de calidad del aire, qué contaminantes miden (PM2.5, PM10, NO2, O3, CO), y cómo interpretar los datos que recopilan. Realizaremos una sesión práctica de instalación y calibración de sensores, y luego saldremos al campo para realizar mediciones reales en diferentes ubicaciones del distrito industrial. Aprenderás sobre las fuentes comunes de contaminación del aire urbano, cómo los datos ciudadanos complementan las estaciones oficiales de monitoreo, y cómo usar esta información para tomar decisiones informadas sobre tu salud y actividades al aire libre. También exploraremos cómo contribuir a redes de monitoreo ciudadano globales y cómo los datos recopilados pueden influir en políticas públicas. Al finalizar, cada participante recibirá su propio sensor de calidad del aire para continuar monitoreando en su hogar o comunidad.",
    description_en: "Become a citizen scientist and learn to monitor air quality in your community using advanced sensor technology. During this 3-hour practical workshop, you'll learn how air quality sensors work, what pollutants they measure (PM2.5, PM10, NO2, O3, CO), and how to interpret the data they collect. We'll conduct a practical session on sensor installation and calibration, and then go into the field to take real measurements at different locations in the industrial district. You'll learn about common sources of urban air pollution, how citizen data complements official monitoring stations, and how to use this information to make informed decisions about your health and outdoor activities. We'll also explore how to contribute to global citizen monitoring networks and how collected data can influence public policies. At the end, each participant will receive their own air quality sensor to continue monitoring in their home or community.",
    description_de: "Werden Sie ein Bürgerwissenschaftler und lernen Sie, die Luftqualität in Ihrer Gemeinschaft mit fortschrittlicher Sensortechnologie zu überwachen. In diesem 3-stündigen praktischen Workshop lernen Sie, wie Luftqualitätssensoren funktionieren, welche Schadstoffe sie messen (PM2.5, PM10, NO2, O3, CO) und wie Sie die von ihnen gesammelten Daten interpretieren. Wir führen eine praktische Sitzung zur Installation und Kalibrierung von Sensoren durch und gehen dann ins Feld, um echte Messungen an verschiedenen Standorten im Industriegebiet durchzuführen. Sie lernen häufige Quellen der städtischen Luftverschmutzung kennen, wie Bürgerdaten offizielle Überwachungsstationen ergänzen und wie Sie diese Informationen nutzen können, um fundierte Entscheidungen über Ihre Gesundheit und Aktivitäten im Freien zu treffen. Wir werden auch erkunden, wie man zu globalen Bürgerüberwachungsnetzwerken beiträgt und wie gesammelte Daten die öffentliche Politik beeinflussen können. Am Ende erhält jeder Teilnehmer seinen eigenen Luftqualitätssensor, um die Überwachung in seinem Zuhause oder seiner Gemeinschaft fortzusetzen.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.cleanair.org",
    date: "2025-02-26",
    time: "13:00",
    duration: 3,
    location: "Distrito Industrial, Berlín",
    location_en: "Industrial District, Berlin",
    location_de: "Industriegebiet, Berlin",
    organizer: "Clean Air",
    organizer_en: "Clean Air",
    organizer_de: "Saubere Luft",
    category: "environment",
    maxVolunteers: 12,
    currentVolunteers: 9,
    requirements: ["Smartphone con sistema operativo Android o iOS", "Conocimientos básicos de tecnología (navegación en apps)", "Ropa cómoda para caminar al aire libre", "Botella de agua", "Disponibilidad para caminar durante la sesión práctica", "Interés en ciencia ciudadana y medio ambiente"],
    requirements_en: ["Smartphone with Android or iOS operating system", "Basic technology knowledge (app navigation)", "Comfortable clothes for walking outdoors", "Water bottle", "Availability to walk during practical session", "Interest in citizen science and environment"],
    requirements_de: ["Smartphone mit Android- oder iOS-Betriebssystem", "Grundkenntnisse in Technologie (App-Navigation)", "Bequeme Kleidung zum Gehen im Freien", "Wasserflasche", "Verfügbarkeit zum Gehen während der praktischen Sitzung", "Interesse an Bürgerwissenschaft und Umwelt"],
    benefits: ["Sensor de calidad del aire personal de alta precisión", "App de monitoreo profesional con acceso de por vida", "Guía completa de interpretación de datos", "Certificado de científico ciudadano", "Acceso a plataforma de datos compartidos", "Sesión de seguimiento online después de 1 mes", "Material educativo sobre contaminación del aire y salud", "Descuento en sensores adicionales para familiares"],
    benefits_en: ["Personal high-precision air quality sensor", "Professional monitoring app with lifetime access", "Complete data interpretation guide", "Citizen scientist certificate", "Access to shared data platform", "Online follow-up session after 1 month", "Educational material on air pollution and health", "Discount on additional sensors for family members"],
    benefits_de: ["Persönlicher hochpräziser Luftqualitätssensor", "Professionelle Überwachungs-App mit lebenslangem Zugang", "Vollständiger Leitfaden zur Dateninterpretation", "Bürgerwissenschaftler-Zertifikat", "Zugang zur gemeinsamen Datenplattform", "Online-Nachbetreuungssitzung nach 1 Monat", "Bildungsmaterial über Luftverschmutzung und Gesundheit", "Rabatt auf zusätzliche Sensoren für Familienmitglieder"],
    contact: "aire@clean.es"
  },
  "e5b": {
    id: "e5b",
    title: "Plantación de árboles nativos",
    title_en: "Native Tree Planting",
    title_de: "Einheimische Baumpflanzung",
    description: "Únete a nuestra jornada de reforestación comunitaria enfocada en especies nativas del Bosque Urbano de Berlín. Durante esta actividad de 4 horas, plantaremos árboles autóctonos seleccionados específicamente para restaurar y fortalecer el ecosistema local. Aprenderás sobre la importancia de las especies nativas para la biodiversidad, cómo cada árbol contribuye al ecosistema urbano, y las técnicas adecuadas de plantación para asegurar su supervivencia a largo plazo. Trabajaremos con especies como robles, hayas y abedules que son fundamentales para el hábitat local. Los expertos forestales compartirán conocimientos sobre el cuidado de los árboles jóvenes, cómo identificar especies nativas, y el impacto positivo que tendrán estos árboles en la calidad del aire, la reducción de ruido urbano, y el hábitat para la fauna local. Cada árbol plantado será etiquetado y monitoreado, y recibirás información sobre cómo seguir su crecimiento. Esta es una oportunidad única para dejar un legado verde duradero en la ciudad.",
    description_en: "Join our community reforestation day focused on native species of Berlin's Urban Forest. During this 4-hour activity, we'll plant native trees specifically selected to restore and strengthen the local ecosystem. You'll learn about the importance of native species for biodiversity, how each tree contributes to the urban ecosystem, and proper planting techniques to ensure their long-term survival. We'll work with species like oaks, beeches, and birches that are fundamental to the local habitat. Forest experts will share knowledge about caring for young trees, how to identify native species, and the positive impact these trees will have on air quality, urban noise reduction, and habitat for local wildlife. Each planted tree will be tagged and monitored, and you'll receive information on how to follow its growth. This is a unique opportunity to leave a lasting green legacy in the city.",
    description_de: "Schließen Sie sich unserem Gemeinschaftsaufforstungstag an, der sich auf einheimische Arten des Berliner Stadtwalds konzentriert. Während dieser 4-stündigen Aktivität pflanzen wir einheimische Bäume, die speziell ausgewählt wurden, um das lokale Ökosystem wiederherzustellen und zu stärken. Sie lernen die Bedeutung einheimischer Arten für die Biodiversität, wie jeder Baum zum städtischen Ökosystem beiträgt und geeignete Pflanztechniken, um ihr langfristiges Überleben sicherzustellen. Wir arbeiten mit Arten wie Eichen, Buchen und Birken, die für den lokalen Lebensraum grundlegend sind. Forstexperten teilen Wissen über die Pflege junger Bäume, wie man einheimische Arten identifiziert und die positive Auswirkung, die diese Bäume auf die Luftqualität, die Reduzierung von Stadtlärm und den Lebensraum für lokale Wildtiere haben werden. Jeder gepflanzte Baum wird markiert und überwacht, und Sie erhalten Informationen darüber, wie Sie sein Wachstum verfolgen können. Dies ist eine einzigartige Gelegenheit, ein dauerhaftes grünes Erbe in der Stadt zu hinterlassen.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.greenplanters.org",
    date: "2025-03-01",
    time: "09:00",
    duration: 4,
    location: "Bosque Urbano, Berlín",
    location_en: "Urban Forest, Berlin",
    location_de: "Stadtwald, Berlin",
    organizer: "Green Planters",
    organizer_en: "Green Planters",
    organizer_de: "Grüne Pflanzer",
    category: "environment",
    maxVolunteers: 35,
    currentVolunteers: 28,
    requirements: ["Ropa cómoda y resistente que pueda ensuciarse", "Botas de trabajo o zapatos cerrados resistentes", "Guantes de jardinería o trabajo", "Botella de agua reutilizable", "Protector solar y sombrero (si hace sol)", "Ropa de abrigo (si hace frío)", "Disponibilidad para trabajar al aire libre durante 4 horas"],
    requirements_en: ["Comfortable and durable clothes that can get dirty", "Work boots or sturdy closed shoes", "Gardening or work gloves", "Reusable water bottle", "Sunscreen and hat (if sunny)", "Warm clothing (if cold)", "Availability to work outdoors for 4 hours"],
    requirements_de: ["Bequeme und strapazierfähige Kleidung, die schmutzig werden kann", "Arbeitsstiefel oder robuste geschlossene Schuhe", "Garten- oder Arbeitshandschuhe", "Wiederverwendbare Wasserflasche", "Sonnencreme und Hut (wenn sonnig)", "Warme Kleidung (wenn kalt)", "Verfügbarkeit für Arbeiten im Freien für 4 Stunden"],
    benefits: ["Planta nativa para llevar a casa (si hay disponibilidad)", "Certificado de participación en reforestación", "Refrigerio y bebidas incluidas", "Guía completa de especies nativas de la región", "Información sobre el seguimiento de tus árboles plantados", "Acceso a datos del proyecto de reforestación", "Experiencia práctica en conservación forestal", "Material educativo sobre ecosistemas urbanos"],
    benefits_en: ["Native plant to take home (if available)", "Reforestation participation certificate", "Snack and drinks included", "Complete guide to native species of the region", "Information on tracking your planted trees", "Access to reforestation project data", "Hands-on forest conservation experience", "Educational material on urban ecosystems"],
    benefits_de: ["Einheimische Pflanze zum Mitnehmen (falls verfügbar)", "Teilnahmezertifikat für Aufforstung", "Snack und Getränke inbegriffen", "Vollständiger Leitfaden zu einheimischen Arten der Region", "Informationen zur Verfolgung Ihrer gepflanzten Bäume", "Zugang zu Aufforstungsprojektdaten", "Praktische Erfahrung im Waldschutz", "Bildungsmaterial über städtische Ökosysteme"],
    contact: "plantacion@green.es"
  },
  "e5c": {
    id: "e5c",
    title: "Taller de energía eólica",
    title_en: "Wind Energy Workshop",
    title_de: "Windenergie-Workshop",
    description: "Sumérgete en el fascinante mundo de la energía eólica y aprende a construir tu propio generador eólico pequeño en este taller práctico de 3 horas. Comenzaremos con los fundamentos de cómo funciona la energía eólica, los principios de conversión de energía cinética a eléctrica, y los componentes esenciales de un aerogenerador. Luego, trabajaremos en equipos para construir pequeños generadores eólicos funcionales usando materiales proporcionados. Aprenderás sobre el diseño de palas, la optimización de la captura de viento, sistemas de transmisión, y cómo conectar el generador a sistemas de almacenamiento de energía. También exploraremos las aplicaciones prácticas de la energía eólica a pequeña escala, incluyendo sistemas para hogares, granjas y comunidades remotas. Los instructores compartirán casos de estudio de proyectos eólicos exitosos y responderán preguntas sobre viabilidad técnica y económica. Al finalizar, tendrás un generador eólico funcional que podrás llevar a casa y los conocimientos para diseñar sistemas más grandes.",
    description_en: "Dive into the fascinating world of wind energy and learn to build your own small wind generator in this 3-hour practical workshop. We'll start with the fundamentals of how wind energy works, the principles of converting kinetic energy to electrical energy, and the essential components of a wind turbine. Then, we'll work in teams to build functional small wind generators using provided materials. You'll learn about blade design, wind capture optimization, transmission systems, and how to connect the generator to energy storage systems. We'll also explore practical applications of small-scale wind energy, including systems for homes, farms, and remote communities. Instructors will share case studies of successful wind projects and answer questions about technical and economic feasibility. At the end, you'll have a functional wind generator to take home and the knowledge to design larger systems.",
    description_de: "Tauchen Sie ein in die faszinierende Welt der Windenergie und lernen Sie, Ihren eigenen kleinen Windgenerator in diesem 3-stündigen praktischen Workshop zu bauen. Wir beginnen mit den Grundlagen, wie Windenergie funktioniert, den Prinzipien der Umwandlung von kinetischer Energie in elektrische Energie und den wesentlichen Komponenten einer Windturbine. Dann arbeiten wir in Teams, um funktionale kleine Windgeneratoren mit bereitgestellten Materialien zu bauen. Sie lernen über Blattdesign, Windfangoptimierung, Übertragungssysteme und wie Sie den Generator mit Energiespeichersystemen verbinden. Wir werden auch praktische Anwendungen der Windenergie im kleinen Maßstab erkunden, einschließlich Systeme für Häuser, Farmen und abgelegene Gemeinden. Die Ausbilder teilen Fallstudien erfolgreicher Windprojekte und beantworten Fragen zur technischen und wirtschaftlichen Machbarkeit. Am Ende haben Sie einen funktionierenden Windgenerator zum Mitnehmen und das Wissen, um größere Systeme zu entwerfen.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    website: "https://www.windenergy.org",
    date: "2025-03-08",
    time: "16:00",
    duration: 3,
    location: "Centro de Energías Renovables, Madrid",
    location_en: "Renewable Energy Center, Madrid",
    location_de: "Zentrum für erneuerbare Energien, Madrid",
    organizer: "Wind Energy",
    organizer_en: "Wind Energy",
    organizer_de: "Windenergie",
    category: "education",
    maxVolunteers: 25,
    currentVolunteers: 20,
    requirements: ["Conocimientos básicos de electricidad (recomendado pero no obligatorio)", "Herramientas básicas (proporcionamos si no tienes)", "Ropa cómoda para trabajar", "Cuaderno para tomar notas", "Interés en energías renovables", "Disponibilidad para trabajar en equipo"],
    requirements_en: ["Basic knowledge of electricity (recommended but not required)", "Basic tools (we provide if you don't have them)", "Comfortable clothes for working", "Notebook for taking notes", "Interest in renewable energy", "Availability to work in teams"],
    requirements_de: ["Grundkenntnisse in Elektrizität (empfohlen, aber nicht erforderlich)", "Grundwerkzeuge (wir stellen zur Verfügung, wenn Sie keine haben)", "Bequeme Kleidung zum Arbeiten", "Notizbuch zum Mitschreiben", "Interesse an erneuerbaren Energien", "Verfügbarkeit für Teamarbeit"],
    benefits: ["Kit completo de construcción de generador eólico para llevar", "Manual técnico detallado con diagramas", "Certificado de participación profesional", "Acceso a recursos online adicionales", "Lista de materiales y proveedores", "Guía de mantenimiento y optimización", "Descuento en kits avanzados", "Acceso a comunidad online de constructores eólicos"],
    benefits_en: ["Complete wind generator construction kit to take home", "Detailed technical manual with diagrams", "Professional participation certificate", "Access to additional online resources", "List of materials and suppliers", "Maintenance and optimization guide", "Discount on advanced kits", "Access to online community of wind builders"],
    benefits_de: ["Vollständiges Windgenerator-Bausatz zum Mitnehmen", "Detailliertes technisches Handbuch mit Diagrammen", "Professionelles Teilnahmezertifikat", "Zugang zu zusätzlichen Online-Ressourcen", "Liste von Materialien und Lieferanten", "Wartungs- und Optimierungsleitfaden", "Rabatt auf fortgeschrittene Kits", "Zugang zur Online-Community von Windbauern"],
    contact: "eolica@windenergy.es"
  },
  "e5d": {
    id: "e5d",
    title: "Mercado de productos de temporada",
    title_en: "Seasonal Products Market",
    title_de: "Saisonproduktmarkt",
    description: "Explora nuestro mercado especializado de productos de temporada donde más de 40 productores locales presentan sus mejores alimentos cultivados de manera sostenible y respetuosa con el medio ambiente. Durante 6 horas, podrás descubrir frutas y verduras de temporada frescas, productos artesanales, miel local, quesos de granja, panes artesanales, conservas caseras y mucho más. Cada productor comparte la historia detrás de sus productos, sus métodos de cultivo sostenible, y cómo sus prácticas benefician al medio ambiente local. El mercado incluye talleres educativos sobre alimentación de temporada, charlas sobre nutrición basada en productos locales, y demostraciones de cocina con ingredientes de temporada. También habrá actividades para niños sobre agricultura sostenible y la importancia de comer productos locales. Este evento es perfecto para familias, chefs, y cualquier persona interesada en apoyar la agricultura local y descubrir los sabores auténticos de la región. Todos los productos son cultivados dentro de un radio de 100 km, garantizando frescura y reduciendo la huella de carbono.",
    description_en: "Explore our specialized seasonal products market where more than 40 local producers present their best sustainably and environmentally friendly grown foods. During 6 hours, you can discover fresh seasonal fruits and vegetables, artisanal products, local honey, farm cheeses, artisanal breads, homemade preserves, and much more. Each producer shares the story behind their products, their sustainable growing methods, and how their practices benefit the local environment. The market includes educational workshops on seasonal eating, talks on nutrition based on local products, and cooking demonstrations with seasonal ingredients. There will also be activities for children about sustainable agriculture and the importance of eating local products. This event is perfect for families, chefs, and anyone interested in supporting local agriculture and discovering the authentic flavors of the region. All products are grown within a 100 km radius, ensuring freshness and reducing carbon footprint.",
    description_de: "Erkunden Sie unseren spezialisierten Saisonproduktmarkt, auf dem mehr als 40 lokale Produzenten ihre besten nachhaltig und umweltfreundlich angebauten Lebensmittel präsentieren. Während 6 Stunden können Sie frische Saisonfrüchte und -gemüse, handwerkliche Produkte, lokalen Honig, Hofkäse, handwerkliche Brote, hausgemachte Konserven und vieles mehr entdecken. Jeder Produzent teilt die Geschichte hinter seinen Produkten, seine nachhaltigen Anbaumethoden und wie seine Praktiken der lokalen Umwelt zugute kommen. Der Markt umfasst Bildungs-Workshops über saisonales Essen, Vorträge über Ernährung auf der Grundlage lokaler Produkte und Kochdemonstrationen mit saisonalen Zutaten. Es wird auch Aktivitäten für Kinder über nachhaltige Landwirtschaft und die Bedeutung des Verzehrs lokaler Produkte geben. Diese Veranstaltung ist perfekt für Familien, Köche und alle, die daran interessiert sind, die lokale Landwirtschaft zu unterstützen und die authentischen Aromen der Region zu entdecken. Alle Produkte werden innerhalb eines Radius von 100 km angebaut, was Frische garantiert und den CO2-Fußabdruck reduziert.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.seasonalproducers.org",
    date: "2025-03-12",
    time: "10:00",
    duration: 6,
    location: "Plaza de la Temporada, Barcelona",
    location_en: "Season Square, Barcelona",
    location_de: "Saisonplatz, Barcelona",
    organizer: "Seasonal Producers",
    organizer_en: "Seasonal Producers",
    organizer_de: "Saisonproduzenten",
    category: "community",
    maxVolunteers: 60,
    currentVolunteers: 45,
    requirements: ["Bolsa reutilizable grande para compras", "Efectivo o tarjeta para compras", "Cámara o teléfono para fotografiar productos (opcional)", "Apetito y curiosidad por productos locales", "Ropa cómoda para caminar entre puestos", "Lista de compras (opcional)"],
    requirements_en: ["Large reusable bag for purchases", "Cash or card for purchases", "Camera or phone to photograph products (optional)", "Appetite and curiosity for local products", "Comfortable clothes for walking between stalls", "Shopping list (optional)"],
    requirements_de: ["Große wiederverwendbare Tasche für Einkäufe", "Bargeld oder Karte für Einkäufe", "Kamera oder Telefon zum Fotografieren von Produkten (optional)", "Appetit und Neugier auf lokale Produkte", "Bequeme Kleidung zum Gehen zwischen Ständen", "Einkaufsliste (optional)"],
    benefits: ["Descuentos especiales del 10-15% en todos los productos", "Degustaciones gratuitas en múltiples puestos", "Red de contactos con productores locales", "Guía de productos de temporada del mes", "Recetario con productos de temporada", "Acceso gratuito a todos los talleres y charlas", "Certificado de participación", "Tarjeta de fidelidad para futuros mercados"],
    benefits_en: ["Special discounts of 10-15% on all products", "Free tastings at multiple stalls", "Contact network with local producers", "Monthly seasonal products guide", "Recipe book with seasonal products", "Free access to all workshops and talks", "Participation certificate", "Loyalty card for future markets"],
    benefits_de: ["Spezielle Rabatte von 10-15% auf alle Produkte", "Kostenlose Kostproben an mehreren Ständen", "Kontaktnetzwerk mit lokalen Produzenten", "Monatlicher Saisonproduktführer", "Rezeptbuch mit Saisonprodukten", "Kostenloser Zugang zu allen Workshops und Vorträgen", "Teilnahmezertifikat", "Treuekarte für zukünftige Märkte"],
    contact: "temporada@producers.es"
  },
  "e5e": {
    id: "e5e",
    title: "Construcción de jardines verticales",
    title_en: "Vertical Garden Building",
    title_de: "Vertikale Gartenbau",
    description: "Aprende a diseñar e instalar jardines verticales en edificios urbanos, una solución innovadora que combina estética, sostenibilidad y mejora de la calidad del aire. Durante este taller práctico de 4 horas, trabajarás en la construcción real de un jardín vertical en un edificio comercial de Milán. Aprenderás sobre los diferentes sistemas de jardinería vertical disponibles, cómo seleccionar plantas adecuadas para diferentes condiciones de luz y clima, sistemas de riego automatizados, y cómo diseñar estructuras que soporten el peso de las plantas y el sustrato. También exploraremos los beneficios ambientales de los jardines verticales, incluyendo la reducción de la temperatura de los edificios, la mejora de la calidad del aire mediante la filtración de contaminantes, el aislamiento acústico, y la creación de hábitats para la biodiversidad urbana. Los expertos compartirán casos de estudio de proyectos exitosos y responderán preguntas sobre mantenimiento, costos, y viabilidad para diferentes tipos de edificios. Al finalizar, habrás contribuido a crear un jardín vertical funcional y tendrás los conocimientos para diseñar e instalar tu propio jardín vertical.",
    description_en: "Learn to design and install vertical gardens on urban buildings, an innovative solution that combines aesthetics, sustainability, and improved air quality. During this 4-hour practical workshop, you'll work on the actual construction of a vertical garden on a commercial building in Milan. You'll learn about different vertical gardening systems available, how to select appropriate plants for different light and climate conditions, automated irrigation systems, and how to design structures that support the weight of plants and substrate. We'll also explore the environmental benefits of vertical gardens, including reducing building temperatures, improving air quality by filtering pollutants, acoustic insulation, and creating habitats for urban biodiversity. Experts will share case studies of successful projects and answer questions about maintenance, costs, and feasibility for different types of buildings. At the end, you'll have contributed to creating a functional vertical garden and have the knowledge to design and install your own vertical garden.",
    description_de: "Lernen Sie, vertikale Gärten an städtischen Gebäuden zu entwerfen und zu installieren, eine innovative Lösung, die Ästhetik, Nachhaltigkeit und verbesserte Luftqualität kombiniert. In diesem 4-stündigen praktischen Workshop arbeiten Sie am tatsächlichen Bau eines vertikalen Gartens an einem Geschäftsgebäude in Mailand. Sie lernen verschiedene verfügbare vertikale Gartensysteme kennen, wie Sie geeignete Pflanzen für verschiedene Licht- und Klimabedingungen auswählen, automatisierte Bewässerungssysteme und wie Sie Strukturen entwerfen, die das Gewicht von Pflanzen und Substrat tragen. Wir werden auch die Umweltvorteile vertikaler Gärten erkunden, einschließlich der Reduzierung der Gebäudetemperaturen, der Verbesserung der Luftqualität durch Filterung von Schadstoffen, der Schalldämmung und der Schaffung von Lebensräumen für die städtische Biodiversität. Experten teilen Fallstudien erfolgreicher Projekte und beantworten Fragen zu Wartung, Kosten und Machbarkeit für verschiedene Gebäudetypen. Am Ende haben Sie zur Schaffung eines funktionierenden vertikalen Gartens beigetragen und haben das Wissen, Ihren eigenen vertikalen Garten zu entwerfen und zu installieren.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.verticalgardens.org",
    date: "2025-03-15",
    time: "11:00",
    duration: 4,
    location: "Edificio Comercial, Milán",
    location_en: "Commercial Building, Milan",
    location_de: "Geschäftsgebäude, Mailand",
    organizer: "Vertical Gardens",
    organizer_en: "Vertical Gardens",
    organizer_de: "Vertikale Gärten",
    category: "environment",
    maxVolunteers: 18,
    currentVolunteers: 14,
    requirements: ["Ropa de trabajo cómoda que pueda ensuciarse", "Guantes de trabajo", "Herramientas básicas (proporcionamos si no tienes)", "Botella de agua", "Calzado cerrado y resistente", "Disponibilidad para trabajar en altura (con medidas de seguridad)", "Interés en arquitectura verde y jardinería"],
    requirements_en: ["Comfortable work clothes that can get dirty", "Work gloves", "Basic tools (we provide if you don't have them)", "Water bottle", "Closed and sturdy footwear", "Availability to work at height (with safety measures)", "Interest in green architecture and gardening"],
    requirements_de: ["Bequeme Arbeitskleidung, die schmutzig werden kann", "Arbeitshandschuhe", "Grundwerkzeuge (wir stellen zur Verfügung, wenn Sie keine haben)", "Wasserflasche", "Geschlossenes und robustes Schuhwerk", "Verfügbarkeit für Arbeiten in der Höhe (mit Sicherheitsmaßnahmen)", "Interesse an grüner Architektur und Gartenarbeit"],
    benefits: ["Técnicas profesionales de jardinería vertical", "Plantas seleccionadas para jardines verticales para llevar", "Certificado de participación profesional", "Manual completo de diseño e instalación", "Lista de proveedores de materiales y plantas", "Guía de mantenimiento y cuidado", "Acceso a comunidad online de jardinería vertical", "Descuento en materiales para proyectos propios"],
    benefits_en: ["Professional vertical gardening techniques", "Selected plants for vertical gardens to take home", "Professional participation certificate", "Complete design and installation manual", "List of material and plant suppliers", "Maintenance and care guide", "Access to online vertical gardening community", "Discount on materials for own projects"],
    benefits_de: ["Professionelle vertikale Gartentechniken", "Ausgewählte Pflanzen für vertikale Gärten zum Mitnehmen", "Professionelles Teilnahmezertifikat", "Vollständiges Design- und Installationshandbuch", "Liste von Material- und Pflanzenlieferanten", "Wartungs- und Pflegeleitfaden", "Zugang zur Online-Community für vertikale Gartenarbeit", "Rabatt auf Materialien für eigene Projekte"],
    contact: "vertical@gardens.es"
  },
  "e5f": {
    id: "e5f",
    title: "Cena comunitaria sostenible",
    title_en: "Sustainable Community Dinner",
    title_de: "Nachhaltiges Gemeinschaftsessen",
    description: "Únete a nuestra cena comunitaria especial donde celebramos la alimentación sostenible con un menú completo preparado exclusivamente con ingredientes locales, orgánicos y de temporada. Durante esta velada de 3 horas en el Restaurante Verde de Londres, disfrutarás de un menú de 4 platos diseñado por chefs especializados en cocina sostenible. Cada plato cuenta la historia de sus ingredientes: de qué granja provienen, cómo fueron cultivados, y el impacto positivo de elegir productos locales y orgánicos. La cena incluye una charla del chef sobre técnicas de cocina sostenible, cómo reducir el desperdicio de alimentos, y cómo crear platos deliciosos mientras se respeta el medio ambiente. También habrá presentaciones de productores locales que compartirán sus métodos de cultivo sostenible. Esta es una oportunidad perfecta para conocer personas con intereses similares, aprender sobre alimentación responsable, y disfrutar de una experiencia culinaria única. El restaurante está certificado como sostenible y utiliza prácticas de cero desperdicio, energía renovable, y materiales compostables.",
    description_en: "Join our special community dinner where we celebrate sustainable eating with a complete menu prepared exclusively with local, organic, and seasonal ingredients. During this 3-hour evening at London's Green Restaurant, you'll enjoy a 4-course menu designed by chefs specialized in sustainable cuisine. Each dish tells the story of its ingredients: which farm they come from, how they were grown, and the positive impact of choosing local and organic products. The dinner includes a talk from the chef about sustainable cooking techniques, how to reduce food waste, and how to create delicious dishes while respecting the environment. There will also be presentations from local producers who will share their sustainable growing methods. This is a perfect opportunity to meet people with similar interests, learn about responsible eating, and enjoy a unique culinary experience. The restaurant is certified as sustainable and uses zero-waste practices, renewable energy, and compostable materials.",
    description_de: "Schließen Sie sich unserem besonderen Gemeinschaftsessen an, bei dem wir nachhaltiges Essen mit einem vollständigen Menü feiern, das ausschließlich mit lokalen, biologischen und saisonalen Zutaten zubereitet wird. Während dieses 3-stündigen Abends im Green Restaurant in London genießen Sie ein 4-Gänge-Menü, das von auf nachhaltige Küche spezialisierten Köchen entworfen wurde. Jedes Gericht erzählt die Geschichte seiner Zutaten: von welcher Farm sie stammen, wie sie angebaut wurden und die positive Auswirkung der Wahl lokaler und biologischer Produkte. Das Abendessen umfasst einen Vortrag des Kochs über nachhaltige Kochtechniken, wie man Lebensmittelverschwendung reduziert und wie man köstliche Gerichte kreiert, während man die Umwelt respektiert. Es wird auch Präsentationen von lokalen Produzenten geben, die ihre nachhaltigen Anbaumethoden teilen. Dies ist eine perfekte Gelegenheit, Menschen mit ähnlichen Interessen kennenzulernen, etwas über verantwortungsvolles Essen zu lernen und ein einzigartiges kulinarisches Erlebnis zu genießen. Das Restaurant ist als nachhaltig zertifiziert und verwendet Zero-Waste-Praktiken, erneuerbare Energien und kompostierbare Materialien.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.sustainabledining.org",
    date: "2025-03-22",
    time: "19:00",
    duration: 3,
    location: "Restaurante Verde, Londres",
    location_en: "Green Restaurant, London",
    location_de: "Grünes Restaurant, London",
    organizer: "Sustainable Dining",
    organizer_en: "Sustainable Dining",
    organizer_de: "Nachhaltiges Essen",
    category: "community",
    maxVolunteers: 80,
    currentVolunteers: 65,
    requirements: ["Registro previo obligatorio (plazas limitadas)", "Contribución voluntaria sugerida (cubre costos de ingredientes)", "Ropa cómoda y apropiada para restaurante", "Apetito y curiosidad por comida sostenible", "Disponibilidad para una cena de 3 horas", "Informar sobre alergias alimentarias al registrarse"],
    requirements_en: ["Mandatory prior registration (limited spots)", "Suggested voluntary contribution (covers ingredient costs)", "Comfortable and appropriate clothes for restaurant", "Appetite and curiosity for sustainable food", "Availability for a 3-hour dinner", "Inform about food allergies when registering"],
    requirements_de: ["Verbindliche Voranmeldung (begrenzte Plätze)", "Vorgeschlagener freiwilliger Beitrag (deckt Zutatenkosten)", "Bequeme und angemessene Kleidung für Restaurant", "Appetit und Neugier auf nachhaltiges Essen", "Verfügbarkeit für ein 3-stündiges Abendessen", "Informationen über Nahrungsmittelallergien bei der Anmeldung"],
    benefits: ["Cena completa de 4 platos con ingredientes locales y orgánicos", "Recetario completo de cocina sostenible en formato digital", "Charla exclusiva del chef sobre técnicas sostenibles", "Red de contactos con productores locales y otros participantes", "Certificado de participación", "Descuento del 15% en futuras cenas del restaurante", "Acceso a lista de productores locales recomendados", "Material educativo sobre alimentación sostenible"],
    benefits_en: ["Complete 4-course dinner with local and organic ingredients", "Complete sustainable cooking recipe book in digital format", "Exclusive chef talk on sustainable techniques", "Contact network with local producers and other participants", "Participation certificate", "15% discount on future restaurant dinners", "Access to list of recommended local producers", "Educational material on sustainable eating"],
    benefits_de: ["Vollständiges 4-Gänge-Abendessen mit lokalen und biologischen Zutaten", "Vollständiges nachhaltiges Kochrezeptbuch im digitalen Format", "Exklusiver Kochvortrag über nachhaltige Techniken", "Kontaktnetzwerk mit lokalen Produzenten und anderen Teilnehmern", "Teilnahmezertifikat", "15% Rabatt auf zukünftige Restaurant-Abendessen", "Zugang zur Liste empfohlener lokaler Produzenten", "Bildungsmaterial über nachhaltiges Essen"],
    contact: "cena@sustainable.es"
  },
  "e5g": {
    id: "e5g",
    title: "Monitoreo de biodiversidad",
    title_en: "Biodiversity Monitoring",
    title_de: "Biodiversitätsüberwachung",
    description: "Conviértete en un científico ciudadano y participa en el monitoreo científico de especies en nuestra reserva natural de Berlín. Durante esta sesión de campo de 4 horas que comienza al amanecer (7:00 AM), trabajarás junto a biólogos profesionales para identificar, contar y registrar diferentes especies de aves, mamíferos, insectos y plantas. Aprenderás técnicas de observación científica, cómo usar guías de identificación de especies, métodos de muestreo estándar, y cómo registrar datos de manera precisa y sistemática. Los datos que recopiles contribuirán directamente a estudios científicos sobre la salud del ecosistema, cambios poblacionales, y el impacto de factores ambientales en la biodiversidad. También aprenderás sobre la importancia de cada especie en el ecosistema, cómo interpretar los datos de monitoreo, y cómo estos estudios informan las decisiones de conservación. Esta es una oportunidad única para contribuir a la ciencia real mientras aprendes sobre la increíble diversidad de vida en la reserva natural. La sesión incluye una introducción teórica, trabajo de campo práctico, y una sesión de análisis de datos al finalizar.",
    description_en: "Become a citizen scientist and participate in the scientific monitoring of species at our nature reserve in Berlin. During this 4-hour field session starting at dawn (7:00 AM), you'll work alongside professional biologists to identify, count, and record different species of birds, mammals, insects, and plants. You'll learn scientific observation techniques, how to use species identification guides, standard sampling methods, and how to record data accurately and systematically. The data you collect will directly contribute to scientific studies on ecosystem health, population changes, and the impact of environmental factors on biodiversity. You'll also learn about the importance of each species in the ecosystem, how to interpret monitoring data, and how these studies inform conservation decisions. This is a unique opportunity to contribute to real science while learning about the incredible diversity of life in the nature reserve. The session includes a theoretical introduction, practical field work, and a data analysis session at the end.",
    description_de: "Werden Sie ein Bürgerwissenschaftler und nehmen Sie an der wissenschaftlichen Überwachung von Arten in unserem Naturschutzgebiet in Berlin teil. Während dieser 4-stündigen Feldsitzung, die bei Tagesanbruch (7:00 Uhr) beginnt, arbeiten Sie zusammen mit professionellen Biologen, um verschiedene Arten von Vögeln, Säugetieren, Insekten und Pflanzen zu identifizieren, zu zählen und aufzuzeichnen. Sie lernen wissenschaftliche Beobachtungstechniken, wie man Artenidentifikationsführer verwendet, Standard-Stichprobenmethoden und wie man Daten genau und systematisch aufzeichnet. Die von Ihnen gesammelten Daten tragen direkt zu wissenschaftlichen Studien über die Gesundheit des Ökosystems, Populationsänderungen und die Auswirkungen von Umweltfaktoren auf die Biodiversität bei. Sie lernen auch die Bedeutung jeder Art im Ökosystem, wie man Überwachungsdaten interpretiert und wie diese Studien Naturschutzentscheidungen informieren. Dies ist eine einzigartige Gelegenheit, zur echten Wissenschaft beizutragen und gleichzeitig etwas über die unglaubliche Vielfalt des Lebens im Naturschutzgebiet zu lernen. Die Sitzung umfasst eine theoretische Einführung, praktische Feldarbeit und eine Datenanalysesitzung am Ende.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.greenbiodiversity.org",
    date: "2025-03-28",
    time: "07:00",
    duration: 4,
    location: "Reserva Natural, Berlín",
    location_en: "Nature Reserve, Berlin",
    location_de: "Naturschutzgebiet, Berlin",
    organizer: "Green Biodiversity",
    organizer_en: "Green Biodiversity",
    organizer_de: "Grüne Biodiversität",
    category: "environment",
    maxVolunteers: 15,
    currentVolunteers: 12,
    requirements: ["Binoculares (proporcionamos algunos si no tienes)", "Cuaderno de campo o dispositivo para tomar notas", "Ropa cómoda y resistente al agua", "Calzado adecuado para caminar en terreno natural", "Botella de agua y snack ligero", "Ropa de abrigo (temprano en la mañana puede hacer frío)", "Disponibilidad para caminar durante varias horas", "Interés en ciencia y naturaleza"],
    requirements_en: ["Binoculars (we provide some if you don't have them)", "Field notebook or device for taking notes", "Comfortable and waterproof clothes", "Appropriate footwear for walking on natural terrain", "Water bottle and light snack", "Warm clothing (early morning can be cold)", "Availability to walk for several hours", "Interest in science and nature"],
    requirements_de: ["Fernglas (wir stellen einige zur Verfügung, wenn Sie keine haben)", "Feldnotizbuch oder Gerät zum Mitschreiben", "Bequeme und wasserdichte Kleidung", "Angemessenes Schuhwerk zum Gehen auf natürlichem Gelände", "Wasserflasche und leichter Snack", "Warme Kleidung (früh morgens kann es kalt sein)", "Verfügbarkeit zum Gehen für mehrere Stunden", "Interesse an Wissenschaft und Natur"],
    benefits: ["Guía completa de especies de la reserva natural", "Certificado de científico ciudadano", "Acceso VIP a futuras actividades de la reserva", "Acceso a datos científicos recopilados durante la sesión", "Material educativo sobre biodiversidad y conservación", "Descuento en equipos de observación (binoculares, guías)", "Acceso a comunidad online de monitoreo de biodiversidad", "Oportunidad de participar en estudios científicos futuros"],
    benefits_en: ["Complete guide to species of the nature reserve", "Citizen scientist certificate", "VIP access to future reserve activities", "Access to scientific data collected during the session", "Educational material on biodiversity and conservation", "Discount on observation equipment (binoculars, guides)", "Access to online biodiversity monitoring community", "Opportunity to participate in future scientific studies"],
    benefits_de: ["Vollständiger Leitfaden zu Arten des Naturschutzgebiets", "Bürgerwissenschaftler-Zertifikat", "VIP-Zugang zu zukünftigen Reservatsaktivitäten", "Zugang zu wissenschaftlichen Daten, die während der Sitzung gesammelt wurden", "Bildungsmaterial über Biodiversität und Naturschutz", "Rabatt auf Beobachtungsausrüstung (Ferngläser, Führer)", "Zugang zur Online-Community für Biodiversitätsüberwachung", "Gelegenheit zur Teilnahme an zukünftigen wissenschaftlichen Studien"],
    contact: "biodiversidad@green.es"
  },
  "e26b": {
    id: "e26b",
    title: "Siembra urbana comunitaria",
    title_en: "Community Urban Seeding",
    title_de: "Gemeinschaftliche urbane Aussaat",
    description: "Únete a nuestra jornada de siembra comunitaria en el Huerto Urbano de Barcelona, donde trabajaremos juntos para cultivar hortalizas y plantas que fortalecerán la agricultura urbana local. Durante esta actividad práctica de 3 horas, aprenderás técnicas de siembra adecuadas para diferentes tipos de vegetales y hierbas, cómo preparar el suelo urbano, espaciado correcto de semillas, y métodos de riego eficientes. Trabajaremos con especies adaptadas al clima mediterráneo y al entorno urbano, incluyendo tomates, lechugas, zanahorias, hierbas aromáticas, y plantas de temporada. Aprenderás sobre la importancia de la agricultura urbana para la seguridad alimentaria local, cómo los huertos comunitarios fortalecen los lazos sociales, y cómo puedes aplicar estas técnicas en tu propio espacio. También exploraremos temas de rotación de cultivos, asociación de plantas beneficiosas, y métodos orgánicos de fertilización. Al finalizar, habrás contribuido a crear un huerto productivo y recibirás semillas para comenzar tu propio proyecto de agricultura urbana.",
    description_en: "Join our community seeding day at Barcelona's Urban Garden, where we'll work together to grow vegetables and plants that will strengthen local urban agriculture. During this 3-hour practical activity, you'll learn proper seeding techniques for different types of vegetables and herbs, how to prepare urban soil, correct seed spacing, and efficient irrigation methods. We'll work with species adapted to the Mediterranean climate and urban environment, including tomatoes, lettuces, carrots, aromatic herbs, and seasonal plants. You'll learn about the importance of urban agriculture for local food security, how community gardens strengthen social bonds, and how you can apply these techniques in your own space. We'll also explore topics of crop rotation, beneficial plant association, and organic fertilization methods. At the end, you'll have contributed to creating a productive garden and receive seeds to start your own urban agriculture project.",
    description_de: "Schließen Sie sich unserem Gemeinschaftsaussaattag im Urbanen Garten von Barcelona an, wo wir zusammenarbeiten, um Gemüse und Pflanzen anzubauen, die die lokale urbane Landwirtschaft stärken werden. Während dieser 3-stündigen praktischen Aktivität lernen Sie geeignete Aussaattechniken für verschiedene Arten von Gemüse und Kräutern, wie man städtischen Boden vorbereitet, korrekten Samenabstand und effiziente Bewässerungsmethoden. Wir arbeiten mit Arten, die an das mediterrane Klima und die städtische Umgebung angepasst sind, einschließlich Tomaten, Salaten, Karotten, aromatischen Kräutern und saisonalen Pflanzen. Sie lernen die Bedeutung der urbanen Landwirtschaft für die lokale Ernährungssicherheit, wie Gemeinschaftsgärten soziale Bindungen stärken und wie Sie diese Techniken in Ihrem eigenen Raum anwenden können. Wir werden auch Themen wie Fruchtfolge, vorteilhafte Pflanzenverband und organische Düngemethoden erkunden. Am Ende haben Sie zur Schaffung eines produktiven Gartens beigetragen und erhalten Samen, um Ihr eigenes Projekt der urbanen Landwirtschaft zu beginnen.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.livinggardens.org",
    date: "2025-11-01",
    time: "10:00",
    duration: 3,
    location: "Huerto Urbano, Barcelona",
    location_en: "Urban Garden, Barcelona",
    location_de: "Urbaner Garten, Barcelona",
    organizer: "Living Gardens",
    organizer_en: "Living Gardens",
    organizer_de: "Lebendige Gärten",
    category: "environment",
    maxVolunteers: 25,
    minVolunteers: 8,
    currentVolunteers: 17,
    requirements: ["Ropa cómoda que pueda ensuciarse", "Guantes de jardinería", "Botella de agua reutilizable", "Calzado cerrado y resistente", "Sombrero y protector solar (si hace sol)", "Interés en agricultura urbana", "Disponibilidad para trabajar al aire libre durante 3 horas"],
    requirements_en: ["Comfortable clothes that can get dirty", "Gardening gloves", "Reusable water bottle", "Closed and sturdy footwear", "Hat and sunscreen (if sunny)", "Interest in urban agriculture", "Availability to work outdoors for 3 hours"],
    requirements_de: ["Bequeme Kleidung, die schmutzig werden kann", "Gartenhandschuhe", "Wiederverwendbare Wasserflasche", "Geschlossenes und robustes Schuhwerk", "Hut und Sonnencreme (wenn sonnig)", "Interesse an urbaner Landwirtschaft", "Verfügbarkeit für Arbeiten im Freien für 3 Stunden"],
    benefits: ["Kit completo de semillas variadas para llevar a casa", "Manual completo de cultivo urbano con técnicas y consejos", "Certificado de participación en agricultura urbana", "Acceso a recursos online sobre agricultura urbana", "Seguimiento durante 3 meses para resolver dudas", "Acceso a comunidad de agricultores urbanos", "Descuentos en suministros de jardinería", "Oportunidad de participar en futuras actividades del huerto"],
    benefits_en: ["Complete kit of varied seeds to take home", "Complete urban cultivation manual with techniques and tips", "Urban agriculture participation certificate", "Access to online resources on urban agriculture", "Follow-up for 3 months to resolve questions", "Access to urban farmer community", "Discounts on gardening supplies", "Opportunity to participate in future garden activities"],
    benefits_de: ["Vollständiges Kit mit verschiedenen Samen zum Mitnehmen", "Vollständiges Handbuch für städtischen Anbau mit Techniken und Tipps", "Teilnahmezertifikat für urbane Landwirtschaft", "Zugang zu Online-Ressourcen über urbane Landwirtschaft", "Nachbetreuung für 3 Monate zur Beantwortung von Fragen", "Zugang zur Gemeinschaft städtischer Landwirte", "Rabatte auf Gartensupplies", "Gelegenheit zur Teilnahme an zukünftigen Gartenaktivitäten"],
    contact: "siembra@living.es"
  },
  "e26c": {
    id: "e26c",
    title: "Intercambio de libros verdes",
    title_en: "Green Book Swap",
    title_de: "Grüner Büchertausch",
    description: "Únete a nuestro evento comunitario de intercambio de libros enfocado en sostenibilidad, medio ambiente, ecología y temas relacionados. Durante 2 horas en la Biblioteca Central de Londres, podrás intercambiar libros que ya hayas leído por otros que te interesen, promoviendo así la reutilización y el acceso al conocimiento ambiental. El evento incluye una zona de intercambio organizada por categorías (cambio climático, agricultura sostenible, vida ecológica, energía renovable, etc.), charlas breves de participantes sobre sus libros favoritos, y una sesión de recomendaciones donde compartiremos títulos destacados. También habrá un espacio para libros infantiles sobre medio ambiente, perfecto para familias. Aprenderás sobre nuevos autores y títulos relevantes, conocerás a otras personas interesadas en sostenibilidad, y contribuirás a reducir el desperdicio promoviendo la reutilización de libros. Los libros que no encuentren intercambio serán donados a bibliotecas comunitarias. Esta es una oportunidad perfecta para descubrir nuevas perspectivas sobre sostenibilidad mientras reduces tu impacto ambiental.",
    description_en: "Join our community book swap event focused on sustainability, environment, ecology, and related topics. During 2 hours at London's Central Library, you can swap books you've already read for others that interest you, thus promoting reuse and access to environmental knowledge. The event includes an organized swap area by categories (climate change, sustainable agriculture, ecological living, renewable energy, etc.), brief talks from participants about their favorite books, and a recommendations session where we'll share standout titles. There will also be a space for children's books about the environment, perfect for families. You'll learn about new authors and relevant titles, meet other people interested in sustainability, and contribute to reducing waste by promoting book reuse. Books that don't find a swap will be donated to community libraries. This is a perfect opportunity to discover new perspectives on sustainability while reducing your environmental impact.",
    description_de: "Schließen Sie sich unserem Gemeinschaftsbuchtausch-Event an, das sich auf Nachhaltigkeit, Umwelt, Ökologie und verwandte Themen konzentriert. Während 2 Stunden in der Zentralbibliothek von London können Sie bereits gelesene Bücher gegen andere tauschen, die Sie interessieren, und so Wiederverwendung und Zugang zu Umweltwissen fördern. Die Veranstaltung umfasst einen organisierten Tauschbereich nach Kategorien (Klimawandel, nachhaltige Landwirtschaft, ökologisches Leben, erneuerbare Energien usw.), kurze Gespräche von Teilnehmern über ihre Lieblingsbücher und eine Empfehlungssitzung, in der wir herausragende Titel teilen. Es wird auch einen Raum für Kinderbücher über die Umwelt geben, perfekt für Familien. Sie lernen neue Autoren und relevante Titel kennen, treffen andere Menschen, die sich für Nachhaltigkeit interessieren, und tragen zur Abfallreduzierung bei, indem Sie die Wiederverwendung von Büchern fördern. Bücher, die keinen Tausch finden, werden an Gemeindebibliotheken gespendet. Dies ist eine perfekte Gelegenheit, neue Perspektiven zur Nachhaltigkeit zu entdecken und gleichzeitig Ihre Umweltauswirkungen zu reduzieren.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.sustainablereads.org",
    date: "2025-11-04",
    time: "17:00",
    duration: 2,
    location: "Biblioteca Central, Londres",
    location_en: "Central Library, London",
    location_de: "Zentralbibliothek, London",
    organizer: "Sustainable Reads",
    organizer_en: "Sustainable Reads",
    organizer_de: "Nachhaltige Lektüren",
    category: "community",
    maxVolunteers: 40,
    minVolunteers: 12,
    currentVolunteers: 22,
    requirements: ["Libros en buen estado sobre sostenibilidad, medio ambiente o ecología para intercambiar (mínimo 2-3 libros)", "Bolsa o mochila para llevar libros nuevos", "Interés en lectura sobre sostenibilidad", "Disponibilidad para sesión de 2 horas"],
    requirements_en: ["Books in good condition about sustainability, environment or ecology to swap (minimum 2-3 books)", "Bag or backpack to carry new books", "Interest in reading about sustainability", "Availability for 2-hour session"],
    requirements_de: ["Bücher in gutem Zustand über Nachhaltigkeit, Umwelt oder Ökologie zum Tauschen (mindestens 2-3 Bücher)", "Tasche oder Rucksack zum Tragen neuer Bücher", "Interesse am Lesen über Nachhaltigkeit", "Verfügbarkeit für 2-stündige Sitzung"],
    benefits: ["Nuevos libros sobre sostenibilidad para tu biblioteca", "Red de contactos con otros lectores interesados en medio ambiente", "Certificado de participación", "Lista de recomendaciones de libros destacados", "Acceso a comunidad online de lectores verdes", "Descuentos en librerías especializadas en sostenibilidad", "Oportunidad de participar en futuros intercambios", "Material informativo sobre autores y títulos relevantes"],
    benefits_en: ["New books about sustainability for your library", "Contact network with other readers interested in the environment", "Participation certificate", "List of recommendations of standout books", "Access to online community of green readers", "Discounts at bookstores specialized in sustainability", "Opportunity to participate in future swaps", "Informative material about relevant authors and titles"],
    benefits_de: ["Neue Bücher über Nachhaltigkeit für Ihre Bibliothek", "Kontaktnetzwerk mit anderen Lesern, die sich für die Umwelt interessieren", "Teilnahmezertifikat", "Liste von Empfehlungen herausragender Bücher", "Zugang zur Online-Community grüner Leser", "Rabatte in Buchhandlungen, die auf Nachhaltigkeit spezialisiert sind", "Gelegenheit zur Teilnahme an zukünftigen Tauschen", "Informatives Material über relevante Autoren und Titel"],
    contact: "libros@sustainable.es"
  },
  "e26d": {
    id: "e26d",
    title: "Charla de eficiencia energética",
    title_en: "Energy Efficiency Talk",
    title_de: "Energieeffizienz‑Vortrag",
    description: "Descubre cómo reducir significativamente tu consumo de energía y ahorrar dinero mientras proteges el medio ambiente en esta charla educativa de 2 horas sobre eficiencia energética. Aprenderás técnicas prácticas y estrategias probadas para reducir el consumo energético en el hogar y la oficina sin sacrificar comodidad. Exploraremos temas como aislamiento térmico eficiente, sistemas de calefacción y refrigeración optimizados, iluminación LED y sistemas inteligentes, electrodomésticos eficientes, y cómo leer e interpretar tus facturas de energía. También cubriremos tecnologías emergentes como termostatos inteligentes, sistemas de gestión energética doméstica, y cómo aprovechar las tarifas de energía para maximizar el ahorro. Los expertos compartirán casos de estudio reales de ahorros logrados, responderán preguntas específicas sobre tu situación, y te ayudarán a crear un plan personalizado de eficiencia energética. Aprenderás sobre subvenciones y ayudas disponibles para mejoras energéticas, cómo calcular el retorno de inversión de diferentes mejoras, y cómo pequeños cambios pueden generar grandes ahorros a largo plazo.",
    description_en: "Discover how to significantly reduce your energy consumption and save money while protecting the environment in this 2-hour educational talk on energy efficiency. You'll learn practical techniques and proven strategies to reduce energy consumption at home and office without sacrificing comfort. We'll explore topics like efficient thermal insulation, optimized heating and cooling systems, LED lighting and smart systems, efficient appliances, and how to read and interpret your energy bills. We'll also cover emerging technologies like smart thermostats, home energy management systems, and how to take advantage of energy tariffs to maximize savings. Experts will share real case studies of achieved savings, answer specific questions about your situation, and help you create a personalized energy efficiency plan. You'll learn about available grants and subsidies for energy improvements, how to calculate return on investment for different improvements, and how small changes can generate large long-term savings.",
    description_de: "Entdecken Sie, wie Sie Ihren Energieverbrauch erheblich reduzieren und Geld sparen können, während Sie die Umwelt schützen, in diesem 2-stündigen Bildungsvortrag über Energieeffizienz. Sie lernen praktische Techniken und bewährte Strategien zur Reduzierung des Energieverbrauchs zu Hause und im Büro kennen, ohne Komfort zu opfern. Wir werden Themen wie effiziente Wärmedämmung, optimierte Heiz- und Kühlsysteme, LED-Beleuchtung und intelligente Systeme, effiziente Geräte und wie man Ihre Energierechnungen liest und interpretiert, erkunden. Wir werden auch aufkommende Technologien wie intelligente Thermostate, Hausenergiemanagementsysteme und wie man Energietarife nutzt, um Einsparungen zu maximieren, behandeln. Experten teilen echte Fallstudien erzielter Einsparungen, beantworten spezifische Fragen zu Ihrer Situation und helfen Ihnen, einen personalisierten Energieeffizienzplan zu erstellen. Sie lernen verfügbare Zuschüsse und Subventionen für Energieverbesserungen kennen, wie Sie die Rendite verschiedener Verbesserungen berechnen und wie kleine Änderungen langfristig große Einsparungen generieren können.",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    website: "https://www.efficiency360.org",
    date: "2025-11-06",
    time: "18:30",
    duration: 2,
    location: "Ayuntamiento, Milán",
    location_en: "City Hall, Milan",
    location_de: "Rathaus, Mailand",
    organizer: "Efficiency 360",
    organizer_en: "Efficiency 360",
    organizer_de: "Effizienz 360",
    category: "education",
    maxVolunteers: 60,
    minVolunteers: 20,
    currentVolunteers: 41,
    requirements: ["Registro previo obligatorio (plazas limitadas)", "Cuaderno o dispositivo para tomar notas", "Interés en reducir consumo energético y ahorrar dinero", "Traer una factura de energía reciente (opcional, para análisis personalizado)", "Disponibilidad para sesión de 2 horas"],
    requirements_en: ["Mandatory prior registration (limited spots)", "Notebook or device for taking notes", "Interest in reducing energy consumption and saving money", "Bring a recent energy bill (optional, for personalized analysis)", "Availability for 2-hour session"],
    requirements_de: ["Verbindliche Voranmeldung (begrenzte Plätze)", "Notizbuch oder Gerät zum Mitschreiben", "Interesse an Reduzierung des Energieverbrauchs und Geldsparen", "Bringen Sie eine aktuelle Energierechnung mit (optional, für personalisierte Analyse)", "Verfügbarkeit für 2-stündige Sitzung"],
    benefits: ["Guía completa de eficiencia energética en formato digital", "Certificado de participación", "Calculadora energética online para evaluar tu hogar", "Lista de proveedores y productos eficientes recomendados", "Información sobre subvenciones y ayudas disponibles", "Acceso a recursos online adicionales", "Descuentos en productos de eficiencia energética", "Sesión de seguimiento online después de 1 mes"],
    benefits_en: ["Complete energy efficiency guide in digital format", "Participation certificate", "Online energy calculator to evaluate your home", "List of recommended efficient suppliers and products", "Information on available grants and subsidies", "Access to additional online resources", "Discounts on energy efficiency products", "Online follow-up session after 1 month"],
    benefits_de: ["Vollständiger Energieeffizienzführer im digitalen Format", "Teilnahmezertifikat", "Online-Energierechner zur Bewertung Ihres Hauses", "Liste empfohlener effizienter Lieferanten und Produkte", "Informationen über verfügbare Zuschüsse und Subventionen", "Zugang zu zusätzlichen Online-Ressourcen", "Rabatte auf Energieeffizienzprodukte", "Online-Nachbetreuungssitzung nach 1 Monat"],
    contact: "eficiencia@360.es"
  },
  "e26e": {
    id: "e26e",
    title: "Taller de compost rápido",
    title_en: "Quick Compost Workshop",
    title_de: "Schnell‑Kompost Workshop",
    description: "Aprende técnicas avanzadas de compostaje rápido que te permitirán convertir residuos orgánicos en compost rico en nutrientes en solo 2-4 semanas, en lugar de los 3-6 meses tradicionales. Durante este taller práctico de 2 horas en el Centro Verde de Madrid, aprenderás métodos específicos como compostaje en caliente, técnicas de volteo acelerado, uso de activadores naturales, y cómo mantener las condiciones óptimas de temperatura, humedad y aireación. Exploraremos diferentes sistemas de compostaje rápido adecuados para espacios urbanos, incluyendo compostadores giratorios, sistemas de doble cámara, y métodos de compostaje en capas. Aprenderás qué materiales aceleran el proceso, cómo triturar y preparar materiales para una descomposición más rápida, y cómo identificar y resolver problemas comunes. También cubriremos cómo usar el compost terminado, cómo almacenarlo adecuadamente, y cómo integrar el compostaje rápido en tu rutina diaria. Al finalizar, tendrás los conocimientos y materiales para comenzar tu propio sistema de compostaje rápido y reducir significativamente tus residuos orgánicos.",
    description_en: "Learn advanced rapid composting techniques that will allow you to convert organic waste into nutrient-rich compost in just 2-4 weeks, instead of the traditional 3-6 months. During this 2-hour practical workshop at Madrid's Green Center, you'll learn specific methods like hot composting, accelerated turning techniques, use of natural activators, and how to maintain optimal conditions of temperature, moisture, and aeration. We'll explore different rapid composting systems suitable for urban spaces, including rotating composters, dual-chamber systems, and layered composting methods. You'll learn which materials accelerate the process, how to shred and prepare materials for faster decomposition, and how to identify and solve common problems. We'll also cover how to use finished compost, how to store it properly, and how to integrate rapid composting into your daily routine. At the end, you'll have the knowledge and materials to start your own rapid composting system and significantly reduce your organic waste.",
    description_de: "Lernen Sie fortgeschrittene Schnellkompostierungstechniken, die es Ihnen ermöglichen, organische Abfälle in nur 2-4 Wochen in nährstoffreichen Kompost umzuwandeln, anstatt der traditionellen 3-6 Monate. In diesem 2-stündigen praktischen Workshop im Grünen Zentrum von Madrid lernen Sie spezifische Methoden wie Heißkompostierung, beschleunigte Wendetechniken, Verwendung natürlicher Aktivatorn und wie Sie optimale Bedingungen für Temperatur, Feuchtigkeit und Belüftung aufrechterhalten. Wir werden verschiedene Schnellkompostierungssysteme erkunden, die für städtische Räume geeignet sind, einschließlich rotierender Komposter, Zwei-Kammer-Systeme und geschichtete Kompostierungsmethoden. Sie lernen, welche Materialien den Prozess beschleunigen, wie man Materialien zerkleinert und für schnellere Zersetzung vorbereitet und wie man häufige Probleme identifiziert und löst. Wir werden auch behandeln, wie man fertigen Kompost verwendet, wie man ihn richtig lagert und wie man Schnellkompostierung in Ihre tägliche Routine integriert. Am Ende haben Sie das Wissen und die Materialien, um Ihr eigenes Schnellkompostierungssystem zu starten und Ihre organischen Abfälle erheblich zu reduzieren.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.compostmasters.org",
    date: "2025-11-09",
    time: "09:30",
    duration: 2,
    location: "Centro Verde, Madrid",
    location_en: "Green Center, Madrid",
    location_de: "Grünes Zentrum, Madrid",
    organizer: "Compost Masters",
    organizer_en: "Compost Masters",
    organizer_de: "Kompost‑Meister",
    category: "education",
    maxVolunteers: 20,
    minVolunteers: 6,
    currentVolunteers: 14,
    requirements: ["Materiales orgánicos de cocina para practicar (opcional, proporcionamos algunos)", "Cuaderno para tomar notas", "Ropa cómoda que pueda ensuciarse", "Guantes (opcional)", "Interés en reducir residuos orgánicos", "Disponibilidad para sesión práctica de 2 horas"],
    requirements_en: ["Organic kitchen materials to practice (optional, we provide some)", "Notebook for taking notes", "Comfortable clothes that can get dirty", "Gloves (optional)", "Interest in reducing organic waste", "Availability for 2-hour practical session"],
    requirements_de: ["Organische Küchenmaterialien zum Üben (optional, wir stellen einige zur Verfügung)", "Notizbuch zum Mitschreiben", "Bequeme Kleidung, die schmutzig werden kann", "Handschuhe (optional)", "Interesse an Reduzierung organischer Abfälle", "Verfügbarkeit für 2-stündige praktische Sitzung"],
    benefits: ["Kit completo de compostaje rápido para comenzar", "Manual rápido con técnicas paso a paso", "Seguimiento personalizado durante 2 meses", "Acceso a comunidad online de compostadores", "Lista de activadores naturales y dónde conseguirlos", "Guía de solución de problemas comunes", "Certificado de participación", "Descuento en equipos de compostaje avanzados"],
    benefits_en: ["Complete rapid composting kit to get started", "Quick manual with step-by-step techniques", "Personalized follow-up for 2 months", "Access to online composting community", "List of natural activators and where to get them", "Guide to solving common problems", "Participation certificate", "Discount on advanced composting equipment"],
    benefits_de: ["Vollständiges Schnellkompostierungs-Kit zum Einstieg", "Schnelles Handbuch mit Schritt-für-Schritt-Techniken", "Personalisierte Nachbetreuung für 2 Monate", "Zugang zur Online-Kompostierungs-Community", "Liste natürlicher Aktivatorn und wo man sie bekommt", "Leitfaden zur Lösung häufiger Probleme", "Teilnahmezertifikat", "Rabatt auf fortgeschrittene Kompostierungsausrüstung"],
    contact: "compost@masters.es"
  },
  "e26f": {
    id: "e26f",
    title: "Censo de aves al amanecer",
    title_en: "Dawn Bird Census",
    title_de: "Vogelzählung bei Sonnenaufgang",
    description: "Únete a nuestro censo científico de aves al amanecer en el Humedal Urbano de Berlín, una actividad esencial para monitorear la salud de las poblaciones de aves urbanas. Esta sesión de campo de 2 horas comienza temprano (6:45 AM) cuando las aves están más activas y es más fácil identificarlas por sus cantos y comportamientos. Trabajarás junto a ornitólogos profesionales para identificar, contar y registrar diferentes especies de aves, aprendiendo técnicas de observación científica, cómo usar guías de identificación, y métodos estándar de censo. Los datos que recopiles contribuirán directamente a estudios científicos sobre la biodiversidad urbana, cambios poblacionales estacionales, y el impacto de factores ambientales en las aves. Aprenderás sobre las especies comunes y raras que habitan el humedal urbano, sus comportamientos, migraciones, y cómo identificar aves por su canto, plumaje y comportamiento. También exploraremos cómo los humedales urbanos proporcionan hábitats cruciales para las aves y cómo podemos proteger estos espacios. Esta es una oportunidad única para contribuir a la ciencia ciudadana mientras disfrutas de la belleza del amanecer y aprendes sobre la increíble diversidad de aves urbanas.",
    description_en: "Join our scientific bird census at dawn at Berlin's Urban Wetland, an essential activity for monitoring the health of urban bird populations. This 2-hour field session begins early (6:45 AM) when birds are most active and easiest to identify by their songs and behaviors. You'll work alongside professional ornithologists to identify, count, and record different bird species, learning scientific observation techniques, how to use identification guides, and standard census methods. The data you collect will directly contribute to scientific studies on urban biodiversity, seasonal population changes, and the impact of environmental factors on birds. You'll learn about common and rare species that inhabit the urban wetland, their behaviors, migrations, and how to identify birds by their song, plumage, and behavior. We'll also explore how urban wetlands provide crucial habitats for birds and how we can protect these spaces. This is a unique opportunity to contribute to citizen science while enjoying the beauty of dawn and learning about the incredible diversity of urban birds.",
    description_de: "Schließen Sie sich unserer wissenschaftlichen Vogelzählung bei Sonnenaufgang im Stadtfeuchtgebiet von Berlin an, einer wesentlichen Aktivität zur Überwachung der Gesundheit städtischer Vogelpopulationen. Diese 2-stündige Feldsitzung beginnt früh (6:45 Uhr), wenn Vögel am aktivsten sind und am einfachsten an ihren Gesängen und Verhaltensweisen zu identifizieren sind. Sie arbeiten zusammen mit professionellen Ornithologen, um verschiedene Vogelarten zu identifizieren, zu zählen und aufzuzeichnen, lernen wissenschaftliche Beobachtungstechniken, wie man Identifikationsführer verwendet und Standard-Zensusmethoden. Die von Ihnen gesammelten Daten tragen direkt zu wissenschaftlichen Studien über städtische Biodiversität, saisonale Populationsänderungen und die Auswirkungen von Umweltfaktoren auf Vögel bei. Sie lernen häufige und seltene Arten kennen, die das städtische Feuchtgebiet bewohnen, ihre Verhaltensweisen, Migrationen und wie man Vögel an ihrem Gesang, Gefieder und Verhalten identifiziert. Wir werden auch erkunden, wie städtische Feuchtgebiete wichtige Lebensräume für Vögel bieten und wie wir diese Räume schützen können. Dies ist eine einzigartige Gelegenheit, zur Bürgerwissenschaft beizutragen, während Sie die Schönheit des Sonnenaufgangs genießen und etwas über die unglaubliche Vielfalt städtischer Vögel lernen.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.citybirds.org",
    date: "2025-11-12",
    time: "06:45",
    duration: 2,
    location: "Humedal Urbano, Berlín",
    location_en: "Urban Wetland, Berlin",
    location_de: "Stadtfeuchtgebiet, Berlin",
    organizer: "City Birds",
    organizer_en: "City Birds",
    organizer_de: "Stadtvögel",
    category: "environment",
    maxVolunteers: 18,
    minVolunteers: 6,
    currentVolunteers: 13,
    requirements: ["Binoculares (proporcionamos algunos si no tienes)", "Cuaderno de campo o dispositivo para tomar notas", "Ropa abrigada (temprano en la mañana hace frío)", "Calzado resistente al agua (terreno húmedo)", "Botella de agua y snack ligero", "Linterna o frontal (para llegar al punto de encuentro)", "Disponibilidad para actividad temprana al amanecer", "Interés en aves y ciencia ciudadana"],
    requirements_en: ["Binoculars (we provide some if you don't have them)", "Field notebook or device for taking notes", "Warm clothes (early morning is cold)", "Waterproof footwear (wet terrain)", "Water bottle and light snack", "Flashlight or headlamp (to reach meeting point)", "Availability for early morning activity at dawn", "Interest in birds and citizen science"],
    requirements_de: ["Fernglas (wir stellen einige zur Verfügung, wenn Sie keine haben)", "Feldnotizbuch oder Gerät zum Mitschreiben", "Warme Kleidung (früh morgens ist es kalt)", "Wasserdichtes Schuhwerk (nasses Gelände)", "Wasserflasche und leichter Snack", "Taschenlampe oder Stirnlampe (um den Treffpunkt zu erreichen)", "Verfügbarkeit für frühmorgendliche Aktivität bei Sonnenaufgang", "Interesse an Vögeln und Bürgerwissenschaft"],
    benefits: ["Guía completa de aves urbanas de la región", "Certificado de científico ciudadano en ornitología", "Acceso a datos del censo recopilados", "Material educativo sobre aves urbanas y conservación", "Descuento en binoculares y equipos de observación", "Acceso a comunidad online de observadores de aves", "Oportunidad de participar en futuros censos", "Información sobre cómo crear hábitats para aves en tu hogar"],
    benefits_en: ["Complete guide to urban birds of the region", "Citizen scientist certificate in ornithology", "Access to collected census data", "Educational material on urban birds and conservation", "Discount on binoculars and observation equipment", "Access to online community of bird watchers", "Opportunity to participate in future censuses", "Information on how to create bird habitats in your home"],
    benefits_de: ["Vollständiger Leitfaden zu städtischen Vögeln der Region", "Bürgerwissenschaftler-Zertifikat in Ornithologie", "Zugang zu gesammelten Zensusdaten", "Bildungsmaterial über städtische Vögel und Naturschutz", "Rabatt auf Ferngläser und Beobachtungsausrüstung", "Zugang zur Online-Community von Vogelbeobachtern", "Gelegenheit zur Teilnahme an zukünftigen Zählungen", "Informationen darüber, wie man Vogelhabitate in Ihrem Zuhause schafft"],
    contact: "aves@city.es"
  },
  "e26g": {
    id: "e26g",
    title: "Trueque de ropa sostenible",
    title_en: "Sustainable Clothes Swap",
    title_de: "Nachhaltiger Kleidertausch",
    description: "Únete a nuestro evento de intercambio de ropa más grande del año, donde podrás renovar tu guardarropa de manera sostenible mientras promueves la moda circular y reduces el desperdicio textil. Durante 4 horas en el Centro Comunitario de Londres, intercambiarás ropa en buen estado con otros participantes, dando nueva vida a prendas que ya no usas y descubriendo piezas únicas sin costo alguno. El evento incluye áreas organizadas por categorías (mujeres, hombres, niños, accesorios), un espacio de styling donde aprenderás a combinar prendas de segunda mano, charlas sobre moda sostenible y el impacto ambiental de la industria textil, y talleres rápidos sobre reparación y upcycling de ropa. También habrá una zona de donación para prendas que no encuentren intercambio, que serán donadas a organizaciones benéficas locales. Aprenderás sobre la importancia de extender la vida útil de la ropa, cómo identificar prendas de calidad, y cómo construir un guardarropa sostenible. Esta es una oportunidad perfecta para refrescar tu estilo, conocer personas con valores similares, y contribuir activamente a reducir el desperdicio textil que es uno de los mayores problemas ambientales de la industria de la moda.",
    description_en: "Join our largest clothes swap event of the year, where you can refresh your wardrobe sustainably while promoting circular fashion and reducing textile waste. During 4 hours at London's Community Center, you'll swap clothes in good condition with other participants, giving new life to clothes you no longer wear and discovering unique pieces at no cost. The event includes areas organized by categories (women, men, children, accessories), a styling space where you'll learn to combine second-hand pieces, talks on sustainable fashion and the environmental impact of the textile industry, and quick workshops on clothing repair and upcycling. There will also be a donation area for clothes that don't find a swap, which will be donated to local charities. You'll learn about the importance of extending clothing lifespan, how to identify quality pieces, and how to build a sustainable wardrobe. This is a perfect opportunity to refresh your style, meet people with similar values, and actively contribute to reducing textile waste, which is one of the biggest environmental problems in the fashion industry.",
    description_de: "Schließen Sie sich unserem größten Kleidertausch-Event des Jahres an, wo Sie Ihre Garderobe nachhaltig auffrischen können, während Sie zirkuläre Mode fördern und Textilabfälle reduzieren. Während 4 Stunden im Gemeindezentrum von London tauschen Sie Kleidung in gutem Zustand mit anderen Teilnehmern, geben Kleidung, die Sie nicht mehr tragen, neues Leben und entdecken einzigartige Stücke ohne Kosten. Die Veranstaltung umfasst Bereiche, die nach Kategorien organisiert sind (Frauen, Männer, Kinder, Accessoires), einen Styling-Bereich, in dem Sie lernen, Second-Hand-Stücke zu kombinieren, Vorträge über nachhaltige Mode und die Umweltauswirkungen der Textilindustrie sowie kurze Workshops zur Kleidungsreparatur und zum Upcycling. Es wird auch einen Spendenbereich für Kleidung geben, die keinen Tausch findet und an lokale Wohltätigkeitsorganisationen gespendet wird. Sie lernen die Bedeutung der Verlängerung der Kleidungslebensdauer, wie man Qualitätsstücke identifiziert und wie man eine nachhaltige Garderobe aufbaut. Dies ist eine perfekte Gelegenheit, Ihren Stil aufzufrischen, Menschen mit ähnlichen Werten zu treffen und aktiv zur Reduzierung von Textilabfällen beizutragen, was eines der größten Umweltprobleme in der Modeindustrie ist.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.circularcloset.org",
    date: "2025-11-16",
    time: "11:00",
    duration: 4,
    location: "Centro Comunitario, Londres",
    location_en: "Community Center, London",
    location_de: "Gemeindezentrum, London",
    organizer: "Circular Closet",
    organizer_en: "Circular Closet",
    organizer_de: "Zirkulärer Kleiderschrank",
    category: "community",
    maxVolunteers: 100,
    minVolunteers: 30,
    currentVolunteers: 68,
    requirements: ["Ropa en buen estado, limpia y sin daños para intercambiar (mínimo 5-10 prendas)", "Bolsa grande para llevar ropa nueva", "Ropa cómoda para probarse prendas", "Disponibilidad para evento de 4 horas", "Espíritu de intercambio y comunidad"],
    requirements_en: ["Clothes in good condition, clean and undamaged to swap (minimum 5-10 items)", "Large bag to carry new clothes", "Comfortable clothes to try on items", "Availability for 4-hour event", "Spirit of exchange and community"],
    requirements_de: ["Kleidung in gutem Zustand, sauber und unbeschädigt zum Tauschen (mindestens 5-10 Stücke)", "Große Tasche zum Tragen neuer Kleidung", "Bequeme Kleidung zum Anprobieren von Stücken", "Verfügbarkeit für 4-stündige Veranstaltung", "Geist des Austauschs und der Gemeinschaft"],
    benefits: ["Nueva ropa sin costo para tu guardarropa", "Guía completa de moda circular en formato digital", "Red de contactos con otros amantes de la moda sostenible", "Talleres de styling y combinación de prendas", "Acceso a información sobre marcas sostenibles", "Certificado de participación", "Descuentos en tiendas de segunda mano asociadas", "Oportunidad de participar en futuros intercambios"],
    benefits_en: ["New clothes at no cost for your wardrobe", "Complete circular fashion guide in digital format", "Contact network with other sustainable fashion lovers", "Styling and clothing combination workshops", "Access to information on sustainable brands", "Participation certificate", "Discounts at associated second-hand stores", "Opportunity to participate in future swaps"],
    benefits_de: ["Neue Kleidung ohne Kosten für Ihre Garderobe", "Vollständiger zirkulärer Modeführer im digitalen Format", "Kontaktnetzwerk mit anderen nachhaltigen Mode-Liebhabern", "Styling- und Kleidungskombinations-Workshops", "Zugang zu Informationen über nachhaltige Marken", "Teilnahmezertifikat", "Rabatte in verbundenen Second-Hand-Läden", "Gelegenheit zur Teilnahme an zukünftigen Tauschen"],
    contact: "ropa@circular.es"
  },
  "e26h": {
    id: "e26h",
    title: "Taller de huertos en balcones",
    title_en: "Balcony Gardening Workshop",
    title_de: "Balkongarten‑Workshop",
    description: "Descubre cómo transformar tu balcón en un huerto productivo y hermoso en este taller práctico de 2 horas en el Barrio Viejo de Barcelona. Aprenderás técnicas específicas para maximizar el espacio limitado de un balcón, incluyendo jardinería vertical, uso de contenedores apilables, sistemas de riego por goteo automatizados, y cómo aprovechar cada centímetro disponible. Exploraremos qué vegetales y hierbas crecen mejor en balcones según la orientación (norte, sur, este, oeste), cómo manejar el viento y la exposición solar, y técnicas de protección contra condiciones climáticas adversas. Realizaremos actividades prácticas de preparación de contenedores, siembra de diferentes tipos de plantas, instalación de sistemas de soporte para plantas trepadoras, y diseño de un layout eficiente para tu balcón. También aprenderás sobre sustratos adecuados para contenedores, fertilización orgánica, control de plagas sin químicos, y cómo mantener tu huerto durante todo el año. Al finalizar, tendrás todo el conocimiento necesario para comenzar tu propio huerto en balcón y recibirás semillas y materiales para empezar inmediatamente.",
    description_en: "Discover how to transform your balcony into a productive and beautiful garden in this 2-hour practical workshop in Barcelona's Old Quarter. You'll learn specific techniques to maximize the limited space of a balcony, including vertical gardening, use of stackable containers, automated drip irrigation systems, and how to take advantage of every available centimeter. We'll explore which vegetables and herbs grow best on balconies according to orientation (north, south, east, west), how to handle wind and sun exposure, and techniques to protect against adverse weather conditions. We'll carry out practical activities of container preparation, sowing different types of plants, installing support systems for climbing plants, and designing an efficient layout for your balcony. You'll also learn about suitable substrates for containers, organic fertilization, pest control without chemicals, and how to maintain your garden throughout the year. At the end, you'll have all the knowledge needed to start your own balcony garden and receive seeds and materials to start immediately.",
    description_de: "Entdecken Sie, wie Sie Ihren Balkon in einen produktiven und schönen Garten verwandeln können, in diesem 2-stündigen praktischen Workshop im Altstadtviertel von Barcelona. Sie lernen spezifische Techniken, um den begrenzten Raum eines Balkons zu maximieren, einschließlich vertikaler Gartenarbeit, Verwendung stapelbarer Behälter, automatisierter Tropfbewässerungssysteme und wie Sie jeden verfügbaren Zentimeter nutzen können. Wir werden erkunden, welche Gemüse und Kräuter je nach Ausrichtung (Norden, Süden, Osten, Westen) am besten auf Balkonen wachsen, wie man mit Wind und Sonneneinstrahlung umgeht und Techniken zum Schutz vor widrigen Wetterbedingungen. Wir führen praktische Aktivitäten zur Behältervorbereitung, Aussaat verschiedener Pflanzentypen, Installation von Stützsystemen für Kletterpflanzen und Gestaltung eines effizienten Layouts für Ihren Balkon durch. Sie lernen auch geeignete Substrate für Behälter, organische Düngung, Schädlingsbekämpfung ohne Chemikalien und wie Sie Ihren Garten das ganze Jahr über pflegen. Am Ende haben Sie alle Kenntnisse, die Sie benötigen, um Ihren eigenen Balkongarten zu beginnen, und erhalten Samen und Materialien, um sofort zu beginnen.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    website: "https://www.urbangardens.org",
    date: "2025-11-22",
    time: "16:00",
    duration: 2,
    location: "Barrio Viejo, Barcelona",
    location_en: "Old Quarter, Barcelona",
    location_de: "Altstadtviertel, Barcelona",
    organizer: "Urban Gardens",
    organizer_en: "Urban Gardens",
    organizer_de: "Urbane Gärten",
    category: "education",
    maxVolunteers: 22,
    minVolunteers: 7,
    currentVolunteers: 16,
    requirements: ["Ropa cómoda que pueda ensuciarse", "Cuaderno para tomar notas", "Semillas o plantas pequeñas (opcional, proporcionamos algunas)", "Interés en cultivar alimentos en espacios pequeños", "Disponibilidad para sesión práctica de 2 horas", "Opcional: fotos de tu balcón para consejos personalizados"],
    requirements_en: ["Comfortable clothes that can get dirty", "Notebook for taking notes", "Seeds or small plants (optional, we provide some)", "Interest in growing food in small spaces", "Availability for 2-hour practical session", "Optional: photos of your balcony for personalized advice"],
    requirements_de: ["Bequeme Kleidung, die schmutzig werden kann", "Notizbuch zum Mitschreiben", "Samen oder kleine Pflanzen (optional, wir stellen einige zur Verfügung)", "Interesse am Anbau von Lebensmitteln in kleinen Räumen", "Verfügbarkeit für 2-stündige praktische Sitzung", "Optional: Fotos Ihres Balkons für personalisierte Beratung"],
    benefits: ["Kit completo de semillas adaptadas para balcones", "Manual completo de jardinería en balcón con técnicas específicas", "Seguimiento personalizado durante 3 meses", "Guía de plantas ideales para diferentes orientaciones de balcón", "Acceso a comunidad online de jardineros de balcón", "Descuentos en contenedores y materiales de jardinería", "Certificado de participación", "Oportunidad de participar en futuros talleres"],
    benefits_en: ["Complete kit of seeds adapted for balconies", "Complete balcony gardening manual with specific techniques", "Personalized follow-up for 3 months", "Guide to ideal plants for different balcony orientations", "Access to online community of balcony gardeners", "Discounts on containers and gardening materials", "Participation certificate", "Opportunity to participate in future workshops"],
    benefits_de: ["Vollständiges Kit mit Samen, die für Balkone angepasst sind", "Vollständiges Balkongarten-Handbuch mit spezifischen Techniken", "Personalisierte Nachbetreuung für 3 Monate", "Leitfaden zu idealen Pflanzen für verschiedene Balkonausrichtungen", "Zugang zur Online-Community von Balkongärtnern", "Rabatte auf Behälter und Gartenmaterialien", "Teilnahmezertifikat", "Gelegenheit zur Teilnahme an zukünftigen Workshops"],
    contact: "balcon@urban.es"
  },
  "e26i": {
    id: "e26i",
    title: "Reforestación participativa",
    title_en: "Participatory Reforestation",
    title_de: "Partizipative Aufforstung",
    description: "Únete a nuestro proyecto de reforestación participativa en el Monte Bajo de Milán, donde trabajaremos juntos para restaurar áreas degradadas y combatir el cambio climático plantando árboles nativos. Durante esta actividad de campo de 4 horas, aprenderás sobre la importancia de la reforestación para la restauración de ecosistemas, la captura de carbono, la prevención de la erosión del suelo, y la creación de hábitats para la biodiversidad. Trabajaremos con especies nativas seleccionadas específicamente para el ecosistema local, aprendiendo técnicas adecuadas de plantación, espaciado correcto, y cómo asegurar la supervivencia de los árboles jóvenes. Los expertos forestales compartirán conocimientos sobre el cuidado de los árboles plantados, cómo identificar especies nativas, y el impacto positivo a largo plazo que tendrán estos árboles en el ecosistema. Cada árbol plantado será etiquetado con tu nombre o el de un ser querido, y recibirás información sobre cómo seguir su crecimiento a lo largo de los años. También aprenderás sobre los desafíos de la reforestación, cómo los árboles contribuyen a combatir el cambio climático mediante la captura de CO2, y cómo puedes continuar apoyando proyectos de reforestación. Esta es una oportunidad única para dejar un legado verde duradero y contribuir directamente a la restauración del medio ambiente.",
    description_en: "Join our participatory reforestation project at Milan's Low Forest, where we'll work together to restore degraded areas and combat climate change by planting native trees. During this 4-hour field activity, you'll learn about the importance of reforestation for ecosystem restoration, carbon capture, soil erosion prevention, and creating habitats for biodiversity. We'll work with native species specifically selected for the local ecosystem, learning proper planting techniques, correct spacing, and how to ensure the survival of young trees. Forest experts will share knowledge about caring for planted trees, how to identify native species, and the long-term positive impact these trees will have on the ecosystem. Each planted tree will be tagged with your name or that of a loved one, and you'll receive information on how to follow its growth over the years. You'll also learn about reforestation challenges, how trees contribute to combating climate change through CO2 capture, and how you can continue supporting reforestation projects. This is a unique opportunity to leave a lasting green legacy and directly contribute to environmental restoration.",
    description_de: "Schließen Sie sich unserem partizipativen Aufforstungsprojekt im Niederwald von Mailand an, wo wir zusammenarbeiten, um degradierte Gebiete wiederherzustellen und den Klimawandel durch Pflanzung einheimischer Bäume zu bekämpfen. Während dieser 4-stündigen Feldaktivität lernen Sie die Bedeutung der Aufforstung für die Wiederherstellung von Ökosystemen, Kohlenstoffbindung, Bodenerosionsprävention und die Schaffung von Lebensräumen für die Biodiversität kennen. Wir arbeiten mit einheimischen Arten, die speziell für das lokale Ökosystem ausgewählt wurden, lernen geeignete Pflanztechniken, korrekten Abstand und wie man das Überleben junger Bäume sicherstellt. Forstexperten teilen Wissen über die Pflege gepflanzter Bäume, wie man einheimische Arten identifiziert und die langfristige positive Auswirkung, die diese Bäume auf das Ökosystem haben werden. Jeder gepflanzte Baum wird mit Ihrem Namen oder dem eines geliebten Menschen markiert, und Sie erhalten Informationen darüber, wie Sie sein Wachstum über die Jahre verfolgen können. Sie lernen auch Aufforstungsherausforderungen kennen, wie Bäume durch CO2-Bindung zur Bekämpfung des Klimawandels beitragen und wie Sie Aufforstungsprojekte weiterhin unterstützen können. Dies ist eine einzigartige Gelegenheit, ein dauerhaftes grünes Erbe zu hinterlassen und direkt zur Umweltwiederherstellung beizutragen.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.livingforests.org",
    date: "2025-11-23",
    time: "10:00",
    duration: 4,
    location: "Monte Bajo, Milán",
    location_en: "Low Forest, Milan",
    location_de: "Niederwald, Mailand",
    organizer: "Living Forests",
    organizer_en: "Living Forests",
    organizer_de: "Lebendige Wälder",
    category: "environment",
    maxVolunteers: 35,
    minVolunteers: 12,
    currentVolunteers: 19,
    requirements: ["Ropa de campo cómoda y resistente que pueda ensuciarse", "Botas de trabajo o calzado cerrado resistente", "Guantes de trabajo", "Botella de agua reutilizable", "Protector solar y sombrero", "Ropa de abrigo (si hace frío)", "Disponibilidad para trabajar al aire libre durante 4 horas", "Condición física básica para caminar y trabajar en terreno natural"],
    requirements_en: ["Comfortable and durable field clothes that can get dirty", "Work boots or sturdy closed footwear", "Work gloves", "Reusable water bottle", "Sunscreen and hat", "Warm clothing (if cold)", "Availability to work outdoors for 4 hours", "Basic physical condition to walk and work on natural terrain"],
    requirements_de: ["Bequeme und strapazierfähige Feldkleidung, die schmutzig werden kann", "Arbeitsstiefel oder robustes geschlossenes Schuhwerk", "Arbeitshandschuhe", "Wiederverwendbare Wasserflasche", "Sonnencreme und Hut", "Warme Kleidung (wenn kalt)", "Verfügbarkeit für Arbeiten im Freien für 4 Stunden", "Grundlegende körperliche Verfassung zum Gehen und Arbeiten auf natürlichem Gelände"],
    benefits: ["Árbol personal etiquetado con tu nombre", "Certificado de participación en reforestación", "Refrigerio y bebidas incluidas", "Guía completa de especies nativas plantadas", "Información sobre seguimiento y crecimiento de tu árbol", "Acceso a datos del proyecto de reforestación", "Experiencia práctica en conservación forestal", "Material educativo sobre reforestación y cambio climático"],
    benefits_en: ["Personal tree tagged with your name", "Reforestation participation certificate", "Snack and drinks included", "Complete guide to native species planted", "Information on tracking and growth of your tree", "Access to reforestation project data", "Hands-on forest conservation experience", "Educational material on reforestation and climate change"],
    benefits_de: ["Persönlicher Baum mit Ihrem Namen markiert", "Teilnahmezertifikat für Aufforstung", "Snack und Getränke inbegriffen", "Vollständiger Leitfaden zu gepflanzten einheimischen Arten", "Informationen zur Verfolgung und zum Wachstum Ihres Baumes", "Zugang zu Aufforstungsprojektdaten", "Praktische Erfahrung im Waldschutz", "Bildungsmaterial über Aufforstung und Klimawandel"],
    contact: "reforestacion@living.es"
  },
  "e26j": {
    id: "e26j",
    title: "Charla: Salud y Cambio Climático",
    title_en: "Talk: Health and Climate Change",
    title_de: "Vortrag: Gesundheit und Klimawandel",
    description: "Explora la profunda conexión entre la salud humana y el cambio climático en esta charla informativa de 2 horas dirigida por expertos en salud pública y medio ambiente. Descubrirás cómo el aumento de temperaturas afecta la propagación de enfermedades infecciosas, cómo la contaminación del aire impacta la salud respiratoria y cardiovascular, y cómo los eventos climáticos extremos afectan el bienestar mental y físico de las comunidades. Los ponentes abordarán temas como el impacto del calor extremo en grupos vulnerables, la relación entre calidad del aire y enfermedades crónicas, y las estrategias de adaptación para proteger la salud pública frente al cambio climático. También se discutirán las acciones individuales y comunitarias que podemos tomar para mitigar estos efectos y promover un entorno más saludable. Esta charla es ideal para profesionales de la salud, educadores, activistas ambientales y cualquier persona interesada en comprender cómo el cambio climático afecta nuestra vida diaria y nuestra salud.",
    description_en: "Explore the deep connection between human health and climate change in this 2-hour informative talk led by experts in public health and the environment. You'll discover how rising temperatures affect the spread of infectious diseases, how air pollution impacts respiratory and cardiovascular health, and how extreme weather events affect the mental and physical well-being of communities. Speakers will address topics such as the impact of extreme heat on vulnerable groups, the relationship between air quality and chronic diseases, and adaptation strategies to protect public health in the face of climate change. Individual and community actions we can take to mitigate these effects and promote a healthier environment will also be discussed. This talk is ideal for health professionals, educators, environmental activists, and anyone interested in understanding how climate change affects our daily lives and health.",
    description_de: "Erkunden Sie die tiefe Verbindung zwischen menschlicher Gesundheit und Klimawandel in diesem 2-stündigen informativen Vortrag, geleitet von Experten für öffentliche Gesundheit und Umwelt. Sie werden entdecken, wie steigende Temperaturen die Ausbreitung von Infektionskrankheiten beeinflussen, wie Luftverschmutzung die Atemwegs- und Herz-Kreislauf-Gesundheit beeinträchtigt und wie extreme Wetterereignisse das geistige und körperliche Wohlbefinden von Gemeinschaften beeinflussen. Die Redner werden Themen wie die Auswirkungen extremer Hitze auf gefährdete Gruppen, die Beziehung zwischen Luftqualität und chronischen Krankheiten sowie Anpassungsstrategien zum Schutz der öffentlichen Gesundheit angesichts des Klimawandels behandeln. Es werden auch individuelle und gemeinschaftliche Maßnahmen diskutiert, die wir ergreifen können, um diese Auswirkungen zu mildern und eine gesündere Umwelt zu fördern. Dieser Vortrag ist ideal für Gesundheitsfachkräfte, Pädagogen, Umweltaktivisten und alle, die daran interessiert sind, zu verstehen, wie der Klimawandel unser tägliches Leben und unsere Gesundheit beeinflusst.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    website: "https://www.greenhealth.org",
    date: "2025-11-27",
    time: "19:00",
    duration: 2,
    location: "Hospital Universitario, París",
    location_en: "University Hospital, Paris",
    location_de: "Universitätsklinikum, Paris",
    organizer: "Green Health",
    organizer_en: "Green Health",
    organizer_de: "Grüne Gesundheit",
    category: "education",
    maxVolunteers: 90,
    minVolunteers: 30,
    currentVolunteers: 61,
    requirements: ["Registro previo obligatorio", "Llegar 15 minutos antes del inicio", "Cuaderno para tomar notas (opcional)", "Dispositivo móvil para acceder a materiales digitales (opcional)", "Interés en salud pública o medio ambiente", "Respeto por las normas del espacio hospitalario"],
    requirements_en: ["Mandatory prior registration", "Arrive 15 minutes before start", "Notebook for taking notes (optional)", "Mobile device to access digital materials (optional)", "Interest in public health or environment", "Respect for hospital space rules"],
    requirements_de: ["Verbindliche Voranmeldung", "15 Minuten vor Beginn ankommen", "Notizbuch zum Mitschreiben (optional)", "Mobilgerät für den Zugang zu digitalen Materialien (optional)", "Interesse an öffentlicher Gesundheit oder Umwelt", "Respekt für die Regeln des Krankenhausraums"],
    benefits: ["Certificado de participación profesional", "Material informativo completo sobre salud y clima", "Acceso a presentaciones digitales", "Networking con profesionales de la salud y medio ambiente", "Guía de recursos para acción comunitaria", "Descuento en próximos eventos de Green Health", "Posibilidad de hacer preguntas a los expertos"],
    benefits_en: ["Professional participation certificate", "Complete informative material on health and climate", "Access to digital presentations", "Networking with health and environment professionals", "Resource guide for community action", "Discount on future Green Health events", "Opportunity to ask questions to experts"],
    benefits_de: ["Professionelles Teilnahmezertifikat", "Vollständiges informatives Material zu Gesundheit und Klima", "Zugang zu digitalen Präsentationen", "Netzwerken mit Gesundheits- und Umweltfachleuten", "Ressourcenführer für Gemeinschaftsaktionen", "Rabatt auf zukünftige Green Health-Veranstaltungen", "Möglichkeit, Fragen an Experten zu stellen"],
    contact: "salud@green.es"
  },
  "e26k": {
    id: "e26k",
    title: "Paseo Comunitario por el Río",
    title_en: "Community River Walk",
    title_de: "Gemeinschaftlicher Flussspaziergang",
    description: "Únete a nuestro paseo comunitario de 2 horas por la ribera del río Manzanares para disfrutar de la naturaleza urbana, conocer la biodiversidad local y fortalecer los lazos comunitarios. Durante este recorrido guiado de aproximadamente 4 kilómetros, descubrirás la flora y fauna que habita en el ecosistema fluvial urbano, aprenderás sobre la importancia de los ríos para la biodiversidad urbana y la calidad del aire, y conocerás los proyectos de restauración ecológica que se están llevando a cabo en la zona. Nuestro guía naturalista te ayudará a identificar aves acuáticas, plantas ribereñas y otros seres vivos que habitan en este entorno. También habrá momentos para la reflexión sobre la importancia de proteger nuestros espacios naturales urbanos y cómo podemos contribuir como comunidad. El paseo es de ritmo moderado, adecuado para todas las edades, y incluye varias paradas para observación y descanso. Esta actividad es perfecta para familias, amantes de la naturaleza y personas que buscan conectar con su comunidad local mientras disfrutan del aire libre.",
    description_en: "Join our 2-hour community walk along the Manzanares riverbank to enjoy urban nature, discover local biodiversity, and strengthen community bonds. During this guided tour of approximately 4 kilometers, you'll discover the flora and fauna that inhabit the urban river ecosystem, learn about the importance of rivers for urban biodiversity and air quality, and learn about the ecological restoration projects being carried out in the area. Our naturalist guide will help you identify waterfowl, riparian plants, and other living beings that inhabit this environment. There will also be moments for reflection on the importance of protecting our urban natural spaces and how we can contribute as a community. The walk is at a moderate pace, suitable for all ages, and includes several stops for observation and rest. This activity is perfect for families, nature lovers, and people looking to connect with their local community while enjoying the outdoors.",
    description_de: "Schließen Sie sich unserem 2-stündigen gemeinschaftlichen Spaziergang entlang des Manzanares-Ufers an, um urbane Natur zu genießen, lokale Biodiversität zu entdecken und Gemeinschaftsbindungen zu stärken. Während dieser geführten Tour von etwa 4 Kilometern entdecken Sie die Flora und Fauna, die das städtische Flussökosystem bewohnt, lernen Sie die Bedeutung von Flüssen für die urbane Biodiversität und Luftqualität kennen und erfahren Sie mehr über die ökologischen Restaurierungsprojekte, die in der Gegend durchgeführt werden. Unser Naturführer hilft Ihnen, Wasservögel, Uferpflanzen und andere Lebewesen zu identifizieren, die diese Umgebung bewohnen. Es wird auch Momente der Reflexion über die Bedeutung des Schutzes unserer städtischen Naturräume und darüber geben, wie wir als Gemeinschaft beitragen können. Der Spaziergang ist in einem moderaten Tempo, geeignet für alle Altersgruppen, und umfasst mehrere Stopps zur Beobachtung und Erholung. Diese Aktivität ist perfekt für Familien, Naturliebhaber und Menschen, die sich mit ihrer lokalen Gemeinschaft verbinden möchten, während sie die Natur genießen.",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    website: "https://www.riverfriends.org",
    date: "2025-11-29",
    time: "10:00",
    duration: 2,
    location: "Ribera Verde, Madrid",
    location_en: "Green Riverside, Madrid",
    location_de: "Grünes Ufer, Madrid",
    organizer: "River Friends",
    organizer_en: "River Friends",
    organizer_de: "Flussfreunde",
    category: "community",
    maxVolunteers: 40,
    minVolunteers: 12,
    currentVolunteers: 24,
    requirements: ["Ropa cómoda y adecuada para caminar", "Calzado cerrado y cómodo (zapatillas deportivas o botas de senderismo)", "Agua para hidratación (mínimo 1 litro)", "Protector solar (si hace sol)", "Gorra o sombrero (opcional)", "Prismáticos para observación de aves (opcional, tenemos algunos para compartir)", "Ropa de abrigo ligera (por si cambia el tiempo)"],
    requirements_en: ["Comfortable clothing suitable for walking", "Closed and comfortable footwear (sneakers or hiking boots)", "Water for hydration (minimum 1 liter)", "Sunscreen (if sunny)", "Cap or hat (optional)", "Binoculars for bird watching (optional, we have some to share)", "Light warm clothing (in case weather changes)"],
    requirements_de: ["Bequeme Kleidung zum Gehen", "Geschlossenes und bequemes Schuhwerk (Turnschuhe oder Wanderschuhe)", "Wasser zur Hydratation (mindestens 1 Liter)", "Sonnencreme (bei Sonnenschein)", "Mütze oder Hut (optional)", "Fernglas zur Vogelbeobachtung (optional, wir haben einige zum Teilen)", "Leichte warme Kleidung (falls sich das Wetter ändert)"],
    benefits: ["Guía naturalista experto durante todo el recorrido", "Guía de identificación de aves y plantas ribereñas", "Refrigerio saludable al finalizar el paseo", "Red de contactos con otros amantes de la naturaleza", "Información sobre proyectos de conservación local", "Acceso a futuras actividades de River Friends", "Fotografías del paseo compartidas en grupo"],
    benefits_en: ["Expert naturalist guide throughout the tour", "Bird and riparian plant identification guide", "Healthy snack at the end of the walk", "Network of contacts with other nature lovers", "Information about local conservation projects", "Access to future River Friends activities", "Photos from the walk shared in group"],
    benefits_de: ["Experten-Naturführer während der gesamten Tour", "Vogel- und Uferpflanzen-Identifikationsführer", "Gesunder Snack am Ende des Spaziergangs", "Netzwerk von Kontakten mit anderen Naturliebhabern", "Informationen über lokale Naturschutzprojekte", "Zugang zu zukünftigen River Friends-Aktivitäten", "Fotos vom Spaziergang in der Gruppe geteilt"],
    contact: "rio@friends.es"
  },
  "e26l": {
    id: "e26l",
    title: "Mercadillo de Intercambio Comunitario",
    title_en: "Community Swap Mini-Market",
    title_de: "Gemeinschaftlicher Tausch‑Flohmarkt",
    description: "Participa en nuestro mercadillo comunitario de intercambio de 4 horas donde podrás intercambiar objetos en buen estado y promover la economía circular. Este evento es una alternativa sostenible al consumo tradicional, donde los participantes pueden traer ropa, libros, juguetes, herramientas, artículos para el hogar, plantas, semillas y otros objetos que ya no necesitan pero que están en buen estado, y llevarse a cambio otros artículos que sí necesiten. El sistema funciona mediante un sistema de puntos: cada objeto que traigas te da puntos que puedes usar para 'comprar' otros objetos. También habrá un espacio especial para intercambio directo y trueque. Durante el evento, aprenderás sobre los principios de la economía circular, cómo reducir el desperdicio doméstico, y cómo dar una segunda vida a los objetos. Habrá talleres cortos sobre reparación básica de objetos, técnicas de upcycling, y cómo organizar tu propio intercambio comunitario. El mercadillo incluye música en vivo, comida local y un ambiente festivo que celebra la comunidad y la sostenibilidad. Esta es una oportunidad perfecta para limpiar tu casa de forma sostenible, encontrar tesoros únicos, y conocer a personas con valores similares mientras reduces tu huella ecológica.",
    description_en: "Participate in our 4-hour community swap mini-market where you can exchange items in good condition and promote the circular economy. This event is a sustainable alternative to traditional consumption, where participants can bring clothing, books, toys, tools, household items, plants, seeds, and other items they no longer need but are in good condition, and take home other items they do need. The system works through a points system: each item you bring gives you points that you can use to 'buy' other items. There will also be a special space for direct exchange and barter. During the event, you'll learn about the principles of the circular economy, how to reduce household waste, and how to give objects a second life. There will be short workshops on basic object repair, upcycling techniques, and how to organize your own community swap. The mini-market includes live music, local food, and a festive atmosphere that celebrates community and sustainability. This is a perfect opportunity to clean your house sustainably, find unique treasures, and meet like-minded people while reducing your ecological footprint.",
    description_de: "Nehmen Sie an unserem 4-stündigen Gemeinschaftstausch-Flohmarkt teil, wo Sie Gegenstände in gutem Zustand austauschen und die Kreislaufwirtschaft fördern können. Diese Veranstaltung ist eine nachhaltige Alternative zum traditionellen Konsum, bei der Teilnehmer Kleidung, Bücher, Spielzeug, Werkzeuge, Haushaltsgegenstände, Pflanzen, Samen und andere Gegenstände mitbringen können, die sie nicht mehr benötigen, aber in gutem Zustand sind, und andere Gegenstände mitnehmen können, die sie benötigen. Das System funktioniert über ein Punktesystem: Jeder mitgebrachte Gegenstand gibt Ihnen Punkte, die Sie verwenden können, um andere Gegenstände zu 'kaufen'. Es wird auch einen speziellen Raum für direkten Austausch und Tauschhandel geben. Während der Veranstaltung lernen Sie die Prinzipien der Kreislaufwirtschaft, wie Sie Haushaltsabfälle reduzieren und Gegenständen ein zweites Leben geben können. Es wird kurze Workshops zu grundlegender Objektreparatur, Upcycling-Techniken und zur Organisation Ihres eigenen Gemeinschaftstauschs geben. Der Flohmarkt umfasst Live-Musik, lokales Essen und eine festliche Atmosphäre, die Gemeinschaft und Nachhaltigkeit feiert. Dies ist eine perfekte Gelegenheit, Ihr Haus nachhaltig zu reinigen, einzigartige Schätze zu finden und Gleichgesinnte zu treffen, während Sie Ihren ökologischen Fußabdruck reduzieren.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    website: "https://www.circularuk.org",
    date: "2025-11-30",
    time: "12:00",
    duration: 4,
    location: "Plaza Central, Londres",
    location_en: "Central Square, London",
    location_de: "Zentralplatz, London",
    organizer: "Circular UK",
    organizer_en: "Circular UK",
    organizer_de: "Zirkulär UK",
    category: "community",
    maxVolunteers: 120,
    minVolunteers: 40,
    currentVolunteers: 77,
    requirements: ["Objetos en buen estado para intercambiar (ropa, libros, juguetes, herramientas, artículos para el hogar, plantas, semillas, etc.)", "Llegar 30 minutos antes para registro y evaluación de objetos", "Traer bolsas reutilizables para llevar tus nuevos objetos", "Objetos limpios y en condiciones de uso", "Máximo 10 objetos por persona (para asegurar espacio para todos)", "Disposición para participar en el sistema de intercambio", "Respeto por las normas del espacio comunitario"],
    requirements_en: ["Items in good condition to swap (clothing, books, toys, tools, household items, plants, seeds, etc.)", "Arrive 30 minutes early for registration and item evaluation", "Bring reusable bags to carry your new items", "Clean items in usable condition", "Maximum 10 items per person (to ensure space for everyone)", "Willingness to participate in the swap system", "Respect for community space rules"],
    requirements_de: ["Gegenstände in gutem Zustand zum Tauschen (Kleidung, Bücher, Spielzeug, Werkzeuge, Haushaltsgegenstände, Pflanzen, Samen usw.)", "30 Minuten früher ankommen zur Registrierung und Bewertung der Gegenstände", "Wiederverwendbare Taschen mitbringen, um Ihre neuen Gegenstände zu tragen", "Saubere Gegenstände in gebrauchsfähigem Zustand", "Höchstens 10 Gegenstände pro Person (um Platz für alle zu gewährleisten)", "Bereitschaft zur Teilnahme am Tauschsystem", "Respekt für die Regeln des Gemeinschaftsraums"],
    benefits: ["Sistema de puntos para intercambio justo", "Nuevos objetos sin costo económico", "Guía completa de economía circular y consumo responsable", "Talleres prácticos de reparación y upcycling", "Red de contactos con personas comprometidas con la sostenibilidad", "Música en vivo y ambiente festivo", "Comida local disponible", "Certificado de participación en economía circular", "Acceso prioritario a futuros mercadillos", "Información sobre proyectos comunitarios sostenibles"],
    benefits_en: ["Points system for fair exchange", "New items at no economic cost", "Complete guide to circular economy and responsible consumption", "Practical workshops on repair and upcycling", "Network of contacts with people committed to sustainability", "Live music and festive atmosphere", "Local food available", "Circular economy participation certificate", "Priority access to future mini-markets", "Information about sustainable community projects"],
    benefits_de: ["Punktesystem für fairen Austausch", "Neue Gegenstände ohne wirtschaftliche Kosten", "Vollständiger Leitfaden zur Kreislaufwirtschaft und verantwortungsvollem Konsum", "Praktische Workshops zu Reparatur und Upcycling", "Netzwerk von Kontakten mit nachhaltigkeitsorientierten Menschen", "Live-Musik und festliche Atmosphäre", "Lokales Essen verfügbar", "Teilnahmezertifikat für Kreislaufwirtschaft", "Prioritätszugang zu zukünftigen Flohmärkten", "Informationen über nachhaltige Gemeinschaftsprojekte"],
    contact: "mercado@circular.es"
  }
};

// Localized overrides for event strings (progressive coverage)
const EVENT_I18N: Record<string, { en: Partial<EventDetails>; de: Partial<EventDetails> }> = {
  e15: {
    en: {
      title: "Autumn planting",
      description:
        "Join our planting of autumn species to prepare the ecosystem for winter.",
      location: "Autumn Park, Barcelona",
      organizer: "Autumn Planters",
      requirements: ["Comfortable clothes", "Gloves", "Water"],
      benefits: ["Plants to take home", "Certificate", "Snack"],
    },
    de: {
      title: "Herbstaufforstung",
      description:
        "Schließe dich unserer Pflanzung von Herbstarten an, um das Ökosystem für den Winter vorzubereiten.",
      location: "Park des Herbstes, Barcelona",
      organizer: "Autumn Planters",
      requirements: ["Bequeme Kleidung", "Handschuhe", "Wasser"],
      benefits: ["Pflanzen zum Mitnehmen", "Zertifikat", "Erfrischung"],
    },
  },
  e15b: {
    en: {
      title: "City bike tour",
      description: "Explore the city sustainably with a guided bike tour through the main green spots.",
      location: "Historic Center, Paris",
      organizer: "Green Bikes",
      benefits: ["Tour guide", "Green map", "Local discounts"],
      requirements: ["Own bicycle", "Helmet", "Water"],
    },
    de: {
      title: "Radtour durch die Stadt",
      description: "Erkunde die Stadt nachhaltig bei einer geführten Fahrradtour zu den wichtigsten grünen Orten.",
      location: "Historisches Zentrum, Paris",
      organizer: "Green Bikes",
      benefits: ["Reiseleitung", "Grüne Karte", "Lokale Rabatte"],
      requirements: ["Eigenes Fahrrad", "Helm", "Wasser"],
    },
  },
  e16b: {
    en: {
      title: "Home composting workshop",
      description: "Learn to compost at home easily and safely. Ideal for beginners and families.",
      location: "Community Center, Berlin",
      organizer: "Compost Masters",
      benefits: ["Compost kit", "Practical guide", "Online support"],
      requirements: ["Clean organic waste", "Notebook"],
    },
    de: {
      title: "Workshop: Kompostieren zu Hause",
      description: "Lerne, zu Hause einfach und sicher zu kompostieren. Ideal für Einsteiger:innen und Familien.",
      location: "Nachbarschaftszentrum, Berlin",
      organizer: "Compost Masters",
      benefits: ["Kompost‑Kit", "Praxisleitfaden", "Online‑Support"],
      requirements: ["Sauberer Bioabfall", "Notizbuch"],
    },
  },
  e16: {
    en: {
      title: "Food preservation workshop",
      description: "Learn traditional and modern techniques to preserve food and reduce waste.",
      location: "Green Culinary Center, Milan",
      organizer: "Sustainable Kitchen",
    },
    de: {
      title: "Workshop: Lebensmittel konservieren",
      description: "Lerne traditionelle und moderne Techniken, um Lebensmittel zu konservieren und Abfall zu reduzieren.",
      location: "Grünes Kulinarisches Zentrum, Mailand",
      organizer: "Nachhaltige Küche",
    },
  },
  e17: {
    en: {
      title: "Autumn forest cleanup",
      description: "Help keep the forest healthy during the season change.",
      location: "Autumn Forest, Paris",
      organizer: "Forest Guardians",
    },
    de: {
      title: "Herbstwald‑Reinigung",
      description: "Hilf mit, den Wald während des Jahreszeitenwechsels gesund zu halten.",
      location: "Herbstwald, Paris",
      organizer: "Waldwächter",
    },
  },
  e18: {
    en: {
      title: "Seasonal products market",
      description: "Discover seasonal produce at our market focused on local and sustainable food.",
      location: "Season Square, London",
      organizer: "Seasonal Producers",
    },
    de: {
      title: "Saisonprodukt‑Markt",
      description: "Entdecke saisonale Produkte auf unserem Markt mit Fokus auf lokale, nachhaltige Lebensmittel.",
      location: "Saisonplatz, London",
      organizer: "Saisonproduzenten",
    },
  },
};

// Very small phrase dictionaries to automatically translate common words
// used across our demo events. Unknown words are preserved.
const ES_EN: Record<string, string> = {
  "Taller": "Workshop",
  "Plantación": "Planting",
  "árboles": "trees",
  "Limpieza": "Cleanup",
  "de": "of",
  "río": "river",
  "playas": "beaches",
  "Mercado": "Market",
  "productos": "products",
  "locales": "local",
  "energía": "energy",
  "solar": "solar",
  "hidroeléctrica": "hydropower",
  "Reciclaje": "Recycling",
  "Huertos": "Gardens",
  "urbanos": "urban",
  "Conferencia": "Conference",
  "cambio climático": "climate change",
  "Monitoreo": "Monitoring",
  "calidad del aire": "air quality",
  "Fiesta": "Festival",
  "sostenibilidad": "sustainability",
  // Common requirements/benefits
  "Bolsa reutilizable": "Reusable bag",
  "Dinero para compras": "Money for purchases",
  "Descuentos especiales": "Special discounts",
  "Degustaciones": "Tastings",
  "Red de productores": "Producers network",
  "Entrada gratuita": "Free entry",
  "Registro previo": "Prior registration",
  "Guía marina": "Marine guide",
  "Certificado": "Certificate",
  "Material educativo": "Educational material",
};

const ES_DE: Record<string, string> = {
  "Taller": "Workshop",
  "Plantación": "Aufforstung",
  "árboles": "Bäume",
  "Limpieza": "Reinigung",
  "de": "von",
  "río": "Fluss",
  "playas": "Strände",
  "Mercado": "Markt",
  "productos": "Produkte",
  "locales": "lokal",
  "energía": "Energie",
  "solar": "Solar",
  "hidroeléctrica": "Wasserkraft",
  "Reciclaje": "Recycling",
  "Huertos": "Gärten",
  "urbanos": "urban",
  "Conferencia": "Konferenz",
  "cambio climático": "Klimawandel",
  "Monitoreo": "Überwachung",
  "calidad del aire": "Luftqualität",
  "Fiesta": "Fest",
  "sostenibilidad": "Nachhaltigkeit",
  // Common requirements/benefits
  "Bolsa reutilizable": "Wiederverwendbare Tasche",
  "Dinero para compras": "Geld für Einkäufe",
  "Descuentos especiales": "Sonderrabatte",
  "Degustaciones": "Verkostungen",
  "Red de productores": "Netz der Produzenten",
  "Entrada gratuita": "Freier Eintritt",
  "Registro previo": "Vorherige Anmeldung",
  "Guía marina": "Meeresführer",
  "Certificado": "Zertifikat",
  "Material educativo": "Bildungsmaterial",
  // Specific translations for e16
  "conservación de alimentos": "Lebensmittelkonservierung",
  "conservar alimentos": "Lebensmittel konservieren",
  "reducir el desperdicio": "Abfall reduzieren",
  "técnicas tradicionales": "traditionelle Techniken",
  "técnicas modernas": "moderne Techniken",
  "Delantal": "Schürze",
  "Cuaderno": "Notizbuch",
  "Contenedores": "Behälter",
  "Alimentos conservados": "Konservierte Lebensmittel",
  "Recetas": "Rezepte",
  // Specific translations for e16b
  "compost en casa": "Kompostieren zu Hause",
  "compostar en casa": "zu Hause kompostieren",
  "forma sencilla": "einfache Weise",
  "forma segura": "sichere Weise",
  "principiantes": "Anfänger",
  "familias": "Familien",
  "Residuo orgánico limpio": "Saubere organische Abfälle",
  "Kit de compostaje": "Kompostierungs-Kit",
  "Manual práctico": "Praktisches Handbuch",
  "Soporte online": "Online-Support",
};

function autoTranslate(text: string, locale: string): string {
  if (!text) return text;
  if (locale === "es") return text;
  const dict = locale === "en" ? ES_EN : ES_DE;
  // Replace longer phrases first
  const entries = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
  let out = text;
  for (const [es, tr] of entries) {
    // word boundaries break on accents/compound words; do a safer global replace
    const re = new RegExp(`${es.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`, "gi");
    out = out.replace(re, (m) => {
      const isCap = m[0] === m[0].toUpperCase();
      const rep = tr;
      return isCap ? rep.charAt(0).toUpperCase() + rep.slice(1) : rep;
    });
  }
  return out;
}

function translateLocationSpan(span: string, locale: string): string {
  // Try to map standalone city/country tokens via locationLabel
  return locationLabel(span.trim(), locale as any);
}

function translateLocation(full: string, locale: string): string {
  if (!full || locale === "es") return full;
  // Common format: "Place, City" or "Place, City, Country"
  const parts = full.split(",").map((s) => s.trim());
  if (parts.length === 1) return translateLocationSpan(full, locale);
  const last = translateLocationSpan(parts[parts.length - 1], locale);
  const rest = parts.slice(0, parts.length - 1).join(", ");
  return `${rest}, ${last}`;
}

function autoTranslateEvent(base: EventDetails, locale: string): Partial<EventDetails> {
  if (locale === "es") return {};
  if (!base) return {};
  
  const result: Partial<EventDetails> = {};
  
  try {
    if (base.title) result.title = autoTranslate(String(base.title), locale);
    if (base.description) result.description = autoTranslate(String(base.description), locale);
    if (base.location) result.location = translateLocation(String(base.location), locale);
    if (base.organizer) result.organizer = autoTranslate(String(base.organizer), locale);
    
    if (Array.isArray(base.benefits)) {
      result.benefits = base.benefits.map((b) => {
        try {
          return autoTranslate(String(b || ''), locale);
        } catch {
          return String(b || '');
        }
      });
    } else if (base.benefits) {
      result.benefits = base.benefits;
    }
    
    if (Array.isArray(base.requirements)) {
      result.requirements = base.requirements.map((r) => {
        try {
          return autoTranslate(String(r || ''), locale);
        } catch {
          return String(r || '');
        }
      });
    } else if (base.requirements) {
      result.requirements = base.requirements;
    }
  } catch (error) {
    console.warn('Error in autoTranslateEvent:', error);
    // Return empty object on error to prevent breaking the app
    return {};
  }
  
  return result;
}

// Function to get localized event data
function getLocalizedEventData(eventId: string, locale: string) {
  try {
  // Debug: Check if eventId exists in EVENT_DETAILS
  const availableKeys = Object.keys(EVENT_DETAILS);
  console.log(`[getLocalizedEventData] Looking for event: ${eventId}`);
  console.log(`[getLocalizedEventData] Total events available: ${availableKeys.length}`);
  console.log(`[getLocalizedEventData] Events containing "26":`, availableKeys.filter(k => k.includes('26')).join(', '));
  
  const baseEvent = EVENT_DETAILS[eventId];
  if (!baseEvent) {
    console.error(`❌ Event ${eventId} not found in EVENT_DETAILS.`);
    console.error(`   Available events (first 30):`, availableKeys.slice(0, 30).join(', '));
    console.error(`   Events containing "26":`, availableKeys.filter(k => k.includes('26')).join(', '));
    return null;
  }
  console.log(`✅ Found event ${eventId} in EVENT_DETAILS:`, {
    id: baseEvent.id,
    title: baseEvent.title,
    title_de: baseEvent.title_de,
    location: baseEvent.location,
    location_de: baseEvent.location_de,
    maxVolunteers: baseEvent.maxVolunteers,
    currentVolunteers: baseEvent.currentVolunteers
  });

  // Use specific language fields if available, otherwise fall back to auto-translation
    const localizedEvent: EventDetails = { ...baseEvent };
    
    // Apply localization FIRST, before setting defaults
    if (locale === 'en') {
      if (baseEvent.title_en) localizedEvent.title = baseEvent.title_en;
      if (baseEvent.description_en) localizedEvent.description = baseEvent.description_en;
      if (baseEvent.location_en) localizedEvent.location = baseEvent.location_en;
      if (baseEvent.organizer_en) localizedEvent.organizer = baseEvent.organizer_en;
      if (baseEvent.requirements_en && Array.isArray(baseEvent.requirements_en)) {
        localizedEvent.requirements = baseEvent.requirements_en;
      }
      if (baseEvent.benefits_en && Array.isArray(baseEvent.benefits_en)) {
        localizedEvent.benefits = baseEvent.benefits_en;
      }
    } else if (locale === 'de') {
      if (baseEvent.title_de) localizedEvent.title = baseEvent.title_de;
      if (baseEvent.description_de) localizedEvent.description = baseEvent.description_de;
      if (baseEvent.location_de) localizedEvent.location = baseEvent.location_de;
      if (baseEvent.organizer_de) localizedEvent.organizer = baseEvent.organizer_de;
      if (baseEvent.requirements_de && Array.isArray(baseEvent.requirements_de)) {
        localizedEvent.requirements = baseEvent.requirements_de;
      }
      if (baseEvent.benefits_de && Array.isArray(baseEvent.benefits_de)) {
        localizedEvent.benefits = baseEvent.benefits_de;
      }
    }
    
    // Ensure required fields have defaults (only if truly missing after localization)
    if (!localizedEvent.requirements || !Array.isArray(localizedEvent.requirements) || localizedEvent.requirements.length === 0) {
      // Generate default requirements based on category
      const defaultRequirements: Record<string, Record<string, string[]>> = {
        environment: {
          es: ['Ropa cómoda y resistente', 'Calzado adecuado', 'Agua para hidratación', 'Protector solar', 'Guantes (si es necesario)'],
          en: ['Comfortable and durable clothing', 'Appropriate footwear', 'Water for hydration', 'Sunscreen', 'Gloves (if needed)'],
          de: ['Bequeme und strapazierfähige Kleidung', 'Geeignetes Schuhwerk', 'Wasser zur Hydratation', 'Sonnencreme', 'Handschuhe (falls erforderlich)']
        },
        education: {
          es: ['Cuaderno para tomar notas', 'Bolígrafo', 'Ropa cómoda', 'Interés en aprender'],
          en: ['Notebook for taking notes', 'Pen', 'Comfortable clothing', 'Interest in learning'],
          de: ['Notizbuch zum Mitschreiben', 'Stift', 'Bequeme Kleidung', 'Interesse am Lernen']
        },
        community: {
          es: ['Ropa cómoda', 'Agua para hidratación', 'Buen humor y energía positiva'],
          en: ['Comfortable clothing', 'Water for hydration', 'Good mood and positive energy'],
          de: ['Bequeme Kleidung', 'Wasser zur Hydratation', 'Gute Laune und positive Energie']
        },
        technology: {
          es: ['Dispositivo móvil o laptop (opcional)', 'Cuaderno para notas', 'Interés en tecnología'],
          en: ['Mobile device or laptop (optional)', 'Notebook for notes', 'Interest in technology'],
          de: ['Mobilgerät oder Laptop (optional)', 'Notizbuch für Notizen', 'Interesse an Technologie']
        }
      };
      const category = localizedEvent.category || 'community';
      const lang = locale === 'es' ? 'es' : locale === 'de' ? 'de' : 'en';
      localizedEvent.requirements = defaultRequirements[category]?.[lang] || defaultRequirements.community[lang];
    }
    if (!localizedEvent.benefits || !Array.isArray(localizedEvent.benefits) || localizedEvent.benefits.length === 0) {
      // Generate default benefits based on category
      const defaultBenefits: Record<string, Record<string, string[]>> = {
        environment: {
          es: ['Experiencia práctica en conservación', 'Certificado de participación', 'Conocimiento sobre prácticas sostenibles', 'Conexión con la naturaleza'],
          en: ['Hands-on conservation experience', 'Participation certificate', 'Knowledge about sustainable practices', 'Connection with nature'],
          de: ['Praktische Erfahrung im Naturschutz', 'Teilnahmezertifikat', 'Wissen über nachhaltige Praktiken', 'Verbindung mit der Natur']
        },
        education: {
          es: ['Conocimientos prácticos', 'Material educativo', 'Certificado de asistencia', 'Red de contactos'],
          en: ['Practical knowledge', 'Educational material', 'Attendance certificate', 'Network of contacts'],
          de: ['Praktisches Wissen', 'Bildungsmaterial', 'Teilnahmezertifikat', 'Netzwerk von Kontakten']
        },
        community: {
          es: ['Conexión con la comunidad', 'Experiencia enriquecedora', 'Nuevos amigos y contactos', 'Contribución a un proyecto significativo'],
          en: ['Community connection', 'Enriching experience', 'New friends and contacts', 'Contribution to a meaningful project'],
          de: ['Gemeinschaftsverbindung', 'Bereichernde Erfahrung', 'Neue Freunde und Kontakte', 'Beitrag zu einem bedeutungsvollen Projekt']
        },
        technology: {
          es: ['Conocimiento de tecnologías emergentes', 'Acceso a herramientas digitales', 'Certificado de participación', 'Oportunidades de networking'],
          en: ['Knowledge of emerging technologies', 'Access to digital tools', 'Participation certificate', 'Networking opportunities'],
          de: ['Wissen über aufstrebende Technologien', 'Zugang zu digitalen Tools', 'Teilnahmezertifikat', 'Netzwerkmöglichkeiten']
        }
      };
      const category = localizedEvent.category || 'community';
      const lang = locale === 'es' ? 'es' : locale === 'de' ? 'de' : 'en';
      localizedEvent.benefits = defaultBenefits[category]?.[lang] || defaultBenefits.community[lang];
    }
    
    // Ensure all required string fields have defaults (only if truly missing)
    // Don't override if field exists but is empty string - that's intentional
    if (localizedEvent.title === undefined || localizedEvent.title === null || localizedEvent.title === '') {
      console.warn(`Event ${eventId} missing title after localization, using default`);
      localizedEvent.title = `Evento ${eventId}`;
    }
    if (localizedEvent.description === undefined || localizedEvent.description === null || localizedEvent.description === '') {
      // Generate a realistic description based on event title and category
      const categoryDescriptions: Record<string, Record<string, string>> = {
        environment: {
          es: `Únete a esta actividad medioambiental que contribuye a la protección y mejora de nuestro entorno natural. Durante esta actividad, trabajaremos juntos para crear un impacto positivo en el medio ambiente y aprender sobre prácticas sostenibles.`,
          en: `Join this environmental activity that contributes to the protection and improvement of our natural environment. During this activity, we'll work together to create a positive impact on the environment and learn about sustainable practices.`,
          de: `Nehmen Sie an dieser Umweltaktivität teil, die zum Schutz und zur Verbesserung unserer natürlichen Umwelt beiträgt. Während dieser Aktivität arbeiten wir zusammen, um positive Auswirkungen auf die Umwelt zu schaffen und mehr über nachhaltige Praktiken zu lernen.`
        },
        education: {
          es: `Participa en este taller educativo donde aprenderás habilidades prácticas y conocimientos valiosos sobre temas importantes. Esta es una oportunidad perfecta para expandir tus conocimientos y conectar con otros participantes interesados en el mismo tema.`,
          en: `Participate in this educational workshop where you'll learn practical skills and valuable knowledge about important topics. This is a perfect opportunity to expand your knowledge and connect with other participants interested in the same topic.`,
          de: `Nehmen Sie an diesem Bildungs-Workshop teil, bei dem Sie praktische Fähigkeiten und wertvolles Wissen über wichtige Themen erlernen. Dies ist eine perfekte Gelegenheit, Ihr Wissen zu erweitern und sich mit anderen Teilnehmern zu verbinden, die sich für dasselbe Thema interessieren.`
        },
        community: {
          es: `Únete a esta actividad comunitaria que reúne a personas con intereses similares para trabajar juntos hacia un objetivo común. Esta es una oportunidad para conocer a otros miembros de la comunidad, compartir experiencias y contribuir a un proyecto significativo.`,
          en: `Join this community activity that brings together people with similar interests to work together toward a common goal. This is an opportunity to meet other community members, share experiences, and contribute to a meaningful project.`,
          de: `Schließen Sie sich dieser Gemeinschaftsaktivität an, die Menschen mit ähnlichen Interessen zusammenbringt, um gemeinsam auf ein gemeinsames Ziel hinzuarbeiten. Dies ist eine Gelegenheit, andere Gemeindemitglieder kennenzulernen, Erfahrungen auszutauschen und zu einem bedeutungsvollen Projekt beizutragen.`
        },
        technology: {
          es: `Participa en este evento tecnológico donde explorarás las últimas innovaciones y herramientas tecnológicas para la sostenibilidad. Aprenderás sobre cómo la tecnología puede ayudar a resolver problemas ambientales y crear soluciones innovadoras.`,
          en: `Participate in this technology event where you'll explore the latest innovations and technological tools for sustainability. You'll learn about how technology can help solve environmental problems and create innovative solutions.`,
          de: `Nehmen Sie an dieser Technologieveranstaltung teil, bei der Sie die neuesten Innovationen und technologischen Werkzeuge für Nachhaltigkeit erkunden. Sie erfahren, wie Technologie dazu beitragen kann, Umweltprobleme zu lösen und innovative Lösungen zu schaffen.`
        }
      };
      
      const category = localizedEvent.category || 'community';
      const lang = locale === 'es' ? 'es' : locale === 'de' ? 'de' : 'en';
      localizedEvent.description = categoryDescriptions[category]?.[lang] || categoryDescriptions.community[lang];
    }
    if (localizedEvent.location === undefined || localizedEvent.location === null || localizedEvent.location === '') {
      console.warn(`Event ${eventId} missing location after localization, using default`);
      localizedEvent.location = 'TBD';
    }
    if (!localizedEvent.organizer) localizedEvent.organizer = 'EcoNexo Community';
    if (!localizedEvent.category) localizedEvent.category = 'community';
    if (!localizedEvent.contact) localizedEvent.contact = 'info@econexo.org';
    if (!localizedEvent.date) localizedEvent.date = new Date().toISOString().split('T')[0];
    if (!localizedEvent.time) localizedEvent.time = '09:00';
    if (typeof localizedEvent.duration !== 'number') localizedEvent.duration = 2;
    if (typeof localizedEvent.maxVolunteers !== 'number') {
      console.warn(`Event ${eventId} missing maxVolunteers, using default`);
      localizedEvent.maxVolunteers = 50;
    }
    if (typeof localizedEvent.currentVolunteers !== 'number') {
      localizedEvent.currentVolunteers = 0;
    }

  // Fallback to auto-translation for missing fields
  const auto = autoTranslateEvent(localizedEvent, locale);
  
  // Apply manual overrides if they exist
  const overridesFromMap = (EVENT_I18N as Record<string, Record<string, Partial<EventDetails>>>)[eventId]?.[locale as 'en' | 'de'] || {};

    // Merge carefully, ensuring arrays are properly handled
    const result: EventDetails = {
    ...localizedEvent,
    ...auto,
    ...overridesFromMap,
  };
    
    // Ensure arrays are always arrays
    if (!Array.isArray(result.requirements)) {
      result.requirements = Array.isArray(localizedEvent.requirements) ? localizedEvent.requirements : [];
    }
    if (!Array.isArray(result.benefits)) {
      result.benefits = Array.isArray(localizedEvent.benefits) ? localizedEvent.benefits : [];
    }
    
    // Final validation - ensure all required fields exist (only if truly missing)
    if (!result.id) result.id = eventId;
    if (!result.title || result.title === `Evento ${eventId}`) {
      // Only set default if title is actually missing or already default
      if (!result.title) {
        console.warn(`Event ${eventId} missing title in final validation`);
        result.title = `Evento ${eventId}`;
      }
    }
    if (result.description === undefined || result.description === null) result.description = '';
    if (!result.location || result.location === 'TBD') {
      // Only set default if location is actually missing or already default
      if (!result.location) {
        console.warn(`Event ${eventId} missing location in final validation`);
        result.location = 'TBD';
      }
    }
    if (!result.organizer) result.organizer = 'EcoNexo Community';
    if (!result.category) result.category = 'community';
    if (!result.contact) result.contact = 'info@econexo.org';
    if (!result.date) result.date = new Date().toISOString().split('T')[0];
    if (!result.time) result.time = '09:00';
    if (typeof result.duration !== 'number') result.duration = 2;
    if (typeof result.maxVolunteers !== 'number') {
      console.warn(`Event ${eventId} missing maxVolunteers in final validation`);
      result.maxVolunteers = 50;
    }
    if (typeof result.currentVolunteers !== 'number') result.currentVolunteers = 0;

    // Debug log to verify the event was loaded correctly
    if (result.title === `Evento ${eventId}` || result.location === 'TBD') {
      console.warn(`⚠️ Event ${eventId} loaded with default values:`, {
        title: result.title,
        location: result.location,
        maxVolunteers: result.maxVolunteers,
        currentVolunteers: result.currentVolunteers
      });
    }

    return result;
  } catch (error) {
    console.error(`Error in getLocalizedEventData for event ${eventId}:`, error);
    // Return a safe default event object instead of null to prevent crashes
    return {
      id: eventId,
      title: `Evento ${eventId}`,
      title_en: `Event ${eventId}`,
      title_de: `Veranstaltung ${eventId}`,
      description: 'Información del evento no disponible temporalmente.',
      description_en: 'Event information temporarily unavailable.',
      description_de: 'Veranstaltungsinformationen vorübergehend nicht verfügbar.',
      image_url: undefined,
      website: undefined,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 2,
      location: 'TBD',
      location_en: 'TBD',
      location_de: 'TBD',
      organizer: 'EcoNexo Community',
      organizer_en: 'EcoNexo Community',
      organizer_de: 'EcoNexo Community',
      category: 'community',
      maxVolunteers: 50,
      currentVolunteers: 0,
      requirements: [],
      benefits: [],
      contact: 'info@econexo.org'
    };
  }
}

export default function EventDetailClient({ eventId }: { eventId: string }) {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // This is required by React's Rules of Hooks
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [saved, setSaved] = React.useState<boolean>(false);
  const [apiEvent, setApiEvent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [baseEvent, setBaseEvent] = React.useState<EventDetails | null>(null);
  // These hooks must be declared here, even if we use them conditionally later
  const [currentVolunteers, setCurrentVolunteers] = React.useState<number>(0);
  const [showRegistrationForm, setShowRegistrationForm] = React.useState(false);

  // Update currentVolunteers when baseEvent changes
  React.useEffect(() => {
    if (baseEvent && baseEvent.currentVolunteers !== undefined) {
      setCurrentVolunteers(baseEvent.currentVolunteers);
    }
  }, [baseEvent?.id, baseEvent?.currentVolunteers]);
  
  // Load saved state (guest/local + Supabase) - must be before conditional returns
  React.useEffect(() => {
    const loadSaved = async () => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        if (raw) {
          const list: { type: 'project' | 'event'; id: string }[] = JSON.parse(raw);
          const existsLocal = list.some((i) => i.type === 'event' && i.id === eventId);
          if (!user || !isSupabaseConfigured()) {
            setSaved(existsLocal);
            return;
          }
        }
      } catch {}

      if (!user || !isSupabaseConfigured()) return;
      const supabase = getSupabase();
      if (!supabase) return;

      // Reconcile guest saved into DB on login
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        if (raw) {
          const list: { type: 'project' | 'event'; id: string }[] = JSON.parse(raw);
          const toInsert = list.map((i) => ({ user_id: user.id, item_type: i.type, item_id: i.id }));
          if (toInsert.length) {
            await supabase.from('favorites').upsert(toInsert as any, { onConflict: 'user_id,item_type,item_id' } as any);
            localStorage.removeItem('econexo:saved');
          }
        }
      } catch {}

      try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', 'event')
        .eq('item_id', eventId)
        .maybeSingle();
      setSaved(!!data);
      } catch (err) {
        console.warn('Error loading saved state:', err);
      }
    };
    
    loadSaved();
  }, [eventId, user]);
  
  // Load event data (mock or API)
  React.useEffect(() => {
    const loadEventData = async () => {
      try {
        // First try to load from API
        try {
          const res = await fetch(`/api/events?id=${encodeURIComponent(eventId)}`);
          if (res.ok) {
            const data = await res.json();
            // Only use API data if it's valid and has essential fields
            // Check if data has a valid title (not generic) and location (not TBD)
            const hasValidTitle = data && data.title && data.title !== `Evento ${eventId}` && !data.title.startsWith('Evento ');
            const hasValidLocation = data && (data.location || (data.city && data.country)) && 
              data.location !== 'TBD' && !(data.city === 'TBD' || data.country === 'TBD');
            
            if (data && !data.error && hasValidTitle && hasValidLocation) {
              setApiEvent(data);
              setBaseEvent({
                id: data.id || eventId,
                title: data.title || data.title_en || `Evento ${eventId}`,
                title_en: data.title_en || data.title,
                title_de: data.title_de || data.title,
                description: data.description || data.description_en || '',
                description_en: data.description_en || data.description,
                description_de: data.description_de || data.description,
                image_url: data.image_url,
                website: data.website,
                date: data.date || new Date().toISOString().split('T')[0],
                time: data.start_time || '09:00',
                duration: data.duration || 2,
                location: data.location || (data.city && data.country ? `${data.city}, ${data.country}` : (data.city || data.country || 'TBD')),
                location_en: data.location_en,
                location_de: data.location_de,
                organizer: data.organizer || 'EcoNexo Community',
                organizer_en: data.organizer_en || data.organizer,
                organizer_de: data.organizer_de || data.organizer,
                category: data.category?.toLowerCase() || 'community',
                maxVolunteers: data.max_volunteers || data.capacity || 50,
                minVolunteers: data.min_volunteers,
                currentVolunteers: data.current_volunteers || 0,
                requirements: Array.isArray(data.requirements) ? data.requirements : [],
                benefits: Array.isArray(data.benefits) ? data.benefits : [],
                contact: data.contact || 'info@econexo.org'
              });
              setLoading(false);
              return;
            } else {
              console.warn(`[EventDetailClient] API returned invalid data for ${eventId}, falling back to mock data.`, {
                hasValidTitle,
                hasValidLocation,
                title: data?.title,
                location: data?.location || (data?.city && data?.country ? `${data.city}, ${data.country}` : null)
              });
            }
          }
        } catch (apiError) {
          console.warn('Failed to load event from API, using mock data:', apiError);
        }
        
        // ALWAYS fall back to mock data if API fails or returns empty
        console.log(`[EventDetailClient] Attempting to load event ${eventId} from EVENT_DETAILS...`);
        console.log(`[EventDetailClient] Total events in EVENT_DETAILS:`, Object.keys(EVENT_DETAILS).length);
        console.log(`[EventDetailClient] Events containing "${eventId.slice(1, 3)}":`, Object.keys(EVENT_DETAILS).filter(k => k.includes(eventId.slice(1, 3))).join(', '));
        
        const mockEvent = getLocalizedEventData(eventId, locale);
        if (mockEvent) {
          console.log(`✅ [EventDetailClient] Loaded event ${eventId} from mock data:`, {
            title: mockEvent.title,
            title_de: mockEvent.title_de,
            location: mockEvent.location,
            location_de: mockEvent.location_de,
            date: mockEvent.date,
            time: mockEvent.time,
            volunteers: `${mockEvent.currentVolunteers}/${mockEvent.maxVolunteers}`
          });
          setBaseEvent(mockEvent);
        } else {
          console.error(`❌ [EventDetailClient] Event ${eventId} not found in mock data`);
          console.error(`   Available events containing "${eventId.slice(1, 3)}":`, Object.keys(EVENT_DETAILS).filter(k => k.includes(eventId.slice(1, 3))).join(', '));
          console.error(`   First 30 available events:`, Object.keys(EVENT_DETAILS).slice(0, 30).join(', '));
          setError(`Evento ${eventId} no encontrado`);
        }
      } catch (err) {
        console.error(`Error loading event ${eventId}:`, err);
        setError(`Error al cargar el evento: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadEventData();
  }, [eventId, locale]);
  
  // Debug: Log component state
  console.log(`[EventDetailClient Render] State:`, {
    loading,
    error,
    hasBaseEvent: !!baseEvent,
    baseEventTitle: baseEvent?.title,
    baseEventLocation: baseEvent?.location,
    eventId
  });
  
  // If still loading, show loading state
  if (loading) {
    console.log(`[EventDetailClient] Rendering loading state`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('loading') || 'Cargando...'}</p>
        </div>
      </div>
    );
  }
  
  // Show error state if there was an error
  if (error) {
    console.log(`[EventDetailClient] Rendering error state:`, error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }
  
  // Only show notFound if we've finished loading and still don't have an event
  if (!baseEvent) {
    console.error(`[EventDetailClient] Event ${eventId} not found - calling notFound()`);
    console.error(`  Loading: ${loading}, Error: ${error}, baseEvent:`, baseEvent);
    notFound();
  }
  
  console.log(`[EventDetailClient] Rendering event detail for:`, {
    id: baseEvent.id,
    title: baseEvent.title,
    location: baseEvent.location
  });

  // Translate category within the component where t is available
  const translatedCategory = baseEvent.category === 'environment' ? 
    t('categoryEnvironment') :
    baseEvent.category === 'education' ?
    t('categoryEducation') :
    baseEvent.category === 'community' ?
    t('categoryCommunity') :
    baseEvent.category === 'technology' ?
    t('categoryTechnology') :
    baseEvent.category;

  const event = {
    ...baseEvent,
    category: translatedCategory,
  };
  
  if (!event) {
    notFound();
  }

  const progressPercentage = event ? (currentVolunteers / event.maxVolunteers) * 100 : 0;
  const spotsLeft = event ? event.maxVolunteers - currentVolunteers : 0;

  // Ensure event has an image (use helper function)
  const headerImageSrc = ensureEventImage({
    image_url: event.image_url,
    category: event.category,
    website: (event as any).website
  });

  const handleJoin = async () => {
    if (spotsLeft <= 0) return;
    if (!user) {
      const key = locale === 'es' ? 'pleaseSignInFirstEs' : locale === 'de' ? 'pleaseSignInFirstDe' : 'pleaseSignInFirstEn';
      alert(t(key));
      return;
    }
    setShowRegistrationForm(true);
  };

  const toggleSaved = async () => {
    // Guest/local mode
    if (!user || !isSupabaseConfigured()) {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        const list: { type: 'project' | 'event'; id: string }[] = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex((i) => i.type === 'event' && i.id === eventId);
        if (idx >= 0) {
          list.splice(idx, 1);
          setSaved(false);
          try { trackEvent('save_item', { type: 'event', id: eventId, action: 'remove', auth: 0 }); } catch {}
        } else {
          list.push({ type: 'event', id: eventId });
          setSaved(true);
          try { trackEvent('save_item', { type: 'event', id: eventId, action: 'add', auth: 0 }); } catch {}
        }
        if (typeof window !== 'undefined') localStorage.setItem('econexo:saved', JSON.stringify(list));
      } catch {}
      return;
    }

    // Authenticated via Supabase
    const supabase = getSupabase();
    if (saved) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', 'event')
        .eq('item_id', eventId);
      setSaved(false);
      try { trackEvent('save_item', { type: 'event', id: eventId, action: 'remove', auth: 1 }); } catch {}
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, item_type: 'event', item_id: eventId });
      if (!error) setSaved(true);
      try { trackEvent('save_item', { type: 'event', id: eventId, action: 'add', auth: 1 }); } catch {}
    }
  };

  const handleRegistration = async (registrationData: {
    name: string;
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone: string;
    dietaryRestrictions?: string;
    accessibilityNeeds?: string;
    experience: 'beginner' | 'intermediate' | 'expert';
    motivation: string;
    agreeToTerms: boolean;
    agreeToPhotos: boolean;
  }) => {
    try {
      if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
      const supabase = getSupabase();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          name: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phone,
          emergency_contact: registrationData.emergencyContact,
          emergency_phone: registrationData.emergencyPhone,
          dietary_restrictions: registrationData.dietaryRestrictions,
          accessibility_needs: registrationData.accessibilityNeeds,
          experience: registrationData.experience,
          motivation: registrationData.motivation,
          agree_to_terms: registrationData.agreeToTerms,
          agree_to_photos: registrationData.agreeToPhotos,
        });
      if (error) throw error;
      
      setCurrentVolunteers((v: number) => Math.min(event.maxVolunteers, v + 1));
      setShowRegistrationForm(false);
      try { trackEvent('register_event', { id: event.id }); } catch {}
      
      // Add event to user's participated events list
      const participatedEvents = JSON.parse(localStorage.getItem('econexo:participatedEvents') || '[]');
      const eventToAdd = {
        id: event.id,
        title: event.title,
        date: event.date,
        city: event.location.split(',')[0]?.trim() || 'Unknown',
        country: event.location.split(',')[1]?.trim() || 'Unknown',
        category: event.category,
        capacity: event.maxVolunteers
      };
      
      // Check if event is already in the list
      const isAlreadyParticipated = participatedEvents.some((e: any) => e.id === event.id);
      if (!isAlreadyParticipated) {
        participatedEvents.push(eventToAdd);
        localStorage.setItem('econexo:participatedEvents', JSON.stringify(participatedEvents));
        
        // Dispatch custom event to update the list in same tab
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('econexo:participatedEventAdded', {
            detail: { event: eventToAdd }
          }));
        }
      }
      
      alert(locale === 'de' ? 
        'Du hast dich erfolgreich für die Veranstaltung angemeldet!' : 
        locale === 'en' ? 
        'You have successfully registered for the event!' : 
        '¡Te has registrado exitosamente al evento!'
      );
    } catch (error) {
      console.error('Registration error:', error);
      alert(locale === 'de' ? 
        'Fehler bei der Anmeldung.' : 
        locale === 'en' ? 
        'Registration failed.' : 
        'Error en el registro.'
      );
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = event.title;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        const key = locale === 'es' ? 'linkCopiedEs' : locale === 'de' ? 'linkCopiedDe' : 'linkCopiedEn';
        alert(t(key));
      } else {
        alert(url);
      }
    } catch {
      // silently ignore
    }
  };

  const getCategoryColor = (category: string) => {
    // Check for localized category names
    if (category.includes('Umwelt') || category.includes('Environment') || category.includes('Medio ambiente')) {
      return "bg-green-100 text-green-800";
    }
    if (category.includes('Bildung') || category.includes('Education') || category.includes('Educación')) {
      return "bg-blue-100 text-blue-800";
    }
    if (category.includes('Gemeinschaft') || category.includes('Community') || category.includes('Comunidad')) {
      return "bg-purple-100 text-purple-800";
    }
    if (category.includes('Technologie') || category.includes('Technology') || category.includes('Tecnología')) {
      return "bg-violet-100 text-violet-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getCategoryLabel = (category: string) => {
    // Since we're already returning localized category names, just return them
    return category;
  };

  return (
    <div className="min-h-screen bg-gls-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/eventos"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg mb-6"
        >
          ← {t("backToEvents")}
        </Link>

        {/* Event Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
          {/* Event Image - Always show (ensureEventImage always returns an image) */}
          <div className="mb-6">
            <img 
              src={headerImageSrc}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
              loading="lazy"
              referrerPolicy="no-referrer"
              decoding="async"
              crossOrigin="anonymous"
            />
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                  {getCategoryLabel(event.category)}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {event.organizer}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {event.title.startsWith('event') && !event.title.includes(' ') ? t(event.title) : event.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {event.description}
              </p>
            </div>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("date")}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {new Date(event.date).toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US')}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("time")}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {event.time} ({event.duration}h)
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("location")}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {event.location}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("contact")}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {event.contact}
              </div>
            </div>
          </div>

          {/* Volunteer Progress */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">{t("volunteerProgress")}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {event.currentVolunteers}/{event.maxVolunteers} {t("volunteers")}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {spotsLeft > 0 ? `${spotsLeft} ${t("spotsLeft")}` : t("fullyBooked")}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requirements */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("requirements")}
            </h2>
            <ul className="space-y-2">
              {event.requirements.map((req: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-green-600">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("benefits")}
            </h2>
            <ul className="space-y-2">
              {event.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-blue-600">🎁</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div id="join" className="flex gap-4 mt-8 justify-center">
          <button 
            onClick={handleJoin}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={spotsLeft === 0}
          >
            {spotsLeft > 0 ? t("joinEvent") : t("fullyBooked")}
          </button>
          <button onClick={handleShare} className="px-8 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            {t("shareEvent")}
          </button>
          <button onClick={toggleSaved} className={`px-8 py-3 rounded-lg font-semibold transition-colors ${saved ? 'bg-amber-200 text-slate-900' : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            {saved ? (locale === 'es' ? t('savedEs') : locale === 'de' ? t('savedDe') : t('savedEn')) : (locale === 'es' ? t('saveEs') : locale === 'de' ? t('saveDe') : t('saveEn'))}
          </button>
        </div>

        {/* Event Administrators */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mt-6">
          <EventAdministrators eventId={eventId} isCreator={(event as any).created_by === user?.id} />
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <EventRegistrationForm
          event={{
            id: event.id,
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            maxVolunteers: event.maxVolunteers,
            currentVolunteers: currentVolunteers
          }}
          onRegister={handleRegistration}
          onCancel={() => setShowRegistrationForm(false)}
        />
      )}
    </div>
  );
}
