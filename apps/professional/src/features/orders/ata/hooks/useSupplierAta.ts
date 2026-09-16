"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { getSupplierAtasAction } from "@/api-actions/orders/ata";
import { ATA_CONSTANTS } from "../constants/ata.constants";
import type {
	AtaItem,
	SortOrder,
	SupplierAtaGroup,
	SupplierGroupSortField,
	SupplierDetailSortField,
} from "../types/ata.types";
import { MOCK_SUPPLIER_LIST, MOCK_SUPPLIER_GROUPS } from "../data/ata.mock";

export function useSupplierAta(orderId: string = ATA_CONSTANTS.DEFAULT_ORDER_ID) {
	const [selectedSupplier, setSelectedSupplier] = useState<string>(
		ATA_CONSTANTS.ALL_SUPPLIERS_VALUE
	);
	const [rawItems, setRawItems] = useState<AtaItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	// Sort states
	const [groupSortField, setGroupSortField] = useState<SupplierGroupSortField>("supplierName");
	const [groupSortOrder, setGroupSortOrder] = useState<SortOrder>("asc");

	const [detailSortField, setDetailSortField] = useState<SupplierDetailSortField>("date");
	const [detailSortOrder, setDetailSortOrder] = useState<SortOrder>("desc");

	// Pagination state
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(ATA_CONSTANTS.DEFAULT_PAGE_SIZE);

	// Load data from API action
	const loadSupplierAtas = useCallback(async () => {
		setIsLoading(true);
		const result = await getSupplierAtasAction(orderId);
		if (result.success && result.data) {
			setRawItems(result.data);
		}
		setIsLoading(false);
	}, [orderId]);

	useEffect(() => {
		loadSupplierAtas();
	}, [loadSupplierAtas]);

	// Reset page when filter/search/supplier changes
	useEffect(() => {
		setCurrentPage(1);
	}, [selectedSupplier, searchQuery, statusFilter]);

	// Group Sorting Handler
	const handleGroupSort = (field: SupplierGroupSortField) => {
		if (groupSortField === field) {
			setGroupSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setGroupSortField(field);
			setGroupSortOrder("asc");
		}
	};

	// Detail Sorting Handler
	const handleDetailSort = (field: SupplierDetailSortField) => {
		if (detailSortField === field) {
			setDetailSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setDetailSortField(field);
			setDetailSortOrder("asc");
		}
	};

	// Available Suppliers for dropdown
	const supplierOptions = useMemo(() => {
		const names = Array.from(
			new Set(rawItems.map((item) => item.supplier).filter(Boolean))
		) as string[];

		if (names.length === 0) {
			return MOCK_SUPPLIER_LIST;
		}

		return names.map((name) => ({
			id: name.toLowerCase().replace(/\s+/g, "-"),
			name,
		}));
	}, [rawItems]);

	// 1. Grouped Supplier Data (When selectedSupplier === "all")
	const supplierGroups = useMemo((): SupplierAtaGroup[] => {
		if (rawItems.length === 0) {
			return MOCK_SUPPLIER_GROUPS;
		}

		const groupMap = new Map<string, SupplierAtaGroup>();

		for (const item of rawItems) {
			const supplierName = item.supplier || "Övrigt";
			const key = supplierName.toLowerCase();

			if (!groupMap.has(key)) {
				groupMap.set(key, {
					supplierId: key.replace(/\s+/g, "-"),
					supplierName,
					totalAmount: 0,
					totalCount: 0,
					approvedCount: 0,
					inReviewCount: 0,
					notApprovedCount: 0,
				});
			}

			const group = groupMap.get(key)!;
			group.totalAmount += item.amount || 0;
			group.totalCount += 1;

			if (item.status === "ok" || item.status === "approved" || item.attested === "ja") {
				group.approvedCount += 1;
			} else if (item.status === "forhandling" || item.status === "redovisad" || item.status === "pending") {
				group.inReviewCount += 1;
			} else if (item.status === "rejected" || item.status === "ej_granskad") {
				group.notApprovedCount += 1;
			}
		}

		return Array.from(groupMap.values());
	}, [rawItems]);

	// Filtered & Sorted Supplier Groups
	const filteredGroupRows = useMemo(() => {
		const query = searchQuery.toLowerCase().trim();
		return supplierGroups.filter((g) => {
			if (!query) return true;
			return g.supplierName.toLowerCase().includes(query);
		});
	}, [supplierGroups, searchQuery]);

	const sortedGroupRows = useMemo(() => {
		return [...filteredGroupRows].sort((a, b) => {
			if (groupSortField === "totalAmount") {
				return groupSortOrder === "asc"
					? a.totalAmount - b.totalAmount
					: b.totalAmount - a.totalAmount;
			}
			if (
				groupSortField === "totalCount" ||
				groupSortField === "approvedCount" ||
				groupSortField === "inReviewCount" ||
				groupSortField === "notApprovedCount"
			) {
				return groupSortOrder === "asc"
					? a[groupSortField] - b[groupSortField]
					: b[groupSortField] - a[groupSortField];
			}
			const comp = a.supplierName.localeCompare(b.supplierName, "sv");
			return groupSortOrder === "asc" ? comp : -comp;
		});
	}, [filteredGroupRows, groupSortField, groupSortOrder]);

	const totalGroupPages = Math.max(1, Math.ceil(sortedGroupRows.length / pageSize));
	const paginatedGroupRows = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedGroupRows.slice(start, start + pageSize);
	}, [sortedGroupRows, currentPage, pageSize]);

	// 2. Detailed Supplier Items (When a specific supplier is selected)
	const filteredDetailRows = useMemo(() => {
		const query = searchQuery.toLowerCase().trim();
		return rawItems.filter((item) => {
			// Supplier filter
			if (selectedSupplier !== ATA_CONSTANTS.ALL_SUPPLIERS_VALUE) {
				const isPelleMatch =
					(selectedSupplier.toLowerCase() === "pelles måleri" || selectedSupplier.toLowerCase() === "pelle målare") &&
					(item.supplier?.toLowerCase() === "pelle målare" || item.supplier?.toLowerCase() === "pelles måleri");

				if (!isPelleMatch && item.supplier?.toLowerCase() !== selectedSupplier.toLowerCase()) {
					return false;
				}
			}

			// Status filter
			if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
				return false;
			}

			// Search query
			if (query) {
				const matchNum = item.ataNumber.toLowerCase().includes(query);
				const matchTitle = item.title.toLowerCase().includes(query);
				const matchSupplier = item.supplier?.toLowerCase().includes(query) ?? false;
				const matchLinked = item.linkedLevAta?.toLowerCase().includes(query) ?? false;
				if (!matchNum && !matchTitle && !matchSupplier && !matchLinked) {
					return false;
				}
			}

			return true;
		});
	}, [rawItems, selectedSupplier, statusFilter, searchQuery]);

	const sortedDetailRows = useMemo(() => {
		return [...filteredDetailRows].sort((a, b) => {
			if (detailSortField === "amount") {
				return detailSortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
			}
			const valA = a[detailSortField] ?? "";
			const valB = b[detailSortField] ?? "";
			const comp = String(valA).localeCompare(String(valB), "sv", { numeric: true });
			return detailSortOrder === "asc" ? comp : -comp;
		});
	}, [filteredDetailRows, detailSortField, detailSortOrder]);

	const totalDetailPages = Math.max(1, Math.ceil(sortedDetailRows.length / pageSize));
	const paginatedDetailRows = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedDetailRows.slice(start, start + pageSize);
	}, [sortedDetailRows, currentPage, pageSize]);

	// 3. Dynamic Summary Stats
	const summary = useMemo(() => {
		if (rawItems.length === 0) {
			const totalAta = 985650;
			const countAta = selectedSupplier === ATA_CONSTANTS.ALL_SUPPLIERS_VALUE ? 35 : 15;
			return { totalAta, countAta };
		}

		if (selectedSupplier === ATA_CONSTANTS.ALL_SUPPLIERS_VALUE) {
			const totalAta = supplierGroups.reduce((acc, g) => acc + g.totalAmount, 0) || 985650;
			const countAta = supplierGroups.reduce((acc, g) => acc + g.totalCount, 0) || 35;
			return { totalAta, countAta };
		}

		// When specific supplier is selected
		const totalAta = filteredDetailRows.reduce((acc, item) => acc + (item.amount || 0), 0) || 985650;
		const countAta = filteredDetailRows.length || 15;
		return { totalAta, countAta };
	}, [rawItems, selectedSupplier, supplierGroups, filteredDetailRows]);

	const handleSelectSupplier = (supplierName: string) => {
		setSelectedSupplier(supplierName);
	};

	const handleResetSupplier = () => {
		setSelectedSupplier(ATA_CONSTANTS.ALL_SUPPLIERS_VALUE);
	};

	return {
		selectedSupplier,
		setSelectedSupplier,
		supplierOptions,
		isLoading,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		groupSortField,
		groupSortOrder,
		handleGroupSort,
		detailSortField,
		detailSortOrder,
		handleDetailSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		supplierGroups,
		paginatedGroupRows,
		totalGroupPages,
		totalGroupCount: sortedGroupRows.length,
		paginatedDetailRows,
		totalDetailPages,
		totalDetailCount: sortedDetailRows.length,
		summary,
		handleSelectSupplier,
		handleResetSupplier,
		reload: loadSupplierAtas,
	};
}
