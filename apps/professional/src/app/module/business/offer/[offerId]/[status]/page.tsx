import { notFound } from "next/navigation";
import { z } from "zod";
import { OfferDetailPageHeader } from "@/features/offer/components/OfferDetailPageHeader";
import { OfferDetailHeader } from "@/features/offer/components/OfferDetailHeader";
import { OfferDetailBody } from "@/features/offer/components/OfferDetailBody";
import { getDummyOfferDetail, OFFER_STATUSES } from "@/features/offer/constants/offerDetail";

const statusSchema = z.enum(OFFER_STATUSES);

export default async function OfferStatusPage({
  params,
}: {
  params: Promise<{ offerId: string; status: string }>;
}) {
  const { offerId, status } = await params;

  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) notFound();

  const offer = getDummyOfferDetail(offerId);
  const isOverview = parsed.data === "overview";

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
            {parsed.data.charAt(0).toUpperCase() + parsed.data.slice(1)} view — coming soon
          </div>
        </div>
      )}
    </div>
  );
}
