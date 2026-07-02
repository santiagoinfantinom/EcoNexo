import EventDetailClient from "@/components/EventDetailClient";
import type { Metadata } from "next";
import Script from "next/script";

import { getSiteUrl } from "@/lib/site";

const SITE_URL = getSiteUrl();

type EventDetailPageProps = {
  // In Next.js 15, dynamic route params are provided as a Promise
  params: Promise<{ id: string }> | { id: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const title = `Evento ${id} | EcoNexo`;
  const description = "Evento de la comunidad en EcoNexo.";
  const image = `${SITE_URL}/leaflet/marker-icon.png`;
  const url = `${SITE_URL}/eventos/${id}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
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

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolved = params instanceof Promise ? await params : params;
  const eventUrl = `${SITE_URL}/eventos/${resolved.id}`;
  return (
    <>
      <Script id="jsonld-event" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: `Evento ${resolved.id}`,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          url: eventUrl,
        })}
      </Script>
      <EventDetailClient eventId={resolved.id} />
    </>
  );
}
