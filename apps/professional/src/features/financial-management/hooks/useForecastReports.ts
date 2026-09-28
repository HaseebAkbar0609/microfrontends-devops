"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { MOCK_REFERENCE_DATE } from "@/features/widgetdashboard/utils/mockDates";
import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { REPORTS_PAGE_SIZE } from "../constants/forecastReports.constants";
import type {
	ReportDocument,
	ReportListFilters,
	ReportSortField,
	ReportUploadInput,
} from "../types/forecastReports.types";
import { matchesReport, sortReports, type ReportLabel } from "../utils/forecastReports";
import { createReport, listReports, removeReport } from "../utils/forecastReportsService";

const NO_FILTERS: ReportListFilters = { category: null };

/**
 * Rapporterlista's rows and the register's view of them: search, filter, sort
 * and paging. Changing what is shown returns to page 1, and the page is
 * clamped, so deleting the last row of the last page never leaves the reader
 * past the end.
 *
 * The register lives in the service, so `rows` is re-read after every change
 * rather than kept in step by hand.
 */
export function useForecastReports() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: ReportLabel = t;

	const [rows, setRows] = useState<ReportDocument[]>(() => listReports());
	const [search, setSearchValue] = useState("");
	const [filters, setFiltersValue] = useState<ReportListFilters>(NO_FILTERS);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(REPORTS_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<ReportSortField>();

	const shown = useMemo(
		() =>
			sortReports(
				rows.filter((report) => matchesReport(report, filters, search, label)),
				sortField,
				sortDir,
				label,
				i18n.language,
			),
		[rows, filters, search, label, sortField, sortDir, i18n.language],
	);

	const totalPages = Math.max(1, Math.ceil(shown.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const setSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPage(1);
	}, []);

	const setFilter = useCallback(<K extends keyof ReportListFilters>(key: K, value: ReportListFilters[K]) => {
		setFiltersValue((prev) => ({ ...prev, [key]: value }));
		setPage(1);
	}, []);

	const onSort = useCallback(
		(field: ReportSortField) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	const upload = useCallback(
		(input: ReportUploadInput): boolean => {
			const created = createReport(input, MOCK_REFERENCE_DATE);
			if (!created) {
				showToast("error", t(localizationConstants.forecastReportsUploadFailed));
				return false;
			}
			setRows(listReports());
			setPage(1);
			showToast("success", t(localizationConstants.forecastReportsUploaded, { file: created.fileName }));
			return true;
		},
		[t],
	);

	const remove = useCallback(
		(report: ReportDocument) => {
			removeReport(report.id);
			setRows(listReports());
			showToast("success", t(localizationConstants.forecastReportsDeleted, { file: report.fileName }));
		},
		[t],
	);

	const narrowed = Boolean(search.trim()) || filters.category !== null;
	const emptyKey = narrowed
		? localizationConstants.forecastReportsNoMatches
		: localizationConstants.forecastReportsEmpty;

	return {
		pageRows: shown.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		currentPage,
		totalPages,
		pageSize,
		setPage,
		setPageSize,
		search,
		setSearch,
		filters,
		setFilter,
		sortField,
		sortDir,
		onSort,
		upload,
		remove,
		emptyKey,
	};
}

export type ForecastReportsState = ReturnType<typeof useForecastReports>;
