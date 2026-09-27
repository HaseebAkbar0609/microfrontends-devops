"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import {
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
	projectBreadcrumbs,
} from "@/features/project/data/projectNav.config";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface ProjectWarrantyPageProps {
	/** Present on `/project/warranty/[id]`, which opens the detail directly. */
	recordId?: string;
}

/**
 * This section has no connected project warranty source yet. Keep its
 * navigation, but do not expose the former seeded warranty records as live data.
 */
export function ProjectWarrantyPage({ recordId: _recordId }: ProjectWarrantyPageProps) {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				breadcrumbs={projectBreadcrumbs(
					localizationConstants.projectWarrantyCommitments,
				)}
			/>

			<div className="flex-1 px-6 py-8">
				<div className="border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-600">
					<Translate text={localizationConstants.projectSectionDataUnavailable} />
				</div>
			</div>
		</div>
	);
}

export default ProjectWarrantyPage;
