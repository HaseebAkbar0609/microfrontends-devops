"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { WARRANTY_CONSTANTS } from "../constants/warranty.constants";
import {
	getWarrantyOverview,
	getWarrantyDetail,
	createVisitDateApi,
	deleteVisitDateApi,
} from "../api/warranty.api";
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

export function useWarranty(orderId?: string) {
	const [rows, setRows] = useState<WarrantyRow[]>(MOCK_WARRANTY_ROWS);
	const [inspectionDates, setInspectionDates] = useState<InspectionDateItem[]>(MOCK_INSPECTION_DATES);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>(WARRANTY_CONSTANTS.DEFAULT_STATUS_ALL);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortField, setSortField] = useState<WarrantySortField>("orderNo");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(WARRANTY_CONSTANTS.DEFAULT_PAGE_SIZE);

	// Load data from API with fallback
	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			if (orderId) {
				const detail = await getWarrantyDetail(orderId);
				if (detail?.visitDates) {
					setInspectionDates(detail.visitDates);
				}
			} else {
				const data = await getWarrantyOverview();
				if (Array.isArray(data) && data.length > 0) {
					setRows(data);
				}
			}
		} catch (error) {
			console.warn("[useWarranty] Load data failed:", error);
		} finally {
			setIsLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleSort = (field: WarrantySortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	// Filter rows with trimmed query and status filter (all / active / inactive)
	const filteredRows = useMemo(() => {
		const cleanQuery = searchQuery.trim().toLowerCase();
		const today = new Date().toISOString().split("T")[0];

		let result = rows;

		if (statusFilter === "active") {
			result = result.filter((row) => {
				if (!row.warrantyEndDate) return true;
				return row.warrantyEndDate >= today;
			});
		} else if (statusFilter === "inactive") {
			result = result.filter((row) => {
				if (!row.warrantyEndDate) return false;
				return row.warrantyEndDate < today;
			});
		}

		if (cleanQuery) {
			result = result.filter((row) => {
				return (
					(row.orderNo && row.orderNo.toLowerCase().includes(cleanQuery)) ||
					(row.orderName && row.orderName.toLowerCase().includes(cleanQuery)) ||
					(row.startDate && row.startDate.toLowerCase().includes(cleanQuery)) ||
					(row.approvedDate && row.approvedDate.toLowerCase().includes(cleanQuery)) ||
					(row.warrantyPeriod && row.warrantyPeriod.toLowerCase().includes(cleanQuery)) ||
					(row.customer && row.customer.toLowerCase().includes(cleanQuery)) ||
					(row.projectManager && row.projectManager.toLowerCase().includes(cleanQuery))
				);
			});
		}

		return result;
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

	const addInspectionDate = async (newDate: Omit<InspectionDateItem, "id">) => {
		const targetOrderId = orderId || WARRANTY_CONSTANTS.DEFAULT_ORDER_ID;
		try {
			const created = await createVisitDateApi(targetOrderId, newDate);
			setInspectionDates((prev) => [...prev, created]);
			showToast("success", localizationConstants.toastVisitDateAdded);
		} catch (error) {
			console.error("[useWarranty] Add inspection date failed:", error);
			showToast("error", localizationConstants.genericError);
		}
	};

	const deleteInspectionDate = async (id: string) => {
		const targetOrderId = orderId || WARRANTY_CONSTANTS.DEFAULT_ORDER_ID;
		try {
			await deleteVisitDateApi(targetOrderId, id);
			setInspectionDates((prev) => prev.filter((item) => item.id !== id));
			showToast("success", localizationConstants.toastVisitDateDeleted);
		} catch (error) {
			console.error("[useWarranty] Delete inspection date failed:", error);
			showToast("error", localizationConstants.genericError);
		}
	};

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
		deleteInspectionDate,
		refetch: loadData,
	};
}
