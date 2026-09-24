import { Coins, Folder, Scan } from "lucide-react";

import { WidgetBarRow } from "@/features/widgetdashboard/components/WidgetContent";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import { FORECAST_WIDGET_TITLES } from "../../../constants/forecastDashboard.constants";
import type { ForecastDashboardState, ForecastOccupancy } from "../../../types/forecastDashboard.types";
import { formatHours, formatPercent } from "../../../utils/economyFormatters";
import { isOverloaded } from "../../../utils/forecastDashboard";
import { ForecastAvailableHoursContent } from "./ForecastAvailableHoursContent";
import { ForecastFigure, ForecastStat, ForecastStatList, ForecastWidgetBody } from "./ForecastWidgetParts";

/** Each unit's utilisation as a bar; overload reads red and its bar stops at the end of the track. */
function OccupancyBars({ rows }: { rows: ForecastOccupancy[] }) {
	return (
		<ForecastWidgetBody className="gap-3">
			{rows.map((row) => {
				const over = isOverloaded(row.percent);
				return (
					<WidgetBarRow
						key={row.id}
						label={row.labelKey}
						percent={Math.min(row.percent, 100)}
						value={<ForecastFigure alert={over}>{formatPercent(row.percent, 0)}</ForecastFigure>}
						color={over ? "bg-red-500" : "bg-slate-700"}
					/>
				);
			})}
		</ForecastWidgetBody>
	);
}

/** KPI-Prognos-Översikt, Beläggning kommande 6 veckor and Tillgängliga timmar. */
export function createForecastCapacityWidgets(state: ForecastDashboardState): Record<string, WidgetProps> {
	const { companyOccupancy, departments, load, weeks, months } = state;

	return {
		kpiOverview: {
			title: FORECAST_WIDGET_TITLES.kpiOverview,
			icon: Folder,
			content: (
				<ForecastWidgetBody>
					<ForecastStatList>
						<ForecastStat label={localizationConstants.forecastKpiCompanyOccupancy}>
							<ForecastFigure alert={isOverloaded(companyOccupancy)}>
								{formatPercent(companyOccupancy, 0)}
							</ForecastFigure>
						</ForecastStat>
						<ForecastStat label={localizationConstants.forecastKpiAvailableHours}>
							{formatHours(load.availableHours)}
						</ForecastStat>
						<ForecastStat label={localizationConstants.forecastKpiOverUnderLoad}>
							<ForecastFigure alert={load.overloadHours > 0}>{formatHours(load.overloadHours)}</ForecastFigure>
							{" / "}
							{formatHours(load.freeHours)}
						</ForecastStat>
					</ForecastStatList>
				</ForecastWidgetBody>
			),
		},
		occupancy: {
			title: FORECAST_WIDGET_TITLES.occupancy,
			icon: Coins,
			content: (
				<OccupancyBars
					rows={[
						{ id: "company", labelKey: localizationConstants.company, percent: companyOccupancy },
						...departments,
					]}
				/>
			),
		},
		availableHours: {
			title: FORECAST_WIDGET_TITLES.availableHours,
			icon: Scan,
			content: <ForecastAvailableHoursContent weeks={weeks} months={months} />,
		},
	};
}
