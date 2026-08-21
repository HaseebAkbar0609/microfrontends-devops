import { OfferSeeProjectView } from "@/features/offer/components/OfferSeeProjectView";
import { getAgreedProjectData } from "@/features/offer/utils/agreedProject";

export default async function OfferAgreedProjectWithOfferIdPage({
  params,
}: {
  params: Promise<{ offerId: string; projectId: string }>;
}) {
  const { offerId, projectId } = await params;
  const projectData = getAgreedProjectData(projectId);

  return <OfferSeeProjectView offerId={offerId} data={projectData} />;
}
