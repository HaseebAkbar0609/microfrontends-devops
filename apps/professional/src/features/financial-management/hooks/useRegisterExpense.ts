"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
	EXPENSE_INBOX_TAB,
	EXPENSE_LIST_TAB_QUERY_PARAM,
	MAX_ATTACHMENT_SIZE_BYTES,
	ALLOWED_ATTACHMENT_TYPES,
} from "../constants/expense.constants";
import { expenseRepository } from "../utils/expenseRepository";
import { generateSecureId, generateSecureExpenseNo } from "../utils/cryptoUtils";
import { registerExpenseFormSchema } from "../schemas/registerExpense.schema";

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
		id: generateSecureId("line"),
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
		id: generateSecureId("time"),
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
		currency: "SEK",
		reference: "",
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
	const searchParams = useSearchParams();
	const { t } = useTranslation();
	const isInboxSource = searchParams.get(EXPENSE_LIST_TAB_QUERY_PARAM) === EXPENSE_INBOX_TAB;
	const returnRoute = isInboxSource
		? `${EXPENSE_LIST_ROUTE}?${EXPENSE_LIST_TAB_QUERY_PARAM}=${EXPENSE_INBOX_TAB}`
		: EXPENSE_LIST_ROUTE;

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

	// Line item operations
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
				const newLineItems = prev.lineItems.map((item) => {
					if (item.id !== id) return item;
					const updated = { ...item, ...updates };

					// Auto-calculate line total: quantity * unitPrice
					if ("quantity" in updates || "unitPrice" in updates) {
						const qty = updated.quantity || 0;
						const price = updated.unitPrice || 0;
						updated.total = Math.round(qty * price * 100) / 100;
					}
					return updated;
				});
				return { ...prev, lineItems: newLineItems };
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
		setFormData((prev) => ({
			...prev,
			lineItems: prev.lineItems.filter((item) => item.id !== id),
		}));
		setIsDirty(true);
	}, []);

	// Time report operations
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
				const newTimeItems = prev.timeReportItems.map((item) => {
					if (item.id !== id) return item;
					const updated = { ...item, ...updates };

					if ("workedHours" in updates || "hourlyRate" in updates) {
						const hrs = updated.workedHours || 0;
						const rate = updated.hourlyRate || 0;
						updated.total = Math.round(hrs * rate * 100) / 100;
					}
					return updated;
				});
				return { ...prev, timeReportItems: newTimeItems };
			});
			setIsDirty(true);
		},
		[],
	);

	const removeTimeReportRow = useCallback((id: string) => {
		setFormData((prev) => ({
			...prev,
			timeReportItems: prev.timeReportItems.filter((item) => item.id !== id),
		}));
		setIsDirty(true);
	}, []);

	// Attachment operations (using secure UUIDs)
	const addAttachments = useCallback((files: FileList | File[]) => {
		const fileArray = Array.from(files);
		const newAttachments: ExpenseAttachment[] = [];

		for (const file of fileArray) {
			if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
				continue;
			}
			if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
				continue;
			}

			newAttachments.push({
				id: generateSecureId("att"),
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

	// Supplier management
	const handleAddSupplier = useCallback((name: string, details?: Partial<import("../types/expense.types").SupplierInfo>) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		expenseRepository.addSupplier(trimmed, details);
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

	// Active supplier details for verification card
	const selectedSupplierDetails = useMemo(() => {
		return expenseRepository.getSupplierDetails(formData.supplier);
	}, [formData.supplier]);

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

	// Granular calculation sub-memos (Standard #7 Performance Optimization)
	const lineItemsSubtotal = useMemo(() => {
		return formData.lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
	}, [formData.lineItems]);

	const timeReportSubtotal = useMemo(() => {
		return formData.timeReportItems.reduce((sum, row) => {
			return row.included ? sum + (row.total || 0) : sum;
		}, 0);
	}, [formData.timeReportItems]);

	// Real-time calculations with granular memoization (Standard #7)
	const calculations: RegisterExpenseCalculations = useMemo(() => {
		let subtotal = 0;
		const vatMap: Record<SwedishVatRate, { basis: number; vat: number }> = {
			25: { basis: 0, vat: 0 },
			12: { basis: 0, vat: 0 },
			6: { basis: 0, vat: 0 },
			0: { basis: 0, vat: 0 },
		};

		if (formData.lineItems.length > 0) {
			subtotal = lineItemsSubtotal;
			for (const item of formData.lineItems) {
				const lineTotal = item.total || 0;
				const rate = item.vatRate;
				if (rate in vatMap) {
					vatMap[rate].basis += lineTotal;
					vatMap[rate].vat += (lineTotal * rate) / 100;
				}
			}
		} else if (formData.timeReportItems.length > 0) {
			subtotal = timeReportSubtotal;
			vatMap[25].basis += timeReportSubtotal;
			vatMap[25].vat += (timeReportSubtotal * 25) / 100;
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
			currency: formData.currency,
		};
	}, [formData.lineItems, formData.timeReportItems, formData.currency, lineItemsSubtotal, timeReportSubtotal]);

	// Validation using Zod schema (Technology Stack standard)
	const validate = useCallback((): { isValid: boolean; errorMessage: string } => {
		const result = registerExpenseFormSchema.safeParse(formData);

		if (!result.success) {
			const newErrors: RegisterExpenseErrors = {};
			let firstErrorMsg = "";

			for (const issue of result.error.issues) {
				const pathKey = issue.path[0] as keyof RegisterExpenseErrors;
				const issueKey = issue.message as keyof typeof localizationConstants;
				const localizedMsg =
					issueKey in localizationConstants
						? t(localizationConstants[issueKey])
						: issue.message;

				if (pathKey && !newErrors[pathKey]) {
					newErrors[pathKey] = localizedMsg;
				}
				if (!firstErrorMsg) {
					firstErrorMsg = localizedMsg;
				}
			}

			setErrors(newErrors);

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

		setErrors({});
		return { isValid: true, errorMessage: "" };
	}, [formData, t]);

	// Build ExpenseItem payload using secure UUIDs and random numbers
	const buildExpensePayload = useCallback((): ExpenseItem => {
		const nextId = generateSecureId("exp");
		const expenseNo = generateSecureExpenseNo(100000, 999999);
		const supplierInfo = expenseRepository.getSupplierDetails(formData.supplier);

		return {
			id: nextId,
			expenseNo,
			fakturaNo: formData.fakturaNo.trim(),
			supplier: formData.supplier.trim(),
			supplierOrgNo: supplierInfo?.orgNo,
			supplierAddress: supplierInfo?.address,
			supplierPostalCity: supplierInfo?.postalCity,
			supplierPhone: supplierInfo?.phone,
			supplierEmail: supplierInfo?.email,
			bankgiro: supplierInfo?.bankgiro,
			reference: formData.reference.trim() || undefined,
			category: formData.category,
			amount: calculations.grandTotal,
			vatAmount: calculations.totalVat,
			status: "klar",
			isInboxItem: isInboxSource,
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
	}, [formData, calculations, isInboxSource]);

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
			router.push(returnRoute);
		} catch (e) {
			console.error("Failed to register expense", e);
		} finally {
			setIsSaving(false);
		}
	}, [validate, buildExpensePayload, returnRoute, router, t]);

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
			router.push(returnRoute);
		}
	}, [isDirty, returnRoute, router]);

	const confirmDiscard = useCallback(() => {
		setShowDiscardModal(false);
		setIsDirty(false);
		router.push(returnRoute);
	}, [returnRoute, router]);

	return {
		activeTab,
		setActiveTab,
		previewOpen,
		setPreviewOpen,
		formData,
		updateField,
		suppliers,
		selectedSupplierDetails,
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

export default useRegisterExpense;
