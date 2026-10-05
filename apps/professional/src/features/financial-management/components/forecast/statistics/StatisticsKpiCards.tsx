"use client";

import type { StatisticsKpi } from "../../../types/forecastStatistics.types";
import { SUMMARY_CARD_GRID_SIX } from "../SummaryCardParts";
import { StatisticsKpiCard } from "./StatisticsKpiCard";

export interface StatisticsKpiCardsProps {
	kpis: StatisticsKpi[];
}

/** The six figures the page opens with. */
export function StatisticsKpiCards({ kpis }: StatisticsKpiCardsProps) {
	return (
		<div className={SUMMARY_CARD_GRID_SIX}>
			{kpis.map((kpi) => (
				<StatisticsKpiCard key={kpi.id} kpi={kpi} />
			))}
		</div>
	);
}

export default StatisticsKpiCards;
