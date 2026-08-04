import { B2BDealDetailView } from "@/features/b2b/components/B2BDealDetailView";
import { DUMMY_DEAL_DETAIL } from "@/features/b2b/constants/dealDetailMock";

export default function B2BDealDetailPage() {
  return <B2BDealDetailView data={DUMMY_DEAL_DETAIL} />;
}
