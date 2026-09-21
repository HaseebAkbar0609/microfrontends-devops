"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	SupplierOverviewRow,
	SupplierStatus,
} from "../types/supplierOverview.types";
import { supplierOverviewRepository } from "../utils/supplierOverviewRepository";
import { supplierDetailRepository } from "../utils/supplierDetailRepository";
import { DEFAULT_SUPPLIER_PAGE_SIZE } from "../constants/supplierOverview.constants";

export function useSupplierOverview() {
	const t = useTranslate();
	const [suppliers, setSuppliers] = useState<SupplierOverviewRow[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | SupplierStatus>("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_SUPPLIER_PAGE_SIZE);
	const [sortBy, setSortBy] = useState<string | undefined>(undefined);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);

	const loadData = useCallback(() => {
		setIsLoading(true);
		try {
			const res = supplierOverviewRepository.query({
				page,
				limit: pageSize,
				search: searchQuery,
				status: statusFilter,
				sortBy,
				sortOrder,
			});
			setSuppliers(res.data);
			setTotalItems(res.total);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchQuery, statusFilter, sortBy, sortOrder, t]);

	useEffect(() => {
		loadData();
		const unsubscribe = supplierOverviewRepository.subscribe(loadData);
		return () => {
			unsubscribe();
		};
	}, [loadData]);

	const deleteSupplier = useCallback(
		(id: string) => {
			supplierDetailRepository.delete(id);
			const success = supplierOverviewRepository.delete(id);
			if (success) {
				showToast("success", t(localizationConstants.supplierToastDeleted));
			}
		},
		[t],
	);

	const handleSort = useCallback((field: string, nextOrder: "asc" | "desc" | null) => {
		const order = nextOrder ?? undefined;
		setSortBy(order ? field : undefined);
		setSortOrder(order);
	}, []);

	return useMemo(
		() => ({
			suppliers,
			totalItems,
			isLoading,
			searchQuery,
			setSearchQuery,
			statusFilter,
			setStatusFilter,
			page,
			setPage,
			pageSize,
			setPageSize,
			sortBy,
			sortOrder,
			handleSort,
			deleteSupplier,
			refetch: loadData,
		}),
		[
			suppliers,
			totalItems,
			isLoading,
			searchQuery,
			statusFilter,
			page,
			pageSize,
			sortBy,
			sortOrder,
			handleSort,
			deleteSupplier,
			loadData,
		],
	);
}
