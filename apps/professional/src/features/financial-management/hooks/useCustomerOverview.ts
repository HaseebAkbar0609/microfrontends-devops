"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CustomerOverviewRow,
	CustomerStatus,
} from "../types/customerOverview.types";
import { customerOverviewRepository } from "../utils/customerOverviewRepository";
import { DEFAULT_CUSTOMER_PAGE_SIZE } from "../constants/customerOverview.constants";

export function useCustomerOverview() {
	const t = useTranslate();
	const [customers, setCustomers] = useState<CustomerOverviewRow[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | CustomerStatus>("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_CUSTOMER_PAGE_SIZE);
	const [sortBy, setSortBy] = useState<string | undefined>(undefined);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);

	const loadData = useCallback(() => {
		setIsLoading(true);
		try {
			const res = customerOverviewRepository.query({
				page,
				limit: pageSize,
				search: searchQuery,
				status: statusFilter,
				sortBy,
				sortOrder,
			});
			setCustomers(res.data);
			setTotalItems(res.total);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchQuery, statusFilter, sortBy, sortOrder, t]);

	useEffect(() => {
		loadData();
		const unsubscribe = customerOverviewRepository.subscribe(loadData);
		return () => {
			unsubscribe();
		};
	}, [loadData]);

	const deleteCustomer = useCallback(
		(id: string) => {
			const success = customerOverviewRepository.delete(id);
			if (success) {
				showToast("success", t(localizationConstants.deleteLabel));
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
			customers,
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
			deleteCustomer,
			refetch: loadData,
		}),
		[
			customers,
			totalItems,
			isLoading,
			searchQuery,
			statusFilter,
			page,
			pageSize,
			sortBy,
			sortOrder,
			handleSort,
			deleteCustomer,
			loadData,
		],
	);
}
