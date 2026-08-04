import { B2BDealListView } from "@/features/b2b/components/B2BDealListView";
import { DUMMY_DEALS } from "@/features/b2b/constants/dealMock";

export default function B2BDealsPage() {
  return <B2BDealListView deals={DUMMY_DEALS} />;
}
