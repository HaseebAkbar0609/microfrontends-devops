import { notFound } from "next/navigation";
import { z } from "zod";
import { OfferTabId } from "@/features/offer/components/OfferModuleHeader";
import { OfferStatusPageContent } from "@/features/offer/components/OfferStatusPageContent";
import { OFFER_STATUSES } from "@/features/offer/constants/offerDetail";

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

  return <OfferStatusPageContent tabId={tabId} offerId={offerId} />;
}
