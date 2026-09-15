"use client";

import { notFound } from "next/navigation";

import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../data/projectNav.config";
import { projectProductionTabs } from "../../projectProductionNav.config";
import { paymentPlanUrls } from "../paymentPlanNav";
import { AcontoCard } from "./AcontoCard";
import { PlanDocumentsCard } from "./PlanDocumentsCard";
import { PlanFooter } from "./PlanFooter";
import { PlanProjectInfoCard } from "./PlanProjectInfoCard";
import { PlanTermsCard } from "./PlanTermsCard";
import { PlanViewDialogs } from "./PlanViewDialogs";
import { usePaymentPlanEditor } from "./usePaymentPlanEditor";
import { usePlanViewDialogs } from "./usePlanViewDialogs";

export interface ProjectPaymentPlanViewPageProps {
	projectId: string;
	planId: string;
}

/**
 * Visa betalningsplan beställare — one plan, edited in place and saved or sent
 * from the footer.
 *
 * The plan is resolved on the client: one created in this browser exists only
 * in this browser's store, so a server lookup would 404 it. The frame titles
 * the page "View Betalningsplan beställare" — English inside Swedish copy, which
 * AGENTS.md rule 2 forbids — so Swedish reads "Visa betalningsplan beställare".
 */
export function ProjectPaymentPlanViewPage({ projectId, planId }: ProjectPaymentPlanViewPageProps) {
	const t = useTranslate();
	const editor = usePaymentPlanEditor(projectId, planId);
	const dialogs = usePlanViewDialogs();

	/* An unknown project, or a plan that is not this project's, is a 404. After
	   the hooks: `notFound()` throws. */
	if (!editor.projectInfo || !editor.plan) notFound();

	const plan = editor.plan;

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: t(localizationConstants.projectPaymentPlanViewTitle),
					backHref: paymentPlanUrls.list(projectId),
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
				<PlanProjectInfoCard projectId={projectId} info={editor.projectInfo} />
				<PlanTermsCard plan={plan} onEdit={() => dialogs.open({ kind: "editTerms" })} />
				<AcontoCard editor={editor} dialogs={dialogs} />
				<PlanDocumentsCard
					documents={plan.documents}
					onAdd={editor.addDocument}
					onDelete={(document) => dialogs.open({ kind: "deleteDocument", document })}
				/>
			</div>

			<PlanFooter
				onCancel={() => (editor.dirty ? dialogs.open({ kind: "discard" }) : editor.discard())}
				onSave={editor.save}
				onSend={() => dialogs.open({ kind: "send" })}
			/>

			<PlanViewDialogs editor={editor} dialogs={dialogs} />
		</div>
	);
}

export default ProjectPaymentPlanViewPage;
