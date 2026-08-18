import { OfferAvailableProjectOpenedView } from "@/features/offer";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";

export default async function OfferAvailableProjectOpenedPage({
	params,
}: {
	params: Promise<{ offerId: string }>;
}) {
	const { offerId } = await params;
	const initialDataRes = await getOfferDetailByIdAPIAction(offerId);

	return (
		<OfferAvailableProjectOpenedView
			offerId={offerId}
			initialData={
				initialDataRes.success && initialDataRes.data
					? initialDataRes.data
					: undefined
			}
		/>
	);
}
