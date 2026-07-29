import { OfferFormPage } from "@/features/offer/components/OfferFormPage";
import { DUMMY_OFFER_FORMS } from "@/features/offer/constants/offerForm.mock";
import { OfferFormType } from "@/features/offer/types";

const VALID_TYPES: OfferFormType[] = ["rent", "express", "b2c"];

export default async function OfferSendRoute({
  params,
  searchParams,
}: {
  params: Promise<{ offerId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { offerId } = await params;
  const { type } = await searchParams;

  const formType: OfferFormType = VALID_TYPES.includes(type as OfferFormType)
    ? (type as OfferFormType)
    : "b2c";

  const data = { ...DUMMY_OFFER_FORMS[formType], offerId };

  return <OfferFormPage data={data} />;
}
