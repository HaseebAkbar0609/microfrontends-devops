"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { usePagination } from "@/hooks/usePagination";
import { TIMEPLAN_CONSTANTS } from "../constants/timeplan.constants";
import type {
	OrderTimeplan,
	TimeplanColumnKey,
} from "../types/timeplan.types";
import {
	getOrderTimeplansAction,
	deleteOrderTimeplanAction,
} from "@/api-actions/orders/timeplan";

export interface UseOrderTimeplansProps {
	orderId?: string;
}

export function useOrderTimeplans({
	orderId = TIMEPLAN_CONSTANTS.DEFAULT_ORDER_ID,
}: UseOrderTimeplansProps = {}) {
	const t = useTranslate();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [plans, setPlans] = useState<OrderTimeplan[]>([]);
	const [sortField, setSortField] = useState<TimeplanColumnKey | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getOrderTimeplansAction(orderId);
			if (res.success && res.data) {
				setPlans(res.data);
			}
		} catch {
			// Handled gracefully in action
		} finally {
			setIsLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const sortedPlans = useMemo(() => {
		if (!sortField) return plans;
		return [...plans].sort((a, b) => {
			const valA = a[sortField];
			const valB = b[sortField];
			if (!valA) return 1;
			if (!valB) return -1;
			const comp = String(valA).localeCompare(String(valB), "sv");
			return sortOrder === "asc" ? comp : -comp;
		});
	}, [plans, sortField, sortOrder]);

	const {
		page: currentPage,
		setPage: setCurrentPage,
		pageSize,
		setPageSize,
		paged: paginatedPlans,
		totalPages,
	} = usePagination(sortedPlans);

	const handleSort = useCallback((field: TimeplanColumnKey) => {
		setSortField((current) => {
			if (current === field) {
				setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
				return field;
			}
			setSortOrder("asc");
			return field;
		});
	}, []);

	const handleDeletePlan = useCallback(
		async (plan: OrderTimeplan) => {
			try {
				const res = await deleteOrderTimeplanAction(orderId, plan.id);
				if (res.success) {
					setPlans((prev) => prev.filter((p) => p.id !== plan.id));
					showToast("success", t(localizationConstants.orderTimeplanDeleteSuccess));
				}
			} catch {
				showToast("error", t(localizationConstants.orderTimeplanDeleteConfirmTitle));
			}
		},
		[orderId, t]
	);

	return {
		isLoading,
		plans: paginatedPlans,
		totalCount: sortedPlans.length,
		currentPage,
		totalPages,
		pageSize,
		setCurrentPage,
		setPageSize,
		sortField,
		sortOrder,
		handleSort,
		handleDeletePlan,
		refreshData: loadData,
	};
}


