"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROTOCOLS_PAGE_SIZE } from "../constants/forecastProtocols.constants";
import type {
	ForecastProtocol,
	ForecastProtocolListFilters,
	ForecastProtocolSortField,
	ForecastProtocolUploadInput,
} from "../types/forecastProtocols.types";
import { matchesProtocol, sortProtocols, type ProtocolLabel } from "../utils/forecastProtocols";
import { createProtocol, listProtocols, removeProtocol } from "../utils/forecastProtocolsService";

const NO_FILTERS: ForecastProtocolListFilters = { type: null };

/**
 * Protokoll's rows and the register's view of them: search, filter, sort and
 * paging. Changing what is shown returns to page 1, and the page is clamped,
 * so deleting the last row of the last page never leaves the reader past the
 * end.
 *
 * The register lives in the service, so `rows` is re-read after every change
 * rather than kept in step by hand.
 */
export function useForecastProtocols() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: ProtocolLabel = t;

	const [rows, setRows] = useState<ForecastProtocol[]>(() => listProtocols());
	const [search, setSearchValue] = useState("");
	const [filters, setFiltersValue] = useState<ForecastProtocolListFilters>(NO_FILTERS);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(PROTOCOLS_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<ForecastProtocolSortField>();

	const shown = useMemo(
		() =>
			sortProtocols(
				rows.filter((protocol) => matchesProtocol(protocol, filters, search, label)),
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
		<K extends keyof ForecastProtocolListFilters>(key: K, value: ForecastProtocolListFilters[K]) => {
			setFiltersValue((prev) => ({ ...prev, [key]: value }));
			setPage(1);
		},
		[],
	);

	const onSort = useCallback(
		(field: ForecastProtocolSortField) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	const create = useCallback(
		(input: ForecastProtocolUploadInput): boolean => {
			const created = createProtocol(input);
			if (!created) {
				showToast("error", t(localizationConstants.projectProtocolSaveFailed));
				return false;
			}

			const next = listProtocols();
			setRows(next);

			/*
			 * A protocol takes its place by the meeting's date, not by when it
			 * was filed, so a back-dated one lands mid-list and page 1 would not
			 * hold it. Clear what was narrowing the list and turn to the page it
			 * is actually on, or the reader is told it was saved and sees
			 * nothing change.
			 */
			setSearchValue("");
			setFiltersValue(NO_FILTERS);
			const ordered = sortProtocols(next, sortField, sortDir, label, i18n.language);
			const index = ordered.findIndex((protocol) => protocol.id === created.id);
			setPage(index < 0 ? 1 : Math.floor(index / pageSize) + 1);

			showToast("success", t(localizationConstants.projectProtocolCreatedToast));
			return true;
		},
		[t, sortField, sortDir, label, i18n.language, pageSize],
	);

	const remove = useCallback(
		(protocol: ForecastProtocol) => {
			removeProtocol(protocol.id);
			setRows(listProtocols());
			showToast("success", t(localizationConstants.projectProtocolDeletedToast));
		},
		[t],
	);

	const narrowed = Boolean(search.trim()) || filters.type !== null;
	const emptyKey = narrowed
		? localizationConstants.projectProtocolNoMatches
		: localizationConstants.projectProtocolEmpty;

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
		create,
		remove,
		emptyKey,
	};
}

export type ForecastProtocolsState = ReturnType<typeof useForecastProtocols>;
