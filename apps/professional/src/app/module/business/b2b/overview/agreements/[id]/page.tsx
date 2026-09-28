import { B2BContractDetailView } from "@/features/b2b/components/B2BContractDetailView";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function B2BOverviewAgreementDetailPage({ params }: Props) {
  const { id } = await params;

  // Fetched in the browser, where the access token lives -- never on the
  // server (see the same fix applied to Overview/Offer/Archive/Company).
  return <B2BContractDetailView agreementId={id} />;
}
