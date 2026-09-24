"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	WageTypeItem,
	WageTypeStatus,
	WageTypePersonalType,
	WageTypeWageForm,
	WageTypeTransactionType,
} from "../types/wageTypes.types";
import {
	getWageTypesListAPIAction,
	deleteWageTypeAPIAction,
	toggleWageTypesStatusAPIAction,
} from "../utils/wageTypesRepository";
import { WAGE_TYPES_BASE_ROUTE } from "../constants/wageTypes.constants";

export function useWageTypesOverview() {
	const t = useTranslate();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [data, setData] = useState<WageTypeItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [statusFilter, setStatusFilter] = useState<"all" | WageTypeStatus>("all");
	const [personalTypeFilter, setPersonalTypeFilter] = useState<"all" | WageTypePersonalType>("all");
	const [wageFormFilter, setWageFormFilter] = useState<"all" | WageTypeWageForm>("all");
	const [transactionTypeFilter, setTransactionTypeFilter] = useState<"all" | WageTypeTransactionType>("all");
	const [deleteTarget, setDeleteTarget] = useState<WageTypeItem | null>(null);

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
			const res = await getWageTypesListAPIAction({
				page,
				limit: pageSize,
				search: searchQuery,
				status: statusFilter,
				personalType: personalTypeFilter,
				wageForm: wageFormFilter,
				transactionType: transactionTypeFilter,
				sortBy: sortByParam,
				sortOrder: sortOrderParam,
			});
			setData(res.data);
			setTotalItems(res.total);
		} finally {
			setIsLoading(false);
		}
	}, [
		page,
		pageSize,
		searchQuery,
		statusFilter,
		personalTypeFilter,
		wageFormFilter,
		transactionTypeFilter,
		sortByParam,
		sortOrderParam,
	]);

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

	const isAllSelected = useMemo(
		() => data.length > 0 && selectedIds.length === data.length,
		[data.length, selectedIds.length],
	);

	const openDeleteDialog = useCallback((item: WageTypeItem) => {
		setDeleteTarget(item);
	}, []);

	const closeDeleteDialog = useCallback(() => {
		setDeleteTarget(null);
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!deleteTarget) return;
		const success = await deleteWageTypeAPIAction(deleteTarget.id);
		if (success) {
			showToast("success", t(localizationConstants.wageTypeDeletedSuccess));
			setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
			closeDeleteDialog();
			await fetchData();
		}
	}, [closeDeleteDialog, deleteTarget, fetchData, t]);

	const handleBatchToggleStatus = useCallback(
		async (targetStatus: WageTypeStatus) => {
			if (selectedIds.length === 0) return;
			const success = await toggleWageTypesStatusAPIAction(selectedIds, targetStatus);
			if (success) {
				const msg =
					targetStatus === "active"
						? t(localizationConstants.wageTypeStatusActivatedSuccess)
						: t(localizationConstants.wageTypeStatusDeactivatedSuccess);
				showToast("success", msg);
				await fetchData();
			}
		},
		[fetchData, selectedIds, t],
	);

	const handleSingleToggleStatus = useCallback(
		async (item: WageTypeItem) => {
			const newStatus: WageTypeStatus = item.status === "active" ? "inactive" : "active";
			const success = await toggleWageTypesStatusAPIAction([item.id], newStatus);
			if (success) {
				const msg =
					newStatus === "active"
						? t(localizationConstants.wageTypeStatusActivatedSuccess)
						: t(localizationConstants.wageTypeStatusDeactivatedSuccess);
				showToast("success", msg);
				await fetchData();
			}
		},
		[fetchData, t],
	);

	const navigateToDetail = useCallback(
		(id: string) => {
			router.push(`${WAGE_TYPES_BASE_ROUTE}/${id}`);
		},
		[router],
	);

	return {
		data,
		isLoading,
		totalItems,
		page,
		pageSize,
		searchQuery,
		statusFilter,
		setStatusFilter,
		personalTypeFilter,
		setPersonalTypeFilter,
		wageFormFilter,
		setWageFormFilter,
		transactionTypeFilter,
		setTransactionTypeFilter,
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
		handleSingleToggleStatus,
		navigateToDetail,
		updateQueryParams,
		refresh: fetchData,
	};
}
