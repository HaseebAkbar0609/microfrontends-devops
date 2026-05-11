import { OfferDetailPageHeader } from "@/features/offer/components/OfferDetailPageHeader";
import { OfferDetailHeader } from "@/features/offer/components/OfferDetailHeader";
import { OfferDetailBody } from "@/features/offer/components/OfferDetailBody";
import { DUMMY_OFFER_DETAIL } from "@/features/offer/constants/offerDetail";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  // NOTE: offerId will be used when API integration is added
  void offerId;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <OfferDetailPageHeader title={DUMMY_OFFER_DETAIL.titleKey} />

      <div className="mr-auto w-full max-w-5xl px-6 pb-6 pt-4 space-y-0 ml-6">
        <OfferDetailHeader data={DUMMY_OFFER_DETAIL} />
        <OfferDetailBody data={DUMMY_OFFER_DETAIL} />
      </div>
    </div>
  );
}

