"use client";

import { useState, useMemo, useCallback, useDeferredValue, useEffect } from "react";
import { toast } from "sonner";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import {
	EmployeeOverviewItem,
	EmployeeStatus,
	EmploymentType,
	SortField,
	SortOrder,
} from "../types/personnelOverview.types";
import { personnelRepository } from "../utils/personnelRepository";
import { DEFAULT_PAGE_SIZE } from "../constants/personnelOverview.constants";

export function usePersonnelOverview() {
	const { t, i18n } = useTranslation();
	const [employees, setEmployees] = useState<EmployeeOverviewItem[]>(() =>
		personnelRepository.getAllEmployees()
	);

	useEffect(() => {
		const unsubscribe = personnelRepository.subscribe((items) => {
			setEmployees(items);
		});
		return unsubscribe;
	}, []);
	const [searchTerm, setSearchTerm] = useState("");
	const deferredSearchTerm = useDeferredValue(searchTerm);
	const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "all">("all");
	const [typeFilter, setTypeFilter] = useState<EmploymentType | "all">("all");
	const [locationFilter, setLocationFilter] = useState("all");
	const [roleFilter, setRoleFilter] = useState("all");
	const [sortField, setSortField] = useState<SortField>("contractNumber");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

	const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOverviewItem | null>(null);
	const [employeeToDeactivate, setEmployeeToDeactivate] = useState<EmployeeOverviewItem | null>(null);

	const handleSort = useCallback((field: SortField) => {
		setSortField((prevField) => {
			if (prevField === field) {
				setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
				return field;
			}
			setSortOrder("asc");
			return field;
		});
	}, []);

	const filteredEmployees = useMemo(() => {
		const term = deferredSearchTerm.toLowerCase().trim();
		return employees.filter((item) => {
			const matchesSearch =
				!term ||
				item.name.toLowerCase().includes(term) ||
				item.contractNumber.toLowerCase().includes(term) ||
				item.idNumber.toLowerCase().includes(term) ||
				item.role.toLowerCase().includes(term) ||
				item.location.toLowerCase().includes(term);

			const matchesStatus = statusFilter === "all" || item.status === statusFilter;
			const matchesType = typeFilter === "all" || item.employmentType === typeFilter;
			const matchesLocation = locationFilter === "all" || item.location === locationFilter;
			const matchesRole = roleFilter === "all" || item.role === roleFilter;

			return matchesSearch && matchesStatus && matchesType && matchesLocation && matchesRole;
		});
	}, [employees, deferredSearchTerm, statusFilter, typeFilter, locationFilter, roleFilter]);

	const sortedEmployees = useMemo(() => {
		return [...filteredEmployees].sort((a, b) => {
			const aVal = a[sortField] || "";
			const bVal = b[sortField] || "";
			const comp = aVal.localeCompare(bVal, i18n.language || "sv", { numeric: true });
			return sortOrder === "asc" ? comp : -comp;
		});
	}, [filteredEmployees, sortField, sortOrder, i18n.language]);

	const totalPages = useMemo(() => {
		return Math.max(1, Math.ceil(sortedEmployees.length / pageSize));
	}, [sortedEmployees.length, pageSize]);

	const paginatedEmployees = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedEmployees.slice(start, start + pageSize);
	}, [sortedEmployees, currentPage, pageSize]);

	const handleResetFilters = useCallback(() => {
		setSearchTerm("");
		setStatusFilter("all");
		setTypeFilter("all");
		setLocationFilter("all");
		setRoleFilter("all");
		setCurrentPage(1);
	}, []);

	const handleConfirmDeactivate = useCallback(() => {
		if (!employeeToDeactivate) return;
		personnelRepository.updateEmployeeStatus(employeeToDeactivate.id, "not_started");
		toast.success(t(localizationConstants.toastEmployeeDeactivated));
		setEmployeeToDeactivate(null);
	}, [employeeToDeactivate, t]);

	return {
		searchTerm,
		setSearchTerm,
		statusFilter,
		setStatusFilter,
		typeFilter,
		setTypeFilter,
		locationFilter,
		setLocationFilter,
		roleFilter,
		setRoleFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		totalCount: sortedEmployees.length,
		paginatedEmployees,
		handleResetFilters,
		selectedEmployee,
		setSelectedEmployee,
		employeeToDeactivate,
		setEmployeeToDeactivate,
		handleConfirmDeactivate,
	};
}
