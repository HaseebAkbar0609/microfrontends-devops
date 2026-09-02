import { B2BSeeOfferView } from "@/features/b2b/components/B2BSeeOfferView";
import { getB2BOfferDetailAction } from "@/api-actions/b2b/seeOffer";
import { DUMMY_SEE_OFFER_DETAIL } from "@/features/b2b/constants/seeOfferMock";

interface Props {
  params: Promise<{
    offerId: string;
  }>;
}

export default async function B2BOverviewOfferDetailPage({ params }: Props) {
  const { offerId } = await params;
  const result = await getB2BOfferDetailAction("1", offerId);
  const data = result.success && result.data ? result.data : DUMMY_SEE_OFFER_DETAIL;

  return <B2BSeeOfferView data={data} projectId="1" offerId={offerId} />;
}
