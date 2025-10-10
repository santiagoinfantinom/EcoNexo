"use client";
import React, { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { locationLabel } from "@/lib/i18n";

type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  country: string;
  salaryEur: number;
  experienceYears: number;
  knowledgeAreas: string[];
  contract: "full-time" | "part-time" | "contract" | "internship";
  remote: boolean;
  description: string;
};

const JOBS: Job[] = [
  {
    id: "j1",
    title: "Especialista en Reforestación Urbana",
    company: "Green City Berlin",
    city: "Berlín",
    country: "Alemania",
    salaryEur: 42000,
    experienceYears: 2,
    knowledgeAreas: ["Silvicultura", "Biodiversidad", "Gestión de proyectos"],
    contract: "full-time",
    remote: false,
    description: "Planificación y ejecución de proyectos de reforestación en barrios con déficit de áreas verdes.",
  },
  {
    id: "j2",
    title: "Analista de Datos de Calidad del Aire",
    company: "Euro Air Lab",
    city: "París",
    country: "Francia",
    salaryEur: 52000,
    experienceYears: 3,
    knowledgeAreas: ["Python", "Sensores", "GIS"],
    contract: "full-time",
    remote: true,
    description: "Procesamiento y visualización de datos de sensores urbanos para políticas de aire limpio.",
  },
  {
    id: "j3",
    title: "Educador/a ambiental (STEM)",
    company: "SolarTech Academy",
    city: "Madrid",
    country: "España",
    salaryEur: 28000,
    experienceYears: 1,
    knowledgeAreas: ["Didáctica", "Energía solar", "Robótica educativa"],
    contract: "part-time",
    remote: false,
    description: "Talleres prácticos de energía renovable para escuelas y centros comunitarios.",
  },
  {
    id: "j4",
    title: "Coordinador/a de Limpiezas de Ríos",
    company: "River Guardians",
    city: "Milán",
    country: "Italia",
    salaryEur: 35000,
    experienceYears: 2,
    knowledgeAreas: ["Gestión de voluntariado", "Residuos", "Seguridad"],
    contract: "contract",
    remote: false,
    description: "Organización de jornadas de limpieza, logística de equipos y reportes de impacto.",
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
  const filtered = useMemo(() => {
    return JOBS.filter((j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.knowledgeAreas.some(a => a.toLowerCase().includes(query.toLowerCase()))
    ).filter(j => j.salaryEur >= minSalary && j.experienceYears >= minExperience)
    .filter(j => city === "all" ? true : j.city.toLowerCase() === city.toLowerCase())
    .filter(j => contract === "all" ? true : j.contract === contract)
    .filter(j => remoteOnly ? j.remote : true);
  }, [query, minSalary, minExperience, city, contract, remoteOnly]);

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
    motivationLetter: null as File | null 
  });
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
      motivationLetter: null 
    });
  };

  // Simple ES->DE term mapping for demo data to keep German UI fully localized
  const ES_DE: Record<string, string> = {
    "Especialista en Reforestación Urbana": "Spezialist/in für Urbane Aufforstung",
    "Especialista": "Spezialist/in",
    "Reforestación Urbana": "Urbane Aufforstung",
    "Analista de Datos de Calidad del Aire": "Datenanalyst/in für Luftqualität",
    "Educador/a ambiental (STEM)": "Umweltpädagog/in (STEM)",
    "Coordinador/a de Limpiezas de Ríos": "Koordinator/in Flussreinigung",
    "Planificación y ejecución de proyectos de reforestación en barrios con déficit de áreas verdes.": "Planung und Durchführung von Aufforstungsprojekten in Vierteln mit wenig Grünflächen.",
    "Procesamiento y visualización de datos de sensores urbanos para políticas de aire limpio.": "Verarbeitung und Visualisierung von Sensordaten für saubere‑Luft‑Politiken.",
    "Talleres prácticos de energía renovable para escuelas y centros comunitarios.": "Praxisworkshops zu erneuerbarer Energie für Schulen und Gemeinschaftszentren.",
    "Organización de jornadas de limpieza, logística de equipos y reportes de impacto.": "Organisation von Reinigungstagen, Logistik der Teams und Wirkungsberichten.",
    "Silvicultura": "Forstwirtschaft",
    "Biodiversidad": "Biodiversität",
    "Gestión de proyectos": "Projektmanagement",
    "Sensores": "Sensorik",
    "Energía solar": "Solarenergie",
    "Robótica educativa": "Bildungsrobotik",
    "Gestión de voluntariado": "Freiwilligenmanagement",
    "Residuos": "Abfall",
    "Seguridad": "Sicherheit",
  };

  const tr = (text: string) => {
    if (locale !== 'de') return text;
    return ES_DE[text] || text;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">{t("jobs")}</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 mb-6 mt-8 grid grid-cols-1 md:grid-cols-6 gap-4">
        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
          placeholder={t("searchJobsPlaceholder")}
        />
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("minSalary")}</label>
          <input type="number" value={minSalary} onChange={(e)=>setMinSalary(Number(e.target.value)||0)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("minExperience")}</label>
          <input type="number" value={minExperience} onChange={(e)=>setMinExperience(Number(e.target.value)||0)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("cityLabel")}</label>
          <select value={city} onChange={(e)=>setCity(e.target.value)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
            <option value="all">Todas</option>
            {Array.from(new Set(JOBS.map(j=>j.city))).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("contractLabel")}</label>
          <select value={contract} onChange={(e)=>setContract(e.target.value)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
            <option value="all">All</option>
            <option value="full-time">{t("contract_full_time")}</option>
            <option value="part-time">{t("contract_part_time")}</option>
            <option value="contract">{t("contract_contract")}</option>
            <option value="internship">{t("contract_internship")}</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={remoteOnly} onChange={(e)=>setRemoteOnly(e.target.checked)} className="h-4 w-4" />
          {t("remoteOnly")}
        </label>
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-end">{filtered.length} {t("results")}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((job)=> (
          <div key={job.id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{tr(job.title)}</h2>
                <p className="text-slate-600 dark:text-slate-400">{job.company} — {locationLabel(job.city, locale as any)}, {locationLabel(job.country, locale as any)}</p>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-bold">{fmtCurrency(job.salaryEur)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{job.contract}{job.remote ? " · Remote" : ""}</div>
              </div>
            </div>
            <div className="mt-3 text-slate-700 dark:text-slate-300">{tr(job.description)}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">{job.experienceYears} {t("yearsExp")}</span>
              {job.knowledgeAreas.map((a) => (
                <span key={a} className="px-2 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{tr(a)}</span>
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
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{t("applyForJob")}: {applyFor.title}</h2>
            <div className="space-y-4">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("yourName")} *</label>
                  <input 
                    value={applicant.name} 
                    onChange={(e)=>setApplicant({...applicant,name:e.target.value})} 
                    className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("yourEmail")} *</label>
                  <input 
                    type="email"
                    value={applicant.email} 
                    onChange={(e)=>setApplicant({...applicant,email:e.target.value})} 
                    className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                    required
                  />
                </div>
              </div>

              {/* CV Link */}
              <div>
                <label className="block text-sm font-medium mb-1">{t("cvLink")} ({t("optional")})</label>
                <input 
                  value={applicant.cv} 
                  onChange={(e)=>setApplicant({...applicant,cv:e.target.value})} 
                  className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" 
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              </div>

              {/* Motivaciones */}
              <div>
                <label className="block text-sm font-medium mb-1">{t("motivations")} *</label>
                <textarea 
                  value={applicant.motivations} 
                  onChange={(e)=>setApplicant({...applicant,motivations:e.target.value})} 
                  className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 min-h-24" 
                  placeholder={t("motivationsPlaceholder")}
                  required
                />
              </div>

              {/* Áreas de Expertise */}
              <div>
                <label className="block text-sm font-medium mb-1">{t("expertiseAreas")} *</label>
                <textarea 
                  value={applicant.expertiseAreas} 
                  onChange={(e)=>setApplicant({...applicant,expertiseAreas:e.target.value})} 
                  className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 min-h-20" 
                  placeholder={t("expertiseAreasPlaceholder")}
                  required
                />
              </div>

              {/* Carta de Motivación PDF */}
              <div>
                <label className="block text-sm font-medium mb-1">{t("motivationLetter")} ({t("optional")})</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4">
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
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {applicant.motivationLetter ? (
                        <span className="text-green-600 dark:text-green-400">
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
                    className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    {t("removeFile")}
                  </button>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={()=>setApplyFor(null)} 
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
