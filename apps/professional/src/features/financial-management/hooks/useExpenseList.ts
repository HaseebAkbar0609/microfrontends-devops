"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
	ExpenseItem,
	ExpenseStatus,
	ExpenseCategory,
	ExpenseSortField,
	ExpenseSummaryStats,
} from "../types/expense.types";
import { expenseRepository } from "../utils/expenseRepository";
import { DEFAULT_ANNUAL_EXPENSE_BUDGET } from "../constants/expense.constants";

export function useExpenseList() {
	const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Filtering & Searching State
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<ExpenseStatus | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
	const [projectFilter, setProjectFilter] = useState<string | "all">("all");

	// Sorting & Pagination State
	const [sortField, setSortField] = useState<ExpenseSortField>("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 10;

	// Action & Modal States
	const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
	const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
	const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	const loadExpenses = useCallback(() => {
		try {
			const data = expenseRepository.getExpenses();
			setExpenses(data);
		} catch (e) {
			console.error("Failed to load expenses:", e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		setIsLoading(true);
		loadExpenses();

		const unsubscribe = expenseRepository.subscribe(() => {
			loadExpenses();
		});

		return () => {
			unsubscribe();
		};
	}, [loadExpenses]);

	// Unique project list for filter dropdown
	const availableProjects = useMemo(() => {
		const set = new Set<string>();
		expenses.forEach((item) => {
			if (item.project) set.add(item.project);
		});
		return Array.from(set);
	}, [expenses]);

	// Dynamic KPI Summary Calculation - strictly memoized by expenses array
	const summaryStats: ExpenseSummaryStats = useMemo(() => {
		let totalExpenses = 0;
		let pendingApprovalCount = 0;
		let pendingApprovalAmount = 0;
		let thisMonthAmount = 0;

		const currentYearMonth = "2025-05"; // Reference operational period

		expenses.forEach((item) => {
			const amount = Number(item.amount) || 0;
			totalExpenses += amount;

			if (item.status === "pending") {
				pendingApprovalCount += 1;
				pendingApprovalAmount += amount;
			}

			if (item.date && item.date.startsWith(currentYearMonth)) {
				thisMonthAmount += amount;
			}
		});

		const budgetUtilizationPercentage = Math.round(
			(totalExpenses / DEFAULT_ANNUAL_EXPENSE_BUDGET) * 100,
		);

		return {
			totalExpenses,
			pendingApprovalCount,
			pendingApprovalAmount,
			thisMonthAmount,
			budgetUtilizationPercentage,
		};
	}, [expenses]);

	// Filtered list
	const filteredExpenses = useMemo(() => {
		const q = searchQuery.toLowerCase().trim();

		return expenses.filter((item) => {
			// Search matches supplier, category, project, expenseNo, notes
			if (q) {
				const matchesSupplier = item.supplier.toLowerCase().includes(q);
				const matchesCategory = item.category.toLowerCase().includes(q);
				const matchesProject = item.project.toLowerCase().includes(q);
				const matchesNo = item.expenseNo.toLowerCase().includes(q);
				const matchesNotes = item.notes?.toLowerCase().includes(q) || false;
				if (!matchesSupplier && !matchesCategory && !matchesProject && !matchesNo && !matchesNotes) {
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
	}, [expenses, searchQuery, statusFilter, categoryFilter, projectFilter]);

	// Sorted list
	const sortedExpenses = useMemo(() => {
		return [...filteredExpenses].sort((a, b) => {
			const valA = a[sortField] || "";
			const valB = b[sortField] || "";

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

	const handleSort = useCallback(
		(field: ExpenseSortField) => {
			if (sortField === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortField(field);
				setSortOrder("desc");
			}
			setCurrentPage(1);
		},
		[sortField],
	);

	// Action Handlers
	const executeApprove = useCallback(() => {
		if (!confirmApproveId) return;
		expenseRepository.approveExpense(confirmApproveId);
		setConfirmApproveId(null);
		toast.success("Utlägget har godkänts");
	}, [confirmApproveId]);

	const executeReject = useCallback(() => {
		if (!confirmRejectId) return;
		expenseRepository.rejectExpense(confirmRejectId);
		setConfirmRejectId(null);
		toast.success("Utlägget har avvisats");
	}, [confirmRejectId]);

	const executeMarkPaid = useCallback((id: string) => {
		expenseRepository.markAsPaid(id);
		toast.success("Utlägget har markerats som betalt");
	}, []);

	const executeDelete = useCallback(() => {
		if (!confirmDeleteId) return;
		expenseRepository.deleteExpense(confirmDeleteId);
		setConfirmDeleteId(null);
		toast.success("Utlägget har tagits bort");
	}, [confirmDeleteId]);

	return {
		expenses: paginatedExpenses,
		totalCount: sortedExpenses.length,
		isLoading,
		summaryStats,
		availableProjects,
		// Filters
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		categoryFilter,
		setCategoryFilter,
		projectFilter,
		setProjectFilter,
		// Sort & Pagination
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		totalPages,
		// Modals & Actions
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

export default useExpenseList;
