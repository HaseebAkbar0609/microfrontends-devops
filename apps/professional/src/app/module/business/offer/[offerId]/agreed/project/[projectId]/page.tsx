import { OfferProjectDetailClient } from "@/features/offer/components/OfferProjectDetailClient";

export default async function OfferAgreedProjectWithOfferIdPage({
  params,
}: {
  params: Promise<{ offerId: string; projectId: string }>;
}) {
  const { offerId, projectId } = await params;
  return <OfferProjectDetailClient offerId={offerId} projectId={projectId} />;
}
