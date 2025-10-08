import EventDetailClient from "@/components/EventDetailClient";

type EventDetailPageProps = {
  params: {
    id: string;
  };
};

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return <EventDetailClient eventId={params.id} />;
}
