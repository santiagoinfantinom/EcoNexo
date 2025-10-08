"use client";
import Link from "next/link";
import { useI18n, categoryLabel, impactTagLabel, projectDescriptionLabel, projectNameLabel, locationLabel } from "@/lib/i18n";
import ProjectImage from "@/components/ProjectImage";

type ProjectDetails = {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
  category: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  spots?: number;
  volunteers: number;
  budgetRaisedEur: number;
  budgetGoalEur: number;
  image: string;
  description: string;
  description_en?: string;
  description_de?: string;
};

export default function ProjectDetailClient({ id, details, impactTags, paypalLink, stripeLink }: {
  id: string;
  details: ProjectDetails;
  impactTags: { label: string; emoji: string; color: string }[];
  paypalLink: string;
  stripeLink: string;
}) {
  const { t, locale } = useI18n();
  const progress = Math.min(100, Math.round((details.budgetRaisedEur / details.budgetGoalEur) * 100));

  return (
    <div className="grid gap-6 max-w-6xl mx-auto">
      <div className="grid gap-2 place-items-center text-center">
        <div className="text-3xl font-semibold">{projectNameLabel(details.id, details.name, locale)}</div>
        <div className="text-sm text-gray-400">
          {locationLabel(details.city, locale)}, {locationLabel(details.country, locale)} · {t("category")}: {categoryLabel(details.category, locale)}
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr,3fr] gap-6 items-start">
        <div className="border rounded overflow-hidden bg-white shadow-sm">
          <ProjectImage src={details.image} alt={details.name} fallbackSrc="/window.svg" className="w-full h-72 object-cover bg-gray-100" />
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 place-items-center sm:place-items-stretch">
            <div className="border rounded p-5 bg-white shadow-sm">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">{t("volunteers")}</div>
              <div className="text-4xl font-black text-gray-50 bg-gray-900 inline-block px-3 rounded leading-tight">{details.volunteers.toLocaleString("es-ES")}</div>
            </div>
            <div className="border rounded p-5 bg-white shadow-sm">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">{t("raised")}</div>
              <div className="text-4xl font-black text-white bg-green-700 inline-block px-3 rounded leading-tight">€ {details.budgetRaisedEur.toLocaleString("es-ES")}</div>
            </div>
            <div className="border rounded p-5 bg-white shadow-sm">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">{t("goal")}</div>
              <div className="text-4xl font-black text-gray-900 bg-amber-200 inline-block px-3 rounded leading-tight">€ {details.budgetGoalEur.toLocaleString("es-ES")}</div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="h-3 w-full bg-gray-300 rounded">
              <div className="h-3 bg-green-700 rounded" style={{ width: `${progress}%` }} aria-label={t("progressReached")} />
            </div>
            <div className="text-base font-bold text-white">{progress}% {t("reached")}</div>
          </div>

          <div className="grid gap-2">
            <div className="text-base font-semibold text-white">{t("description")}</div>
            <p className="text-[16px] leading-relaxed text-white">{(locale === 'en' && details.description_en) ? details.description_en : (locale === 'de' && details.description_de) ? details.description_de : projectDescriptionLabel(details.id, details.description, locale)}</p>
          </div>

          <div className="grid gap-2">
            <div className="text-base font-semibold text-white">{t("impact")}</div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {impactTags.map((tag, i) => (
                <span key={i} className={`px-3 py-1 rounded-full border ${tag.color} inline-flex items-center gap-1 text-sm`}>
                  <span>{tag.emoji}</span>
                  <span>{impactTagLabel(tag.label, locale)}</span>
                </span>
              ))}
            </div>
          </div>

          {typeof details.spots === "number" && (
            <div className="text-sm text-white">{t("availableSpots")}: <span className="font-extrabold text-gray-50 bg-gray-900 px-2 rounded">{details.spots}</span></div>
          )}

          <div className="flex gap-3 justify-center sm:justify-start">
            <Link href={`/projects/${details.id}/voluntariado`} className="bg-green-700 text-white rounded px-4 py-2 font-medium">{t("beVolunteer")}</Link>
            <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="border rounded px-4 py-2 font-medium hover:bg-gray-50">{t("donatePaypal")}</a>
            <a href={stripeLink} target="_blank" rel="noopener noreferrer" className="border rounded px-4 py-2 font-medium hover:bg-gray-50">{t("donateStripe")}</a>
          </div>
        </div>
      </div>

      <div>
        <Link href="/" className="text-green-700 underline">{t("backToMap")}</Link>
      </div>
    </div>
  );
}


