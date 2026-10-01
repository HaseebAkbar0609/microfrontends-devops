"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { MOCK_REFERENCE_DATE } from "@/features/widgetdashboard/utils/mockDates";
import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	TEMPLATES_PAGE_SIZE,
	TEMPLATE_COLUMNS,
} from "../constants/forecastTemplates.constants";
import type {
	TemplateColumnKey,
	TemplateDocument,
	TemplateListFilters,
	TemplateSortField,
	TemplateUploadInput,
} from "../types/forecastTemplates.types";
import { matchesTemplate, sortTemplates, type TemplateLabel } from "../utils/forecastTemplates";
import { createTemplate, listTemplates, removeTemplate } from "../utils/forecastTemplatesService";

const NO_FILTERS: TemplateListFilters = { category: null };

/**
 * Mallar's rows and the register's view of them: search, filter, sort, paging
 * and which columns the `+` is showing. Changing what is shown returns to page
 * 1, and the page is clamped, so deleting the last row of the last page never
 * leaves the reader past the end.
 *
 * The register lives in the service, so `rows` is re-read after every change
 * rather than kept in step by hand.
 */
export function useForecastTemplates() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const label: TemplateLabel = t;

	const [rows, setRows] = useState<TemplateDocument[]>(() => listTemplates());
	const [search, setSearchValue] = useState("");
	const [filters, setFiltersValue] = useState<TemplateListFilters>(NO_FILTERS);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(TEMPLATES_PAGE_SIZE);
	const [visibleColumns, setVisibleColumns] = useState<ReadonlySet<TemplateColumnKey>>(
		() => new Set(TEMPLATE_COLUMNS.map((column) => column.key)),
	);
	const { sortField, sortDir, toggleSort } = useTableSort<TemplateSortField>();

	/**
	 * A hidden column stops sorting. Otherwise hiding the sorted column would
	 * leave the order answering to something the reader can no longer see.
	 */
	const activeSort = sortField && visibleColumns.has(sortField) ? sortField : null;

	const shown = useMemo(
		() =>
			sortTemplates(
				rows.filter((template) => matchesTemplate(template, filters, search, label)),
				activeSort,
				sortDir,
				label,
				i18n.language,
			),
		[rows, filters, search, label, activeSort, sortDir, i18n.language],
	);

	const shownColumns = useMemo(
		() => TEMPLATE_COLUMNS.filter((column) => visibleColumns.has(column.key)),
		[visibleColumns],
	);

	const totalPages = Math.max(1, Math.ceil(shown.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const setSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPage(1);
	}, []);

	const setFilter = useCallback(
		<K extends keyof TemplateListFilters>(key: K, value: TemplateListFilters[K]) => {
			setFiltersValue((prev) => ({ ...prev, [key]: value }));
			setPage(1);
		},
		[],
	);

	const onSort = useCallback(
		(field: TemplateSortField) => {
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
	 * Shows or hides a column, never hiding the last one left — a table of
	 * nothing but the `+` has no way back. Which columns are shown says nothing
	 * about which rows match, so the page stands.
	 */
	const toggleColumn = useCallback((key: TemplateColumnKey) => {
		setVisibleColumns((previous) => {
			const next = new Set(previous);
			if (next.has(key)) {
				if (next.size <= 1) return previous;
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	}, []);

	const create = useCallback(
		(input: TemplateUploadInput): boolean => {
			const created = createTemplate(input, MOCK_REFERENCE_DATE);
			if (!created) {
				showToast("error", t(localizationConstants.forecastTemplatesCreateFailed));
				return false;
			}
			setRows(listTemplates());
			setPage(1);
			showToast("success", t(localizationConstants.forecastTemplatesCreated, { name: created.documentName }));
			return true;
		},
		[t],
	);

	const remove = useCallback(
		(template: TemplateDocument) => {
			removeTemplate(template.id);
			setRows(listTemplates());
			showToast("success", t(localizationConstants.forecastTemplatesDeleted, { name: template.documentName }));
		},
		[t],
	);

	const narrowed = Boolean(search.trim()) || filters.category !== null;
	const emptyKey = narrowed
		? localizationConstants.forecastTemplatesNoMatches
		: localizationConstants.forecastTemplatesEmpty;

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
		columns: TEMPLATE_COLUMNS,
		shownColumns,
		visibleColumns,
		toggleColumn,
		sortField: activeSort,
		sortDir,
		onSort,
		create,
		remove,
		emptyKey,
	};
}

export type ForecastTemplatesState = ReturnType<typeof useForecastTemplates>;
