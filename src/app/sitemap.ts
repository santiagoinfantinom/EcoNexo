import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://econexo.org";

function toUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static routes we want indexed
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/calendario",
    "/categorias/medio-ambiente",
    "/categorias/educacion",
    "/categorias/salud",
    "/categorias/comunidad",
    "/categorias/oceanos",
    "/categorias/alimentacion",
    "/chat",
    "/chats",
    "/eventos",
    "/projects",
    "/perfil",
    "/trabajos",
  ].map((path) => ({
    url: toUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic project pages
  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: toUrl(`/projects/${p.id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic event pages: any project that has a startsAt is treated as an event detail
  const eventRoutes: MetadataRoute.Sitemap = PROJECTS.filter((p) => !!p.startsAt).map(
    (p) => ({
      url: toUrl(`/eventos/${p.id}`),
      lastModified: p.startsAt ? new Date(p.startsAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...projectRoutes, ...eventRoutes];
}


