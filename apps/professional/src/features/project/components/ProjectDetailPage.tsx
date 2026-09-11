"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import {
	PROJECT_MODULE_BASE_URL,
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "@/features/project/data/projectNav.config";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../data/projectsOverview.mock";
import { ProjectRecordTitle } from "../production/components/ProjectRecordTitle";
import { projectProductionTabs } from "../production/projectProductionNav.config";
import ProjectGanttTable from "./ProjectGanttTable";

interface ProjectDetailPageProps {
	readonly projectId: string;
}

/**
 * Tidsplan — a project record's schedule.
 *
 * Pattern 3: the record row carries the section tabs, so this reads the same
 * way as Projektinformation beside it.
 */
const ProjectDetailPage = ({ projectId }: ProjectDetailPageProps) => {
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={project?.projectNr ?? projectId}
							sectionKey={localizationConstants.projectSectionTidsplan}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex-1 p-6">
				<div className="rounded-md border border-slate-200 bg-white">
					<ProjectGanttTable />
				</div>
			</div>
		</div>
	);
};

export default ProjectDetailPage;
