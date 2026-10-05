"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { SUPPORT_AGENTS_SEED } from "../constants/supportAgents.mock";
import { SUPPORT_TICKETS_SEED } from "../constants/supportTickets.mock";
import type {
	SupportAgent,
	SupportTicket,
	SupportTicketDraft,
	TicketStatus,
} from "../types";
import {
	applyAssignment,
	applyComment,
	applyStatusChange,
	buildNewTicket,
} from "../utils/ticketMutations";

export type SupportContextValue = {
	tickets: SupportTicket[];
	agents: SupportAgent[];
	getTicket: (ticketId: string) => SupportTicket | undefined;
	createTicket: (draft: SupportTicketDraft) => string;
	setTicketStatus: (ticketId: string, status: TicketStatus) => void;
	assignTicket: (ticketId: string, agentId: string | null) => void;
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
			const ticket = buildNewTicket(tickets, draft);
			setTickets((previous) => [ticket, ...previous]);
			return ticket.id;
		},
		[tickets],
	);

	const setTicketStatus = useCallback(
		(ticketId: string, status: TicketStatus) => {
			patch(ticketId, (ticket) => applyStatusChange(ticket, status));
		},
		[patch],
	);

	const assignTicket = useCallback(
		(ticketId: string, agentId: string | null) => {
			const agent = agents.find((candidate) => candidate.id === agentId);
			patch(ticketId, (ticket) => applyAssignment(ticket, agent, agentId));
		},
		[agents, patch],
	);

	const addComment = useCallback(
		(ticketId: string, text: string) => {
			patch(ticketId, (ticket) => applyComment(ticket, text));
		},
		[patch],
	);

	const value = useMemo<SupportContextValue>(
		() => ({
			tickets,
			agents,
			getTicket,
			createTicket,
			setTicketStatus,
			assignTicket,
			addComment,
		}),
		[
			tickets,
			agents,
			getTicket,
			createTicket,
			setTicketStatus,
			assignTicket,
			addComment,
		],
	);

	return (
		<SupportContext.Provider value={value}>{children}</SupportContext.Provider>
	);
}
