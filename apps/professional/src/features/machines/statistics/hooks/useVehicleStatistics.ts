import { useState, useMemo } from "react";
import type {
	VehicleFilterState,
	VehicleSortField,
	SortOrder,
} from "../types/statistics.types";
import { MOCK_VEHICLE_STATISTICS } from "../data/vehicleStatistics.mock";

export const INITIAL_VEHICLE_FILTERS: VehicleFilterState = {
	brandModel: "Alla",
	mileageRange: "Alla",
	driftPeriod: "Vecka",
	status: "Alla",
	search: "",
};

function matchesVehicleMileage(itemMileage: number, range: string): boolean {
	if (!range || range === "Alla" || range === "All") return true;

	const normRange = range.toLowerCase().trim();
	if (normRange.includes("< 1000") || normRange.includes("under 1000")) {
		return itemMileage < 1000;
	}
	if (normRange.includes("1000") && normRange.includes("5000")) {
		return itemMileage >= 1000 && itemMileage <= 5000;
	}
	if (normRange.includes("5000") && normRange.includes("10000")) {
		return itemMileage > 5000 && itemMileage <= 10000;
	}
	if (normRange.includes("> 10000") || normRange.includes("10000+")) {
		return itemMileage > 10000;
	}

	return true;
}

function matchesStatus(itemStatus: string, filterStatus: string): boolean {
	if (!filterStatus || filterStatus === "Alla" || filterStatus === "All") return true;

	const normItem = itemStatus.toLowerCase().trim();
	const normFilter = filterStatus.toLowerCase().trim();

	if (normFilter === "alla" || normFilter === "all") return true;

	if (normFilter === "aktiv" || normFilter === "active") {
		return normItem === "aktiv" || normItem === "active";
	}
	if (normFilter === "reparation" || normFilter === "repair") {
		return normItem === "reparation" || normItem === "repair";
	}
	if (
		normFilter === "avslutad" ||
		normFilter === "completed" ||
		normFilter === "closed"
	) {
		return (
			normItem === "avslutad" ||
			normItem === "completed" ||
			normItem === "closed"
		);
	}

	return normItem === normFilter;
}

export function useVehicleStatistics() {
	const [filters, setFilters] = useState<VehicleFilterState>(
		INITIAL_VEHICLE_FILTERS
	);
	const [appliedFilters, setAppliedFilters] = useState<VehicleFilterState>(
		INITIAL_VEHICLE_FILTERS
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortField, setSortField] = useState<VehicleSortField>("id");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const handleFilterChange = (newFilters: VehicleFilterState) => {
		setFilters(newFilters);
	};

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const handleSort = (field: VehicleSortField) => {
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
		setFilters(INITIAL_VEHICLE_FILTERS);
		setAppliedFilters(INITIAL_VEHICLE_FILTERS);
		setSearchQuery("");
		setCurrentPage(1);
	};

	const filteredData = useMemo(() => {
		return MOCK_VEHICLE_STATISTICS.filter((item) => {
			// Brand & Model filter
			if (appliedFilters.brandModel !== "Alla" && appliedFilters.brandModel !== "All") {
				const full = `${item.name} ${item.model}`.toLowerCase();
				if (!full.includes(appliedFilters.brandModel.toLowerCase())) {
					return false;
				}
			}

			// Mileage filter
			if (!matchesVehicleMileage(item.mileage, appliedFilters.mileageRange)) {
				return false;
			}

			// Status filter
			if (!matchesStatus(item.status, appliedFilters.status)) {
				return false;
			}

			// Search query filter (live)
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase().trim();
				const matches =
					item.id.toLowerCase().includes(query) ||
					item.name.toLowerCase().includes(query) ||
					item.model.toLowerCase().includes(query) ||
					item.driver.toLowerCase().includes(query) ||
					item.status.toLowerCase().includes(query);
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
