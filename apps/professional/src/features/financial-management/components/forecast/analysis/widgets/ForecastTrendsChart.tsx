"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_ANALYSIS_TREND_SERIES } from "../../../../constants/forecastAnalysis.constants";
import type { AnalysisTrendPoint } from "../../../../types/forecastAnalysis.types";
import { formatSek, formatSekCompact } from "../../../../utils/economyFormatters";

/** The house axis tick, as the team app's charts set it. */
const AXIS_TICK = { fill: "#64748b", fontSize: 12 };
const TOOLTIP_STYLE = { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 };

export interface ForecastTrendsChartProps {
	points: AnalysisTrendPoint[];
}

/**
 * Budget, utfall and prognos month by month, over the objects the filters
 * leave. The month names are translated here rather than carried in the data,
 * so the axis follows the language; the amounts read in millions, since raw
 * kronor on an axis are unreadable.
 */
export function ForecastTrendsChart({ points }: ForecastTrendsChartProps) {
	const t = useTranslate();

	if (points.length === 0) {
		return (
			<p className="py-6 text-sm text-slate-500">
				<Translate text={localizationConstants.forecastAnalysisTrendEmpty} />
			</p>
		);
	}

	const data = points.map((point) => ({ ...point, label: t(point.monthKey) }));

	return (
		<div className="flex flex-col gap-3">
			<ul className="flex flex-wrap items-center gap-4">
				{FORECAST_ANALYSIS_TREND_SERIES.map((series) => (
					<li key={series.id} className="flex items-center gap-1.5 text-xs text-slate-600">
						<span className="size-2.5 rounded-full" style={{ backgroundColor: series.color }} aria-hidden />
						<Translate text={series.labelKey} />
					</li>
				))}
			</ul>

			{/* Recharts draws no text a screen reader can follow, so the figure names itself. */}
			<div className="h-64 w-full" role="img" aria-label={t(localizationConstants.forecastAnalysisTrendChartLabel)}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
						<XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} />
						<YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={formatSekCompact} width={80} />
						<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => formatSek(value)} />
						{FORECAST_ANALYSIS_TREND_SERIES.map((series) => (
							<Line
								key={series.id}
								type="monotone"
								dataKey={series.key}
								name={t(series.labelKey)}
								stroke={series.color}
								strokeWidth={2}
								dot={{ r: 3 }}
							/>
						))}
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ForecastTrendsChart;
