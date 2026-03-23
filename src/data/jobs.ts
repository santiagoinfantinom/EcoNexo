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
            de: "Projektleiter Erneuerbare Energien",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=European%20Energy%20Renewable%20Energy%20Project%20Manager",
        logo_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j2",
        title: {
            en: "Battery Systems Engineer",
            es: "Ingeniero de Sistemas de Baterías",
            de: "Batteriesystemingenieur",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=Northvolt%20Battery%20Systems%20Engineer",
        logo_url: "https://images.unsplash.com/photo-1569163139394-de6e4f6f4c8a?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j3",
        title: {
            en: "Wind Turbine Technician",
            es: "Técnico de Turbinas Eólicas",
            de: "Windturbinentechniker",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=Vestas%20Wind%20Turbine%20Technician",
        logo_url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j4",
        title: {
            en: "Offshore Wind Engineer",
            es: "Ingeniero de Eólica Marina",
            de: "Offshore-Windingenieur",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=%C3%98rsted%20Offshore%20Wind%20Engineer",
        logo_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j5",
        title: {
            en: "Solar PV Design Engineer",
            es: "Ingeniero de Diseño Solar Fotovoltaico",
            de: "Solar-PV-Designingenieur",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=Enel%20Green%20Power%20Solar%20PV%20Design%20Engineer",
        logo_url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j6",
        title: {
            en: "Software Engineer - Green Search",
            es: "Ingeniero de Software - Búsqueda Verde",
            de: "Softwareingenieur - Grüne Suche",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=Ecosia%20Software%20Engineer%20-%20Green%20Search",
        logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j7",
        title: {
            en: "Climate Data Scientist",
            es: "Científico de Datos Climáticos",
            de: "Klimadenwissenschaftler",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=ClimateAI%20Climate%20Data%20Scientist",
        logo_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j8",
        title: {
            en: "Sustainability Software Developer",
            es: "Desarrollador de Software de Sostenibilidad",
            de: "Nachhaltigkeits-Softwareentwickler",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=Plan%20A%20Sustainability%20Software%20Developer",
        logo_url: "https://images.unsplash.com/photo-1451187530220-3816127e1302?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j9",
        title: {
            en: "ESG Reporting Manager",
            es: "Gerente de Informes ESG",
            de: "ESG-Berichtsmanager",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=Siemens%20ESG%20Reporting%20Manager",
        logo_url: "https://images.unsplash.com/photo-1516383740770-fbcc5c2477ff?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: "real_j10",
        title: {
            en: "Sustainability Consultant",
            es: "Consultor de Sostenibilidad",
            de: "Nachhaltigkeitsberater",
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
        apply_url: "https://www.linkedin.com/jobs/search/?keywords=Deloitte%20Sustainability%20Consultant",
        logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop"
    }
];
