import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import {
	SLA_MINUTES_CRITICAL,
	SLA_MINUTES_HIGH,
	SLA_MINUTES_LOW,
	SLA_MINUTES_MEDIUM,
	TICKET_ID_FLOOR,
	TICKET_ID_PREFIX,
} from "../constants/support.constants";
import type {
	SupportChannel,
	SupportTicket,
	TicketAction,
	TicketActionType,
	TicketPriority,
} from "../types";

/**
 * Everything here runs from a client event handler only — never during render —
 * so reading the real clock cannot cause a hydration mismatch.
 */

const SLA_BY_PRIORITY: Record<TicketPriority, number> = {
	critical: SLA_MINUTES_CRITICAL,
	high: SLA_MINUTES_HIGH,
	medium: SLA_MINUTES_MEDIUM,
	low: SLA_MINUTES_LOW,
};

export function getSlaMinutesForPriority(priority: TicketPriority): number {
	return SLA_BY_PRIORITY[priority];
}

const CREATED_KEY_BY_CHANNEL: Record<SupportChannel, TranslationKeys> = {
	phone: localizationConstants.supportActionCreatedViaPhone,
	email: localizationConstants.supportActionCreatedViaEmail,
	chat: localizationConstants.supportActionCreatedViaChat,
};

export function getCreatedActionKey(channel: SupportChannel): TranslationKeys {
	return CREATED_KEY_BY_CHANNEL[channel];
}

/** Continues the `TF-2481` sequence from the highest id currently held. */
export function nextTicketId(tickets: SupportTicket[]): string {
	const numbers = tickets.map((ticket) =>
		Number(ticket.id.split("-")[1] ?? 0),
	);
	return `${TICKET_ID_PREFIX}-${Math.max(...numbers, TICKET_ID_FLOOR) + 1}`;
}

let actionSequence = 0;

export function createTicketAction(
	ticket: SupportTicket,
	action: Omit<TicketAction, "id" | "at">,
): TicketAction {
	actionSequence += 1;
	return {
		...action,
		id: `${ticket.id}-${ticket.actions.length + actionSequence}`,
		at: new Date().toISOString(),
	};
}

export function appendAction(
	ticket: SupportTicket,
	action: Omit<TicketAction, "id" | "at">,
): SupportTicket {
	return {
		...ticket,
		actions: [...ticket.actions, createTicketAction(ticket, action)],
	};
}

export const ACTION_TYPES: TicketActionType[] = [
	"comment",
	"status",
	"escalation",
	"assignment",
];
