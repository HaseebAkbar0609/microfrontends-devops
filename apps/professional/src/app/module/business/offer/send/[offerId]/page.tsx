import { OfferSendClient } from "@/features/offer/components/OfferSendClient";

export default async function OfferSendRoute({
  params,
  searchParams,
}: {
  params: Promise<{ offerId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { offerId } = await params;
  const sParams = await searchParams;

  return <OfferSendClient offerId={offerId} type={sParams?.type} />;
}
