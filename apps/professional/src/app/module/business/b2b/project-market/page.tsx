import { B2BProjectMarketView } from "@/features/b2b/components/B2BProjectMarketView";
import { getProjectMarketListAction } from "@/api-actions/b2b/projectMarket";
import { DUMMY_PROJECTS } from "@/features/b2b/constants/projectMarketMock";

export default async function B2BProjectMarketPage() {
  const result = await getProjectMarketListAction();
  const projects = result.success && result.data ? result.data : DUMMY_PROJECTS;

  return <B2BProjectMarketView projects={projects} />;
}
