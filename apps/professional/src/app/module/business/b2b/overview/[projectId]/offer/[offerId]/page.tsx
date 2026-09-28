import { B2BSeeOfferView } from "@/features/b2b/components/B2BSeeOfferView";

interface Props {
  params: Promise<{
    projectId: string;
    offerId: string;
  }>;
}

export default async function B2BOverviewProjectOfferDetailPage({ params }: Props) {
  const { projectId, offerId } = await params;

  return <B2BSeeOfferView projectId={projectId} offerId={offerId} />;
}
