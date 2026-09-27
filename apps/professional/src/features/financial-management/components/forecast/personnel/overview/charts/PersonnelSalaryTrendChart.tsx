"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PERSONNEL_TREND_COLOR } from "../../../../../constants/forecastPersonnel.constants";
import type { PersonnelTrendPoint } from "../../../../../types/forecastPersonnel.types";
import { formatSek, formatSekCompact } from "../../../../../utils/economyFormatters";
import { AXIS_TICK, CHART_MARGIN, GRID_STROKE, TOOLTIP_STYLE } from "../../../charts/chartStyle";

export interface PersonnelSalaryTrendChartProps {
	points: PersonnelTrendPoint[];
}

/**
 * What the payroll cost month by month, over the months the selection leaves.
 * The month names are translated here rather than carried in the data, so the
 * axis follows the language.
 */
export function PersonnelSalaryTrendChart({ points }: PersonnelSalaryTrendChartProps) {
	const t = useTranslate();

	if (points.length === 0) {
		return (
			<p className="py-6 text-sm text-slate-500">
				<Translate text={localizationConstants.forecastPersonnelEmpty} />
			</p>
		);
	}

	const data = points.map((point) => ({ ...point, label: t(point.monthKey) }));

	return (
		/* Recharts draws no text a screen reader can follow, so the figure names itself. */
		<div className="h-64 w-full" role="img" aria-label={t(localizationConstants.forecastPersonnelTrendChartLabel)}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data} margin={CHART_MARGIN}>
					<CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} />
					<YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={formatSekCompact} width={80} />
					<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => formatSek(value)} />
					<Line
						type="monotone"
						dataKey="cost"
						name={t(localizationConstants.forecastPersonnelTrendTitle)}
						stroke={PERSONNEL_TREND_COLOR}
						strokeWidth={2}
						dot={{ r: 3 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default PersonnelSalaryTrendChart;
