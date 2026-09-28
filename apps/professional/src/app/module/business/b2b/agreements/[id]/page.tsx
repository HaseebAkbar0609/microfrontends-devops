import { B2BAgreementDetailView } from "@/features/b2b/components/B2BAgreementDetailView";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function B2BAgreementDetailPage({ params }: Props) {
  const { id } = await params;

  // Fetched in the browser, where the access token lives -- never on the
  // server (see the same fix applied to Overview/Offer/Archive/Company).
  return <B2BAgreementDetailView agreementId={id} />;
}
