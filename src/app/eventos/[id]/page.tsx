import EventDetailClient from "@/components/EventDetailClient";

type EventDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  return <EventDetailClient eventId={id} />;
}
