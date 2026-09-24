import { DollarSign, Folder } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import { FORECAST_WIDGET_TITLES } from "../../../constants/forecastDashboard.constants";
import type { ForecastDashboardState } from "../../../types/forecastDashboard.types";

/** The projects forecast over plan: the hours they run short and what it costs, in red. */

/** Projekt/Order-prognoser and Projektstatus. */
export function createForecastProjectWidgets(_state: ForecastDashboardState): Record<string, WidgetProps> {

	return {
		projectOrderForecasts: {
			title: FORECAST_WIDGET_TITLES.projectOrderForecasts,
			icon: Folder,
		},
		projectStatus: {
			title: FORECAST_WIDGET_TITLES.projectStatus,
			icon: DollarSign,
		},
	};
}
