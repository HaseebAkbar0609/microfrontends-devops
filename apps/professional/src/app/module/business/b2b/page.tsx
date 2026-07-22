import { PageHeader } from "@/components/layout/PageHeader";
import B2BDashboard from "@/features/b2b/components/B2BDashboard";
import { B2B_DASHBOARD_BREADCRUMBS } from "@/features/b2b/constants";
import localizationConstants from "@/utils/translation/constants";

export default function B2BDashboardPage() {
    return (
        <div className="flex flex-1 flex-col bg-blue-gray-50">
            <PageHeader
                title={localizationConstants.b2bOverview}
                breadcrumbs={B2B_DASHBOARD_BREADCRUMBS}
            />
            <div className="p-5 flex-1">
                <B2BDashboard />
            </div>
        </div>
    );
}
