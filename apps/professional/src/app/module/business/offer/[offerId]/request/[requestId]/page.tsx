import { OfferSendPage } from "@/features/offer/components/OfferSendPage";
import { DUMMY_OFFER_SEND } from "@/features/offer/constants/offerSend";

export default async function OfferRequestDetailPage({
  params,
}: {
  params: Promise<{ offerId: string; requestId: string }>;
}) {
  const { requestId } = await params;

  const data = {
    ...DUMMY_OFFER_SEND,
    id: requestId,
  };

  return <OfferSendPage data={data} />;
}
