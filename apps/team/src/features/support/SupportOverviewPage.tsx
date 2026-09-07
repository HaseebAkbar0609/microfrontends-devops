"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	CREATE_TICKET_HREF,
	SUPPORT_BREADCRUMBS,
	SUPPORT_MODULE_TABS,
	SUPPORT_MODULE_TITLE_KEY,
} from "./constants/supportNav";
import { useSupportTickets } from "./hooks/useSupportTickets";
import { useSupportMetrics } from "./hooks/useSupportMetrics";
import { AgentPanel } from "./components/AgentPanel";
import { SupportStatCards } from "./components/SupportStatCards";
import { TicketTable } from "./components/TicketTable";

/** recharts measures the DOM, so it must not render on the server. */
const TicketVolumeChart = dynamic(
	() => import("./components/TicketVolumeChart"),
	{
		ssr: false,
		loading: () => (
			<div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
		),
	},
);

export default function SupportOverviewPage() {
	const { tickets, agents } = useSupportTickets();
	const metrics = useSupportMetrics(tickets, agents);
	const router = useRouter();

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				title={SUPPORT_MODULE_TITLE_KEY}
				tabs={SUPPORT_MODULE_TABS}
				breadcrumbs={SUPPORT_BREADCRUMBS}
			/>

			<div className="flex flex-col gap-5 px-5 py-5">
				<SupportStatCards
					newTodayCount={metrics.newTodayCount}
					openCount={metrics.openCount}
					escalatedCount={metrics.escalatedCount}
					onlineAgentCount={metrics.onlineAgentCount}
					agentCount={metrics.agentCount}
					agentCountryCount={metrics.agentCountryCount}
				/>

				<div className="grid gap-5 @5xl:grid-cols-3">
					<div className="@5xl:col-span-2">
						<TicketVolumeChart />
					</div>
					<AgentPanel
						agents={agents}
						onlineCount={metrics.onlineAgentCount}
					/>
				</div>

				<TicketTable
					tickets={tickets}
					agents={agents}
					onCreateTicket={() => router.push(CREATE_TICKET_HREF)}
				/>
			</div>
		</div>
	);
}
