"use client";

import type { UseFormReturn } from "react-hook-form";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants from "@/utils/translation/constants";
import { AtaLineItemsDialog } from "../../form/lineItems/AtaLineItemsDialog";
import type { SupplierAtaFormValues } from "./supplierAtaFormSchema";
import type { SupplierAtaViewActions } from "./useSupplierAtaViewActions";

export interface SupplierAtaViewDialogsProps {
	form: UseFormReturn<SupplierAtaFormValues>;
	actions: SupplierAtaViewActions;
	/** Names the ÄTA in the confirm, e.g. "Pelle Målare 004". */
	subject: string;
}

/** View ÄTA's dialogs, rendered after the page's `<form>` — a portal still bubbles React's submit. */
export function SupplierAtaViewDialogs({ form, actions, subject }: SupplierAtaViewDialogsProps) {
	return (
		<>
			<ConfirmActionDialog
				open={actions.approveOpen}
				onOpenChange={actions.setApproveOpen}
				title={localizationConstants.viewAtaApproveConfirmTitle}
				description={
					actions.dirty
						? localizationConstants.projectAtaSupplierApproveSaveBody
						: localizationConstants.projectAtaSupplierApproveBody
				}
				confirmLabel={localizationConstants.viewAtaBtnApprove}
				subject={subject}
				onConfirm={actions.confirmApprove}
			/>

			<ConfirmActionDialog
				open={actions.discardOpen}
				onOpenChange={actions.setDiscardOpen}
				title={localizationConstants.projectAtaDiscardTitle}
				description={localizationConstants.projectAtaDiscardBody}
				confirmLabel={localizationConstants.projectAtaDiscardConfirm}
				destructive
				onConfirm={actions.discard}
			/>

			{actions.editing && (
				<AtaLineItemsDialog
					section={actions.editing.section}
					items={form.getValues(`lineItems.${actions.editing.section}`)}
					today={actions.editing.today}
					onApply={actions.applyLineItems}
					onClose={actions.closeLineItems}
				/>
			)}
		</>
	);
}

export default SupplierAtaViewDialogs;
