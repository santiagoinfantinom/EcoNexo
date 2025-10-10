import EventDetailClient from "@/components/EventDetailClient";

type EventDetailPageProps = {
  // In Next.js 15, dynamic route params are provided as a Promise
  params: Promise<{ id: string }> | { id: string };
};

// Required for static export
export async function generateStaticParams() {
  // Generate static params for common event IDs
  return [
    { id: 'e1' },
    { id: 'e2' },
    { id: 'e3' },
    { id: 'e4' },
    { id: 'e5' },
    { id: 'e6' },
    { id: 'e7' },
    { id: 'e8' },
    { id: 'e9' },
    { id: 'e10' },
  ];
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolved = params instanceof Promise ? await params : params;
  return <EventDetailClient eventId={resolved.id} />;
}
