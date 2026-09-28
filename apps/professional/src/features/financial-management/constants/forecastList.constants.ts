import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type {
	ForecastCategory,
	ForecastCustomerType,
	ForecastListSortField,
	ForecastListStatus,
} from "../types/forecastList.types";

export const FORECAST_LIST_PAGE_SIZE = 10;

/** The eye and ⋮ stay in view while the table scrolls sideways, set off by a rule. */
export const FORECAST_ACTION_COLUMN = "sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0]";

/** One cell of a forecast row, in Prognoslista and in a custom report alike. */
export const FORECAST_CELL_CLASS = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";

/** Fields that read as figures, and line up on the digit. */
export const FORECAST_NUMERIC_FIELDS = new Set<ForecastListSortField>([
	"startDate",
	"endDate",
	"revenue",
	"costs",
	"contribution",
]);

/** Prognoslista's columns in the frame's order; every one sorts. */
export const FORECAST_LIST_COLUMNS: { key: ForecastListSortField; labelKey: TranslationKeys }[] = [
	{ key: "objectNo", labelKey: localizationConstants.forecastColObject },
	{ key: "customer", labelKey: localizationConstants.forecastColCustomer },
	{ key: "category", labelKey: localizationConstants.forecastColCategory },
	{ key: "customerType", labelKey: localizationConstants.forecastColType },
	{ key: "projectName", labelKey: localizationConstants.forecastColProjectName },
	{ key: "startDate", labelKey: localizationConstants.forecastColStartDate },
	{ key: "endDate", labelKey: localizationConstants.forecastColEndDate },
	{ key: "costCentre", labelKey: localizationConstants.forecastColCostCentre },
	{ key: "responsible", labelKey: localizationConstants.forecastColResponsible },
	{ key: "revenue", labelKey: localizationConstants.forecastColRevenue },
	{ key: "costs", labelKey: localizationConstants.forecastColCosts },
	{ key: "contribution", labelKey: localizationConstants.forecastColContribution },
	{ key: "status", labelKey: localizationConstants.status },
];

export const FORECAST_CATEGORY_LABELS: Record<ForecastCategory, TranslationKeys> = {
	newBuild: localizationConstants.forecastCategoryNewBuild,
	service: localizationConstants.forecastCategoryService,
	contracting: localizationConstants.forecastCategoryContracting,
};

export const FORECAST_CUSTOMER_TYPE_LABELS: Record<ForecastCustomerType, TranslationKeys> = {
	b2b: localizationConstants.forecastTypeB2b,
	private: localizationConstants.forecastTypePrivate,
};

/** Each status's label and tag colours; Klar is the frame's orange tag. */
export const FORECAST_LIST_STATUSES: Record<ForecastListStatus, { labelKey: TranslationKeys; className: string }> = {
	done: { labelKey: localizationConstants.forecastStatusDone, className: "bg-orange-500 text-white" },
};
