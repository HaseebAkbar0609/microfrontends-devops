import { notFound } from "next/navigation";
import { OfferDetailPageHeader } from "@/features/offer/components/OfferDetailPageHeader";
import { OfferDetailHeader } from "@/features/offer/components/OfferDetailHeader";
import { OfferDetailBody } from "@/features/offer/components/OfferDetailBody";
import { getDummyOfferDetail } from "@/features/offer/constants/offerDetail";

const VALID_STATUSES = ["overview", "quoted", "accepted", "agreed", "archived"];

export default async function OfferStatusPage({
  params,
}: {
  params: Promise<{ offerId: string; status: string }>;
}) {
  const { offerId, status } = await params;

  if (!VALID_STATUSES.includes(status)) {
    notFound();
  }

  const offer = getDummyOfferDetail(offerId);
  const isOverview = status === "overview";

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <OfferDetailPageHeader title={offer.titleKey} />

      {isOverview ? (
        <div className="mr-auto w-full max-w-5xl px-6 pb-6 pt-4 space-y-0 ml-6">
          <OfferDetailHeader data={offer} />
          <OfferDetailBody data={offer} />
        </div>
      ) : (
        <div className="mr-auto w-full max-w-5xl px-6 pt-4 ml-6">
          <OfferDetailHeader data={offer} />
          <div className="mt-6 flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-sm text-slate-400">
            {status.charAt(0).toUpperCase() + status.slice(1)} view — coming soon
          </div>
        </div>
      )}
    </div>
  );
}
