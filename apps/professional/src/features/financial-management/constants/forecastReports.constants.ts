import type { RecordFileRules } from "@/features/project/shared/recordFiles";
import { acceptAttribute } from "@/features/project/shared/recordFiles";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { ReportCategory, ReportSortField } from "../types/forecastReports.types";

export const REPORTS_PAGE_SIZE = 10;

/** The register's columns in the frame's order; every one sorts. */
export const REPORT_COLUMNS: { key: ReportSortField; labelKey: TranslationKeys }[] = [
	{ key: "reportNo", labelKey: localizationConstants.forecastReportsColId },
	{ key: "category", labelKey: localizationConstants.forecastReportsColCategory },
	{ key: "fileName", labelKey: localizationConstants.forecastReportsColFile },
	{ key: "date", labelKey: localizationConstants.forecastReportsColDate },
];

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, TranslationKeys> = {
	result: localizationConstants.forecastReportsCategoryResult,
	liquidity: localizationConstants.forecastReportsCategoryLiquidity,
	risk: localizationConstants.forecastReportsCategoryRisk,
	personnel: localizationConstants.forecastReportsCategoryPersonnel,
	other: localizationConstants.forecastReportsCategoryOther,
};

/** The categories in the order the Filter menu and the dialog list them. */
export const REPORT_CATEGORIES: ReportCategory[] = ["result", "liquidity", "risk", "personnel", "other"];

/**
 * What a report may be. The extensions decide both what the picker accepts and
 * what content type the stored file is served as, so a renamed file never opens
 * as something else.
 */
export const REPORT_FILE_RULES: RecordFileRules = {
	types: {
		".pdf": "application/pdf",
		".doc": "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".xls": "application/vnd.ms-excel",
		".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	},
	maxBytes: 10 * 1024 * 1024,
	/** The register is a list, not one record's attachments; this is its ceiling. */
	maxCount: 200,
};

export const REPORT_FILE_ACCEPT = acceptAttribute(REPORT_FILE_RULES.types);
