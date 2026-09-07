"use client";

import dynamic from "next/dynamic";
import { CalendarDays, CalendarRange, CalendarClock, CheckCircle2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { useSupportMetrics } from "../../hooks/useSupportMetrics";
import { useSupportTickets } from "../../hooks/useSupportTickets";
import { SupportModuleShell } from "../SupportModuleShell";
import { SupportStatCard } from "../SupportStatCard";
import { ChannelShareCard } from "./ChannelShareCard";
import { LineLoadCard } from "./LineLoadCard";

const TicketVolumeChart = dynamic(
	() => import("../TicketVolumeChart"),
	{
		ssr: false,
		loading: () => (
			<div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
		),
	},
);

export default function SupportStatisticsPage() {
	const { tickets, agents } = useSupportTickets();
	const metrics = useSupportMetrics(tickets, agents);

	return (
		<SupportModuleShell>
			<div className="grid grid-cols-1 gap-2.5 @2xl:grid-cols-2 @5xl:grid-cols-4">
				<SupportStatCard
					labelKey={localizationConstants.supportStatsToday}
					value={metrics.dayTotal}
					icon={CalendarDays}
				/>
				<SupportStatCard
					labelKey={localizationConstants.supportStatsThisWeek}
					value={metrics.weekTotal}
					icon={CalendarRange}
				/>
				<SupportStatCard
					labelKey={localizationConstants.supportStatsThisMonth}
					value={metrics.monthTotal}
					icon={CalendarClock}
				/>
				<SupportStatCard
					labelKey={localizationConstants.supportStatsResolved}
					value={metrics.resolvedCount}
					icon={CheckCircle2}
					valueClassName="text-emerald-700"
				/>
			</div>

			<TicketVolumeChart />

			<div className="grid gap-5 @5xl:grid-cols-2">
				<ChannelShareCard share={metrics.channelShare} />
				<LineLoadCard lineLoad={metrics.lineLoad} />
			</div>
		</SupportModuleShell>
	);
}
