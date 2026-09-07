"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
	getGuaranteeCommitments,
	getGuaranteeDetail,
	createVisitDateApi,
	updateVisitDateApi,
	deleteVisitDateApi,
} from "../api/guaranteeCommitments.api";
import { GUARANTEE_CONSTANTS } from "../constants/guaranteeCommitments.constants";
import { MOCK_GUARANTEE_ROWS, MOCK_INSPECTION_DATES } from "../data/guaranteeCommitments.mock";
import type { GuaranteeRow, InspectionDateItem } from "../types/guaranteeCommitments.types";

export type GuaranteeSortField =
	| "orderNo"
	| "orderName"
	| "startDate"
	| "approvedDate"
	| "warrantyPeriod"
	| "projectManager"
	| "customer";
export type SortOrder = "asc" | "desc";

export function useGuaranteeCommitments(orderId?: string) {
	const [rows, setRows] = useState<GuaranteeRow[]>(MOCK_GUARANTEE_ROWS);
	const [inspectionDates, setInspectionDates] = useState<InspectionDateItem[]>(MOCK_INSPECTION_DATES);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortField, setSortField] = useState<GuaranteeSortField>("orderNo");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Load data from API
	useEffect(() => {
		let isMounted = true;
		setIsLoading(true);

		if (orderId) {
			getGuaranteeDetail(orderId)
				.then((res) => {
					if (isMounted) {
						setInspectionDates(res.visitDates);
					}
				})
				.finally(() => {
					if (isMounted) setIsLoading(false);
				});
		} else {
			getGuaranteeCommitments()
				.then((res) => {
					if (isMounted) {
						setRows(res);
					}
				})
				.finally(() => {
					if (isMounted) setIsLoading(false);
				});
		}

		return () => {
			isMounted = false;
		};
	}, [orderId]);

	const handleSort = (field: GuaranteeSortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	// Filter rows with sanitized search query
	const filteredRows = useMemo(() => {
		const cleanQuery = searchQuery.trim().toLowerCase();
		if (!cleanQuery) return rows;

		return rows.filter((row) => {
			return (
				(row.orderNo && row.orderNo.toLowerCase().includes(cleanQuery)) ||
				(row.orderName && row.orderName.toLowerCase().includes(cleanQuery)) ||
				(row.customer && row.customer.toLowerCase().includes(cleanQuery)) ||
				(row.projectManager && row.projectManager.toLowerCase().includes(cleanQuery))
			);
		});
	}, [rows, searchQuery]);

	// Null-safe sorting
	const sortedRows = useMemo(() => {
		return [...filteredRows].sort((a, b) => {
			const valA = a[sortField] ?? "";
			const valB = b[sortField] ?? "";

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

	const addInspectionDate = useCallback(
		async (newDate: Omit<InspectionDateItem, "id">) => {
			const created = await createVisitDateApi(
				orderId || GUARANTEE_CONSTANTS.DEFAULT_ORDER_ID,
				newDate
			);
			setInspectionDates((prev) => [...prev, created]);
			return created;
		},
		[orderId]
	);

	const updateInspectionDate = useCallback(
		async (id: string, updated: Partial<InspectionDateItem>) => {
			const res = await updateVisitDateApi(
				orderId || GUARANTEE_CONSTANTS.DEFAULT_ORDER_ID,
				id,
				updated
			);
			setInspectionDates((prev) =>
				prev.map((item) => (item.id === id ? { ...item, ...res } : item))
			);
			return res;
		},
		[orderId]
	);

	const deleteInspectionDate = useCallback(
		async (id: string) => {
			await deleteVisitDateApi(orderId || GUARANTEE_CONSTANTS.DEFAULT_ORDER_ID, id);
			setInspectionDates((prev) => prev.filter((item) => item.id !== id));
		},
		[orderId]
	);

	return {
		rows,
		isLoading,
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
		updateInspectionDate,
		deleteInspectionDate,
	};
}
