import { PageHeader } from "@/components/layout/PageHeader";
import ProjectDashboard from "@/features/project/components/ProjectDashboard";
import { PROJECT_DASHBOARD_BREADCRUMBS } from "@/features/project/constants";
import localizationConstants from "@/utils/translation/constants";

export default function ProjectDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.projectDashboardTitle}
				breadcrumbs={PROJECT_DASHBOARD_BREADCRUMBS}
			/>
			<div className="p-5 flex-1">
				<ProjectDashboard />
			</div>
		</div>
	);
}
