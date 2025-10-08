import EventDetailClient from "@/components/EventDetailClient";

type EventDetailPageProps = {
  // In Next.js 15, dynamic route params are provided as a Promise
  params: Promise<{ id: string }> | { id: string };
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolved = params instanceof Promise ? await params : params;
  return <EventDetailClient eventId={resolved.id} />;
}
