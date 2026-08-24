import { DUMMY_PROJECT } from "@/features/offer/constants/offerArchivedProject.mock";
import { DUMMY_ARCHIVED_ITEMS } from "@/features/offer/constants/offerArchived.mock";

export function getArchivedProjectData(projectId: string) {
  const archivedItem = DUMMY_ARCHIVED_ITEMS.find((item) => item.id === projectId);

  const title = archivedItem?.jobName || DUMMY_PROJECT.title;
  const customerName = archivedItem?.customerName || DUMMY_PROJECT.customer.name;
  const municipality = archivedItem?.municipality || DUMMY_PROJECT.municipality;
  const contractNr = archivedItem?.contractNr || "";
  const budget = archivedItem?.agreedPrice || DUMMY_PROJECT.budget;

  return {
    ...DUMMY_PROJECT,
    id: projectId,
    title,
    municipality,
    budget,
    customer: {
      ...DUMMY_PROJECT.customer,
      name: customerName,
    },
    orderInfo: {
      ...DUMMY_PROJECT.orderInfo,
      contractNr,
    },
  };
}
