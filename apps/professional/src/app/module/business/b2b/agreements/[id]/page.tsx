import { B2BAvtalDetailView } from "@/features/b2b/components/B2BAvtalDetailView";
import { DUMMY_AVTAL_DETAIL } from "@/features/b2b/constants/avtalMock";

export default function B2BAgreementDetailPage() {
  return <B2BAvtalDetailView data={DUMMY_AVTAL_DETAIL} />;
}
