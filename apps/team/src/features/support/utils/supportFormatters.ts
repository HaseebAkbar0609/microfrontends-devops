import {
	SLA_WARNING_THRESHOLD_MINUTES,
	SUPPORT_LOCALE,
} from "../constants/support.constants";
import type { SupportAgent, SupportTicket } from "../types";

export const EMPTY_VALUE_PLACEHOLDER = "—";

const dateTimeFormatter = new Intl.DateTimeFormat(SUPPORT_LOCALE, {
	dateStyle: "short",
	timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat(SUPPORT_LOCALE, {
	dateStyle: "short",
});

export function formatDateTime(iso: string): string {
	if (!iso) return EMPTY_VALUE_PLACEHOLDER;
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return EMPTY_VALUE_PLACEHOLDER;
	return dateTimeFormatter.format(parsed);
}

export function formatDate(iso: string): string {
	if (!iso) return EMPTY_VALUE_PLACEHOLDER;
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return EMPTY_VALUE_PLACEHOLDER;
	return dateFormatter.format(parsed);
}

/** How an SLA countdown should read and be coloured. */
export type SlaTone = "none" | "overdue" | "warning" | "normal";

export type SlaState = {
	tone: SlaTone;
	/** Always positive; the tone says whether it is remaining or overdue. */
	minutes: number;
};

export function getSlaState(ticket: SupportTicket): SlaState {
	if (ticket.status === "resolved") return { tone: "none", minutes: 0 };
	if (ticket.slaMinutesLeft < 0) {
		return { tone: "overdue", minutes: Math.abs(ticket.slaMinutesLeft) };
	}
	if (ticket.slaMinutesLeft < SLA_WARNING_THRESHOLD_MINUTES) {
		return { tone: "warning", minutes: ticket.slaMinutesLeft };
	}
	return { tone: "normal", minutes: ticket.slaMinutesLeft };
}

export const SLA_TONE_CLASS: Record<SlaTone, string> = {
	none: "text-slate-400",
	overdue: "text-red-600",
	warning: "text-amber-700",
	normal: "text-slate-500",
};

/** "Anna Lindqvist" -> "AL". */
export function initialsOf(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function findAgent(
	agents: SupportAgent[],
	agentId: string | null,
): SupportAgent | null {
	if (!agentId) return null;
	return agents.find((agent) => agent.id === agentId) ?? null;
}

/** Case- and accent-insensitive comparison used by the sortable columns. */
export function compareText(a: string, b: string): number {
	return a.localeCompare(b, undefined, {
		sensitivity: "base",
		numeric: true,
	});
}
