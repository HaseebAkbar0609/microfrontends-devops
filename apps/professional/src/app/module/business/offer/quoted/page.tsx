import { OfferQuotedView } from "@/features/offer/components/OfferQuotedView";
import { DUMMY_QUOTED_ITEMS } from "@/features/offer/constants/offerQuoted.mock";

export default function OfferQuotedPage() {
  return <OfferQuotedView offerId="" items={DUMMY_QUOTED_ITEMS} />;
}
