import { DollarSign } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";

import { FORECAST_WIDGET_TITLES } from "../../../constants/forecastDashboard.constants";
import type { ForecastDashboardState } from "../../../types/forecastDashboard.types";

/**
 * Åtgärder & varningar: what stands in the way of the forecast, each with its
 * count. The list runs in two columns once the card is wide enough — the
 * full-width row it is drawn in — and in one in a half-width slot.
 */
export function createForecastActionsWidget(_state: ForecastDashboardState): Record<string, WidgetProps> {
	return {
		actionsWarnings: {
			title: FORECAST_WIDGET_TITLES.actionsWarnings,
			icon: DollarSign,
		},
	};
}
