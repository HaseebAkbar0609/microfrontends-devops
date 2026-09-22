import { AlertTriangle, Info, OctagonAlert, type LucideIcon } from "lucide-react";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	ForecastPeriod,
	ForecastProjectStatus,
	ForecastWarningTone,
} from "../types/forecastDashboard.types";

export const FORECAST_DASHBOARD_STORAGE_KEY = "tfs_professional_forecast_dashboard_layout_v1";

/** Half and full width of the Prognos grid; a half card fills the row below md. */
export const FORECAST_HALF_SPAN = "col-span-12 md:col-span-6";
export const FORECAST_FULL_SPAN = "col-span-12";

/** Utilisation above this, in percent, is overload and reads red. */
export const FORECAST_OVERLOAD_THRESHOLD_PERCENT = 100;

export const FORECAST_WIDGET_TITLES = {
	kpiOverview: localizationConstants.forecastWidgetKpiTitle,
	projectOrderForecasts: localizationConstants.forecastWidgetProjectOrderTitle,
	actionsWarnings: localizationConstants.forecastWidgetActionsTitle,
	occupancy: localizationConstants.forecastWidgetOccupancyTitle,
	availableHours: localizationConstants.forecastWidgetAvailableHoursTitle,
	projectStatus: localizationConstants.projWidgetStatusTitle,
} as const satisfies Record<string, TranslationKeys>;

export type ForecastWidgetId = keyof typeof FORECAST_WIDGET_TITLES;

/** Each warning's icon and colours; the icon's shape tells the tones apart without colour. */
export const FORECAST_WARNING_TONES: Record<ForecastWarningTone, { icon: LucideIcon; iconClass: string; countClass: string }> = {
	critical: { icon: OctagonAlert, iconClass: "text-red-600", countClass: "bg-red-100 text-red-700" },
	warning: { icon: AlertTriangle, iconClass: "text-amber-600", countClass: "bg-amber-100 text-amber-800" },
	info: { icon: Info, iconClass: "text-blue-600", countClass: "bg-blue-100 text-blue-700" },
};

export const FORECAST_PROJECT_STATUSES: Record<ForecastProjectStatus, { labelKey: TranslationKeys; className: string }> = {
	risk: { labelKey: localizationConstants.projWidgetStatusAtRisk, className: "bg-red-100 text-red-700" },
	onTrack: { labelKey: localizationConstants.forecastStatusOnTrack, className: "bg-emerald-100 text-emerald-700" },
};

export const FORECAST_PERIODS: { id: ForecastPeriod; labelKey: TranslationKeys }[] = [
	{ id: "week", labelKey: localizationConstants.forecastPeriodWeek },
	{ id: "month", labelKey: localizationConstants.forecastPeriodMonth },
];
