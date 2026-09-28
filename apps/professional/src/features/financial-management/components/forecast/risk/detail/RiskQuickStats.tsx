"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { RiskClientTotals } from "../../../../types/forecastRisk.types";
import { formatSek } from "../../../../utils/economyFormatters";

export interface RiskQuickStatsProps {
	totals: RiskClientTotals;
}

/** The two figures the frame keeps under the dial. */
export function RiskQuickStats({ totals }: RiskQuickStatsProps) {
	return (
		<section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
				<Translate text={localizationConstants.forecastRiskQuickStats} />
			</h3>

			<div className="flex flex-col gap-1">
				<span className="text-sm text-slate-600">
					<Translate text={localizationConstants.forecastRiskTotalProjects} />
				</span>
				<p className="text-xl font-bold text-slate-900 tabular-nums">{totals.activeObjects}</p>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-sm text-slate-600">
					<Translate text={localizationConstants.forecastRiskTotalSpending} />
				</span>
				<p className="text-xl font-bold text-slate-900 tabular-nums">{formatSek(totals.spentToDate)}</p>
			</div>
		</section>
	);
}

export default RiskQuickStats;
