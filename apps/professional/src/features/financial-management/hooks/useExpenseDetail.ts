"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ExpenseItem, ExpenseLineItem } from "../types/expense.types";
import { expenseRepository } from "../utils/expenseRepository";
import localizationConstants from "@/utils/translation/constants";
import { toast } from "sonner";

export interface ExpenseDetailCalculations {
	netTotal: number;
	vatTotal: number;
	rounding: number;
	grandTotal: number;
}

export function useExpenseDetail(expenseId: string) {
	const router = useRouter();
	const { t } = useTranslation();

	const [expense, setExpense] = useState<ExpenseItem | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Safe State Mutation Modals (Edwin's Standard #5)
	const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
	const [confirmMarkPaidOpen, setConfirmMarkPaidOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [confirmDisputeOpen, setConfirmDisputeOpen] = useState(false);
	const [confirmCertifiedOpen, setConfirmCertifiedOpen] = useState(false);
	const [confirmMoveToSupplierOpen, setConfirmMoveToSupplierOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Collapsible accordions open states
	const [timeReportOpen, setTimeReportOpen] = useState(true);
	const [attachmentsOpen, setAttachmentsOpen] = useState(true);

	// Load expense record
	const loadExpense = useCallback(() => {
		setIsLoading(true);
		setError(null);

		try {
			const item = expenseRepository.getExpenseById(expenseId);
			if (item) {
				setExpense(item);
			} else {
				setError(t(localizationConstants.expenseDetailNotFound));
			}
		} catch (err) {
			console.error("Failed to load expense", err);
			setError(t(localizationConstants.expenseDetailNotFound));
		} finally {
			setIsLoading(false);
		}
	}, [expenseId, t]);

	useEffect(() => {
		loadExpense();
		const unsubscribe = expenseRepository.subscribe(() => {
			const item = expenseRepository.getExpenseById(expenseId);
			if (item) {
				setExpense(item);
			}
		});
		return () => unsubscribe();
	}, [loadExpense, expenseId]);

	// Granular Calculations Memo (Edwin's Standard #7)
	const calculations: ExpenseDetailCalculations = useMemo(() => {
		if (!expense) {
			return { netTotal: 0, vatTotal: 0, rounding: 0, grandTotal: 0 };
		}

		let net = 0;
		let vat = 0;

		const lineItems: ExpenseLineItem[] = expense.lineItems || [];
		if (lineItems.length > 0) {
			for (const line of lineItems) {
				const lineTotal = line.total || 0;
				net += lineTotal;
				const rate = line.vatRate || 25;
				vat += (lineTotal * rate) / 100;
			}
		} else {
			net = expense.amount || 0;
			vat = expense.vatAmount || 0;
		}

		const roundedNet = Math.round(net * 100) / 100;
		const roundedVat = Math.round(vat * 100) / 100;
		const total = roundedNet + roundedVat;
		const roundedTotal = Math.round(total);
		const rounding = Math.round((roundedTotal - total) * 100) / 100;

		return {
			netTotal: roundedNet,
			vatTotal: roundedVat,
			rounding,
			grandTotal: roundedTotal,
		};
	}, [expense]);

	// Actions
	const handleApprove = useCallback(async () => {
		if (!expense) return;
		setIsSubmitting(true);
		try {
			const today = new Date().toISOString().split("T")[0];
			const newTimeline = [
				...(expense.timeline || []),
				{
					id: `tl-${Date.now()}`,
					titleKey: "expenseTimelineApproved",
					date: today,
					user: "Kalle Andersson",
					status: "completed" as const,
				},
			];

			await expenseRepository.updateExpense(expense.id, {
				approvalStatus: "approved",
				status: "klar",
				timeline: newTimeline,
			});

			toast.success(t(localizationConstants.expenseDetailStatusApprovedSuccess));
			setConfirmApproveOpen(false);
		} catch (err) {
			console.error("Failed to approve expense", err);
		} finally {
			setIsSubmitting(false);
		}
	}, [expense, t]);

	const handleMarkAsPaid = useCallback(async () => {
		if (!expense) return;
		setIsSubmitting(true);
		try {
			const today = new Date().toISOString().split("T")[0];
			const newTimeline = [
				...(expense.timeline || []),
				{
					id: `tl-${Date.now()}`,
					titleKey: "expenseTimelinePaymentSent",
					date: today,
					user: "Bankgiro",
					status: "completed" as const,
				},
			];

			await expenseRepository.updateExpense(expense.id, {
				status: "klar",
				paymentDate: today,
				timeline: newTimeline,
			});

			toast.success(t(localizationConstants.expenseDetailStatusPaidSuccess));
			setConfirmMarkPaidOpen(false);
		} catch (err) {
			console.error("Failed to mark expense as paid", err);
		} finally {
			setIsSubmitting(false);
		}
	}, [expense, t]);

	const handleDelete = useCallback(async () => {
		if (!expense) return;
		setIsSubmitting(true);
		try {
			await expenseRepository.deleteExpense(expense.id);
			toast.success(t(localizationConstants.expenseConfirmDeleteTitle));
			setConfirmDeleteOpen(false);
			router.push("/module/financial-management/economy");
		} catch (err) {
			console.error("Failed to delete expense", err);
		} finally {
			setIsSubmitting(false);
		}
	}, [expense, router, t]);

	const handleDispute = useCallback(async () => {
		if (!expense) return;
		setIsSubmitting(true);
		try {
			await expenseRepository.updateExpense(expense.id, {
				status: "reklamerad",
			});
			toast.success(t(localizationConstants.expenseConfirmDisputeTitle));
			setConfirmDisputeOpen(false);
		} catch (err) {
			console.error("Failed to dispute expense", err);
		} finally {
			setIsSubmitting(false);
		}
	}, [expense, t]);

	const handleMarkCertified = useCallback(async () => {
		if (!expense) return;
		setIsSubmitting(true);
		try {
			await expenseRepository.updateExpense(expense.id, {
				status: "klar",
				approvalStatus: "approved",
			});
			toast.success(t(localizationConstants.expenseConfirmCertifiedTitle));
			setConfirmCertifiedOpen(false);
		} catch (err) {
			console.error("Failed to certify expense", err);
		} finally {
			setIsSubmitting(false);
		}
	}, [expense, t]);

	const handleMoveToSupplierList = useCallback(async () => {
		if (!expense) return;
		setIsSubmitting(true);
		try {
			await expenseRepository.updateExpense(expense.id, {
				isInboxItem: false,
			});
			toast.success(t(localizationConstants.expenseConfirmMoveToSupplierListTitle));
			setConfirmMoveToSupplierOpen(false);
		} catch (err) {
			console.error("Failed to move expense to supplier list", err);
		} finally {
			setIsSubmitting(false);
		}
	}, [expense, t]);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

	return {
		expense,
		isLoading,
		error,
		reload: loadExpense,
		calculations,
		timeReportOpen,
		setTimeReportOpen,
		attachmentsOpen,
		setAttachmentsOpen,
		confirmApproveOpen,
		setConfirmApproveOpen,
		confirmMarkPaidOpen,
		setConfirmMarkPaidOpen,
		confirmDeleteOpen,
		setConfirmDeleteOpen,
		confirmDisputeOpen,
		setConfirmDisputeOpen,
		confirmCertifiedOpen,
		setConfirmCertifiedOpen,
		confirmMoveToSupplierOpen,
		setConfirmMoveToSupplierOpen,
		isSubmitting,
		handleApprove,
		handleMarkAsPaid,
		handleDelete,
		handleDispute,
		handleMarkCertified,
		handleMoveToSupplierList,
		handlePrint,
	};
}
