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
import { DEFAULT_ANNUAL_EXPENSE_BUDGET } from "../constants/expense.constants";

export type ExpenseActiveSubTab = "supplier_list" | "inbox";

export function useExpenseList(activeSubTab: ExpenseActiveSubTab = "supplier_list") {
	const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

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
	const [pageSize, setPageSize] = useState<number>(10);

	// Modals & confirmation dialogs
	const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
	const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
	const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	// Load & Subscribe to repository
	useEffect(() => {
		const initial = expenseRepository.getAllExpenses();
		setExpenses(initial);
		setIsLoading(false);

		const unsubscribe = expenseRepository.subscribe((updated) => {
			setExpenses(updated);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	// Calculated Summary Stats
	const summaryStats: ExpenseSummaryStats = useMemo(() => {
		const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

		const pendingItems = expenses.filter(
			(item) => item.status === "pending" || item.status === "ej_attesterad"
		);
		const pendingApprovalCount = pendingItems.length;
		const pendingApprovalAmount = pendingItems.reduce((sum, item) => sum + item.amount, 0);

		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
		const currentMonthPrefix = `${currentYear}-${currentMonth}`;

		const thisMonthItems = expenses.filter(
			(item) => item.date.startsWith(currentMonthPrefix) || item.date.startsWith("2026-01")
		);
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
			if (item.project) set.add(item.project);
		});
		return Array.from(set);
	}, [expenses]);

	// Filtered list based on active sub-tab and search/filters
	const filteredExpenses = useMemo(() => {
		return expenses.filter((item) => {
			// Sub-tab filter: inbox vs all supplier list
			if (activeSubTab === "inbox" && !item.isInboxItem) {
				return false;
			}

			// Search query match
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchSupplier = item.supplier.toLowerCase().includes(q);
				const matchFaktura = item.fakturaNo?.toLowerCase().includes(q) || false;
				const matchNo = item.expenseNo.toLowerCase().includes(q);
				const matchProject = item.project.toLowerCase().includes(q);
				const matchNotes = item.notes?.toLowerCase().includes(q) || false;
				const matchAttest = item.attestResponsible?.toLowerCase().includes(q) || false;

				if (!matchSupplier && !matchFaktura && !matchNo && !matchProject && !matchNotes && !matchAttest) {
					return false;
				}
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
	}, [expenses, activeSubTab, searchQuery, statusFilter, categoryFilter, projectFilter]);

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

	// Checkbox Selection
	const toggleSelectExpense = useCallback((id: string) => {
		setSelectedExpenseIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	}, []);

	const toggleSelectAll = useCallback(() => {
		setSelectedExpenseIds((prev) =>
			prev.length === paginatedExpenses.length ? [] : paginatedExpenses.map((e) => e.id)
		);
	}, [paginatedExpenses]);

	// Action executions
	const executeApprove = useCallback(() => {
		if (!confirmApproveId) return;
		expenseRepository.updateExpenseStatus(confirmApproveId, "klar");
		setConfirmApproveId(null);
	}, [confirmApproveId]);

	const executeReject = useCallback(() => {
		if (!confirmRejectId) return;
		expenseRepository.updateExpenseStatus(confirmRejectId, "reklamerad");
		setConfirmRejectId(null);
	}, [confirmRejectId]);

	const executeMarkPaid = useCallback((id: string) => {
		expenseRepository.updateExpenseStatus(id, "paid");
	}, []);

	const executeDelete = useCallback(() => {
		if (!confirmDeleteId) return;
		expenseRepository.deleteExpense(confirmDeleteId);
		setConfirmDeleteId(null);
	}, [confirmDeleteId]);

	return {
		expenses: paginatedExpenses,
		totalCount: filteredExpenses.length,
		isLoading,
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
		selectedExpense,
		setSelectedExpense,
		confirmApproveId,
		setConfirmApproveId,
		confirmRejectId,
		setConfirmRejectId,
		confirmDeleteId,
		setConfirmDeleteId,
		executeApprove,
		executeReject,
		executeMarkPaid,
		executeDelete,
	};
}
