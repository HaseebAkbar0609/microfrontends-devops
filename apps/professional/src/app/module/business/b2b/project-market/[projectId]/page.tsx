import { B2BProjectMarketDetailView } from "@/features/b2b/components/B2BProjectMarketDetailView";
import { DUMMY_PROJECT_DETAIL } from "@/features/b2b/constants/projectMarketMock";

export default function B2BProjectMarketDetailPage() {
  return <B2BProjectMarketDetailView data={DUMMY_PROJECT_DETAIL} />;
}
