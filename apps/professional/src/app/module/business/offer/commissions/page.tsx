import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { CommissionList } from "@/features/offer/components/CommissionList";

export default function Page() {
  return <><OfferModuleHeader activeTab="commissions" /><CommissionList /></>;
}
