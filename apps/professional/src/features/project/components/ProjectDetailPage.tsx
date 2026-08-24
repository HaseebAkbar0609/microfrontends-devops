"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import {
	PROJECT_MODULE_BASE_URL,
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "@/features/project/data/projectNav.config";
import ProjectGanttTable from "./ProjectGanttTable";

interface ProjectDetailPageProps {
	readonly projectId: string;
}

/**
 * Pattern 2 — a record reached by drilling into the project list. The primary
 * tab row stays; the breadcrumb is replaced by a back arrow plus the record title.
 */
const ProjectDetailPage = ({ projectId }: ProjectDetailPageProps) => (
	<div className="flex flex-1 flex-col bg-blue-gray-50">
		<ModulePageHeader
			title={PROJECT_MODULE_TITLE}
			tabs={PROJECT_MODULE_TABS}
			record={{
				// TODO: swap for the project's real name once the detail API lands.
				title: projectId,
				backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
			}}
		/>
		<div className="flex-1 p-6">
			<div className="rounded-md border border-slate-200 bg-white">
				<ProjectGanttTable />
			</div>
		</div>
	</div>
);

export default ProjectDetailPage;
