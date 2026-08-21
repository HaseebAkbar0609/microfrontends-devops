import { OfferSeeProjectView } from "@/features/offer/components/OfferSeeProjectView";
import { getArchivedProjectData } from "@/features/offer/utils/archivedProject";

export default async function OfferArchivedProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const projectData = getArchivedProjectData(projectId);

  return <OfferSeeProjectView offerId="" data={projectData} />;
}
