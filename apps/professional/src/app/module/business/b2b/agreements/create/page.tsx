import { B2BCreateAgreementView } from "@/features/b2b/components/B2BCreateAgreementView";
import { getAgreementDetailByContext } from "@/features/b2b/constants/agreementMock";

interface Props {
  searchParams?: Promise<{ projectId?: string; offerId?: string }>;
}

export default async function B2BCreateAgreementPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialData = getAgreementDetailByContext(params?.projectId, params?.offerId);
  return <B2BCreateAgreementView data={initialData} />;
}
