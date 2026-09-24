"use client";

import { TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_ANALYSIS_CARD_TITLES } from "../../../../constants/forecastAnalysis.constants";
import type { AnalysisTrendPoint } from "../../../../types/forecastAnalysis.types";
import { formatSekCompact } from "../../../../utils/economyFormatters";

/* Recharts measures the DOM, so the chart must not render on the server. */
const ForecastTrendsChart = dynamic(() => import("./ForecastTrendsChart"), {
	ssr: false,
	loading: () => <div className="h-64 w-full animate-pulse rounded-lg border border-slate-200 bg-slate-50" />,
});

/** The frame's notes under the chart: where the forecast began, where it turned, where it stands. */
function TrendNotes({ points }: { points: AnalysisTrendPoint[] }) {
	const t = useTranslate();
	if (points.length === 0) return null;

	const last = points[points.length - 1];
	const earlier = [points[0], points[Math.floor((points.length - 1) / 2)]].filter(
		(point, index, all) => point !== last && all.indexOf(point) === index,
	);

	return (
		<ul className="space-y-1 text-sm text-slate-600">
			{earlier.map((point) => (
				<li key={point.monthKey} className="flex items-center gap-2">
					<span className="size-2 rounded-full bg-slate-400" aria-hidden />
					{t(localizationConstants.forecastAnalysisTrendNote, {
						month: t(point.monthKey),
						value: formatSekCompact(point.forecast),
					})}
				</li>
			))}
			<li className="flex items-center gap-2 font-medium text-slate-900">
				<span className="size-2 rounded-full bg-orange-500" aria-hidden />
				{t(localizationConstants.forecastAnalysisTrendCurrent, { value: formatSekCompact(last.forecast) })}
			</li>
		</ul>
	);
}

/** Prognostrend: the subtitle the frame writes, the chart, and its notes. */
export function createAnalysisTrendWidget(points: AnalysisTrendPoint[]): Record<string, WidgetProps> {
	return {
		forecastTrends: {
			title: FORECAST_ANALYSIS_CARD_TITLES.forecastTrends,
			icon: TrendingUp,
			content: (
				<div className="flex flex-1 flex-col gap-3">
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.forecastAnalysisTrendSubtitle} />
					</p>
					<ForecastTrendsChart points={points} />
					<TrendNotes points={points} />
				</div>
			),
		},
	};
}
