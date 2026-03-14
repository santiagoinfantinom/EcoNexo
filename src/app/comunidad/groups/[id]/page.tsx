import GroupDetailClient from "@/components/GroupDetailClient";

export function generateStaticParams() {
  // For static export, return an empty array or some mock IDs
  return [{ id: "berlin-sostenible" }];
}

export default async function GrupoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupDetailClient groupId={id} />;
}
