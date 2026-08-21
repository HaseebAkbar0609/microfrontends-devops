import { OfferSeeProjectView } from "@/features/offer/components/OfferSeeProjectView";
import { DUMMY_PROJECT } from "@/features/offer/constants/offerArchivedProject.mock";
import { DUMMY_AGREED_ITEMS } from "@/features/offer/constants/offerAgreed.mock";
import { DUMMY_QUOTED_ITEMS } from "@/features/offer/constants/offerQuoted.mock";

export default async function OfferAgreedProjectWithOfferIdPage({
  params,
}: {
  params: Promise<{ offerId: string; projectId: string }>;
}) {
  const { offerId, projectId } = await params;

  const agreedItem = DUMMY_AGREED_ITEMS.find((item) => item.id === projectId);
  const quotedItem = DUMMY_QUOTED_ITEMS.find((item) => item.id === projectId);

  const title = agreedItem?.jobName || quotedItem?.job || DUMMY_PROJECT.title;
  const customerName =
    agreedItem?.customerName ||
    quotedItem?.customerName ||
    DUMMY_PROJECT.customer.name;
  const municipality =
    agreedItem?.municipality ||
    quotedItem?.municipality ||
    DUMMY_PROJECT.municipality;
  const contractNr =
    agreedItem?.contractNr || quotedItem?.offertNr || "KNT001";
  const budget =
    agreedItem?.agreedPrice || quotedItem?.price || DUMMY_PROJECT.budget;

  const projectData = {
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

  return <OfferSeeProjectView offerId={offerId} data={projectData} />;
}
