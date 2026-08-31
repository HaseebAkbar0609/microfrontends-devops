"use client";

import { useCallback, useMemo, useState } from "react";

/** Anything the Arkiv tab can list. */
export interface ArchivableRow {
	id: string;
	archived: boolean;
}

export interface UseArchivedRowsOptions<T extends ArchivableRow> {
	/** The full collection, live rows included; only archived ones are listed. */
	rows: T[];
	/** Fields the search box matches against. */
	searchFields: (row: T) => string[];
	/**
	 * Sort key for a column. Return a number to order by rank rather than
	 * alphabetically — order type and priority read as nonsense otherwise.
	 */
	sortValue: (row: T, field: string) => string | number;
	defaultSortBy: string;
	/** Secondary dropdown filter; `"all"` means no filtering. */
	matchesFilter?: (row: T, value: string) => boolean;
	initialPageSize?: number;
}

/**
 * List state for one Arkiv sub-tab: search, filter, tri-state sort, pagination,
 * restore and permanent delete.
 *
 * Written once for all three tabs rather than copied per entity — the three live
 * list hooks already duplicate this shape between them.
 *
 * Restore and delete mutate local state only. There is no purchase API, so a
 * restored row reappears on its live list only until the next navigation, when
 * the mock is read again. Flagged on the ticket.
 */
export function useArchivedRows<T extends ArchivableRow>({
	rows,
	searchFields,
	sortValue,
	defaultSortBy,
	matchesFilter,
	initialPageSize = 10,
}: UseArchivedRowsOptions<T>) {
	const [allRows, setAllRows] = useState<T[]>(rows);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterValue, setFilterValue] = useState("all");
	const [sortBy, setSortBy] = useState<string>(defaultSortBy);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	const [currentPage, setCurrentPage] = useState<number>(1);

	/**
	 * `DataTable` cycles asc -> desc -> null. A null order means "no explicit
	 * sort", which falls back to the default column rather than leaving the rows
	 * in whatever order the last comparator produced.
	 */
	const handleSort = useCallback(
		(field: string, nextOrder: "asc" | "desc" | null) => {
			if (nextOrder === null) {
				setSortBy(defaultSortBy);
				setSortOrder("asc");
				return;
			}
			setSortBy(field);
			setSortOrder(nextOrder);
		},
		[defaultSortBy],
	);

	/** Puts the row back on its live list. */
	const restoreRow = useCallback((id: string) => {
		setAllRows((previous) =>
			previous.map((row) =>
				row.id === id ? { ...row, archived: false } : row,
			),
		);
	}, []);

	/** Permanent, which is why the caller confirms first. */
	const deleteRow = useCallback((id: string) => {
		setAllRows((previous) => previous.filter((row) => row.id !== id));
	}, []);

	const filteredAndSorted = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return allRows
			.filter((row) => {
				if (!row.archived) return false;

				if (
					query &&
					!searchFields(row).some((field) =>
						field.toLowerCase().includes(query),
					)
				) {
					return false;
				}

				if (filterValue !== "all" && matchesFilter) {
					return matchesFilter(row, filterValue);
				}

				return true;
			})
			.sort((a, b) => {
				const valueA = sortValue(a, sortBy);
				const valueB = sortValue(b, sortBy);

				const comparison =
					typeof valueA === "number" && typeof valueB === "number"
						? valueA - valueB
						: String(valueA).localeCompare(
								String(valueB),
								undefined,
								{ sensitivity: "base", numeric: true },
							);

				return sortOrder === "asc" ? comparison : -comparison;
			});
	}, [
		allRows,
		searchQuery,
		filterValue,
		sortBy,
		sortOrder,
		searchFields,
		sortValue,
		matchesFilter,
	]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredAndSorted.length / pageSize),
	);

	const paginatedRows = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSorted.slice(startIndex, startIndex + pageSize);
	}, [filteredAndSorted, currentPage, pageSize]);

	/** Filter and page-size changes must not strand the user on a gone page. */
	const changeSearch = useCallback((value: string) => {
		setSearchQuery(value);
		setCurrentPage(1);
	}, []);

	const changeFilter = useCallback((value: string) => {
		setFilterValue(value);
		setCurrentPage(1);
	}, []);

	const changePageSize = useCallback((size: number) => {
		setPageSize(size);
		setCurrentPage(1);
	}, []);

	return {
		paginatedRows,
		totalCount: filteredAndSorted.length,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		changePageSize,
		searchQuery,
		changeSearch,
		filterValue,
		changeFilter,
		sortBy,
		sortOrder,
		handleSort,
		restoreRow,
		deleteRow,
	};
}
