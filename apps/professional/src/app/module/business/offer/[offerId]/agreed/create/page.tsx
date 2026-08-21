import { CreateAgreementView } from "@/features/offer/components/CreateAgreementView";
import { DUMMY_AGREEMENT_DATA } from "@/features/offer/constants/offerAgreement.mock";
import { DUMMY_AGREED_ITEMS } from "@/features/offer/constants/offerAgreed.mock";

export default async function CreateAgreementPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  const item =
    DUMMY_AGREED_ITEMS.find(
      (i) => i.id === offerId || i.contractNr === offerId,
    ) || DUMMY_AGREED_ITEMS[0];

  const agreementData = {
    ...DUMMY_AGREEMENT_DATA,
    id: offerId,
    projectName: item?.jobName || DUMMY_AGREEMENT_DATA.projectName,
    customerName: item?.customerName || DUMMY_AGREEMENT_DATA.customerName,
    quoteNumber: item?.contractNr || DUMMY_AGREEMENT_DATA.quoteNumber,
  };

  return <CreateAgreementView offerId={offerId} data={agreementData} />;
}
