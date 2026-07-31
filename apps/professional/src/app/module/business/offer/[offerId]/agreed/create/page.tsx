import { CreateAgreementView } from "@/features/offer/components/CreateAgreementView";
import { DUMMY_AGREEMENT_DATA } from "@/features/offer/constants/offerAgreement.mock";

export default async function CreateAgreementPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  return <CreateAgreementView offerId={offerId} data={DUMMY_AGREEMENT_DATA} />;
}
