"use client";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants from "@/utils/translation/constants";
import type { PaymentPlanEditor } from "./usePaymentPlanEditor";
import type { PlanViewDialogs as Dialogs } from "./usePlanViewDialogs";
import { AcontoDialog } from "./AcontoDialog";
import { InvoiceSummaryDialog } from "./InvoiceSummaryDialog";
import { PlanTermsDialog } from "./PlanTermsDialog";

export interface PlanViewDialogsProps {
	editor: PaymentPlanEditor;
	dialogs: Dialogs;
}

/**
 * Every dialog the plan view can open. Form dialogs mount only while open, so
 * each starts from the row's current values; confirms stay mounted so they
 * animate closed.
 */
export function PlanViewDialogs({ editor, dialogs }: PlanViewDialogsProps) {
	const { dialog, close } = dialogs;
	const plan = editor.plan;
	if (!plan) return null;

	const confirm = (run: () => void) => () => {
		run();
		close();
	};
	const onOpenChange = (open: boolean) => !open && close();

	const aconto =
		dialog && "aconto" in dialog ? dialog.aconto : undefined;

	return (
		<>
			{(dialog?.kind === "addAconto" || dialog?.kind === "editAconto") && (
				<AcontoDialog
					aconto={aconto}
					acontos={plan.acontos}
					terms={plan.terms}
					onClose={close}
					onSave={(values, id) => {
						editor.saveAconto(values, id);
						close();
					}}
				/>
			)}

			{dialog?.kind === "editTerms" && (
				<PlanTermsDialog
					terms={plan.terms}
					onClose={close}
					onSave={(terms) => {
						editor.updateTerms(terms);
						close();
					}}
				/>
			)}

			{dialog?.kind === "viewInvoice" && <InvoiceSummaryDialog aconto={dialog.aconto} onClose={close} />}

			<ConfirmActionDialog
				open={dialog?.kind === "deleteAconto"}
				onOpenChange={onOpenChange}
				title={localizationConstants.projectPaymentPlanAcontoDeleteTitle}
				description={localizationConstants.projectPaymentPlanAcontoDeleteBody}
				confirmLabel={localizationConstants.btnRadera}
				subject={aconto ? `${aconto.activity} ${aconto.date}` : undefined}
				destructive
				onConfirm={confirm(() => aconto && editor.removeAconto(aconto.id))}
			/>

			<ConfirmActionDialog
				open={dialog?.kind === "createInvoice"}
				onOpenChange={onOpenChange}
				title={localizationConstants.projectPaymentPlanInvoiceTitle}
				description={localizationConstants.projectPaymentPlanInvoiceBody}
				confirmLabel={localizationConstants.projectPaymentPlanCreateInvoice}
				subject={aconto ? `${aconto.activity} ${aconto.date}` : undefined}
				onConfirm={confirm(() => aconto && editor.createInvoice(aconto.id))}
			/>

			<ConfirmActionDialog
				open={dialog?.kind === "deleteDocument"}
				onOpenChange={onOpenChange}
				title={localizationConstants.projectPaymentPlanDocumentDeleteTitle}
				description={localizationConstants.projectPaymentPlanDocumentDeleteBody}
				confirmLabel={localizationConstants.btnRadera}
				subject={dialog?.kind === "deleteDocument" ? dialog.document.fileName : undefined}
				destructive
				onConfirm={confirm(() => dialog?.kind === "deleteDocument" && editor.removeDocument(dialog.document.id))}
			/>

			<ConfirmActionDialog
				open={dialog?.kind === "send"}
				onOpenChange={onOpenChange}
				title={localizationConstants.projectPaymentPlanSendTitle}
				description={localizationConstants.projectPaymentPlanSendBody}
				confirmLabel={localizationConstants.btnSkicka}
				subject={plan.name}
				onConfirm={confirm(editor.send)}
			/>

			<ConfirmActionDialog
				open={dialog?.kind === "discard"}
				onOpenChange={onOpenChange}
				title={localizationConstants.projectPaymentPlanDiscardTitle}
				description={localizationConstants.projectPaymentPlanDiscardBody}
				confirmLabel={localizationConstants.projectPaymentPlanDiscardConfirm}
				destructive
				onConfirm={confirm(editor.discard)}
			/>
		</>
	);
}

export default PlanViewDialogs;
