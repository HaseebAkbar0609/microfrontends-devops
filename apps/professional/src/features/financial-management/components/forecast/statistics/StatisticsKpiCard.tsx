"use client";

import { OctagonAlert, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_STATISTICS_PROFIT_COLOR } from "../../../constants/forecastStatistics.constants";
import type { StatisticsKpi } from "../../../types/forecastStatistics.types";
import { formatNumber, formatPercent, formatSekCompact } from "../../../utils/economyFormatters";
import { TONE_CLASS, changeTone } from "../analysis/widgets/AnalysisCardParts";
import { Sparkline } from "../charts/Sparkline";
import { SUMMARY_CARD, SUMMARY_CAPTION, SUMMARY_VALUE } from "../SummaryCardParts";

/** The figures a rise is bad news for. */
const UP_IS_BAD = new Set(["operatingCost", "riskExposure"]);

function writeValue(kpi: StatisticsKpi): string {
	if (kpi.format === "percent") return formatPercent(kpi.value, 1);
	if (kpi.format === "count") return formatNumber(kpi.value);
	/* Compact, because six cards share a row and "4 200 000 SEK" does not fit. */
	return formatSekCompact(kpi.value);
}

/** The change, written short, with the typographic minus the hours use. */
function writeChange(kpi: StatisticsKpi): string {
	const sign = kpi.change > 0 ? "+" : kpi.change < 0 ? "−" : "";
	const size = Math.abs(kpi.change);
	if (kpi.format === "percent") return `${sign}${formatPercent(size, 1)}`;
	if (kpi.format === "count") return `${sign}${formatNumber(size)}`;
	return `${sign}${formatSekCompact(size)}`;
}

export interface StatisticsKpiCardProps {
	kpi: StatisticsKpi;
}

/** One of the six figures: what it is, what it stands at, and how it moved. */
export function StatisticsKpiCard({ kpi }: StatisticsKpiCardProps) {
	const t = useTranslate();
	const tone = changeTone(kpi.change, !UP_IS_BAD.has(kpi.id));
	const Arrow = kpi.change < 0 ? TrendingDown : TrendingUp;

	return (
		<div className={SUMMARY_CARD}>
			<p className="text-sm font-medium text-slate-600">
				<Translate text={kpi.labelKey} />
			</p>

			<p className={cn(SUMMARY_VALUE, "flex items-center gap-2 text-slate-900")}>
				{writeValue(kpi)}
				{kpi.isWarning && (
					<>
						{/* The shape carries the warning, not the colour alone. */}
						<OctagonAlert className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
						<span className="sr-only">
							{t(localizationConstants.forecastStatisticsKpiWarning)}
						</span>
					</>
				)}
			</p>

			{/* A figure that has not moved gets no arrow and no colour. */}
			<p
				className={cn(
					"flex items-center gap-1.5 text-xs font-medium",
					kpi.change === 0 ? SUMMARY_CAPTION : TONE_CLASS[tone],
				)}
			>
				{kpi.change !== 0 && <Arrow className="h-3.5 w-3.5 shrink-0" aria-hidden />}
				{t(localizationConstants.forecastStatisticsNoteChange, { value: writeChange(kpi) })}
			</p>

			<Sparkline values={kpi.trend} color={FORECAST_STATISTICS_PROFIT_COLOR} className="mt-1" />
		</div>
	);
}

export default StatisticsKpiCard;
