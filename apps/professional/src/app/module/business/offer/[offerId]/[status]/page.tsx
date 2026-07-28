import { notFound } from "next/navigation";
import { z } from "zod";
import { OfferDetailPageHeader } from "@/features/offer/components/OfferDetailPageHeader";
import { OfferDetailHeader } from "@/features/offer/components/OfferDetailHeader";
import { OfferRequestView } from "@/features/offer/components/OfferRequestView";
import { getDummyOfferDetail, OFFER_STATUSES } from "@/features/offer/constants/offerDetail";
import { DUMMY_OFFER_REQUESTS } from "@/features/offer/constants/offerRequests.mock";

const statusSchema = z.enum(OFFER_STATUSES);

export default async function OfferStatusPage({
  params,
}: {
  params: Promise<{ offerId: string; status: string }>;
}) {
  const { offerId, status } = await params;

  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) notFound();

  if (parsed.data === "request") {
    return <OfferRequestView offerId={offerId} requests={DUMMY_OFFER_REQUESTS} />;
  }

  const offer = getDummyOfferDetail(offerId);

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <OfferDetailPageHeader title={offer.titleKey} />
      <div className="mr-auto w-full max-w-5xl px-6 pt-4 ml-6">
        <OfferDetailHeader data={offer} />
        <div className="mt-6 flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-sm text-slate-400">
          {parsed.data.charAt(0).toUpperCase() + parsed.data.slice(1)} view — coming soon
        </div>
      </div>
    </div>
  );
}
