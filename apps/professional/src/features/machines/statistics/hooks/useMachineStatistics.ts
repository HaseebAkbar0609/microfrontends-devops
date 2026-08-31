import { useState, useMemo } from "react";
import type {
	MachineFilterState,
	MachineSortField,
	SortOrder,
} from "../types/statistics.types";
import { MOCK_MACHINE_STATISTICS } from "../data/machineStatistics.mock";

export const INITIAL_MACHINE_FILTERS: MachineFilterState = {
	machineType: "Interna",
	supplier: "Alla",
	ageInterval: "Alla",
	categories: [],
	status: "Alla",
	search: "",
};

function matchesAgeInterval(itemAge: string, interval: string): boolean {
	if (!interval || interval === "Alla" || interval === "All") return true;

	const lowerAge = itemAge.toLowerCase().trim();
	let years = 0;

	if (
		lowerAge.includes("month") ||
		lowerAge.includes("månad") ||
		lowerAge.includes("månader")
	) {
		const num = parseFloat(lowerAge) || 0;
		years = num / 12;
	} else if (lowerAge.includes("year") || lowerAge.includes("år")) {
		years = parseFloat(lowerAge) || 0;
	} else {
		years = parseFloat(lowerAge) || 0;
	}

	const normInterval = interval.toLowerCase().trim();
	if (
		normInterval.includes("under 1") ||
		normInterval.includes("< 1") ||
		normInterval === "under 1 year" ||
		normInterval === "under 1 år"
	) {
		return years < 1;
	}
	if (
		normInterval.includes("1 - 2") ||
		normInterval.includes("1-2") ||
		normInterval === "1 - 2 years" ||
		normInterval === "1 - 2 år"
	) {
		return years >= 1 && years <= 2;
	}
	if (
		normInterval.includes("2 - 5") ||
		normInterval.includes("2-5") ||
		normInterval === "2 - 5 years" ||
		normInterval === "2 - 5 år"
	) {
		return years > 2 && years <= 5;
	}
	if (
		normInterval.includes("5+") ||
		normInterval.includes("> 5") ||
		normInterval.includes("över 5") ||
		normInterval === "5+ years" ||
		normInterval === "5+ år"
	) {
		return years > 5;
	}

	return true;
}

import { matchesStatus } from "../utils/statisticsFilter.utils";

export function useMachineStatistics() {
	const [filters, setFilters] = useState<MachineFilterState>(INITIAL_MACHINE_FILTERS);
	const [appliedFilters, setAppliedFilters] = useState<MachineFilterState>(INITIAL_MACHINE_FILTERS);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortField, setSortField] = useState<MachineSortField>("id");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const handleFilterChange = (newFilters: MachineFilterState) => {
		setFilters(newFilters);
		// If machine type (Interna vs Externa vs Alla) changes, immediately reflect it in table
		if (newFilters.machineType !== filters.machineType) {
			setAppliedFilters((prev) => ({
				...prev,
				machineType: newFilters.machineType,
			}));
			setCurrentPage(1);
		}
	};

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
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
		setFilters(INITIAL_MACHINE_FILTERS);
		setAppliedFilters(INITIAL_MACHINE_FILTERS);
		setSearchQuery("");
		setCurrentPage(1);
	};

	const filteredData = useMemo(() => {
		return MOCK_MACHINE_STATISTICS.filter((item) => {
			// Machine Type filter
			if (
				appliedFilters.machineType !== "Alla" &&
				(item.type as string) !== appliedFilters.machineType
			) {
				return false;
			}

			// Supplier filter (for external)
			if (
				appliedFilters.supplier !== "Alla" &&
				appliedFilters.supplier !== "All" &&
				item.supplier &&
				item.supplier !== appliedFilters.supplier
			) {
				return false;
			}

			// Age Interval filter
			if (!matchesAgeInterval(item.age, appliedFilters.ageInterval)) {
				return false;
			}

			// Categories filter (multi-select)
			if (
				appliedFilters.categories.length > 0 &&
				!appliedFilters.categories.some(
					(cat) => cat.toLowerCase() === item.category.toLowerCase()
				)
			) {
				return false;
			}

			// Status filter
			if (!matchesStatus(item.status, appliedFilters.status)) {
				return false;
			}

			// Live Search query filter (matches ID, name, brand, category, supplier, status)
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase().trim();
				const matches =
					item.id.toLowerCase().includes(query) ||
					item.name.toLowerCase().includes(query) ||
					item.brand.toLowerCase().includes(query) ||
					item.category.toLowerCase().includes(query) ||
					item.status.toLowerCase().includes(query) ||
					Boolean(item.supplier && item.supplier.toLowerCase().includes(query));
				if (!matches) return false;
			}

			return true;
		});
	}, [appliedFilters, searchQuery]);

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
		searchQuery,
		setSearchQuery: handleSearchChange,
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
