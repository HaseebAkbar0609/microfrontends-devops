"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AccountPlanItem, AccountStatus } from "../types/accountPlan.types";
import { accountPlanRepository } from "../utils/accountPlanRepository";
import {
	ACCOUNT_PLAN_DEFAULT_PAGE_SIZE,
	ACCOUNT_PLAN_BASE_ROUTE,
	ACCOUNT_PLAN_CREATE_ROUTE,
	ACCOUNT_PLAN_IMPORT_ROUTE,
} from "../constants/accountPlan.constants";

export function useAccountPlanOverview() {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();

	const page = Number(searchParams.get("page") || "1");
	const pageSize = Number(searchParams.get("limit") || String(ACCOUNT_PLAN_DEFAULT_PAGE_SIZE));
	const searchQuery = searchParams.get("search") || "";
	const statusParam = searchParams.get("status") || "all";
	const sortByParam = searchParams.get("sortBy") || "kontoNr";
	const sortOrderParam = (searchParams.get("sortOrder") || "asc") as
		| "asc"
		| "desc";

	const [accounts, setAccounts] = useState<AccountPlanItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [deletingItem, setDeletingItem] = useState<AccountPlanItem | null>(null);

	const fetchAccounts = useCallback(() => {
		setIsLoading(true);
		try {
			const data = accountPlanRepository.getAll();
			setAccounts(data);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [t]);

	useEffect(() => {
		fetchAccounts();
		const unsubscribe = accountPlanRepository.subscribe(fetchAccounts);
		return () => {
			unsubscribe();
		};
	}, [fetchAccounts]);

	const updateSearchParams = useCallback(
		(updates: Record<string, string | null>) => {
			const current = new URLSearchParams(searchParams.toString());
			Object.entries(updates).forEach(([key, value]) => {
				if (value === null || value === "") {
					current.delete(key);
				} else {
					current.set(key, value);
				}
			});
			router.replace(`?${current.toString()}`, { scroll: false });
		},
		[router, searchParams],
	);

	const handleSearchChange = useCallback(
		(val: string) => {
			updateSearchParams({
				search: val || null,
				page: "1",
			});
		},
		[updateSearchParams],
	);

	const handleStatusFilterChange = useCallback(
		(status: "all" | "active" | "inactive") => {
			updateSearchParams({
				status: status === "all" ? null : status,
				page: "1",
			});
		},
		[updateSearchParams],
	);

	const handleSort = useCallback(
		(columnKey: string) => {
			let newOrder: "asc" | "desc" = "asc";
			if (sortByParam === columnKey && sortOrderParam === "asc") {
				newOrder = "desc";
			}
			updateSearchParams({
				sortBy: columnKey,
				sortOrder: newOrder,
			});
		},
		[sortByParam, sortOrderParam, updateSearchParams],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			updateSearchParams({ page: String(newPage) });
		},
		[updateSearchParams],
	);

	const filteredAccounts = useMemo(() => {
		return accounts.filter((item) => {
			const matchesSearch =
				!searchQuery ||
				item.kontoNr.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.benamning.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.sru.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus =
				statusParam === "all" ||
				(statusParam === "active" && item.status === "active") ||
				(statusParam === "inactive" && item.status === "inactive");
			return matchesSearch && matchesStatus;
		});
	}, [accounts, searchQuery, statusParam]);

	const sortedAccounts = useMemo(() => {
		if (!sortByParam) return filteredAccounts;
		return [...filteredAccounts].sort((a, b) => {
			const aVal = (a as unknown as Record<string, unknown>)[sortByParam] ?? "";
			const bVal = (b as unknown as Record<string, unknown>)[sortByParam] ?? "";
			if (aVal < bVal) return sortOrderParam === "asc" ? -1 : 1;
			if (aVal > bVal) return sortOrderParam === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredAccounts, sortByParam, sortOrderParam]);

	const totalItems = sortedAccounts.length;
	const paginatedAccounts = useMemo(() => {
		const start = (page - 1) * pageSize;
		return sortedAccounts.slice(start, start + pageSize);
	}, [sortedAccounts, page, pageSize]);

	const handleToggleSelectRow = useCallback((id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	}, []);

	const handleToggleSelectAll = useCallback(() => {
		if (selectedIds.length === paginatedAccounts.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(paginatedAccounts.map((a) => a.id));
		}
	}, [selectedIds.length, paginatedAccounts]);

	const handleBulkUpdateStatus = useCallback(
		(newStatus: AccountStatus) => {
			if (selectedIds.length === 0) return;
			accountPlanRepository.bulkUpdateStatus(selectedIds, newStatus);
			setSelectedIds([]);
			showToast(
				"success",
				newStatus === "active"
					? t(localizationConstants.accountActivatedSuccess)
					: t(localizationConstants.accountDeactivatedSuccess),
			);
		},
		[selectedIds, t],
	);

	const handleDelete = useCallback(() => {
		if (!deletingItem) return;
		const success = accountPlanRepository.delete(deletingItem.id);
		if (success) {
			showToast("success", t(localizationConstants.accountDeletedSuccess));
		} else {
			showToast("error", t(localizationConstants.genericError));
		}
		setDeletingItem(null);
	}, [deletingItem, t]);

	const navigateToCreate = useCallback(() => {
		router.push(ACCOUNT_PLAN_CREATE_ROUTE);
	}, [router]);

	const navigateToImport = useCallback(() => {
		router.push(ACCOUNT_PLAN_IMPORT_ROUTE);
	}, [router]);

	const navigateToDetail = useCallback(
		(id: string) => {
			router.push(`${ACCOUNT_PLAN_BASE_ROUTE}/${id}`);
		},
		[router],
	);

	return {
		accounts: paginatedAccounts,
		allFilteredAccounts: sortedAccounts,
		totalItems,
		isLoading,
		searchQuery,
		statusParam,
		sortByParam,
		sortOrderParam,
		page,
		pageSize,
		selectedIds,
		deletingItem,
		setDeletingItem,
		handleSearchChange,
		handleStatusFilterChange,
		handleSort,
		handlePageChange,
		handleToggleSelectRow,
		handleToggleSelectAll,
		handleBulkUpdateStatus,
		handleDelete,
		navigateToCreate,
		navigateToImport,
		navigateToDetail,
	};
}
