import { B2BProjectMarketDetailView } from "@/features/b2b/components/B2BProjectMarketDetailView";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function B2BOverviewProjectDetailPage({ params }: PageProps) {
  const { projectId } = await params;

  return <B2BProjectMarketDetailView projectId={projectId} />;
}
