"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type {
	DataItEmployeeOverview,
	DataItOverviewFilterStatus,
	DataItSortState,
	DataItOverviewSortField,
} from "../types/dataItOverview.types";
import {
	DEFAULT_PAGE_SIZE,
	DEFAULT_SORT_FIELD,
	DEFAULT_SORT_DIRECTION,
} from "../constants/dataItOverview.constants";
import { dataItRepository } from "../utils/dataItRepository";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";

export interface DataItStatusTarget {
	employee: DataItEmployeeOverview;
	nextStatus: "ACTIVE" | "INACTIVE";
}

export function useDataItOverview() {
	const t = useTranslate();
	const [isLoading, setIsLoading] = useState(true);
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

	// Confirmation states for delete and status transitions
	const [deleteTarget, setDeleteTarget] =
		useState<DataItEmployeeOverview | null>(null);
	const [statusTarget, setStatusTarget] =
		useState<DataItStatusTarget | null>(null);

	// Initialize and subscribe to repository
	useEffect(() => {
		setEmployees(dataItRepository.getAll());
		setIsLoading(false);

		const unsubscribe = dataItRepository.subscribe((updated) => {
			setEmployees(updated);
		});
		return unsubscribe;
	}, []);

	// Filter with page reset handlers
	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	}, []);

	const handleStatusFilterChange = useCallback(
		(status: DataItOverviewFilterStatus) => {
			setStatusFilter(status);
			setCurrentPage(1);
		},
		[],
	);

	const handlePageSizeChange = useCallback((size: number) => {
		setPageSize(size);
		setCurrentPage(1);
	}, []);

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

	// Sort logic
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
	const safePage = Math.min(Math.max(1, currentPage), totalPages);

	const paginatedEmployees = useMemo(() => {
		const start = (safePage - 1) * pageSize;
		return sortedEmployees.slice(start, start + pageSize);
	}, [sortedEmployees, safePage, pageSize]);

	const handleSort = useCallback((field: DataItOverviewSortField) => {
		setSortState((prev) => ({
			field,
			direction:
				prev.field === field && prev.direction === "asc" ? "desc" : "asc",
		}));
	}, []);

	// Delete handlers
	const requestDelete = useCallback((emp: DataItEmployeeOverview) => {
		setDeleteTarget(emp);
	}, []);

	const confirmDelete = useCallback(() => {
		if (!deleteTarget) return;
		dataItRepository.delete(deleteTarget.id);
		showToast("success", t(localizationConstants.dataItToastDeleted));
		setDeleteTarget(null);
	}, [deleteTarget, t]);

	const cancelDelete = useCallback(() => {
		setDeleteTarget(null);
	}, []);

	// Status transition handlers (Archive vs Activate)
	const requestStatusChange = useCallback((emp: DataItEmployeeOverview) => {
		setStatusTarget({
			employee: emp,
			nextStatus: emp.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
		});
	}, []);

	const confirmStatusChange = useCallback(() => {
		if (!statusTarget) return;
		const { employee, nextStatus } = statusTarget;
		dataItRepository.update({ ...employee, status: nextStatus });
		if (nextStatus === "INACTIVE") {
			showToast("success", t(localizationConstants.dataItToastArchived));
		} else {
			showToast("success", t(localizationConstants.dataItToastActivated));
		}
		setStatusTarget(null);
	}, [statusTarget, t]);

	const cancelStatusChange = useCallback(() => {
		setStatusTarget(null);
	}, []);

	return {
		isLoading,
		searchQuery,
		setSearchQuery: handleSearchChange,
		statusFilter,
		setStatusFilter: handleStatusFilterChange,
		sortState,
		handleSort,
		currentPage: safePage,
		setCurrentPage,
		pageSize,
		setPageSize: handlePageSizeChange,
		totalItems,
		totalPages,
		paginatedEmployees,
		deleteTarget,
		requestDelete,
		confirmDelete,
		cancelDelete,
		statusTarget,
		requestStatusChange,
		confirmStatusChange,
		cancelStatusChange,
	};
}
