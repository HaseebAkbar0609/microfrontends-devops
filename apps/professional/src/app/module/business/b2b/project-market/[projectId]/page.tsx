import { B2BProjectMarketDetailView } from "@/features/b2b/components/B2BProjectMarketDetailView";
import { getProjectMarketDetailAction } from "@/api-actions/b2b/projectMarket";
import { DUMMY_PROJECT_DETAIL } from "@/features/b2b/constants/projectMarketMock";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function B2BProjectMarketDetailPage({ params }: PageProps) {
  const { projectId } = await params;
  const result = await getProjectMarketDetailAction(projectId);
  const data = result.success && result.data ? result.data : DUMMY_PROJECT_DETAIL;

  return <B2BProjectMarketDetailView data={data} />;
}
