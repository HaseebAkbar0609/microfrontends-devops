import { B2BCreateAvtalView } from "@/features/b2b/components/B2BCreateAvtalView";
import { DUMMY_AVTAL_DETAIL } from "@/features/b2b/constants/avtalMock";

export default function B2BCreateAgreementPage() {
  return <B2BCreateAvtalView data={DUMMY_AVTAL_DETAIL} />;
}
