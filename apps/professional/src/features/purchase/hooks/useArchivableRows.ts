"use client";

import { useCallback, useMemo, useState } from "react";

/** Anything the Arkiv tab can list. */
export interface ArchivableRow {
	id: string;
	archived: boolean;
}

export interface UseArchivableRowsOptions<T extends ArchivableRow> {
	/** The full collection; `archivedOnly` decides which half is listed. */
	rows: T[];
	/**
	 * `true` lists archived rows (the Arkiv tab), `false` lists live ones (a
	 * record's line list). Defaults to `true`.
	 */
	archivedOnly?: boolean;
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
 * List state for any collection of rows carrying an `archived` flag: search,
 * filter, tri-state sort, pagination, archive, restore and permanent delete.
 *
 * Written once rather than copied per entity — it backs the three Arkiv sub-tabs
 * and a purchase record's line list.
 *
 * Mutations are local state only. There is no purchase API, so an archived or
 * restored row reverts on the next navigation, when the mock is read again.
 * Flagged on the ticket.
 */
export function useArchivableRows<T extends ArchivableRow>({
	rows,
	archivedOnly = true,
	searchFields,
	sortValue,
	defaultSortBy,
	matchesFilter,
	initialPageSize = 10,
}: UseArchivableRowsOptions<T>) {
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

	const setArchived = useCallback((id: string, archived: boolean) => {
		setAllRows((previous) =>
			previous.map((row) => (row.id === id ? { ...row, archived } : row)),
		);
	}, []);

	/** Puts the row back on its live list. */
	const restoreRow = useCallback(
		(id: string) => setArchived(id, false),
		[setArchived],
	);

	/** Moves the row to the Arkiv tab. */
	const archiveRow = useCallback(
		(id: string) => setArchived(id, true),
		[setArchived],
	);

	/** Permanent, which is why the caller confirms first. */
	const deleteRow = useCallback((id: string) => {
		setAllRows((previous) => previous.filter((row) => row.id !== id));
	}, []);

	const filteredAndSorted = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return allRows
			.filter((row) => {
				if (row.archived !== archivedOnly) return false;

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
		archivedOnly,
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
		archiveRow,
		deleteRow,
	};
}
