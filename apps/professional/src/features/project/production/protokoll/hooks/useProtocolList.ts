"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { ProjectRowsFilterOption } from "../../../components/ProjectRowsToolbar";
import {
	PROTOCOL_ARCHIVED_FILTER,
	PROTOCOL_PAGE_SIZE,
	PROTOCOL_TYPES,
	type ProtocolSortField,
} from "../projectProtocol.config";
import { matchesProtocol, sortProtocols, type ProtocolTypeLabel } from "../protocolView";
import type { ProjectProtocol } from "../types";

export interface ProtocolEmptyState {
	titleKey: TranslationKeys;
	descriptionKey?: TranslationKeys;
}

/**
 * The table's view of the protocols: search, filter, sort and paging.
 * Changing what is shown returns to page 1, and the page is clamped so a
 * narrower list never leaves the reader past its end — restoring the last
 * archived protocol under Arkiverade lands on an empty first page, not a
 * missing third.
 */
export function useProtocolList(protocols: ProjectProtocol[], typeLabel: ProtocolTypeLabel) {
	const { t, i18n } = useTranslation();

	const [search, setSearchValue] = useState("");
	const [filter, setFilterValue] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(PROTOCOL_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<ProtocolSortField>();

	/* Every type, always, so a selected one never vanishes from the menu when its
	   last row is archived; then Arkiverade, where archived rows live. */
	const filterOptions: ProjectRowsFilterOption[] = useMemo(
		() => [
			...PROTOCOL_TYPES.map((value) => ({ value, label: typeLabel(value) })),
			{ value: PROTOCOL_ARCHIVED_FILTER, label: t(localizationConstants.projectInspectionFilterArchived) },
		],
		[typeLabel, t],
	);

	/** The rows a filter and search show, in the table's order. */
	const shown = useCallback(
		(all: ProjectProtocol[], byFilter: string | null, bySearch: string) =>
			sortProtocols(
				all.filter((row) => matchesProtocol(row, byFilter, bySearch, typeLabel)),
				sortField,
				sortDir,
				typeLabel,
				i18n.language,
			),
		[typeLabel, sortField, sortDir, i18n.language],
	);

	const rows = useMemo(() => shown(protocols, filter, search), [shown, protocols, filter, search]);

	const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const setSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPage(1);
	}, []);

	const setFilter = useCallback((value: string | null) => {
		setFilterValue(value);
		setPage(1);
	}, []);

	const onSort = useCallback(
		(field: ProtocolSortField) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	/**
	 * Shows a new protocol: a search or filter that would hide it is cleared,
	 * and the list turns to the page it sorts onto — a back-dated protocol lands
	 * past page 1. Reads the list the store just returned, since this render's
	 * rows predate the new one.
	 */
	const reveal = useCallback(
		(row: ProjectProtocol, all: ProjectProtocol[]) => {
			const hidden = !matchesProtocol(row, filter, search, typeLabel);
			if (hidden) {
				setFilterValue(null);
				setSearchValue("");
			}
			const index = shown(all, hidden ? null : filter, hidden ? "" : search).findIndex((item) => item.id === row.id);
			setPage(index < 0 ? 1 : Math.floor(index / pageSize) + 1);
		},
		[filter, search, typeLabel, shown, pageSize],
	);

	const archivedView = filter === PROTOCOL_ARCHIVED_FILTER;
	const emptyState: ProtocolEmptyState = search.trim() || (filter !== null && !archivedView)
		? { titleKey: localizationConstants.projectProtocolNoMatches }
		: archivedView
			? { titleKey: localizationConstants.projectProtocolArchiveEmpty, descriptionKey: localizationConstants.projectProtocolArchiveEmptyDesc }
			: { titleKey: localizationConstants.projectProtocolEmpty, descriptionKey: localizationConstants.projectProtocolEmptyDesc };

	return {
		pageRows: rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		currentPage,
		totalPages,
		pageSize,
		setPage,
		setPageSize,
		emptyState,
		archivedView,
		search,
		setSearch,
		filter,
		setFilter,
		filterOptions,
		sortField,
		sortDir,
		onSort,
		reveal,
	};
}

export type ProtocolListState = ReturnType<typeof useProtocolList>;
