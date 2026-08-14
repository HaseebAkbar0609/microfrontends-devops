"use client";

import { useState, useMemo } from "react";
import { MOCK_ORDER_ARCHIVE_ROWS } from "../data/orderArchive.mock";
import type { OrderArchiveRow } from "../types/orderArchive.types";

export type ArchiveSortField =
	| "orderNo"
	| "orderName"
	| "category"
	| "department"
	| "contractSum"
	| "orderSum"
	| "projectManager"
	| "startDate"
	| "endDate";
export type SortOrder = "asc" | "desc";

export function useOrderArchive() {
	const [rows, setRows] = useState<OrderArchiveRow[]>(MOCK_ORDER_ARCHIVE_ROWS);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortField, setSortField] = useState<ArchiveSortField>("orderNo");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const handleSort = (field: ArchiveSortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	// Filter rows with sanitized search query and category filter
	const filteredRows = useMemo(() => {
		const cleanQuery = searchQuery.trim().toLowerCase();

		return rows.filter((row) => {
			const matchesCategory =
				categoryFilter === "all" ||
				row.category.toLowerCase() === categoryFilter.toLowerCase() ||
				row.categoryKey.toLowerCase() === categoryFilter.toLowerCase();

			const matchesSearch =
				!cleanQuery ||
				(row.orderNo && row.orderNo.toLowerCase().includes(cleanQuery)) ||
				(row.orderName && row.orderName.toLowerCase().includes(cleanQuery)) ||
				(row.projectManager && row.projectManager.toLowerCase().includes(cleanQuery)) ||
				(row.category && row.category.toLowerCase().includes(cleanQuery)) ||
				(row.department && row.department.toLowerCase().includes(cleanQuery));

			return matchesCategory && matchesSearch;
		});
	}, [rows, searchQuery, categoryFilter]);

	// Null-safe sorting
	const sortedRows = useMemo(() => {
		return [...filteredRows].sort((a, b) => {
			const valA = a[sortField] ?? "";
			const valB = b[sortField] ?? "";

			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}

			return sortOrder === "asc"
				? String(valA).localeCompare(String(valB))
				: String(valB).localeCompare(String(valA));
		});
	}, [filteredRows, sortField, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

	const paginatedRows = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedRows.slice(start, start + pageSize);
	}, [sortedRows, currentPage, pageSize]);

	const toggleSelectAll = () => {
		if (paginatedRows.length > 0 && paginatedRows.every((r) => selectedIds.includes(r.id))) {
			const currentPaginatedIds = new Set(paginatedRows.map((r) => r.id));
			setSelectedIds((prev) => prev.filter((id) => !currentPaginatedIds.has(id)));
		} else {
			const newIds = new Set([...selectedIds, ...paginatedRows.map((r) => r.id)]);
			setSelectedIds(Array.from(newIds));
		}
	};

	const toggleSelectRow = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	const restoreOrder = (id: string) => {
		setRows((prev) => prev.filter((item) => item.id !== id));
		setSelectedIds((prev) => prev.filter((item) => item !== id));
	};

	const deleteArchivedOrder = (id: string) => {
		setRows((prev) => prev.filter((item) => item.id !== id));
		setSelectedIds((prev) => prev.filter((item) => item !== id));
	};

	return {
		rows,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		selectedIds,
		toggleSelectAll,
		toggleSelectRow,
		sortField,
		sortOrder,
		handleSort,
		paginatedRows,
		totalRows: sortedRows.length,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		restoreOrder,
		deleteArchivedOrder,
	};
}
