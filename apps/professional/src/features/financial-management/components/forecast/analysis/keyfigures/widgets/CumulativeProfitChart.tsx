"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_CUMULATIVE_COLOR } from "../../../../../constants/forecastAnalysis.constants";
import type { AnalysisCumulativePoint } from "../../../../../types/forecastAnalysis.types";
import { formatSek, formatSekCompact } from "../../../../../utils/economyFormatters";
import { AXIS_TICK, CHART_MARGIN, GRID_STROKE, TOOLTIP_STYLE } from "../../../charts/chartStyle";

/* Its own gradient id: two dashboards share this page, and a shared id would bleed. */
const GRADIENT_ID = "forecast-cumulative-fill";

export interface CumulativeProfitChartProps {
	points: AnalysisCumulativePoint[];
}

/**
 * TB-bidrag as it accumulates through the period, over the objects the filters
 * leave. The month names are translated here rather than carried in the data,
 * so the axis follows the language.
 */
export function CumulativeProfitChart({ points }: CumulativeProfitChartProps) {
	const t = useTranslate();

	if (points.length === 0) {
		return (
			<p className="py-6 text-sm text-slate-500">
				<Translate text={localizationConstants.forecastAnalysisTrendEmpty} />
			</p>
		);
	}

	const data = points.map((point) => ({ ...point, label: t(point.monthKey) }));
	const seriesName = t(localizationConstants.forecastKeyFiguresCumulativeSeries);

	return (
		<div
			className="h-64 w-full"
			role="img"
			aria-label={t(localizationConstants.forecastKeyFiguresCumulativeChartLabel)}
		>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={data} margin={CHART_MARGIN}>
					<defs>
						<linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={FORECAST_CUMULATIVE_COLOR} stopOpacity={0.35} />
							<stop offset="100%" stopColor={FORECAST_CUMULATIVE_COLOR} stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} />
					<YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={formatSekCompact} width={80} />
					<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => formatSek(value)} />
					<Area
						type="monotone"
						dataKey="cumulative"
						name={seriesName}
						stroke={FORECAST_CUMULATIVE_COLOR}
						strokeWidth={2}
						fill={`url(#${GRADIENT_ID})`}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

export default CumulativeProfitChart;
