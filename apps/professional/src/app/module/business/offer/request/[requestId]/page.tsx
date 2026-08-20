import { OfferRequestDetailClient } from "@/features/offer/components/OfferRequestDetailClient";

export default async function OfferRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  return <OfferRequestDetailClient requestId={requestId} />;
}
