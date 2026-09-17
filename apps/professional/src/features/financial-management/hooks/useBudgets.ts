"use client";

import { useState, useMemo, useCallback } from "react";
import type {
	EconomyBudgetItem,
	BudgetFormData,
	BudgetStatus,
	BudgetSortField,
	SortOrder,
} from "../types/budget.types";
import { budgetRepository } from "../utils/budgetRepository";
import { BUDGET_DEFAULT_PAGE_SIZE } from "../constants/budget.constants";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";

export function useBudgets() {
	const { t } = useTranslation();
	const [allItems, setAllItems] = useState<EconomyBudgetItem[]>(() =>
		budgetRepository.getAll(),
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "inactive" | "overhead"
	>("all");
	const [dateFilter, setDateFilter] = useState<string>("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<BudgetSortField>("budgetnr");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(BUDGET_DEFAULT_PAGE_SIZE);

	const refreshData = useCallback(() => {
		setAllItems(budgetRepository.getAll());
	}, []);

	// Filter
	const filteredItems = useMemo(() => {
		return allItems.filter((item) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchName = item.budgetName.toLowerCase().includes(q);
				const matchNr = item.budgetnr.toLowerCase().includes(q);
				const matchDesc = item.description?.toLowerCase().includes(q) ?? false;
				const matchTag = item.tags?.toLowerCase().includes(q) ?? false;
				if (!matchName && !matchNr && !matchDesc && !matchTag) return false;
			}

			if (statusFilter === "active" && item.status !== "active") return false;
			if (statusFilter === "inactive" && item.status !== "inactive") return false;
			if (statusFilter === "overhead" && !item.isOverhead) return false;

			if (dateFilter && !item.datum.startsWith(dateFilter)) return false;

			return true;
		});
	}, [allItems, searchQuery, statusFilter, dateFilter]);

	// Sort
	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a, b) => {
			let valA: string | number = "";
			let valB: string | number = "";

			switch (sortBy) {
				case "budgetnr": {
					const numA = Number(a.budgetnr);
					const numB = Number(b.budgetnr);
					if (!isNaN(numA) && !isNaN(numB)) {
						valA = numA;
						valB = numB;
					} else {
						valA = a.budgetnr.toLowerCase();
						valB = b.budgetnr.toLowerCase();
					}
					break;
				}
				case "budgetName":
					valA = a.budgetName.toLowerCase();
					valB = b.budgetName.toLowerCase();
					break;
				case "datum":
					valA = a.datum;
					valB = b.datum;
					break;
				case "totalKostnad":
					valA = a.totalKostnad;
					valB = b.totalKostnad;
					break;
				case "totalInkomst":
					valA = a.totalInkomst;
					valB = b.totalInkomst;
					break;
				default:
					return 0;
			}

			if (valA < valB) return sortOrder === "asc" ? -1 : 1;
			if (valA > valB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredItems, sortBy, sortOrder]);

	// Pagination
	const totalCount = sortedItems.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedItems.slice(start, start + pageSize);
	}, [sortedItems, currentPage, pageSize]);

	const handleSort = useCallback(
		(field: BudgetSortField) => {
			if (sortBy === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy],
	);

	// Selection
	const toggleSelect = useCallback((id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	}, []);

	const toggleSelectAll = useCallback(() => {
		setSelectedIds((prev) => {
			const currentPaginatedIds = paginatedItems.map((item) => item.id);
			const allSelected = currentPaginatedIds.every((id) => prev.includes(id));
			if (allSelected) {
				return prev.filter((id) => !currentPaginatedIds.includes(id));
			}
			return Array.from(new Set([...prev, ...currentPaginatedIds]));
		});
	}, [paginatedItems]);

	const clearSelection = useCallback(() => {
		setSelectedIds([]);
	}, []);

	// Actions
	const createBudget = useCallback(
		(data: BudgetFormData) => {
			const created = budgetRepository.create(data);
			refreshData();
			toast.success(t(localizationConstants.toastBudgetCreated));
			return created;
		},
		[refreshData, t],
	);

	const updateBudget = useCallback(
		(id: string, data: Partial<BudgetFormData>) => {
			const updated = budgetRepository.update(id, data);
			refreshData();
			toast.success(t(localizationConstants.toastBudgetUpdated));
			return updated;
		},
		[refreshData, t],
	);

	const deleteBudget = useCallback(
		(id: string) => {
			const success = budgetRepository.delete(id);
			if (success) {
				refreshData();
				setSelectedIds((prev) => prev.filter((i) => i !== id));
				toast.success(t(localizationConstants.toastBudgetDeleted));
			}
			return success;
		},
		[refreshData, t],
	);

	const toggleFavorite = useCallback(
		(id: string) => {
			budgetRepository.toggleFavorite(id);
			refreshData();
		},
		[refreshData],
	);

	const toggleStatus = useCallback(
		(id: string) => {
			const newStatus = budgetRepository.toggleStatus(id);
			refreshData();
			toast.success(t(localizationConstants.toastBudgetStatusUpdated));
			return newStatus;
		},
		[refreshData, t],
	);

	const bulkSetStatus = useCallback(
		(ids: string[], status: BudgetStatus) => {
			budgetRepository.bulkSetStatus(ids, status);
			refreshData();
			clearSelection();
			toast.success(t(localizationConstants.toastBudgetBulkUpdated));
		},
		[refreshData, clearSelection, t],
	);

	const resetSeedData = useCallback(() => {
		budgetRepository.resetSeedData();
		refreshData();
		clearSelection();
		toast.success(t(localizationConstants.btnResetSeedData));
	}, [refreshData, clearSelection, t]);

	// KPIs calculation
	const kpis = useMemo(() => {
		const totalBudgeted = allItems.reduce(
			(sum, item) => sum + (item.totalInkomst || 0),
			0,
		);
		const actualSpent = allItems.reduce(
			(sum, item) => sum + (item.totalKostnad || 0),
			0,
		);
		const remaining = totalBudgeted - actualSpent;
		const utilization =
			totalBudgeted > 0 ? Math.round((actualSpent / totalBudgeted) * 100) : 0;

		return {
			totalBudgeted,
			actualSpent,
			remaining,
			utilization,
		};
	}, [allItems]);

	return {
		items: paginatedItems,
		allItems,
		totalCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		dateFilter,
		setDateFilter,
		selectedIds,
		toggleSelect,
		toggleSelectAll,
		clearSelection,
		sortBy,
		sortOrder,
		handleSort,
		createBudget,
		updateBudget,
		deleteBudget,
		toggleFavorite,
		toggleStatus,
		bulkSetStatus,
		resetSeedData,
		kpis,
	};
}
