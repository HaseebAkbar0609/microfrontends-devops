"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_LIST_PAGE_SIZE } from "../constants/forecastList.constants";
import { INITIAL_FORECAST_LIST } from "../mock/forecastList.mock";
import type { ForecastListFilters, ForecastListRow, ForecastListSortField } from "../types/forecastList.types";
import { matchesForecast, sortForecasts, type ForecastLabel } from "../utils/forecastList";

const NO_FILTERS: ForecastListFilters = { category: null, customerType: null };

/**
 * Prognoslista's rows and the table's view of them: search, filter, sort and
 * paging. Changing what is shown returns to page 1, and the page is clamped,
 * so removing the last row of the last page never leaves the reader past the
 * end. Rows come from mock data until a forecast API exists.
 */
export function useForecastList() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: ForecastLabel = t;

	const [rows, setRows] = useState<ForecastListRow[]>(INITIAL_FORECAST_LIST);
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

	const remove = useCallback(
		(row: ForecastListRow) => {
			setRows((prev) => prev.filter((item) => item.id !== row.id));
			showToast("success", t(localizationConstants.forecastDeletedToast, { object: row.objectNo }));
		},
		[t],
	);

	const activeFilterCount = Number(filters.category !== null) + Number(filters.customerType !== null);
	const emptyKey =
		search.trim() || activeFilterCount > 0
			? localizationConstants.forecastListNoMatches
			: localizationConstants.forecastListEmpty;

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
		activeFilterCount,
		sortField,
		sortDir,
		onSort,
		remove,
		emptyKey,
	};
}

export type ForecastListState = ReturnType<typeof useForecastList>;
