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

	const filteredAndSorted = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const filtered = lists.filter((row) => {
			if (!query) return true;
			return [row.object, row.label, row.customer].some((field) =>
				field.toLowerCase().includes(query)
			);
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
	}, [lists, searchQuery, sortBy, sortOrder]);

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
		sortBy,
		sortOrder,
		handleSort,
		deleteList,
	};
}
