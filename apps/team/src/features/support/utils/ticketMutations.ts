import localizationConstants from "@/utils/translation/constants";
import { SUPPORT_CURRENT_USER_ID } from "../constants/support.constants";
import type {
	Craftsman,
	SupportAgent,
	SupportTicket,
	SupportTicketDraft,
	TicketStatus,
} from "../types";
import {
	appendAction,
	getCreatedActionKey,
	getSlaMinutesForPriority,
	nextTicketId,
} from "./ticketFactories";

/**
 * Pure ticket transitions. Keeping them out of the provider leaves that file as
 * wiring and makes each transition testable on its own.
 *
 * Generated log entries store a translation key plus a raw value rather than a
 * finished sentence, so the log follows the language toggle.
 */

export function buildNewTicket(
	tickets: SupportTicket[],
	draft: SupportTicketDraft,
): SupportTicket {
	const id = nextTicketId(tickets);
	const createdAt = new Date().toISOString();

	return {
		...draft,
		id,
		status: "new",
		createdAt,
		slaMinutesLeft: getSlaMinutesForPriority(draft.priority),
		actions: [
			{
				id: `${id}-a0`,
				at: createdAt,
				authorId: null,
				text: "",
				messageKey: getCreatedActionKey(draft.channel),
				type: "comment",
			},
		],
	};
}

export function applyStatusChange(
	ticket: SupportTicket,
	status: TicketStatus,
): SupportTicket {
	return appendAction(
		{ ...ticket, status },
		{
			authorId: SUPPORT_CURRENT_USER_ID,
			text: "",
			messageKey: localizationConstants.supportActionStatusChanged,
			// A status id; the log resolves it to a label when it renders.
			messageValue: status,
			type: status === "escalated" ? "escalation" : "status",
		},
	);
}

export function applyAssignment(
	ticket: SupportTicket,
	agent: SupportAgent | undefined,
	agentId: string | null,
): SupportTicket {
	return appendAction(
		{ ...ticket, assigneeId: agentId, line: agent?.line ?? ticket.line },
		{
			authorId: SUPPORT_CURRENT_USER_ID,
			text: "",
			messageKey: agent
				? localizationConstants.supportActionAssigned
				: localizationConstants.supportActionUnassigned,
			messageValue: agent?.name,
			type: "assignment",
		},
	);
}

export function applyCraftsmanLink(
	ticket: SupportTicket,
	craftsman: Craftsman | undefined,
	craftsmanId: string | null,
): SupportTicket {
	return appendAction(
		{ ...ticket, craftsmanId },
		{
			authorId: SUPPORT_CURRENT_USER_ID,
			text: "",
			messageKey: craftsman
				? localizationConstants.supportActionCraftsmanLinked
				: localizationConstants.supportActionCraftsmanUnlinked,
			messageValue: craftsman?.name,
			type: "comment",
		},
	);
}

export function applyComment(
	ticket: SupportTicket,
	text: string,
): SupportTicket {
	return appendAction(ticket, {
		authorId: SUPPORT_CURRENT_USER_ID,
		text,
		type: "comment",
	});
}
