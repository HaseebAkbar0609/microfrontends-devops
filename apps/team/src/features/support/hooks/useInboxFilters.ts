"use client";

import { useMemo, useState } from "react";
import type { SupportTicket, TicketChannelFilter } from "../types";

/**
 * Channel filter, keyword search and the "open only" toggle for the inbox.
 * The toggle defaults on, matching the prototype: resolved tickets are hidden
 * until the agent asks for them.
 */
export function useInboxFilters(tickets: SupportTicket[]) {
	const [channelFilter, setChannelFilter] = useState<TicketChannelFilter>("all");
	const [query, setQuery] = useState("");
	const [openOnly, setOpenOnly] = useState(true);

	const visibleTickets = useMemo(() => {
		const normalisedQuery = query.trim().toLowerCase();
		return tickets
			.filter((ticket) => {
				if (channelFilter !== "all" && ticket.channel !== channelFilter) {
					return false;
				}
				if (openOnly && ticket.status === "resolved") return false;
				if (!normalisedQuery) return true;
				return [ticket.id, ticket.subject, ticket.customer].some((field) =>
					field.toLowerCase().includes(normalisedQuery),
				);
			})
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	}, [tickets, channelFilter, query, openOnly]);

	return {
		channelFilter,
		query,
		openOnly,
		visibleTickets,
		setChannelFilter,
		setQuery,
		setOpenOnly,
	};
}
