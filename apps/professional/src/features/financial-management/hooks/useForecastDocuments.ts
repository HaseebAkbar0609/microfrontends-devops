"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { DOCUMENTS_PAGE_SIZE } from "../constants/forecastDocuments.constants";
import type {
	DocumentListFilters,
	DocumentSortField,
	ForecastDocument,
} from "../types/forecastDocuments.types";
import { matchesDocument, sortDocuments, type DocumentLabel } from "../utils/forecastDocuments";
import { listDocuments, removeDocument } from "../utils/forecastDocumentsService";

const NO_FILTERS: DocumentListFilters = { category: null };

/**
 * Dokumentcenter's rows and the register's view of them: search, filter, sort
 * and paging. Changing what is shown returns to page 1, and the page is
 * clamped, so deleting the last row of the last page never leaves the reader
 * past the end.
 *
 * Uploading happens on its own page, so this hook only reads and deletes; it
 * re-reads the service after a change rather than keeping a copy in step.
 */
export function useForecastDocuments() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: DocumentLabel = t;

	const [rows, setRows] = useState<ForecastDocument[]>(() => listDocuments());
	const [search, setSearchValue] = useState("");
	const [filters, setFiltersValue] = useState<DocumentListFilters>(NO_FILTERS);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(DOCUMENTS_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<DocumentSortField>();

	const shown = useMemo(
		() =>
			sortDocuments(
				rows.filter((document) => matchesDocument(document, filters, search, label)),
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
		<K extends keyof DocumentListFilters>(key: K, value: DocumentListFilters[K]) => {
			setFiltersValue((prev) => ({ ...prev, [key]: value }));
			setPage(1);
		},
		[],
	);

	const onSort = useCallback(
		(field: DocumentSortField) => {
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
		(document: ForecastDocument) => {
			removeDocument(document.id);
			setRows(listDocuments());
			showToast("success", t(localizationConstants.forecastDocumentsDeleted, { name: document.fileName }));
		},
		[t],
	);

	const narrowed = Boolean(search.trim()) || filters.category !== null;
	const emptyKey = narrowed
		? localizationConstants.forecastDocumentsNoMatches
		: localizationConstants.forecastDocumentsEmpty;

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
		remove,
		emptyKey,
	};
}

export type ForecastDocumentsState = ReturnType<typeof useForecastDocuments>;
