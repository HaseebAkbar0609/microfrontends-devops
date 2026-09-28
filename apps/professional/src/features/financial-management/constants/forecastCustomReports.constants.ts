import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { ForecastListSortField } from "../types/forecastList.types";
import type { CustomReportSortField } from "../types/forecastCustomReports.types";
import { ECONOMY_FORECAST_REPORTS_URL } from "./economyNav.config";

/**
 * Where the register is kept. A saved report is a name, a list of column keys
 * and a date — no personal or financial data — so it may live in the browser
 * (AGENTS.md rule 6), and a report builder whose output died on reload would
 * not be one. `_v1` marks the stored shape; bump it if that shape changes.
 */
export const STORAGE_KEY_CUSTOM_REPORTS = "tfs_economy_forecast_custom_reports_v1";

export const CUSTOM_REPORTS_PAGE_SIZE = 10;

export const CUSTOM_REPORT_NAME_MAX_LENGTH = 60;

export const CUSTOM_REPORT_FILE_EXTENSION = ".xlsx";

/** The register is a list of saved views, not a filing cabinet; this is its ceiling. */
export const CUSTOM_REPORT_MAX_COUNT = 200;

/** The frame opens the builder with Objekt alone ticked. */
export const DEFAULT_CUSTOM_REPORT_COLUMNS: readonly ForecastListSortField[] = ["objectNo"];

/** The register's columns in the frame's order; every one sorts. */
export const CUSTOM_REPORT_COLUMNS: { key: CustomReportSortField; labelKey: TranslationKeys }[] = [
	{ key: "reportNo", labelKey: localizationConstants.forecastReportsColId },
	{ key: "name", labelKey: localizationConstants.forecastCustomReportsColName },
	{ key: "fileName", labelKey: localizationConstants.forecastReportsColFile },
	{ key: "date", labelKey: localizationConstants.forecastReportsColDate },
];

/**
 * Where the register and its builder live.
 *
 * `list` carries `?tab=custom` deliberately: `SectionTabs` keeps the first tab
 * out of the URL, so a bare push would land the reader back on Rapporterlista.
 */
export function customReportRoutes(basePath: string = ECONOMY_FORECAST_REPORTS_URL) {
	return {
		list: `${basePath}?tab=custom`,
		create: `${basePath}/custom/new`,
	};
}
