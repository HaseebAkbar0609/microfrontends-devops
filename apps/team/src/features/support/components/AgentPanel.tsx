"use client";

import { COUNTRY_LOAD_CAPACITY } from "../constants/support.constants";
import { SUPPORT_COUNTRY_LOAD } from "../constants/supportVolume.mock";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SupportAgent } from "../types";
import { initialsOf } from "../utils/supportFormatters";
import { SupportLineBadge } from "./SupportBadges";

type AgentPanelProps = {
	agents: SupportAgent[];
	onlineCount: number;
};

/** Roster with presence, plus first-line load per country. */
export function AgentPanel({ agents, onlineCount }: AgentPanelProps) {
	const sortedAgents = [...agents].sort(
		(a, b) => Number(b.online) - Number(a.online),
	);

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.supportAgentsPanelTitle} />
				</h2>
				<span className="text-xs font-semibold text-emerald-700">
					{onlineCount}{" "}
					<Translate text={localizationConstants.supportAgentsActiveSuffix} />
				</span>
			</div>

			<ul className="mt-4 space-y-3">
				{sortedAgents.map((agent) => (
					<li key={agent.id} className="flex items-center gap-3">
						<span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
							{initialsOf(agent.name)}
							<span
								aria-hidden
								className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white ${
									agent.online ? "bg-emerald-500" : "bg-slate-300"
								}`}
							/>
						</span>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-slate-900">
								{agent.name}
							</p>
							<p className="truncate text-xs text-slate-500">
								<Translate text={agent.roleKey} /> · {agent.country}
							</p>
						</div>
						<div className="shrink-0 text-right">
							<SupportLineBadge line={agent.line} />
							<p className="mt-1 text-xs text-slate-500">
								{agent.online ? (
									<>
										{agent.activeTickets}{" "}
										<Translate
											text={localizationConstants.supportTicketsCountSuffix}
										/>
									</>
								) : (
									<Translate text={localizationConstants.supportOffline} />
								)}
							</p>
						</div>
					</li>
				))}
			</ul>

			<div className="my-4 h-px bg-slate-200" />

			<h3 className="text-sm font-semibold text-slate-900">
				<Translate text={localizationConstants.supportCountryLoadTitle} />
			</h3>
			<ul className="mt-3 space-y-3">
				{SUPPORT_COUNTRY_LOAD.map((entry) => {
					const percent = Math.min(
						100,
						(entry.open / COUNTRY_LOAD_CAPACITY) * 100,
					);
					const isUnstaffed = entry.agents === 0;
					return (
						<li key={entry.country}>
							<div className="flex items-baseline justify-between gap-2 text-xs">
								<span className="font-medium text-slate-700">
									{entry.country}
								</span>
								<span className="text-slate-500">
									{entry.open}{" "}
									<Translate text={localizationConstants.supportOpenSuffix} /> ·{" "}
									{entry.agents}{" "}
									<Translate text={localizationConstants.supportOnlineSuffix} />
								</span>
							</div>
							<div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
								<div
									className={`h-full rounded-full ${
										isUnstaffed ? "bg-red-500" : "bg-brand-orange"
									}`}
									style={{ width: `${percent}%` }}
								/>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
