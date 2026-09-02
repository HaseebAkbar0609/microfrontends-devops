"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
	ExpenseItem,
	ExpenseStatus,
	ExpenseCategory,
	ExpenseSortField,
	ExpenseSummaryStats,
} from "../types/expense.types";
import { expenseRepository } from "../utils/expenseRepository";
import { DEFAULT_ANNUAL_EXPENSE_BUDGET, EXPENSE_DEFAULT_PAGE_SIZE } from "../constants/expense.constants";

export type ExpenseActiveSubTab = "supplier_list" | "inbox";

/**
 * Helper to match an item against the search query string
 */
function matchesSearchQuery(item: ExpenseItem, query: string): boolean {
	if (!query) return true;
	const q = query.toLowerCase();
	return (
		item.supplier.toLowerCase().includes(q) ||
		(item.fakturaNo?.toLowerCase().includes(q) ?? false) ||
		item.expenseNo.toLowerCase().includes(q) ||
		item.project.toLowerCase().includes(q) ||
		(item.notes?.toLowerCase().includes(q) ?? false) ||
		(item.attestResponsible?.toLowerCase().includes(q) ?? false)
	);
}

export function useExpenseList(activeSubTab: ExpenseActiveSubTab = "supplier_list") {
	const [expenses, setExpenses] = useState<ExpenseItem[]>(() => expenseRepository.getAllExpenses());
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Selection state
	const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);

	// Filters
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<ExpenseStatus | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
	const [projectFilter, setProjectFilter] = useState<string | "all">("all");

	// Sorting
	const [sortField, setSortField] = useState<ExpenseSortField>("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Pagination
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(EXPENSE_DEFAULT_PAGE_SIZE);

	// Modals & confirmation dialogs
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	// Subscribe to in-memory repository updates
	useEffect(() => {
		const unsubscribe = expenseRepository.subscribe((updated) => {
			setExpenses(updated);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	// Calculated Summary Stats (Standard #1 & #7 - dynamic dates & memoization)
	const summaryStats: ExpenseSummaryStats = useMemo(() => {
		const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

		const pendingItems = expenses.filter(
			(item) => item.status === "pending" || item.status === "ej_attesterad"
		);
		const pendingApprovalCount = pendingItems.length;
		const pendingApprovalAmount = pendingItems.reduce((sum, item) => sum + item.amount, 0);

		const now = new Date();
		const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

		const thisMonthItems = expenses.filter((item) => item.date.startsWith(currentMonthPrefix));
		const thisMonthAmount = thisMonthItems.reduce((sum, item) => sum + item.amount, 0);

		const budgetUtilizationPercentage = Math.round(
			(totalExpenses / DEFAULT_ANNUAL_EXPENSE_BUDGET) * 100
		);

		return {
			totalExpenses,
			pendingApprovalCount,
			pendingApprovalAmount,
			thisMonthAmount,
			budgetUtilizationPercentage,
		};
	}, [expenses]);

	// Extract unique projects for dropdown filter
	const availableProjects = useMemo(() => {
		const set = new Set<string>();
		expenses.forEach((item) => {
			if (item.project && item.project !== "-") {
				set.add(item.project);
			}
		});
		return Array.from(set);
	}, [expenses]);

	const normalizedSearch = searchQuery.trim();

	// Filtered list with granular dependencies (Standard #7)
	const filteredExpenses = useMemo(() => {
		return expenses.filter((item) => {
			// Sub-tab partition
			if (activeSubTab === "inbox" && !item.isInboxItem) return false;
			if (activeSubTab === "supplier_list" && item.isInboxItem) return false;

			// Search matching
			if (normalizedSearch && !matchesSearchQuery(item, normalizedSearch)) {
				return false;
			}

			// Status filter
			if (statusFilter !== "all" && item.status !== statusFilter) {
				return false;
			}

			// Category filter
			if (categoryFilter !== "all" && item.category !== categoryFilter) {
				return false;
			}

			// Project filter
			if (projectFilter !== "all" && item.project !== projectFilter) {
				return false;
			}

			return true;
		});
	}, [expenses, activeSubTab, normalizedSearch, statusFilter, categoryFilter, projectFilter]);

	// Sorted list
	const sortedExpenses = useMemo(() => {
		return [...filteredExpenses].sort((a, b) => {
			const valA = a[sortField] ?? "";
			const valB = b[sortField] ?? "";

			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}

			const strA = String(valA).toLowerCase();
			const strB = String(valB).toLowerCase();

			if (strA < strB) return sortOrder === "asc" ? -1 : 1;
			if (strA > strB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredExpenses, sortField, sortOrder]);

	// Pagination
	const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / pageSize));
	const paginatedExpenses = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedExpenses.slice(start, start + pageSize);
	}, [sortedExpenses, currentPage, pageSize]);

	// Sort handler
	const handleSort = useCallback(
		(field: ExpenseSortField) => {
			if (sortField === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortField(field);
				setSortOrder("asc");
			}
			setCurrentPage(1);
		},
		[sortField]
	);

	// Selection handlers
	const toggleSelectExpense = useCallback((id: string) => {
		setSelectedExpenseIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	}, []);

	const toggleSelectAll = useCallback(() => {
		const currentPaginatedIds = paginatedExpenses.map((e) => e.id);
		const allCurrentlySelected = currentPaginatedIds.every((id) =>
			selectedExpenseIds.includes(id)
		);

		if (allCurrentlySelected) {
			setSelectedExpenseIds((prev) =>
				prev.filter((id) => !currentPaginatedIds.includes(id))
			);
		} else {
			setSelectedExpenseIds((prev) => Array.from(new Set([...prev, ...currentPaginatedIds])));
		}
	}, [paginatedExpenses, selectedExpenseIds]);

	// Safe mutation execution (Standard #5)
	const executeDelete = useCallback(async () => {
		if (!confirmDeleteId) return;
		await expenseRepository.deleteExpense(confirmDeleteId);
		setConfirmDeleteId(null);
	}, [confirmDeleteId]);

	return {
		expenses: paginatedExpenses,
		totalCount: filteredExpenses.length,
		isLoading,
		setIsLoading,
		summaryStats,
		availableProjects,
		selectedExpenseIds,
		toggleSelectExpense,
		toggleSelectAll,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		categoryFilter,
		setCategoryFilter,
		projectFilter,
		setProjectFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		confirmDeleteId,
		setConfirmDeleteId,
		executeDelete,
	};
}
