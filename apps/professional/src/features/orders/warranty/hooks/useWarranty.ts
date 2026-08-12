"use client";

import { useState, useMemo } from "react";
import { MOCK_WARRANTY_ROWS, MOCK_INSPECTION_DATES } from "../data/warranty.mock";
import type { WarrantyRow, InspectionDateItem } from "../types/warranty.types";

export type WarrantySortField =
	| "orderNo"
	| "orderName"
	| "startDate"
	| "approvedDate"
	| "warrantyPeriod"
	| "projectManager"
	| "customer";
export type SortOrder = "asc" | "desc";

export function useWarranty() {
	const [rows] = useState<WarrantyRow[]>(MOCK_WARRANTY_ROWS);
	const [inspectionDates, setInspectionDates] = useState<InspectionDateItem[]>(MOCK_INSPECTION_DATES);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortField, setSortField] = useState<WarrantySortField>("orderNo");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const handleSort = (field: WarrantySortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const filteredRows = useMemo(() => {
		return rows.filter((row) => {
			const matchesSearch =
				!searchQuery ||
				row.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
				row.orderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				row.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
				row.projectManager.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesSearch;
		});
	}, [rows, searchQuery]);

	const sortedRows = useMemo(() => {
		return [...filteredRows].sort((a, b) => {
			const valA = a[sortField] || "";
			const valB = b[sortField] || "";

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

	const addInspectionDate = (newDate: Omit<InspectionDateItem, "id">) => {
		const created: InspectionDateItem = {
			...newDate,
			id: `v-${Date.now()}`,
		};
		setInspectionDates((prev) => [...prev, created]);
	};

	return {
		rows,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
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
		inspectionDates,
		addInspectionDate,
	};
}
