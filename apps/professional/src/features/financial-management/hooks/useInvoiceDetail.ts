"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
	InvoiceDetailData,
	InvoiceDetailCalculations,
} from "../types/invoiceDetail.types";
import { invoiceRepository } from "../utils/invoiceRepository";
import { VAT_RATE } from "../constants/invoice.constants";

export function useInvoiceDetail(invoiceId: string) {
	const [activeTab, setActiveTab] = useState<"oversikt" | "tidrapport" | "faktura-underlag">("oversikt");
	const [invoiceData, setInvoiceData] = useState<InvoiceDetailData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [editModalSection, setEditModalSection] = useState<"header" | "paymentPlan" | "comments" | null>(null);
	const [showPrintView, setShowPrintView] = useState<boolean>(false);

	// Confirmation modal states for safe UX
	const [confirmMarkPaidOpen, setConfirmMarkPaidOpen] = useState<boolean>(false);
	const [confirmCreditOpen, setConfirmCreditOpen] = useState<boolean>(false);

	const loadData = useCallback(() => {
		setIsLoading(true);
		setError(null);
		try {
			const data = invoiceRepository.getInvoiceDetail(invoiceId);
			if (!data) {
				setError("Kunde inte hitta fakturan");
			} else {
				setInvoiceData(data);
			}
		} catch (e) {
			const errorMsg = e instanceof Error ? e.message : "Ett oväntat fel uppstod vid laddning";
			console.error("Failed to load invoice detail:", e);
			setError(errorMsg);
		} finally {
			setIsLoading(false);
		}
	}, [invoiceId]);

	useEffect(() => {
		loadData();

		// Subscribe to repository changes so updates reflect immediately
		const unsubscribe = invoiceRepository.subscribe(() => {
			const current = invoiceRepository.getInvoiceDetail(invoiceId);
			if (current) setInvoiceData(current);
		});

		return () => {
			unsubscribe();
		};
	}, [invoiceId, loadData]);

	// Calculations for Line Items - strictly memoized by lineItems array for performance
	const calculations: InvoiceDetailCalculations = useMemo(() => {
		const lineItems = invoiceData?.lineItems;
		if (!lineItems || lineItems.length === 0) {
			return {
				delsumma: 0,
				totalDiscount: 0,
				totalMarkup: 0,
				totalRotRut: 0,
				totalExclVat: 0,
				vatRate: VAT_RATE,
				vatAmount: 0,
				attErhalla: 0,
			};
		}

		let delsumma = 0;
		let totalDiscount = 0;
		let totalMarkup = 0;
		let totalRotRut = 0;

		lineItems.forEach((item) => {
			const itemSubtotal = item.delsumma || item.quantity * item.unitPrice;
			delsumma += itemSubtotal;

			if (item.handlingType === "rabatt") {
				totalDiscount += item.adjustment;
			} else if (item.handlingType === "påslag") {
				totalMarkup += item.adjustment;
			} else if (item.handlingType === "rot/rut") {
				totalRotRut += item.adjustment;
			}
		});

		const totalExclVat = delsumma + totalDiscount + totalMarkup + totalRotRut;
		const vatAmount = Math.round(totalExclVat * VAT_RATE);
		const attErhalla = totalExclVat + vatAmount;

		return {
			delsumma,
			totalDiscount,
			totalMarkup,
			totalRotRut,
			totalExclVat,
			vatRate: VAT_RATE,
			vatAmount,
			attErhalla,
		};
	}, [invoiceData?.lineItems]);

	// Time Report Totals - memoized by timeReportItems
	const timeReportTotals = useMemo(() => {
		const timeReportItems = invoiceData?.timeReportItems;
		if (!timeReportItems || timeReportItems.length === 0) {
			return { regularHours: 0, ataHours: 0, totalHours: 0 };
		}
		let regularHours = 0;
		let ataHours = 0;
		timeReportItems.forEach((item) => {
			regularHours += Number(item.regularHours) || 0;
			ataHours += Number(item.ataHours) || 0;
		});
		return {
			regularHours,
			ataHours,
			totalHours: regularHours + ataHours,
		};
	}, [invoiceData?.timeReportItems]);

	// Underlag Totals - memoized by underlagItems
	const underlagTotals = useMemo(() => {
		const underlagItems = invoiceData?.underlagItems;
		if (!underlagItems || underlagItems.length === 0) {
			return { totalAmount: 0, totalMarkup: 0, totalSubtotal: 0 };
		}
		let totalAmount = 0;
		let totalMarkup = 0;
		let totalSubtotal = 0;
		underlagItems.forEach((item) => {
			totalAmount += Number(item.amount) || 0;
			totalMarkup += Number(item.markupAmount) || 0;
			totalSubtotal += Number(item.subtotal) || 0;
		});
		return {
			totalAmount,
			totalMarkup,
			totalSubtotal,
		};
	}, [invoiceData?.underlagItems]);

	// Explicit Type Safety & Data Validation on Edit
	const updateInvoiceData = useCallback(
		(updates: Partial<InvoiceDetailData>) => {
			if (!invoiceData) return;

			// Strict type validation
			const validatedCustomer = typeof updates.customer === "string" ? updates.customer : invoiceData.customer;
			const validatedProjectName = typeof updates.projectName === "string" ? updates.projectName : invoiceData.projectName;
			const validatedInvoiceDate = typeof updates.invoiceDate === "string" ? updates.invoiceDate : invoiceData.invoiceDate;
			const validatedDueDate = typeof updates.dueDate === "string" ? updates.dueDate : invoiceData.dueDate;

			if (!validatedCustomer.trim() || !validatedProjectName.trim()) {
				toast.error("Kund och projektnamn måste anges");
				return;
			}

			const updated: InvoiceDetailData = {
				...invoiceData,
				...updates,
				customer: validatedCustomer,
				projectName: validatedProjectName,
				invoiceDate: validatedInvoiceDate,
				dueDate: validatedDueDate,
			};

			invoiceRepository.saveInvoiceDetail(updated);
			setInvoiceData(updated);
			toast.success("Ändringarna har sparats");
		},
		[invoiceData],
	);

	const handleSendInvoice = useCallback(() => {
		invoiceRepository.sendInvoice(invoiceId);
		toast.success("Fakturan har skickats");
	}, [invoiceId]);

	// UX: Execute Mark as Paid with Confirmation Flow
	const executeMarkAsPaid = useCallback(() => {
		invoiceRepository.markInvoiceAsPaid(invoiceId);
		setConfirmMarkPaidOpen(false);
		toast.success("Fakturan har markerats som betald");
	}, [invoiceId]);

	// UX: Execute Credit Invoice with Confirmation Flow
	const executeCreditInvoice = useCallback(() => {
		invoiceRepository.creditInvoice(invoiceId);
		setConfirmCreditOpen(false);
		toast.success("Fakturan har krediterats");
	}, [invoiceId]);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

	return {
		activeTab,
		setActiveTab,
		invoiceData,
		isLoading,
		error,
		retry: loadData,
		calculations,
		timeReportTotals,
		underlagTotals,
		editModalSection,
		setEditModalSection,
		showPrintView,
		setShowPrintView,
		updateInvoiceData,
		handleSendInvoice,
		confirmMarkPaidOpen,
		setConfirmMarkPaidOpen,
		confirmCreditOpen,
		setConfirmCreditOpen,
		executeMarkAsPaid,
		executeCreditInvoice,
		handlePrint,
	};
}

export default useInvoiceDetail;
