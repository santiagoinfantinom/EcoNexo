"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useI18n, locationLabel } from "@/lib/i18n";

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
};

// Función para traducir tags técnicos
const translateTag = (tag: string, t: (key: string) => string): string => {
  // Convertir a minúsculas y sin espacios para buscar en las traducciones
  const normalizedTag = tag.toLowerCase().replace(/\s+/g, '');
  return t(normalizedTag) || tag;
};

const JOBS: Job[] = [
  {
    id: "j1",
    title: "Especialista en Reforestación Urbana",
    company: "Green City Berlin",
    city: "Berlín",
    country: "Alemania",
    salaryMinEur: 38000,
    salaryMaxEur: 46000,
    level: 'mid',
    experienceYears: 2,
    knowledgeAreas: ["Silvicultura", "Biodiversidad", "Gestión de proyectos", "GIS", "Botánica"],
    contract: "full-time",
    remote: false,
    description: "Planificación y ejecución de proyectos de reforestación en barrios con déficit de áreas verdes. Coordinación con autoridades municipales, diseño de espacios verdes sostenibles y supervisión de equipos de voluntarios.",
  },
  {
    id: "j2",
    title: "Analista de Calidad del Aire",
    company: "Euro Air Lab",
    city: "París",
    country: "Francia",
    salaryMinEur: 48000,
    salaryMaxEur: 60000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Python", "Sensores", "GIS", "Machine Learning", "Estadística"],
    contract: "full-time",
    remote: true,
    description: "Procesamiento y visualización de datos de sensores urbanos para políticas de aire limpio. Desarrollo de algoritmos de predicción de contaminación y creación de dashboards interactivos.",
  },
  {
    id: "j3",
    title: "Educador en Energías Renovables",
    company: "SolarTech Academy",
    city: "Madrid",
    country: "España",
    salaryMinEur: 24000,
    salaryMaxEur: 32000,
    level: 'junior',
    experienceYears: 1,
    knowledgeAreas: ["Didáctica", "Energía solar", "Robótica educativa", "Comunicación"],
    contract: "part-time",
    remote: false,
    description: "Talleres prácticos de energía renovable para escuelas y centros comunitarios. Desarrollo de materiales educativos interactivos y programas de sensibilización ambiental.",
  },
  {
    id: "j4",
    title: "Coordinador de Limpieza Fluvial",
    company: "River Guardians",
    city: "Milán",
    country: "Italia",
    salaryMinEur: 32000,
    salaryMaxEur: 40000,
    level: 'mid',
    experienceYears: 2,
    knowledgeAreas: ["Gestión de voluntariado", "Residuos", "Seguridad", "Logística"],
    contract: "contract",
    remote: false,
    description: "Organización de jornadas de limpieza, logística de equipos y reportes de impacto. Coordinación con organizaciones locales y desarrollo de protocolos de seguridad.",
  },
  {
    id: "j5",
    title: "Desarrollador de Apps Sostenibles",
    company: "EcoTech Solutions",
    city: "Barcelona",
    country: "España",
    salaryMinEur: 42000,
    salaryMaxEur: 52000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["React Native", "Node.js", "Blockchain", "IoT", "UX/UI"],
    contract: "full-time",
    remote: true,
    description: "Desarrollo de aplicaciones móviles para tracking de huella de carbono, gamificación de acciones ecológicas y plataformas de comercio justo.",
  },
  {
    id: "j6",
    title: "Biólogo Marino",
    company: "Ocean Conservation",
    city: "Lisboa",
    country: "Portugal",
    salaryMinEur: 34000,
    salaryMaxEur: 42000,
    level: 'mid',
    experienceYears: 4,
    knowledgeAreas: ["Biología marina", "Conservación", "Investigación", "Buceo"],
    contract: "full-time",
    remote: false,
    description: "Investigación de ecosistemas marinos, monitoreo de especies en peligro y desarrollo de programas de conservación costera.",
  },
  {
    id: "j7",
    title: "Arquitecto Sostenible",
    company: "Green Architecture Studio",
    city: "Ámsterdam",
    country: "Países Bajos",
    salaryMinEur: 52000,
    salaryMaxEur: 65000,
    level: 'senior',
    experienceYears: 5,
    knowledgeAreas: ["Arquitectura", "Sostenibilidad", "CAD", "Certificación LEED"],
    contract: "full-time",
    remote: false,
    description: "Diseño de edificios con certificación energética A+, integración de sistemas de energía renovable y materiales eco-friendly.",
  },
  {
    id: "j8",
    title: "Especialista en Economía Circular",
    company: "Circular Economy Institute",
    city: "Copenhague",
    country: "Dinamarca",
    salaryMinEur: 45000,
    salaryMaxEur: 56000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Economía", "Sostenibilidad", "Análisis de datos", "Políticas públicas"],
    contract: "full-time",
    remote: true,
    description: "Desarrollo de modelos de negocio circulares, análisis de impacto ambiental y asesoramiento a empresas en transición sostenible.",
  },
  {
    id: "j9",
    title: "Ingeniero de Energía Eólica",
    company: "WindPower Europe",
    city: "Hamburgo",
    country: "Alemania",
    salaryMinEur: 58000,
    salaryMaxEur: 72000,
    level: 'senior',
    experienceYears: 4,
    knowledgeAreas: ["Ingeniería", "Energía eólica", "Automatización", "Mantenimiento"],
    contract: "full-time",
    remote: false,
    description: "Diseño y optimización de parques eólicos offshore, supervisión de instalaciones y desarrollo de tecnologías de almacenamiento energético.",
  },
  {
    id: "j10",
    title: "Comunicador Ambiental",
    company: "Green Media Agency",
    city: "Londres",
    country: "Reino Unido",
    salaryMinEur: 30000,
    salaryMaxEur: 42000,
    level: 'junior',
    experienceYears: 2,
    knowledgeAreas: ["Comunicación", "Marketing digital", "Redes sociales", "Video producción"],
    contract: "contract",
    remote: true,
    description: "Creación de contenido multimedia sobre sostenibilidad, gestión de campañas de concienciación ambiental y community management.",
  },
  {
    id: "j11",
    title: "Especialista en Agricultura Regenerativa",
    company: "RegenAg Solutions",
    city: "Roma",
    country: "Italia",
    salaryMinEur: 36000,
    salaryMaxEur: 46000,
    level: 'mid',
    experienceYears: 3,
    knowledgeAreas: ["Agronomía", "Permacultura", "Suelos", "Biodiversidad"],
    contract: "full-time",
    remote: false,
    description: "Implementación de técnicas de agricultura regenerativa, restauración de suelos degradados y capacitación de agricultores locales.",
  },
  {
    id: "j12",
    title: "Analista de Sostenibilidad Corporativa",
    company: "ESG Consulting",
    city: "Zúrich",
    country: "Suiza",
    salaryMinEur: 62000,
    salaryMaxEur: 78000,
    level: 'senior',
    experienceYears: 4,
    knowledgeAreas: ["ESG", "Finanzas sostenibles", "Reporting", "Auditoría"],
    contract: "full-time",
    remote: true,
    description: "Evaluación de criterios ESG, desarrollo de estrategias de sostenibilidad corporativa y preparación de reportes de impacto para inversores.",
  },
];

export default function JobsPage() {
  const { t, locale } = useI18n();
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
    } catch {}
  }, []);

  // Persist filters whenever they change
  useEffect(() => {
    try {
      const toSave = { query, minSalary, minExperience, city, contract, remoteOnly, levelFilter };
      localStorage.setItem('econexo:jobFilters', JSON.stringify(toSave));
    } catch {}
  }, [query, minSalary, minExperience, city, contract, remoteOnly, levelFilter]);
  const filtered = useMemo(() => {
    return JOBS.filter((j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.knowledgeAreas.some(a => a.toLowerCase().includes(query.toLowerCase()))
    ).filter(j => j.salaryMinEur >= minSalary && j.experienceYears >= minExperience)
    .filter(j => city === "all" ? true : j.city.toLowerCase() === city.toLowerCase())
    .filter(j => contract === "all" ? true : j.contract === contract)
    .filter(j => levelFilter === 'all' ? true : j.level === levelFilter)
    .filter(j => remoteOnly ? j.remote : true);
  }, [query, minSalary, minExperience, city, contract, levelFilter, remoteOnly]);

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
      
      setShowSuccess(true);
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
      
      setTimeout(() => setShowSuccess(false), 3000);
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
  const toggleSave = (id: string) => setSavedJobs((s)=> ({ ...s, [id]: !s[id] }));
  const submitApplication = async () => {
    setApplyFor(null);
    alert(t("applicationSent"));
    setApplicant({ 
      name: "", 
      email: "", 
      cv: "", 
      motivations: "", 
      expertiseAreas: "", 
      motivationLetter: null,
      languages: []
    });
  };

  // Helper functions to get translated job data with safe fallback
  const getJobTitle = (job: Job) => {
    const titleKey = `jobTitle${job.id.charAt(1)}`;
    const translated = t(titleKey);
    return translated === titleKey ? job.title : translated;
  };

  const getJobDescription = (job: Job) => {
    const descKey = `jobDesc${job.id.charAt(1)}`;
    const translated = t(descKey);
    return translated === descKey ? job.description : translated;
  };

  const getKnowledgeArea = (area: string) => {
    const areaKey = area.toLowerCase().replace(/\s+/g, '');
    const translated = t(areaKey);
    return translated === areaKey ? area : translated;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">{t("jobs")}</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 mb-6 mt-8">
        {/* Primera fila: Barra de búsqueda grande */}
        <div className="mb-4">
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            className="w-full border rounded px-4 py-3 text-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            placeholder={t('searchPlaceholder' + locale.charAt(0).toUpperCase() + locale.slice(1))}
          />
        </div>
        
        {/* Segunda fila: Parámetros de búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("minSalary")}</label>
            <input type="number" value={minSalary} onChange={(e)=>setMinSalary(Number(e.target.value)||0)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("minExperience")}</label>
            <input type="number" value={minExperience} onChange={(e)=>setMinExperience(Number(e.target.value)||0)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("cityLabel")}</label>
            <select value={city} onChange={(e)=>setCity(e.target.value)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
              <option value="all">{t('allCities')}</option>
              {Array.from(new Set(JOBS.map(j=>j.city))).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("experienceLevel")}</label>
            <select value={levelFilter} onChange={(e)=>setLevelFilter(e.target.value as any)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
              <option value="all">{t('all')}</option>
              <option value="junior">{t('levelJunior')}</option>
              <option value="mid">{t('levelMid')}</option>
              <option value="senior">{t('levelSenior')}</option>
              <option value="lead">{t('levelLead')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-0.5">{t("contractLabel")}</label>
            <select value={contract} onChange={(e)=>setContract(e.target.value)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
              <option value="all">{t('allContracts')}</option>
              <option value="full-time">{t("contract_full_time")}</option>
              <option value="part-time">{t("contract_part_time")}</option>
              <option value="contract">{t("contract_contract")}</option>
              <option value="internship">{t("contract_internship")}</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 h-10">
              <input type="checkbox" checked={remoteOnly} onChange={(e)=>setRemoteOnly(e.target.checked)} className="h-4 w-4" />
              {t("remoteOnly")}
            </label>
          </div>
        </div>
        
        {/* Contador de resultados */}
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">{filtered.length} {t("results")}</div>
      </div>

      <div className="content-separator" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((job)=> (
          <div key={job.id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{getJobTitle(job)}</h2>
                <p className="text-slate-600 dark:text-slate-400">{job.company} — {locationLabel(job.city, locale as any)}, {locationLabel(job.country, locale as any)}</p>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-bold">{fmtCurrency(job.salaryMinEur)}–{fmtCurrency(job.salaryMaxEur)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t(job.level === 'junior' ? 'levelJunior' : job.level === 'mid' ? 'levelMid' : job.level === 'senior' ? 'levelSenior' : 'levelLead')} • {job.contract}{job.remote ? " · Remote" : ""}</div>
              </div>
            </div>
            <div className="mt-3 text-slate-700 dark:text-slate-300">{getJobDescription(job)}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">{job.experienceYears} {t("yearsExp")}</span>
              {job.knowledgeAreas.map((a) => (
                <span key={a} className="px-2 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{getKnowledgeArea(a)}</span>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={()=>setApplyFor(job)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t("applyBtn")}</button>
              <button onClick={()=>toggleSave(job.id)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700">{savedJobs[job.id] ? t("saved") : t("saveBtn")}</button>
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
                    onChange={(e)=>setApplicant({...applicant,name:e.target.value})} 
                    className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">{t("yourEmail")} *</label>
                  <input 
                    type="email"
                    value={applicant.email} 
                    onChange={(e)=>setApplicant({...applicant,email:e.target.value})} 
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
                  onChange={(e)=>setApplicant({...applicant,cv:e.target.value})} 
                  className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400" 
                  placeholder={locale === 'de' ? 'z. B. https://linkedin.com/in/dein-profil' : 'https://linkedin.com/in/tu-perfil'}
                />
              </div>

              {/* Motivaciones */}
              <div>
                <label className="block text-sm font-medium mb-1 text-white">{t("motivations")} *</label>
                <textarea 
                  value={applicant.motivations} 
                  onChange={(e)=>setApplicant({...applicant,motivations:e.target.value})} 
                  className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-700 text-white placeholder:text-slate-400 min-h-24" 
                  placeholder={t("motivationsPlaceholder")}
                  required
                />
              </div>

              {/* Áreas de Expertise */}
              <div>
                <label className="block text-sm font-medium mb-1 text-white">{t("expertiseAreas")} *</label>
                <textarea 
                  value={applicant.expertiseAreas} 
                  onChange={(e)=>setApplicant({...applicant,expertiseAreas:e.target.value})} 
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
                        setApplicant({...applicant, motivationLetter: file});
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
                          <span className="font-medium">{t("clickToUpload")}</span><br/>
                          {t("pdfOnly")} (Max. 5MB)
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {applicant.motivationLetter && (
                  <button
                    type="button"
                    onClick={() => setApplicant({...applicant, motivationLetter: null})}
                    className="mt-2 text-sm text-red-400 hover:underline"
                  >
                    {t("removeFile")}
                  </button>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={()=>setApplyFor(null)} 
                  className="px-4 py-2 border border-slate-600 rounded hover:bg-slate-700 transition-colors text-white"
                >
                  {t("cancel")}
                </button>
                <button 
                  onClick={submitApplication} 
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
                >
                  {t("sendApplication")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Posting Conditions and Create Job Offer Section */}
      <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {t("jobPostingConditions")}
        </h2>
        
        <div className="mb-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            {t("jobPostingInfo")}
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
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

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[10000]">
          ✅ {t("jobCreated")}
        </div>
      )}
    </div>
  );
}
