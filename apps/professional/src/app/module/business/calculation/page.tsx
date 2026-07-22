import { PageHeader } from "@/components/layout/PageHeader";
import CalculationDashboard from "@/features/calculation/components/CalculationDashboard";
import { CALCULATION_DASHBOARD_BREADCRUMBS } from "@/features/calculation/constants";
import localizationConstants from "@/utils/translation/constants";

export default function CalculationDashboardPage() {
    return (
        <div className="flex flex-1 flex-col bg-blue-gray-50">
            <PageHeader
                title={localizationConstants.calcOverview}
                breadcrumbs={CALCULATION_DASHBOARD_BREADCRUMBS}
            />
            <div className="p-5 flex-1">
                <CalculationDashboard />
            </div>
        </div>
    );
}
