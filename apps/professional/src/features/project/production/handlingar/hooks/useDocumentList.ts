"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { ProjectRowsFilterOption } from "../../../components/ProjectRowsToolbar";
import { matchesDocument, sortDocuments, type DocumentLabels } from "../documentView";
import {
	DOCUMENT_KIND_META,
	DOCUMENT_KINDS,
	DOCUMENT_PAGE_SIZE,
	DOCUMENT_VIEW_COLUMNS,
	DRAWING_CATEGORIES,
	FILE_FILTER_IMAGES,
	FILE_FILTER_PDF,
	VIEW_KIND,
	type DocumentColumnKey,
	type DocumentView,
} from "../projectDocuments.config";
import type { ProjectDocument } from "../types";

export interface DocumentEmptyState {
	titleKey: TranslationKeys;
	descriptionKey?: TranslationKeys;
}

function emptyStateFor(view: DocumentView, narrowed: boolean): DocumentEmptyState {
	if (narrowed) return { titleKey: localizationConstants.projectDocumentsNoMatches };
	if (view === "arkiv") {
		return {
			titleKey: localizationConstants.projectDocumentsArchiveEmpty,
			descriptionKey: localizationConstants.projectDocumentsArchiveEmptyDesc,
		};
	}
	const meta = DOCUMENT_KIND_META[VIEW_KIND[view]];
	return { titleKey: meta.emptyKey, descriptionKey: meta.emptyDescKey };
}

/**
 * One tab's table: search, filter, sort, paging and which columns show. Each
 * tab mounts its own, so leaving a tab resets them. Changing what is shown
 * returns to page 1, and the page is clamped so a narrower list never leaves
 * the reader past its end.
 */
export function useDocumentList(view: DocumentView, documents: ProjectDocument[], labels: DocumentLabels) {
	const { t, i18n } = useTranslation();
	const columns = DOCUMENT_VIEW_COLUMNS[view];

	const [search, setSearchValue] = useState("");
	const [filter, setFilterValue] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(DOCUMENT_PAGE_SIZE);
	const [visibleColumns, setVisibleColumns] = useState<ReadonlySet<DocumentColumnKey>>(
		() => new Set(columns.map((column) => column.key)),
	);
	const { sortField, sortDir, toggleSort } = useTableSort<DocumentColumnKey>();

	const filterOptions: ProjectRowsFilterOption[] = useMemo(() => {
		if (view === "ritningar") return DRAWING_CATEGORIES.map((value) => ({ value, label: labels.category(value) }));
		if (view === "arkiv") return DOCUMENT_KINDS.map((value) => ({ value, label: labels.kind(value) }));
		return [
			{ value: FILE_FILTER_PDF, label: t(localizationConstants.projectDocumentsFilterPdf) },
			{ value: FILE_FILTER_IMAGES, label: t(localizationConstants.projectDocumentsFilterImages) },
		];
	}, [view, labels, t]);

	const rows = useMemo(
		() =>
			sortDocuments(
				documents.filter((doc) => matchesDocument(doc, view, filter, search, labels)),
				sortField,
				sortDir,
				labels,
				i18n.language,
			),
		[documents, view, filter, search, labels, sortField, sortDir, i18n.language],
	);

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
		(field: DocumentColumnKey) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	const toggleColumn = useCallback((key: DocumentColumnKey) => {
		setVisibleColumns((previous) => {
			const next = new Set(previous);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	}, []);

	/** A new upload the search or filter would hide clears them, so it shows. */
	const reveal = useCallback(
		(doc: ProjectDocument) => {
			if (!matchesDocument(doc, view, filter, search, labels)) {
				setFilterValue(null);
				setSearchValue("");
			}
			setPage(1);
		},
		[view, filter, search, labels],
	);

	return {
		columns,
		shownColumns: columns.filter((column) => visibleColumns.has(column.key)),
		visibleColumns,
		toggleColumn,
		pageRows: rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		currentPage,
		totalPages,
		pageSize,
		setPage,
		setPageSize,
		emptyState: emptyStateFor(view, Boolean(search.trim()) || filter !== null),
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

export type DocumentListState = ReturnType<typeof useDocumentList>;
