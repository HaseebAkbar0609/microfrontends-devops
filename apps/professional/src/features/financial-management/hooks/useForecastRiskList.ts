"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { RISK_LIST_PAGE_SIZE } from "../constants/forecastRisk.constants";
import { INITIAL_RISK_CLIENTS } from "../mock/forecastRisk.mock";
import type { RiskListFilters, RiskListSortField } from "../types/forecastRisk.types";
import { matchesRiskClient, riskSummary, sortRiskClients, type RiskLabel } from "../utils/forecastRisk";

const NO_FILTERS: RiskListFilters = { level: null, status: null };

/**
 * Riskhantering's clients and the register's view of them: search, filter,
 * sort and paging, with the four summary figures over the clients the filters
 * leave — so the cards and the ring always describe the rows on screen.
 * Clients come from mock data until a credit API exists.
 */
export function useForecastRiskList() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: RiskLabel = t;

	const [search, setSearchValue] = useState("");
	const [filters, setFiltersValue] = useState<RiskListFilters>(NO_FILTERS);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(RISK_LIST_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<RiskListSortField>();

	const matched = useMemo(
		() => INITIAL_RISK_CLIENTS.filter((client) => matchesRiskClient(client, filters, search, label)),
		[filters, search, label],
	);

	const shown = useMemo(
		() => sortRiskClients(matched, sortField, sortDir, label, i18n.language),
		[matched, sortField, sortDir, label, i18n.language],
	);

	const summary = useMemo(() => riskSummary(matched), [matched]);

	const totalPages = Math.max(1, Math.ceil(shown.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const setSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPage(1);
	}, []);

	const setFilter = useCallback(<K extends keyof RiskListFilters>(key: K, value: RiskListFilters[K]) => {
		setFiltersValue((prev) => ({ ...prev, [key]: value }));
		setPage(1);
	}, []);

	const onSort = useCallback(
		(field: RiskListSortField) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	const narrowed = Boolean(search.trim()) || filters.level !== null || filters.status !== null;
	const emptyKey = narrowed
		? localizationConstants.forecastRiskNoMatches
		: localizationConstants.forecastRiskListEmpty;

	return {
		pageRows: shown.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		summary,
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
		emptyKey,
	};
}

export type ForecastRiskListState = ReturnType<typeof useForecastRiskList>;
