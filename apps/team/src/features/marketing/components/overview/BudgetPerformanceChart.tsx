"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { MARKETING_CHART_COLORS } from "../../constants/marketingAnalytics.mock";
import type { BudgetLine } from "../../utils/marketingMetrics";

const AXIS_TICK = { fill: "#64748b", fontSize: 12 };

/**
 * Budget against actual, per budget line. The data is the `budget` register
 * itself, so editing a row moves the bars.
 */
export default function BudgetPerformanceChart({
	lines,
}: {
	lines: BudgetLine[];
}) {
	const t = useTranslate();

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.marketingBudgetChartTitle} />
			</h2>
			<p className="mt-0.5 text-sm text-slate-500">
				<Translate text={localizationConstants.marketingBudgetChartSubtitle} />
			</p>

			{lines.length === 0 ? (
				<p className="mt-6 text-sm text-slate-500">
					<Translate text={localizationConstants.marketingOverviewEmptyBudget} />
				</p>
			) : (
				<div className="mt-4 h-72 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={lines}
							margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
							<XAxis
								dataKey="label"
								tickLine={false}
								axisLine={false}
								tick={AXIS_TICK}
								interval={0}
								height={48}
								angle={-15}
								textAnchor="end"
							/>
							<YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} />
							<Tooltip
								cursor={{ fill: "#f1f5f9" }}
								contentStyle={{
									backgroundColor: "#ffffff",
									border: "1px solid #e2e8f0",
									borderRadius: 12,
									fontSize: 12,
								}}
							/>
							<Legend wrapperStyle={{ fontSize: 12 }} />
							<Bar
								dataKey="budget"
								name={t(localizationConstants.marketingBudgetSeriesBudget)}
								fill={MARKETING_CHART_COLORS.budget}
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="actual"
								name={t(localizationConstants.marketingBudgetSeriesActual)}
								fill={MARKETING_CHART_COLORS.actual}
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
		</section>
	);
}
