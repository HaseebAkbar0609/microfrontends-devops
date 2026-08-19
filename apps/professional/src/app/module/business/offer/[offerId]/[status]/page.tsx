import { notFound } from "next/navigation";
import { z } from "zod";
import { OfferRequestView } from "@/features/offer/components/OfferRequestView";
import { OfferQuotedView } from "@/features/offer/components/OfferQuotedView";
import { OfferAcceptedView } from "@/features/offer/components/OfferAcceptedView";
import { OfferAgreedView } from "@/features/offer/components/OfferAgreedView";
import { OfferArchivedView } from "@/features/offer/components/OfferArchivedView";
import { OFFER_STATUSES } from "@/features/offer/constants/offerDetail";
import { DUMMY_OFFER_REQUESTS } from "@/features/offer/constants/offerRequests.mock";
import { DUMMY_QUOTED_ITEMS } from "@/features/offer/constants/offerQuoted.mock";
import { DUMMY_AGREED_ITEMS } from "@/features/offer/constants/offerAgreed.mock";
import { DUMMY_ARCHIVED_ITEMS } from "@/features/offer/constants/offerArchived.mock";
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

  if (parsed.data === "quoted") {
    return <OfferQuotedView offerId={offerId} items={DUMMY_QUOTED_ITEMS} />;
  }

  if (parsed.data === "accepted") {
    return <OfferAcceptedView />;
  }

  if (parsed.data === "agreed") {
    return <OfferAgreedView offerId={offerId} items={DUMMY_AGREED_ITEMS} />;
  }

  if (parsed.data === "archived") {
    return <OfferArchivedView offerId={offerId} items={DUMMY_ARCHIVED_ITEMS} />;
  }

  return (
    <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
      <Translate text={localizationConstants.comingSoon} />
    </div>
  );
}
