"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListDetail } from "../types/priceLists.types";
import { priceListsRepository } from "../utils/priceListsRepository";
import { DEFAULT_PRICE_LIST_PAGE_SIZE } from "../constants/priceLists.constants";

export function usePriceListsOverview() {
	const t = useTranslate();
	const [priceLists, setPriceLists] = useState<PriceListDetail[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const [activeSubTab, setActiveSubTab] = useState<"prislista" | "uppdatera">("prislista");
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_PRICE_LIST_PAGE_SIZE);
	const [sortBy, setSortBy] = useState<string | undefined>(undefined);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);

	// Delete dialog state
	const [deleteTarget, setDeleteTarget] = useState<PriceListDetail | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const loadData = useCallback(() => {
		setIsLoading(true);
		try {
			const res = priceListsRepository.query({
				page,
				limit: pageSize,
				search: searchQuery,
				category: categoryFilter,
				sortBy,
				sortOrder,
			});
			setPriceLists(res.data);
			setTotalItems(res.total);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchQuery, categoryFilter, sortBy, sortOrder, t]);

	useEffect(() => {
		loadData();
		const unsubscribe = priceListsRepository.subscribe(loadData);
		return () => {
			unsubscribe();
		};
	}, [loadData]);

	const handleSort = useCallback((field: string, nextOrder: "asc" | "desc" | null) => {
		const order = nextOrder ?? undefined;
		setSortBy(order ? field : undefined);
		setSortOrder(order);
	}, []);

	const handleToggleFavorite = useCallback((id: string) => {
		priceListsRepository.toggleFavorite(id);
	}, []);

	const openDeleteDialog = useCallback((item: PriceListDetail) => {
		setDeleteTarget(item);
		setIsDeleteDialogOpen(true);
	}, []);

	const closeDeleteDialog = useCallback(() => {
		setDeleteTarget(null);
		setIsDeleteDialogOpen(false);
	}, []);

	const confirmDelete = useCallback(() => {
		if (!deleteTarget) return;
		const success = priceListsRepository.delete(deleteTarget.id);
		if (success) {
			showToast("success", t(localizationConstants.deleteLabel));
		}
		closeDeleteDialog();
	}, [deleteTarget, closeDeleteDialog, t]);

	return useMemo(
		() => ({
			priceLists,
			totalItems,
			isLoading,
			activeSubTab,
			setActiveSubTab,
			searchQuery,
			setSearchQuery,
			categoryFilter,
			setCategoryFilter,
			page,
			setPage,
			pageSize,
			setPageSize,
			sortBy,
			sortOrder,
			handleSort,
			handleToggleFavorite,
			deleteTarget,
			isDeleteDialogOpen,
			openDeleteDialog,
			closeDeleteDialog,
			confirmDelete,
			refetch: loadData,
		}),
		[
			priceLists,
			totalItems,
			isLoading,
			activeSubTab,
			searchQuery,
			categoryFilter,
			page,
			pageSize,
			sortBy,
			sortOrder,
			handleSort,
			handleToggleFavorite,
			deleteTarget,
			isDeleteDialogOpen,
			openDeleteDialog,
			closeDeleteDialog,
			confirmDelete,
			loadData,
		],
	);
}
