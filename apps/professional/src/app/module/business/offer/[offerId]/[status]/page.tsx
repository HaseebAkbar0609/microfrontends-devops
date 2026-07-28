import { notFound } from "next/navigation";
import { z } from "zod";
import { OfferRequestView } from "@/features/offer/components/OfferRequestView";
import { OFFER_STATUSES } from "@/features/offer/constants/offerDetail";
import { DUMMY_OFFER_REQUESTS } from "@/features/offer/constants/offerRequests.mock";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

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

  return (
    <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
      <Translate text={localizationConstants.comingSoon} />
    </div>
  );
}
