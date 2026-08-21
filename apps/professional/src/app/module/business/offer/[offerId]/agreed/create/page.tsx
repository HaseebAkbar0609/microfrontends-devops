import { CreateAgreementView } from "@/features/offer/components/CreateAgreementView";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import { AgreementData } from "@/features/offer/types";
import { DUMMY_AGREEMENT_DATA } from "@/features/offer/constants/offerAgreement.mock";

export default async function CreateAgreementPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;

  let agreementData: AgreementData = {
    ...DUMMY_AGREEMENT_DATA,
    id: offerId,
    projectNumber: offerId,
    quoteNumber: offerId,
    projectName: "",
    customerName: "",
    address: "",
    price: 0,
    parties: [
      {
        id: "customer-1",
        name: "",
        role: "customer",
        companyOrPerson: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
      },
      {
        id: "contractor-1",
        name: "",
        role: "supplier",
        companyOrPerson: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
      },
    ],
  };

  try {
    const res = await getOfferDetailByIdAPIAction(offerId);
    if (res.success && res.data) {
      const offer = res.data;
      agreementData = {
        ...agreementData,
        id: offer.id,
        projectName: offer.title || "",
        projectNumber: offer.id,
        quoteNumber: offerId,
        address: offer.customer.address || "",
        customerName: offer.customer.name || "",
        price: offer.preliminaryBudgetPrice
          ? Number(offer.preliminaryBudgetPrice.replace(/[^0-9.-]+/g, "")) || 0
          : 0,
        parties: [
          {
            id: "customer-1",
            name: offer.customer.name || "",
            role: "customer",
            companyOrPerson: offer.customer.name || "",
            contactPerson: offer.customer.name || "",
            phone: offer.customer.phone || "",
            email: offer.customer.email || "",
            address: offer.customer.address || "",
          },
          agreementData.parties[1],
        ],
      };
    }
  } catch {
    // Keep initial agreement structure
  }

  return <CreateAgreementView offerId={offerId} data={agreementData} />;
}
