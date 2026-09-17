"use client";

import type { UseFormReturn } from "react-hook-form";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants from "@/utils/translation/constants";
import type { AtaFormValues } from "./ataFormSchema";
import { AtaLineItemsDialog } from "./lineItems/AtaLineItemsDialog";
import type { AtaFormActions } from "./useAtaFormActions";

export interface AtaFormDialogsProps {
	form: UseFormReturn<AtaFormValues>;
	actions: AtaFormActions;
	/** Names the ÄTA in the send confirm, e.g. "Äta 106". */
	subject: string;
}

/**
 * The form's dialogs, rendered after the page's `<form>`: a portal still
 * bubbles React's submit event to the form it sits in.
 */
export function AtaFormDialogs({ form, actions, subject }: AtaFormDialogsProps) {
	return (
		<>
			<ConfirmActionDialog
				open={actions.sendOpen}
				onOpenChange={actions.setSendOpen}
				title={localizationConstants.projectAtaSendTitle}
				description={localizationConstants.projectAtaSendBody}
				confirmLabel={localizationConstants.createAtaBtnSend}
				subject={subject}
				onConfirm={actions.confirmSend}
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

export default AtaFormDialogs;
