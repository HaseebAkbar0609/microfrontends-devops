"use client";

import { useMemo } from "react";
import { SUPPORT_REFERENCE_DATE } from "../constants/support.constants";
import { SUPPORT_VOLUME_BY_RANGE } from "../constants/supportVolume.mock";
import type {
	SupportAgent,
	SupportChannel,
	SupportLine,
	SupportTicket,
	VolumePoint,
} from "../types";

const REFERENCE_DAY = SUPPORT_REFERENCE_DATE.slice(0, 10);

function sumPoint(point: VolumePoint): number {
	return point.phone + point.email + point.chat;
}

function sumRange(points: VolumePoint[]): number {
	return points.reduce((total, point) => total + sumPoint(point), 0);
}

export type ChannelShare = {
	channel: SupportChannel;
	count: number;
	percent: number;
};

/**
 * Every KPI on the support pages, derived from the ticket store.
 *
 * The prototype hardcoded the four dashboard numbers as string literals while
 * the other pages computed theirs live, so the dashboard disagreed with the
 * table beneath it. These all come from the same source.
 */
export function useSupportMetrics(
	tickets: SupportTicket[],
	agents: SupportAgent[],
) {
	return useMemo(() => {
		const open = tickets.filter((ticket) => ticket.status !== "resolved");
		const escalated = tickets.filter((ticket) => ticket.status === "escalated");
		const resolved = tickets.filter((ticket) => ticket.status === "resolved");
		const newToday = tickets.filter((ticket) =>
			ticket.createdAt.startsWith(REFERENCE_DAY),
		);

		const onlineAgents = agents.filter((agent) => agent.online);
		const agentCountries = new Set(
			agents.filter((agent) => agent.country !== "Global").map((a) => a.country),
		);

		const overSla = escalated.filter((ticket) => ticket.slaMinutesLeft < 0);
		const critical = escalated.filter((ticket) => ticket.priority === "critical");

		const dayTotal = sumRange(SUPPORT_VOLUME_BY_RANGE.day);
		const weekTotal = sumRange(SUPPORT_VOLUME_BY_RANGE.week);
		const monthTotal = sumRange(SUPPORT_VOLUME_BY_RANGE.month);

		const channelTotals = SUPPORT_VOLUME_BY_RANGE.week.reduce(
			(totals, point) => ({
				phone: totals.phone + point.phone,
				email: totals.email + point.email,
				chat: totals.chat + point.chat,
			}),
			{ phone: 0, email: 0, chat: 0 },
		);
		const channelSum =
			channelTotals.phone + channelTotals.email + channelTotals.chat;
		const channelShare: ChannelShare[] = (
			["phone", "email", "chat"] as SupportChannel[]
		).map((channel) => ({
			channel,
			count: channelTotals[channel],
			percent: channelSum
				? Math.round((channelTotals[channel] / channelSum) * 100)
				: 0,
		}));

		const lineLoad = (["first", "second"] as SupportLine[]).map((line) => ({
			line,
			open: open.filter((ticket) => ticket.line === line).length,
			agents: onlineAgents.filter((agent) => agent.line === line).length,
		}));

		return {
			totalCount: tickets.length,
			openCount: open.length,
			escalatedCount: escalated.length,
			resolvedCount: resolved.length,
			newTodayCount: newToday.length,
			overSlaCount: overSla.length,
			criticalCount: critical.length,
			agentCount: agents.length,
			onlineAgentCount: onlineAgents.length,
			agentCountryCount: agentCountries.size,
			secondLineOnlineCount: onlineAgents.filter((a) => a.line === "second")
				.length,
			dayTotal,
			weekTotal,
			monthTotal,
			channelShare,
			lineLoad,
		};
	}, [tickets, agents]);
}

/** Open, unresolved tickets per channel — used by the inbox header cards. */
export function useChannelCounts(tickets: SupportTicket[]) {
	return useMemo(() => {
		const counts: Record<SupportChannel, number> = {
			phone: 0,
			email: 0,
			chat: 0,
		};
		for (const ticket of tickets) {
			if (ticket.status === "resolved") continue;
			counts[ticket.channel] += 1;
		}
		return counts;
	}, [tickets]);
}
