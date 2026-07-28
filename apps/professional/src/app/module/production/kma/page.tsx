import { PageHeader } from "@/components/layout/PageHeader";
import KmaDashboard from "@/features/kma/components/KmaDashboard";
import { KMA_DASHBOARD_BREADCRUMBS } from "@/features/kma/constants";
import localizationConstants from "@/utils/translation/constants";

export default function KmaDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.kmaDashboardTitle}
				breadcrumbs={KMA_DASHBOARD_BREADCRUMBS}
			/>
			<div className="p-5 flex-1">
				<KmaDashboard />
			</div>
		</div>
	);
}
