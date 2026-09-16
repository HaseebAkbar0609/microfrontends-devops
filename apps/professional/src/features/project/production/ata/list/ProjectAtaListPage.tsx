"use client";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL, PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { ProjectRecordTitle } from "../../components/ProjectRecordTitle";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { AtaCustomerTab } from "./AtaCustomerTab";
import { useProjectAtaList } from "./useProjectAtaList";

export interface ProjectAtaListPageProps {
	projectId: string;
}

/**
 * ÄTA — the project's change and additional works.
 *
 * Built to the frames: ÄTA - kund with its summary and table. ÄTA-Leverantör
 * /UE has no frame of its own, so its tab is shown but disabled, with the
 * reason, until its ticket lands. The ticket's description — types, a
 * Skickad/Godkänd/Avböjd workflow, signatures, a payment-plan link — is not
 * drawn and not built.
 */
export function ProjectAtaListPage({ projectId }: ProjectAtaListPageProps) {
	const t = useTranslate();
	const list = useProjectAtaList(projectId);

	/* An id that matches no project is a 404. After the hooks: it throws. */
	if (!list.project) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: <ProjectRecordTitle projectNo={list.project.projectNr} sectionKey={localizationConstants.ataTitle} />,
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex-1 px-4 pt-4 pb-8 sm:px-6">
				{/* `SectionTabs` reads the query string, so it needs Suspense. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{ id: "kund", labelKey: localizationConstants.ataCustomerTab },
							{
								id: "leverantor",
								labelKey: localizationConstants.ataSupplierTab,
								disabled: true,
								disabledReasonKey: localizationConstants.projectAtaSupplierUnavailable,
							},
						]}
						ariaLabel={t(localizationConstants.ataTitle)}
					>
						<TabsContent value="kund" className="mt-4">
							<AtaCustomerTab projectId={projectId} list={list} />
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default ProjectAtaListPage;
