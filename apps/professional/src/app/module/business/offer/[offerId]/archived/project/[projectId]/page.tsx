import { OfferSeeProjectView } from "@/features/offer/components/OfferSeeProjectView";
import { DUMMY_PROJECT } from "@/features/offer/constants/offerArchivedProject.mock";
import { DUMMY_ARCHIVED_ITEMS } from "@/features/offer/constants/offerArchived.mock";

export default async function OfferArchivedProjectWithOfferIdPage({
  params,
}: {
  params: Promise<{ offerId: string; projectId: string }>;
}) {
  const { offerId, projectId } = await params;

  const archivedItem =
    DUMMY_ARCHIVED_ITEMS.find((item) => item.id === projectId) ||
    DUMMY_ARCHIVED_ITEMS[0];

  const projectData = {
    ...DUMMY_PROJECT,
    id: projectId,
    title: archivedItem?.jobName || DUMMY_PROJECT.title,
    municipality: archivedItem?.municipality || DUMMY_PROJECT.municipality,
    budget: archivedItem?.agreedPrice || DUMMY_PROJECT.budget,
    customer: {
      ...DUMMY_PROJECT.customer,
      name: archivedItem?.customerName || DUMMY_PROJECT.customer.name,
    },
    orderInfo: {
      ...DUMMY_PROJECT.orderInfo,
      contractNr: archivedItem?.contractNr || "OFN001",
    },
  };

  return <OfferSeeProjectView offerId={offerId} data={projectData} />;
}
