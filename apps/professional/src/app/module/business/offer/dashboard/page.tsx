import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import OfferDashboard from "@/features/offer/components/OfferDashboard";

export default function OfferDashboardPage() {
    return (
        <div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
            <OfferModuleHeader activeTab="dashboard" />
            <div className="p-5 flex-1">
                <OfferDashboard />
            </div>
        </div>
    );
}
