"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import localizationConstants from "@/utils/translation/constants";
import { SUPPORT_CURRENT_USER_ID } from "../constants/support.constants";
import { SUPPORT_AGENTS_SEED } from "../constants/supportAgents.mock";
import { SUPPORT_CRAFTSMEN_SEED } from "../constants/supportCraftsmen.mock";
import { SUPPORT_TICKETS_SEED } from "../constants/supportTickets.mock";
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
} from "../utils/ticketFactories";

export type SupportContextValue = {
	tickets: SupportTicket[];
	agents: SupportAgent[];
	craftsmen: Craftsman[];
	getTicket: (ticketId: string) => SupportTicket | undefined;
	createTicket: (draft: SupportTicketDraft) => string;
	setTicketStatus: (ticketId: string, status: TicketStatus) => void;
	assignTicket: (ticketId: string, agentId: string | null) => void;
	setTicketCraftsman: (ticketId: string, craftsmanId: string | null) => void;
	addComment: (ticketId: string, text: string) => void;
};

export const SupportContext = createContext<SupportContextValue | null>(null);

/**
 * Holds the support desk for the length of the session.
 *
 * The prototype kept this in a module-level mutable array behind
 * `useSyncExternalStore`, with the same function for `getSnapshot` and
 * `getServerSnapshot` — under a long-lived Node server that leaks one user's
 * tickets to every other request. State lives in React here instead, and stays
 * in memory rather than `localStorage` because these records carry customer
 * names and phone numbers (AGENTS.md §6).
 */
export function SupportProvider({ children }: { children: ReactNode }) {
	const [tickets, setTickets] = useState<SupportTicket[]>(SUPPORT_TICKETS_SEED);
	const agents = SUPPORT_AGENTS_SEED;
	const craftsmen = SUPPORT_CRAFTSMEN_SEED;

	const getTicket = useCallback(
		(ticketId: string) => tickets.find((ticket) => ticket.id === ticketId),
		[tickets],
	);

	const patch = useCallback(
		(ticketId: string, apply: (ticket: SupportTicket) => SupportTicket) => {
			setTickets((previous) =>
				previous.map((ticket) =>
					ticket.id === ticketId ? apply(ticket) : ticket,
				),
			);
		},
		[],
	);

	const createTicket = useCallback(
		(draft: SupportTicketDraft) => {
			const id = nextTicketId(tickets);
			const createdAt = new Date().toISOString();
			const ticket: SupportTicket = {
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
			setTickets((previous) => [ticket, ...previous]);
			return id;
		},
		[tickets],
	);

	const setTicketStatus = useCallback(
		(ticketId: string, status: TicketStatus) => {
			patch(ticketId, (ticket) =>
				appendAction(
					{ ...ticket, status },
					{
						authorId: SUPPORT_CURRENT_USER_ID,
						text: "",
						messageKey: localizationConstants.supportActionStatusChanged,
						// A status id, resolved to a label when the log renders, so the
						// entry follows the language toggle.
						messageValue: status,
						type: status === "escalated" ? "escalation" : "status",
					},
				),
			);
		},
		[patch],
	);

	const assignTicket = useCallback(
		(ticketId: string, agentId: string | null) => {
			const agent = agents.find((candidate) => candidate.id === agentId);
			patch(ticketId, (ticket) =>
				appendAction(
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
				),
			);
		},
		[agents, patch],
	);

	const setTicketCraftsman = useCallback(
		(ticketId: string, craftsmanId: string | null) => {
			const craftsman = craftsmen.find(
				(candidate) => candidate.id === craftsmanId,
			);
			patch(ticketId, (ticket) =>
				appendAction(
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
				),
			);
		},
		[craftsmen, patch],
	);

	const addComment = useCallback(
		(ticketId: string, text: string) => {
			patch(ticketId, (ticket) =>
				appendAction(ticket, {
					authorId: SUPPORT_CURRENT_USER_ID,
					text,
					type: "comment",
				}),
			);
		},
		[patch],
	);

	const value = useMemo<SupportContextValue>(
		() => ({
			tickets,
			agents,
			craftsmen,
			getTicket,
			createTicket,
			setTicketStatus,
			assignTicket,
			setTicketCraftsman,
			addComment,
		}),
		[
			tickets,
			agents,
			craftsmen,
			getTicket,
			createTicket,
			setTicketStatus,
			assignTicket,
			setTicketCraftsman,
			addComment,
		],
	);

	return (
		<SupportContext.Provider value={value}>{children}</SupportContext.Provider>
	);
}
