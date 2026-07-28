import { notFound, redirect } from "next/navigation";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  if (!/^[a-zA-Z0-9_-]+$/.test(offerId)) notFound();

  redirect(`/module/business/offer/${offerId}/request`);
}
