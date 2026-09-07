"use client";

import { getTicketStatusMeta } from "../../constants/supportStatuses";
import type { TicketAction, TicketStatus } from "../../types";
import { Translate } from "@/utils/translation/translate";

/**
 * Renders one log entry. Free-text comments print as written; generated entries
 * carry a translation key so they follow the language toggle, and a status
 * value is stored as an id and resolved to a label here rather than baked in.
 */
export function TicketActionMessage({ action }: { action: TicketAction }) {
	if (action.text) return <>{action.text}</>;
	if (!action.messageKey) return null;

	const isStatusValue = action.type === "status" || action.type === "escalation";

	return (
		<>
			<Translate text={action.messageKey} />
			{action.messageValue ? (
				<>
					{" "}
					{isStatusValue ? (
						<Translate
							text={
								getTicketStatusMeta(action.messageValue as TicketStatus).labelKey
							}
						/>
					) : (
						action.messageValue
					)}
				</>
			) : null}
		</>
	);
}
