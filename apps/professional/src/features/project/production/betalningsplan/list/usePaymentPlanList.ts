"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import { sortItems } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_LIST_ROWS } from "../../../data/projectsOverview.mock";
import { parseKronor } from "../paymentPlanMath";
import * as store from "../services/paymentPlanService";
import type { PaymentPlanStatus, ProjectPaymentPlan } from "../types";
import type { PaymentPlanSortField } from "./paymentPlanListColumns";

const DEFAULT_PAGE_SIZE = 10;

/** The terms a new plan starts from: the project's contract, nothing retained. */
const NEW_PLAN_RETENTION = {
	retentionPerAcontoPercent: 0,
	retentionTotalPercent: 0,
	retentionFixedAmount: 0,
};

/**
 * The Beställare list: the project's plans, searched, filtered by status,
 * sorted and paged, with send / delete / create going through the store.
 */
export function usePaymentPlanList(projectId: string) {
	/* react-i18next's `t` is stable, so the callbacks below stay stable too. */
	const { t } = useTranslation();
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);

	const [plans, setPlans] = useState(() => store.listPlans(projectId));
	const [search, setSearchState] = useState("");
	const [status, setStatusState] = useState<string | null>(null);
	const { sortField, sortDir, toggleSort } = useTableSort<PaymentPlanSortField>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		return plans.filter((plan) => {
			if (status && plan.status !== (status as PaymentPlanStatus)) return false;
			if (!query) return true;
			return `${plan.planNumber} ${plan.name} ${plan.contractFileName ?? ""}`
				.toLowerCase()
				.includes(query);
		});
	}, [plans, search, status]);

	const ordered = useMemo(
		() =>
			sortItems(filtered, sortField, sortDir, (plan, field) => {
				const value = plan[field as PaymentPlanSortField];
				return typeof value === "number" ? value : (value ?? "");
			}),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
	/* Derived, so deleting the last row of the last page never strands the
	   reader past the end. */
	const safePage = Math.min(page, totalPages);
	const rows = useMemo(
		() => ordered.slice((safePage - 1) * pageSize, safePage * pageSize),
		[ordered, safePage, pageSize],
	);

	const refresh = useCallback(() => setPlans(store.listPlans(projectId)), [projectId]);

	const setSearch = useCallback((value: string) => {
		setSearchState(value);
		setPage(1);
	}, []);

	const setStatus = useCallback((value: string | null) => {
		setStatusState(value);
		setPage(1);
	}, []);

	const onSort = useCallback(
		(field: string) => {
			toggleSort(field as PaymentPlanSortField);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeState(size);
		setPage(1);
	}, []);

	const send = useCallback(
		(plan: ProjectPaymentPlan) => {
			store.markSent(plan.id);
			refresh();
			showToast("success", t(localizationConstants.toastPlanSent));
		},
		[refresh, t],
	);

	const remove = useCallback(
		(plan: ProjectPaymentPlan) => {
			store.removePlan(plan.id);
			refresh();
			showToast("success", t(localizationConstants.projectPaymentPlanDeletedToast));
		},
		[refresh, t],
	);

	const create = useCallback(
		(input: { name: string; contractFileName?: string; createdBy: string; today: string }) => {
			const plan = store.createPlan(projectId, {
				...input,
				terms: {
					contractSum: parseKronor(project?.contractSum ?? ""),
					...NEW_PLAN_RETENTION,
				},
			});
			showToast("success", t(localizationConstants.projectPaymentPlanCreatedToast));
			return plan;
		},
		[project?.contractSum, projectId, t],
	);

	return {
		project,
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
		send,
		remove,
		create,
	};
}
