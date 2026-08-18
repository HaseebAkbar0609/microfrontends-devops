import { OfferAvailableProjectOpenedView } from "@/features/offer";

export default async function OfferAvailablePage({
	params,
}: {
	params: Promise<{ offerId: string }>;
}) {
	const { offerId } = await params;

	return <OfferAvailableProjectOpenedView offerId={offerId} />;
}
