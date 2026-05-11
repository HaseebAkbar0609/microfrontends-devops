import { PageHeader } from "@/components/layout/PageHeader";
import OfferDashboard from "@/features/offer/components/OfferDashboard";
import { OFFER_DASHBOARD_BREADCRUMBS } from "@/features/offer/constants/offerDashboard";
import localizationConstants from "@/utils/translation/constants";

export default function OfferDashboardPage() {
    return (
        <div className="flex flex-1 flex-col bg-blue-gray-50">
            <PageHeader
                title={localizationConstants.offerDashboard}
                breadcrumbs={OFFER_DASHBOARD_BREADCRUMBS}
            />
            <div className="p-5 flex-1">
                <OfferDashboard />
            </div>
        </div>
    );
}
