import { B2BArchiveRequestDetailView } from "@/features/b2b/components/B2BArchiveRequestDetailView";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function B2BArchiveRequestDetailPage({ params }: PageProps) {
  const { projectId } = await params;

  return <B2BArchiveRequestDetailView projectId={projectId} />;
}
