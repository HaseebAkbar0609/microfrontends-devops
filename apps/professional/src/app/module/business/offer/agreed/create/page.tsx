import { CreateAgreementView } from "@/features/offer/components/CreateAgreementView";
import { DUMMY_AGREEMENT_DATA } from "@/features/offer/constants/offerAgreement.mock";

export default function CreateAgreementDirectPage() {
  return <CreateAgreementView offerId="default" data={DUMMY_AGREEMENT_DATA} />;
}
