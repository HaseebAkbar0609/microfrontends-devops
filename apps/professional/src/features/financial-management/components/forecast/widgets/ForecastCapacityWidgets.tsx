import { Coins, Folder, Scan } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import { FORECAST_WIDGET_TITLES } from "../../../constants/forecastDashboard.constants";
import type { ForecastDashboardState } from "../../../types/forecastDashboard.types";

/** Each unit's utilisation as a bar; overload reads red and its bar stops at the end of the track. */

/** KPI-Prognos-Översikt, Beläggning kommande 6 veckor and Tillgängliga timmar. */
export function createForecastCapacityWidgets(_state: ForecastDashboardState): Record<string, WidgetProps> {

	return {
		kpiOverview: {
			title: FORECAST_WIDGET_TITLES.kpiOverview,
			icon: Folder,
		},
		occupancy: {
			title: FORECAST_WIDGET_TITLES.occupancy,
			icon: Coins,
		},
		availableHours: {
			title: FORECAST_WIDGET_TITLES.availableHours,
			icon: Scan,
		},
	};
}
