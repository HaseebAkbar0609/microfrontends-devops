"use client";

import { useCallback, useMemo, useState } from "react";
import {
	MARKETING_MAX_TOOLBAR_FILTERS,
	MARKETING_TABLE_PAGE_SIZE,
} from "../constants/marketing.constants";
import type { MarketingRow, MarketingSection } from "../types";
import { getFilterFields, rowMatchesQuery } from "../utils/registerValues";

/**
 * Search, faceting and paging for one register.
 *
 * Written once and shared by all 19 registers: the facets come from the
 * section's own `select` fields, so adding a filter is a config change. Pure
 * derivation from the rows it is handed, so it keeps working once they come
 * from a query.
 */
export function useRegisterTable(
	section: MarketingSection,
	rows: MarketingRow[],
) {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<Record<string, string>>({});
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(MARKETING_TABLE_PAGE_SIZE);

	const filterFields = useMemo(
		() => getFilterFields(section, MARKETING_MAX_TOOLBAR_FILTERS),
		[section],
	);

	const filteredRows = useMemo(
		() =>
			rows.filter((row) => {
				if (!rowMatchesQuery(row, query)) return false;
				return Object.entries(selected).every(
					([name, value]) => !value || String(row.values[name] ?? "") === value,
				);
			}),
		[rows, query, selected],
	);

	const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
	// Clamp rather than reset, so filtering down to fewer pages never leaves the
	// table showing an empty page.
	const currentPage = Math.min(page, totalPages);
	const visibleRows = filteredRows.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const changeQuery = useCallback((value: string) => {
		setQuery(value);
		setPage(1);
	}, []);

	const changeFilter = useCallback((name: string, value: string) => {
		setSelected((previous) => ({ ...previous, [name]: value }));
		setPage(1);
	}, []);

	const changePageSize = useCallback((size: number) => {
		setPageSize(size);
		setPage(1);
	}, []);

	return {
		query,
		changeQuery,
		filterFields,
		selected,
		changeFilter,
		visibleRows,
		filteredCount: filteredRows.length,
		totalCount: rows.length,
		currentPage,
		totalPages,
		pageSize,
		setPage,
		changePageSize,
	};
}
