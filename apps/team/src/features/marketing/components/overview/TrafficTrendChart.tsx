"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	MARKETING_CHART_COLORS,
	MARKETING_TRAFFIC,
} from "../../constants/marketingAnalytics.mock";

const AXIS_TICK = { fill: "#64748b", fontSize: 12 };

/** Gradient ids are namespaced; the prototype used a document-global `g1`. */
const SERIES = [
	{
		id: "visitors",
		key: "visitors" as const,
		labelKey: localizationConstants.marketingTrafficVisitors,
		color: MARKETING_CHART_COLORS.visitors,
	},
	{
		id: "organic",
		key: "organic" as const,
		labelKey: localizationConstants.marketingTrafficOrganic,
		color: MARKETING_CHART_COLORS.organic,
	},
];

export default function TrafficTrendChart() {
	const t = useTranslate();

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.marketingTrafficTitle} />
					</h2>
					<p className="mt-0.5 text-sm text-slate-500">
						<Translate text={localizationConstants.marketingTrafficSubtitle} />
					</p>
				</div>
				<ul className="flex flex-wrap items-center gap-4">
					{SERIES.map((series) => (
						<li
							key={series.id}
							className="flex items-center gap-2 text-sm text-slate-600"
						>
							<span
								className="size-2.5 rounded-full"
								style={{ backgroundColor: series.color }}
								aria-hidden
							/>
							<Translate text={series.labelKey} />
						</li>
					))}
				</ul>
			</div>

			<div className="mt-4 h-72 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={MARKETING_TRAFFIC}
						margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
					>
						<defs>
							{SERIES.map((series) => (
								<linearGradient
									key={series.id}
									id={`marketing-traffic-${series.id}`}
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop offset="0%" stopColor={series.color} stopOpacity={0.35} />
									<stop offset="100%" stopColor={series.color} stopOpacity={0} />
								</linearGradient>
							))}
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
						<XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_TICK} />
						<YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} />
						<Tooltip
							contentStyle={{
								backgroundColor: "#ffffff",
								border: "1px solid #e2e8f0",
								borderRadius: 12,
								fontSize: 12,
							}}
						/>
						{SERIES.map((series) => (
							<Area
								key={series.id}
								type="monotone"
								dataKey={series.key}
								name={t(series.labelKey)}
								stroke={series.color}
								strokeWidth={2}
								fill={`url(#marketing-traffic-${series.id})`}
							/>
						))}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
}
