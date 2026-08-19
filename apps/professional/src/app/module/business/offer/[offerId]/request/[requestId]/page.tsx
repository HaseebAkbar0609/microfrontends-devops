import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { OfferSendPage } from "@/features/offer/components/OfferSendPage";
import { DUMMY_OFFER_SEND } from "@/features/offer/constants/offerSend";
import { DUMMY_OFFER_REQUESTS } from "@/features/offer/constants/offerRequests.mock";

export default async function OfferRequestDetailPage({
  params,
}: {
  params: Promise<{ offerId: string; requestId: string }>;
}) {
  const { requestId } = await params;
  const matchedRequest = DUMMY_OFFER_REQUESTS.find((r) => r.id === requestId);

  const data = {
    ...DUMMY_OFFER_SEND,
    id: requestId,
    type: matchedRequest?.type || DUMMY_OFFER_SEND.type,
    title: matchedRequest?.job || DUMMY_OFFER_SEND.title,
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <OfferModuleHeader activeTab="request" />
      <OfferSendPage data={data} />
    </div>
  );
}
