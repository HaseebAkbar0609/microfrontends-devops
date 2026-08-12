"use client";

import { useState, useMemo } from "react";
import { MOCK_ORDER_ECONOMY_ROWS } from "../data/orderEconomy.mock";
import type { OrderEconomyTab } from "../types/orderEconomy.types";

export type SortField =
	| "projectNo"
	| "projectName"
	| "revenueCategory"
	| "costCategory"
	| "tbBidrag";
export type SortOrder = "asc" | "desc";

export function useOrderEconomy() {
	const [activeTab, setActiveTab] = useState<OrderEconomyTab>("contributionMargin");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortField, setSortField] = useState<SortField>("projectNo");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	// TODO: Replace mock sorting and data array with GET /api/v1/orders/economy API integration
	const sortedRows = useMemo(() => {
		return [...MOCK_ORDER_ECONOMY_ROWS].sort((a, b) => {
			const valA = a[sortField];
			const valB = b[sortField];

			if (typeof valA === "string" && typeof valB === "string") {
				return sortOrder === "asc"
					? valA.localeCompare(valB)
					: valB.localeCompare(valA);
			}

			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}

			return 0;
		});
	}, [sortField, sortOrder]);

	// Dynamically compute total contribution margin from row data
	const totalTBBidrag = useMemo(() => {
		return sortedRows.reduce((acc, r) => acc + r.tbBidrag, 0);
	}, [sortedRows]);

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

	return {
		activeTab,
		setActiveTab,
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
		totalTBBidrag,
	};
}
