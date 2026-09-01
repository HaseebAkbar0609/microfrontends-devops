import { B2BSeeOfferView } from "@/features/b2b/components/B2BSeeOfferView";
import { getB2BOfferDetailAction } from "@/api-actions/b2b/seeOffer";
import { DUMMY_SEE_OFFER_DETAIL } from "@/features/b2b/constants/seeOfferMock";

interface Props {
  params: Promise<{
    projectId: string;
    offerId: string;
  }>;
}

export default async function B2BOverviewProjectOfferDetailPage({ params }: Props) {
  const { projectId, offerId } = await params;
  const result = await getB2BOfferDetailAction(projectId, offerId);
  const data = result.success && result.data ? result.data : DUMMY_SEE_OFFER_DETAIL;

  return <B2BSeeOfferView data={data} projectId={projectId} offerId={offerId} />;
}
