import { B2BSeeOfferView } from "@/features/b2b/components/B2BSeeOfferView";

interface Props {
  params: Promise<{
    offerId: string;
  }>;
}

export default async function B2BOverviewOfferDetailPage({ params }: Props) {
  const { offerId } = await params;

  // The detail endpoint is addressed by offer id alone; projectId is only used
  // for the back link, which this shorter route does not have.
  return <B2BSeeOfferView projectId={offerId} offerId={offerId} />;
}
