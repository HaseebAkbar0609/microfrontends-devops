import { B2BCompanyView } from "@/features/b2b/components/B2BCompanyView";

interface Props {
  params: Promise<{
    companyId: string;
  }>;
}

export default async function B2BCompanyPage({ params }: Props) {
  const { companyId } = await params;

  // Fetched in the browser, where the access token lives -- never on the
  // server (see the same fix applied to Overview/Offer/Archive detail pages).
  return <B2BCompanyView companyId={companyId} />;
}
