"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslate } from "@/utils/translation/translate";
import type {
	SystemCategory,
	SystemItem,
	SystemSortField,
	SystemSortState,
	SystemStatus,
} from "../types/dataItSystem.types";
import {
	DEFAULT_SYSTEM_PAGE_SIZE,
	SYSTEM_CATEGORY_TRANSLATION_MAP,
} from "../constants/dataItSystem.constants";
import { dataItSystemRepository } from "../utils/dataItSystemRepository";

export function useDataItSystem() {
	const t = useTranslate();
	const [items, setItems] = useState<SystemItem[]>(() =>
		dataItSystemRepository.getAll(),
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<
		SystemCategory | "ALL"
	>("ALL");
	const [selectedStatus, setSelectedStatus] = useState<SystemStatus | "ALL">(
		"ALL",
	);
	const [sortState, setSortState] = useState<SystemSortState>({
		field: "systemId",
		dir: "asc",
	});
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_SYSTEM_PAGE_SIZE);

	// Synchronize with repository changes
	useEffect(() => {
		const unsubscribe = dataItSystemRepository.subscribe((updatedItems) => {
			setItems(updatedItems);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	// Filter & Sort
	const filteredAndSortedItems = useMemo(() => {
		let result = [...items];

		if (selectedCategory !== "ALL") {
			result = result.filter((item) => item.category === selectedCategory);
		}

		if (selectedStatus !== "ALL") {
			result = result.filter((item) => item.status === selectedStatus);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter((item) => {
				const localizedCategory = SYSTEM_CATEGORY_TRANSLATION_MAP[item.category]
					? t(SYSTEM_CATEGORY_TRANSLATION_MAP[item.category]).toLowerCase()
					: "";
				return (
					item.systemId.toLowerCase().includes(query) ||
					item.program.toLowerCase().includes(query) ||
					item.category.toLowerCase().includes(query) ||
					localizedCategory.includes(query) ||
					(item.email && item.email.toLowerCase().includes(query)) ||
					(item.description && item.description.toLowerCase().includes(query))
				);
			});
		}

		result.sort((a, b) => {
			let compA: string | number = "";
			let compB: string | number = "";

			switch (sortState.field) {
				case "systemId":
					compA = a.systemId;
					compB = b.systemId;
					break;
				case "category":
					compA = a.category;
					compB = b.category;
					break;
				case "program":
					compA = a.program;
					compB = b.program;
					break;
				case "status":
					compA = a.status;
					compB = b.status;
					break;
				case "price":
					compA = a.pricePerMonth;
					compB = b.pricePerMonth;
					break;
				default:
					compA = a.systemId;
					compB = b.systemId;
			}

			if (typeof compA === "number" && typeof compB === "number") {
				return sortState.dir === "asc" ? compA - compB : compB - compA;
			}

			const cmp = String(compA).localeCompare(String(compB), "sv", {
				numeric: true,
			});
			return sortState.dir === "asc" ? cmp : -cmp;
		});

		return result;
	}, [
		items,
		selectedCategory,
		selectedStatus,
		searchQuery,
		sortState.field,
		sortState.dir,
		t,
	]);

	// Pagination calculations
	const totalItems = filteredAndSortedItems.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const safeCurrentPage = Math.min(Math.max(1, page), totalPages);

	const paginatedItems = useMemo(() => {
		const start = (safeCurrentPage - 1) * pageSize;
		return filteredAndSortedItems.slice(start, start + pageSize);
	}, [filteredAndSortedItems, safeCurrentPage, pageSize]);

	// Handlers
	const handleSort = useCallback((field: SystemSortField) => {
		setSortState((prev) => ({
			field,
			dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
		}));
		setPage(1);
	}, []);

	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
		setPage(1);
	}, []);

	const handleCategoryChange = useCallback((category: SystemCategory | "ALL") => {
		setSelectedCategory(category);
		setPage(1);
	}, []);

	const handleStatusChange = useCallback((status: SystemStatus | "ALL") => {
		setSelectedStatus(status);
		setPage(1);
	}, []);

	const clearFilters = useCallback(() => {
		setSearchQuery("");
		setSelectedCategory("ALL");
		setSelectedStatus("ALL");
		setPage(1);
	}, []);

	const handlePageChange = useCallback(
		(newPage: number) => {
			setPage(Math.min(Math.max(1, newPage), totalPages));
		},
		[totalPages],
	);

	const handlePageSizeChange = useCallback((newPageSize: number) => {
		setPageSize(newPageSize);
		setPage(1);
	}, []);

	const updateSystem = useCallback(
		(id: string, updates: Partial<SystemItem>) => {
			dataItSystemRepository.update(id, updates);
		},
		[],
	);

	return {
		items: paginatedItems,
		totalItems,
		totalPages,
		currentPage: safeCurrentPage,
		pageSize,
		setPage: handlePageChange,
		setPageSize: handlePageSizeChange,
		searchQuery,
		setSearchQuery: handleSearchChange,
		selectedCategory,
		setSelectedCategory: handleCategoryChange,
		selectedStatus,
		setSelectedStatus: handleStatusChange,
		sortField: sortState.field,
		sortDir: sortState.dir,
		handleSort,
		clearFilters,
		updateSystem,
	};
}
