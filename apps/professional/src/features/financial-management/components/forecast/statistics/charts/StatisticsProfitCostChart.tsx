"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_STATISTICS_SERIES } from "../../../../constants/forecastStatistics.constants";
import type { StatisticsChartPoint } from "../../../../types/forecastStatistics.types";
import { formatSek, formatSekCompact } from "../../../../utils/economyFormatters";
import { AXIS_TICK, CHART_MARGIN, GRID_STROKE, TOOLTIP_STYLE } from "../../charts/chartStyle";

/* Namespaced per series: a document-global gradient id bleeds between charts. */
const gradientId = (seriesId: string) => `forecast-statistics-${seriesId}`;

export interface StatisticsProfitCostChartProps {
	points: StatisticsChartPoint[];
}

/**
 * Profit and operating cost as they accumulate through the period.
 *
 * Both series are running totals, which is what the title's "cumulative"
 * means, and both are positive so the two fills sit above the axis. Neither
 * carries a `stackId`: they are two quantities being compared, not parts of
 * one total.
 *
 * The legend sits outside the `role="img"` wrapper, because that role hides
 * its contents from a screen reader.
 */
export function StatisticsProfitCostChart({ points }: StatisticsProfitCostChartProps) {
	const t = useTranslate();

	if (points.length === 0) {
		return (
			<p className="py-6 text-sm text-slate-500">
				<Translate text={localizationConstants.forecastStatisticsProfitEmpty} />
			</p>
		);
	}

	const data = points.map((point) => ({ ...point, label: t(point.monthKey) }));

	return (
		<div className="flex flex-col gap-3">
			<ul className="flex flex-wrap items-center gap-4">
				{FORECAST_STATISTICS_SERIES.map((series) => (
					<li key={series.id} className="flex items-center gap-1.5 text-xs text-slate-600">
						<span className="size-2.5 rounded-full" style={{ backgroundColor: series.color }} aria-hidden />
						<Translate text={series.labelKey} />
					</li>
				))}
			</ul>

			<div
				className="h-64 w-full"
				role="img"
				aria-label={t(localizationConstants.forecastStatisticsProfitChartLabel)}
			>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={data} margin={CHART_MARGIN}>
						<defs>
							{FORECAST_STATISTICS_SERIES.map((series) => (
								<linearGradient key={series.id} id={gradientId(series.id)} x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor={series.color} stopOpacity={0.35} />
									<stop offset="100%" stopColor={series.color} stopOpacity={0} />
								</linearGradient>
							))}
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
						<XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} />
						<YAxis
							tickLine={false}
							axisLine={false}
							tick={AXIS_TICK}
							tickFormatter={formatSekCompact}
							width={80}
						/>
						<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => formatSek(value)} />
						{FORECAST_STATISTICS_SERIES.map((series) => (
							<Area
								key={series.id}
								type="monotone"
								dataKey={series.id}
								name={t(series.labelKey)}
								stroke={series.color}
								strokeWidth={2}
								fill={`url(#${gradientId(series.id)})`}
							/>
						))}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default StatisticsProfitCostChart;
