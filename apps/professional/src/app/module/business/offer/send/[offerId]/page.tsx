import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { OfferFormPage } from "@/features/offer/components/OfferFormPage";
import { DUMMY_OFFER_FORMS } from "@/features/offer/constants/offerForm.mock";
import { OfferFormType } from "@/features/offer/types";

export default async function OfferSendRoute({
  params,
  searchParams,
}: {
  params: Promise<{ offerId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { offerId } = await params;
  const sParams = await searchParams;
  const rawType = (sParams?.type || "").toLowerCase().trim();

  let formType: OfferFormType = "b2c";
  if (rawType.includes("rent") || rawType.includes("hyra")) {
    formType = "rent";
  } else if (rawType.includes("express")) {
    formType = "express";
  } else {
    formType = "b2c";
  }

  const baseData = DUMMY_OFFER_FORMS[formType] || DUMMY_OFFER_FORMS.b2c;
  const data = {
    ...baseData,
    type: formType,
    offerId,
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <OfferModuleHeader activeTab="request" offerId={offerId} />
      <OfferFormPage data={data} />
    </div>
  );
}
