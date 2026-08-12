"use client";

import { useState, useMemo } from "react";
import { MOCK_ORDER_ECONOMY_ROWS, TOTAL_TB_BIDRAG_MOCK } from "../data/orderEconomy.mock";
import type { OrderEconomyTab } from "../types/orderEconomy.types";

export type SortField = "projectNo" | "projectName" | "revenueCategory" | "costCategory" | "tbBidrag";
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

	const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

	const paginatedRows = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedRows.slice(start, start + pageSize);
	}, [sortedRows, currentPage, pageSize]);

	const toggleSelectAll = () => {
		if (selectedIds.length === paginatedRows.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(paginatedRows.map((r) => r.id));
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
		totalTBBidrag: TOTAL_TB_BIDRAG_MOCK,
	};
}
