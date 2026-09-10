"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import {
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
	projectBreadcrumbs,
} from "@/features/project/data/projectNav.config";
import { WarrantyFeature } from "@/features/warranty/WarrantyFeature";
import localizationConstants from "@/utils/translation/constants";

export interface ProjectWarrantyPageProps {
	/** Present on `/project/warranty/[id]`, which opens the detail directly. */
	recordId?: string;
}

/**
 * The Project module's Garantiåtaganden screen, replacing the Coming Soon stub.
 *
 * The frames draw a record-scoped left sidebar with a "Gå till" section. That
 * sidebar existed as `ProjectSubSidebar` and was deleted by TFS-910, whose
 * commit records the reason — record shortcuts "have no place in a tab row,
 * those records are reached by drilling into the list". Navigation stays on
 * `ModulePageHeader`; flagged on the ticket.
 */
export function ProjectWarrantyPage({ recordId }: ProjectWarrantyPageProps) {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				breadcrumbs={projectBreadcrumbs(
					localizationConstants.projectWarrantyCommitments,
				)}
			/>

			<WarrantyFeature
				recordId={recordId}
				initialView={recordId ? "detail" : "table"}
			/>
		</div>
	);
}

export default ProjectWarrantyPage;
