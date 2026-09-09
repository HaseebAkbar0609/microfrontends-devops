"use client";

import { Users, UserCheck, ShieldCheck } from "lucide-react";
import { Search } from "@/components/search/Search";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useAgentFilters } from "../../hooks/useAgentFilters";
import { useSupportMetrics } from "../../hooks/useSupportMetrics";
import { useSupportTickets } from "../../hooks/useSupportTickets";
import type { AgentLineFilter } from "../../types";
import { SupportModuleShell } from "../SupportModuleShell";
import { SupportStatCard } from "../SupportStatCard";
import { AgentTable } from "./AgentTable";
import { CountryStaffingGrid } from "./CountryStaffingGrid";

const LINE_FILTERS: { id: AgentLineFilter; labelKey: string }[] = [
	{ id: "all", labelKey: localizationConstants.supportFilterAll },
	{ id: "first", labelKey: localizationConstants.supportLineFirst },
	{ id: "second", labelKey: localizationConstants.supportLineSecond },
];

export default function SupportAgentsPage() {
	const { tickets, agents } = useSupportTickets();
	const metrics = useSupportMetrics(tickets, agents);
	const { lineFilter, query, visibleAgents, setLineFilter, setQuery } =
		useAgentFilters(agents);

	return (
		<SupportModuleShell>
			<div className="grid grid-cols-1 gap-2.5 @2xl:grid-cols-3">
				<SupportStatCard
					labelKey={localizationConstants.supportAgentsTotal}
					value={metrics.agentCount}
					icon={Users}
				/>
				<SupportStatCard
					labelKey={localizationConstants.supportAgentsLoggedIn}
					value={metrics.onlineAgentCount}
					icon={UserCheck}
					valueClassName="text-emerald-700"
				/>
				<SupportStatCard
					labelKey={localizationConstants.supportSecondLineOnline}
					value={metrics.secondLineOnlineCount}
					icon={ShieldCheck}
				/>
			</div>

			<section className="@container rounded-xl border border-slate-200 bg-white shadow-2xs">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
					<Tabs
						value={lineFilter}
						onValueChange={(value) => setLineFilter(value as AgentLineFilter)}
					>
						<TabsList variant="line" className="h-9">
							{LINE_FILTERS.map((filter) => (
								<TabsTrigger
									key={filter.id}
									value={filter.id}
									className="cursor-pointer px-3 text-sm"
								>
									<Translate text={filter.labelKey} />
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
					<Search
						value={query}
						onChange={setQuery}
						placeholder={localizationConstants.supportSearchAgentsPlaceholder}
						className="h-10 w-full max-w-70"
					/>
				</div>

				<AgentTable agents={visibleAgents} />
			</section>

			<CountryStaffingGrid />
		</SupportModuleShell>
	);
}
