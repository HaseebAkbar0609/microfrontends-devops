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
import { UeLevPlanTab } from "../ue-lev/list/UeLevPlanTab";
import { BestallarePlanTab } from "./BestallarePlanTab";
import { usePaymentPlanList } from "./usePaymentPlanList";

export interface ProjectPaymentPlanListPageProps {
	projectId: string;
}

/**
 * Betalningsplan — the plans the project sends its client (Beställare) and the
 * plans its subcontractors and suppliers send it (UE / Lev).
 *
 * The tabs keep their choice in `?section=`, so a UE / Lev plan's back arrow
 * returns to the tab it was opened from.
 */
export function ProjectPaymentPlanListPage({ projectId }: ProjectPaymentPlanListPageProps) {
	const t = useTranslate();
	const list = usePaymentPlanList(projectId);

	/* An id that matches no project is a 404. After the hooks: it throws. */
	if (!list.project) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={list.project.projectNr}
							sectionKey={localizationConstants.paymentPlanTitle}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex-1 px-6 pt-4 pb-8">
				{/* `SectionTabs` reads the query string, so it needs Suspense. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{ id: "bestallare", labelKey: localizationConstants.paymentPlanBestallareTab },
							{ id: "ue-lev", labelKey: localizationConstants.paymentPlanUeLevTab },
						]}
						ariaLabel={t(localizationConstants.paymentPlanTitle)}
					>
						<TabsContent value="bestallare" className="mt-4">
							<BestallarePlanTab projectId={projectId} list={list} />
						</TabsContent>
						<TabsContent value="ue-lev" className="mt-4">
							<UeLevPlanTab projectId={projectId} />
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default ProjectPaymentPlanListPage;
