import { redirect } from "next/navigation";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  redirect(`/module/business/offer/${offerId}/request`);
}
