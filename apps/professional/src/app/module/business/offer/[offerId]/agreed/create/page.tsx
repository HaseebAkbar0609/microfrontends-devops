import { CreateAgreementView } from "@/features/offer/components/CreateAgreementView";
import { DUMMY_AGREEMENT_DATA } from "@/features/offer/constants/offerAgreement.mock";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import { AgreementData } from "@/features/offer/types";

export default async function CreateAgreementPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  let agreementData: AgreementData = DUMMY_AGREEMENT_DATA;

  try {
    const res = await getOfferDetailByIdAPIAction(offerId);
    if (res.success && res.data) {
      const offer = res.data;
      agreementData = {
        ...DUMMY_AGREEMENT_DATA,
        id: offer.id,
        projectName: offer.title || DUMMY_AGREEMENT_DATA.projectName,
        projectNumber: offer.id,
        quoteNumber: offerId,
        address: offer.customer.address || DUMMY_AGREEMENT_DATA.address,
        customerName: offer.customer.name || DUMMY_AGREEMENT_DATA.customerName,
        price: offer.preliminaryBudgetPrice
          ? Number(offer.preliminaryBudgetPrice.replace(/[^0-9.-]+/g, "")) || DUMMY_AGREEMENT_DATA.price
          : DUMMY_AGREEMENT_DATA.price,
        parties: [
          {
            id: "customer-1",
            name: offer.customer.name || DUMMY_AGREEMENT_DATA.parties[0].name,
            role: "customer",
            companyOrPerson: offer.customer.name || DUMMY_AGREEMENT_DATA.parties[0].companyOrPerson,
            contactPerson: offer.customer.name || DUMMY_AGREEMENT_DATA.parties[0].contactPerson,
            phone: offer.customer.phone || DUMMY_AGREEMENT_DATA.parties[0].phone,
            email: offer.customer.email || DUMMY_AGREEMENT_DATA.parties[0].email,
            address: offer.customer.address || DUMMY_AGREEMENT_DATA.parties[0].address,
            orgNumber: DUMMY_AGREEMENT_DATA.parties[0].orgNumber,
            personalNumber: DUMMY_AGREEMENT_DATA.parties[0].personalNumber,
          },
          DUMMY_AGREEMENT_DATA.parties[1],
        ],
      };
    }
  } catch {
    // Keep mock data as fallback
  }

  return <CreateAgreementView offerId={offerId} data={agreementData} />;
}
