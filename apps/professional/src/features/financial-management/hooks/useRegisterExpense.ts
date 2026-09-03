"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import {
	RegisterExpenseFormData,
	ExpenseLineItem,
	ExpenseAttachment,
	RegisterExpenseCalculations,
	RegisterExpenseErrors,
	ExpenseItem,
	SwedishVatRate,
	ExpenseTimeReportItem,
} from "../types/expense.types";
import {
	DEFAULT_VAT_RATE,
	SWEDISH_VAT_RATES,
	EXPENSE_LIST_ROUTE,
	MAX_ATTACHMENT_SIZE_BYTES,
	ALLOWED_ATTACHMENT_TYPES,
} from "../constants/expense.constants";
import { expenseRepository } from "../utils/expenseRepository";

function getTodayString(): string {
	return new Date().toISOString().split("T")[0];
}

function getDueDateString(days = 30): string {
	const d = new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString().split("T")[0];
}

function createEmptyLineItem(): ExpenseLineItem {
	return {
		id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
		description: "",
		quantity: 1,
		unit: "st",
		unitPrice: 0,
		vatRate: DEFAULT_VAT_RATE,
		accountNumber: "4010",
		total: 0,
	};
}

function createEmptyTimeReportItem(): ExpenseTimeReportItem {
	return {
		id: `time-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
		date: getTodayString(),
		referenceName: "",
		workedHours: 8,
		unit: "tim",
		hourlyRate: 650,
		total: 5200,
		comments: "",
		included: true,
	};
}

function getInitialFormData(): RegisterExpenseFormData {
	return {
		supplier: "",
		fakturaNo: "",
		date: getTodayString(),
		dueDate: getDueDateString(30),
		category: "material",
		project: "",
		costCenter: "",
		lineItems: [createEmptyLineItem()],
		attachments: [],
		notes: "",
		timeReportItems: [],
		comments: "",
	};
}

export function useRegisterExpense() {
	const router = useRouter();
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState<"oversikt" | "tidrapport" | "underlag">("oversikt");
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [formData, setFormData] = useState<RegisterExpenseFormData>(getInitialFormData);
	const [suppliers, setSuppliers] = useState<string[]>(() => expenseRepository.getSuppliers());
	const [errors, setErrors] = useState<RegisterExpenseErrors>({});
	const [isDirty, setIsDirty] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
	const [showSupplierModal, setShowSupplierModal] = useState<boolean>(false);

	// Update top-level field
	const updateField = useCallback(
		<K extends keyof RegisterExpenseFormData>(field: K, value: RegisterExpenseFormData[K]) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
			setIsDirty(true);
			setErrors((prev) => {
				if (prev[field as keyof RegisterExpenseErrors]) {
					const copy = { ...prev };
					delete copy[field as keyof RegisterExpenseErrors];
					return copy;
				}
				return prev;
			});
		},
		[],
	);

	// Line Item Operations
	const addLineItem = useCallback(() => {
		setFormData((prev) => ({
			...prev,
			lineItems: [...prev.lineItems, createEmptyLineItem()],
		}));
		setIsDirty(true);
	}, []);

	const updateLineItem = useCallback(
		(id: string, updates: Partial<ExpenseLineItem>) => {
			setFormData((prev) => {
				const nextItems = prev.lineItems.map((item) => {
					if (item.id !== id) return item;
					const updated = { ...item, ...updates };
					const qty = Math.max(0, updated.quantity || 0);
					const price = Math.max(0, updated.unitPrice || 0);
					updated.total = Math.round(qty * price * 100) / 100;
					return updated;
				});
				return { ...prev, lineItems: nextItems };
			});
			setIsDirty(true);
			setErrors((prev) => {
				if (prev.lineItems) {
					const copy = { ...prev };
					delete copy.lineItems;
					return copy;
				}
				return prev;
			});
		},
		[],
	);

	const removeLineItem = useCallback((id: string) => {
		setFormData((prev) => {
			if (prev.lineItems.length <= 1) {
				return { ...prev, lineItems: [createEmptyLineItem()] };
			}
			return {
				...prev,
				lineItems: prev.lineItems.filter((i) => i.id !== id),
			};
		});
		setIsDirty(true);
	}, []);

	// Attachments handling
	const addAttachments = useCallback((files: File[]) => {
		const newAttachments: ExpenseAttachment[] = [];

		for (const file of files) {
			if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
				continue;
			}
			if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
				continue;
			}

			newAttachments.push({
				id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
				name: file.name,
				size: file.size,
				type: file.type,
				uploadedAt: new Date().toISOString(),
			});
		}

		if (newAttachments.length > 0) {
			setFormData((prev) => ({
				...prev,
				attachments: [...prev.attachments, ...newAttachments],
			}));
			setIsDirty(true);
		}
	}, []);

	const removeAttachment = useCallback((id: string) => {
		setFormData((prev) => ({
			...prev,
			attachments: prev.attachments.filter((a) => a.id !== id),
		}));
		setIsDirty(true);
	}, []);

	// Time Report Operations
	const addTimeReportRow = useCallback(() => {
		setFormData((prev) => ({
			...prev,
			timeReportItems: [...prev.timeReportItems, createEmptyTimeReportItem()],
		}));
		setIsDirty(true);
	}, []);

	const updateTimeReportRow = useCallback(
		(id: string, updates: Partial<ExpenseTimeReportItem>) => {
			setFormData((prev) => {
				const next = prev.timeReportItems.map((row) => {
					if (row.id !== id) return row;
					const updated = { ...row, ...updates };
					const hrs = Math.max(0, updated.workedHours || 0);
					const rate = Math.max(0, updated.hourlyRate || 0);
					updated.total = Math.round(hrs * rate * 100) / 100;
					return updated;
				});
				return { ...prev, timeReportItems: next };
			});
			setIsDirty(true);
		},
		[],
	);

	const removeTimeReportRow = useCallback((id: string) => {
		setFormData((prev) => ({
			...prev,
			timeReportItems: prev.timeReportItems.filter((row) => row.id !== id),
		}));
		setIsDirty(true);
	}, []);

	// Time report totals memo
	const timeReportTotals = useMemo(() => {
		let totalHours = 0;
		let totalAmount = 0;
		for (const row of formData.timeReportItems) {
			if (row.included) {
				totalHours += row.workedHours || 0;
				totalAmount += row.total || 0;
			}
		}
		return { totalHours, totalAmount };
	}, [formData.timeReportItems]);

	// Supplier management
	const handleAddSupplier = useCallback((name: string) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		expenseRepository.addSupplier(trimmed);
		setSuppliers(expenseRepository.getSuppliers());
		setFormData((prev) => ({ ...prev, supplier: trimmed }));
		setErrors((prev) => {
			if (prev.supplier) {
				const copy = { ...prev };
				delete copy.supplier;
				return copy;
			}
			return prev;
		});
		setIsDirty(true);
		setShowSupplierModal(false);
	}, []);

	// Real-time calculations with granular memoization (Standard #7)
	const calculations: RegisterExpenseCalculations = useMemo(() => {
		let subtotal = 0;
		const vatMap: Record<SwedishVatRate, { basis: number; vat: number }> = {
			25: { basis: 0, vat: 0 },
			12: { basis: 0, vat: 0 },
			6: { basis: 0, vat: 0 },
			0: { basis: 0, vat: 0 },
		};

		for (const item of formData.lineItems) {
			const lineTotal = item.total || 0;
			subtotal += lineTotal;

			const rate = item.vatRate;
			if (rate in vatMap) {
				vatMap[rate].basis += lineTotal;
				vatMap[rate].vat += (lineTotal * rate) / 100;
			}
		}

		// If user logged time report items and has no line items, compute from time report
		if (formData.lineItems.length === 0 && formData.timeReportItems.length > 0) {
			for (const row of formData.timeReportItems) {
				if (row.included) {
					const lineTotal = row.total || 0;
					subtotal += lineTotal;
					vatMap[25].basis += lineTotal;
					vatMap[25].vat += (lineTotal * 25) / 100;
				}
			}
		}

		let totalVat = 0;
		const vatBreakdown = SWEDISH_VAT_RATES.map((rate) => {
			const info = vatMap[rate];
			const roundedVat = Math.round(info.vat * 100) / 100;
			totalVat += roundedVat;
			return {
				rate,
				basisAmount: Math.round(info.basis * 100) / 100,
				vatAmount: roundedVat,
			};
		}).filter((b) => b.basisAmount > 0 || b.vatAmount > 0);

		const roundedSubtotal = Math.round(subtotal * 100) / 100;
		const grandTotal = Math.round((roundedSubtotal + totalVat) * 100) / 100;

		return {
			subtotal: roundedSubtotal,
			vatBreakdown,
			totalVat: Math.round(totalVat * 100) / 100,
			grandTotal,
		};
	}, [formData.lineItems, formData.timeReportItems]);

	// Validation
	const validate = useCallback((): { isValid: boolean; errorMessage: string } => {
		const newErrors: RegisterExpenseErrors = {};
		let firstErrorMsg = "";

		if (!formData.supplier.trim()) {
			newErrors.supplier = t(localizationConstants.registerExpenseErrorSupplierRequired);
			if (!firstErrorMsg) firstErrorMsg = newErrors.supplier;
		}

		if (!formData.fakturaNo.trim()) {
			newErrors.fakturaNo = t(localizationConstants.registerExpenseErrorInvoiceNoRequired);
			if (!firstErrorMsg) firstErrorMsg = newErrors.fakturaNo;
		}

		if (!formData.date) {
			newErrors.date = t(localizationConstants.registerExpenseErrorDateRequired);
			if (!firstErrorMsg) firstErrorMsg = newErrors.date;
		}

		if (!formData.dueDate) {
			newErrors.dueDate = t(localizationConstants.registerExpenseErrorDueDateRequired);
			if (!firstErrorMsg) firstErrorMsg = newErrors.dueDate;
		}

		if (!formData.category) {
			newErrors.category = t(localizationConstants.registerExpenseErrorCategoryRequired);
			if (!firstErrorMsg) firstErrorMsg = newErrors.category;
		}

		const hasLineItems = formData.lineItems.length > 0;
		const hasIncludedTimeReport = formData.timeReportItems.some((item) => item.included);

		if (!hasLineItems && !hasIncludedTimeReport) {
			newErrors.lineItems = t(localizationConstants.registerExpenseErrorLineItemsRequired);
			if (!firstErrorMsg) firstErrorMsg = newErrors.lineItems;
		} else if (hasLineItems) {
			const hasInvalidLine = formData.lineItems.some(
				(item) => !item.description.trim() || item.quantity <= 0 || item.unitPrice < 0,
			);
			if (hasInvalidLine) {
				newErrors.lineItems = t(localizationConstants.registerExpenseErrorLineItemDesc);
				if (!firstErrorMsg) firstErrorMsg = newErrors.lineItems;
			}
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			// Switch to the relevant tab so the user sees the highlighted red input
			if (
				newErrors.supplier ||
				newErrors.fakturaNo ||
				newErrors.date ||
				newErrors.dueDate ||
				newErrors.category ||
				newErrors.lineItems
			) {
				setActiveTab("oversikt");
			}
			return { isValid: false, errorMessage: firstErrorMsg };
		}

		return { isValid: true, errorMessage: "" };
	}, [formData, t]);

	// Build ExpenseItem payload
	const buildExpensePayload = useCallback((): ExpenseItem => {
		const nextId = `exp-${Date.now()}`;
		const expenseNo = `${Math.floor(100000 + Math.random() * 900000)}`;

		return {
			id: nextId,
			expenseNo,
			fakturaNo: formData.fakturaNo.trim(),
			supplier: formData.supplier.trim(),
			category: formData.category,
			amount: calculations.grandTotal,
			vatAmount: calculations.totalVat,
			status: "klar",
			date: formData.date,
			invoiceDate: formData.date,
			dueDate: formData.dueDate,
			project: formData.project.trim() || "-",
			projectNumber: formData.project.trim() || "-",
			costCenter: formData.costCenter.trim() || "10",
			attestResponsible: "-",
			notes: formData.notes.trim() || undefined,
			lineItems:
				formData.lineItems.length > 0
					? [...formData.lineItems]
					: formData.timeReportItems
							.filter((tr) => tr.included)
							.map((tr) => ({
								id: tr.id,
								description: `${tr.referenceName}${tr.comments ? ` - ${tr.comments}` : ""}`,
								quantity: tr.workedHours,
								unit: "tim",
								unitPrice: tr.hourlyRate,
								vatRate: 25 as const,
								accountNumber: "4010",
								total: tr.total,
							})),
			attachments: [...formData.attachments],
		};
	}, [formData, calculations]);

	// Save and navigate to list
	const handleSave = useCallback(async () => {
		const validation = validate();
		if (!validation.isValid) {
			showToast("error", validation.errorMessage);
			return;
		}

		setIsSaving(true);
		try {
			const payload = buildExpensePayload();
			await expenseRepository.addExpense(payload);
			showToast("success", t(localizationConstants.registerExpenseSuccessSaved));
			setIsDirty(false);
			router.push(EXPENSE_LIST_ROUTE);
		} catch (e) {
			console.error("Failed to register expense", e);
		} finally {
			setIsSaving(false);
		}
	}, [validate, buildExpensePayload, router, t]);

	// Save and reset form for next entry
	const handleSaveAndAddAnother = useCallback(async () => {
		const validation = validate();
		if (!validation.isValid) {
			showToast("error", validation.errorMessage);
			return;
		}

		setIsSaving(true);
		try {
			const payload = buildExpensePayload();
			await expenseRepository.addExpense(payload);
			showToast("success", t(localizationConstants.registerExpenseSuccessSavedAndNext));
			setFormData(getInitialFormData());
			setErrors({});
			setIsDirty(false);
		} catch (e) {
			console.error("Failed to register expense", e);
		} finally {
			setIsSaving(false);
		}
	}, [validate, buildExpensePayload, t]);

	// Cancel handler with dirty protection
	const handleCancel = useCallback(() => {
		if (isDirty) {
			setShowDiscardModal(true);
		} else {
			router.push(EXPENSE_LIST_ROUTE);
		}
	}, [isDirty, router]);

	const confirmDiscard = useCallback(() => {
		setShowDiscardModal(false);
		setIsDirty(false);
		router.push(EXPENSE_LIST_ROUTE);
	}, [router]);

	return {
		activeTab,
		setActiveTab,
		previewOpen,
		setPreviewOpen,
		formData,
		updateField,
		suppliers,
		handleAddSupplier,
		errors,
		isDirty,
		isSaving,
		showDiscardModal,
		setShowDiscardModal,
		showSupplierModal,
		setShowSupplierModal,
		calculations,
		addLineItem,
		updateLineItem,
		removeLineItem,
		addTimeReportRow,
		updateTimeReportRow,
		removeTimeReportRow,
		timeReportTotals,
		addAttachments,
		removeAttachment,
		handleSave,
		handleSaveAndAddAnother,
		handleCancel,
		confirmDiscard,
	};
}
