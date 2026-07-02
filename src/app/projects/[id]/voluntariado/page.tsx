import VoluntariadoClient from "./VoluntariadoClient";

export const dynamic = 'force-dynamic';

export default function VoluntariadoPage({ params }: { params: Promise<{ id: string }> }) {
  return <VoluntariadoClient params={params} />;
}


