"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	FORECAST_STATISTICS_ACTIVITY_PAGE_SIZE,
	FORECAST_STATISTICS_EXPORT_FILE,
} from "../constants/forecastStatistics.constants";
import { INITIAL_STATISTICS_SEED } from "../mock/forecastStatistics.mock";
import type { StatisticsActivitySortField } from "../types/forecastStatistics.types";
import { downloadWorkbook } from "../utils/economyWorkbook";
import {
	buildStatisticsActivityRows,
	buildStatisticsState,
	sortStatisticsActivity,
	type StatisticsLabel,
} from "../utils/forecastStatistics";

/**
 * Everything the Statistik page shows.
 *
 * The figures are worked out once from the seed; only the table's order and
 * page move afterwards, so sorting a column never re-derives a card.
 */
export function useForecastStatistics() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: StatisticsLabel = t;

	const state = useMemo(() => buildStatisticsState(INITIAL_STATISTICS_SEED), []);

	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(FORECAST_STATISTICS_ACTIVITY_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<StatisticsActivitySortField>();

	const sorted = useMemo(
		() => sortStatisticsActivity(state.activity, sortField, sortDir, label, i18n.language),
		[state.activity, sortField, sortDir, label, i18n.language],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const onSort = useCallback(
		(field: StatisticsActivitySortField) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	/** The whole table, not just the page on screen. */
	const exportActivity = useCallback(() => {
		const written = downloadWorkbook(
			buildStatisticsActivityRows(state.activity, label),
			t(localizationConstants.forecastStatisticsSheetName),
			FORECAST_STATISTICS_EXPORT_FILE,
		);
		showToast(
			written ? "success" : "error",
			t(
				written
					? localizationConstants.reportExportSuccess
					: localizationConstants.forecastStatisticsExportFailed,
			),
		);
	}, [state.activity, label, t]);

	return {
		...state,
		activityRows: sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		currentPage,
		totalPages,
		pageSize,
		setPage,
		setPageSize,
		sortField,
		sortDir,
		onSort,
		exportActivity,
	};
}

export type ForecastStatisticsState = ReturnType<typeof useForecastStatistics>;
