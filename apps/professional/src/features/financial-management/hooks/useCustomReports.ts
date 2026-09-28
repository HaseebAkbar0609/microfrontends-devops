"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { CUSTOM_REPORTS_PAGE_SIZE } from "../constants/forecastCustomReports.constants";
import type { CustomReport, CustomReportSortField } from "../types/forecastCustomReports.types";
import { downloadCustomReport } from "../utils/customReportWorkbook";
import { listCustomReports, removeCustomReport } from "../utils/customReportsRepository";
import { matchesCustomReport, sortCustomReports } from "../utils/forecastCustomReports";
import { useForecastList } from "./useForecastList";

/**
 * Anpassade rapporter's rows and the register's view of them: search, sort and
 * paging. Searching or sorting returns to page 1, and the page is clamped, so
 * deleting the last row of the last page never leaves the reader past the end.
 *
 * There is no filter: a saved report is a name, a column set and a date, with
 * nothing to narrow by — so the toolbar leaves Filter out rather than opening
 * an empty menu.
 *
 * The register lives in the repository, so `rows` is re-read after every
 * change rather than kept in step by hand.
 */
export function useCustomReports() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	/* The sheet is written from the live list, so a report never goes stale. */
	const { allRows } = useForecastList();

	const [rows, setRows] = useState<CustomReport[]>(() => listCustomReports());
	const [search, setSearchValue] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(CUSTOM_REPORTS_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<CustomReportSortField>();

	const shown = useMemo(
		() => sortCustomReports(rows.filter((report) => matchesCustomReport(report, search)), sortField, sortDir, i18n.language),
		[rows, search, sortField, sortDir, i18n.language],
	);

	const totalPages = Math.max(1, Math.ceil(shown.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const setSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPage(1);
	}, []);

	const onSort = useCallback(
		(field: CustomReportSortField) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	const remove = useCallback(
		(report: CustomReport) => {
			removeCustomReport(report.id);
			setRows(listCustomReports());
			showToast("success", t(localizationConstants.forecastCustomReportsDeleted, { name: report.name }));
		},
		[t],
	);

	const download = useCallback(
		(report: CustomReport) => {
			if (downloadCustomReport(report, allRows, t)) {
				showToast("success", t(localizationConstants.reportExportSuccess));
				return;
			}
			showToast("error", t(localizationConstants.forecastCustomReportsExportFailed));
		},
		[allRows, t],
	);

	const emptyKey = search.trim()
		? localizationConstants.forecastCustomReportsNoMatches
		: localizationConstants.forecastCustomReportsEmpty;

	return {
		pageRows: shown.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		currentPage,
		totalPages,
		pageSize,
		setPage,
		setPageSize,
		search,
		setSearch,
		sortField,
		sortDir,
		onSort,
		remove,
		download,
		emptyKey,
	};
}

export type CustomReportsState = ReturnType<typeof useCustomReports>;
