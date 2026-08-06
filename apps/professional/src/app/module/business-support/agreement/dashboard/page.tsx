import { PageHeader } from "@/components/layout/PageHeader";
import AgreementDashboard from "@/features/agreement/components/AgreementDashboard";
import { AGREEMENT_DASHBOARD_BREADCRUMBS } from "@/features/agreement/constants/agreementDashboard";
import localizationConstants from "@/utils/translation/constants";

export default function AgreementDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.agreementDashboardTitle}
				breadcrumbs={AGREEMENT_DASHBOARD_BREADCRUMBS}
			/>
			<div className="p-3 sm:p-5 flex-1">
				<AgreementDashboard />
			</div>
		</div>
	);
}
