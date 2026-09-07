"use client";

import { Inbox, Clock, ShieldAlert, Users } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SupportStatCard } from "./SupportStatCard";

type SupportStatCardsProps = {
	newTodayCount: number;
	openCount: number;
	escalatedCount: number;
	onlineAgentCount: number;
	agentCount: number;
	agentCountryCount: number;
};

/**
 * The dashboard KPI row. Every figure comes from the ticket store — the
 * prototype hardcoded these four as string literals, so they disagreed with the
 * table underneath.
 */
export function SupportStatCards({
	newTodayCount,
	openCount,
	escalatedCount,
	onlineAgentCount,
	agentCount,
	agentCountryCount,
}: SupportStatCardsProps) {
	return (
		<div className="grid grid-cols-1 gap-2.5 @2xl:grid-cols-2 @5xl:grid-cols-4">
			<SupportStatCard
				labelKey={localizationConstants.supportStatNewToday}
				value={newTodayCount}
				icon={Inbox}
			/>
			<SupportStatCard
				labelKey={localizationConstants.supportStatOpen}
				value={openCount}
				icon={Clock}
			/>
			<SupportStatCard
				labelKey={localizationConstants.supportStatEscalated}
				value={escalatedCount}
				icon={ShieldAlert}
				valueClassName={escalatedCount > 0 ? "text-red-600" : undefined}
			/>
			<SupportStatCard
				labelKey={localizationConstants.supportStatAgentsOnline}
				value={`${onlineAgentCount} / ${agentCount}`}
				icon={Users}
				hint={
					<>
						{agentCountryCount}{" "}
						<Translate
							text={localizationConstants.supportStatCountriesSuffix}
						/>
					</>
				}
			/>
		</div>
	);
}
