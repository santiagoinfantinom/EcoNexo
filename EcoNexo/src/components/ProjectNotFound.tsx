"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectDetailClient from "./ProjectDetailClient";

export default function ProjectNotFound() {
  const { t, locale } = useI18n();
  const params = useParams();
  const id = params?.id as string;
  const [localProject, setLocalProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      try {
        const localProjects = JSON.parse(localStorage.getItem('econexo:projects') || '[]');
        const found = localProjects.find((p: any) => p.id === id);
        if (found) {
          setLocalProject(found);
        }
      } catch (e) {
        console.error("Error reading local projects", e);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="p-8 text-center">{locale === 'es' ? 'Cargando...' : 'Loading...'}</div>;

  if (localProject) {
    // Reconstruct details object compatible with ProjectDetailClient
    const details = {
      ...localProject,
      image: localProject.image_url || "/window.svg"
    };

    return (
      <ProjectDetailClient
        id={id}
        details={details}
        impactTags={[
          { label: "Local", emoji: "🏠", color: "bg-gray-100 text-gray-800" },
          { label: "New", emoji: "✨", color: "bg-green-100 text-green-800" }
        ]}
        paypalLink="https://paypal.com"
        stripeLink="https://stripe.com"
      />
    );
  }

  return (
    <div className="grid gap-4 p-8 text-center justify-items-center">
      <div className="text-3xl mb-2">😕</div>
      <div className="text-lg font-semibold text-slate-900 dark:text-white">
        {locale === 'es' ? "Proyecto no encontrado" :
          locale === 'de' ? "Projekt nicht gefunden" :
            "Project not found"}
      </div>
      <p className="text-slate-600 dark:text-slate-400 max-w-md">
        {locale === 'es'
          ? "Lo sentimos, no pudimos encontrar el proyecto que estás buscando. Puede haber sido eliminado o el enlace es incorrecto."
          : "Sorry, we couldn't find the project you are looking for. It may have been removed or the link is incorrect."}
      </p>
      <Link href="/" className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-md mt-4">
        {locale === 'es' ? "Volver al Explorador" :
          locale === 'de' ? "Zurück" :
            "Back to Explore"}
      </Link>
    </div>
  );
}
