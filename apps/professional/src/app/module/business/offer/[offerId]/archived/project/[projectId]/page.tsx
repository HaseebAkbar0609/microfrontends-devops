import { notFound } from "next/navigation";
import { OfferSeeProjectView } from "@/features/offer/components/OfferSeeProjectView";
import { DUMMY_PROJECT } from "@/features/offer/constants/offerArchivedProject.mock";

export default async function OfferArchivedProjectPage({
  params,
}: {
  params: Promise<{ offerId: string; projectId: string }>;
}) {
  const { offerId, projectId } = await params;

  const project = projectId === DUMMY_PROJECT.id ? DUMMY_PROJECT : null;
  if (!project) notFound();

  return <OfferSeeProjectView offerId={offerId} data={project} />;
}
