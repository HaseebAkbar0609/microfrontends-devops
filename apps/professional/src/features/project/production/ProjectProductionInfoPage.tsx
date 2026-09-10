"use client";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	PROJECT_MODULE_BASE_URL,
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "../data/projectNav.config";
import {
	CONTACT_FIELDS,
	CUSTOMER_FIELDS,
	PROJECT_FIELDS,
	PROJECT_INFO_FIELDS,
} from "../shared/projectInfoFields";
import { ProjectInfoCards } from "./components/ProjectInfoCards";
import { ProjectRecordTitle } from "./components/ProjectRecordTitle";
import { ProjectInfoEditDialog } from "./components/ProjectInfoEditDialog";
import { ProjectOfferPanel } from "./components/ProjectOfferPanel";
import type { ProjectInfoSectionKey } from "./types";
import { useProjectRecordInfo } from "./hooks/useProjectRecordInfo";
import { validateSection } from "./validateSection";
import { projectProductionTabs } from "./projectProductionNav.config";

export interface ProjectProductionInfoPageProps {
	projectId: string;
}

/**
 * Projektinformation — a project record's four information cards.
 *
 * Two levels of navigation, per the header's own rule: the record's sections
 * are their own routes and so are `secondaryTabs`, while Projektuppgifter and
 * Offert are two panels of this one route and so are `SectionTabs`.
 */
export function ProjectProductionInfoPage({
	projectId,
}: ProjectProductionInfoPageProps) {
	const t = useTranslate();
	const { info, editing, setEditing, closeEditor, saveSection } =
		useProjectRecordInfo(projectId);

	/** An id that matches no project is a 404, not an empty record. */
	if (!info) notFound();

	/** Section validator, with its translation keys resolved for display. */
	const checker =
		<TSection extends object>(section: ProjectInfoSectionKey) =>
		(values: TSection): Record<string, string> =>
			Object.fromEntries(
				Object.entries(
					validateSection(section, values as Record<string, unknown>),
				).map(([field, key]) => [field, t(key)]),
			);

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={info.details.projectNo}
							sectionKey={localizationConstants.agreementProjectInfo}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				{/* `SectionTabs` reads the active section from the query string,
				    so it needs a Suspense boundary to prerender. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{
								id: "projektuppgifter",
								labelKey: localizationConstants.projectDetailsTab,
							},
							{ id: "offert", labelKey: localizationConstants.offerTab },
						]}
						ariaLabel={t(localizationConstants.agreementProjectInfo)}
					>
						<TabsContent value="projektuppgifter" className="mt-4">
							<ProjectInfoCards info={info} onEdit={setEditing} />
						</TabsContent>

						<TabsContent value="offert" className="mt-4">
							<ProjectOfferPanel info={info} />
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>

			<ProjectInfoEditDialog
				isOpen={editing === "customer"}
				titleKey={localizationConstants.editCustomerModalTitle}
				fields={CUSTOMER_FIELDS}
				value={info.customer}
				onClose={closeEditor}
				validate={checker("customer")}
				onSave={(values) => saveSection("customer", values)}
			/>

			<ProjectInfoEditDialog
				isOpen={editing === "contact"}
				titleKey={localizationConstants.editContactModalTitle}
				fields={CONTACT_FIELDS}
				value={info.contactPerson}
				onClose={closeEditor}
				validate={checker("contact")}
				onSave={(values) => saveSection("contact", values)}
			/>

			<ProjectInfoEditDialog
				isOpen={editing === "project"}
				titleKey={localizationConstants.projectLabel}
				fields={PROJECT_FIELDS}
				value={info.details}
				onClose={closeEditor}
				validate={checker("project")}
				onSave={(values) => saveSection("project", values)}
			/>

			<ProjectInfoEditDialog
				isOpen={editing === "projectInfo"}
				titleKey={localizationConstants.projectCreateInfoSection}
				fields={PROJECT_INFO_FIELDS}
				value={info.details}
				onClose={closeEditor}
				validate={checker("projectInfo")}
				onSave={(values) => saveSection("projectInfo", values)}
			/>
		</div>
	);
}

export default ProjectProductionInfoPage;
