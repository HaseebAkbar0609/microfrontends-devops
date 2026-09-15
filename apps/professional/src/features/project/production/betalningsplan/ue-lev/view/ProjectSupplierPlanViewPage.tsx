"use client";

import { notFound } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader } from "@/components/layout/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../../data/projectNav.config";
import { projectProductionTabs } from "../../../projectProductionNav.config";
import { paymentPlanUrls } from "../../paymentPlanNav";
import { InvoiceSummaryDialog } from "../../view/InvoiceSummaryDialog";
import { PlanProjectInfoCard } from "../../view/PlanProjectInfoCard";
import { PlanTermsCard } from "../../view/PlanTermsCard";
import { SUPPLIER_ECONOMY_LABELS } from "../supplierPlan.config";
import { SupplierAcontoCard } from "./SupplierAcontoCard";
import { SupplierDocumentsCard } from "./SupplierDocumentsCard";
import { SupplierPlanFooter } from "./SupplierPlanFooter";
import { useSupplierPlanView } from "./useSupplierPlanView";

export interface ProjectSupplierPlanViewPageProps {
	projectId: string;
	planId: string;
}

/**
 * Visa betalningsplan UE / Lev — a subcontractor's or supplier's plan, read and
 * approved by the project.
 *
 * Nothing the supplier sent is edited here, so the cards carry no pencils. The
 * project records what it does: pays an aconto, reviews each plan document, and
 * approves once every document is reviewed. The frame titles the page "View
 * Betalningsplan UE / Lev"; Swedish reads "Visa" (AGENTS.md rule 2).
 */
export function ProjectSupplierPlanViewPage({ projectId, planId }: ProjectSupplierPlanViewPageProps) {
	const t = useTranslate();
	const view = useSupplierPlanView(projectId, planId);

	/* An unknown project, or a plan that is not this project's, is a 404. After
	   the hooks: `notFound()` throws. */
	if (!view.projectInfo || !view.plan || !view.summary) notFound();

	const { plan, dialog } = view;
	const aconto = dialog && "aconto" in dialog ? dialog.aconto : undefined;

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: t(localizationConstants.projectSupplierPlanViewTitle),
					backHref: paymentPlanUrls.supplierList(projectId),
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
				<PlanProjectInfoCard
					info={view.projectInfo}
					counterparty={{ labelKey: localizationConstants.projectSupplierPlanSupplier, name: plan.companyName }}
				/>
				<PlanTermsCard
					terms={plan.terms}
					createdBy={plan.createdBy}
					createdDate={plan.createdDate}
					revisedDate={plan.revisedDate}
				/>
				<SupplierAcontoCard
					acontos={plan.acontos}
					summary={view.summary}
					onMarkPaid={(row) => view.openDialog({ kind: "markPaid", aconto: row })}
					onViewInvoice={(row) => view.openDialog({ kind: "viewInvoice", aconto: row })}
				/>
				<SupplierDocumentsCard documents={plan.documents} locked={view.locked} onReview={view.setReviewed} />
			</div>

			<SupplierPlanFooter
				onCancel={view.backToList}
				onApprove={() => view.openDialog({ kind: "approve" })}
				approveReason={view.approveReason}
			/>

			{dialog?.kind === "viewInvoice" && (
				<InvoiceSummaryDialog
					activity={dialog.aconto.activity}
					lift={dialog.aconto.lift}
					date={dialog.aconto.paidDate}
					amount={dialog.aconto.amount}
					retained={dialog.aconto.retained}
					economyKey={SUPPLIER_ECONOMY_LABELS[dialog.aconto.economy]}
					dateLabelKey={localizationConstants.projectSupplierPlanPaidDate}
					toReceiveLabelKey={localizationConstants.projectSupplierPlanToPay}
					onClose={view.closeDialog}
				/>
			)}

			<ConfirmActionDialog
				open={dialog?.kind === "markPaid"}
				onOpenChange={(open) => !open && view.closeDialog()}
				title={localizationConstants.projectSupplierPlanMarkPaidTitle}
				description={localizationConstants.projectSupplierPlanMarkPaidBody}
				confirmLabel={localizationConstants.projectSupplierPlanMarkPaid}
				subject={aconto ? `${aconto.activity} ${aconto.date}` : undefined}
				onConfirm={() => {
					if (aconto) view.markPaid(aconto.id);
					view.closeDialog();
				}}
			/>

			<ConfirmActionDialog
				open={dialog?.kind === "approve"}
				onOpenChange={(open) => !open && view.closeDialog()}
				title={localizationConstants.projectSupplierPlanApproveTitle}
				description={localizationConstants.projectSupplierPlanApproveBody}
				confirmLabel={localizationConstants.projectSupplierPlanApprove}
				subject={plan.companyName}
				onConfirm={() => {
					view.closeDialog();
					view.approve();
				}}
			/>
		</div>
	);
}

export default ProjectSupplierPlanViewPage;
