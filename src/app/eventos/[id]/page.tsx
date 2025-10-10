import EventDetailClient from "@/components/EventDetailClient";

type EventDetailPageProps = {
  // In Next.js 15, dynamic route params are provided as a Promise
  params: Promise<{ id: string }> | { id: string };
};

// Required for static export
export async function generateStaticParams() {
  // Generate static params for all possible event IDs
  const eventIds = [];
  for (let i = 1; i <= 20; i++) {
    eventIds.push({ id: `e${i}` });
  }
  return eventIds;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolved = params instanceof Promise ? await params : params;
  return <EventDetailClient eventId={resolved.id} />;
}
