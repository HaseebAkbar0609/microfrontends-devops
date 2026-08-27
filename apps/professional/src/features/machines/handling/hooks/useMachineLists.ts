"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { MOCK_MACHINE_LISTS } from "../data/machineHandling.mock";
import type { MachineListRow } from "../types/machineHandling.types";

export type MachineListSortField =
	| "object"
	| "label"
	| "customer"
	| "startDate"
	| "endDate"
	| "status";

/**
 * List state for Maskinhantering: search, sorting, pagination and the row
 * actions. Mirrors `useMachines` so both machine list pages behave the same,
 * including clamping the page when rows are removed.
 */
export function useMachineLists(initialPageSize = 10) {
	const [lists, setLists] = useState<MachineListRow[]>(MOCK_MACHINE_LISTS);
	const [searchQuery, setSearchQuery] = useState("");
	/** "" = unfiltered, so the trigger shows the "Filter" placeholder. */
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [sortBy, setSortBy] = useState<MachineListSortField | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [currentPage, setCurrentPage] = useState(1);

	const handleSort = useCallback(
		(field: MachineListSortField) => {
			if (sortBy === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy]
	);

	const deleteList = useCallback((id: string) => {
		setLists((prev) => prev.filter((row) => row.id !== id));
	}, []);

	const archiveList = useCallback((id: string) => {
		setLists((prev) =>
			prev.map((row) => (row.id === id ? { ...row, status: "ended" } : row))
		);
	}, []);

	const filteredAndSorted = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const filtered = lists.filter((row) => {
			if (query) {
				const matches = [row.object, row.label, row.customer].some((field) =>
					field.toLowerCase().includes(query)
				);
				if (!matches) return false;
			}

			const filtersByStatus = statusFilter !== "" && statusFilter !== "all";
			if (filtersByStatus && row.status !== statusFilter) return false;

			return true;
		});

		if (!sortBy) return filtered;

		return [...filtered].sort((a, b) => {
			const valA = (a[sortBy] ?? "").toLowerCase();
			const valB = (b[sortBy] ?? "").toLowerCase();
			let comparison = 0;
			if (valA < valB) comparison = -1;
			if (valA > valB) comparison = 1;
			return sortOrder === "asc" ? comparison : -comparison;
		});
	}, [lists, searchQuery, statusFilter, sortBy, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
	const safePage = Math.min(currentPage, totalPages);

	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(totalPages);
	}, [currentPage, totalPages]);

	const paginated = useMemo(() => {
		const start = (safePage - 1) * pageSize;
		return filteredAndSorted.slice(start, start + pageSize);
	}, [filteredAndSorted, safePage, pageSize]);

	return {
		paginated,
		totalPages,
		currentPage: safePage,
		setCurrentPage,
		pageSize,
		setPageSize,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
		deleteList,
		archiveList,
	};
}
