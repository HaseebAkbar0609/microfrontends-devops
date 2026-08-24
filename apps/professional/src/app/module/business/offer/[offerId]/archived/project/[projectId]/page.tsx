import { OfferSeeProjectView } from "@/features/offer/components/OfferSeeProjectView";
import { getArchivedProjectData } from "@/features/offer/utils/archivedProject";

export default async function OfferArchivedProjectWithOfferIdPage({
  params,
}: {
  params: Promise<{ offerId: string; projectId: string }>;
}) {
  const { offerId, projectId } = await params;
  const projectData = getArchivedProjectData(projectId);

  return <OfferSeeProjectView offerId={offerId} data={projectData} />;
}
