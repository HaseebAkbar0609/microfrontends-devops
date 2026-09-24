"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import { sortItems } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { todayIso } from "../../../../shared/todayIso";
import * as store from "../services/supplierPlanService";
import {
	SUPPLIER_LIST_COLUMNS,
	SUPPLIER_STATUS_RANK,
	type SupplierColumnKey,
} from "../supplierPlan.config";
import type { SupplierPaymentPlan, SupplierPlanStatus } from "../types";

const DEFAULT_PAGE_SIZE = 10;

/**
 * The UE / Lev list: the project's supplier plans, searched by company,
 * filtered by status, sorted, paged, with the + picker's visible columns.
 */
export function useSupplierPlanList(projectId: string) {
	/* react-i18next's `t` is stable, so the callbacks below stay stable too. */
	const { t } = useTranslation();

	const [plans, setPlans] = useState(() => store.listSupplierPlans(projectId));
	const [search, setSearchState] = useState("");
	const [status, setStatusState] = useState<string | null>(null);
	const { sortField, sortDir, toggleSort } = useTableSort<SupplierColumnKey>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
	const [visibleColumns, setVisibleColumns] = useState<ReadonlySet<SupplierColumnKey>>(
		() => new Set(SUPPLIER_LIST_COLUMNS.map((column) => column.key)),
	);

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		return plans.filter(
			(plan) =>
				(!status || plan.status === (status as SupplierPlanStatus)) &&
				(!query || plan.companyName.toLowerCase().includes(query)),
		);
	}, [plans, search, status]);

	const ordered = useMemo(
		() =>
			sortItems(filtered, sortField, sortDir, (plan, field) => {
				if (field === "status") return SUPPLIER_STATUS_RANK[plan.status];
				if (field === "totalAmount") return plan.totalAmount;
				return plan.companyName;
			}),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
	const safePage = Math.min(page, totalPages);
	const rows = useMemo(
		() => ordered.slice((safePage - 1) * pageSize, safePage * pageSize),
		[ordered, safePage, pageSize],
	);

	const setSearch = useCallback((value: string) => {
		setSearchState(value);
		setPage(1);
	}, []);

	const setStatus = useCallback((value: string | null) => {
		setStatusState(value);
		setPage(1);
	}, []);

	const onSort = useCallback(
		(field: SupplierColumnKey) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeState(size);
		setPage(1);
	}, []);

	/** Hides or shows a column, never hiding the last one left. */
	const toggleColumn = useCallback((key: SupplierColumnKey) => {
		setVisibleColumns((previous) => {
			const next = new Set(previous);
			if (next.has(key)) {
				if (next.size > 1) next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	}, []);

	const approve = useCallback(
		(plan: SupplierPaymentPlan) => {
			if (!store.approveSupplierPlan(plan.id, todayIso())) return;
			setPlans(store.listSupplierPlans(projectId));
			showToast("success", t(localizationConstants.projectSupplierPlanApprovedToast));
		},
		[projectId, t],
	);

	return {
		rows,
		isEmpty: plans.length === 0,
		search,
		setSearch,
		status,
		setStatus,
		sortField,
		sortDir,
		onSort,
		page: safePage,
		setPage,
		pageSize,
		setPageSize,
		totalPages,
		visibleColumns,
		toggleColumn,
		approve,
	};
}

export type SupplierPlanListState = ReturnType<typeof useSupplierPlanList>;
