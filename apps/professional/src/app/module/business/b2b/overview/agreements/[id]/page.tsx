import { B2BAgreementDetailView } from "@/features/b2b/components/B2BAgreementDetailView";
import { getB2BAgreementDetailAction } from "@/api-actions/b2b/agreements";
import { getAgreementDetailByContext } from "@/features/b2b/constants/agreementMock";

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    projectId?: string;
    offerId?: string;
  }>;
}

export default async function B2BOverviewAgreementDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;
  const result = await getB2BAgreementDetailAction(id);
  const data =
    result.success && result.data
      ? result.data
      : getAgreementDetailByContext(sParams?.projectId || id, sParams?.offerId);

  return <B2BAgreementDetailView data={data} />;
}
