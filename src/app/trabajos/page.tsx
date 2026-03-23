"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useI18n, locationLabel } from "@/lib/i18n";
import { useToast } from "@/components/ToastNotification";
import { CardSkeleton } from "@/components/SkeletonLoader";
import { jobCurator, ScrapedJob } from "@/services/agents/JobCurator";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Star,
  CheckCircle2,
  Heart,
  ExternalLink,
  Plus,
  Bot,
  Terminal,
  Cpu
} from "lucide-react";

type LocalizedString = string | Record<string, string>;
type LocalizedArray = string[] | Record<string, string[]>;

type Job = {
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
  logo_url?: string; // New field for company logos
  isCurated?: boolean; // New field for agent jobs
  curatorLog?: string[]; // New field for agent logs
};

const translateTag = (tag: string, t: (key: string) => string): string => {
  // Convertir a minúsculas y sin espacios ni puntos para buscar en las traducciones
  const normalizedTag = tag.toLowerCase().replace(/[\s\.]+/g, '');
  return t(normalizedTag) || tag;
};

const JOBS: Job[] = [
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
      fr: "Concevoir et valider des systèmes de gestion de batteries pour les véhicules électriques de nouvelle génération.",
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

  // === REAL JOBS 2026 - CLIMATE TECH & SOFTWARE ===
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
      de: "Klimadatenwissenschaftler",
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

  // === REAL JOBS 2026 - ESG & SUSTAINABILITY CONSULTING ===
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
  },
  {
    id: "real_j11",
    title: {
      en: "Environmental Consultant",
      es: "Consultor Ambiental",
      de: "Umweltberater",
      fr: "Consultant Environnemental",
      it: "Consulente Ambientale",
      pl: "Konsultant Środowiskowy",
      nl: "Milieuconsultant"
    },
    company: "Arcadis",
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
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["EIA", "Sustainability Strategy", "Soil Remediation", "Permitting"],
      es: ["EIA", "Estrategia de Sostenibilidad", "Remediación de Suelos", "Permisos"],
      de: ["UVP", "Nachhaltigkeitsstrategie", "Bodensanierung", "Genehmigungsverfahren"],
      fr: ["EIE", "Stratégie Durabilité", "Assainissement des Sols", "Permis"],
      it: ["VIA", "Strategia Sostenibilità", "Bonifica Suoli", "Permessi"],
      pl: ["OOŚ", "Strategia Zrównoważonego Rozwoju", "Remediacja Gleby", "Pozwolenia"],
      nl: ["MER", "Duurzaamheidsstrategie", "Bodemsanering", "Vergunningen"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Deliver environmental consulting services for sustainable infrastructure projects. Assess environmental impacts and design mitigation strategies.",
      es: "Ofrecer servicios de consultoría ambiental para proyectos de infraestructura sostenible. Evaluar impactos ambientales y diseñar estrategias de mitigación.",
      de: "Erbringung von Umweltberatungsleistungen für nachhaltige Infrastrukturprojekte. Bewertung von Umweltauswirkungen.",
      fr: "Fournir des services de conseil environnemental pour des projets d'infrastructure durable.",
      it: "Fornire servizi di consulenza ambientale per progetti di infrastrutture sostenibili.",
      pl: "Świadczenie usług doradztwa środowiskowego dla projektów infrastruktury zrównoważonej.",
      nl: "Lever milieuadviesdiensten voor duurzame infrastructuurprojecten."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Arcadis%20Environmental%20Consultant",
    logo_url: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=200&auto=format&fit=crop"
  },

  // === REAL JOBS 2026 - CIRCULAR ECONOMY & WASTE ===
  // === REAL JOBS 2026 - CIRCULAR ECONOMY & WASTE ===
  {
    id: "real_j12",
    title: {
      en: "Circular Economy Specialist",
      es: "Especialista en Economía Circular",
      de: "Spezialist für Kreislaufwirtschaft",
      fr: "Spécialiste de l'Économie Circulaire",
      it: "Specialista in Economia Circolare",
      pl: "Specjalista ds. Gospodarki o Obiegu Zamkniętym",
      nl: "Specialist Circulaire Economie"
    },
    company: "IKEA",
    city: {
      en: "Malmo",
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
    salaryMinEur: 48000,
    salaryMaxEur: 62000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Circular Economy", "Product Design", "Material Innovation", "LCA", "Sustainability"],
      es: ["Economía Circular", "Diseño de Producto", "Innovación de Materiales", "ACV", "Sostenibilidad"],
      de: ["Kreislaufwirtschaft", "Produktdesign", "Materialinnovation", "Ökobilanz", "Nachhaltigkeit"],
      fr: ["Économie Circulaire", "Conception de Produits", "Innovation Matérielle", "ACV", "Durabilité"],
      it: ["Economia Circolare", "Design del Prodotto", "Innovazione dei Materiali", "LCA", "Sostenibilità"],
      pl: ["Gospodarka o Obiegu Zamkniętym", "Projektowanie Produktu", "Innowacje Materiałowe", "LCA", "Zrównoważony Rozwój"],
      nl: ["Circulaire Economie", "Productontwerp", "Materiaalinnovatie", "LCA", "Duurzaamheid"]
    },
    contract: "full-time",
    remote: false,
    description: {
      en: "Drive IKEA's circular transformation. Work on furniture take-back programs, redesign products for circularity, and develop new circular business models.",
      es: "Impulsar la transformación circular de IKEA. Trabajar en programas de recuperación de muebles, rediseñar productos para la circularidad y desarrollar nuevos modelos de negocio circulares.",
      de: "Vorantreiben der zirkulären Transformation von IKEA. Arbeit an Möbelrücknahmeprogrammen.",
      fr: "Piloter la transformation circulaire d'IKEA. Travailler sur les programmes de reprise de meubles.",
      it: "Guidare la trasformazione circolare di IKEA.",
      pl: "Kieruj transformacją cyrkularną IKEA.",
      nl: "Stuur de circulaire transformatie van IKEA aan."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=IKEA%20Circular%20Economy%20Specialist",
    logo_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "real_j13",
    title: {
      en: "Circular Economy Specialist",
      es: "Especialista en Economía Circular",
      de: "Spezialist für Kreislaufwirtschaft",
      fr: "Spécialiste de l'Économie Circulaire",
      it: "Specialista in Economia Circolare",
      pl: "Specjalista ds. Gospodarki o Obiegu Zamkniętym",
      nl: "Specialist Circulaire Economie"
    },
    company: "Ecoembes",
    city: {
      en: "Madrid",
      es: "Madrid",
      de: "Madrid",
      fr: "Madrid",
      it: "Madrid",
      pl: "Madryt",
      nl: "Madrid"
    },
    country: {
      en: "Spain",
      es: "España",
      de: "Spanien",
      fr: "Espagne",
      it: "Spagna",
      pl: "Hiszpania",
      nl: "Spanje"
    },
    salaryMinEur: 38000,
    salaryMaxEur: 48000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Recycling", "Ecodesign", "Waste Management", "Regulations"],
      es: ["Reciclaje", "Ecodiseño", "Gestión de Residuos", "Normativa"],
      de: ["Recycling", "Ökodesign", "Abfallmanagement", "Vorschriften"],
      fr: ["Recyclage", "Écoconception", "Gestion des Déchets", "Réglementations"],
      it: ["Riciclaggio", "Eco-design", "Gestione Rifiuti", "Normative"],
      pl: ["Recykling", "Ekoprojektowanie", "Gospodarka Odpadami", "Przepisy"],
      nl: ["Recycling", "Ecodesign", "Afvalbeheer", "Regelgeving"]
    },
    contract: "full-time",
    remote: false,
    description: {
      en: "Drive innovation projects in circular economy and packaging management. Collaborate with companies to improve the sustainability of their packaging and processes.",
      es: "Impulsar proyectos de innovación en economía circular y gestión de envases. Colaborar con empresas para mejorar la sostenibilidad de sus envases y procesos.",
      de: "Vorantreiben von Innovationsprojekten in der Kreislaufwirtschaft.",
      fr: "Piloter des projets d'innovation en économie circulaire.",
      it: "Guidare progetti di innovazione nell'economia circolare.",
      pl: "Kieruj projektami innowacyjnymi w gospodarce o obiegu zamkniętym.",
      nl: "Stuur innovatieprojecten in de circulaire economie aan."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Ecoembes%20Circular%20Economy%20Specialist",
    logo_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "real_j14",
    title: {
      en: "Packaging Sustainability Manager",
      es: "Gerente de Sostenibilidad de Envases",
      de: "Verpackungsnachhaltigkeitsmanager",
      fr: "Responsable Durabilité Emballage",
      it: "Responsabile Sostenibilità Imballaggi",
      pl: "Menedżer ds. Zrównoważonego Rozwoju Opakowań",
      nl: "Manager Verpakkingsduurzaamheid"
    },
    company: "Unilever",
    city: {
      en: "Rotterdam",
      es: "Róterdam",
      de: "Rotterdam",
      fr: "Rotterdam",
      it: "Rotterdam",
      pl: "Rotterdam",
      nl: "Rotterdam"
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
    salaryMaxEur: 70000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: {
      en: ["Packaging", "Circular Economy", "Materials Science", "Recycling", "LCA"],
      es: ["Envases", "Economía Circular", "Ciencia de Materiales", "Reciclaje", "ACV"],
      de: ["Verpackung", "Kreislaufwirtschaft", "Materialwissenschaft", "Recycling", "Ökobilanz"],
      fr: ["Emballage", "Économie Circulaire", "Science des Matériaux", "Recyclage", "ACV"],
      it: ["Imballaggio", "Economia Circolare", "Scienza dei Materiali", "Riciclaggio", "LCA"],
      pl: ["Opakowania", "Gospodarka o Obiegu Zamkniętym", "Nauka o Materiałach", "Recykling", "LCA"],
      nl: ["Verpakking", "Circulaire Economie", "Materiaalwetenschap", "Recycling", "LCA"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Lead Unilever's transition to 100% reusable, recyclable, or compostable packaging. Partner with suppliers and innovators to eliminate plastic waste.",
      es: "Liderar la transición de Unilever hacia envases 100% reutilizables, reciclables o compostables. Asociarse con proveedores e innovadores para eliminar los residuos plásticos.",
      de: "Leitung des Übergangs von Unilever zu 100% nachhaltigen Verpackungen.",
      fr: "Diriger la transition d'Unilever vers des emballages 100% durables.",
      it: "Guidare la transizione di Unilever verso imballaggi sostenibili.",
      pl: "Kieruj przejściem Unilever na opakowania zrównoważone.",
      nl: "Leid de overgang van Unilever naar duurzame verpakkingen."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Unilever%20Packaging%20Sustainability%20Manager",
    logo_url: "https://images.unsplash.com/photo-1556761175-5973cf0f32e7?q=80&w=200&auto=format&fit=crop"
  },

  // === REAL JOBS 2026 - NGOs & ADVOCACY ===
  {
    id: "real_j15",
    title: {
      en: "Climate Change Project Officer",
      es: "Técnico de Proyectos de Cambio Climático",
      de: "Projektbeauftragter Klimawandel",
      fr: "Chargé de Projet Changement Climatique",
      it: "Responsabile Progetti Cambiamento Climatico",
      pl: "Specjalista ds. Projektów Klimatycznych",
      nl: "Projectmedewerker Klimaatverandering"
    },
    company: "Greenpeace España",
    city: {
      en: "Madrid",
      es: "Madrid",
      de: "Madrid",
      fr: "Madrid",
      it: "Madrid",
      pl: "Madryt",
      nl: "Madrid"
    },
    country: {
      en: "Spain",
      es: "España",
      de: "Spanien",
      fr: "Espagne",
      it: "Spagna",
      pl: "Hiszpania",
      nl: "Spanje"
    },
    salaryMinEur: 32000,
    salaryMaxEur: 40000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Campaigns", "Political Advocacy", "Communication", "Energy"],
      es: ["Campañas", "Incidencia política", "Comunicación", "Energía"],
      de: ["Kampagnen", "Politische Interessenvertretung", "Kommunikation", "Energie"],
      fr: ["Campagnes", "Plaidoyer Politique", "Communication", "Énergie"],
      it: ["Campagne", "Patrocinio Politico", "Comunicazione", "Energia"],
      pl: ["Kampanie", "Rzecznictwo Polityczne", "Komunikacja", "Energia"],
      nl: ["Campagnes", "Politieke Belangenbehartiging", "Communicatie", "Energie"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Develop campaigns for energy transition and climate justice. Coordinate actions, research energy policies, and mobilize citizens.",
      es: "Desarrollar campañas para la transición energética y la justicia climática. Coordinar acciones, investigar políticas energéticas y movilizar a la ciudadanía.",
      de: "Entwicklung von Kampagnen für Energiewende und Klimagerechtigkeit.",
      fr: "Développer des campagnes pour la transition énergétique et la justice climatique.",
      it: "Sviluppare campagne per la transizione energetica e la giustizia climatica.",
      pl: "Opracowywanie kampanii na rzecz transformacji energetycznej i sprawiedliwości klimatycznej.",
      nl: "Ontwikkel campagnes voor energietransitie en klimaatrechtvaardigheid."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Greenpeace%20Espa%C3%B1a%20Climate%20Change%20Project%20Officer",
    logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "real_j16",
    title: {
      en: "Climate Policy Analyst",
      es: "Analista de Política Climática",
      de: "Klimapolitischer Analyst",
      fr: "Analyste Politique Climatique",
      it: "Analista Politica Climatica",
      pl: "Analityk Polityki Klimatycznej",
      nl: "Klimaatbeleidsanalist"
    },
    company: "WWF European Policy Office",
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
    salaryMinEur: 42000,
    salaryMaxEur: 54000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Climate Policy", "EU Legislation", "Advocacy", "Research", "Stakeholder Engagement"],
      es: ["Política Climática", "Legislación UE", "Incidencia", "Investigación", "Participación de Interesados"],
      de: ["Klimapolitik", "EU-Gesetzgebung", "Interessenvertretung", "Forschung", "Stakeholder-Engagement"],
      fr: ["Politique Climatique", "Législation UE", "Plaidoyer", "Recherche", "Engagement des Parties Prenantes"],
      it: ["Politica Climatica", "Legislazione UE", "Patrocinio", "Ricerca", "Coinvolgimento Stakeholder"],
      pl: ["Polityka Klimatyczna", "Ustawodawstwo UE", "Rzecznictwo", "Badania", "Zaangażowanie Interesariuszy"],
      nl: ["Klimaatbeleid", "EU Wetgeving", "Belangenbehartiging", "Onderzoek", "Stakeholder Betrokkenheid"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Influence EU climate and energy policy. Monitor legislation, engage with policymakers, and coordinate with WWF's global network to drive ambitious climate action.",
      es: "Influir en la política climática y energética de la UE. Monitorear la legislación, interactuar con los responsables políticos y coordinar con la red global de WWF para impulsar una acción climática ambiciosa.",
      de: "Einflussnahme auf die EU-Klima- und Energiepolitik. Überwachung der Gesetzgebung.",
      fr: "Influencer la politique climatique et énergétique de l'UE.",
      it: "Influenzare la politica climatica ed energetica dell'UE.",
      pl: "Wpływaj na politykę klimatyczną i energetyczną UE.",
      nl: "Beïnvloed het EU-klimaat- en energiebeleid."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=WWF%20European%20Policy%20Office%20Climate%20Policy%20Analyst",
    logo_url: "https://images.unsplash.com/photo-1510672981848-a1c4f1cb58f1?q=80&w=200&auto=format&fit=crop"
  },

  // === REAL JOBS 2026 - CLEAN CHEMICALS & MATERIALS ===
  {
    id: "real_j17",
    title: {
      en: "Sustainability Innovation Manager",
      es: "Gerente de Innovación en Sostenibilidad",
      de: "Manager für Nachhaltigkeitsinnovation",
      fr: "Responsable Innovation Durable",
      it: "Manager Innovazione Sostenibilità",
      pl: "Menedżer Innowacji Zrównoważonego Rozwoju",
      nl: "Manager Duurzaamheidsinnovatie"
    },
    company: "BASF",
    city: {
      en: "Ludwigshafen",
      es: "Ludwigshafen",
      de: "Ludwigshafen",
      fr: "Ludwigshafen",
      it: "Ludwigshafen",
      pl: "Ludwigshafen",
      nl: "Ludwigshafen"
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
    salaryMinEur: 62000,
    salaryMaxEur: 78000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: {
      en: ["Chemical Engineering", "Green Chemistry", "Innovation", "LCA", "Sustainability"],
      es: ["Ingeniería Química", "Química Verde", "Innovación", "ACV", "Sostenibilidad"],
      de: ["Verfahrenstechnik", "Grüne Chemie", "Innovation", "Ökobilanz", "Nachhaltigkeit"],
      fr: ["Génie Chimique", "Chimie Verte", "Innovation", "ACV", "Durabilité"],
      it: ["Ingegneria Chimica", "Chimica Verde", "Innovazione", "LCA", "Sostenibilità"],
      pl: ["Inżynieria Chemiczna", "Zielona Chemia", "Innowacje", "LCA", "Zrównoważony Rozwój"],
      nl: ["Chemische Technologie", "Groene Chemie", "Innovatie", "LCA", "Duurzaamheid"]
    },
    contract: "full-time",
    remote: false,
    description: {
      en: "Drive sustainability innovations at the world's leading chemical company. Develop low-carbon processes and bio-based materials for the circular economy.",
      es: "Impulsar innovaciones en química sostenible en la empresa química líder mundial. Desarrollar procesos bajos en carbono y materiales de base biológica para la economía circular.",
      de: "Vorantreiben von Nachhaltigkeitsinnovationen beim weltführenden Chemieunternehmen.",
      fr: "Piloter les innovations en matière de durabilité chez le leader mondial de la chimie.",
      it: "Guidare le innovazioni di sostenibilità presso l'azienda chimica leader mondiale.",
      pl: "Kieruj innowacjami w zakresie zrównoważonego rozwoju w wiodącej na świecie firmie chemicznej.",
      nl: "Stuur duurzaamheidsinnovaties aan bij 's werelds toonaangevende chemiebedrijf."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=BASF%20Sustainability%20Innovation%20Manager",
    logo_url: "https://images.unsplash.com/photo-1516383740770-fbcc5c2477ff?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "real_j18",
    title: {
      en: "Bio-based Materials Scientist",
      es: "Científico de Materiales Bio-basados",
      de: "Wissenschaftler für biobasierte Materialien",
      fr: "Scientifique Matériaux Biosourcés",
      it: "Scienziato Materiali Bio-based",
      pl: "Naukowiec ds. Materiałów Biopochodnych",
      nl: "Wetenschapper Bio-based Materialen"
    },
    company: "Neste",
    city: {
      en: "Espoo",
      es: "Espoo",
      de: "Espoo",
      fr: "Espoo",
      it: "Espoo",
      pl: "Espoo",
      nl: "Espoo"
    },
    country: {
      en: "Finland",
      es: "Finlandia",
      de: "Finnland",
      fr: "Finlande",
      it: "Finlandia",
      pl: "Finlandia",
      nl: "Finland"
    },
    salaryMinEur: 52000,
    salaryMaxEur: 68000,
    level: 'mid',
    experienceYears: 4,
    knowledgeAreas: {
      en: ["Materials Science", "Biochemistry", "Renewable Feedstocks", "R&D", "LCA"],
      es: ["Ciencia de Materiales", "Bioquímica", "Materias Primas Renovables", "I+D", "ACV"],
      de: ["Materialwissenschaft", "Biochemie", "Erneuerbare Rohstoffe", "F&E", "Ökobilanz"],
      fr: ["Science des Matériaux", "Biochimie", "Matières Premières Renouvelables", "R&D", "ACV"],
      it: ["Scienza dei Materiali", "Biochimica", "Materie Prime Rinnovabili", "R&D", "LCA"],
      pl: ["Nauka o Materiałach", "Biochemia", "Surowce Odnawialne", "B+R", "LCA"],
      nl: ["Materiaalwetenschap", "Biochemie", "Hernieuwbare Grondstoffen", "R&D", "LCA"]
    },
    contract: "full-time",
    remote: false,
    description: {
      en: "Develop next-gen renewable plastics and fuels from waste. Join the world's leading producer of renewable diesel and sustainable aviation fuel.",
      es: "Desarrollar plásticos y combustibles renovables de próxima generación a partir de residuos. Únete al productor líder mundial de diésel renovable y combustible de aviación sostenible.",
      de: "Entwicklung von erneuerbaren Kunststoffen und Kraftstoffen der nächsten Generation aus Abfällen.",
      fr: "Développer des plastiques et des carburants renouvelables de nouvelle génération à partir de déchets.",
      it: "Sviluppare plastiche e combustibili rinnovabili di prossima generazione dai rifiuti.",
      pl: "Opracowywanie tworzyw sztucznych i paliw odnawialnych nowej generacji z odpadów.",
      nl: "Ontwikkel hernieuwbare kunststoffen en brandstoffen van de volgende generatie uit afval."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Neste%20Bio-based%20Materials%20Scientist",
    logo_url: "https://images.unsplash.com/photo-1569163139394-de6e4f6f4c8a?q=80&w=200&auto=format&fit=crop"
  },

  // === REAL JOBS 2026 - SUSTAINABLE FINANCE ===
  {
    id: "real_j19",
    title: {
      en: "Sustainable Finance Analyst",
      es: "Analista de Finanzas Sostenibles",
      de: "Analyst für nachhaltige Finanzen",
      fr: "Analyste Finance Durable",
      it: "Analista Finanza Sostenibile",
      pl: "Analityk Zrównoważonych Finansów",
      nl: "Analist Duurzame Financiering"
    },
    company: "European Investment Bank",
    city: {
      en: "Luxembourg",
      es: "Luxemburgo",
      de: "Luxemburg",
      fr: "Luxembourg",
      it: "Lussemburgo",
      pl: "Luksemburg",
      nl: "Luxemburg"
    },
    country: {
      en: "Luxembourg",
      es: "Luxemburgo",
      de: "Luxemburg",
      fr: "Luxembourg",
      it: "Lussemburgo",
      pl: "Luksemburg",
      nl: "Luxemburg"
    },
    salaryMinEur: 58000,
    salaryMaxEur: 75000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Green Finance", "Project Finance", "ESG", "Climate Risk", "EU Taxonomy"],
      es: ["Finanzas Verdes", "Financiación de Proyectos", "ESG", "Riesgo Climático", "Taxonomía UE"],
      de: ["Green Finance", "Projektfinanzierung", "ESG", "Klimarisiko", "EU-Taxonomie"],
      fr: ["Finance Verte", "Financement de Projet", "ESG", "Risque Climatique", "Taxonomie UE"],
      it: ["Finanza Verde", "Finanza di Progetto", "ESG", "Rischio Climatico", "Tassonomia UE"],
      pl: ["Zielone Finanse", "Finansowanie Projektów", "ESG", "Ryzyko Klimatyczne", "Taksonomia UE"],
      nl: ["Groene Financiering", "Projectfinanciering", "ESG", "Klimaatrisico", "EU Taxonomie"]
    },
    contract: "full-time",
    remote: false,
    description: {
      en: "Finance Europe's green transition. Assess climate and environmental projects for the EU's climate bank. Work on renewable energy, energy efficiency, and sustainable transport.",
      es: "Financiar la transición verde de Europa. Evaluar proyectos climáticos y ambientales para el banco climático de la UE. Trabajar en energía renovable, eficiencia energética y transporte sostenible.",
      de: "Finanzierung der grünen Transformation Europas.",
      fr: "Financer la transition verte de l'Europe.",
      it: "Finanziare la transizione verde dell'Europa.",
      pl: "Finansuj zieloną transformację Europy.",
      nl: "Financier de groene overgang van Europa."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=European%20Investment%20Bank%20Sustainable%20Finance%20Analyst",
    logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "real_j20",
    title: {
      en: "Climate Risk Analyst",
      es: "Analista de Riesgo Climático",
      de: "Klimarisikoanalyst",
      fr: "Analyste Risque Climatique",
      it: "Analista Rischio Climatico",
      pl: "Analityk Ryzyka Klimatycznego",
      nl: "Klimaatrisico Analist"
    },
    company: "Allianz",
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
    salaryMinEur: 52000,
    salaryMaxEur: 68000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Climate Risk", "Financial Modeling", "TCFD", "Scenario Analysis", "Insurance"],
      es: ["Riesgo Climático", "Modelado Financiero", "TCFD", "Análisis de Escenarios", "Seguros"],
      de: ["Klimarisiko", "Finanzmodellierung", "TCFD", "Szenarioanalyse", "Versicherung"],
      fr: ["Risque Climatique", "Modélisation Financière", "TCFD", "Analyse de Scénarios", "Assurance"],
      it: ["Rischio Climatico", "Modellazione Finanziaria", "TCFD", "Analisi Scenari", "Assicurazione"],
      pl: ["Ryzyko Klimatyczne", "Modelowanie Finansowe", "TCFD", "Analiza Scenariuszy", "Ubezpieczenia"],
      nl: ["Klimaatrisico", "Financiële Modellering", "TCFD", "Scenario-analyse", "Verzekering"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Model physical and transition climate risks for insurance portfolios. Help Allianz adapt to climate change and support clients in their transition.",
      es: "Modelar riesgos climáticos físicos y de transición para carteras de seguros. Ayudar a Allianz a adaptarse al cambio climático y apoyar a los clientes en su transición.",
      de: "Modellierung physischer und transitorischer Klimarisiken für Versicherungsportfolios.",
      fr: "Modéliser les risques climatiques physiques et de transition pour les portefeuilles d'assurance.",
      it: "Modellare i rischi climatici fisici e di transizione per i portafogli assicurativi.",
      pl: "Modeluj fizyczne i przejściowe ryzyka klimatyczne dla portfeli ubezpieczeniowych.",
      nl: "Modelleer fysieke en transitieklimaatrisico's voor verzekeringsportefeuilles."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Allianz%20Climate%20Risk%20Analyst",
    logo_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=200&auto=format&fit=crop"
  },

  // === REAL JOBS 2026 - SUSTAINABLE MOBILITY ===
  {
    id: "real_j21",
    title: {
      en: "E-Mobility Product Manager",
      es: "Gerente de Producto E-Mobility",
      de: "Produktmanager E-Mobilität",
      fr: "Chef de Produit E-Mobilité",
      it: "Product Manager E-Mobility",
      pl: "Menedżer Produktu E-Mobilności",
      nl: "Productmanager E-Mobility"
    },
    company: "BMW Group",
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
    salaryMinEur: 62000,
    salaryMaxEur: 78000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: {
      en: ["EVs", "Product Management", "Charging Infrastructure", "Battery Tech", "Mobility Services"],
      es: ["Vehículos Eléctricos", "Gestión de Producto", "Infraestructura de Carga", "Tecnología de Baterías", "Servicios de Movilidad"],
      de: ["Elektrofahrzeuge", "Produktmanagement", "Ladeinfrastruktur", "Batterietechnologie", "Mobilitätsdienstleistungen"],
      fr: ["Véhicules Électriques", "Gestion de Produit", "Infrastructure de Recharge", "Technologie Batterie", "Services Mobilité"],
      it: ["Veicoli Elettrici", "Gestione Prodotto", "Infrastruttura Ricarica", "Tecnologia Batterie", "Servizi Mobilità"],
      pl: ["Pojazdy Elektryczne", "Zarządzanie Produktem", "Infrastruktura Ładowania", "Technologia Baterii", "Usługi Mobilności"],
      nl: ["Elektrische Voertuigen", "Productmanagement", "Laadinfrastructuur", "Batterijtechnologie", "Mobiliteitsdiensten"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Shape the future of electric mobility. Lead product development for BMW's EV ecosystem, including charging solutions and digital services.",
      es: "Dar forma al futuro de la movilidad eléctrica. Liderar el desarrollo de productos para el ecosistema de vehículos eléctricos de BMW, incluyendo soluciones de carga y servicios digitales.",
      de: "Gestaltung der Zukunft der Elektromobilität. Leitung der Produktentwicklung für das EV-Ökosystem von BMW.",
      fr: "Façonner l'avenir de la mobilité électrique. Diriger le développement de produits pour l'écosystème VE de BMW.",
      it: "Dare forma al futuro della mobilità elettrica. Guidare lo sviluppo del prodotto per l'ecosistema EV di BMW.",
      pl: "Kształtuj przyszłość elektromobilności. Kieruj rozwojem produktów dla ekosystemu EV BMW.",
      nl: "Geef vorm aan de toekomst van elektrische mobiliteit. Leid productontwikkeling voor BMW's EV-ecosysteem."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=BMW%20Group%20E-Mobility%20Product%20Manager",
    logo_url: "https://images.unsplash.com/photo-1520183802803-06f731a2059f?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "real_j22",
    title: {
      en: "Urban Mobility Planner",
      es: "Planificador de Movilidad Urbana",
      de: "Planer für urbane Mobilität",
      fr: "Planificateur Mobilité Urbaine",
      it: "Pianificatore Mobilità Urbana",
      pl: "Planista Mobilności Miejskiej",
      nl: "Stedelijke Mobiliteitsplanner"
    },
    company: "Ramboll",
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
    salaryMinEur: 46000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Urban Planning", "Sustainable Mobility", "GIS", "Traffic Modeling", "Policy"],
      es: ["Planificación Urbana", "Movilidad Sostenible", "GIS", "Modelado de Tráfico", "Política"],
      de: ["Stadtplanung", "Nachhaltige Mobilität", "GIS", "Verkehrsmodellierung", "Politik"],
      fr: ["Urbanisme", "Mobilité Durable", "SIG", "Modélisation du Trafic", "Politique"],
      it: ["Pianificazione Urbana", "Mobilità Sostenibile", "GIS", "Modellazione Traffico", "Politica"],
      pl: ["Planowanie Miejskie", "Zrównoważona Mobilność", "GIS", "Modelowanie Ruchu", "Polityka"],
      nl: ["Stedenbouw", "Duurzame Mobiliteit", "GIS", "Verkeersmodellering", "Beleid"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Design sustainable transport solutions for European cities. Promote cycling, public transport, and zero-emission zones to reduce urban carbon footprint.",
      es: "Diseñar soluciones de transporte sostenible para ciudades europeas. Promover el ciclismo, el transporte público y zonas de cero emisiones para reducir la huella de carbono urbana.",
      de: "Entwurf nachhaltiger Verkehrslösungen für europäische Städte.",
      fr: "Concevoir des solutions de transport durable pour les villes européennes.",
      it: "Progettare soluzioni di trasporto sostenibile per le città europee.",
      pl: "Projektowanie zrównoważonych rozwiązań transportowych dla miast europejskich.",
      nl: "Ontwerp duurzame transportoplossingen voor Europese steden."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Ramboll%20Urban%20Mobility%20Planner",
    logo_url: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=200&auto=format&fit=crop"
  },

  // === REAL JOBS 2026 - FOOD & AGRICULTURE ===
  {
    id: "real_j23",
    title: {
      en: "Sustainable Agriculture Specialist",
      es: "Especialista en Agricultura Sostenible",
      de: "Spezialist für nachhaltige Landwirtschaft",
      fr: "Spécialiste Agriculture Durable",
      it: "Specialista Agricoltura Sostenibile",
      pl: "Specjalista ds. Rolnictwa Zrównoważonego",
      nl: "Specialist Duurzame Landbouw"
    },
    company: "Danone",
    city: {
      en: "Paris",
      es: "París",
      de: "Paris",
      fr: "Paris",
      it: "Parigi",
      pl: "Paryż",
      nl: "Parijs"
    },
    country: {
      en: "France",
      es: "Francia",
      de: "Frankreich",
      fr: "France",
      it: "Francia",
      pl: "Francja",
      nl: "Frankrijk"
    },
    salaryMinEur: 48000,
    salaryMaxEur: 62000,
    level: 'mid',
    experienceYears: 4,
    knowledgeAreas: {
      en: ["Regenerative Agriculture", "Supply Chain", "Soil Health", "Carbon Farming", "Dairy"],
      es: ["Agricultura Regenerativa", "Cadena de Suministro", "Salud del Suelo", "Cultivo de Carbono", "Lácteos"],
      de: ["Regenerative Landwirtschaft", "Lieferkette", "Bodengesundheit", "Carbon Farming", "Milchprodukte"],
      fr: ["Agriculture Régénératrice", "Chaîne d'Approvisionnement", "Santé des Sols", "Carbon Farming", "Produits Laitiers"],
      it: ["Agricoltura Rigenerativa", "Catena di Approvvigionamento", "Salute del Suolo", "Carbon Farming", "Latticini"],
      pl: ["Rolnictwo Regeneracyjne", "Łańcuch Dostaw", "Zdrowie Gleby", "Rolnictwo Węglowe", "Nabiał"],
      nl: ["Regeneratieve Landbouw", "Toeleveringsketen", "Bodemgezondheid", "Koolstoflandbouw", "Zuivel"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Work with dairy farmers to implement regenerative practices. Reduce carbon footprint, improve soil health, and enhance biodiversity in Danone's supply chain.",
      es: "Trabajar con productores de leche para implementar prácticas regenerativas. Reducir la huella de carbono, mejorar la salud del suelo y aumentar la biodiversidad en la cadena de suministro de Danone.",
      de: "Zusammenarbeit mit Milchbauern zur Umsetzung regenerativer Praktiken.",
      fr: "Travailler avec les producteurs laitiers pour mettre en œuvre des pratiques régénératrices.",
      it: "Lavorare con gli allevatori per implementare pratiche rigenerative.",
      pl: "Współpraca z producentami mleka w celu wdrożenia praktyk regeneracyjnych.",
      nl: "Werk samen met melkveehouders om regeneratieve praktijken te implementeren."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Danone%20Sustainable%20Agriculture%20Specialist",
    logo_url: "https://images.unsplash.com/photo-1556761175-5973cf0f32e7?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "real_j24",
    title: {
      en: "Food Waste Reduction Manager",
      es: "Gerente de Reducción de Desperdicio de Alimentos",
      de: "Manager für Lebensmittelabfallreduzierung",
      fr: "Responsable Réduction Gaspillage Alimentaire",
      it: "Manager Riduzione Sprechi Alimentari",
      pl: "Menedżer ds. Redukcji Marnowania Żywności",
      nl: "Manager Voedselverspillingreductie"
    },
    company: "Too Good To Go",
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
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Food Waste", "Supply Chain", "Business Development", "Sustainability", "Operations"],
      es: ["Desperdicio de Alimentos", "Cadena de Suministro", "Desarrollo de Negocios", "Sostenibilidad", "Operaciones"],
      de: ["Lebensmittelverschwendung", "Lieferkette", "Geschäftsentwicklung", "Nachhaltigkeit", "Betrieb"],
      fr: ["Gaspillage Alimentaire", "Chaîne d'Approvisionnement", "Développement Commercial", "Durabilité", "Opérations"],
      it: ["Spreco Alimentare", "Catena di Approvvigionamento", "Sviluppo Business", "Sostenibilità", "Operazioni"],
      pl: ["Marnowanie Żywności", "Łańcuch Dostaw", "Rozwój Biznesu", "Zrównoważony Rozwój", "Operacje"],
      nl: ["Voedselverspilling", "Toeleveringsketen", "Business Development", "Duurzaamheid", "Operaties"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Fight food waste with Europe's largest surplus food marketplace. Partner with businesses to save unsold food and reduce environmental impact.",
      es: "Luchar contra el desperdicio de alimentos con el mercado de excedentes de alimentos más grande de Europa. Asociarse con empresas para salvar alimentos no vendidos y reducir el impacto ambiental.",
      de: "Kampf gegen Lebensmittelverschwendung mit Europas größtem Marktplatz für überschüssige Lebensmittel.",
      fr: "Lutter contre le gaspillage alimentaire avec la plus grande place de marché d'invendus alimentaires en Europe.",
      it: "Combattere lo spreco alimentare con il più grande mercato di eccedenze alimentari in Europa.",
      pl: "Walcz z marnowaniem żywności dzięki największemu w Europie rynkowi nadwyżek żywności.",
      nl: "Bestrijd voedselverspilling met Europa's grootste marktplaats voor surplusvoedsel."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Too%20Good%20To%20Go%20Food%20Waste%20Reduction%20Manager",
    logo_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop"
  },

  // === REAL JOBS 2026 - ENERGY EFFICIENCY & BUILDINGS ===
  {
    id: "real_j25",
    title: {
      en: "Building Energy Engineer",
      es: "Ingeniero de Energía en Edificación",
      de: "Gebäudeenergieingenieur",
      fr: "Ingénieur Énergie Bâtiment",
      it: "Ingegnere Energetico Edile",
      pl: "Inżynier Energetyki Budynkowej",
      nl: "Gebouw Energie Ingenieur"
    },
    company: "Schneider Electric",
    city: {
      en: "Grenoble",
      es: "Grenoble",
      de: "Grenoble",
      fr: "Grenoble",
      it: "Grenoble",
      pl: "Grenoble",
      nl: "Grenoble"
    },
    country: {
      en: "France",
      es: "Francia",
      de: "Frankreich",
      fr: "France",
      it: "Francia",
      pl: "Francja",
      nl: "Frankrijk"
    },
    salaryMinEur: 48000,
    salaryMaxEur: 62000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["BMS", "Energy Efficiency", "HVAC", "IoT", "Smart Buildings"],
      es: ["Sistemas de Gestión de Edificios", "Eficiencia Energética", "HVAC", "IoT", "Edificios Inteligentes"],
      de: ["GLT", "Energieeffizienz", "HLK", "IoT", "Smart Buildings"],
      fr: ["GTC/GTB", "Efficacité Énergétique", "CVC", "IoT", "Bâtiments Intelligents"],
      it: ["BMS", "Efficienza Energetica", "HVAC", "IoT", "Smart Buildings"],
      pl: ["BMS", "Efektywność Energetyczna", "HVAC", "IoT", "Inteligentne Budynki"],
      nl: ["GBS", "Energie-efficiëntie", "HVAC", "IoT", "Smart Buildings"]
    },
    contract: "full-time",
    remote: false,
    description: {
      en: "Design smart building solutions to optimize energy consumption. Deploy IoT sensors and AI-driven controls to cut building emissions by up to 50%.",
      es: "Diseñar soluciones de edificios inteligentes para optimizar el consumo de energía. Desplegar sensores IoT y controles impulsados por IA para reducir las emisiones de los edificios hasta en un 50%.",
      de: "Entwurf von Smart-Building-Lösungen zur Optimierung des Energieverbrauchs.",
      fr: "Concevoir des solutions de bâtiment intelligent pour optimiser la consommation d'énergie.",
      it: "Progettare soluzioni di smart building per ottimizzare i consumi energetici.",
      pl: "Projektowanie rozwiązań inteligentnych budynków w celu optymalizacji zużycia energii.",
      nl: "Ontwerp smart building-oplossingen om energieverbruik te optimaliseren."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Schneider%20Electric%20Building%20Energy%20Engineer",
    logo_url: "https://images.unsplash.com/photo-1516383740770-fbcc5c2477ff?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "real_j26",
    title: {
      en: "Green Building Consultant",
      es: "Consultor de Edificación Verde",
      de: "Berater für grünes Bauen",
      fr: "Consultant Bâtiment Durable",
      it: "Consulente Green Building",
      pl: "Konsultant ds. Zielonego Budownictwa",
      nl: "Adviseur Groen Bouwen"
    },
    company: "Buro Happold",
    city: {
      en: "London",
      es: "Londres",
      de: "London",
      fr: "Londres",
      it: "Londra",
      pl: "Londyn",
      nl: "Londen"
    },
    country: {
      en: "United Kingdom",
      es: "Reino Unido",
      de: "Vereinigtes Königreich",
      fr: "Royaume-Uni",
      it: "Regno Unito",
      pl: "Wielka Brytania",
      nl: "Verenigd Koninkrijk"
    },
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["LEED", "BREEAM", "Energy Modeling", "Sustainability Consulting", "Net Zero"],
      es: ["LEED", "BREEAM", "Modelado Energético", "Consultoría de Sostenibilidad", "Net Zero"],
      de: ["LEED", "BREEAM", "Energiemodellierung", "Nachhaltigkeitsberatung", "Netto-Null"],
      fr: ["LEED", "BREEAM", "Modélisation Énergétique", "Conseil Durabilité", "Net Zéro"],
      it: ["LEED", "BREEAM", "Modellazione Energetica", "Consulenza Sostenibilità", "Net Zero"],
      pl: ["LEED", "BREEAM", "Modelowanie Energetyczne", "Doradztwo Zrównoważonego Rozwoju", "Net Zero"],
      nl: ["LEED", "BREEAM", "Energiemodellering", "Duurzaamheidsadvies", "Netto Nul"]
    },
    contract: "full-time",
    remote: true,
    description: {
      en: "Deliver LEED and BREEAM certifications for landmark buildings. Guide architects and developers to achieve net zero carbon targets.",
      es: "Entregar certificaciones LEED y BREEAM para edificios emblemáticos. Guiar a arquitectos y desarrolladores para alcanzar objetivos de carbono neto cero.",
      de: "Bereitstellung von LEED- und BREEAM-Zertifizierungen für Wahrzeichen-Gebäude.",
      fr: "Délivrer des certifications LEED et BREEAM pour des bâtiments emblématiques.",
      it: "Fornire certificazioni LEED e BREEAM per edifici storici.",
      pl: "Dostarczanie certyfikatów LEED i BREEAM dla przełomowych budynków.",
      nl: "Lever LEED- en BREEAM-certificeringen voor prominente gebouwen."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Buro%20Happold%20Green%20Building%20Consultant",
    logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop"
  },

  // === REAL JOBS 2026 - WATER & ENVIRONMENT ===
  {
    id: "real_j27",
    title: {
      en: "Water Technology Engineer",
      es: "Ingeniero de Tecnología del Agua",
      de: "Wassertechnologieingenieur",
      fr: "Ingénieur Technologies de l'Eau",
      it: "Ingegnere Tecnologie Idriche",
      pl: "Inżynier Technologii Wody",
      nl: "Watertechnologie Ingenieur"
    },
    company: "Veolia",
    city: {
      en: "Paris",
      es: "París",
      de: "Paris",
      fr: "Paris",
      it: "Parigi",
      pl: "Paryż",
      nl: "Parijs"
    },
    country: {
      en: "France",
      es: "Francia",
      de: "Frankreich",
      fr: "France",
      it: "Francia",
      pl: "Francja",
      nl: "Frankrijk"
    },
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Water Treatment", "Wastewater", "Membrane Tech", "Process Engineering", "Sustainability"],
      es: ["Tratamiento de Agua", "Aguas Residuales", "Tecnología de Membranas", "Ingeniería de Procesos", "Sostenibilidad"],
      de: ["Wasseraufbereitung", "Abwasser", "Membrantechnologie", "Verfahrenstechnik", "Nachhaltigkeit"],
      fr: ["Traitement de l'Eau", "Eaux Usées", "Technologie Membranaire", "Génie des Procédés", "Durabilité"],
      it: ["Trattamento Acque", "Acque Reflue", "Tecnologia a Membrana", "Ingegneria di Processo", "Sostenibilità"],
      pl: ["Uzdatnianie Wody", "Ścieki", "Technologia Membranowa", "Inżynieria Procesowa", "Zrównoważony Rozwój"],
      nl: ["Waterzuivering", "Afvalwater", "Membraantechnologie", "Procestechniek", "Duurzaamheid"]
    },
    contract: "full-time",
    remote: false,
    description: {
      en: "Design and optimize water treatment systems. Ensure access to clean water while minimizing energy consumption and environmental impact.",
      es: "Diseñar y optimizar sistemas de tratamiento de agua. Asegurar el acceso a agua limpia mientras se minimiza el consumo de energía y el impacto ambiental.",
      de: "Entwurf und Optimierung von Wasseraufbereitungssystemen.",
      fr: "Concevoir et optimiser des systèmes de traitement de l'eau.",
      it: "Progettare e ottimizzare sistemi di trattamento delle acque.",
      pl: "Projektowanie i optymalizacja systemów uzdatniania wody.",
      nl: "Ontwerp en optimaliseer waterzuiveringssystemen."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Veolia%20Water%20Technology%20Engineer",
    logo_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=200&auto=format&fit=crop"
  },

  // === PART-TIME JOBS 2026 ===
  {
    id: "pt_j1",
    title: {
      en: "Sustainability Coordinator (Part-Time)",
      es: "Coordinador de Sostenibilidad (Tiempo Parcial)",
      de: "Nachhaltigkeitskoordinator (Teilzeit)",
      fr: "Coordinateur Durabilité (Temps Partiel)",
      it: "Coordinatore Sostenibilità (Part-Time)",
      pl: "Koordynator ds. Zrównoważonego Rozwoju (Na część etatu)",
      nl: "Duurzaamheidscoördinator (Deeltijd)"
    },
    company: "European Climate Foundation",
    city: {
      en: "Remote",
      es: "Remoto",
      de: "Remote",
      fr: "Télétravail",
      it: "Remoto",
      pl: "Zdalnie",
      nl: "Remote"
    },
    country: {
      en: "Europe",
      es: "Europa",
      de: "Europa",
      fr: "Europe",
      it: "Europa",
      pl: "Europa",
      nl: "Europa"
    },
    salaryMinEur: 25000,
    salaryMaxEur: 35000,
    level: 'mid',
    experienceYears: 2,
    knowledgeAreas: {
      en: ["Climate Policy", "Project Coordination", "Stakeholder Engagement", "Remote Work", "EU Policy"],
      es: ["Política Climática", "Coordinación de Proyectos", "Participación de Interesados", "Trabajo Remoto", "Política UE"],
      de: ["Klimapolitik", "Projektkoordination", "Stakeholder-Engagement", "Remote-Arbeit", "EU-Politik"],
      fr: ["Politique Climatique", "Coordination de Projet", "Engagement des Parties Prenantes", "Télétravail", "Politique UE"],
      it: ["Politica Climatica", "Coordinamento Progetti", "Coinvolgimento Stakeholder", "Lavoro Remoto", "Politica UE"],
      pl: ["Polityka Klimatyczna", "Koordynacja Projektów", "Zaangażowanie Interesariuszy", "Praca Zdalna", "Polityka UE"],
      nl: ["Klimaatbeleid", "Projectcoördinatie", "Stakeholder Betrokkenheid", "Remote Werk", "EU Beleid"]
    },
    contract: "part-time",
    remote: true,
    description: {
      en: "Support climate initiatives across Europe (20-30 hrs/week). Coordinate projects, engage with partners, and contribute to the climate transition from anywhere in Europe.",
      es: "Apoyar iniciativas climáticas en toda Europa (20-30 hrs/semana). Coordinar proyectos, interactuar con socios y contribuir a la transición climática desde cualquier lugar de Europa.",
      de: "Unterstützung von Klimainitiativen in ganz Europa (20-30 Std./Woche).",
      fr: "Soutenir les initiatives climatiques à travers l'Europe (20-30 h/semaine).",
      it: "Supportare le iniziative climatiche in tutta Europa (20-30 ore/settimana).",
      pl: "Wspieraj inicjatywy klimatyczne w całej Europie (20-30 godz./tydzień).",
      nl: "Ondersteun klimaatinitiatieven in heel Europa (20-30 uur/week)."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=European%20Climate%20Foundation%20Sustainability%20Coordinator%20(Part-Time)",
    logo_url: "https://images.unsplash.com/photo-1550005808-721262d51785?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "pt_j2",
    title: {
      en: "Remote ESG Reporting Analyst",
      es: "Analista de Informes ESG Remoto",
      de: "Remote ESG-Berichtsanalyst",
      fr: "Analyste Reporting ESG à Distance",
      it: "Analista Reporting ESG Remoto",
      pl: "Zdalny Analityk Raportowania ESG",
      nl: "Remote ESG-rapportage Analist"
    },
    company: "Sustainable Finance Platform",
    city: {
      en: "Remote",
      es: "Remoto",
      de: "Remote",
      fr: "Télétravail",
      it: "Remoto",
      pl: "Zdalnie",
      nl: "Remote"
    },
    country: {
      en: "Europe",
      es: "Europa",
      de: "Europa",
      fr: "Europe",
      it: "Europa",
      pl: "Europa",
      nl: "Europa"
    },
    salaryMinEur: 28000,
    salaryMaxEur: 38000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["ESG Reporting", "CSRD", "GRI Standards", "Data Analysis", "Excel"],
      es: ["Informes ESG", "CSRD", "Estándares GRI", "Análisis de Datos", "Excel"],
      de: ["ESG-Berichterstattung", "CSRD", "GRI-Standards", "Datenanalyse", "Excel"],
      fr: ["Reporting ESG", "CSRD", "Normes GRI", "Analyse de Données", "Excel"],
      it: ["Reporting ESG", "CSRD", "Standard GRI", "Analisi Dati", "Excel"],
      pl: ["Raportowanie ESG", "CSRD", "Standardy GRI", "Analiza Danych", "Excel"],
      nl: ["ESG-rapportage", "CSRD", "GRI Standaarden", "Data-analyse", "Excel"]
    },
    contract: "part-time",
    remote: true,
    description: {
      en: "Analyze and report ESG data for European SMEs (25 hrs/week). Work remotely helping companies comply with new sustainability reporting requirements.",
      es: "Analizar y reportar datos ESG para PYMEs europeas (25 hrs/semana). Trabaja de forma remota ayudando a las empresas a cumplir con los nuevos requisitos de informes de sostenibilidad.",
      de: "Analyse und Berichterstattung von ESG-Daten für europäische KMU (25 Std./Woche).",
      fr: "Analyser et rapporter les données ESG pour les PME européennes (25 h/semaine).",
      it: "Analizzare e riportare dati ESG per le PMI europee (25 ore/settimana).",
      pl: "Analizuj i raportuj dane ESG dla europejskich MŚP (25 godz./tydzień).",
      nl: "Analyseer en rapporteer ESG-data voor Europese MKB-bedrijven (25 uur/week)."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Sustainable%20Finance%20Platform%20Remote%20ESG%20Reporting%20Analyst"
  },
  {
    id: "pt_j3",
    title: {
      en: "Freelance Carbon Accounting Specialist",
      es: "Especialista Freelance en Contabilidad de Carbono",
      de: "Freiberuflicher Spezialist für CO2-Bilanzierung",
      fr: "Spécialiste Comptabilité Carbone Freelance",
      it: "Specialista Contabilità Carbonio Freelance",
      pl: "Specjalista ds. Rachunkowości Węglowej (Freelance)",
      nl: "Freelance Koolstofboekhouding Specialist"
    },
    company: "Leafr Consulting",
    city: {
      en: "Remote",
      es: "Remoto",
      de: "Remote",
      fr: "Télétravail",
      it: "Remoto",
      pl: "Zdalnie",
      nl: "Remote"
    },
    country: {
      en: "Europe",
      es: "Europa",
      de: "Europa",
      fr: "Europe",
      it: "Europa",
      pl: "Europa",
      nl: "Europa"
    },
    salaryMinEur: 30000,
    salaryMaxEur: 45000,
    level: 'senior',
    experienceYears: 4,
    knowledgeAreas: {
      en: ["GHG Protocol", "Scope 3", "Carbon Footprint", "LCA", "Client Management"],
      es: ["Protocolo GHG", "Alcance 3", "Huella de Carbono", "ACV", "Gestión de Clientes"],
      de: ["THG-Protokoll", "Scope 3", "CO2-Fußabdruck", "Ökobilanz", "Kundenmanagement"],
      fr: ["Protocole GHG", "Scope 3", "Empreinte Carbone", "ACV", "Gestion Client"],
      it: ["Protocollo GHG", "Scope 3", "Impronta di Carbonio", "LCA", "Gestione Clienti"],
      pl: ["Protokół GHG", "Zakres 3", "Ślad Węglowy", "LCA", "Zarządzanie Klientami"],
      nl: ["GHG Protocol", "Scope 3", "Koolstofvoetafdruk", "LCA", "Klantenbeheer"]
    },
    contract: "part-time",
    remote: true,
    description: {
      en: "Calculate carbon footprints for organizations as a freelance consultant (flexible hours). Help European businesses measure and reduce their climate impact.",
      es: "Calcular huellas de carbono para organizaciones como consultor freelance (horario flexible). Ayudar a las empresas europeas a medir y reducir su impacto climático.",
      de: "Berechnung von CO2-Fußabdrücken für Organisationen als freiberuflicher Berater.",
      fr: "Calculer les empreintes carbone pour les organisations en tant que consultant indépendant.",
      it: "Calcolare l'impronta di carbonio per le organizzazioni come consulente freelance.",
      pl: "Obliczaj ślad węglowy dla organizacji jako niezależny konsultant.",
      nl: "Bereken de koolstofvoetafdruk voor organisaties als freelance consultant."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Leafr%20Consulting%20Freelance%20Carbon%20Accounting%20Specialist"
  },
  {
    id: "pt_j4",
    title: {
      en: "Circular Economy Advisor (Part-Time)",
      es: "Asesor de Economía Circular (Tiempo Parcial)",
      de: "Berater für Kreislaufwirtschaft (Teilzeit)",
      fr: "Conseiller Économie Circulaire (Temps Partiel)",
      it: "Consulente Economia Circolare (Part-Time)",
      pl: "Doradca ds. Gospodarki o Obiegu Zamkniętym (Na część etatu)",
      nl: "Adviseur Circulaire Economie (Deeltijd)"
    },
    company: "Ellen MacArthur Foundation",
    city: {
      en: "Isle of Wight",
      es: "Isla de Wight",
      de: "Isle of Wight",
      fr: "Île de Wight",
      it: "Isola di Wight",
      pl: "Wyspa Wight",
      nl: "Isle of Wight"
    },
    country: {
      en: "United Kingdom",
      es: "Reino Unido",
      de: "Vereinigtes Königreich",
      fr: "Royaume-Uni",
      it: "Regno Unito",
      pl: "Wielka Brytania",
      nl: "Verenigd Koninkrijk"
    },
    salaryMinEur: 22000,
    salaryMaxEur: 32000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: {
      en: ["Circular Economy", "Business Models", "Material Flows", "Systems Thinking", "Communication"],
      es: ["Economía Circular", "Modelos de Negocio", "Flujos de Materiales", "Pensamiento Sistémico", "Comunicación"],
      de: ["Kreislaufwirtschaft", "Geschäftsmodelle", "Materialflüsse", "Systemdenken", "Kommunikation"],
      fr: ["Économie Circulaire", "Modèles d'Affaires", "Flux de Matériaux", "Pensée Systémique", "Communication"],
      it: ["Economia Circolare", "Modelli di Business", "Flussi di Materiali", "Pensiero Sistemico", "Comunicazione"],
      pl: ["Gospodarka o Obiegu Zamkniętym", "Modele Biznesowe", "Przepływy Materiałów", "Myślenie Systemowe", "Komunikacja"],
      nl: ["Circulaire Economie", "Bedrijfsmodellen", "Materiaalstromen", "Systeemdenken", "Communicatie"]
    },
    contract: "part-time",
    remote: true,
    description: {
      en: "Advise businesses on circular economy transitions (20 hrs/week). Work with the world's leading circular economy organization to eliminate waste.",
      es: "Asesorar a empresas sobre transiciones a la economía circular (20 hrs/semana). Trabajar con la organización líder mundial en economía circular para eliminar los residuos.",
      de: "Beratung von Unternehmen beim Übergang zur Kreislaufwirtschaft (20 Std./Woche).",
      fr: "Conseiller les entreprises sur les transitions vers l'économie circulaire (20 h/semaine).",
      it: "Consigliare le aziende sulle transizioni verso l'economia circolare (20 ore/settimana).",
      pl: "Doradzaj firmom w zakresie transformacji w kierunku gospodarki o obiegu zamkniętym (20 godz./tydzień).",
      nl: "Adviseer bedrijven over transities naar de circulaire economie (20 uur/week)."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Ellen%20MacArthur%20Foundation%20Circular%20Economy%20Advisor%20(Part-Time)",
    logo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "pt_j5",
    title: {
      en: "Sustainability Content Writer",
      es: "Redactor de Contenido de Sostenibilidad",
      de: "Redakteur für Nachhaltigkeitsinhalte",
      fr: "Rédacteur Contenu Durabilité",
      it: "Redattore Contenuti Sostenibilità",
      pl: "Autor Treści o Zrównoważonym Rozwoju",
      nl: "Schrijver Duurzaamheidscontent"
    },
    company: "Climate Action Network Europe",
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
    salaryMinEur: 18000,
    salaryMaxEur: 26000,
    level: 'junior',
    experienceYears: 1,
    knowledgeAreas: {
      en: ["Content Writing", "Climate Communication", "Social Media", "Research", "English"],
      es: ["Redacción de Contenido", "Comunicación Climática", "Redes Sociales", "Investigación", "Inglés"],
      de: ["Inhaltserstellung", "Klimakommunikation", "Soziale Medien", "Forschung", "Englisch"],
      fr: ["Rédaction de Contenu", "Communication Climatique", "Réseaux Sociaux", "Recherche", "Anglais"],
      it: ["Scrittura Contenuti", "Comunicazione Climatica", "Social Media", "Ricerca", "Inglese"],
      pl: ["Pisanie Treści", "Komunikacja Klimatyczna", "Media Społecznościowe", "Badania", "Angielski"],
      nl: ["Content Schrijven", "Klimaatcommunicatie", "Sociale Media", "Onderzoek", "Engels"]
    },
    contract: "part-time",
    remote: true,
    description: {
      en: "Create compelling climate content for Europe's largest climate NGO network (15-20 hrs/week). Help amplify climate action messages across Europe.",
      es: "Crear contenido climático convincente para la red de ONGs climáticas más grande de Europa (15-20 hrs/semana). Ayudar a amplificar los mensajes de acción climática en toda Europa.",
      de: "Erstellung überzeugender Klimainhalte für Europas größtes Klima-NGO-Netzwerk.",
      fr: "Créer du contenu climatique captivant pour le plus grand réseau d'ONG climatiques en Europe.",
      it: "Creare contenuti climatici avvincenti per la più grande rete di ONG climatiche in Europa.",
      pl: "Twórz przekonujące treści klimatyczne dla największej sieci organizacji pozarządowych zajmujących się klimatem w Europie.",
      nl: "Creëer boeiende klimaatcontent voor Europa's grootste netwerk van klimaat-ngo's."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=Climate%20Action%20Network%20Europe%20Sustainability%20Content%20Writer"
  },
  {
    id: "pt_j6",
    title: {
      en: "Renewable Energy Analyst (Part-Time)",
      es: "Analista de Energía Renovable (Tiempo Parcial)",
      de: "Analyst für erneuerbare Energien (Teilzeit)",
      fr: "Analyste Énergies Renouvelables (Temps Partiel)",
      it: "Analista Energie Rinnovabili (Part-Time)",
      pl: "Analityk Energii Odnawialnej (Na część etatu)",
      nl: "Analist Hernieuwbare Energie (Deeltijd)"
    },
    company: "SolarPower Europe",
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
    salaryMinEur: 24000,
    salaryMaxEur: 34000,
    level: 'mid',
    experienceYears: 2,
    knowledgeAreas: {
      en: ["Solar Energy", "Market Analysis", "Data Analysis", "Energy Policy", "Excel"],
      es: ["Energía Solar", "Análisis de Mercado", "Análisis de Datos", "Política Energética", "Excel"],
      de: ["Solarenergie", "Marktanalyse", "Datenanalyse", "Energiepolitik", "Excel"],
      fr: ["Énergie Solaire", "Analyse de Marché", "Analyse de Données", "Politique Énergétique", "Excel"],
      it: ["Energia Solare", "Analisi di Mercato", "Analisi Dati", "Politica Energetica", "Excel"],
      pl: ["Energia Słoneczna", "Analiza Rynku", "Analiza Danych", "Polityka Energetyczna", "Excel"],
      nl: ["Zonne-energie", "Marktanalyse", "Data-analyse", "Energiebeleid", "Excel"]
    },
    contract: "part-time",
    remote: true,
    description: {
      en: "Analyze European solar market trends (25 hrs/week). Support advocacy and research for Europe's solar industry association.",
      es: "Analizar las tendencias del mercado solar europeo (25 hrs/semana). Apoyar la defensa y la investigación para la asociación de la industria solar de Europa.",
      de: "Analyse der Trends auf dem europäischen Solarmarkt (25 Std./Woche).",
      fr: "Analyser les tendances du marché solaire européen (25 h/Semaine).",
      it: "Analizzare le tendenze del mercato solare europeo (25 ore/settimana).",
      pl: "Analizuj trendy na europejskim rynku energii słonecznej (25 godz./tydzień).",
      nl: "Analyseer trends op de Europese zonne-energiemarkt (25 uur/week)."
    },
    apply_url: "https://www.linkedin.com/jobs/search/?keywords=SolarPower%20Europe%20Renewable%20Energy%20Analyst%20(Part-Time)"
  },
];

export default function JobsPage() {
  const { t, locale } = useI18n();

  // Helper functions to get translated job data with safe fallback
  const getJobTitle = (job: Job) => {
    if (typeof job.title === 'string') return job.title;
    return job.title[locale] || job.title['en'] || Object.values(job.title)[0] || '';
  };

  const getJobDescription = (job: Job) => {
    if (typeof job.description === 'string') return job.description;
    return job.description[locale] || job.description['en'] || Object.values(job.description)[0] || '';
  };

  const getJobKnowledgeAreas = (job: Job): string[] => {
    if (Array.isArray(job.knowledgeAreas)) return job.knowledgeAreas;
    return job.knowledgeAreas[locale] || job.knowledgeAreas['en'] || Object.values(job.knowledgeAreas)[0] || [];
  };

  const getJobCity = (job: Job) => {
    if (typeof job.city === 'string') return job.city;
    return job.city[locale] || job.city['en'] || Object.values(job.city)[0] || '';
  };

  const getJobCountry = (job: Job) => {
    if (typeof job.country === 'string') return job.country;
    return job.country[locale] || job.country['en'] || Object.values(job.country)[0] || '';
  };

  const getKnowledgeArea = (area: string) => {
    const areaKey = area.toLowerCase().replace(/[\s\.]+/g, '');
    const translated = t(areaKey);
    return translated === areaKey ? area : translated;
  };
  const { showToast } = useToast();
  const currentLocale = String(locale);
  const [query, setQuery] = useState("");
  const [minSalary, setMinSalary] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [city, setCity] = useState<string>("all");
  const [contract, setContract] = useState<string>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [levelFilter, setLevelFilter] = useState<'all' | 'junior' | 'mid' | 'senior' | 'lead'>("all");
  const [showJobForm, setShowJobForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'full-time',
    salaryRange: '',
    experienceLevel: 'entry',
    requiredSkills: '',
    benefits: '',
    applicationDeadline: '',
    contactEmail: ''
  });

  // Load saved filters on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('econexo:jobFilters');
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.query === 'string') setQuery(saved.query);
        if (typeof saved.minSalary === 'number') setMinSalary(saved.minSalary);
        if (typeof saved.minExperience === 'number') setMinExperience(saved.minExperience);
        if (typeof saved.city === 'string') setCity(saved.city);
        if (typeof saved.contract === 'string') setContract(saved.contract);
        if (typeof saved.remoteOnly === 'boolean') setRemoteOnly(saved.remoteOnly);
        if (typeof saved.levelFilter === 'string') setLevelFilter(saved.levelFilter);
      }
    } catch { }
  }, []);

  // Persist filters whenever they change
  useEffect(() => {
    try {
      const toSave = { query, minSalary, minExperience, city, contract, remoteOnly, levelFilter };
      localStorage.setItem('econexo:jobFilters', JSON.stringify(toSave));
    } catch { }
  }, [query, minSalary, minExperience, city, contract, remoteOnly, levelFilter]);

  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const [curatedJobs, setCuratedJobs] = useState<Job[]>([]);
  const [isCurating, setIsCurating] = useState(false);
  const [curationLogs, setCurationLogs] = useState<string[]>([]);

  // Filter to show only real jobs (jobs with apply_url)
  const realJobs = useMemo(() => JOBS.filter(job => job.apply_url), []);

  const filtered = useMemo(() => {
    const queryLower = query.toLowerCase().trim();
    const combinedJobs = [...realJobs, ...curatedJobs];

    return combinedJobs.filter((j) => {
      // Si no hay query, mostrar todos (solo aplicar filtros)
      if (!queryLower) return true;

      // Buscar en título del trabajo
      const titleMatch = getJobTitle(j).toLowerCase().includes(queryLower);

      // Buscar en nombre de la empresa
      const companyMatch = j.company.toLowerCase().includes(queryLower);

      // Buscar en descripción del trabajo
      const descriptionMatch = getJobDescription(j).toLowerCase().includes(queryLower);

      // Buscar en áreas de conocimiento
      const knowledgeMatch = getJobKnowledgeAreas(j).some(a =>
        a.toLowerCase().includes(queryLower) ||
        getKnowledgeArea(a).toLowerCase().includes(queryLower)
      );

      // Buscar en nivel de experiencia (junior, mid, senior, lead)
      const levelMatch =
        (queryLower.includes('junior') && j.level === 'junior') ||
        (queryLower.includes('mid') && j.level === 'mid') ||
        (queryLower.includes('senior') && j.level === 'senior') ||
        (queryLower.includes('lead') && j.level === 'lead') ||
        (queryLower.includes('principiante') && j.level === 'junior') ||
        (queryLower.includes('intermedio') && j.level === 'mid') ||
        (queryLower.includes('avanzado') && j.level === 'senior') ||
        (queryLower.includes('líder') && j.level === 'lead');

      // Buscar en tipo de contrato
      const contractMatch =
        (queryLower.includes('full-time') || queryLower.includes('tiempo completo') || queryLower.includes('vollzeit')) && j.contract === 'full-time' ||
        (queryLower.includes('part-time') || queryLower.includes('medio tiempo') || queryLower.includes('teilzeit')) && j.contract === 'part-time' ||
        (queryLower.includes('contract') || queryLower.includes('contrato') || queryLower.includes('freelance')) && j.contract === 'contract' ||
        (queryLower.includes('internship') || queryLower.includes('pasantía') || queryLower.includes('praktikum')) && j.contract === 'internship';

      // Buscar en ubicación (ciudad y país)
      const cityStr = getJobCity(j);
      const countryStr = getJobCountry(j);
      const locationMatch =
        cityStr.toLowerCase().includes(queryLower) ||
        countryStr.toLowerCase().includes(queryLower) ||
        locationLabel(cityStr, locale as any).toLowerCase().includes(queryLower) ||
        locationLabel(countryStr, locale as any).toLowerCase().includes(queryLower);

      // Buscar en años de experiencia (como texto)
      const experienceMatch =
        queryLower.includes(`${j.experienceYears}`) ||
        (queryLower.includes('año') && j.experienceYears.toString().includes(queryLower.match(/\d+/)?.[0] || '')) ||
        (queryLower.includes('year') && j.experienceYears.toString().includes(queryLower.match(/\d+/)?.[0] || ''));

      // Buscar si es remoto
      const remoteMatch =
        (queryLower.includes('remote') || queryLower.includes('remoto') || queryLower.includes('teletrabajo')) && j.remote;

      return titleMatch || companyMatch || descriptionMatch || knowledgeMatch ||
        levelMatch || contractMatch || locationMatch || experienceMatch || remoteMatch;
    }).filter(j => j.salaryMinEur >= minSalary && j.experienceYears >= minExperience)
      .filter(j => city === "all" ? true : getJobCity(j).toLowerCase() === city.toLowerCase())
      .filter(j => contract === "all" ? true : j.contract === contract)
      .filter(j => levelFilter === 'all' ? true : j.level === levelFilter)
      .filter(j => remoteOnly ? j.remote : true);
  }, [query, minSalary, minExperience, city, contract, levelFilter, remoteOnly, locale, curatedJobs, realJobs]);

  const fmtCurrency = (v: number) =>
    new Intl.NumberFormat(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-ES', { style: 'currency', currency: 'EUR' }).format(v);

  const handleJobFormChange = (field: string, value: string) => {
    setJobForm(prev => ({ ...prev, [field]: value }));
  };

  const handleJobSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage
      const jobs = JSON.parse(localStorage.getItem('econexo:jobs') || '[]');
      const newJob = {
        id: `job_${Date.now()}`,
        ...jobForm,
        createdAt: new Date().toISOString(),
        status: isDraft ? 'draft' : 'published'
      };
      jobs.push(newJob);
      localStorage.setItem('econexo:jobs', JSON.stringify(jobs));

      showToast(t("jobCreated") || "Trabajo creado exitosamente", "success");
      setShowJobForm(false);
      setJobForm({
        title: '',
        company: '',
        description: '',
        location: '',
        type: 'full-time',
        salaryRange: '',
        experienceLevel: 'entry',
        requiredSkills: '',
        benefits: '',
        applicationDeadline: '',
        contactEmail: ''
      });

    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Start curation on mount
  useEffect(() => {
    let active = true;
    setIsCurating(true);

    jobCurator.startCurating((scraped) => {
      if (!active) return;

      // Transform ScrapedJob to Job
      const newJob: Job = {
        id: scraped.id,
        title: scraped.title,
        company: scraped.company,
        city: scraped.location.split(',')[0].trim(),
        country: scraped.location.split(',')[1]?.trim() || "Germany",
        salaryMinEur: 45000,
        salaryMaxEur: 65000,
        level: 'mid',
        experienceYears: 3,
        knowledgeAreas: scraped.tags,
        contract: "full-time",
        remote: true,
        description: scraped.log.join("\n"),
        apply_url: scraped.apply_url,
        isCurated: true,
        curatorLog: scraped.log
      };

      setCuratedJobs(prev => [...prev.filter(j => j.id !== scraped.id), newJob]);
    });

    return () => { active = false; };
  }, [locale]);

  const [applyFor, setApplyFor] = useState<Job | null>(null);
  const [applicant, setApplicant] = useState({
    name: "",
    email: "",
    cv: "",
    motivations: "",
    expertiseAreas: "",
    motivationLetter: null as File | null,
    languages: [] as { code: string; level: string; native: boolean }[]
  });
  const [newLanguage, setNewLanguage] = useState<{ code: string; level: string }>({ code: '', level: '' });

  // Persist/restore application form state
  useEffect(() => {
    try {
      const raw = localStorage.getItem('econexo:jobApplication');
      if (raw) {
        const saved = JSON.parse(raw);
        setApplicant((prev) => ({
          ...prev,
          name: typeof saved.name === 'string' ? saved.name : prev.name,
          email: typeof saved.email === 'string' ? saved.email : prev.email,
          cv: typeof saved.cv === 'string' ? saved.cv : prev.cv,
          motivations: typeof saved.motivations === 'string' ? saved.motivations : prev.motivations,
          expertiseAreas: typeof saved.expertiseAreas === 'string' ? saved.expertiseAreas : prev.expertiseAreas,
          motivationLetter: null,
          languages: Array.isArray(saved.languages) ? saved.languages : prev.languages,
        }));
        if (saved.newLanguage && typeof saved.newLanguage === 'object') {
          setNewLanguage({
            code: typeof saved.newLanguage.code === 'string' ? saved.newLanguage.code : '',
            level: typeof saved.newLanguage.level === 'string' ? saved.newLanguage.level : '',
          });
        }
      }
    } catch { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('econexo:jobApplication', JSON.stringify({
        name: applicant.name,
        email: applicant.email,
        cv: applicant.cv,
        motivations: applicant.motivations,
        expertiseAreas: applicant.expertiseAreas,
        languages: applicant.languages,
        newLanguage,
      }));
    } catch { }
  }, [applicant.name, applicant.email, applicant.cv, applicant.motivations, applicant.expertiseAreas, applicant.languages, newLanguage]);
  const toggleSave = (id: string) => {
    setSavedJobs((s) => {
      const newState = { ...s, [id]: !s[id] };
      showToast(
        s[id] ? t("jobRemovedFromSaved") || "Trabajo eliminado de guardados" : t("jobSaved") || "Trabajo guardado",
        "success"
      );
      return newState;
    });
  };
  const submitApplication = async () => {
    setApplyFor(null);
    showToast(t("applicationSent") || "Aplicación enviada", "success");
    setApplicant({
      name: "",
      email: "",
      cv: "",
      motivations: "",
      expertiseAreas: "",
      motivationLetter: null,
      languages: []
    });
    setNewLanguage({ code: '', level: '' });
    try { localStorage.removeItem('econexo:jobApplication'); } catch { }
  };



  // Función para generar URL de búsqueda de la empresa
  const getCompanyUrl = (companyName: string) => {
    // Primero intentar LinkedIn (formato estándar de LinkedIn)
    const linkedinSlug = companyName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const linkedinUrl = `https://www.linkedin.com/company/${linkedinSlug}`;

    // Si no está en LinkedIn, usar Ecosia como búsqueda alternativa
    // Ecosia usa el mismo formato que Google: ?q=query
    const ecosiaSearchUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(companyName)}`;

    // Por defecto intentamos LinkedIn primero, pero el usuario puede buscar en Ecosia si no encuentra
    // Para una mejor experiencia, podríamos verificar si existe en LinkedIn, pero por ahora
    // usamos LinkedIn directamente y Ecosia como alternativa manual
    return linkedinUrl;
  };

  // Función para obtener URL de búsqueda en Ecosia (alternativa)
  const getEcosiaSearchUrl = (companyName: string) => {
    return `https://www.ecosia.org/search?q=${encodeURIComponent(companyName)}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header with gradient - matching new design system */}
      <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 mb-8">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2 font-sans">{t("jobs")}</h1>
          <p className="text-white/80 text-lg font-mono">
            {locale === "en" ? "Connected" : locale === "de" ? "Verbunden" : "Conectado"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 mb-6 mt-8">
          {/* Primera fila: Barra de búsqueda grande */}
          <div className="mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded px-4 py-3 text-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              placeholder={t('searchPlaceholderEn')}
            />
          </div>

          {/* Segunda fila: Parámetros de búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("minSalary")}</label>
              <input type="number" value={minSalary} onChange={(e) => setMinSalary(Number(e.target.value) || 0)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("minExperience")}</label>
              <input type="number" value={minExperience} onChange={(e) => setMinExperience(Number(e.target.value) || 0)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("cityLabel")}</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                <option value="all">{t('allCities')}</option>
                {Array.from(new Set(realJobs.map(j => getJobCity(j)))).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("experienceLevel")}</label>
              <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value as any)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                <option value="all">{t('all')}</option>
                <option value="junior">{t('levelJunior')}</option>
                <option value="mid">{t('levelMid')}</option>
                <option value="senior">{t('levelSenior')}</option>
                <option value="lead">{t('levelLead')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("contractLabel")}</label>
              <select value={contract} onChange={(e) => setContract(e.target.value)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                <option value="all">{t('allContracts')}</option>
                <option value="full-time">{t("contract_full_time")}</option>
                <option value="part-time">{t("contract_part_time")}</option>
                <option value="contract">{t("contract_contract")}</option>
                <option value="internship">{t("contract_internship")}</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 h-10">
                <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} className="h-4 w-4" />
                {t("remoteOnly")}
              </label>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-400 font-medium">{filtered.length} {t("results")}</div>
        </div>

        <div className="content-separator" />

        {filtered.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 flex justify-center text-primary">
              <Search size={64} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-sans">
              {t("noResults") || "No se encontraron resultados"}
            </h2>
            <p className="text-foreground/60 font-mono">
              {t("tryDifferentSearch") || "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-lg p-5 hover-lift border border-gray-200 transition-all duration-200">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <img
                      src={job.logo_url || `https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=200&auto=format&fit=crop`}
                      alt={job.company}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide the broken image and show parent's gradient background with initial
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="absolute text-white font-bold text-xl">{job.company.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-black">{getJobTitle(job)}</h2>
                    <p className="text-gray-700">
                      <span className="flex items-center gap-2 flex-wrap">
                        <a
                          href={getCompanyUrl(job.company)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:text-green-800 hover:underline font-medium transition-colors"
                          title={`Ver ${job.company} en LinkedIn`}
                        >
                          {job.company}
                        </a>
                        <a
                          href={getEcosiaSearchUrl(job.company)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-primary transition-colors"
                          title={`Buscar ${job.company} en Ecosia`}
                        >
                          <Search size={14} />
                        </a>
                        {' — '}
                        {locationLabel(getJobCity(job), locale as any)}, {locationLabel(getJobCountry(job), locale as any)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-700 font-bold">{fmtCurrency(job.salaryMinEur)}–{fmtCurrency(job.salaryMaxEur)}</div>
                  <div className="text-xs text-gray-600">{t(job.level === 'junior' ? 'levelJunior' : job.level === 'mid' ? 'levelMid' : job.level === 'senior' ? 'levelSenior' : 'levelLead')} • {t(job.contract)}{job.remote ? ` · ${t("remoteLabel")}` : ""}</div>
                </div>
              </div>
              <div className="mt-3 text-gray-800">{getJobDescription(job)}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge-modern px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200">{job.experienceYears} {t("yearsExp")}</span>
                {getJobKnowledgeAreas(job).map((a) => (
                  <span key={a} className="badge-modern px-3 py-1 bg-gray-100 text-gray-800 border border-gray-200">{getKnowledgeArea(a)}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                {job.apply_url ? (
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative touch-target px-4 py-2 bg-white text-black border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover-lift flex items-center justify-center text-center cursor-pointer"
                    title={t("rememberToTellThemTooltip") || "Recuerda decir que llegaste por aquí!"}
                  >
                    {t("applyBtn")} <ExternalLink size={16} className="ml-2" />
                    {/* Burbuja / Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-primary/20">
                      <Heart size={12} className="inline mr-1 text-primary fill-primary" /> {t("rememberToTellThemTooltip") || "Recuerda decir que llegaste por aquí!"}
                      {/* Flechita del tooltip */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white dark:border-t-slate-900"></div>
                    </div>
                  </a>
                ) : (
                  <button onClick={() => setApplyFor(job)} className="touch-target px-4 py-2 bg-white text-black border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover-lift">{t("applyBtn")}</button>
                )}
                <button onClick={() => toggleSave(job.id)} className="touch-target px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-medium">{savedJobs[job.id] ? t("saved") : t("saveBtn")}</button>
              </div>
            </div>
          ))}
        </div>

        {applyFor && (
          <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-white">{t("applyForJob")}: {getJobTitle(applyFor)}</h2>
              <div className="space-y-4">
                {/* Información Personal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t("yourName")} *</label>
                    <input
                      value={applicant.name}
                      onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                      className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">{t("yourEmail")} *</label>
                    <input
                      type="email"
                      value={applicant.email}
                      onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                      className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* CV Link */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">{t("cvLink")} ({t("optional")})</label>
                  <input
                    value={applicant.cv}
                    onChange={(e) => setApplicant({ ...applicant, cv: e.target.value })}
                    className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400"
                    placeholder={locale === 'de' ? 'z. B. https://linkedin.com/in/dein-profil' : 'https://linkedin.com/in/tu-perfil'}
                  />
                </div>

                {/* Motivaciones */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">{t("motivations")} *</label>
                  <textarea
                    value={applicant.motivations}
                    onChange={(e) => setApplicant({ ...applicant, motivations: e.target.value })}
                    className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400 min-h-24"
                    placeholder={
                      currentLocale === 'de' ? 'Motivationsschreiben' :
                        currentLocale === 'es' ? 'Carta de motivación' :
                          currentLocale === 'en' ? 'Motivation letter' :
                            currentLocale === 'fr' ? 'Lettre de motivation' :
                              currentLocale === 'it' ? 'Lettera di motivazione' :
                                currentLocale === 'pt' ? 'Carta de motivação' :
                                  t('motivationsPlaceholder')
                    }
                    required
                  />
                </div>

                {/* Áreas de Expertise */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">{t("expertiseAreas")} *</label>
                  <textarea
                    value={applicant.expertiseAreas}
                    onChange={(e) => setApplicant({ ...applicant, expertiseAreas: e.target.value })}
                    className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400 min-h-20"
                    placeholder={t("expertiseAreasPlaceholder")}
                    required
                  />
                </div>

                {/* Lenguajes */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-white">{t("languages")}</label>
                  {(() => {
                    const EUROPEAN_LANGUAGES = [
                      { code: 'de', label: 'Deutsch' },
                      { code: 'en', label: 'English' },
                      { code: 'es', label: 'Español' },
                      { code: 'it', label: 'Italiano' },
                      { code: 'pt', label: 'Português' },
                      { code: 'nl', label: 'Nederlands' },
                      { code: 'pl', label: 'Polski' },
                      { code: 'ro', label: 'Română' },
                      { code: 'cs', label: 'Čeština' },
                      { code: 'sk', label: 'Slovenčina' },
                      { code: 'sl', label: 'Slovenščina' },
                      { code: 'hr', label: 'Hrvatski' },
                      { code: 'sr', label: 'Srpski' },
                      { code: 'bs', label: 'Bosanski' },
                      { code: 'mk', label: 'Македонски' },
                      { code: 'bg', label: 'Български' },
                      { code: 'ru', label: 'Русский' },
                      { code: 'uk', label: 'Українська' },
                      { code: 'be', label: 'Беларуская' },
                      { code: 'el', label: 'Ελληνικά' },
                      { code: 'da', label: 'Dansk' },
                      { code: 'sv', label: 'Svenska' },
                      { code: 'fi', label: 'Suomi' },
                      { code: 'no', label: 'Norsk' },
                      { code: 'et', label: 'Eesti' },
                      { code: 'lv', label: 'Latviešu' },
                      { code: 'lt', label: 'Lietuvių' },
                      { code: 'ga', label: 'Gaeilge' },
                      { code: 'mt', label: 'Malti' },
                      { code: 'is', label: 'Íslenska' },
                      { code: 'al', label: 'Shqip' }
                    ];

                    const selectable = EUROPEAN_LANGUAGES.filter(l => !applicant.languages.some(sel => sel.code === l.code));

                    return (
                      <div className="space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <select
                            value={newLanguage.code}
                            onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                            className="w-full md:w-1/2 border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white"
                          >
                            <option value="" className="bg-slate-700">{t("selectLanguage") ?? 'Selecciona un lenguaje'}</option>
                            {selectable.map(l => (
                              <option key={l.code} value={l.code} className="bg-slate-700">{l.label}</option>
                            ))}
                          </select>
                          <select
                            value={newLanguage.level}
                            onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
                            className="w-full md:w-1/3 border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white"
                          >
                            <option value="" className="bg-slate-700">{t("selectLevel")}</option>
                            <option value="A1" className="bg-slate-700">A1</option>
                            <option value="A2" className="bg-slate-700">A2</option>
                            <option value="B1" className="bg-slate-700">B1</option>
                            <option value="B2" className="bg-slate-700">B2</option>
                            <option value="C1" className="bg-slate-700">C1</option>
                            <option value="C2" className="bg-slate-700">C2</option>
                            <option value="Native" className="bg-slate-700">{t("native")}</option>
                          </select>
                          <button
                            type="button"
                            className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
                            onClick={() => {
                              if (!newLanguage.code) return;
                              if (applicant.languages.some(l => l.code === newLanguage.code)) return;
                              setApplicant({
                                ...applicant,
                                languages: [...applicant.languages, { code: newLanguage.code, level: newLanguage.level || '', native: newLanguage.level === 'Native' }]
                              });
                              setNewLanguage({ code: '', level: '' });
                            }}
                            aria-label="add-language"
                          >
                            +
                          </button>
                        </div>

                        {applicant.languages.length > 0 && (
                          <div className="space-y-2">
                            {applicant.languages.map((l, idx) => {
                              const meta = EUROPEAN_LANGUAGES.find(x => x.code === l.code);
                              return (
                                <div key={l.code} className="border border-slate-600 rounded-lg p-3 bg-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div className="text-white font-medium">{meta?.label || l.code.toUpperCase()}</div>
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={l.level}
                                      onChange={(e) => {
                                        const next = [...applicant.languages];
                                        next[idx] = { ...l, level: e.target.value };
                                        setApplicant({ ...applicant, languages: next });
                                      }}
                                      className="border border-slate-600 rounded px-3 py-2 bg-slate-600 text-white"
                                    >
                                      <option value="" className="bg-slate-700">{t("selectLevel")}</option>
                                      <option value="beginner" className="bg-slate-700">{t("beginner")}</option>
                                      <option value="intermediate" className="bg-slate-700">{t("intermediate")}</option>
                                      <option value="advanced" className="bg-slate-700">{t("advanced")}</option>
                                      <option value="fluent" className="bg-slate-700">{t("fluent")}</option>
                                    </select>
                                    <label className="flex items-center gap-2 text-slate-300">
                                      <input
                                        type="checkbox"
                                        checked={l.native}
                                        onChange={(e) => {
                                          const next = [...applicant.languages];
                                          next[idx] = { ...l, native: e.target.checked };
                                          setApplicant({ ...applicant, languages: next });
                                        }}
                                        className="rounded"
                                      />
                                      <span>{t("nativeLanguage")}</span>
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setApplicant({ ...applicant, languages: applicant.languages.filter(x => x.code !== l.code) });
                                      }}
                                      className="text-red-300 hover:text-red-200 text-sm"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Carta de Motivación PDF */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">{locale === 'de' ? 'Motivationsschreiben' : t("motivationLetter")} ({t("optional")})</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 bg-slate-700">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.type === 'application/pdf') {
                          setApplicant({ ...applicant, motivationLetter: file });
                        } else {
                          alert(t("onlyPdfFiles"));
                        }
                      }}
                      className="hidden"
                      id="motivation-letter-upload"
                    />
                    <label
                      htmlFor="motivation-letter-upload"
                      className="cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                      <div className="text-4xl mb-2">📄</div>
                      <div className="text-sm text-slate-300">
                        {applicant.motivationLetter ? (
                          <span className="text-green-400">
                            ✅ {applicant.motivationLetter.name}
                          </span>
                        ) : (
                          <>
                            <span className="font-medium">{t("clickToUpload")}</span><br />
                            {t("pdfOnly")} (Max. 5MB)
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  {applicant.motivationLetter && (
                    <button
                      type="button"
                      onClick={() => setApplicant({ ...applicant, motivationLetter: null })}
                      className="mt-2 text-sm text-red-400 hover:underline"
                    >
                      {t("removeFile")}
                    </button>
                  )}
                </div>

                {/* Botones */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setApplyFor(null)}
                    className="px-4 py-2 border border-slate-600 rounded hover:bg-slate-700 transition-colors text-white"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={submitApplication}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Posting Conditions and Create Job Offer Section */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {t("jobPostingConditions")}
          </h2>

          <div className="mb-6">
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              {t("jobPostingInfo")}
            </p>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {t("conductGuidelines")}
              </h3>
              <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {t("conductGuidelinesText")}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowJobForm(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg shadow-md hover:shadow-lg"
            >
              {t("createJobOffer")}
            </button>
          </div>
        </div>

        {/* Job Creation Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t("createJobOffer")}
                </h2>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("jobTitle")} *
                    </label>
                    <input
                      type="text"
                      value={jobForm.title}
                      onChange={(e) => handleJobFormChange('title', e.target.value)}
                      placeholder={t("jobTitlePlaceholder")}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("companyName")} *
                    </label>
                    <input
                      type="text"
                      value={jobForm.company}
                      onChange={(e) => handleJobFormChange('company', e.target.value)}
                      placeholder={t("companyNamePlaceholder")}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("jobLocation")} *
                    </label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => handleJobFormChange('location', e.target.value)}
                      placeholder={t("jobLocationPlaceholder")}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("jobType")} *
                    </label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => handleJobFormChange('type', e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="full-time">{t("jobTypeFullTime")}</option>
                      <option value="part-time">{t("jobTypePartTime")}</option>
                      <option value="contract">{t("jobTypeContract")}</option>
                      <option value="internship">{t("jobTypeInternship")}</option>
                      <option value="remote">{t("jobTypeRemote")}</option>
                      <option value="hybrid">{t("jobTypeHybrid")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("salaryRange")}
                    </label>
                    <input
                      type="text"
                      value={jobForm.salaryRange}
                      onChange={(e) => handleJobFormChange('salaryRange', e.target.value)}
                      placeholder={t("salaryRangePlaceholder")}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("experienceLevel")} *
                    </label>
                    <select
                      value={jobForm.experienceLevel}
                      onChange={(e) => handleJobFormChange('experienceLevel', e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="entry">{t("experienceEntry")}</option>
                      <option value="mid">{t("experienceMid")}</option>
                      <option value="senior">{t("experienceSenior")}</option>
                      <option value="expert">{t("experienceExpert")}</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("jobDescription")} *
                    </label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) => handleJobFormChange('description', e.target.value)}
                      placeholder={t("jobDescriptionPlaceholder")}
                      rows={4}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("requiredSkills")}
                    </label>
                    <input
                      type="text"
                      value={jobForm.requiredSkills}
                      onChange={(e) => handleJobFormChange('requiredSkills', e.target.value)}
                      placeholder={t("requiredSkillsPlaceholder")}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("benefits")}
                    </label>
                    <textarea
                      value={jobForm.benefits}
                      onChange={(e) => handleJobFormChange('benefits', e.target.value)}
                      placeholder={t("benefitsPlaceholder")}
                      rows={3}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("applicationDeadline")}
                    </label>
                    <input
                      type="date"
                      value={jobForm.applicationDeadline}
                      onChange={(e) => handleJobFormChange('applicationDeadline', e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("contactEmail")} *
                    </label>
                    <input
                      type="email"
                      value={jobForm.contactEmail}
                      onChange={(e) => handleJobFormChange('contactEmail', e.target.value)}
                      placeholder={t("contactEmailPlaceholder")}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowJobForm(false)}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => handleJobSubmit(true)}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '...' : t("saveDraft")}
                </button>
                <button
                  onClick={() => handleJobSubmit(false)}
                  disabled={isSubmitting || !jobForm.title || !jobForm.company || !jobForm.description || !jobForm.location || !jobForm.contactEmail}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '...' : t("publishJob")}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
