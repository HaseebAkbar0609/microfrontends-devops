"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { yearEndRepository } from "../utils/yearEndRepository";
import {
	DEFAULT_FISCAL_YEAR,
	YEAR_END_DEFAULT_PAGE_SIZE,
} from "../constants/yearEnd.constants";
import type {
	YearEndItem,
	YearEndFormData,
	YearEndTabType,
	YearEndSortField,
	YearEndSortOrder,
} from "../types/yearEnd.types";

interface UseYearEndProps {
	initialTab?: YearEndTabType;
	initialYear?: number;
}

export function useYearEnd({
	initialTab = "bokslut",
	initialYear = DEFAULT_FISCAL_YEAR,
}: UseYearEndProps = {}) {
	const [activeTab, setActiveTab] = useState<YearEndTabType>(initialTab);
	const [selectedYear, setSelectedYear] = useState<number>(initialYear);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<YearEndSortField>("srNr");
	const [sortOrder, setSortOrder] = useState<YearEndSortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(YEAR_END_DEFAULT_PAGE_SIZE);
	const [version, setVersion] = useState(0);

	// Deletion Confirmation Dialog State
	const [itemToDelete, setItemToDelete] = useState<YearEndItem | null>(null);

	const triggerUpdate = useCallback(() => {
		setVersion((v) => v + 1);
	}, []);

	// Subscribe to repository updates for real-time reactivity
	useEffect(() => {
		const unsubscribe = yearEndRepository.subscribe(triggerUpdate);
		return () => unsubscribe();
	}, [triggerUpdate]);

	// Sync activeTab when initialTab prop updates
	useEffect(() => {
		if (initialTab) {
			setActiveTab(initialTab);
		}
	}, [initialTab]);

	// Sync selectedYear when initialYear prop updates
	useEffect(() => {
		if (initialYear) {
			setSelectedYear(initialYear);
		}
	}, [initialYear]);

	// Raw items filtered by Tab and Fiscal Year
	const rawItems = useMemo(() => {
		void version;
		return yearEndRepository.getByTabAndYear(activeTab, selectedYear);
	}, [activeTab, selectedYear, version]);

	// Filtered & Sorted items
	const filteredItems = useMemo(() => {
		let result = [...rawItems];

		// Category filter
		if (categoryFilter && categoryFilter !== "all") {
			result = result.filter((item) => item.category === categoryFilter);
		}

		// Search query (search in srNr, category, name, fileName, notes)
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(item) =>
					item.srNr.toLowerCase().includes(query) ||
					item.category.toLowerCase().includes(query) ||
					item.name.toLowerCase().includes(query) ||
					item.fileName.toLowerCase().includes(query) ||
					(item.notes && item.notes.toLowerCase().includes(query)),
			);
		}

		// Sorting
		result.sort((a, b) => {
			let valA = a[sortBy] ?? "";
			let valB = b[sortBy] ?? "";

			if (typeof valA === "string") valA = valA.toLowerCase();
			if (typeof valB === "string") valB = valB.toLowerCase();

			if (valA < valB) return sortOrder === "asc" ? -1 : 1;
			if (valA > valB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		return result;
	}, [rawItems, categoryFilter, searchQuery, sortBy, sortOrder]);

	// Pagination calculations
	const totalCount = filteredItems.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredItems.slice(start, start + pageSize);
	}, [filteredItems, currentPage, pageSize]);

	const handleSort = useCallback(
		(field: YearEndSortField) => {
			if (sortBy === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy],
	);

	const handleTabChange = useCallback((tab: YearEndTabType) => {
		setActiveTab(tab);
		setCurrentPage(1);
	}, []);

	const handleYearChange = useCallback((year: number) => {
		setSelectedYear(year);
		setCurrentPage(1);
	}, []);

	const createItem = useCallback(
		(data: YearEndFormData) => {
			const created = yearEndRepository.create({
				...data,
				tab: activeTab,
				fiscalYear: selectedYear,
			});
			triggerUpdate();
			return created;
		},
		[activeTab, selectedYear, triggerUpdate],
	);

	const updateItem = useCallback(
		(id: string, data: Partial<YearEndFormData>) => {
			const updated = yearEndRepository.update(id, data);
			triggerUpdate();
			return updated;
		},
		[triggerUpdate],
	);

	const deleteItem = useCallback(
		(id: string) => {
			const success = yearEndRepository.delete(id);
			if (success) {
				triggerUpdate();
			}
			return success;
		},
		[triggerUpdate],
	);

	const resetSeedData = useCallback(() => {
		yearEndRepository.resetSeedData();
		triggerUpdate();
	}, [triggerUpdate]);

	return {
		activeTab,
		setActiveTab: handleTabChange,
		selectedYear,
		setSelectedYear: handleYearChange,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		sortBy,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		totalCount,
		items: paginatedItems,
		itemToDelete,
		setItemToDelete,
		createItem,
		updateItem,
		deleteItem,
		resetSeedData,
	};
}

export default useYearEnd;
