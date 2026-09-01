import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	CreateInvoiceTab,
	CreateInvoiceFormData,
	InvoiceLineItem,
	PaymentPlanItem,
	TimeReportItem,
} from "../types/createInvoice.types";

const INITIAL_LINE_ITEMS: InvoiceLineItem[] = [
	{
		id: "line-1",
		articleId: "1001",
		description: "Aconto 3",
		quantity: 10,
		unit: "tim",
		unitPrice: 750,
		subtotal: 10000,
		handlingType: "discount",
		handlingPercentage: 5,
		adjustmentAmount: -1000,
		total: 9000,
		costCenter: "10",
	},
	{
		id: "line-2",
		articleId: "1002",
		description: "Elektriker",
		quantity: 1,
		unit: "styck",
		unitPrice: 150000,
		subtotal: 150000,
		handlingType: "markup",
		handlingPercentage: 10,
		adjustmentAmount: 15000,
		total: 165000,
		costCenter: "10",
	},
	{
		id: "line-3",
		articleId: "1002",
		description: "Arbete",
		quantity: 10,
		unit: "tim",
		unitPrice: 500,
		subtotal: 5000,
		handlingType: "rotrut",
		handlingPercentage: 30,
		adjustmentAmount: -1500,
		total: 3500,
		costCenter: "10",
	},
];

const INITIAL_PAYMENT_PLANS: PaymentPlanItem[] = [
	{
		id: "pp-1",
		invoiceNo: "1001",
		date: "2026-01-01",
		description: "Aconto 3",
		quantity: 0,
		unit: "tim",
		unitPrice: 750,
		withheld: 375000,
		amount: 375000,
		paid: 375000,
		cost: 375000,
	},
	{
		id: "pp-2",
		invoiceNo: "1002",
		date: "2026-01-01",
		description: "Service electric guitar",
		quantity: 0,
		unit: "tim",
		unitPrice: 750,
		withheld: 375000,
		amount: 375000,
		paid: 375000,
		cost: 375000,
	},
];

const INITIAL_TIME_REPORTS: TimeReportItem[] = [
	{
		id: "tr-1",
		date: "2026-02-10",
		employee: "Kalle Andersson",
		workHours: 5,
		unit: "tim",
		ataHours: 20,
		totalHours: 8,
		costCenter: "10",
		comments: "",
	},
	{
		id: "tr-2",
		date: "2026-02-12",
		employee: "Stefan Svensson",
		workHours: 8,
		unit: "tim",
		ataHours: 15,
		totalHours: 6,
		costCenter: "10",
		comments: "",
	},
];

export function useCreateInvoice() {
	const router = useRouter();
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState<CreateInvoiceTab>("oversikt");
	const [previewOpen, setPreviewOpen] = useState(false);

	const [formData, setFormData] = useState<CreateInvoiceFormData>({
		attachTimeReport: true,
		attachDocumentation: true,
		isCreditInvoice: true,
		invoiceNo: "4563",
		status: "Startade",
		template: "standard",

		customer: "Fox",
		category: "Projekt",
		projectName: "Kv Solen",
		projectNumber: "2025-001",
		contactPerson: "Kalle Andersson",
		projectSum: 0.0,
		invoicedEarlier: 0.0,
		invoiceInclThis: 0.0,

		invoiceDate: "2023-12-12",
		rotRutType: "rot",
		paymentPlanType: "info",
		pricingModel: "lopande",

		lineItems: INITIAL_LINE_ITEMS,
		paymentPlanItems: INITIAL_PAYMENT_PLANS,
		timeReportItems: INITIAL_TIME_REPORTS,
		attachments: [],

		comments:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

		detailedReporting: true,
		mergedReport: true,
		showAta: true,
	});

	// Field updater helper
	const updateField = useCallback(
		<K extends keyof CreateInvoiceFormData>(key: K, value: CreateInvoiceFormData[K]) => {
			setFormData((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	// Line Item calculations
	const addLineItem = useCallback(() => {
		const newItem: InvoiceLineItem = {
			id: `line-${Date.now()}`,
			articleId: "1001",
			description: "",
			quantity: 1,
			unit: "tim",
			unitPrice: 0,
			subtotal: 0,
			handlingType: "none",
			handlingPercentage: 0,
			adjustmentAmount: 0,
			total: 0,
			costCenter: "10",
		};
		setFormData((prev) => ({
			...prev,
			lineItems: [...prev.lineItems, newItem],
		}));
	}, []);

	const updateLineItem = useCallback(
		(id: string, updates: Partial<InvoiceLineItem>) => {
			setFormData((prev) => {
				const updatedLines = prev.lineItems.map((item) => {
					if (item.id !== id) return item;

					const merged = { ...item, ...updates };
					const qty = Number(merged.quantity) || 0;
					const price = Number(merged.unitPrice) || 0;
					const subtotal = qty * price;

					let adjustment = 0;
					const pct = Number(merged.handlingPercentage) || 0;

					if (merged.handlingType === "discount") {
						adjustment = -1 * (subtotal * (pct / 100));
					} else if (merged.handlingType === "markup") {
						adjustment = subtotal * (pct / 100);
					} else if (merged.handlingType === "rotrut") {
						adjustment = -1 * (subtotal * (pct / 100));
					}

					return {
						...merged,
						quantity: qty,
						unitPrice: price,
						subtotal,
						adjustmentAmount: adjustment,
						total: subtotal + adjustment,
					};
				});

				return { ...prev, lineItems: updatedLines };
			});
		},
		[],
	);

	const removeLineItem = useCallback((id: string) => {
		setFormData((prev) => ({
			...prev,
			lineItems: prev.lineItems.filter((item) => item.id !== id),
		}));
	}, []);

	// Payment Plan actions
	const addPaymentPlanRow = useCallback(() => {
		const newPP: PaymentPlanItem = {
			id: `pp-${Date.now()}`,
			invoiceNo: String(1000 + formData.paymentPlanItems.length + 1),
			date: new Date().toISOString().split("T")[0],
			description: "",
			quantity: 0,
			unit: "tim",
			unitPrice: 0,
			withheld: 0,
			amount: 0,
			paid: 0,
			cost: 0,
		};
		setFormData((prev) => ({
			...prev,
			paymentPlanItems: [...prev.paymentPlanItems, newPP],
		}));
	}, [formData.paymentPlanItems.length]);

	const removePaymentPlanRow = useCallback((id: string) => {
		setFormData((prev) => ({
			...prev,
			paymentPlanItems: prev.paymentPlanItems.filter((item) => item.id !== id),
		}));
	}, []);

	// Time Report actions
	const addTimeReportRow = useCallback(() => {
		const newTR: TimeReportItem = {
			id: `tr-${Date.now()}`,
			date: new Date().toISOString().split("T")[0],
			employee: "",
			workHours: 0,
			unit: "tim",
			ataHours: 0,
			totalHours: 0,
			costCenter: "10",
			comments: "",
		};
		setFormData((prev) => ({
			...prev,
			timeReportItems: [...prev.timeReportItems, newTR],
		}));
	}, []);

	const removeTimeReportRow = useCallback((id: string) => {
		setFormData((prev) => ({
			...prev,
			timeReportItems: prev.timeReportItems.filter((item) => item.id !== id),
		}));
	}, []);

	// Calculations summary
	const calculations = useMemo(() => {
		let delsumma = 0;
		let totalDiscount = 0;
		let totalMarkup = 0;
		let totalRotRut = 0;

		formData.lineItems.forEach((item) => {
			delsumma += item.subtotal;
			if (item.handlingType === "discount") {
				totalDiscount += item.adjustmentAmount;
			} else if (item.handlingType === "markup") {
				totalMarkup += item.adjustmentAmount;
			} else if (item.handlingType === "rotrut") {
				totalRotRut += item.adjustmentAmount;
			}
		});

		const totalExclVat = delsumma + totalDiscount + totalMarkup + totalRotRut;
		const vatAmount = totalExclVat * 0.25;
		const attErhalla = totalExclVat + vatAmount;

		return {
			delsumma,
			totalDiscount,
			totalMarkup,
			totalRotRut,
			totalExclVat,
			vatAmount,
			attErhalla,
		};
	}, [formData.lineItems]);

	// Time report totals
	const timeReportTotals = useMemo(() => {
		let totalWork = 0;
		let totalAta = 0;
		let totalTime = 0;

		formData.timeReportItems.forEach((tr) => {
			totalWork += tr.workHours;
			totalAta += tr.ataHours;
			totalTime += tr.totalHours;
		});

		return { totalWork, totalAta, totalTime };
	}, [formData.timeReportItems]);

	// Handlers
	const handleSaveDraft = useCallback(() => {
		toast.success(t(localizationConstants.createInvoiceSaveSuccess));
		router.push("/module/financial-management/invoice");
	}, [router, t]);

	const handleSendInvoice = useCallback(() => {
		toast.success(t(localizationConstants.createInvoiceSendSuccessToast));
		router.push("/module/financial-management/invoice");
	}, [router, t]);

	const handleCancel = useCallback(() => {
		router.push("/module/financial-management/invoice");
	}, [router]);

	return {
		activeTab,
		setActiveTab,
		previewOpen,
		setPreviewOpen,
		formData,
		updateField,
		addLineItem,
		updateLineItem,
		removeLineItem,
		addPaymentPlanRow,
		removePaymentPlanRow,
		addTimeReportRow,
		removeTimeReportRow,
		calculations,
		timeReportTotals,
		handleSaveDraft,
		handleSendInvoice,
		handleCancel,
	};
}
