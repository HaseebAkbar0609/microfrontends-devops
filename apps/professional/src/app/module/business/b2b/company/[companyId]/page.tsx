import { B2BCompanyView } from "@/features/b2b/components/B2BCompanyView";
import { getB2BCompanyDetailAction } from "@/api-actions/b2b/company";
import { DUMMY_COMPANY_DETAIL } from "@/features/b2b/constants/companyMock";

interface Props {
  params: Promise<{
    companyId: string;
  }>;
}

export default async function B2BCompanyPage({ params }: Props) {
  const { companyId } = await params;
  const result = await getB2BCompanyDetailAction(companyId);
  const data = result.success && result.data ? result.data : DUMMY_COMPANY_DETAIL;

  return <B2BCompanyView data={data} companyId={companyId} />;
}
