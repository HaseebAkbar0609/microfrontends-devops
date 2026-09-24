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
import { SupplierAtaTab } from "../leverantor/list/SupplierAtaTab";
import { ATA_SUPPLIER_SECTION } from "../leverantor/supplierAta.config";
import { AtaCustomerTab } from "./AtaCustomerTab";
import { useProjectAtaList } from "./useProjectAtaList";

export interface ProjectAtaListPageProps {
	projectId: string;
}

/**
 * ÄTA — the project's change and additional works.
 *
 * Built to the frames: ÄTA - kund (TFS-705), the project's own ÄTAs, and
 * ÄTA-Leverantör /UE (TFS-706), the ÄTAs its subcontractors and suppliers send
 * it. The tickets' descriptions — summary cards, a Skickad/Godkänd/Avböjd
 * workflow, signatures, a payment-plan link — are not drawn and not built.
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
							{ id: ATA_SUPPLIER_SECTION, labelKey: localizationConstants.ataSupplierTab },
						]}
						ariaLabel={t(localizationConstants.ataTitle)}
					>
						<TabsContent value="kund" className="mt-4">
							<AtaCustomerTab projectId={projectId} list={list} />
						</TabsContent>
						<TabsContent value={ATA_SUPPLIER_SECTION} className="mt-4">
							<SupplierAtaTab projectId={projectId} />
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default ProjectAtaListPage;
