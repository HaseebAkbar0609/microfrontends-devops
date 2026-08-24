import { OfferSeeProjectView } from "@/features/offer/components/OfferSeeProjectView";
import { getAgreedProjectData } from "@/features/offer/utils/agreedProject";

export default async function OfferAgreedProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const projectData = getAgreedProjectData(projectId);

  return <OfferSeeProjectView offerId="" data={projectData} />;
}
