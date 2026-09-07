"use client";

import { useCallback, useMemo, useState } from "react";
import { SUPPORT_TABLE_PAGE_SIZE } from "../constants/support.constants";
import type {
	SupportAgent,
	SupportTicket,
	TicketLineFilter,
} from "../types";
import { findAgent } from "../utils/supportFormatters";

function matchesLine(ticket: SupportTicket, filter: TicketLineFilter): boolean {
	if (filter === "all") return true;
	if (filter === "escalated") return ticket.status === "escalated";
	return ticket.line === filter;
}

function matchesQuery(
	ticket: SupportTicket,
	agents: SupportAgent[],
	query: string,
): boolean {
	if (!query) return true;
	const assignee = findAgent(agents, ticket.assigneeId)?.name ?? "";
	return [ticket.id, ticket.subject, ticket.customer, assignee].some((field) =>
		field.toLowerCase().includes(query),
	);
}

/**
 * Search, line filter and paging for the ticket table. Pure derivation from the
 * list it is given, so it keeps working once the list comes from a query.
 */
export function useTicketFilters(
	tickets: SupportTicket[],
	agents: SupportAgent[],
) {
	const [lineFilter, setLineFilter] = useState<TicketLineFilter>("all");
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(SUPPORT_TABLE_PAGE_SIZE);

	const filteredTickets = useMemo(() => {
		const normalisedQuery = query.trim().toLowerCase();
		return tickets.filter(
			(ticket) =>
				matchesLine(ticket, lineFilter) &&
				matchesQuery(ticket, agents, normalisedQuery),
		);
	}, [tickets, agents, lineFilter, query]);

	const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const visibleTickets = useMemo(
		() =>
			filteredTickets.slice(
				(currentPage - 1) * pageSize,
				currentPage * pageSize,
			),
		[filteredTickets, currentPage, pageSize],
	);

	const changeLineFilter = useCallback((next: TicketLineFilter) => {
		setLineFilter(next);
		setPage(1);
	}, []);

	const changeQuery = useCallback((next: string) => {
		setQuery(next);
		setPage(1);
	}, []);

	const changePageSize = useCallback((next: number) => {
		setPageSize(next);
		setPage(1);
	}, []);

	return {
		lineFilter,
		query,
		currentPage,
		pageSize,
		totalPages,
		filteredCount: filteredTickets.length,
		visibleTickets,
		changeLineFilter,
		changeQuery,
		changePageSize,
		setPage,
	};
}
