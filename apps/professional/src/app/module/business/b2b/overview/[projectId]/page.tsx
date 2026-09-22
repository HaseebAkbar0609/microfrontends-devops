import Link from "next/link";
import { B2BProjectMarketDetailView } from "@/features/b2b/components/B2BProjectMarketDetailView";
import { getProjectMarketDetailAction } from "@/api-actions/b2b/projectMarket";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function B2BOverviewProjectDetailPage({ params }: PageProps) {
  const { projectId } = await params;
  const result = await getProjectMarketDetailAction(projectId);

  if (!result.success || !result.data) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-white px-4 text-center">
        <p className="text-sm text-slate-500">
          {result.error || "This project could not be found."}
        </p>
        <Link
          href="/module/business/b2b/overview"
          className="text-sm font-medium text-slate-900 underline underline-offset-2"
        >
          Back to overview
        </Link>
      </div>
    );
  }

  return <B2BProjectMarketDetailView data={result.data} />;
}
