"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	BestallarePaymentPlan,
	UeLevPaymentPlan,
	PaymentPlanDetail,
	PaymentMilestone,
	PaymentPlanDocument,
} from "../types/paymentPlan.types";
import {
	getBestallarePaymentPlansAction,
	getUeLevPaymentPlansAction,
	getPaymentPlanDetailAction,
	createPaymentPlanAction,
	deletePaymentPlanAction,
} from "@/api-actions/orders/paymentPlan";
import {
	createUeLevPaymentPlan,
	sendPaymentPlan,
	updatePaymentPlanDetail,
} from "../api/paymentPlan.api";
import { PAYMENT_PLAN_CONSTANTS } from "../constants/paymentPlan.constants";

export function usePaymentPlan(orderId: string = PAYMENT_PLAN_CONSTANTS.DEFAULT_ORDER_ID) {
	const t = useTranslate();

	const [bestallarePlans, setBestallarePlans] = useState<BestallarePaymentPlan[]>([]);
	const [ueLevPlans, setUeLevPlans] = useState<UeLevPaymentPlan[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [pageSize, setPageSize] = useState<number>(PAYMENT_PLAN_CONSTANTS.DEFAULT_PAGE_SIZE);
	const [currentPage, setCurrentPage] = useState(1);

	// Fetch lists
	const fetchPlans = useCallback(async () => {
		setIsLoading(true);
		try {
			const [bestallareRes, ueLevRes] = await Promise.all([
				getBestallarePaymentPlansAction(orderId),
				getUeLevPaymentPlansAction(orderId),
			]);
			if (bestallareRes.data) {
				setBestallarePlans(bestallareRes.data);
			}
			if (ueLevRes.data) {
				setUeLevPlans(ueLevRes.data);
			}
		} catch (err) {
			console.warn("[usePaymentPlan] fetch error:", err);
		} finally {
			setIsLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		fetchPlans();
	}, [fetchPlans]);

	// Filtered Beställare Plans
	const filteredBestallarePlans = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return bestallarePlans.filter((plan) => {
			const matchesSearch =
				!q ||
				plan.name.toLowerCase().includes(q) ||
				plan.fileName.toLowerCase().includes(q) ||
				String(plan.planNumber).includes(q);
			const matchesFilter =
				statusFilter === "all" || plan.status === statusFilter;
			return matchesSearch && matchesFilter;
		});
	}, [bestallarePlans, searchQuery, statusFilter]);

	// Filtered UE/Lev Plans
	const filteredUeLevPlans = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return ueLevPlans.filter((plan) => {
			const matchesSearch =
				!q ||
				plan.companyName.toLowerCase().includes(q) ||
				(plan.role && plan.role.toLowerCase().includes(q));
			const matchesFilter =
				statusFilter === "all" || plan.status === statusFilter;
			return matchesSearch && matchesFilter;
		});
	}, [ueLevPlans, searchQuery, statusFilter]);

	// Paginated UE/Lev Plans
	const totalPages = Math.max(1, Math.ceil(filteredUeLevPlans.length / pageSize));
	const paginatedUeLevPlans = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredUeLevPlans.slice(start, start + pageSize);
	}, [filteredUeLevPlans, currentPage, pageSize]);

	// Actions
	const handleAddBestallarePlan = async (name: string, fileName = "Kontrakt.pdf") => {
		const nextNumber = bestallarePlans.length + 1;
		const res = await createPaymentPlanAction(orderId, {
			name,
			planNumber: nextNumber,
			fileName,
		});
		const created = res.data || {
			id: `plan-${Date.now()}`,
			planNumber: nextNumber,
			name,
			fileName,
			fileType: "pdf" as const,
			status: "not_invoiced" as const,
			createdAt: new Date().toISOString().split("T")[0],
			totalAmount: 0,
		};
		setBestallarePlans((prev) => [...prev, created]);
		toast.success(t(localizationConstants.toastPlanSaved));
		return created;
	};

	const handleAddUeLevPlan = async (payload: Partial<UeLevPaymentPlan>) => {
		const created = await createUeLevPaymentPlan(orderId, payload);
		setUeLevPlans((prev) => [...prev, created]);
		toast.success(t(localizationConstants.toastPlanSaved));
		return created;
	};

	const handleDeletePlan = async (planId: string, isUe = false) => {
		await deletePaymentPlanAction(orderId, planId);
		if (isUe) {
			setUeLevPlans((prev) => prev.filter((p) => p.id !== planId));
		} else {
			setBestallarePlans((prev) => prev.filter((p) => p.id !== planId));
		}
		toast.success(t(localizationConstants.toastPlanDeleted));
	};

	const handleSendPlan = async (planId: string) => {
		await sendPaymentPlan(orderId, planId);
		toast.success(t(localizationConstants.toastPlanSent));
	};

	return {
		isLoading,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		bestallarePlans: filteredBestallarePlans,
		ueLevPlans: paginatedUeLevPlans,
		rawUeLevCount: filteredUeLevPlans.length,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		handleAddBestallarePlan,
		handleAddUeLevPlan,
		handleDeletePlan,
		handleSendPlan,
		refresh: fetchPlans,
	};
}

export function usePaymentPlanDetail(
	orderId: string = PAYMENT_PLAN_CONSTANTS.DEFAULT_ORDER_ID,
	planId: string = "1"
) {
	const t = useTranslate();
	const [detail, setDetail] = useState<PaymentPlanDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchDetail = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getPaymentPlanDetailAction(orderId, planId);
			if (res.data) {
				setDetail(res.data);
			}
		} catch (err) {
			console.warn("[usePaymentPlanDetail] fetch error:", err);
		} finally {
			setIsLoading(false);
		}
	}, [orderId, planId]);

	useEffect(() => {
		fetchDetail();
	}, [fetchDetail]);

	// Auto calculations for financial summary
	const calculations = useMemo(() => {
		if (!detail) {
			return {
				totalSum: 0,
				totalInvoicedSent: 0,
				remainingToSend: 0,
				totalRetained: 0,
			};
		}
		const totalSum = detail.projectInfo.kontraktSumma || detail.summary.kontraktsumma || 0;
		const totalInvoicedSent = detail.milestones.reduce((acc, m) => acc + (m.attErhalla || 0), 0);
		const totalRetained = detail.milestones.reduce((acc, m) => acc + (m.innehallet || 0), 0);
		const remainingToSend = -(totalSum - totalInvoicedSent);

		return {
			totalSum,
			totalInvoicedSent,
			remainingToSend,
			totalRetained,
		};
	}, [detail]);

	// Add milestone
	const addMilestone = (milestone: Omit<PaymentMilestone, "id">) => {
		if (!detail) return;
		const newMilestone: PaymentMilestone = {
			...milestone,
			id: `m-${Date.now()}`,
		};
		setDetail((prev) => (prev ? { ...prev, milestones: [...prev.milestones, newMilestone] } : null));
		toast.success(t(localizationConstants.toastMilestoneAdded));
	};

	// Delete milestone
	const deleteMilestone = (milestoneId: string) => {
		if (!detail) return;
		setDetail((prev) =>
			prev ? { ...prev, milestones: prev.milestones.filter((m) => m.id !== milestoneId) } : null
		);
		toast.success(t(localizationConstants.toastMilestoneDeleted));
	};

	// Add document
	const addDocument = (doc: Omit<PaymentPlanDocument, "id">) => {
		if (!detail) return;
		const newDoc: PaymentPlanDocument = {
			...doc,
			id: `d-${Date.now()}`,
		};
		setDetail((prev) => (prev ? { ...prev, documents: [...prev.documents, newDoc] } : null));
		toast.success(t(localizationConstants.toastDocumentUploaded));
	};

	// Delete document
	const deleteDocument = (docId: string) => {
		if (!detail) return;
		setDetail((prev) =>
			prev ? { ...prev, documents: prev.documents.filter((d) => d.id !== docId) } : null
		);
		toast.success(t(localizationConstants.toastDocumentDeleted));
	};

	// Save entire detail
	const saveDetail = async () => {
		if (!detail) return;
		await updatePaymentPlanDetail(orderId, planId, detail);
		toast.success(t(localizationConstants.toastPlanSaved));
	};

	// Send payment plan
	const sendPlan = async () => {
		await sendPaymentPlan(orderId, planId);
		setDetail((prev) => (prev ? { ...prev, status: "sent" } : null));
		toast.success(t(localizationConstants.toastPlanSent));
	};

	return {
		detail,
		setDetail,
		isLoading,
		calculations,
		addMilestone,
		deleteMilestone,
		addDocument,
		deleteDocument,
		saveDetail,
		sendPlan,
	};
}
