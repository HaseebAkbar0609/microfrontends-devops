import { notFound } from "next/navigation";
import { z } from "zod";
import { OfferModuleHeader, OfferTabId } from "@/features/offer/components/OfferModuleHeader";
import { OfferRequestView } from "@/features/offer/components/OfferRequestView";
import { OfferQuotedView } from "@/features/offer/components/OfferQuotedView";
import { OfferAcceptedView } from "@/features/offer/components/OfferAcceptedView";
import { OfferAgreedView } from "@/features/offer/components/OfferAgreedView";
import { OfferArchivedView } from "@/features/offer/components/OfferArchivedView";
import { OFFER_STATUSES } from "@/features/offer/constants/offerDetail";
import { DUMMY_OFFER_REQUESTS } from "@/features/offer/constants/offerRequests.mock";
import { DUMMY_QUOTED_ITEMS } from "@/features/offer/constants/offerQuoted.mock";
import { DUMMY_ACCEPTED_ITEMS } from "@/features/offer/constants/offerAccepted.mock";
import { DUMMY_AGREED_ITEMS } from "@/features/offer/constants/offerAgreed.mock";
import { DUMMY_ARCHIVED_ITEMS } from "@/features/offer/constants/offerArchived.mock";

const statusSchema = z.enum(OFFER_STATUSES);

export default async function OfferStatusPage({
  params,
}: {
  params: Promise<{ offerId: string; status: string }>;
}) {
  const { offerId, status } = await params;

  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) notFound();

  const tabId: OfferTabId = parsed.data as OfferTabId;

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <OfferModuleHeader activeTab={tabId} offerId={offerId} />

      {parsed.data === "request" && (
        <OfferRequestView offerId={offerId} requests={DUMMY_OFFER_REQUESTS} />
      )}

      {parsed.data === "quoted" && (
        <OfferQuotedView offerId={offerId} items={DUMMY_QUOTED_ITEMS} />
      )}

      {parsed.data === "accepted" && (
        <OfferAcceptedView offerId={offerId} items={DUMMY_ACCEPTED_ITEMS} />
      )}

      {parsed.data === "agreed" && (
        <OfferAgreedView offerId={offerId} items={DUMMY_AGREED_ITEMS} />
      )}

      {parsed.data === "archived" && (
        <OfferArchivedView offerId={offerId} items={DUMMY_ARCHIVED_ITEMS} />
      )}
    </div>
  );
}
