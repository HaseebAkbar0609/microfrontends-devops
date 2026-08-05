import { B2BArchiveOfferDetailView } from "@/features/b2b/components/B2BArchiveOfferDetailView";
import { DUMMY_ARCHIVE_OFFER_DETAIL } from "@/features/b2b/constants/archiveMock";

export default function B2BProjectMarketOfferDetailPage() {
  return <B2BArchiveOfferDetailView data={DUMMY_ARCHIVE_OFFER_DETAIL} />;
}
