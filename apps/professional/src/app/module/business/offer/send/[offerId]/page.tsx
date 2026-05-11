import { OfferSendPage } from "@/features/offer/components/OfferSendPage";
import { DUMMY_OFFER_SEND } from "@/features/offer/constants/offerSend";

export default async function OfferSendRoute({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  // NOTE: offerId will be used when API integration is added
  void offerId;

  return <OfferSendPage data={DUMMY_OFFER_SEND} />;
}
