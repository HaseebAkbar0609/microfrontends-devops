import { OfferDetailPageHeader } from "@/features/offer/components/OfferDetailPageHeader";
import { OfferDetailHeader } from "@/features/offer/components/OfferDetailHeader";
import { OfferDetailBody } from "@/features/offer/components/OfferDetailBody";
import { getDummyOfferDetail } from "@/features/offer/constants/offerDetail";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  const offer = getDummyOfferDetail(offerId);

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <OfferDetailPageHeader title={offer.titleKey} />

      <div className="mr-auto w-full max-w-5xl px-6 pb-6 pt-4 space-y-0 ml-6">
        <OfferDetailHeader data={offer} />
        <OfferDetailBody data={offer} />
      </div>
    </div>
  );
}

