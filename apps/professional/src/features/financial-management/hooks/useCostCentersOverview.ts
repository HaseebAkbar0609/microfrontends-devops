"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CostCenterItem, CostCenterStatus } from "../types/costCenters.types";
import {
	getCostCentersListAPIAction,
	deleteCostCenterAPIAction,
	toggleCostCentersStatusAPIAction,
} from "../utils/costCentersRepository";

export function useCostCentersOverview() {
	const t = useTranslate();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [data, setData] = useState<CostCenterItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [deleteTarget, setDeleteTarget] = useState<CostCenterItem | null>(null);

	const page = Number(searchParams.get("page") ?? "1");
	const pageSize = Number(searchParams.get("limit") ?? "10");
	const searchQuery = searchParams.get("search") ?? "";
	const sortByParam = searchParams.get("sortBy") ?? undefined;
	const sortOrderParam = (searchParams.get("sortOrder") as "asc" | "desc") ?? undefined;

	const [totalItems, setTotalItems] = useState(0);

	const updateQueryParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			const params = new URLSearchParams(searchParams.toString());
			Object.entries(updates).forEach(([key, value]) => {
				if (value !== undefined && value !== "") {
					params.set(key, value);
				} else {
					params.delete(key);
				}
			});
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getCostCentersListAPIAction({
				page,
				limit: pageSize,
				search: searchQuery,
				status: statusFilter,
				sortBy: sortByParam,
				sortOrder: sortOrderParam,
			});
			setData(res.data);
			setTotalItems(res.total);
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchQuery, statusFilter, sortByParam, sortOrderParam]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearchChange = useCallback(
		(value: string) => {
			updateQueryParams({ search: value || undefined, page: "1" });
		},
		[updateQueryParams],
	);

	const handleSort = useCallback(
		(field: string) => {
			const isSameField = sortByParam === field;
			const nextOrder = isSameField && sortOrderParam === "asc" ? "desc" : "asc";
			updateQueryParams({ sortBy: field, sortOrder: nextOrder });
		},
		[sortByParam, sortOrderParam, updateQueryParams],
	);

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				setSelectedIds(data.map((item) => item.id));
			} else {
				setSelectedIds([]);
			}
		},
		[data],
	);

	const handleSelectRow = useCallback((id: string, checked: boolean) => {
		if (checked) {
			setSelectedIds((prev) => [...prev, id]);
		} else {
			setSelectedIds((prev) => prev.filter((item) => item !== id));
		}
	}, []);

	const openDeleteDialog = useCallback((item: CostCenterItem) => {
		setDeleteTarget(item);
	}, []);

	const closeDeleteDialog = useCallback(() => {
		setDeleteTarget(null);
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!deleteTarget) return;
		await deleteCostCenterAPIAction(deleteTarget.id);
		showToast("success", t(localizationConstants.costCenterDeletedSuccess));
		setSelectedIds((prev) => prev.filter((itemId) => itemId !== deleteTarget.id));
		setDeleteTarget(null);
		fetchData();
	}, [deleteTarget, fetchData, t]);

	const handleBatchToggleStatus = useCallback(
		async (targetStatus: CostCenterStatus) => {
			if (selectedIds.length === 0) return;
			await toggleCostCentersStatusAPIAction(selectedIds, targetStatus);
			showToast("success", t(localizationConstants.costCenterStatusUpdatedSuccess));
			setData((prev) =>
				prev.map((item) =>
					selectedIds.includes(item.id) ? { ...item, status: targetStatus } : item,
				),
			);
			setSelectedIds([]);
		},
		[selectedIds, t],
	);

	const isAllSelected = useMemo(
		() => data.length > 0 && selectedIds.length === data.length,
		[data.length, selectedIds.length],
	);

	return useMemo(
		() => ({
			data,
			isLoading,
			totalItems,
			page,
			pageSize,
			searchQuery,
			statusFilter,
			setStatusFilter,
			sortByParam,
			sortOrderParam,
			selectedIds,
			isAllSelected,
			deleteTarget,
			handleSearchChange,
			handleSort,
			handleSelectAll,
			handleSelectRow,
			openDeleteDialog,
			closeDeleteDialog,
			confirmDelete,
			handleBatchToggleStatus,
			updateQueryParams,
		}),
		[
			data,
			isLoading,
			totalItems,
			page,
			pageSize,
			searchQuery,
			statusFilter,
			sortByParam,
			sortOrderParam,
			selectedIds,
			isAllSelected,
			deleteTarget,
			handleSearchChange,
			handleSort,
			handleSelectAll,
			handleSelectRow,
			openDeleteDialog,
			closeDeleteDialog,
			confirmDelete,
			handleBatchToggleStatus,
			updateQueryParams,
		],
	);
}
