"use client";
import { Marker, Popup } from "react-leaflet";
import Link from "next/link";
import { useI18n, categoryLabel, projectNameLabel } from "@/lib/i18n";

type Project = {
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
};

type MarkerClusterProps = {
  projects: Project[];
};

export default function MarkerCluster({ projects }: MarkerClusterProps) {
  const { t, locale } = useI18n();

  return (
    <>
      {projects.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup>
            <div className="grid gap-1">
              <div className="font-medium">{(locale === 'en' && (p as any).name_en) ? (p as any).name_en : (locale === 'de' && (p as any).name_de) ? (p as any).name_de : projectNameLabel(p.id, p.name, locale as any)}</div>
              <div className="text-xs text-gray-600">{p.city}, {p.country}</div>
              <div className="text-xs">{t("category")}: {categoryLabel(p.category as any, locale as any)}</div>
              {p.spots !== undefined && (
                <div className="text-xs">{t("availableSpots")}: {p.spots}</div>
              )}
              <Link
                href={`/projects/${p.id}`}
                className="text-green-700 underline text-sm mt-1"
              >
                {t("viewDetails")}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
