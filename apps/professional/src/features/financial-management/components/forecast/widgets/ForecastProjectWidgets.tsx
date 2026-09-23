import { DollarSign, Folder } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_WIDGET_TITLES } from "../../../constants/forecastDashboard.constants";
import type { ForecastDashboardState, ForecastProjectRow } from "../../../types/forecastDashboard.types";
import { formatHours, formatSek, formatSignedHours, formatSignedSek } from "../../../utils/economyFormatters";
import { ForecastProjectStatusTable } from "./ForecastProjectStatusTable";
import {
	FORECAST_ROW,
	FORECAST_ROW_FIGURE,
	ForecastStat,
	ForecastStatList,
	ForecastWidgetBody,
} from "./ForecastWidgetParts";

/** The projects forecast over plan: the hours they run short and what it costs, in red. */
function RiskProjects({ projects }: { projects: ForecastProjectRow[] }) {
	if (projects.length === 0) return null;

	return (
		<div className="space-y-1.5 border-t border-slate-200 pt-3">
			<p className="text-xs font-medium text-slate-500">
				<Translate text={localizationConstants.forecastRiskProjects} />
			</p>
			<ul className="space-y-1">
				{projects.map((project) => (
					<li key={project.projectNo} className={FORECAST_ROW}>
						<span className="font-medium text-slate-900">{project.projectNo}</span>
						<span className={cn(FORECAST_ROW_FIGURE, "text-red-600")}>
							{formatSignedHours(project.hoursVariance)}, {formatSignedSek(project.costOverrun)}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

/** Projekt/Order-prognoser and Projektstatus. */
export function createForecastProjectWidgets(state: ForecastDashboardState): Record<string, WidgetProps> {
	const { totals, projects, riskProjects } = state;

	return {
		projectOrderForecasts: {
			title: FORECAST_WIDGET_TITLES.projectOrderForecasts,
			icon: Folder,
			content: (
				<ForecastWidgetBody>
					<ForecastStatList>
						<ForecastStat label={localizationConstants.forecastPlannedVsForecast}>
							{formatHours(totals.plannedHours)} / {formatHours(totals.forecastHours)}
						</ForecastStat>
						<ForecastStat label={localizationConstants.forecastActualToDate}>
							{formatHours(totals.actualHours)}
						</ForecastStat>
						<ForecastStat label={localizationConstants.forecastCostAndWorkTime}>
							{formatSek(totals.forecastCost)} / {formatHours(totals.forecastHours)}
						</ForecastStat>
					</ForecastStatList>
					<RiskProjects projects={riskProjects} />
				</ForecastWidgetBody>
			),
		},
		projectStatus: {
			title: FORECAST_WIDGET_TITLES.projectStatus,
			icon: DollarSign,
			content: <ForecastProjectStatusTable projects={projects} />,
		},
	};
}
