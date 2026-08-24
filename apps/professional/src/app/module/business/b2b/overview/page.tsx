import { B2BProjectMarketView } from "@/features/b2b/components/B2BProjectMarketView";
import { DUMMY_PROJECTS } from "@/features/b2b/constants/projectMarketMock";

export default function B2BOverviewPage() {
  return <B2BProjectMarketView projects={DUMMY_PROJECTS} />;
}
