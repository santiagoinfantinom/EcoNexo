import EventDetailClient from "@/components/EventDetailClient";
import type { Metadata } from "next";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://econexo.app";

type EventDetailPageProps = {
  // In Next.js 15, dynamic route params are provided as a Promise
  params: Promise<{ id: string }> | { id: string };
};

// Allow dynamic routes that aren't pre-generated
export const dynamicParams = true;

// Required for static export
export async function generateStaticParams() {
  // Generate static params for all possible event IDs
  // Include common event IDs from CalendarView mock events
  const eventIds = [];

  // Generate e1 to e36 (covers most mock events)
  for (let i = 1; i <= 36; i++) {
    eventIds.push({ id: `e${i}` });
  }

  // Add variant IDs like e1b, e1c, etc.
  const variants = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
  for (let i = 1; i <= 30; i++) {
    variants.forEach(v => {
      eventIds.push({ id: `e${i}${v}` });
    });
  }

  return eventIds;
}

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
