"use client";

import { LineChart } from "lucide-react";
import dynamic from "next/dynamic";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_KEY_FIGURES_CARD_TITLES } from "../../../../../constants/forecastAnalysis.constants";
import type { AnalysisCumulativePoint } from "../../../../../types/forecastAnalysis.types";

/* Recharts measures the DOM, so the chart must not render on the server. */
const CumulativeProfitChart = dynamic(() => import("./CumulativeProfitChart"), {
	ssr: false,
	loading: () => <div className="h-64 w-full animate-pulse rounded-lg border border-slate-200 bg-slate-50" />,
});

/** Ackumulerat resultat: the curve and the line the frame writes above it. */
export function createKeyFiguresTrendWidget(points: AnalysisCumulativePoint[]): Record<string, WidgetProps> {
	return {
		cumulativeProfit: {
			title: FORECAST_KEY_FIGURES_CARD_TITLES.cumulativeProfit,
			icon: LineChart,
			content: (
				<div className="flex flex-1 flex-col gap-3">
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.forecastKeyFiguresCumulativeSubtitle} />
					</p>
					<CumulativeProfitChart points={points} />
				</div>
			),
		},
	};
}
