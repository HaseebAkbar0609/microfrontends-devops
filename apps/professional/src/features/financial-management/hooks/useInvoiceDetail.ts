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
	const [editModalSection, setEditModalSection] = useState<"header" | "paymentPlan" | "comments" | null>(null);
	const [showPrintView, setShowPrintView] = useState<boolean>(false);

	const loadData = useCallback(() => {
		try {
			const data = invoiceRepository.getInvoiceDetail(invoiceId);
			setInvoiceData(data);
		} catch (e) {
			console.error("Failed to load invoice detail:", e);
		} finally {
			setIsLoading(false);
		}
	}, [invoiceId]);

	useEffect(() => {
		setIsLoading(true);
		loadData();

		// Subscribe to repository changes so updates reflect immediately
		const unsubscribe = invoiceRepository.subscribe(() => {
			loadData();
		});

		return () => {
			unsubscribe();
		};
	}, [loadData]);

	// Calculations for Line Items
	const calculations: InvoiceDetailCalculations = useMemo(() => {
		if (!invoiceData || !invoiceData.lineItems) {
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

		invoiceData.lineItems.forEach((item) => {
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
	}, [invoiceData]);

	// Time Report Totals
	const timeReportTotals = useMemo(() => {
		if (!invoiceData || !invoiceData.timeReportItems) {
			return { regularHours: 0, ataHours: 0, totalHours: 0 };
		}
		let regularHours = 0;
		let ataHours = 0;
		invoiceData.timeReportItems.forEach((item) => {
			regularHours += Number(item.regularHours) || 0;
			ataHours += Number(item.ataHours) || 0;
		});
		return {
			regularHours,
			ataHours,
			totalHours: regularHours + ataHours,
		};
	}, [invoiceData]);

	// Underlag Totals
	const underlagTotals = useMemo(() => {
		if (!invoiceData || !invoiceData.underlagItems) {
			return { totalAmount: 0, totalMarkup: 0, totalSubtotal: 0 };
		}
		let totalAmount = 0;
		let totalMarkup = 0;
		let totalSubtotal = 0;
		invoiceData.underlagItems.forEach((item) => {
			totalAmount += Number(item.amount) || 0;
			totalMarkup += Number(item.markupAmount) || 0;
			totalSubtotal += Number(item.subtotal) || 0;
		});
		return {
			totalAmount,
			totalMarkup,
			totalSubtotal,
		};
	}, [invoiceData]);

	// Actions
	const updateInvoiceData = useCallback(
		(updates: Partial<InvoiceDetailData>) => {
			if (!invoiceData) return;
			const updated: InvoiceDetailData = {
				...invoiceData,
				...updates,
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

	const handleMarkAsPaid = useCallback(() => {
		invoiceRepository.markInvoiceAsPaid(invoiceId);
		toast.success("Fakturan har markerats som betald");
	}, [invoiceId]);

	const handleCreditInvoice = useCallback(() => {
		invoiceRepository.creditInvoice(invoiceId);
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
		calculations,
		timeReportTotals,
		underlagTotals,
		editModalSection,
		setEditModalSection,
		showPrintView,
		setShowPrintView,
		updateInvoiceData,
		handleSendInvoice,
		handleMarkAsPaid,
		handleCreditInvoice,
		handlePrint,
	};
}

export default useInvoiceDetail;
