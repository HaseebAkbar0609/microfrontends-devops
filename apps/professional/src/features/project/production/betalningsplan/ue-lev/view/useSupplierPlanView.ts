"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { todayIso } from "../../../../shared/todayIso";
import { buildProjectRecordInfo } from "../../../data/projectRecordInfo.mock";
import { paymentPlanUrls } from "../../paymentPlanNav";
import * as store from "../services/supplierPlanService";
import { approveBlockedReason } from "../supplierPlan.config";
import { summariseSupplier } from "../supplierPlanMath";
import type { SupplierAconto } from "../types";

/** Which dialog is open. One at a time, so two confirms can never stack. */
export type SupplierPlanDialog =
	| { kind: "markPaid"; aconto: SupplierAconto }
	| { kind: "viewInvoice"; aconto: SupplierAconto }
	| { kind: "approve" };

/**
 * A supplier plan's view: the plan as the store holds it, and the three things
 * the project does to it — pay an aconto, tick documents as reviewed, approve.
 *
 * Each change writes to the store and re-reads, so the list shows it straight
 * away. There is no draft and no save: every action is a single confirmed step.
 */
export function useSupplierPlanView(projectId: string, planId: string) {
	const { t } = useTranslation();
	const router = useRouter();

	const [plan, setPlan] = useState(() => store.getSupplierPlan(projectId, planId));
	const [dialog, setDialog] = useState<SupplierPlanDialog | null>(null);

	const projectInfo = useMemo(() => buildProjectRecordInfo(projectId), [projectId]);
	const summary = useMemo(() => (plan ? summariseSupplier(plan.acontos) : null), [plan]);
	const approveReason = plan ? approveBlockedReason(plan) : null;
	const locked = plan?.status === "approved";

	const refresh = useCallback(
		() => setPlan(store.getSupplierPlan(projectId, planId)),
		[planId, projectId],
	);

	/* Opened from a row menu, a dialog waits for the menu to finish closing: in
	   the same tick Radix leaves `pointer-events: none` on <body>. */
	const openDialog = useCallback((next: SupplierPlanDialog) => {
		setTimeout(() => setDialog(next), 0);
	}, []);
	const closeDialog = useCallback(() => setDialog(null), []);

	const markPaid = useCallback(
		(acontoId: string) => {
			if (!store.markAcontoPaid(planId, acontoId, todayIso())) return;
			refresh();
			showToast("success", t(localizationConstants.projectSupplierPlanPaidToast));
		},
		[planId, refresh, t],
	);

	const setReviewed = useCallback(
		(documentIds: string[], reviewed: boolean) => {
			if (!store.setDocumentsReviewed(planId, documentIds, reviewed)) return;
			refresh();
			showToast("success", t(localizationConstants.projectSupplierPlanReviewedToast));
		},
		[planId, refresh, t],
	);

	const approve = useCallback(() => {
		if (!store.approveSupplierPlan(planId, todayIso())) return;
		showToast("success", t(localizationConstants.projectSupplierPlanApprovedToast));
		router.push(paymentPlanUrls.supplierList(projectId));
	}, [planId, projectId, router, t]);

	return {
		plan,
		projectInfo,
		summary,
		approveReason,
		locked,
		dialog,
		openDialog,
		closeDialog,
		markPaid,
		setReviewed,
		approve,
		backToList: () => router.push(paymentPlanUrls.supplierList(projectId)),
	};
}

export type SupplierPlanView = ReturnType<typeof useSupplierPlanView>;
