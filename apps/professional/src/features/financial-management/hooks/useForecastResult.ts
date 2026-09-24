"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import localizationConstants from "@/utils/translation/constants";
import { FORECAST_RESULT_PAGE_SIZE } from "../constants/forecastResult.constants";
import { INITIAL_FORECAST_MONTHLY, INITIAL_FORECAST_YEARLY } from "../mock/forecastResult.mock";
import type {
	ForecastMonthlySortField,
	ForecastResultSign,
	ForecastResultView,
	ForecastYearlySortField,
} from "../types/forecastResult.types";
import {
	matchesMonthly,
	matchesYearly,
	monthlyColumnTotals,
	sortMonthly,
	sortYearly,
	yearlyTotals,
} from "../utils/forecastResult";

/**
 * Resultat prognos's two tables: search, the result filter, sorting and paging.
 * Årlig and Månad keep their own sorting, since their columns are different
 * ones; the search and the filter carry across, and every change returns to
 * page 1. The totals under each table are of everything the filter leaves, not
 * only of the page on screen. Rows are mock data until a forecast API exists.
 */
export function useForecastResult() {
	const { i18n } = useTranslation();
	const locale = i18n.language;

	const [view, setViewValue] = useState<ForecastResultView>("yearly");
	const [search, setSearchValue] = useState("");
	const [sign, setSignValue] = useState<ForecastResultSign | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(FORECAST_RESULT_PAGE_SIZE);
	const yearlySort = useTableSort<ForecastYearlySortField>();
	const monthlySort = useTableSort<ForecastMonthlySortField>();

	const yearlyRows = useMemo(
		() =>
			sortYearly(
				INITIAL_FORECAST_YEARLY.filter((row) => matchesYearly(row, search, sign)),
				yearlySort.sortField,
				yearlySort.sortDir,
				locale,
			),
		[search, sign, yearlySort.sortField, yearlySort.sortDir, locale],
	);

	const monthlyRows = useMemo(
		() =>
			sortMonthly(
				INITIAL_FORECAST_MONTHLY.filter((row) => matchesMonthly(row, search, sign)),
				monthlySort.sortField,
				monthlySort.sortDir,
				locale,
			),
		[search, sign, monthlySort.sortField, monthlySort.sortDir, locale],
	);

	const shownCount = view === "yearly" ? yearlyRows.length : monthlyRows.length;
	const totalPages = Math.max(1, Math.ceil(shownCount / pageSize));
	const currentPage = Math.min(page, totalPages);
	const from = (currentPage - 1) * pageSize;
	const to = currentPage * pageSize;

	const setView = useCallback((next: ForecastResultView) => {
		setViewValue(next);
		setPage(1);
	}, []);

	const setSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPage(1);
	}, []);

	const setSign = useCallback((value: ForecastResultSign | null) => {
		setSignValue(value);
		setPage(1);
	}, []);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	const onSortYearly = useCallback(
		(field: ForecastYearlySortField) => {
			yearlySort.toggleSort(field);
			setPage(1);
		},
		[yearlySort],
	);

	const onSortMonthly = useCallback(
		(field: ForecastMonthlySortField) => {
			monthlySort.toggleSort(field);
			setPage(1);
		},
		[monthlySort],
	);

	return {
		view,
		setView,
		search,
		setSearch,
		sign,
		setSign,
		yearlyPage: yearlyRows.slice(from, to),
		monthlyPage: monthlyRows.slice(from, to),
		yearlyTotals: yearlyTotals(yearlyRows),
		monthlyTotals: monthlyColumnTotals(monthlyRows),
		currentPage,
		totalPages,
		pageSize,
		setPage,
		setPageSize,
		yearlySortField: yearlySort.sortField,
		yearlySortDir: yearlySort.sortDir,
		onSortYearly,
		monthlySortField: monthlySort.sortField,
		monthlySortDir: monthlySort.sortDir,
		onSortMonthly,
		emptyKey: search.trim() || sign !== null ? localizationConstants.forecastListNoMatches : localizationConstants.forecastListEmpty,
	};
}

export type ForecastResultState = ReturnType<typeof useForecastResult>;
