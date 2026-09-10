"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
	getWarrantyOverview,
	getWarrantyDetail,
	createVisitDateApi,
	updateVisitDateApi,
	deleteVisitDateApi,
} from "../api/warranty.api";
import { WARRANTY_CONSTANTS } from "../constants/warranty.constants";
import { MOCK_WARRANTY_ROWS, MOCK_INSPECTION_DATES } from "../data/warranty.mock";
import type { WarrantyRow, InspectionDateItem } from "../types/warranty.types";

export type WarrantySortField =
	| "recordNo"
	| "recordName"
	| "startDate"
	| "approvedDate"
	| "warrantyPeriod"
	| "projectManager"
	| "customer";
export type SortOrder = "asc" | "desc";

export function useWarranty(orderId?: string) {
	const [rows, setRows] = useState<WarrantyRow[]>(MOCK_WARRANTY_ROWS);
	const [inspectionDates, setInspectionDates] = useState<InspectionDateItem[]>(MOCK_INSPECTION_DATES);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortField, setSortField] = useState<WarrantySortField>("recordNo");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Load data from API
	useEffect(() => {
		let isMounted = true;
		setIsLoading(true);

		if (orderId) {
			getWarrantyDetail(orderId)
				.then((res) => {
					if (isMounted) {
						setInspectionDates(res.visitDates);
					}
				})
				.finally(() => {
					if (isMounted) setIsLoading(false);
				});
		} else {
			getWarrantyOverview()
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

	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	}, []);

	const handleStatusFilterChange = useCallback((filter: string) => {
		setStatusFilter(filter);
		setCurrentPage(1);
	}, []);

	const handleSort = (field: WarrantySortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	// Filter rows with sanitized search query & warranty/status filter
	const filteredRows = useMemo(() => {
		const cleanQuery = searchQuery.trim().toLowerCase();
		const cleanFilter = statusFilter.trim().toLowerCase();

		return rows.filter((row) => {
			const matchesSearch =
				!cleanQuery ||
				(row.recordNo && row.recordNo.toLowerCase().includes(cleanQuery)) ||
				(row.recordName && row.recordName.toLowerCase().includes(cleanQuery)) ||
				(row.customer && row.customer.toLowerCase().includes(cleanQuery)) ||
				(row.projectManager && row.projectManager.toLowerCase().includes(cleanQuery)) ||
				(row.warrantyPeriod && row.warrantyPeriod.toLowerCase().includes(cleanQuery)) ||
				(row.startDate && row.startDate.toLowerCase().includes(cleanQuery)) ||
				(row.approvedDate && row.approvedDate.toLowerCase().includes(cleanQuery));

			const matchesFilter =
				cleanFilter === "all" ||
				(row.warrantyPeriod && row.warrantyPeriod.toLowerCase() === cleanFilter) ||
				(row.projectManager && row.projectManager.toLowerCase() === cleanFilter);

			return matchesSearch && matchesFilter;
		});
	}, [rows, searchQuery, statusFilter]);

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
				orderId || WARRANTY_CONSTANTS.DEFAULT_ORDER_ID,
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
				orderId || WARRANTY_CONSTANTS.DEFAULT_ORDER_ID,
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
			await deleteVisitDateApi(orderId || WARRANTY_CONSTANTS.DEFAULT_ORDER_ID, id);
			setInspectionDates((prev) => prev.filter((item) => item.id !== id));
		},
		[orderId]
	);

	return {
		rows,
		isLoading,
		searchQuery,
		setSearchQuery,
		handleSearchChange,
		statusFilter,
		setStatusFilter,
		handleStatusFilterChange,
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
