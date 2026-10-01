import localizationConstants from "@/utils/translation/constants";
import { FORECAST_LIST_COLUMNS } from "../constants/forecastList.constants";
import type { CustomReport } from "../types/forecastCustomReports.types";
import type { ForecastListRow, ForecastListSortField } from "../types/forecastList.types";
import { downloadWorkbook, type Cell } from "./economyWorkbook";
import { customReportFileName } from "./forecastCustomReports";
import { forecastFieldValue, type ForecastLabel } from "./forecastList";

const COLUMN_LABELS = new Map(FORECAST_LIST_COLUMNS.map((column) => [column.key, column.labelKey]));

/**
 * The sheet's rows: the chosen columns' headings, then the forecasts under
 * them.
 *
 * Amounts go in as numbers rather than through `formatForecastField`, which
 * would hand Excel "5 860" as text — readable, but impossible to sum. The
 * headings are translated, so a sheet reads in whatever language it was asked
 * for.
 */
export function buildCustomReportRows(
	rows: readonly ForecastListRow[],
	columns: readonly ForecastListSortField[],
	label: ForecastLabel,
): Cell[][] {
	const headings = columns.map((field) => {
		const labelKey = COLUMN_LABELS.get(field);
		return labelKey ? label(labelKey) : field;
	});

	return [headings, ...rows.map((row) => columns.map((field) => forecastFieldValue(row, field, label)))];
}

/** Writes the report as a spreadsheet and hands it to the browser. */
export function downloadCustomReport(
	report: CustomReport,
	rows: readonly ForecastListRow[],
	label: ForecastLabel,
): boolean {
	return downloadWorkbook(
		buildCustomReportRows(rows, report.columns, label),
		label(localizationConstants.forecastCustomReportsSheetName),
		customReportFileName(report),
	);
}
