import { LocalizedString, LocalizedArray } from "./projects";

export type Job = {
    id: string;
    title: LocalizedString;
    company: string;
    city: LocalizedString;
    country: LocalizedString;
    salaryMinEur: number;
    salaryMaxEur: number;
    level: 'junior' | 'mid' | 'senior' | 'lead';
    experienceYears: number;
    knowledgeAreas: LocalizedArray;
    contract: "full-time" | "part-time" | "contract" | "internship";
    remote: boolean;
    description: LocalizedString;
    apply_url?: string;
    logo_url?: string;
    isCurated?: boolean;
    curatorLog?: string[];
};

export const JOBS: Job[] = [
    // === REAL JOBS 2026 - RENEWABLE ENERGY ===
    {
        id: "real_j1",
        title: {
            en: "Renewable Energy Project Manager",
            es: "Gerente de Proyectos de Energía Renovable",
            de: "Projektleiter*in Erneuerbare Energien",
            fr: "Chef de Projet Énergie Renouvelable",
            it: "Project Manager Energie Rinnovabili",
            pl: "Kierownik Projektu Energii Odnawialnej",
            nl: "Projectmanager Hernieuwbare Energie"
        },
        company: "European Energy",
        city: {
            en: "Copenhagen",
            es: "Copenhague",
            de: "Kopenhagen",
            fr: "Copenhague",
            it: "Copenaghen",
            pl: "Kopenhaga",
            nl: "Kopenhagen"
        },
        country: {
            en: "Denmark",
            es: "Dinamarca",
            de: "Dänemark",
            fr: "Danemark",
            it: "Danimarca",
            pl: "Dania",
            nl: "Denemarken"
        },
        salaryMinEur: 65000,
        salaryMaxEur: 85000,
        level: 'senior',
        experienceYears: 5,
        knowledgeAreas: {
            en: ["Solar PV", "Wind Energy", "Project Management", "PPA"],
            es: ["Solar FV", "Energía Eólica", "Gestión de Proyectos", "PPA"],
            de: ["Solar-PV", "Windenergie", "Projektmanagement", "PPA"],
            fr: ["PV Solaire", "Énergie Éolienne", "Gestion de Projet", "PPA"],
            it: ["Fotovoltaico", "Energia Eolica", "Gestione Progetti", "PPA"],
            pl: ["Fotowoltaika", "Energia Wiatrowa", "Zarządzanie Projektami", "PPA"],
            nl: ["Zonne-energie", "Windenergie", "Projectmanagement", "PPA"]
        },
        contract: "full-time",
        remote: false,
        description: {
            en: "Lead the development of large-scale renewable energy projects across Europe. Manage stakeholders, permitting, and grid connections. Join a leading company driving the green transition.",
            es: "Liderar el desarrollo de proyectos de energía renovable a gran escala en toda Europa. Gestionar partes interesadas, permisos y conexiones a la red. Únete a una empresa líder que impulsa la transición ecológica.",
            de: "Leiten Sie die Entwicklung von großen Erneuerbare-Energien-Projekten in ganz Europa. Management von Stakeholdern, Genehmigungen und Netzanschlüssen.",
            fr: "Diriger le développement de projets d'énergie renouvelable à grande échelle à travers l'Europe. Gérer les parties prenantes, les permis et les raccordements au réseau.",
            it: "Guidare lo sviluppo di progetti di energia rinnovabile su larga scala in tutta Europa. Gestire le parti interessate, i permessi e le connessioni alla rete.",
            pl: "Kieruj rozwojem wielkoskalowych projektów energii odnawialnej w całej Europie. Zarządzaj interesariuszami, pozwoleniami i przyłączeniami do sieci.",
            nl: "Leid de ontwikkeling van grootschalige projecten voor hernieuwbare energie in heel Europa. Beheer belanghebbenden, vergunningen en netaansluitingen."
        },
        apply_url: "https://careers.europeanenergy.com/jobs",
        logo_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j2",
        title: {
            en: "Battery Systems Engineer",
            es: "Ingeniero/a de Sistemas de Baterías",
            de: "Batteriesystemingenieur*in",
            fr: "Ingénieur Systèmes de Batteries",
            it: "Ingegnere Sistemi Batterie",
            pl: "Inżynier Systemów Bateryjnych",
            nl: "Batterij Systeem Ingenieur"
        },
        company: "Northvolt",
        city: {
            en: "Stockholm",
            es: "Estocolmo",
            de: "Stockholm",
            fr: "Stockholm",
            it: "Stoccolma",
            pl: "Sztokholm",
            nl: "Stockholm"
        },
        country: {
            en: "Sweden",
            es: "Suecia",
            de: "Schweden",
            fr: "Suède",
            it: "Svezia",
            pl: "Szwecja",
            nl: "Zweden"
        },
        salaryMinEur: 58000,
        salaryMaxEur: 75000,
        level: 'mid',
        experienceYears: 3,
        knowledgeAreas: {
            en: ["Li-Ion", "BMS", "Python", "Simulink"],
            es: ["Ion-Litio", "BMS", "Python", "Simulink"],
            de: ["Li-Ion", "BMS", "Python", "Simulink"],
            fr: ["Li-Ion", "BMS", "Python", "Simulink"],
            it: ["Li-Ion", "BMS", "Python", "Simulink"],
            pl: ["Li-Ion", "BMS", "Python", "Simulink"],
            nl: ["Li-Ion", "BMS", "Python", "Simulink"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Design and validate battery management systems for next-gen electric vehicles. Work in a world-class team to build the world's greenest battery.",
            es: "Diseñar y validar sistemas de gestión de baterías para vehículos eléctricos de próxima generación. Trabaja en un equipo de clase mundial para construir la batería más ecológica del mundo.",
            de: "Entwurf und Validierung von Batteriemanagementsystemen für Elektrofahrzeuge der nächsten Generation. Arbeiten Sie in einem Weltklasse-Team am Bau der umweltfreundlichsten Batterie der Welt.",
            fr: "Concevoir et valider des systèmes de gestion de batteries pour les véhicules électriques de nouvelle generación.",
            it: "Progettare e convalidare sistemi di gestione delle batterie per veicoli elettrici di prossima generazione.",
            pl: "Projektowanie i walidacja systemów zarządzania bateriami dla pojazdów elektrycznych nowej generacji.",
            nl: "Ontwerp en valideer batterijbeheersystemen voor elektrische voertuigen van de volgende generatie."
        },
        apply_url: "https://northvolt.com/career/",
        logo_url: "https://images.unsplash.com/photo-1569163139394-de6e4f6f4c8a?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j3",
        title: {
            en: "Wind Turbine Technician",
            es: "Técnico/a de Turbinas Eólicas",
            de: "Windturbinentechniker*in",
            fr: "Technicien Éolien",
            it: "Tecnico Turbine Eoliche",
            pl: "Technik Turbin Wiatrowych",
            nl: "Windturbine Technicus"
        },
        company: "Vestas",
        city: {
            en: "Hamburg",
            es: "Hamburgo",
            de: "Hamburg",
            fr: "Hambourg",
            it: "Amburgo",
            pl: "Hamburg",
            nl: "Hamburg"
        },
        country: {
            en: "Germany",
            es: "Alemania",
            de: "Deutschland",
            fr: "Allemagne",
            it: "Germania",
            pl: "Niemcy",
            nl: "Duitsland"
        },
        salaryMinEur: 42000,
        salaryMaxEur: 55000,
        level: 'mid',
        experienceYears: 2,
        knowledgeAreas: {
            en: ["Mechanics", "Hydraulics", "Electronics", "Safety"],
            es: ["Mecánica", "Hidráulica", "Electrónica", "Seguridad"],
            de: ["Mechanik", "Hydraulik", "Elektronik", "Sicherheit"],
            fr: ["Mécanique", "Hydraulique", "Électronique", "Sécurité"],
            it: ["Meccanica", "Idraulica", "Elettronica", "Sicurezza"],
            pl: ["Mechanika", "Hydraulika", "Elektronika", "Bezpieczeństwo"],
            nl: ["Mechanica", "Hydraulica", "Elektronica", "Veiligheid"]
        },
        contract: "full-time",
        remote: false,
        description: {
            en: "Perform maintenance and troubleshooting on wind turbines. Ensure optimal performance and safety standards. Ideal for hands-on technical professionals passionate about wind energy.",
            es: "Realizar mantenimiento y resolución de problemas en turbinas eólicas. Asegurar un rendimiento óptimo y estándares de seguridad. Ideal para profesionales técnicos prácticos apasionados por la energía eólica.",
            de: "Wartung und Fehlerbehebung an Windkraftanlagen durchführen. Gewährleistung optimaler Leistung und Sicherheitsstandards.",
            fr: "Effectuer la maintenance et le dépannage des éoliennes. Assurer des performances optimales et le respect des normes de sécurité.",
            it: "Eseguire la manutenzione e la risoluzione dei problemi sulle turbine eoliche.",
            pl: "Wykonywanie konserwacji i rozwiązywanie problemów w turbinach wiatrowych.",
            nl: "Voer onderhoud en probleemoplossing uit aan windturbines."
        },
        apply_url: "https://www.vestas.com/en/careers/job-opportunities",
        logo_url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j4",
        title: {
            en: "Offshore Wind Engineer",
            es: "Ingeniero/a de Eólica Marina",
            de: "Offshore-Windingenieur*in",
            fr: "Ingénieur Éolien Offshore",
            it: "Ingegnere Eolico Offshore",
            pl: "Inżynier Morskiej Energetyki Wiatrowej",
            nl: "Offshore Wind Ingenieur"
        },
        company: "Ørsted",
        city: {
            en: "Esbjerg",
            es: "Esbjerg",
            de: "Esbjerg",
            fr: "Esbjerg",
            it: "Esbjerg",
            pl: "Esbjerg",
            nl: "Esbjerg"
        },
        country: {
            en: "Denmark",
            es: "Dinamarca",
            de: "Dänemark",
            fr: "Danemark",
            it: "Danimarca",
            pl: "Dania",
            nl: "Denemarken"
        },
        salaryMinEur: 62000,
        salaryMaxEur: 80000,
        level: 'senior',
        experienceYears: 5,
        knowledgeAreas: {
            en: ["Offshore Wind", "Marine Engineering", "Grid Integration", "SCADA"],
            es: ["Eólica Marina", "Ingeniería Marina", "Integración de Red", "SCADA"],
            de: ["Offshore-Wind", "Schiffbau", "Netzintegration", "SCADA"],
            fr: ["Éolien Offshore", "Génie Maritime", "Intégration Réseau", "SCADA"],
            it: ["Eolico Offshore", "Ingegneria Navale", "Integrazione Rete", "SCADA"],
            pl: ["Morska Energetyka Wiatrowa", "Inżynieria Morska", "Integracja z Siecią", "SCADA"],
            nl: ["Offshore Wind", "Maritieme Techniek", "Netintegratie", "SCADA"]
        },
        contract: "full-time",
        remote: false,
        description: {
            en: "Lead offshore wind farm projects from concept to operation. The global leader in offshore wind is looking for experienced engineers to accelerate the green energy transformation.",
            es: "Liderar proyectos de parques eólicos marinos desde el concepto hasta la operación. El líder mundial en energía eólica marina busca ingenieros experimentados para acelerar la transformación de la energía verde.",
            de: "Leitung von Offshore-Windparkprojekten von der Konzeption bis zum Betrieb.",
            fr: "Diriger les projets de parcs éoliens offshore de la conception à l'exploitation.",
            it: "Guidare i progetti di parchi eolici offshore dal concetto all'operatività.",
            pl: "Kieruj projektami morskich farm wiatrowych od koncepcji do eksploatacji.",
            nl: "Leid offshore windparkprojecten van concept tot exploitatie."
        },
        apply_url: "https://orsted.com/en/careers",
        logo_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j5",
        title: {
            en: "Solar PV Design Engineer",
            es: "Ingeniero/a de Diseño Solar Fotovoltaico",
            de: "Solar-PV-Designingenieur*in",
            fr: "Ingénieur Conception Solaire PV",
            it: "Ingegnere Progettazione Solare FV",
            pl: "Inżynier Projektu Fotowoltaiki",
            nl: "Solar PV Design Ingenieur"
        },
        company: "Enel Green Power",
        city: {
            en: "Rome",
            es: "Roma",
            de: "Rom",
            fr: "Rome",
            it: "Roma",
            pl: "Rzym",
            nl: "Rome"
        },
        country: {
            en: "Italy",
            es: "Italia",
            de: "Italien",
            fr: "Italie",
            it: "Italia",
            pl: "Włochy",
            nl: "Italië"
        },
        salaryMinEur: 45000,
        salaryMaxEur: 58000,
        level: 'mid',
        experienceYears: 3,
        knowledgeAreas: {
            en: ["PV Design", "PVsyst", "AutoCAD", "Grid Connection", "Energy Yield"],
            es: ["Diseño FV", "PVsyst", "AutoCAD", "Conexión a Red", "Rendimiento Energético"],
            de: ["PV-Design", "PVsyst", "AutoCAD", "Netzanschluss", "Energieertrag"],
            fr: ["Conception PV", "PVsyst", "AutoCAD", "Raccordement Réseau", "Productible"],
            it: ["Progettazione FV", "PVsyst", "AutoCAD", "Connessione Rete", "Resa Energetica"],
            pl: ["Projektowanie PV", "PVsyst", "AutoCAD", "Przyłączenie do Sieci", "Uzysk Energii"],
            nl: ["PV Ontwerp", "PVsyst", "AutoCAD", "Netaansluiting", "Energieopbrengst"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Design large-scale solar PV plants in Southern Europe. Use cutting-edge simulation tools to optimize energy production and reduce LCOE.",
            es: "Diseñar plantas solares fotovoltaicas a gran escala en el sur de Europa. Utilizar herramientas de simulación de vanguardia para optimizar la producción de energía y reducir el LCOE.",
            de: "Entwurf von großen Solar-PV-Anlagen in Südeuropa. Einsatz modernster Simulationstools zur Optimierung der Energieproduktion.",
            fr: "Concevoir des centrales solaires PV à grande échelle en Europe du Sud.",
            it: "Progettare impianti solari fotovoltaici su larga scala nel sud Europa.",
            pl: "Projektowanie wielkoskalowych elektrowni fotowoltaicznych w Europie Południowej.",
            nl: "Ontwerp grootschalige zonne-PV-installaties in Zuid-Europa."
        },
        apply_url: "https://www.enelgreenpower.com/careers",
        logo_url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j6",
        title: {
            en: "Software Engineer - Green Search",
            es: "Ingeniero/a de Software - Búsqueda Verde",
            de: "Softwareingenieur*in - Grüne Suche",
            fr: "Ingénieur Logiciel - Recherche Verte",
            it: "Ingegnere Software - Ricerca Verde",
            pl: "Inżynier Oprogramowania - Zielone Wyszukiwanie",
            nl: "Software Engineer - Groen Zoeken"
        },
        company: "Ecosia",
        city: {
            en: "Berlin",
            es: "Berlín",
            de: "Berlin",
            fr: "Berlin",
            it: "Berlino",
            pl: "Berlin",
            nl: "Berlijn"
        },
        country: {
            en: "Germany",
            es: "Alemania",
            de: "Deutschland",
            fr: "Allemagne",
            it: "Germania",
            pl: "Niemcy",
            nl: "Duitsland"
        },
        salaryMinEur: 60000,
        salaryMaxEur: 80000,
        level: 'senior',
        experienceYears: 4,
        knowledgeAreas: {
            en: ["Go", "Kubernetes", "Search Algorithms", "Sustainability"],
            es: ["Go", "Kubernetes", "Algoritmos de Búsqueda", "Sostenibilidad"],
            de: ["Go", "Kubernetes", "Suchalgorithmen", "Nachhaltigkeit"],
            fr: ["Go", "Kubernetes", "Algorithmes de Recherche", "Durabilité"],
            it: ["Go", "Kubernetes", "Algoritmi di Ricerca", "Sostenibilità"],
            pl: ["Go", "Kubernetes", "Algorytmy Wyszukiwania", "Zrównoważony Rozwój"],
            nl: ["Go", "Kubernetes", "Zoekalgoritmen", "Duurzaamheid"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Build the search engine that plants trees. Optimize search performance and infrastructure while minimizing carbon footprint. Help us scale our positive impact.",
            es: "Construye el motor de búsqueda que planta árboles. Optimiza el rendimiento de búsqueda y la infraestructura mientras minimizas la huella de carbono. Ayúdanos a escalar nuestro impacto positivo.",
            de: "Bauen Sie die Suchmaschine, die Bäume pflanzt. Optimieren Sie die Suchleistung und Infrastruktur bei gleichzeitiger Minimierung des CO2-Fußabdrucks.",
            fr: "Construisez le moteur de recherche qui plante des arbres. Optimisez les performances de recherche et l'infrastructure tout en minimisant l'empreinte carbone.",
            it: "Costruisci il motore di ricerca che pianta alberi. Ottimizza le prestazioni di ricerca e l'infrastruttura riducendo al minimo l'impronta di carbonio.",
            pl: "Buduj wyszukiwarkę, która sadzi drzewa. Optymalizuj wydajność wyszukiwania i infrastrukturę, minimalizując ślad węglowy.",
            nl: "Bouw de zoekmachine die bomen plant. Optimaliseer de zoekprestaties en infrastructuur terwijl je de ecologische voetafdruk minimaliseert."
        },
        apply_url: "https://www.ecosia.org/jobs",
        logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j7",
        title: {
            en: "Climate Data Scientist",
            es: "Científico/a de Datos Climáticos",
            de: "Klimadatenwissenschaftler*in",
            fr: "Data Scientist Climatique",
            it: "Data Scientist Climatico",
            pl: "Analityk Danych Klimatycznych",
            nl: "Klimaat Data Scientist"
        },
        company: "ClimateAI",
        city: {
            en: "Amsterdam",
            es: "Ámsterdam",
            de: "Amsterdam",
            fr: "Amsterdam",
            it: "Amsterdam",
            pl: "Amsterdam",
            nl: "Amsterdam"
        },
        country: {
            en: "Netherlands",
            es: "Países Bajos",
            de: "Niederlande",
            fr: "Pays-Bas",
            it: "Paesi Bassi",
            pl: "Holandia",
            nl: "Nederland"
        },
        salaryMinEur: 55000,
        salaryMaxEur: 72000,
        level: 'mid',
        experienceYears: 3,
        knowledgeAreas: {
            en: ["Python", "Machine Learning", "Climate Modeling", "TensorFlow", "R"],
            es: ["Python", "Machine Learning", "Modelado Climático", "TensorFlow", "R"],
            de: ["Python", "Maschinelles Lernen", "Klimamodellierung", "TensorFlow", "R"],
            fr: ["Python", "Apprentissage Automatique", "Modélisation Climatique", "TensorFlow", "R"],
            it: ["Python", "Machine Learning", "Modellazione Climatica", "TensorFlow", "R"],
            pl: ["Python", "Uczenie Maszynowe", "Modelowanie Klimatyczne", "TensorFlow", "R"],
            nl: ["Python", "Machine Learning", "Klimaatmodellering", "TensorFlow", "R"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Develop ML models to predict climate risks for agriculture and supply chains. Work with satellite data and weather forecasts to help businesses adapt to climate change.",
            es: "Desarrollar modelos de ML para predecir riesgos climáticos para la agricultura y las cadenas de suministro. Trabajar con datos satelitales y pronósticos meteorológicos para ayudar a las empresas a adaptarse al cambio climático.",
            de: "Entwicklung von ML-Modellen zur Vorhersage von Klimarisiken für Landwirtschaft und Lieferketten.",
            fr: "Développer des modèles ML pour prédire les risques climatiques pour l'agriculture et les chaînes d'approvisionnement.",
            it: "Sviluppare modelli ML per prevedere i rischi climatici per l'agricoltura e le catene di approvvigionamento.",
            pl: "Rozwijaj modele ML do przewidywania ryzyka klimatycznego dla rolnictwa i łańcuchów dostaw.",
            nl: "Ontwikkel ML-modellen om klimaatrisico's voor de landbouw en toeleveringsketens te voorspellen."
        },
        apply_url: "https://www.climate.ai/careers",
        logo_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j8",
        title: {
            en: "Sustainability Software Developer",
            es: "Desarrollador/a de Software de Sostenibilidad",
            de: "Nachhaltigkeits-Softwareentwickler*in",
            fr: "Développeur Logiciel Durabilité",
            it: "Sviluppatore Software Sostenibilità",
            pl: "Programista Oprogramowania Zrównoważonego Rozwoju",
            nl: "Duurzaamheids Software Ontwikkelaar"
        },
        company: "Plan A",
        city: {
            en: "Berlin",
            es: "Berlín",
            de: "Berlin",
            fr: "Berlin",
            it: "Berlino",
            pl: "Berlin",
            nl: "Berlijn"
        },
        country: {
            en: "Germany",
            es: "Alemania",
            de: "Deutschland",
            fr: "Allemagne",
            it: "Germania",
            pl: "Niemcy",
            nl: "Duitsland"
        },
        salaryMinEur: 52000,
        salaryMaxEur: 68000,
        level: 'mid',
        experienceYears: 3,
        knowledgeAreas: {
            en: ["React", "TypeScript", "Node.js", "Carbon Accounting", "APIs"],
            es: ["React", "TypeScript", "Node.js", "Contabilidad de Carbono", "APIs"],
            de: ["React", "TypeScript", "Node.js", "CO2-Bilanzierung", "APIs"],
            fr: ["React", "TypeScript", "Node.js", "Comptabilité Carbone", "APIs"],
            it: ["React", "TypeScript", "Node.js", "Contabilità del Carbonio", "APIs"],
            pl: ["React", "TypeScript", "Node.js", "Rachunkowość Węglowa", "APIs"],
            nl: ["React", "TypeScript", "Node.js", "Koolstofboekhouding", "APIs"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Build enterprise carbon management software used by companies worldwide. Help organizations measure, reduce, and report their environmental impact.",
            es: "Construir software empresarial de gestión de carbono utilizado por empresas en todo el mundo. Ayudar a las organizaciones a medir, reducir y reportar su impacto ambiental.",
            de: "Entwicklung von Unternehmenssoftware für CO2-Management, die weltweit eingesetzt wird.",
            fr: "Construire un logiciel de gestion du carbone d'entreprise utilisé par des entreprises du monde entier.",
            it: "Costruire software per la gestione del carbonio aziendale utilizzato da aziende in tutto il mondo.",
            pl: "Buduj oprogramowanie do zarządzania emisją dwutlenku węgla w przedsiębiorstwach, używane przez firmy na całym świecie.",
            nl: "Bouw bedrijfssoftware voor koolstofbeheer die wereldwijd door bedrijven wordt gebruikt."
        },
        apply_url: "https://plana.earth/careers",
        logo_url: "https://images.unsplash.com/photo-1451187530220-3816127e1302?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j9",
        title: {
            en: "ESG Reporting Manager",
            es: "Gerente de Informes ESG",
            de: "ESG-Berichtsmanager*in",
            fr: "Responsable Reporting ESG",
            it: "Responsabile Reporting ESG",
            pl: "Menedżer ds. Raportowania ESG",
            nl: "ESG Rapportage Manager"
        },
        company: "Siemens",
        city: {
            en: "Munich",
            es: "Múnich",
            de: "München",
            fr: "Munich",
            it: "Monaco di Baviera",
            pl: "Monachium",
            nl: "München"
        },
        country: {
            en: "Germany",
            es: "Alemania",
            de: "Deutschland",
            fr: "Allemagne",
            it: "Germania",
            pl: "Niemcy",
            nl: "Duitsland"
        },
        salaryMinEur: 65000,
        salaryMaxEur: 82000,
        level: 'senior',
        experienceYears: 5,
        knowledgeAreas: {
            en: ["ESG", "CSRD", "GRI Standards", "TCFD", "Sustainability Reporting"],
            es: ["ESG", "CSRD", "Estándares GRI", "TCFD", "Informes de Sostenibilidad"],
            de: ["ESG", "CSRD", "GRI-Standards", "TCFD", "Nachhaltigkeitsberichterstattung"],
            fr: ["ESG", "CSRD", "Normes GRI", "TCFD", "Rapport de Durabilité"],
            it: ["ESG", "CSRD", "Standard GRI", "TCFD", "Report Sostenibilità"],
            pl: ["ESG", "CSRD", "Standardy GRI", "TCFD", "Raportowanie Zrównoważonego Rozwoju"],
            nl: ["ESG", "CSRD", "GRI Standaarden", "TCFD", "Duurzaamheidsrapportage"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Lead ESG reporting for one of Europe's largest industrial companies. Ensure CSRD compliance and coordinate sustainability data across global operations.",
            es: "Liderar los informes ESG para una de las empresas industriales más grandes de Europa. Asegurar el cumplimiento de la CSRD y coordinar los datos de sostenibilidad en todas las operaciones globales.",
            de: "Leitung der ESG-Berichterstattung für eines der größten Industrieunternehmen Europas. Sicherstellung der CSRD-Konformität.",
            fr: "Diriger le reporting ESG pour l'une des plus grandes entreprises industrielles d'Europe. Assurer la conformité CSRD.",
            it: "Guidare il reporting ESG per una delle più grandi aziende industriali d'Europa.",
            pl: "Kieruj raportowaniem ESG dla jednej z największych firm przemysłowych w Europie.",
            nl: "Leid ESG-rapportage voor een van de grootste industriële bedrijven van Europa."
        },
        apply_url: "https://jobs.siemens.com/careers",
        logo_url: "https://images.unsplash.com/photo-1516383740770-fbcc5c2477ff?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j10",
        title: {
            en: "Sustainability Consultant",
            es: "Consultor/a de Sostenibilidad",
            de: "Nachhaltigkeitsberater*in",
            fr: "Consultant en Durabilité",
            it: "Consulente di Sostenibilità",
            pl: "Konsultant ds. Zrównoważonego Rozwoju",
            nl: "Duurzaamheidsconsultant"
        },
        company: "Deloitte",
        city: {
            en: "Frankfurt",
            es: "Fráncfort",
            de: "Frankfurt",
            fr: "Francfort",
            it: "Francoforte",
            pl: "Frankfurt",
            nl: "Frankfurt"
        },
        country: {
            en: "Germany",
            es: "Alemania",
            de: "Deutschland",
            fr: "Allemagne",
            it: "Germania",
            pl: "Niemcy",
            nl: "Duitsland"
        },
        salaryMinEur: 58000,
        salaryMaxEur: 75000,
        level: 'mid',
        experienceYears: 4,
        knowledgeAreas: {
            en: ["Sustainability Strategy", "ESG", "Carbon Footprint", "CSRD", "EU Taxonomy"],
            es: ["Estrategia de Sostenibilidad", "ESG", "Huella de Carbono", "CSRD", "Taxonomía UE"],
            de: ["Nachhaltigkeitsstrategie", "ESG", "CO2-Fußabdruck", "CSRD", "EU-Taxonomie"],
            fr: ["Stratégie Durabilité", "ESG", "Empreinte Carbone", "CSRD", "Taxonomie UE"],
            it: ["Strategia Sostenibilità", "ESG", "Impronta di Carbonio", "CSRD", "Tassonomia UE"],
            pl: ["Strategia Zrównoważonego Rozwoju", "ESG", "Ślad Węglowy", "CSRD", "Taksonomia UE"],
            nl: ["Duurzaamheidsstrategie", "ESG", "Ecologische Voetafdruk", "CSRD", "EU Taxonomie"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Advise major corporations on their sustainability transformation. From carbon strategy to ESG reporting, help clients navigate the transition to a low-carbon economy.",
            es: "Asesorar a grandes corporaciones en su transformación hacia la sostenibilidad. Desde la estrategia de carbono hasta los informes ESG, ayuda a los clientes a navegar la transición hacia una economía baja en carbono.",
            de: "Beratung von Großunternehmen bei ihrer Nachhaltigkeitstransformation. Von der CO2-Strategie bis zur ESG-Berichterstattung.",
            fr: "Conseiller les grandes entreprises sur leur transformation durable. De la stratégie carbone au reporting ESG.",
            it: "Consigliare le grandi aziende sulla loro trasformazione sostenibile.",
            pl: "Doradzaj dużym korporacjom w ich transformacji w kierunku zrównoważonego rozwoju.",
            nl: "Adviseer grote bedrijven over hun duurzaamheidstransformatie."
        },
        apply_url: "https://www2.deloitte.com/de/de/pages/karriere/topics/karriere.html",
        logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j11",
        title: {
            en: "Circular Economy Analyst",
            es: "Analista de Economía Circular",
            de: "Analyst*in Kreislaufwirtschaft",
            fr: "Analyste Économie Circulaire",
            it: "Analista di Economia Circolare",
            pl: "Analityk Gospodarki Obiegu Zamkniętego",
            nl: "Analist Circulaire Economie"
        },
        company: "IKEA",
        city: {
            en: "Malmö",
            es: "Malmö",
            de: "Malmö",
            fr: "Malmö",
            it: "Malmö",
            pl: "Malmö",
            nl: "Malmö"
        },
        country: {
            en: "Sweden",
            es: "Suecia",
            de: "Schweden",
            fr: "Suède",
            it: "Svezia",
            pl: "Szwecja",
            nl: "Zweden"
        },
        salaryMinEur: 50000,
        salaryMaxEur: 68000,
        level: 'mid',
        experienceYears: 3,
        knowledgeAreas: {
            en: ["Circular Economy", "LCA", "Sustainable Supply Chain", "Data Analysis"],
            es: ["Economía Circular", "ACV", "Cadena de Suministro Sostenible", "Análisis de Datos"],
            de: ["Kreislaufwirtschaft", "Ökobilanz", "Nachhaltige Lieferkette", "Datenanalyse"],
            fr: ["Économie Circulaire", "ACV", "Chaîne d'Approvisionnement Durable", "Analyse de Données"],
            it: ["Economia Circolare", "LCA", "Supply Chain Sostenibile", "Analisi Dati"],
            pl: ["Gospodarka Obiegu Zamkniętego", "LCA", "Zrównoważony Łańcuch Dostaw", "Analiza Danych"],
            nl: ["Circulaire Economie", "LCA", "Duurzame Toeleveringsketen", "Data-analyse"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Analyze product lifecycle and material flows to improve circularity across furniture supply chains in Europe.",
            es: "Analiza el ciclo de vida de productos y flujos de materiales para mejorar la circularidad en cadenas de suministro de mobiliario en Europa.",
            de: "Analysieren Sie Produktlebenszyklen und Materialflüsse, um die Zirkularität in europäischen Möbellieferketten zu verbessern.",
            fr: "Analysez le cycle de vie des produits et les flux de matériaux pour améliorer la circularité des chaînes d'approvisionnement en Europe.",
            it: "Analizza il ciclo di vita dei prodotti e i flussi di materiali per migliorare la circolarità nelle catene di fornitura in Europa.",
            pl: "Analizuj cykl życia produktów i przepływy materiałów, aby poprawić cyrkularność łańcuchów dostaw mebli w Europie.",
            nl: "Analyseer productlevenscycli en materiaalstromen om circulariteit in Europese meubelketens te verbeteren."
        },
        apply_url: "https://jobs.ikea.com/en",
        logo_url: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j12",
        title: {
            en: "Green Hydrogen Process Engineer",
            es: "Ingeniero/a de Procesos de Hidrógeno Verde",
            de: "Prozessingenieur*in Grüner Wasserstoff",
            fr: "Ingénieur Procédés Hydrogène Vert",
            it: "Ingegnere di Processo Idrogeno Verde",
            pl: "Inżynier Procesów Zielonego Wodoru",
            nl: "Procesingenieur Groene Waterstof"
        },
        company: "Siemens Energy",
        city: {
            en: "Hamburg",
            es: "Hamburgo",
            de: "Hamburg",
            fr: "Hambourg",
            it: "Amburgo",
            pl: "Hamburg",
            nl: "Hamburg"
        },
        country: {
            en: "Germany",
            es: "Alemania",
            de: "Deutschland",
            fr: "Allemagne",
            it: "Germania",
            pl: "Niemcy",
            nl: "Duitsland"
        },
        salaryMinEur: 64000,
        salaryMaxEur: 86000,
        level: 'senior',
        experienceYears: 5,
        knowledgeAreas: {
            en: ["Hydrogen", "Electrolysis", "Process Engineering", "P&ID", "Safety"],
            es: ["Hidrógeno", "Electrólisis", "Ingeniería de Procesos", "P&ID", "Seguridad"],
            de: ["Wasserstoff", "Elektrolyse", "Verfahrenstechnik", "P&ID", "Sicherheit"],
            fr: ["Hydrogène", "Électrolyse", "Génie des Procédés", "P&ID", "Sécurité"],
            it: ["Idrogeno", "Elettrolisi", "Ingegneria di Processo", "P&ID", "Sicurezza"],
            pl: ["Wodór", "Elektroliza", "Inżynieria Procesowa", "P&ID", "Bezpieczeństwo"],
            nl: ["Waterstof", "Elektrolyse", "Procestechniek", "P&ID", "Veiligheid"]
        },
        contract: "full-time",
        remote: false,
        description: {
            en: "Design and optimize green hydrogen plants for industrial decarbonization projects across Europe.",
            es: "Diseña y optimiza plantas de hidrógeno verde para proyectos de descarbonización industrial en Europa.",
            de: "Entwerfen und optimieren Sie Anlagen für grünen Wasserstoff für industrielle Dekarbonisierungsprojekte in Europa.",
            fr: "Concevez et optimisez des usines d'hydrogène vert pour des projets de décarbonation industrielle en Europe.",
            it: "Progetta e ottimizza impianti di idrogeno verde per progetti di decarbonizzazione industriale in Europa.",
            pl: "Projektuj i optymalizuj instalacje zielonego wodoru dla projektów dekarbonizacji przemysłu w Europie.",
            nl: "Ontwerp en optimaliseer groene waterstofinstallaties voor industriële decarbonisatieprojecten in Europa."
        },
        apply_url: "https://jobs.siemens-energy.com/",
        logo_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j13",
        title: {
            en: "Climate Policy Researcher",
            es: "Investigador/a de Política Climática",
            de: "Klimapolitik-Forscher*in",
            fr: "Chercheur en Politique Climatique",
            it: "Ricercatore Politiche Climatiche",
            pl: "Badacz Polityki Klimatycznej",
            nl: "Onderzoeker Klimaatbeleid"
        },
        company: "European Climate Foundation",
        city: {
            en: "Brussels",
            es: "Bruselas",
            de: "Brüssel",
            fr: "Bruxelles",
            it: "Bruxelles",
            pl: "Bruksela",
            nl: "Brussel"
        },
        country: {
            en: "Belgium",
            es: "Bélgica",
            de: "Belgien",
            fr: "Belgique",
            it: "Belgio",
            pl: "Belgia",
            nl: "België"
        },
        salaryMinEur: 54000,
        salaryMaxEur: 70000,
        level: 'mid',
        experienceYears: 3,
        knowledgeAreas: {
            en: ["Climate Policy", "EU Regulation", "Public Affairs", "Research", "Data Storytelling"],
            es: ["Política Climática", "Regulación UE", "Asuntos Públicos", "Investigación", "Narrativa de Datos"],
            de: ["Klimapolitik", "EU-Regulierung", "Public Affairs", "Forschung", "Datenkommunikation"],
            fr: ["Politique Climatique", "Réglementation UE", "Affaires Publiques", "Recherche", "Data Storytelling"],
            it: ["Politica Climatica", "Regolamentazione UE", "Affari Pubblici", "Ricerca", "Data Storytelling"],
            pl: ["Polityka Klimatyczna", "Regulacje UE", "Sprawy Publiczne", "Badania", "Storytelling Danych"],
            nl: ["Klimaatbeleid", "EU-regelgeving", "Public Affairs", "Onderzoek", "Data Storytelling"]
        },
        contract: "full-time",
        remote: true,
        description: {
            en: "Produce policy briefs and evidence-based recommendations to accelerate EU climate action and just transition initiatives.",
            es: "Elabora informes y recomendaciones basadas en evidencia para acelerar la acción climática de la UE y la transición justa.",
            de: "Erstellen Sie Policy Briefs und evidenzbasierte Empfehlungen zur Beschleunigung der EU-Klimamaßnahmen und einer gerechten Transformation.",
            fr: "Produisez des notes de politique publique et des recommandations fondées sur des preuves pour accélérer l'action climatique de l'UE.",
            it: "Produci policy brief e raccomandazioni basate su evidenze per accelerare l'azione climatica dell'UE.",
            pl: "Twórz analizy polityczne i rekomendacje oparte na danych, aby przyspieszyć działania klimatyczne UE.",
            nl: "Maak beleidsnota's en evidence-based aanbevelingen om EU-klimaatactie en een rechtvaardige transitie te versnellen."
        },
        apply_url: "https://europeanclimate.org/jobs/",
        logo_url: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j14",
        title: { en: "Junior Sustainability Analyst", es: "Analista Junior de Sostenibilidad", de: "Junior-Nachhaltigkeitsanalyst*in", fr: "Analyste Junior en Durabilité", it: "Analista Junior di Sostenibilità", pl: "Młodszy Analityk ds. Zrównoważonego Rozwoju", nl: "Junior Duurzaamheidsanalist" },
        company: "B Lab Europe",
        city: { en: "Barcelona", es: "Barcelona", de: "Barcelona", fr: "Barcelone", it: "Barcellona", pl: "Barcelona", nl: "Barcelona" },
        country: { en: "Spain", es: "España", de: "Spanien", fr: "Espagne", it: "Spagna", pl: "Hiszpania", nl: "Spanje" },
        salaryMinEur: 28000, salaryMaxEur: 36000, level: 'junior', experienceYears: 1,
        knowledgeAreas: { en: ["ESG Basics", "Excel", "Reporting", "Stakeholder Mapping"], es: ["Fundamentos ESG", "Excel", "Reportes", "Mapeo de Stakeholders"], de: ["ESG-Grundlagen", "Excel", "Reporting", "Stakeholder-Mapping"], fr: ["Bases ESG", "Excel", "Reporting", "Cartographie des Parties Prenantes"], it: ["Fondamenti ESG", "Excel", "Reportistica", "Mappatura Stakeholder"], pl: ["Podstawy ESG", "Excel", "Raportowanie", "Mapowanie Interesariuszy"], nl: ["ESG-basis", "Excel", "Rapportage", "Stakeholdermapping"] },
        contract: "full-time", remote: true,
        description: { en: "Support ESG assessments and impact reports for mission-driven companies.", es: "Apoya evaluaciones ESG e informes de impacto para empresas con propósito.", de: "Unterstützung von ESG-Bewertungen und Wirkungsberichten für zweckorientierte Unternehmen.", fr: "Soutenir les évaluations ESG et les rapports d'impact pour des entreprises à mission.", it: "Supporta valutazioni ESG e report di impatto per aziende orientate allo scopo.", pl: "Wspieraj oceny ESG i raporty wpływu dla firm z misją.", nl: "Ondersteun ESG-beoordelingen en impactrapporten voor missiegedreven bedrijven." },
        apply_url: "https://www.bcorporation.eu/", logo_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j15",
        title: { en: "Junior Carbon Data Associate", es: "Asociado/a Junior de Datos de Carbono", de: "Junior Carbon Data Associate", fr: "Associé Junior Données Carbone", it: "Junior Carbon Data Associate", pl: "Młodszy Specjalista ds. Danych Węglowych", nl: "Junior Carbon Data Associate" },
        company: "Watershed",
        city: { en: "Dublin", es: "Dublín", de: "Dublin", fr: "Dublin", it: "Dublino", pl: "Dublin", nl: "Dublin" },
        country: { en: "Ireland", es: "Irlanda", de: "Irland", fr: "Irlande", it: "Irlanda", pl: "Irlandia", nl: "Ierland" },
        salaryMinEur: 32000, salaryMaxEur: 42000, level: 'junior', experienceYears: 1,
        knowledgeAreas: { en: ["Carbon Accounting", "SQL", "Excel", "Dashboards"], es: ["Contabilidad de Carbono", "SQL", "Excel", "Dashboards"], de: ["CO2-Bilanzierung", "SQL", "Excel", "Dashboards"], fr: ["Comptabilité Carbone", "SQL", "Excel", "Tableaux de Bord"], it: ["Contabilità del Carbonio", "SQL", "Excel", "Dashboard"], pl: ["Rachunkowość Węglowa", "SQL", "Excel", "Dashboardy"], nl: ["Koolstofboekhouding", "SQL", "Excel", "Dashboards"] },
        contract: "full-time", remote: true,
        description: { en: "Help clean and validate emissions datasets for enterprise climate reporting.", es: "Ayuda a limpiar y validar datasets de emisiones para reportes climáticos empresariales.", de: "Unterstützen Sie bei der Bereinigung und Validierung von Emissionsdaten für Unternehmensberichte.", fr: "Aidez à nettoyer et valider des jeux de données d'émissions pour le reporting climatique.", it: "Aiuta a pulire e validare dataset di emissioni per report climatici aziendali.", pl: "Pomagaj czyścić i walidować zbiory danych emisji do raportowania klimatycznego.", nl: "Help emissiedatasets opschonen en valideren voor klimaatreporting." },
        apply_url: "https://watershed.com/careers", logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j16",
        title: { en: "Renewable Energy Graduate Engineer", es: "Ingeniero/a Graduado en Energías Renovables", de: "Graduate Engineer Erneuerbare Energien", fr: "Ingénieur Junior Énergies Renouvelables", it: "Ingegnere Graduate Energie Rinnovabili", pl: "Inżynier Absolwent Energii Odnawialnej", nl: "Graduate Engineer Hernieuwbare Energie" },
        company: "Acciona Energía",
        city: { en: "Seville", es: "Sevilla", de: "Sevilla", fr: "Séville", it: "Siviglia", pl: "Sewilla", nl: "Sevilla" },
        country: { en: "Spain", es: "España", de: "Spanien", fr: "Espagne", it: "Spagna", pl: "Hiszpania", nl: "Spanje" },
        salaryMinEur: 30000, salaryMaxEur: 39000, level: 'junior', experienceYears: 0,
        knowledgeAreas: { en: ["Solar", "Wind", "SCADA Basics", "AutoCAD"], es: ["Solar", "Eólica", "SCADA Básico", "AutoCAD"], de: ["Solar", "Wind", "SCADA-Grundlagen", "AutoCAD"], fr: ["Solaire", "Éolien", "SCADA Bases", "AutoCAD"], it: ["Solare", "Eolico", "SCADA Base", "AutoCAD"], pl: ["Solar", "Wiatr", "Podstawy SCADA", "AutoCAD"], nl: ["Zon", "Wind", "SCADA Basis", "AutoCAD"] },
        contract: "full-time", remote: false,
        description: { en: "Entry-level role supporting operation and commissioning of renewable plants.", es: "Rol de entrada apoyando operación y puesta en marcha de plantas renovables.", de: "Einstiegsrolle zur Unterstützung von Betrieb und Inbetriebnahme erneuerbarer Anlagen.", fr: "Poste débutant pour soutenir l'exploitation et la mise en service de centrales renouvelables.", it: "Ruolo entry-level a supporto di operation e commissioning di impianti rinnovabili.", pl: "Rola wejściowa wspierająca operacje i uruchomienia instalacji OZE.", nl: "Instapfunctie ter ondersteuning van exploitatie en inbedrijfstelling van hernieuwbare installaties." },
        apply_url: "https://www.acciona.com/careers/", logo_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j17",
        title: { en: "Junior GIS Analyst - Nature Projects", es: "Analista GIS Junior - Proyectos de Naturaleza", de: "Junior GIS-Analyst*in - Naturprojekte", fr: "Analyste SIG Junior - Projets Nature", it: "Analista GIS Junior - Progetti Natura", pl: "Młodszy Analityk GIS - Projekty Przyrodnicze", nl: "Junior GIS-analist - Natuurprojecten" },
        company: "WWF Europe",
        city: { en: "Vienna", es: "Viena", de: "Wien", fr: "Vienne", it: "Vienna", pl: "Wiedeń", nl: "Wenen" },
        country: { en: "Austria", es: "Austria", de: "Österreich", fr: "Autriche", it: "Austria", pl: "Austria", nl: "Oostenrijk" },
        salaryMinEur: 29000, salaryMaxEur: 38000, level: 'junior', experienceYears: 1,
        knowledgeAreas: { en: ["GIS", "QGIS", "Biodiversity", "Cartography"], es: ["GIS", "QGIS", "Biodiversidad", "Cartografía"], de: ["GIS", "QGIS", "Biodiversität", "Kartografie"], fr: ["SIG", "QGIS", "Biodiversité", "Cartographie"], it: ["GIS", "QGIS", "Biodiversità", "Cartografia"], pl: ["GIS", "QGIS", "Bioróżnorodność", "Kartografia"], nl: ["GIS", "QGIS", "Biodiversiteit", "Cartografie"] },
        contract: "full-time", remote: true,
        description: { en: "Map conservation indicators and support spatial analysis for restoration programs.", es: "Mapea indicadores de conservación y apoya análisis espacial para programas de restauración.", de: "Kartieren Sie Naturschutzindikatoren und unterstützen Sie räumliche Analysen für Renaturierungsprogramme.", fr: "Cartographiez des indicateurs de conservation et soutenez l'analyse spatiale pour la restauration.", it: "Mappa indicatori di conservazione e supporta analisi spaziali per programmi di ripristino.", pl: "Mapuj wskaźniki ochrony i wspieraj analizy przestrzenne dla programów odtwarzania.", nl: "Breng natuurbeschermingsindicatoren in kaart en ondersteun ruimtelijke analyses." },
        apply_url: "https://wwfeu.awsassets.panda.org/", logo_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j18",
        title: { en: "Sustainable Mobility Junior PM", es: "PM Junior de Movilidad Sostenible", de: "Junior PM Nachhaltige Mobilität", fr: "PM Junior Mobilité Durable", it: "Junior PM Mobilità Sostenibile", pl: "Młodszy PM ds. Zrównoważonej Mobilności", nl: "Junior PM Duurzame Mobiliteit" },
        company: "Bolt",
        city: { en: "Tallinn", es: "Tallin", de: "Tallinn", fr: "Tallinn", it: "Tallinn", pl: "Tallin", nl: "Tallinn" },
        country: { en: "Estonia", es: "Estonia", de: "Estland", fr: "Estonie", it: "Estonia", pl: "Estonia", nl: "Estland" },
        salaryMinEur: 31000, salaryMaxEur: 42000, level: 'junior', experienceYears: 1,
        knowledgeAreas: { en: ["Project Management", "Mobility", "Operations", "Analytics"], es: ["Gestión de Proyectos", "Movilidad", "Operaciones", "Analítica"], de: ["Projektmanagement", "Mobilität", "Betrieb", "Analytik"], fr: ["Gestion de Projet", "Mobilité", "Opérations", "Analytique"], it: ["Project Management", "Mobilità", "Operations", "Analitica"], pl: ["Zarządzanie Projektami", "Mobilność", "Operacje", "Analityka"], nl: ["Projectmanagement", "Mobiliteit", "Operations", "Analytics"] },
        contract: "full-time", remote: true,
        description: { en: "Coordinate pilot initiatives for low-emission urban transport across EU cities.", es: "Coordina iniciativas piloto para transporte urbano de bajas emisiones en ciudades de la UE.", de: "Koordinieren Sie Pilotinitiativen für emissionsarmen Stadtverkehr in EU-Städten.", fr: "Coordonnez des initiatives pilotes de transport urbain à faibles émissions dans l'UE.", it: "Coordina iniziative pilota per il trasporto urbano a basse emissioni nelle città UE.", pl: "Koordynuj pilotaże niskoemisyjnego transportu miejskiego w miastach UE.", nl: "Coördineer pilotinitiatieven voor emissiearm stadsvervoer in EU-steden." },
        apply_url: "https://careers.bolt.eu/", logo_url: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j19",
        title: { en: "Junior Environmental Educator", es: "Educador/a Ambiental Junior", de: "Junior-Umweltpädagog*in", fr: "Éducateur Environnement Junior", it: "Educatore Ambientale Junior", pl: "Młodszy Edukator Środowiskowy", nl: "Junior Milieueducator" },
        company: "Eco-Schools",
        city: { en: "Lisbon", es: "Lisboa", de: "Lissabon", fr: "Lisbonne", it: "Lisbona", pl: "Lizbona", nl: "Lissabon" },
        country: { en: "Portugal", es: "Portugal", de: "Portugal", fr: "Portugal", it: "Portogallo", pl: "Portugalia", nl: "Portugal" },
        salaryMinEur: 24000, salaryMaxEur: 32000, level: 'junior', experienceYears: 0,
        knowledgeAreas: { en: ["Education", "Workshops", "Climate Literacy", "Community"], es: ["Educación", "Talleres", "Alfabetización Climática", "Comunidad"], de: ["Bildung", "Workshops", "Klimakompetenz", "Gemeinschaft"], fr: ["Éducation", "Ateliers", "Culture Climatique", "Communauté"], it: ["Educazione", "Workshop", "Alfabetizzazione Climatica", "Comunità"], pl: ["Edukacja", "Warsztaty", "Świadomość Klimatyczna", "Społeczność"], nl: ["Educatie", "Workshops", "Klimaatgeletterdheid", "Gemeenschap"] },
        contract: "full-time", remote: false,
        description: { en: "Deliver school and community workshops on sustainability and circular habits.", es: "Imparte talleres escolares y comunitarios sobre sostenibilidad y hábitos circulares.", de: "Führen Sie Schul- und Gemeinschaftsworkshops zu Nachhaltigkeit und Kreislaufverhalten durch.", fr: "Animez des ateliers scolaires et communautaires sur la durabilité.", it: "Conduci workshop scolastici e comunitari su sostenibilità e abitudini circolari.", pl: "Prowadź warsztaty szkolne i społeczne o zrównoważonym rozwoju.", nl: "Geef school- en communityworkshops over duurzaamheid en circulaire gewoonten." },
        apply_url: "https://www.ecoschools.global/", logo_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j20",
        title: { en: "Junior Frontend Developer - Climate App", es: "Desarrollador/a Frontend Junior - App Climática", de: "Junior Frontend Developer - Klima-App", fr: "Développeur Frontend Junior - App Climat", it: "Frontend Developer Junior - App Clima", pl: "Junior Frontend Developer - Aplikacja Klimatyczna", nl: "Junior Frontend Developer - Klimaat App" },
        company: "Too Good To Go",
        city: { en: "Copenhagen", es: "Copenhague", de: "Kopenhagen", fr: "Copenhague", it: "Copenaghen", pl: "Kopenhaga", nl: "Kopenhagen" },
        country: { en: "Denmark", es: "Dinamarca", de: "Dänemark", fr: "Danemark", it: "Danimarca", pl: "Dania", nl: "Denemarken" },
        salaryMinEur: 36000, salaryMaxEur: 47000, level: 'junior', experienceYears: 1,
        knowledgeAreas: { en: ["React", "TypeScript", "UI", "Accessibility"], es: ["React", "TypeScript", "UI", "Accesibilidad"], de: ["React", "TypeScript", "UI", "Barrierefreiheit"], fr: ["React", "TypeScript", "UI", "Accessibilité"], it: ["React", "TypeScript", "UI", "Accessibilità"], pl: ["React", "TypeScript", "UI", "Dostępność"], nl: ["React", "TypeScript", "UI", "Toegankelijkheid"] },
        contract: "full-time", remote: true,
        description: { en: "Build user-facing features that help reduce food waste and emissions.", es: "Construye funcionalidades para usuarios que ayuden a reducir desperdicio alimentario y emisiones.", de: "Entwickeln Sie nutzerorientierte Funktionen zur Reduzierung von Lebensmittelabfällen und Emissionen.", fr: "Développez des fonctionnalités orientées utilisateur pour réduire le gaspillage alimentaire.", it: "Sviluppa funzionalità user-facing per ridurre sprechi alimentari ed emissioni.", pl: "Twórz funkcje dla użytkowników pomagające ograniczać marnowanie żywności i emisje.", nl: "Bouw gebruikersfuncties die voedselverspilling en emissies verminderen." },
        apply_url: "https://careers.toogoodtogo.com/", logo_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j21",
        title: { en: "Junior Biodiversity Consultant", es: "Consultor/a Junior de Biodiversidad", de: "Junior-Biodiversitätsberater*in", fr: "Consultant Junior Biodiversité", it: "Consulente Junior Biodiversità", pl: "Młodszy Konsultant ds. Bioróżnorodności", nl: "Junior Biodiversiteitsconsultant" },
        company: "ERM",
        city: { en: "Paris", es: "París", de: "Paris", fr: "Paris", it: "Parigi", pl: "Paryż", nl: "Parijs" },
        country: { en: "France", es: "Francia", de: "Frankreich", fr: "France", it: "Francia", pl: "Francja", nl: "Frankrijk" },
        salaryMinEur: 30000, salaryMaxEur: 40000, level: 'junior', experienceYears: 1,
        knowledgeAreas: { en: ["Biodiversity", "Field Surveys", "Impact Assessment", "Reporting"], es: ["Biodiversidad", "Trabajo de Campo", "Evaluación de Impacto", "Reportes"], de: ["Biodiversität", "Feldstudien", "Folgenabschätzung", "Reporting"], fr: ["Biodiversité", "Études de Terrain", "Évaluation d'Impact", "Reporting"], it: ["Biodiversità", "Rilievi sul Campo", "Valutazione Impatti", "Reportistica"], pl: ["Bioróżnorodność", "Badania Terenowe", "Ocena Oddziaływania", "Raportowanie"], nl: ["Biodiversiteit", "Veldonderzoek", "Impactbeoordeling", "Rapportage"] },
        contract: "full-time", remote: false,
        description: { en: "Assist on biodiversity baseline studies and nature-positive project design.", es: "Asiste en estudios de línea base de biodiversidad y diseño de proyectos positivos para la naturaleza.", de: "Unterstützung bei Biodiversitäts-Basisstudien und naturpositiver Projektgestaltung.", fr: "Contribuez aux études de référence biodiversité et à la conception de projets positifs pour la nature.", it: "Supporta studi di baseline biodiversità e design di progetti nature-positive.", pl: "Wspieraj badania bazowe bioróżnorodności i projektowanie działań pozytywnych dla przyrody.", nl: "Ondersteun biodiversiteitsbaselinestudies en natuurpositief projectontwerp." },
        apply_url: "https://www.erm.com/careers/", logo_url: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j22",
        title: { en: "Energy Efficiency Audit Trainee", es: "Trainee de Auditoría de Eficiencia Energética", de: "Trainee Energieeffizienz-Audit", fr: "Stagiaire Audit Efficacité Énergétique", it: "Trainee Audit Efficienza Energetica", pl: "Stażysta Audytu Efektywności Energetycznej", nl: "Trainee Energie-efficiëntie Audit" },
        company: "Schneider Electric",
        city: { en: "Lyon", es: "Lyon", de: "Lyon", fr: "Lyon", it: "Lione", pl: "Lyon", nl: "Lyon" },
        country: { en: "France", es: "Francia", de: "Frankreich", fr: "France", it: "Francia", pl: "Francja", nl: "Frankrijk" },
        salaryMinEur: 26000, salaryMaxEur: 34000, level: 'junior', experienceYears: 0,
        knowledgeAreas: { en: ["Energy Audits", "Building Systems", "Excel", "Sustainability"], es: ["Auditorías Energéticas", "Sistemas de Edificios", "Excel", "Sostenibilidad"], de: ["Energieaudits", "Gebäudesysteme", "Excel", "Nachhaltigkeit"], fr: ["Audits Énergétiques", "Systèmes Bâtiment", "Excel", "Durabilité"], it: ["Audit Energetici", "Sistemi Edificio", "Excel", "Sostenibilità"], pl: ["Audyty Energetyczne", "Systemy Budynkowe", "Excel", "Zrównoważony Rozwój"], nl: ["Energie-audits", "Gebouwsystemen", "Excel", "Duurzaamheid"] },
        contract: "internship", remote: false,
        description: { en: "Support on-site and remote audits to identify building energy savings opportunities.", es: "Apoya auditorías presenciales y remotas para identificar oportunidades de ahorro energético en edificios.", de: "Unterstützung bei Vor-Ort- und Remote-Audits zur Identifizierung von Energieeinsparpotenzialen.", fr: "Soutenez des audits sur site et à distance pour identifier des économies d'énergie.", it: "Supporta audit in sede e da remoto per identificare opportunità di risparmio energetico.", pl: "Wspieraj audyty stacjonarne i zdalne w celu identyfikacji oszczędności energii.", nl: "Ondersteun onsite en remote audits om energiebesparingen in gebouwen te identificeren." },
        apply_url: "https://www.se.com/ww/en/about-us/careers/", logo_url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j23",
        title: { en: "Junior Community Climate Organizer", es: "Organizador/a Comunitario Climático Junior", de: "Junior Community Climate Organizer", fr: "Organisateur Communautaire Climat Junior", it: "Junior Community Climate Organizer", pl: "Młodszy Organizator Społeczności Klimatycznej", nl: "Junior Community Climate Organizer" },
        company: "350.org",
        city: { en: "Athens", es: "Atenas", de: "Athen", fr: "Athènes", it: "Atene", pl: "Ateny", nl: "Athene" },
        country: { en: "Greece", es: "Grecia", de: "Griechenland", fr: "Grèce", it: "Grecia", pl: "Grecja", nl: "Griekenland" },
        salaryMinEur: 25000, salaryMaxEur: 34000, level: 'junior', experienceYears: 1,
        knowledgeAreas: { en: ["Community Engagement", "Campaigns", "Climate Justice", "Workshops"], es: ["Participación Comunitaria", "Campañas", "Justicia Climática", "Talleres"], de: ["Community Engagement", "Kampagnen", "Klimagerechtigkeit", "Workshops"], fr: ["Engagement Communautaire", "Campagnes", "Justice Climatique", "Ateliers"], it: ["Coinvolgimento Comunitario", "Campagne", "Giustizia Climatica", "Workshop"], pl: ["Zaangażowanie Społeczności", "Kampanie", "Sprawiedliwość Klimatyczna", "Warsztaty"], nl: ["Community Engagement", "Campagnes", "Klimaatrechtvaardigheid", "Workshops"] },
        contract: "full-time", remote: true,
        description: { en: "Coordinate local climate action events and volunteer mobilization campaigns.", es: "Coordina eventos locales de acción climática y campañas de movilización de voluntariado.", de: "Koordinieren Sie lokale Klimaaktionsveranstaltungen und Freiwilligenkampagnen.", fr: "Coordonnez des événements locaux d'action climatique et des campagnes de mobilisation bénévole.", it: "Coordina eventi locali di azione climatica e campagne di mobilitazione volontaria.", pl: "Koordynuj lokalne wydarzenia klimatyczne i kampanie mobilizacji wolontariuszy.", nl: "Coördineer lokale klimaatactie-evenementen en vrijwilligerscampagnes." },
        apply_url: "https://350.org/jobs/", logo_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j24",
        title: { en: "Junior Climate Operations Associate", es: "Asociado/a Junior de Operaciones Climáticas", de: "Junior Climate Operations Associate", fr: "Associé Junior Opérations Climat", it: "Junior Climate Operations Associate", pl: "Młodszy Specjalista ds. Operacji Klimatycznych", nl: "Junior Climate Operations Associate" },
        company: "Ecosia",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 32000, salaryMaxEur: 42000, level: "junior", experienceYears: 1,
        knowledgeAreas: { en: ["Operations", "Climate Programs", "Spreadsheets", "Reporting"], es: ["Operaciones", "Programas Climáticos", "Hojas de Cálculo", "Reportes"], de: ["Betrieb", "Klimaprogramme", "Tabellen", "Reporting"], fr: ["Opérations", "Programmes Climat", "Tableurs", "Reporting"], it: ["Operations", "Programmi Climatici", "Fogli di Calcolo", "Reportistica"], pl: ["Operacje", "Programy Klimatyczne", "Arkusze", "Raportowanie"], nl: ["Operations", "Klimaatprogramma's", "Spreadsheets", "Rapportage"] },
        contract: "full-time", remote: true,
        description: { en: "Support daily operations of tree-planting and impact initiatives.", es: "Apoya la operación diaria de iniciativas de reforestación e impacto.", de: "Unterstützen Sie den täglichen Betrieb von Baumpflanz- und Impact-Initiativen.", fr: "Soutenez les opérations quotidiennes d'initiatives d'impact et de reforestation.", it: "Supporta le operazioni quotidiane di iniziative di impatto e riforestazione.", pl: "Wspieraj codzienne operacje inicjatyw sadzenia drzew i wpływu.", nl: "Ondersteun dagelijkse operaties van boomplant- en impactinitiatieven." },
        apply_url: "https://www.ecosia.org/jobs", logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j25",
        title: { en: "Junior Sustainability Communications Specialist", es: "Especialista Junior en Comunicación de Sostenibilidad", de: "Junior Sustainability Communications Specialist", fr: "Spécialiste Junior Communication Durabilité", it: "Junior Sustainability Communications Specialist", pl: "Młodszy Specjalista ds. Komunikacji Zrównoważonego Rozwoju", nl: "Junior Sustainability Communications Specialist" },
        company: "Zalando",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 34000, salaryMaxEur: 46000, level: "junior", experienceYears: 1,
        knowledgeAreas: { en: ["Sustainability", "Content", "Campaigns", "Social Media"], es: ["Sostenibilidad", "Contenido", "Campañas", "Redes Sociales"], de: ["Nachhaltigkeit", "Inhalte", "Kampagnen", "Soziale Medien"], fr: ["Durabilité", "Contenu", "Campagnes", "Réseaux Sociaux"], it: ["Sostenibilità", "Contenuti", "Campagne", "Social Media"], pl: ["Zrównoważony Rozwój", "Treści", "Kampanie", "Social Media"], nl: ["Duurzaamheid", "Content", "Campagnes", "Social Media"] },
        contract: "full-time", remote: true,
        description: { en: "Create climate and ESG communication materials for customer-facing channels.", es: "Crea materiales de comunicación climática y ESG para canales de cara al cliente.", de: "Erstellen Sie Klima- und ESG-Kommunikationsmaterialien für kundennahe Kanäle.", fr: "Créez des contenus de communication climat et ESG pour des canaux grand public.", it: "Crea materiali di comunicazione climatica ed ESG per canali customer-facing.", pl: "Twórz materiały komunikacyjne klimatyczne i ESG dla kanałów klienckich.", nl: "Maak klimaat- en ESG-communicatiemateriaal voor klantkanalen." },
        apply_url: "https://jobs.zalando.com/en/", logo_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j26",
        title: { en: "Junior ESG Data Coordinator", es: "Coordinador/a Junior de Datos ESG", de: "Junior ESG Data Coordinator", fr: "Coordinateur Junior Données ESG", it: "Junior ESG Data Coordinator", pl: "Młodszy Koordynator Danych ESG", nl: "Junior ESG Data Coordinator" },
        company: "N26",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 35000, salaryMaxEur: 48000, level: "junior", experienceYears: 1,
        knowledgeAreas: { en: ["ESG", "Data Quality", "SQL", "Dashboards"], es: ["ESG", "Calidad de Datos", "SQL", "Dashboards"], de: ["ESG", "Datenqualität", "SQL", "Dashboards"], fr: ["ESG", "Qualité des Données", "SQL", "Tableaux de Bord"], it: ["ESG", "Qualità Dati", "SQL", "Dashboard"], pl: ["ESG", "Jakość Danych", "SQL", "Dashboardy"], nl: ["ESG", "Datakwaliteit", "SQL", "Dashboards"] },
        contract: "full-time", remote: true,
        description: { en: "Maintain ESG data pipelines and support reporting for stakeholders.", es: "Mantén pipelines de datos ESG y apoya reportes para stakeholders.", de: "Pflegen Sie ESG-Datenpipelines und unterstützen Sie das Reporting für Stakeholder.", fr: "Maintenez des pipelines de données ESG et soutenez le reporting.", it: "Mantieni pipeline dati ESG e supporta il reporting per stakeholder.", pl: "Utrzymuj pipeline danych ESG i wspieraj raportowanie.", nl: "Onderhoud ESG-datapipelines en ondersteun rapportage." },
        apply_url: "https://n26.com/en-eu/careers", logo_url: "https://images.unsplash.com/photo-1551281044-8b7f4f3ebf6f?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j27",
        title: { en: "Junior Renewable Procurement Analyst", es: "Analista Junior de Compras Renovables", de: "Junior Renewable Procurement Analyst", fr: "Analyste Junior Achats Renouvelables", it: "Junior Renewable Procurement Analyst", pl: "Młodszy Analityk Zakupów OZE", nl: "Junior Renewable Procurement Analyst" },
        company: "Vattenfall",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 36000, salaryMaxEur: 50000, level: "junior", experienceYears: 1,
        knowledgeAreas: { en: ["Renewables", "Procurement", "Excel", "Energy Markets"], es: ["Renovables", "Compras", "Excel", "Mercados Energéticos"], de: ["Erneuerbare", "Einkauf", "Excel", "Energiemärkte"], fr: ["Renouvelables", "Achats", "Excel", "Marchés de l'Énergie"], it: ["Rinnovabili", "Procurement", "Excel", "Mercati Energetici"], pl: ["OZE", "Zakupy", "Excel", "Rynki Energii"], nl: ["Hernieuwbaar", "Inkoop", "Excel", "Energiemarkten"] },
        contract: "full-time", remote: true,
        description: { en: "Assist procurement teams in sourcing renewable electricity contracts.", es: "Asiste al equipo de compras en contratación de electricidad renovable.", de: "Unterstützen Sie Einkaufsteams bei der Beschaffung erneuerbarer Stromverträge.", fr: "Assistez les équipes achats dans l'approvisionnement en contrats d'électricité renouvelable.", it: "Supporta i team procurement nella fornitura di contratti di elettricità rinnovabile.", pl: "Wspieraj zespoły zakupowe w pozyskiwaniu kontraktów na energię odnawialną.", nl: "Ondersteun inkoopteams bij het inkopen van hernieuwbare stroomcontracten." },
        apply_url: "https://group.vattenfall.com/careers", logo_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j28",
        title: { en: "Junior Product Manager - Green Fintech", es: "Product Manager Junior - Fintech Verde", de: "Junior Product Manager - Green Fintech", fr: "Chef de Produit Junior - Fintech Verte", it: "Junior Product Manager - Green Fintech", pl: "Młodszy Product Manager - Green Fintech", nl: "Junior Product Manager - Green Fintech" },
        company: "Tomorrow Bank",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 38000, salaryMaxEur: 52000, level: "junior", experienceYears: 1,
        knowledgeAreas: { en: ["Product", "Agile", "Sustainability", "User Research"], es: ["Producto", "Agile", "Sostenibilidad", "Investigación de Usuarios"], de: ["Produkt", "Agile", "Nachhaltigkeit", "Nutzerforschung"], fr: ["Produit", "Agile", "Durabilité", "Recherche Utilisateur"], it: ["Prodotto", "Agile", "Sostenibilità", "Ricerca Utente"], pl: ["Produkt", "Agile", "Zrównoważony Rozwój", "Badania Użytkowników"], nl: ["Product", "Agile", "Duurzaamheid", "Gebruikersonderzoek"] },
        contract: "full-time", remote: true,
        description: { en: "Help ship banking features that nudge users toward low-carbon spending.", es: "Ayuda a lanzar funcionalidades bancarias que impulsen gasto bajo en carbono.", de: "Unterstützen Sie die Einführung von Banking-Funktionen für emissionsarmes Verhalten.", fr: "Aidez à lancer des fonctionnalités bancaires orientées faible carbone.", it: "Aiuta a rilasciare funzionalità bancarie che favoriscono spese a basse emissioni.", pl: "Pomagaj wdrażać funkcje bankowe promujące niskoemisyjne wydatki.", nl: "Help bankfuncties lanceren die gebruikers richting koolstofarm gedrag sturen." },
        apply_url: "https://www.tomorrow.one/en-DE/careers", logo_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j29",
        title: { en: "Junior QA Engineer - Climate Platform", es: "QA Engineer Junior - Plataforma Climática", de: "Junior QA Engineer - Climate Platform", fr: "Ingénieur QA Junior - Plateforme Climat", it: "Junior QA Engineer - Piattaforma Climatica", pl: "Młodszy QA Engineer - Platforma Klimatyczna", nl: "Junior QA Engineer - Klimaatplatform" },
        company: "Plan A",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 33000, salaryMaxEur: 45000, level: "junior", experienceYears: 1,
        knowledgeAreas: { en: ["QA", "Testing", "TypeScript", "Automation"], es: ["QA", "Testing", "TypeScript", "Automatización"], de: ["QA", "Testing", "TypeScript", "Automatisierung"], fr: ["QA", "Tests", "TypeScript", "Automatisation"], it: ["QA", "Testing", "TypeScript", "Automazione"], pl: ["QA", "Testowanie", "TypeScript", "Automatyzacja"], nl: ["QA", "Testing", "TypeScript", "Automatisering"] },
        contract: "full-time", remote: true,
        description: { en: "Ensure reliability of climate accounting features through manual and automated tests.", es: "Asegura confiabilidad de funcionalidades de contabilidad climática con pruebas manuales y automáticas.", de: "Sichern Sie die Zuverlässigkeit von Klima-Accounting-Features durch manuelle und automatisierte Tests.", fr: "Assurez la fiabilité des fonctionnalités de comptabilité carbone via des tests.", it: "Garantisci l'affidabilità delle funzionalità di carbon accounting con test manuali e automatici.", pl: "Zapewniaj niezawodność funkcji carbon accounting poprzez testy manualne i automatyczne.", nl: "Waarborg betrouwbaarheid van klimaatboekhoudfuncties via handmatige en geautomatiseerde tests." },
        apply_url: "https://plana.earth/careers", logo_url: "https://images.unsplash.com/photo-1451187530220-3816127e1302?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j30",
        title: { en: "Junior Customer Success - Carbon Software", es: "Customer Success Junior - Software de Carbono", de: "Junior Customer Success - Carbon Software", fr: "Customer Success Junior - Logiciel Carbone", it: "Junior Customer Success - Software Carbonio", pl: "Młodszy Customer Success - Oprogramowanie Węglowe", nl: "Junior Customer Success - Carbon Software" },
        company: "ClimatePartner",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 31000, salaryMaxEur: 43000, level: "junior", experienceYears: 0,
        knowledgeAreas: { en: ["Customer Success", "SaaS", "Carbon Footprint", "Onboarding"], es: ["Customer Success", "SaaS", "Huella de Carbono", "Onboarding"], de: ["Customer Success", "SaaS", "CO2-Fußabdruck", "Onboarding"], fr: ["Customer Success", "SaaS", "Empreinte Carbone", "Onboarding"], it: ["Customer Success", "SaaS", "Impronta di Carbonio", "Onboarding"], pl: ["Customer Success", "SaaS", "Ślad Węglowy", "Onboarding"], nl: ["Customer Success", "SaaS", "Ecologische Voetafdruk", "Onboarding"] },
        contract: "full-time", remote: true,
        description: { en: "Support onboarding and adoption of carbon management software for SMB clients.", es: "Apoya el onboarding y adopción de software de gestión de carbono para pymes.", de: "Unterstützen Sie Onboarding und Nutzung von Carbon-Management-Software für KMU.", fr: "Soutenez l'onboarding et l'adoption d'un logiciel de gestion carbone pour PME.", it: "Supporta onboarding e adozione di software di gestione carbonio per PMI.", pl: "Wspieraj onboarding i adopcję oprogramowania do zarządzania emisjami dla MŚP.", nl: "Ondersteun onboarding en adoptie van carbon management software voor mkb-klanten." },
        apply_url: "https://www.climatepartner.com/en/careers", logo_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j31",
        title: { en: "Junior Backend Developer - Energy APIs", es: "Desarrollador/a Backend Junior - APIs de Energía", de: "Junior Backend Developer - Energy APIs", fr: "Développeur Backend Junior - APIs Énergie", it: "Backend Developer Junior - API Energia", pl: "Młodszy Backend Developer - API Energetyczne", nl: "Junior Backend Developer - Energie API's" },
        company: "Enpal",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 39000, salaryMaxEur: 53000, level: "junior", experienceYears: 1,
        knowledgeAreas: { en: ["Node.js", "APIs", "PostgreSQL", "Cloud"], es: ["Node.js", "APIs", "PostgreSQL", "Cloud"], de: ["Node.js", "APIs", "PostgreSQL", "Cloud"], fr: ["Node.js", "APIs", "PostgreSQL", "Cloud"], it: ["Node.js", "API", "PostgreSQL", "Cloud"], pl: ["Node.js", "API", "PostgreSQL", "Cloud"], nl: ["Node.js", "API's", "PostgreSQL", "Cloud"] },
        contract: "full-time", remote: true,
        description: { en: "Build and maintain APIs powering rooftop solar and home energy products.", es: "Construye y mantiene APIs para productos de energía solar residencial.", de: "Erstellen und warten Sie APIs für Dachsolar- und Heimenergieprodukte.", fr: "Construisez et maintenez des APIs pour des produits solaires résidentiels.", it: "Sviluppa e mantieni API per prodotti solari residenziali.", pl: "Twórz i utrzymuj API dla domowych produktów energii słonecznej.", nl: "Bouw en onderhoud API's voor zonne-energieproducten voor woningen." },
        apply_url: "https://www.enpal.com/jobs", logo_url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j32",
        title: { en: "Junior Talent Coordinator - Green Jobs", es: "Coordinador/a Junior de Talento - Empleos Verdes", de: "Junior Talent Coordinator - Green Jobs", fr: "Coordinateur Talent Junior - Green Jobs", it: "Junior Talent Coordinator - Green Jobs", pl: "Młodszy Koordynator Talentów - Zielone Prace", nl: "Junior Talent Coordinator - Green Jobs" },
        company: "Helpling Green",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 30000, salaryMaxEur: 41000, level: "junior", experienceYears: 0,
        knowledgeAreas: { en: ["Recruiting", "People Ops", "Coordination", "ATS"], es: ["Recruiting", "People Ops", "Coordinación", "ATS"], de: ["Recruiting", "People Ops", "Koordination", "ATS"], fr: ["Recrutement", "People Ops", "Coordination", "ATS"], it: ["Recruiting", "People Ops", "Coordinamento", "ATS"], pl: ["Rekrutacja", "People Ops", "Koordynacja", "ATS"], nl: ["Recruiting", "People Ops", "Coördinatie", "ATS"] },
        contract: "full-time", remote: true,
        description: { en: "Coordinate hiring pipelines for climate and sustainability teams.", es: "Coordina procesos de contratación para equipos de clima y sostenibilidad.", de: "Koordinieren Sie Einstellungsprozesse für Klima- und Nachhaltigkeitsteams.", fr: "Coordonnez les pipelines de recrutement pour des équipes climat et durabilité.", it: "Coordina i processi di selezione per team clima e sostenibilità.", pl: "Koordynuj procesy rekrutacji dla zespołów klimatycznych i zrównoważonego rozwoju.", nl: "Coördineer wervingsprocessen voor klimaat- en duurzaamheidsteams." },
        apply_url: "https://www.helpling.com/careers", logo_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j33",
        title: { en: "Junior UX Researcher - Sustainable Products", es: "UX Researcher Junior - Productos Sostenibles", de: "Junior UX Researcher - Sustainable Products", fr: "UX Researcher Junior - Produits Durables", it: "Junior UX Researcher - Prodotti Sostenibili", pl: "Młodszy UX Researcher - Produkty Zrównoważone", nl: "Junior UX Researcher - Duurzame Producten" },
        company: "Miro Climate Initiatives",
        city: { en: "Berlin", es: "Berlín", de: "Berlin", fr: "Berlin", it: "Berlino", pl: "Berlin", nl: "Berlijn" },
        country: { en: "Germany", es: "Alemania", de: "Deutschland", fr: "Allemagne", it: "Germania", pl: "Niemcy", nl: "Duitsland" },
        salaryMinEur: 36000, salaryMaxEur: 49000, level: "junior", experienceYears: 1,
        knowledgeAreas: { en: ["UX Research", "Interviews", "Prototyping", "Behavior Change"], es: ["UX Research", "Entrevistas", "Prototipado", "Cambio de Comportamiento"], de: ["UX-Forschung", "Interviews", "Prototyping", "Verhaltensänderung"], fr: ["Recherche UX", "Entretiens", "Prototypage", "Changement de Comportement"], it: ["UX Research", "Interviste", "Prototipazione", "Cambio Comportamentale"], pl: ["Badania UX", "Wywiady", "Prototypowanie", "Zmiana Zachowań"], nl: ["UX Research", "Interviews", "Prototyping", "Gedragsverandering"] },
        contract: "full-time", remote: true,
        description: { en: "Run user research to improve adoption of sustainable digital product features.", es: "Realiza investigación de usuarios para mejorar adopción de funcionalidades sostenibles.", de: "Führen Sie Nutzerforschung zur Verbesserung nachhaltiger Produktfunktionen durch.", fr: "Menez des recherches utilisateurs pour améliorer l'adoption de fonctionnalités durables.", it: "Conduci ricerche utente per migliorare l'adozione di funzionalità sostenibili.", pl: "Prowadź badania użytkowników, aby poprawić adopcję zrównoważonych funkcji produktu.", nl: "Voer gebruikersonderzoek uit om adoptie van duurzame productfuncties te verbeteren." },
        apply_url: "https://miro.com/careers/", logo_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=200&auto=format&fit=crop"
    }
];
