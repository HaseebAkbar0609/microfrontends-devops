import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	ForecastResultSign,
	ForecastResultView,
	ForecastYearlySortField,
} from "../types/forecastResult.types";

export const FORECAST_RESULT_PAGE_SIZE = 10;

/** The Årlig | Månad pill above the table. */
export const FORECAST_RESULT_VIEWS: { id: ForecastResultView; labelKey: TranslationKeys }[] = [
	{ id: "yearly", labelKey: localizationConstants.forecastResultPeriodYearly },
	{ id: "monthly", labelKey: localizationConstants.forecastPeriodMonth },
];

/** Årlig's columns in the frame's order; every one sorts. */
export const FORECAST_RESULT_YEARLY_COLUMNS: { key: ForecastYearlySortField; labelKey: TranslationKeys; numeric?: boolean }[] = [
	{ key: "objectName", labelKey: localizationConstants.forecastColObject },
	{ key: "revenue", labelKey: localizationConstants.forecastColRevenue, numeric: true },
	{ key: "costs", labelKey: localizationConstants.forecastColCosts, numeric: true },
	{ key: "contribution", labelKey: localizationConstants.forecastColContribution, numeric: true },
	{ key: "startDate", labelKey: localizationConstants.forecastResultColStart },
	{ key: "endDate", labelKey: localizationConstants.forecastColEndDate },
];

/** Månad's twelve column heads, January first — the short month names. */
export const FORECAST_RESULT_MONTH_KEYS: TranslationKeys[] = [
	localizationConstants.monthJan,
	localizationConstants.monthFeb,
	localizationConstants.monthMar,
	localizationConstants.monthApr,
	localizationConstants.monthMay,
	localizationConstants.monthJun,
	localizationConstants.monthJul,
	localizationConstants.monthAug,
	localizationConstants.monthSep,
	localizationConstants.monthOct,
	localizationConstants.monthNov,
	localizationConstants.monthDec,
];

/** Filter: whether a row's result is in the black or the red. */
export const FORECAST_RESULT_SIGN_LABELS: Record<ForecastResultSign, TranslationKeys> = {
	positive: localizationConstants.forecastResultFilterPositive,
	negative: localizationConstants.forecastResultFilterNegative,
};
