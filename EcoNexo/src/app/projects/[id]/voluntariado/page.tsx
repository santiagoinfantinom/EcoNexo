import VoluntariadoClient from "./VoluntariadoClient";

// Required for static export
export async function generateStaticParams() {
  // Generate static params for common project IDs
  return [
    { id: 'p1' },
    { id: 'p2' },
    { id: 'p3' },
    { id: 'p4' },
    { id: 'p5' },
    { id: 'p6' },
  ];
}

export default function VoluntariadoPage({ params }: { params: Promise<{ id: string }> }) {
  return <VoluntariadoClient params={params} />;
}


