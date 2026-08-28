import { useState, useMemo } from "react";
import type {
	MachineFilterState,
	MachineSortField,
	SortOrder,
} from "../types/statistics.types";
import { MOCK_MACHINE_STATISTICS } from "../data/machineStatistics.mock";

const INITIAL_FILTERS: MachineFilterState = {
	machineType: "Interna",
	supplier: "Alla",
	ageInterval: "under 1 year",
	categories: ["Handmaskin", "Betong"],
	status: "Aktiv",
	search: "",
};

const INITIAL_APPLIED_FILTERS: MachineFilterState = {
	machineType: "Interna",
	supplier: "Alla",
	ageInterval: "Alla",
	categories: [],
	status: "Alla",
	search: "",
};

export function useMachineStatistics() {
	const [filters, setFilters] = useState<MachineFilterState>(INITIAL_FILTERS);
	const [appliedFilters, setAppliedFilters] =
		useState<MachineFilterState>(INITIAL_APPLIED_FILTERS);
	const [sortField, setSortField] = useState<MachineSortField>("id");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const handleFilterChange = (newFilters: MachineFilterState) => {
		setFilters(newFilters);
		// If machine type (Interna vs Externa) changes, immediately reflect it in table
		if (newFilters.machineType !== filters.machineType) {
			setAppliedFilters((prev) => ({
				...prev,
				machineType: newFilters.machineType,
			}));
		}
	};

	const handleSort = (field: MachineSortField) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const applyFilters = () => {
		setAppliedFilters({ ...filters });
		setCurrentPage(1);
	};

	const resetFilters = () => {
		setFilters(INITIAL_FILTERS);
		setAppliedFilters(INITIAL_APPLIED_FILTERS);
		setCurrentPage(1);
	};

	const filteredData = useMemo(() => {
		return MOCK_MACHINE_STATISTICS.filter((item) => {
			// Machine Type filter
			if (
				appliedFilters.machineType !== "Alla" &&
				item.type !== appliedFilters.machineType
			) {
				return false;
			}

			// Supplier filter (for external)
			if (
				appliedFilters.supplier !== "Alla" &&
				item.supplier !== appliedFilters.supplier
			) {
				return false;
			}

			// Age Interval filter
			if (
				appliedFilters.ageInterval !== "Alla" &&
				item.age !== appliedFilters.ageInterval
			) {
				return false;
			}

			// Categories filter
			if (
				appliedFilters.categories.length > 0 &&
				!appliedFilters.categories.includes(item.category)
			) {
				return false;
			}

			// Status filter
			if (
				appliedFilters.status !== "Alla" &&
				item.status !== appliedFilters.status
			) {
				return false;
			}

			// Search query filter
			if (appliedFilters.search.trim()) {
				const query = appliedFilters.search.toLowerCase().trim();
				const matches =
					item.id.toLowerCase().includes(query) ||
					item.name.toLowerCase().includes(query) ||
					item.brand.toLowerCase().includes(query) ||
					item.category.toLowerCase().includes(query) ||
					Boolean(item.supplier && item.supplier.toLowerCase().includes(query));
				if (!matches) return false;
			}

			return true;
		});
	}, [appliedFilters]);

	const sortedData = useMemo(() => {
		return [...filteredData].sort((a, b) => {
			const valA = a[sortField];
			const valB = b[sortField];

			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}

			const strA = (valA ?? "").toString().toLowerCase();
			const strB = (valB ?? "").toString().toLowerCase();
			if (strA < strB) return sortOrder === "asc" ? -1 : 1;
			if (strA > strB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredData, sortField, sortOrder]);

	const totalItems = sortedData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedData.slice(start, start + pageSize);
	}, [sortedData, currentPage, pageSize]);

	return {
		filters,
		setFilters: handleFilterChange,
		appliedFilters,
		applyFilters,
		resetFilters,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalItems,
		totalPages,
		paginatedData,
	};
}
