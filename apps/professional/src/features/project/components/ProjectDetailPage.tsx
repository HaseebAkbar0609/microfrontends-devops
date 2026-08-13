"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROJECT_OVERVIEW_BREADCRUMBS } from "../constants";
import ProjectGanttTable from "./ProjectGanttTable";

const ProjectDetailPage = () => (
	<div className="flex flex-1 flex-col bg-blue-gray-50">
		<PageHeader
			title={localizationConstants.projectSubOverview}
			breadcrumbs={PROJECT_OVERVIEW_BREADCRUMBS}
		/>
		<div className="flex-1 p-6">
			{/* Tab-styled links back to the overview page, matching the figma header */}
			<div className="mb-6 border-b border-slate-200">
				<div className="-mb-px flex gap-6">
					<Link
						href="/module/production/project/overview"
						className="border-b-2 border-slate-900 px-3 pb-2.5 text-sm font-medium text-slate-900"
					>
						<Translate text={localizationConstants.projectListTab} />
					</Link>
					<Link
						href="/module/production/project/overview?tab=gantt"
						className="border-b-2 border-transparent pb-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
					>
						<Translate
							text={localizationConstants.projectListGanttTab}
						/>
					</Link>
				</div>
			</div>

			<div className="rounded-md border border-slate-200 bg-white">
				<ProjectGanttTable />
			</div>
		</div>
	</div>
);

export default ProjectDetailPage;
