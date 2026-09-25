"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RISK_LEVEL_META } from "../../../../constants/forecastRisk.constants";
import type { RiskDistributionSlice } from "../../../../types/forecastRisk.types";

export interface RiskStatusDonutProps {
	slices: RiskDistributionSlice[];
}

/**
 * How the clients divide between the three levels. The ring carries no text a
 * screen reader can follow, so the figure names itself and the legend beside
 * it spells out every count.
 */
export function RiskStatusDonut({ slices }: RiskStatusDonutProps) {
	const t = useTranslate();
	const shown = slices.filter((slice) => slice.count > 0);

	if (shown.length === 0) {
		return (
			<p className="py-4 text-xs text-slate-500">
				<Translate text={localizationConstants.forecastRiskListEmpty} />
			</p>
		);
	}

	return (
		<div className="flex items-center gap-4">
			<ul className="flex min-w-0 flex-1 flex-col gap-1.5">
				{slices.map((slice) => (
					<li key={slice.level} className="flex items-center gap-2 text-xs text-slate-600">
						<span
							className="size-2.5 shrink-0 rounded-full"
							style={{ backgroundColor: RISK_LEVEL_META[slice.level].color }}
							aria-hidden
						/>
						<span className="truncate">
							{t(localizationConstants.forecastRiskDistributionRow, {
								count: slice.count,
								level: t(RISK_LEVEL_META[slice.level].labelKey),
							})}
						</span>
					</li>
				))}
			</ul>

			<div
				className="h-20 w-20 shrink-0"
				role="img"
				aria-label={t(localizationConstants.forecastRiskDistributionChartLabel)}
			>
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={shown}
							dataKey="count"
							nameKey="level"
							innerRadius="62%"
							outerRadius="100%"
							paddingAngle={2}
							stroke="none"
							isAnimationActive={false}
						>
							{shown.map((slice) => (
								<Cell key={slice.level} fill={RISK_LEVEL_META[slice.level].color} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default RiskStatusDonut;
