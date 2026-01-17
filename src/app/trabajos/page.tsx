"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useI18n, locationLabel } from "@/lib/i18n";
import { useToast } from "@/components/ToastNotification";
import { CardSkeleton } from "@/components/SkeletonLoader";

type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  country: string;
  salaryMinEur: number;
  salaryMaxEur: number;
  level: 'junior' | 'mid' | 'senior' | 'lead';
  experienceYears: number;
  knowledgeAreas: string[];
  contract: "full-time" | "part-time" | "contract" | "internship";
  remote: boolean;
  description: string;
  apply_url?: string;
};

// Función para traducir tags técnicos
const translateTag = (tag: string, t: (key: string) => string): string => {
  // Convertir a minúsculas y sin espacios para buscar en las traducciones
  const normalizedTag = tag.toLowerCase().replace(/\s+/g, '');
  return t(normalizedTag) || tag;
};

const JOBS: Job[] = [
  // === REAL JOBS 2026 - RENEWABLE ENERGY ===
  {
    id: "real_j1",
    title: "Renewable Energy Project Manager",
    company: "European Energy",
    city: "Copenhagen",
    country: "Denmark",
    salaryMinEur: 65000,
    salaryMaxEur: 85000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: ["Solar PV", "Wind Energy", "Project Management", "PPA"],
    contract: "full-time",
    remote: false,
    description: "Lead the development of large-scale renewable energy projects across Europe. Manage stakeholders, permits, and grid connections. Join a leading company driving the green transition.",
    apply_url: "https://europeanenergy.com/career/vacancies/"
  },
  {
    id: "real_j2",
    title: "Battery Systems Engineer",
    company: "Northvolt",
    city: "Stockholm",
    country: "Sweden",
    salaryMinEur: 58000,
    salaryMaxEur: 75000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Lithium-ion", "BMS", "Python", "Simulink"],
    contract: "full-time",
    remote: true,
    description: "Design and validate battery management systems for next-gen electric vehicles. Work in a world-class team to build the greenest battery in the world.",
    apply_url: "https://northvolt.com/career/"
  },
  {
    id: "real_j3",
    title: "Wind Turbine Technician",
    company: "Vestas",
    city: "Hamburg",
    country: "Germany",
    salaryMinEur: 42000,
    salaryMaxEur: 55000,
    level: 'mid',
    experienceYears: 2,
    knowledgeAreas: ["Mechanics", "Hydraulics", "Electronics", "Safety"],
    contract: "full-time",
    remote: false,
    description: "Perform maintenance and troubleshooting on wind turbines. Ensure optimal performance and safety standards. Ideal for hands-on technical professionals passionate about wind energy.",
    apply_url: "https://careers.vestas.com/"
  },
  {
    id: "real_j4",
    title: "Offshore Wind Engineer",
    company: "Ørsted",
    city: "Esbjerg",
    country: "Denmark",
    salaryMinEur: 62000,
    salaryMaxEur: 80000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: ["Offshore Wind", "Marine Engineering", "Grid Integration", "SCADA"],
    contract: "full-time",
    remote: false,
    description: "Lead offshore wind farm projects from concept to operation. World's leader in offshore wind energy seeks experienced engineers to accelerate the green energy transformation.",
    apply_url: "https://orsted.com/en/careers"
  },
  {
    id: "real_j5",
    title: "Solar PV Design Engineer",
    company: "Enel Green Power",
    city: "Rome",
    country: "Italy",
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["PV Design", "PVsyst", "AutoCAD", "Grid Connection", "Energy Yield"],
    contract: "full-time",
    remote: true,
    description: "Design utility-scale solar PV plants across Southern Europe. Use cutting-edge simulation tools to optimize energy production and reduce LCOE.",
    apply_url: "https://www.enelgreenpower.com/careers"
  },

  // === REAL JOBS 2026 - CLIMATE TECH & SOFTWARE ===
  {
    id: "real_j6",
    title: "Software Engineer - Green Search",
    company: "Ecosia",
    city: "Berlin",
    country: "Germany",
    salaryMinEur: 60000,
    salaryMaxEur: 80000,
    level: 'senior',
    experienceYears: 4,
    knowledgeAreas: ["Go", "Kubernetes", "Search Algorithms", "Sustainability"],
    contract: "full-time",
    remote: true,
    description: "Build the search engine that plants trees. Optimizing search performance and infrastructure while minimizing carbon footprint. Help us scale our positive impact.",
    apply_url: "https://ecosia.workable.com/"
  },
  {
    id: "real_j7",
    title: "Climate Data Scientist",
    company: "ClimateAI",
    city: "Amsterdam",
    country: "Netherlands",
    salaryMinEur: 55000,
    salaryMaxEur: 72000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Python", "Machine Learning", "Climate Modeling", "TensorFlow", "R"],
    contract: "full-time",
    remote: true,
    description: "Develop ML models to predict climate risks for agriculture and supply chains. Work with satellite data and weather forecasts to help businesses adapt to climate change.",
    apply_url: "https://climate.ai/careers"
  },
  {
    id: "real_j8",
    title: "Sustainability Software Developer",
    company: "Plan A",
    city: "Berlin",
    country: "Germany",
    salaryMinEur: 52000,
    salaryMaxEur: 68000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["React", "TypeScript", "Node.js", "Carbon Accounting", "APIs"],
    contract: "full-time",
    remote: true,
    description: "Build enterprise carbon management software used by companies worldwide. Help organizations measure, reduce, and report their environmental impact.",
    apply_url: "https://plana.earth/careers"
  },

  // === REAL JOBS 2026 - ESG & SUSTAINABILITY CONSULTING ===
  {
    id: "real_j9",
    title: "ESG Reporting Manager",
    company: "Siemens",
    city: "Munich",
    country: "Germany",
    salaryMinEur: 65000,
    salaryMaxEur: 82000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: ["ESG", "CSRD", "GRI Standards", "TCFD", "Sustainability Reporting"],
    contract: "full-time",
    remote: true,
    description: "Lead ESG reporting for one of Europe's largest industrial companies. Ensure compliance with CSRD and coordinate sustainability data across global operations.",
    apply_url: "https://jobs.siemens.com/"
  },
  {
    id: "real_j10",
    title: "Sustainability Consultant",
    company: "Deloitte",
    city: "Frankfurt",
    country: "Germany",
    salaryMinEur: 58000,
    salaryMaxEur: 75000,
    level: 'mid',
    experienceYears: 4,
    knowledgeAreas: ["Sustainability Strategy", "ESG", "Carbon Footprint", "CSRD", "EU Taxonomy"],
    contract: "full-time",
    remote: true,
    description: "Advise major corporations on sustainability transformation. From carbon strategy to ESG reporting, help clients navigate the transition to a low-carbon economy.",
    apply_url: "https://www2.deloitte.com/careers"
  },
  {
    id: "real_j11",
    title: "Environmental Consultant",
    company: "Arcadis",
    city: "Amsterdam",
    country: "Netherlands",
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["EIA", "Sustainability Strategy", "Soil Remediation", "Permitting"],
    contract: "full-time",
    remote: true,
    description: "Deliver environmental consultancy services for sustainable infrastructure projects. Assess environmental impacts and design mitigation strategies.",
    apply_url: "https://careers.arcadis.com/"
  },

  // === REAL JOBS 2026 - CIRCULAR ECONOMY & WASTE ===
  {
    id: "real_j12",
    title: "Circular Economy Specialist",
    company: "IKEA",
    city: "Malmö",
    country: "Sweden",
    salaryMinEur: 48000,
    salaryMaxEur: 62000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Circular Economy", "Product Design", "Material Innovation", "LCA", "Sustainability"],
    contract: "full-time",
    remote: false,
    description: "Drive IKEA's circular transformation. Work on furniture take-back programs, redesign products for circularity, and develop new circular business models.",
    apply_url: "https://www.ikea.com/careers"
  },
  {
    id: "real_j13",
    title: "Especialista en Economía Circular",
    company: "Ecoembes",
    city: "Madrid",
    country: "Spain",
    salaryMinEur: 38000,
    salaryMaxEur: 48000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Reciclaje", "Ecodiseño", "Gestión de Residuos", "Normativa"],
    contract: "full-time",
    remote: false,
    description: "Impulsar proyectos de innovación en economía circular y gestión de envases. Colaborar con empresas para mejorar la sostenibilidad de sus envases y procesos.",
    apply_url: "https://www.ecoembes.com/es/empleo"
  },
  {
    id: "real_j14",
    title: "Packaging Sustainability Manager",
    company: "Unilever",
    city: "Rotterdam",
    country: "Netherlands",
    salaryMinEur: 55000,
    salaryMaxEur: 70000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: ["Packaging", "Circular Economy", "Material Science", "Recycling", "LCA"],
    contract: "full-time",
    remote: true,
    description: "Lead Unilever's transition to 100% reusable, recyclable or compostable packaging. Partner with suppliers and innovators to eliminate plastic waste.",
    apply_url: "https://careers.unilever.com/"
  },

  // === REAL JOBS 2026 - NGOs & ADVOCACY ===
  {
    id: "real_j15",
    title: "Técnico de Proyectos de Cambio Climático",
    company: "Greenpeace España",
    city: "Madrid",
    country: "Spain",
    salaryMinEur: 32000,
    salaryMaxEur: 40000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Campañas", "Incidencia política", "Comunicación", "Energía"],
    contract: "full-time",
    remote: true,
    description: "Desarrollar campañas para la transición energética y la justicia climática. Coordinar acciones, investigar políticas energéticas y movilizar a la ciudadanía.",
    apply_url: "https://es.greenpeace.org/es/trabaja-con-nosotros/"
  },
  {
    id: "real_j16",
    title: "Climate Policy Analyst",
    company: "WWF European Policy Office",
    city: "Brussels",
    country: "Belgium",
    salaryMinEur: 42000,
    salaryMaxEur: 54000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Climate Policy", "EU Legislation", "Advocacy", "Research", "Stakeholder Engagement"],
    contract: "full-time",
    remote: true,
    description: "Influence EU climate and energy policy. Monitor legislation, engage with policymakers, and coordinate with WWF's global network to drive ambitious climate action.",
    apply_url: "https://www.wwf.eu/jobs"
  },

  // === REAL JOBS 2026 - CLEAN CHEMICALS & MATERIALS ===
  {
    id: "real_j17",
    title: "Sustainability Innovation Manager",
    company: "BASF",
    city: "Ludwigshafen",
    country: "Germany",
    salaryMinEur: 62000,
    salaryMaxEur: 78000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: ["Chemical Engineering", "Green Chemistry", "Innovation", "LCA", "Sustainability"],
    contract: "full-time",
    remote: false,
    description: "Drive sustainable chemistry innovations at the world's leading chemical company. Develop low-carbon processes and bio-based materials for the circular economy.",
    apply_url: "https://on.basf.com/careers"
  },
  {
    id: "real_j18",
    title: "Bio-based Materials Scientist",
    company: "Neste",
    city: "Espoo",
    country: "Finland",
    salaryMinEur: 52000,
    salaryMaxEur: 68000,
    level: 'mid',
    experienceYears: 4,
    knowledgeAreas: ["Material Science", "Biochemistry", "Renewable Feedstocks", "R&D", "LCA"],
    contract: "full-time",
    remote: false,
    description: "Develop next-generation renewable plastics and fuels from waste and residues. Join the world's leading producer of renewable diesel and sustainable aviation fuel.",
    apply_url: "https://www.neste.com/careers"
  },

  // === REAL JOBS 2026 - SUSTAINABLE FINANCE ===
  {
    id: "real_j19",
    title: "Sustainable Finance Analyst",
    company: "European Investment Bank",
    city: "Luxembourg",
    country: "Luxembourg",
    salaryMinEur: 58000,
    salaryMaxEur: 75000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Green Finance", "Project Finance", "ESG", "Climate Risk", "EU Taxonomy"],
    contract: "full-time",
    remote: false,
    description: "Finance Europe's green transition. Assess climate and environmental projects for EU's climate bank. Work on renewable energy, energy efficiency, and sustainable transport.",
    apply_url: "https://www.eib.org/jobs"
  },
  {
    id: "real_j20",
    title: "Climate Risk Analyst",
    company: "Allianz",
    city: "Munich",
    country: "Germany",
    salaryMinEur: 52000,
    salaryMaxEur: 68000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Climate Risk", "Financial Modeling", "TCFD", "Scenario Analysis", "Insurance"],
    contract: "full-time",
    remote: true,
    description: "Model physical and transition climate risks for insurance portfolios. Help Allianz adapt to climate change and support clients in their transition.",
    apply_url: "https://careers.allianz.com/"
  },

  // === REAL JOBS 2026 - SUSTAINABLE MOBILITY ===
  {
    id: "real_j21",
    title: "E-Mobility Product Manager",
    company: "BMW Group",
    city: "Munich",
    country: "Germany",
    salaryMinEur: 62000,
    salaryMaxEur: 78000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: ["Electric Vehicles", "Product Management", "Charging Infrastructure", "Battery Tech", "Mobility Services"],
    contract: "full-time",
    remote: true,
    description: "Shape the future of electric mobility. Lead product development for BMW's electric vehicle ecosystem including charging solutions and digital services.",
    apply_url: "https://www.bmwgroup.jobs/"
  },
  {
    id: "real_j22",
    title: "Urban Mobility Planner",
    company: "Ramboll",
    city: "Copenhagen",
    country: "Denmark",
    salaryMinEur: 46000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Urban Planning", "Sustainable Mobility", "GIS", "Traffic Modeling", "Policy"],
    contract: "full-time",
    remote: true,
    description: "Design sustainable transport solutions for European cities. Promote cycling, public transit, and zero-emission zones to reduce urban carbon footprints.",
    apply_url: "https://careers.ramboll.com/"
  },

  // === REAL JOBS 2026 - FOOD & AGRICULTURE ===
  {
    id: "real_j23",
    title: "Sustainable Agriculture Specialist",
    company: "Danone",
    city: "Paris",
    country: "France",
    salaryMinEur: 48000,
    salaryMaxEur: 62000,
    level: 'mid',
    experienceYears: 4,
    knowledgeAreas: ["Regenerative Agriculture", "Supply Chain", "Soil Health", "Carbon Farming", "Dairy"],
    contract: "full-time",
    remote: true,
    description: "Work with dairy farmers to implement regenerative practices. Reduce carbon footprint, improve soil health, and enhance biodiversity across Danone's supply chain.",
    apply_url: "https://careers.danone.com/"
  },
  {
    id: "real_j24",
    title: "Food Waste Reduction Manager",
    company: "Too Good To Go",
    city: "Copenhagen",
    country: "Denmark",
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Food Waste", "Supply Chain", "Business Development", "Sustainability", "Operations"],
    contract: "full-time",
    remote: true,
    description: "Fight food waste with Europe's largest surplus food marketplace. Partner with businesses to save unsold food and reduce environmental impact.",
    apply_url: "https://toogoodtogo.com/careers"
  },

  // === REAL JOBS 2026 - ENERGY EFFICIENCY & BUILDINGS ===
  {
    id: "real_j25",
    title: "Building Energy Engineer",
    company: "Schneider Electric",
    city: "Grenoble",
    country: "France",
    salaryMinEur: 48000,
    salaryMaxEur: 62000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Building Management Systems", "Energy Efficiency", "HVAC", "IoT", "Smart Buildings"],
    contract: "full-time",
    remote: false,
    description: "Design smart building solutions to optimize energy consumption. Deploy IoT sensors and AI-powered controls to reduce building emissions by up to 50%.",
    apply_url: "https://www.se.com/careers"
  },
  {
    id: "real_j26",
    title: "Green Building Consultant",
    company: "Buro Happold",
    city: "London",
    country: "United Kingdom",
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["LEED", "BREEAM", "Energy Modeling", "Sustainability Consulting", "Net Zero"],
    contract: "full-time",
    remote: true,
    description: "Deliver LEED and BREEAM certifications for landmark buildings. Guide architects and developers to achieve net-zero carbon targets.",
    apply_url: "https://www.burohappold.com/careers/"
  },

  // === REAL JOBS 2026 - WATER & ENVIRONMENT ===
  {
    id: "real_j27",
    title: "Water Technology Engineer",
    company: "Veolia",
    city: "Paris",
    country: "France",
    salaryMinEur: 45000,
    salaryMaxEur: 58000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Water Treatment", "Wastewater", "Membrane Technology", "Process Engineering", "Sustainability"],
    contract: "full-time",
    remote: false,
    description: "Design and optimize water treatment systems. Ensure access to clean water while minimizing energy consumption and environmental impact.",
    apply_url: "https://www.veolia.com/careers"
  },

  // === PART-TIME JOBS 2026 ===
  {
    id: "pt_j1",
    title: "Part-Time Sustainability Coordinator",
    company: "European Climate Foundation",
    city: "Remote",
    country: "Europe",
    salaryMinEur: 25000,
    salaryMaxEur: 35000,
    level: 'mid',
    experienceYears: 2,
    knowledgeAreas: ["Climate Policy", "Project Coordination", "Stakeholder Engagement", "Remote Work", "EU Policy"],
    contract: "part-time",
    remote: true,
    description: "Support climate initiatives across Europe (20-30 hrs/week). Coordinate projects, engage with partners, and contribute to the climate transition from anywhere in Europe.",
    apply_url: "https://europeanclimate.org/about-us/jobs-ecf/"
  },
  {
    id: "pt_j2",
    title: "Remote ESG Reporting Analyst",
    company: "Sustainable Finance Platform",
    city: "Remote",
    country: "Europe",
    salaryMinEur: 28000,
    salaryMaxEur: 38000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["ESG Reporting", "CSRD", "GRI Standards", "Data Analysis", "Excel"],
    contract: "part-time",
    remote: true,
    description: "Analyze and report ESG data for European SMEs (25 hrs/week). Work remotely helping companies meet new sustainability reporting requirements.",
    apply_url: "https://euroclimatejobs.com/"
  },
  {
    id: "pt_j3",
    title: "Freelance Carbon Accounting Specialist",
    company: "Leafr Consulting",
    city: "Remote",
    country: "Europe",
    salaryMinEur: 30000,
    salaryMaxEur: 45000,
    level: 'senior',
    experienceYears: 4,
    knowledgeAreas: ["GHG Protocol", "Scope 3", "Carbon Footprinting", "LCA", "Client Management"],
    contract: "part-time",
    remote: true,
    description: "Calculate carbon footprints for organizations as a freelance consultant (flexible hours). Help European businesses measure and reduce their climate impact.",
    apply_url: "https://www.leafr.com/"
  },
  {
    id: "pt_j4",
    title: "Part-Time Circular Economy Advisor",
    company: "Ellen MacArthur Foundation",
    city: "Isle of Wight",
    country: "United Kingdom",
    salaryMinEur: 22000,
    salaryMaxEur: 32000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Circular Economy", "Business Models", "Material Flows", "Systems Thinking", "Communication"],
    contract: "part-time",
    remote: true,
    description: "Advise businesses on circular economy transitions (20 hrs/week). Work with the world's leading circular economy organization to eliminate waste.",
    apply_url: "https://ellenmacarthurfoundation.org/about-us/work-with-us"
  },
  {
    id: "pt_j5",
    title: "Sustainability Content Writer",
    company: "Climate Action Network Europe",
    city: "Brussels",
    country: "Belgium",
    salaryMinEur: 18000,
    salaryMaxEur: 26000,
    level: 'junior',
    experienceYears: 1,
    knowledgeAreas: ["Content Writing", "Climate Communication", "Social Media", "Research", "English"],
    contract: "part-time",
    remote: true,
    description: "Create compelling climate content for Europe's largest climate NGO network (15-20 hrs/week). Help amplify climate action messages across Europe.",
    apply_url: "https://caneurope.org/jobs/"
  },
  {
    id: "pt_j6",
    title: "Part-Time Renewable Energy Analyst",
    company: "SolarPower Europe",
    city: "Brussels",
    country: "Belgium",
    salaryMinEur: 24000,
    salaryMaxEur: 34000,
    level: 'mid',
    experienceYears: 2,
    knowledgeAreas: ["Solar Energy", "Market Analysis", "Data Analysis", "Energy Policy", "Excel"],
    contract: "part-time",
    remote: true,
    description: "Analyze European solar market trends (25 hrs/week). Support advocacy and research for Europe's solar industry association.",
    apply_url: "https://www.solarpowereurope.org/about-solarpowereurope/work-with-us"
  },
];

export default function JobsPage() {
  const { t, locale } = useI18n();
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

  // Filter to show only real jobs (jobs with apply_url)
  const realJobs = useMemo(() => JOBS.filter(job => job.apply_url), []);

  const filtered = useMemo(() => {
    const queryLower = query.toLowerCase().trim();

    return realJobs.filter((j) => {
      // Si no hay query, mostrar todos (solo aplicar filtros)
      if (!queryLower) return true;

      // Buscar en título del trabajo
      const titleMatch = j.title.toLowerCase().includes(queryLower) ||
        getJobTitle(j).toLowerCase().includes(queryLower);

      // Buscar en nombre de la empresa
      const companyMatch = j.company.toLowerCase().includes(queryLower);

      // Buscar en descripción del trabajo
      const descriptionMatch = j.description.toLowerCase().includes(queryLower) ||
        getJobDescription(j).toLowerCase().includes(queryLower);

      // Buscar en áreas de conocimiento
      const knowledgeMatch = j.knowledgeAreas.some(a =>
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
      const locationMatch =
        j.city.toLowerCase().includes(queryLower) ||
        j.country.toLowerCase().includes(queryLower) ||
        locationLabel(j.city, locale as any).toLowerCase().includes(queryLower) ||
        locationLabel(j.country, locale as any).toLowerCase().includes(queryLower);

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
      .filter(j => city === "all" ? true : j.city.toLowerCase() === city.toLowerCase())
      .filter(j => contract === "all" ? true : j.contract === contract)
      .filter(j => levelFilter === 'all' ? true : j.level === levelFilter)
      .filter(j => remoteOnly ? j.remote : true);
  }, [query, minSalary, minExperience, city, contract, levelFilter, remoteOnly, locale]);

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

  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
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

  // Helper functions to get translated job data with safe fallback
  const getJobTitle = (job: Job) => {
    // For jobs with apply_url (real jobs), always use the job.title directly
    if (job.apply_url) {
      return job.title;
    }
    // For mock jobs, try translation
    const titleKey = `jobTitle${job.id}`;
    const translated = t(titleKey);
    return translated === titleKey ? job.title : translated;
  };

  const getJobDescription = (job: Job) => {
    // For jobs with apply_url (real jobs), always use the job.description directly
    if (job.apply_url) {
      return job.description;
    }
    // For mock jobs, try translation
    const descKey = `jobDesc${job.id}`;
    const translated = t(descKey);
    return translated === descKey ? job.description : translated;
  };

  const getKnowledgeArea = (area: string) => {
    const areaKey = area.toLowerCase().replace(/\s+/g, '');
    const translated = t(areaKey);
    return translated === areaKey ? area : translated;
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
      {/* Header with green gradient - matching Community Chat style */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 mb-8">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">{t("jobs")}</h1>
          <p className="text-green-100 text-lg">
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
                {Array.from(new Set(realJobs.map(j => j.city))).map(c => (
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
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">{filtered.length} {t("results")}</div>
        </div>

        <div className="content-separator" />

        {filtered.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("noResults") || "No se encontraron resultados"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t("tryDifferentSearch") || "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <div key={job.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 hover-lift border border-gray-200 dark:border-slate-700 transition-all duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{getJobTitle(job)}</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2 flex-wrap">
                      <a
                        href={getCompanyUrl(job.company)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline font-medium transition-colors"
                        title={`Ver ${job.company} en LinkedIn`}
                      >
                        {job.company}
                      </a>
                      <a
                        href={getEcosiaSearchUrl(job.company)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs transition-colors"
                        title={`Buscar ${job.company} en Ecosia`}
                      >
                        🔍
                      </a>
                      {' — '}
                      {locationLabel(job.city, locale as any)}, {locationLabel(job.country, locale as any)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold">{fmtCurrency(job.salaryMinEur)}–{fmtCurrency(job.salaryMaxEur)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t(job.level === 'junior' ? 'levelJunior' : job.level === 'mid' ? 'levelMid' : job.level === 'senior' ? 'levelSenior' : 'levelLead')} • {job.contract}{job.remote ? " · Remote" : ""}</div>
                </div>
              </div>
              <div className="mt-3 text-slate-700 dark:text-slate-300">{getJobDescription(job)}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge-modern px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">{job.experienceYears} {t("yearsExp")}</span>
                {job.knowledgeAreas.map((a) => (
                  <span key={a} className="badge-modern px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">{getKnowledgeArea(a)}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                {job.apply_url ? (
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative touch-target px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover-lift flex items-center justify-center text-center"
                    title={t("rememberToTellThemTooltip") || "Recuerda decir que llegaste por aquí!"}
                  >
                    {t("applyBtn")} ↗
                    {/* Burbuja / Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-emerald-100 dark:border-emerald-900/50">
                      💚 {t("rememberToTellThemTooltip") || "Recuerda decir que llegaste por aquí!"}
                      {/* Flechita del tooltip */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white dark:border-t-slate-900"></div>
                    </div>
                  </a>
                ) : (
                  <button onClick={() => setApplyFor(job)} className="touch-target px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover-lift">{t("applyBtn")}</button>
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
                      { code: 'fr', label: 'Français' },
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
