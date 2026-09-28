import type { CustomReport } from "../types/forecastCustomReports.types";

/**
 * The reports already built, until a reports API exists. The names are the
 * frame's own — they are text a reader typed, not UI chrome, so they stay out
 * of the translation files.
 *
 * Each carries a different set of columns, so the register shows at a glance
 * that a report is a view rather than a document.
 */
export const INITIAL_CUSTOM_REPORTS: CustomReport[] = [
	{
		id: "crep-0101",
		reportNo: "0101",
		name: "VD-rapport",
		columns: ["objectNo", "customer", "projectName", "revenue", "costs", "contribution", "status"],
		date: "2026-04-11",
	},
	{
		id: "crep-0102",
		reportNo: "0102",
		name: "Ekonomi rapport",
		columns: ["objectNo", "customer", "costCentre", "revenue", "costs", "contribution"],
		date: "2026-05-06",
	},
	{
		id: "crep-0103",
		reportNo: "0103",
		name: "Service avdelning rapport",
		columns: ["objectNo", "customer", "category", "responsible", "startDate", "endDate", "status"],
		date: "2026-06-19",
	},
	{
		id: "crep-0104",
		reportNo: "0104",
		name: "Entreprenad rapport",
		columns: ["objectNo", "projectName", "category", "customerType", "startDate", "endDate"],
		date: "2026-07-14",
	},
];
