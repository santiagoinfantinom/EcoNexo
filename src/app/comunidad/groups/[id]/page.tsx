import GroupDetailClient from "@/components/GroupDetailClient";

export const dynamic = 'force-dynamic';

export default async function GrupoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupDetailClient groupId={id} />;
}
