import { ModulePageHeader } from "@/components/layout/navigation";
import ProjectDashboard from "@/features/project/components/ProjectDashboard";
import {
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
	projectBreadcrumbs,
} from "@/features/project/data/projectNav.config";
import localizationConstants from "@/utils/translation/constants";

export default function ProjectDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				breadcrumbs={projectBreadcrumbs(
					localizationConstants.projectSubDashboard,
				)}
			/>
			<div className="p-5 flex-1">
				<ProjectDashboard />
			</div>
		</div>
	);
}
