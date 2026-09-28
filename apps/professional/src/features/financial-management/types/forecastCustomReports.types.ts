import type { ForecastListSortField } from "./forecastList.types";

/**
 * A report a reader built for themselves: which Prognoslista columns it
 * carries, under a name of their own.
 *
 * It holds no file. The sheet is written from the live list when asked for,
 * so a saved report never goes stale — see `customReportWorkbook`.
 */
export interface CustomReport {
	id: string;
	/** The register's own number, as the frame's ID column shows it. */
	reportNo: string;
	/** Benämning: the name the dialog asks for. */
	name: string;
	/**
	 * The columns the report carries, always in `FORECAST_LIST_COLUMNS` order
	 * rather than the order they were ticked in.
	 */
	columns: ForecastListSortField[];
	/** ISO date, YYYY-MM-DD, the day it was saved. */
	date: string;
}

/** What the name dialog hands the register. */
export interface CustomReportInput {
	name: string;
	columns: ForecastListSortField[];
}

export type CustomReportSortField = "reportNo" | "name" | "fileName" | "date";
