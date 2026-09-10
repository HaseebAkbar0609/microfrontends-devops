import { OfferProjectDetailClient } from "@/features/offer/components/OfferProjectDetailClient";

export default async function OfferAgreedProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <OfferProjectDetailClient projectId={projectId} />;
}
