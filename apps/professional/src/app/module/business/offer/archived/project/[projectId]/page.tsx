import { OfferProjectDetailClient } from "@/features/offer/components/OfferProjectDetailClient";

export default async function OfferArchivedProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <OfferProjectDetailClient projectId={projectId} />;
}
