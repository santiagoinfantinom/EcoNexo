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
  const [maxExperience, setMaxExperience] = useState(10);
  const [city, setCity] = useState<string>("all");
  const [contract, setContract] = useState<string>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const filtered = useMemo(() => {
    return JOBS.filter((j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.knowledgeAreas.some(a => a.toLowerCase().includes(query.toLowerCase()))
    ).filter(j => j.salaryEur >= minSalary && j.experienceYears <= maxExperience)
    .filter(j => city === "all" ? true : j.city.toLowerCase() === city.toLowerCase())
    .filter(j => contract === "all" ? true : j.contract === contract)
    .filter(j => remoteOnly ? j.remote : true);
  }, [query, minSalary, maxExperience, city, contract, remoteOnly]);

  const fmtCurrency = (v: number) =>
    new Intl.NumberFormat(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-ES', { style: 'currency', currency: 'EUR' }).format(v);

  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const [applyFor, setApplyFor] = useState<Job | null>(null);
  const [applicant, setApplicant] = useState({ name: "", email: "", cv: "" });
  const toggleSave = (id: string) => setSavedJobs((s)=> ({ ...s, [id]: !s[id] }));
  const submitApplication = async () => {
    setApplyFor(null);
    alert(t("applicationSent"));
    setApplicant({ name: "", email: "", cv: "" });
  };

  // Simple ES->DE term mapping for demo data to keep German UI fully localized
  const ES_DE: Record<string, string> = {
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

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
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
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("maxExperience")}</label>
          <input type="number" value={maxExperience} onChange={(e)=>setMaxExperience(Number(e.target.value)||0)} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
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

      <ul className="space-y-4">
        {filtered.map((job)=> (
          <li key={job.id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
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
          </li>
        ))}
      </ul>

      {applyFor && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">{t("applyForJob")}: {applyFor.title}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">{t("yourName")}</label>
                <input value={applicant.name} onChange={(e)=>setApplicant({...applicant,name:e.target.value})} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-sm mb-1">{t("yourEmail")}</label>
                <input value={applicant.email} onChange={(e)=>setApplicant({...applicant,email:e.target.value})} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-sm mb-1">{t("cvLink")}</label>
                <input value={applicant.cv} onChange={(e)=>setApplicant({...applicant,cv:e.target.value})} className="w-full border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={()=>setApplyFor(null)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded">{t("cancel")}</button>
                <button onClick={submitApplication} className="px-4 py-2 bg-green-600 text-white rounded">{t("sendApplication")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


