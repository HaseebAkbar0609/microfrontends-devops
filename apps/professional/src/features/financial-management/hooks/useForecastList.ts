"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_LIST_PAGE_SIZE } from "../constants/forecastList.constants";
import type { ForecastListFilters, ForecastListRow, ForecastListSortField } from "../types/forecastList.types";
import { matchesForecast, sortForecasts, type ForecastLabel } from "../utils/forecastList";
import { listForecasts, removeForecast, setForecastArchived } from "../utils/forecastListService";

const NO_FILTERS: ForecastListFilters = { category: null, customerType: null };

/**
 * Prognoslista's rows and the table's view of them: search, filter, sort and
 * paging. Changing what is shown returns to page 1, and the page is clamped,
 * so removing the last row of the last page never leaves the reader past the
 * end.
 *
 * `archived` picks the side of the register: Prognoslista's rows, or Arkiv's.
 * The register lives in the service, so `rows` is re-read after every change
 * rather than kept in step by hand — archiving on one screen has to show on
 * the other.
 */
export function useForecastList(archived = false) {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: ForecastLabel = t;

	const [rows, setRows] = useState<ForecastListRow[]>(() => listForecasts(archived));
	const [search, setSearchValue] = useState("");
	const [filters, setFiltersValue] = useState<ForecastListFilters>(NO_FILTERS);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(FORECAST_LIST_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<ForecastListSortField>();

	const shown = useMemo(
		() =>
			sortForecasts(
				rows.filter((row) => matchesForecast(row, filters, search, label)),
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

	const setFilter = useCallback(
		<K extends keyof ForecastListFilters>(key: K, value: ForecastListFilters[K]) => {
			setFiltersValue((prev) => ({ ...prev, [key]: value }));
			setPage(1);
		},
		[],
	);

	const onSort = useCallback(
		(field: ForecastListSortField) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	/* Reversible, so it asks nothing first — as the project module's registers
	   archive. The row leaves this list for the other one. */
	const toggleArchive = useCallback(
		(row: ForecastListRow) => {
			setForecastArchived(row.id, !row.archived);
			setRows(listForecasts(archived));
			showToast(
				"success",
				t(
					row.archived ? localizationConstants.forecastRestoredToast : localizationConstants.forecastArchivedToast,
					{ object: row.objectNo },
				),
			);
		},
		[archived, t],
	);

	const remove = useCallback(
		(row: ForecastListRow) => {
			removeForecast(row.id);
			setRows(listForecasts(archived));
			showToast("success", t(localizationConstants.forecastDeletedToast, { object: row.objectNo }));
		},
		[archived, t],
	);

	const narrowed = Boolean(search.trim()) || filters.category !== null || filters.customerType !== null;
	const emptyKey = narrowed
		? localizationConstants.forecastListNoMatches
		: archived
			? localizationConstants.forecastArchiveEmpty
			: localizationConstants.forecastListEmpty;

	return {
		pageRows: shown.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		/** Every row the search and filters leave, not just the page in view. */
		allRows: shown,
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
		toggleArchive,
		remove,
		emptyKey,
	};
}

export type ForecastListState = ReturnType<typeof useForecastList>;
