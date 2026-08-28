import { useState, useMemo } from "react";
import type {
	VehicleFilterState,
	VehicleSortField,
	SortOrder,
} from "../types/statistics.types";
import { MOCK_VEHICLE_STATISTICS } from "../data/vehicleStatistics.mock";

const INITIAL_VEHICLE_FILTERS: VehicleFilterState = {
	brandModel: "Ford",
	mileageRange: "1000 km - 5000 km",
	driftPeriod: "Vecka",
	status: "Aktiv",
	search: "",
};

const INITIAL_APPLIED_VEHICLE_FILTERS: VehicleFilterState = {
	brandModel: "Alla",
	mileageRange: "Alla",
	driftPeriod: "Vecka",
	status: "Alla",
	search: "",
};

export function useVehicleStatistics() {
	const [filters, setFilters] = useState<VehicleFilterState>(
		INITIAL_VEHICLE_FILTERS
	);
	const [appliedFilters, setAppliedFilters] = useState<VehicleFilterState>(
		INITIAL_APPLIED_VEHICLE_FILTERS
	);
	const [sortField, setSortField] = useState<VehicleSortField>("id");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

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
		setAppliedFilters(INITIAL_APPLIED_VEHICLE_FILTERS);
		setCurrentPage(1);
	};

	const filteredData = useMemo(() => {
		return MOCK_VEHICLE_STATISTICS.filter((item) => {
			// Brand & Model filter
			if (appliedFilters.brandModel !== "Alla") {
				const full = `${item.name} ${item.model}`.toLowerCase();
				if (!full.includes(appliedFilters.brandModel.toLowerCase())) {
					return false;
				}
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
					item.model.toLowerCase().includes(query) ||
					item.driver.toLowerCase().includes(query);
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
		setFilters,
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
