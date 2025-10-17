import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import PROJECTS from "@/data/projects";
import ProjectDetailClient from "@/components/ProjectDetailClient";
import ProjectNotFound from "@/components/ProjectNotFound";
import { impactTagLabel, projectDescriptionLabel } from "@/lib/i18n";

type Project = {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  category: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  spots?: number;
};

type ProjectDetails = Project & {
  volunteers: number;
  budgetRaisedEur: number;
  budgetGoalEur: number;
  image: string; // path under /public or URL
};

const FALLBACK_DETAILS: Record<string, ProjectDetails> = {
  p1: {
    id: "p1",
    name: "Reforestación Urbana Berlín",
    category: "Medio ambiente",
    lat: 52.52,
    lng: 13.405,
    city: "Berlín",
    country: "Alemania",
    spots: 50,
    volunteers: 132,
    budgetRaisedEur: 12450,
    budgetGoalEur: 30000,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    description:
      "Plantación de árboles nativos en barrios con déficit de áreas verdes, involucrando a escuelas y organizaciones locales.",
  },
  p2: {
    id: "p2",
    name: "Taller de Robótica Educativa",
    name_en: "Educational Robotics Workshop",
    name_de: "Workshop für Bildungsrobotik",
    category: "Educación",
    lat: 40.4168,
    lng: -3.7038,
    city: "Madrid",
    country: "España",
    volunteers: 58,
    budgetRaisedEur: 8450,
    budgetGoalEur: 15000,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
    description:
      "Programa STEAM para jóvenes en situación de vulnerabilidad con enfoque en prototipado y pensamiento computacional.",
    description_en: "STEAM program for at-risk youth focusing on prototyping and computational thinking.",
    description_de: "STEAM-Programm für benachteiligte Jugendliche mit Schwerpunkt auf Prototyping und Computational Thinking.",
  },
  p3: {
    id: "p3",
    name: "Clínica móvil comunitaria",
    category: "Salud",
    lat: 45.4642,
    lng: 9.19,
    city: "Milán",
    country: "Italia",
    volunteers: 74,
    budgetRaisedEur: 19600,
    budgetGoalEur: 40000,
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80",
    description:
      "Atención primaria itinerante con foco en prevención y chequeos básicos en barrios periféricos.",
  },
  p4: {
    id: "p4",
    name: "Recuperación de playas",
    category: "Océanos",
    lat: 43.2965,
    lng: 5.3698,
    city: "Marsella",
    country: "Francia",
    volunteers: 210,
    budgetRaisedEur: 27200,
    budgetGoalEur: 50000,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    description:
      "Limpieza costera, monitoreo de microplásticos y campañas de educación ambiental para turistas y residentes.",
  },
  p5: {
    id: "p5",
    name: "Huertos urbanos",
    category: "Alimentación",
    lat: 51.5072,
    lng: -0.1276,
    city: "Londres",
    country: "Reino Unido",
    volunteers: 89,
    budgetRaisedEur: 15200,
    budgetGoalEur: 28000,
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80",
    description:
      "Red de huertos comunitarios para fortalecer la seguridad alimentaria y promover dietas sostenibles.",
  },
  p6: {
    id: "p6",
    name: "Centros vecinales inclusivos",
    category: "Comunidad",
    lat: 59.3293,
    lng: 18.0686,
    city: "Estocolmo",
    country: "Suecia",
    volunteers: 47,
    budgetRaisedEur: 9300,
    budgetGoalEur: 20000,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    description:
      "Creación de espacios de encuentro con programación cultural y talleres de integración para nuevos residentes.",
  },
};

const IMPACT_TAGS_BY_CATEGORY: Record<string, { label: string; emoji: string; color: string }[]> = {
  "Medio ambiente": [
    { label: "Reforestación", emoji: "🌳", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { label: "Calidad del aire", emoji: "🌬️", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  ],
  "Educación": [
    { label: "STEM", emoji: "🧪", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
    { label: "Inclusión", emoji: "🤝", color: "bg-amber-100 text-amber-900 border-amber-200" },
  ],
  "Salud": [
    { label: "Prevención", emoji: "🩺", color: "bg-rose-100 text-rose-800 border-rose-200" },
    { label: "Acceso", emoji: "🚑", color: "bg-slate-100 text-slate-800 border-slate-200" },
  ],
  "Comunidad": [
    { label: "Integración", emoji: "🤗", color: "bg-purple-100 text-purple-800 border-purple-200" },
    { label: "Cultura", emoji: "🎭", color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200" },
  ],
  "Océanos": [
    { label: "Playas limpias", emoji: "🏖️", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
    { label: "Biodiversidad", emoji: "🐟", color: "bg-sky-100 text-sky-800 border-sky-200" },
  ],
  "Alimentación": [
    { label: "Huertos urbanos", emoji: "🌱", color: "bg-lime-100 text-lime-800 border-lime-200" },
    { label: "Comunidad", emoji: "👥", color: "bg-amber-100 text-amber-900 border-amber-200" },
  ],
};

// Required for static export
export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: String(p.id) }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://econexo.org";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => String(p.id) === String(id)) as any;
  const title = project?.name ? `${project.name} | EcoNexo` : `Proyecto ${id} | EcoNexo`;
  const description = project?.description || "Proyecto de impacto en EcoNexo.";
  const image = (project?.image_url as string | undefined) || 
    `${SITE_URL}/vercel.svg`;
  const url = `${SITE_URL}/projects/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: project?.name || `Proyecto ${id}` }],
      siteName: "EcoNexo",
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

async function fetchProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`/api/projects`, { cache: "no-store" });
    if (!res.ok) return null;
    const list: Project[] = await res.json();
    return list.find((p) => String(p.id) === String(id)) ?? null;
  } catch {
    return null;
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = (await fetchProject(id)) ?? (PROJECTS.find((p) => String(p.id) === String(id)) as any) ?? FALLBACK_DETAILS[id];

  if (!project) {
    return <ProjectNotFound />;
  }

  const base: ProjectDetails = (FALLBACK_DETAILS[id] as ProjectDetails) ?? {
    id: String(project?.id ?? id),
    name: project?.name ?? "",
    category: (project as any)?.category ?? "Comunidad",
    lat: (project as any)?.lat ?? 52.52,
    lng: (project as any)?.lng ?? 13.405,
    city: (project as any)?.city ?? "Berlín",
    country: (project as any)?.country ?? "Alemania",
    spots: (project as any)?.spots,
    volunteers: 0,
    budgetRaisedEur: 0,
    budgetGoalEur: 10000,
    image: (project as any)?.image_url ?? "/window.svg",
    description: (project as any)?.description ?? "",
    name_en: (project as any)?.name_en,
    name_de: (project as any)?.name_de,
    description_en: (project as any)?.description_en,
    description_de: (project as any)?.description_de,
  };

  const details = {
    ...base,
    // Prefer API/project values when present
    id: String((project as any)?.id ?? base.id),
    name: (project as any)?.name ?? base.name,
    name_en: (project as any)?.name_en ?? base.name_en,
    name_de: (project as any)?.name_de ?? base.name_de,
    category: (project as any)?.category ?? base.category,
    lat: (project as any)?.lat ?? base.lat,
    lng: (project as any)?.lng ?? base.lng,
    city: (project as any)?.city ?? base.city,
    country: (project as any)?.country ?? base.country,
    spots: (project as any)?.spots ?? base.spots,
    description: (project as any)?.description ?? (base.description ?? ""),
    description_en: (project as any)?.description_en ?? base.description_en,
    description_de: (project as any)?.description_de ?? base.description_de,
    image: (project as any)?.image_url ?? base.image,
    volunteers: (base as any).volunteers ?? 0,
    budgetRaisedEur: (base as any).budgetRaisedEur ?? 0,
    budgetGoalEur: (base as any).budgetGoalEur ?? 10000,
  } as unknown as ProjectDetails;

  const progress = Math.min(
    100,
    Math.round((details.budgetRaisedEur / details.budgetGoalEur) * 100)
  );

  const paypalLink = process.env.NEXT_PUBLIC_PAYPAL_LINK || "https://www.paypal.com/donate";
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_LINK || "https://stripe.com/payments/checkout";

  // Translate impact tags based on current locale on the client, so pass raw labels
  return (
    <>
      <Script id="jsonld-project" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: details.name,
          description: details.description,
          image: details.image,
          url: `${SITE_URL}/projects/${id}`,
          areaServed: details.city ? `${details.city}, ${details.country}` : details.country,
          about: details.category,
        })}
      </Script>
      <ProjectDetailClient
        id={id}
        details={details as any}
        impactTags={(IMPACT_TAGS_BY_CATEGORY[details.category] ?? [])}
        paypalLink={paypalLink}
        stripeLink={stripeLink}
      />
    </>
  );
}


