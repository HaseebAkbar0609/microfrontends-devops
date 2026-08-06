import { B2BAvtalListView } from "@/features/b2b/components/B2BAvtalListView";
import { DUMMY_AVTAL_LIST } from "@/features/b2b/constants/avtalMock";

export default function B2BAgreementsPage() {
  return <B2BAvtalListView items={DUMMY_AVTAL_LIST} />;
}
