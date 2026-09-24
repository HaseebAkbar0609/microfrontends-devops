import { B2BArchiveOfferDetailView } from "@/features/b2b/components/B2BArchiveOfferDetailView";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function B2BArchiveOfferDetailPage({ params }: PageProps) {
  const { projectId } = await params;

  return <B2BArchiveOfferDetailView projectId={projectId} />;
}
