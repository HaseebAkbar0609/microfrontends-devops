"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type { APriceRow } from "../types/kalkyl";
import { DUMMY_APRICE_LIST } from "../constants/apriceMock";
import {
	getAPriceListAPIAction,
	deleteAPriceItemAPIAction,
} from "../api/aPriceApi";

export type APriceSortField = keyof Pick<
	APriceRow,
	"artikel" | "benaming" | "specification" | "kategori" | "antal" | "enhet" | "aPrice"
>;

export function useAPriceList() {
	const t = useTranslate();
	const [items, setItems] = useState<APriceRow[]>(DUMMY_APRICE_LIST);
	const [isLoading, setIsLoading] = useState(false);

	// Filters & Pagination
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Sorting
	const { sortField, sortDir, toggleSort } = useTableSort<APriceSortField>();

	// Delete Target state
	const [deleteItemTarget, setDeleteItemTarget] = useState<APriceRow | null>(null);

	// Fetch Data
	const fetchItems = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getAPriceListAPIAction({
				search,
				category: selectedCategory,
			});
			if (res?.data && res.data.length > 0) {
				setItems(res.data);
			}
		} catch {
			// Fallback to initial mock
		} finally {
			setIsLoading(false);
		}
	}, [search, selectedCategory]);

	useEffect(() => {
		void fetchItems();
	}, [fetchItems]);

	// Unique Categories
	const categories = useMemo(() => {
		const set = new Set<string>();
		DUMMY_APRICE_LIST.forEach((item) => {
			if (item.kategori?.trim()) {
				set.add(item.kategori.trim());
			}
		});
		return Array.from(set);
	}, []);

	// Filter & Sort
	const filteredItems = useMemo(() => {
		const q = search.trim().toLowerCase();
		return items.filter((item) => {
			const matchesCategory =
				selectedCategory === "all" ||
				item.kategori.toLowerCase() === selectedCategory.toLowerCase();
			if (!matchesCategory) return false;
			if (!q) return true;
			return (
				item.artikel.toLowerCase().includes(q) ||
				item.benaming.toLowerCase().includes(q) ||
				item.specification.toLowerCase().includes(q) ||
				item.kategori.toLowerCase().includes(q) ||
				item.enhet.toLowerCase().includes(q)
			);
		});
	}, [items, search, selectedCategory]);

	const sortedItems = useMemo(() => {
		return sortItems(
			filteredItems,
			sortField,
			sortDir,
			(item, field) => item[field as keyof APriceRow] as string | number,
		);
	}, [filteredItems, sortField, sortDir]);

	const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
	const paginatedItems = useMemo(() => {
		return sortedItems.slice((page - 1) * pageSize, page * pageSize);
	}, [sortedItems, page, pageSize]);

	// Delete
	const handleDeleteItem = useCallback(
		async (id: string) => {
			try {
				await deleteAPriceItemAPIAction(id);
				setItems((prev) => prev.filter((item) => item.id !== id));
				setDeleteItemTarget(null);
				showToast("info", t(localizationConstants.confirmRemove));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[t],
	);

	return {
		items: paginatedItems,
		totalCount: sortedItems.length,
		isLoading,
		search,
		setSearch: (q: string) => {
			setSearch(q);
			setPage(1);
		},
		selectedCategory,
		setSelectedCategory: (cat: string) => {
			setSelectedCategory(cat);
			setPage(1);
		},
		categories,
		page,
		setPage,
		pageSize,
		setPageSize: (size: number) => {
			setPageSize(size);
			setPage(1);
		},
		totalPages,
		sortField,
		sortDir,
		toggleSort,
		deleteItemTarget,
		setDeleteItemTarget,
		handleDeleteItem,
		refetch: fetchItems,
	};
}
