"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type {
	DataItEmployeeOverview,
	DataItOverviewFilterStatus,
	DataItSortState,
	DataItOverviewSortField,
} from "../types/dataItOverview.types";
import {
	DATA_IT_STORAGE_KEY,
	DEFAULT_PAGE_SIZE,
	DEFAULT_SORT_FIELD,
	DEFAULT_SORT_DIRECTION,
} from "../constants/dataItOverview.constants";
import { initialDataItEmployees } from "../constants/dataItOverview.mock";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";

export function useDataItOverview() {
	const t = useTranslate();
	const [employees, setEmployees] = useState<DataItEmployeeOverview[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] =
		useState<DataItOverviewFilterStatus>("ALL");
	const [sortState, setSortState] = useState<DataItSortState>({
		field: DEFAULT_SORT_FIELD,
		direction: DEFAULT_SORT_DIRECTION,
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

	// Safe confirmation dialog states
	const [deleteTarget, setDeleteTarget] =
		useState<DataItEmployeeOverview | null>(null);
	const [archiveTarget, setArchiveTarget] =
		useState<DataItEmployeeOverview | null>(null);

	// Load initial state safely from localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem(DATA_IT_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) {
					setEmployees(parsed);
					return;
				}
			}
		} catch {
			// Fallback on error
		}
		setEmployees(initialDataItEmployees);
	}, []);

	// Save to localStorage when changed
	const saveEmployees = useCallback(
		(updated: DataItEmployeeOverview[]) => {
			setEmployees(updated);
			try {
				localStorage.setItem(DATA_IT_STORAGE_KEY, JSON.stringify(updated));
			} catch {
				// Silently catch storage errors
			}
		},
		[],
	);

	// Filter employees
	const filteredEmployees = useMemo(() => {
		return employees.filter((emp) => {
			if (statusFilter !== "ALL" && emp.status !== statusFilter) {
				return false;
			}
			if (!searchQuery.trim()) return true;
			const q = searchQuery.toLowerCase();
			return (
				emp.name.toLowerCase().includes(q) ||
				emp.email.toLowerCase().includes(q) ||
				emp.role.toLowerCase().includes(q) ||
				emp.id.toLowerCase().includes(q)
			);
		});
	}, [employees, statusFilter, searchQuery]);

	// Sort employees
	const sortedEmployees = useMemo(() => {
		return [...filteredEmployees].sort((a, b) => {
			const mult = sortState.direction === "asc" ? 1 : -1;
			switch (sortState.field) {
				case "id":
					return mult * a.id.localeCompare(b.id, undefined, { numeric: true });
				case "name":
					return mult * a.name.localeCompare(b.name);
				case "email":
					return mult * a.email.localeCompare(b.email);
				case "role":
					return mult * a.role.localeCompare(b.role);
				case "equipment":
					return mult * (a.equipment.length - b.equipment.length);
				case "system":
					return mult * (a.systems.length - b.systems.length);
				case "cost": {
					const costA =
						a.equipment.reduce((s, e) => s + e.monthlyCost, 0) +
						a.systems.reduce((s, sys) => s + sys.monthlyCost, 0);
					const costB =
						b.equipment.reduce((s, e) => s + e.monthlyCost, 0) +
						b.systems.reduce((s, sys) => s + sys.monthlyCost, 0);
					return mult * (costA - costB);
				}
				case "status":
					return mult * a.status.localeCompare(b.status);
				default:
					return 0;
			}
		});
	}, [filteredEmployees, sortState]);

	// Pagination
	const totalItems = sortedEmployees.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const safePage = Math.min(currentPage, totalPages);

	const paginatedEmployees = useMemo(() => {
		const start = (safePage - 1) * pageSize;
		return sortedEmployees.slice(start, start + pageSize);
	}, [sortedEmployees, safePage, pageSize]);

	// Sorting toggle handler
	const handleSort = useCallback((field: DataItOverviewSortField) => {
		setSortState((prev) => ({
			field,
			direction:
				prev.field === field && prev.direction === "asc" ? "desc" : "asc",
		}));
	}, []);

	// Delete confirmation flow
	const requestDelete = useCallback((emp: DataItEmployeeOverview) => {
		setDeleteTarget(emp);
	}, []);

	const confirmDelete = useCallback(() => {
		if (!deleteTarget) return;
		const updated = employees.filter((e) => e.id !== deleteTarget.id);
		saveEmployees(updated);
		showToast("success", t(localizationConstants.dataItToastDeleted));
		setDeleteTarget(null);
	}, [deleteTarget, employees, saveEmployees, t]);

	const cancelDelete = useCallback(() => {
		setDeleteTarget(null);
	}, []);

	// Archive confirmation flow
	const requestArchive = useCallback((emp: DataItEmployeeOverview) => {
		setArchiveTarget(emp);
	}, []);

	const confirmArchive = useCallback(() => {
		if (!archiveTarget) return;
		const updated = employees.map((e) =>
			e.id === archiveTarget.id
				? { ...e, status: (e.status === "ACTIVE" ? "INACTIVE" : "ACTIVE") as DataItEmployeeOverview["status"] }
				: e,
		);
		saveEmployees(updated);
		showToast("success", t(localizationConstants.dataItToastArchived));
		setArchiveTarget(null);
	}, [archiveTarget, employees, saveEmployees, t]);

	const cancelArchive = useCallback(() => {
		setArchiveTarget(null);
	}, []);

	return {
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortState,
		handleSort,
		currentPage: safePage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalItems,
		totalPages,
		paginatedEmployees,
		deleteTarget,
		requestDelete,
		confirmDelete,
		cancelDelete,
		archiveTarget,
		requestArchive,
		confirmArchive,
		cancelArchive,
	};
}
