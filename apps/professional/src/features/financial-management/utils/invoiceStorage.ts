import { InvoiceItem } from "../types/invoice.types";
import { MOCK_INVOICE_LIST } from "../mock/invoiceMockData";

const INVOICES_STORAGE_KEY = "tfs_professional_invoices";

export function getStoredInvoices(): InvoiceItem[] {
	if (typeof window === "undefined") return MOCK_INVOICE_LIST;
	try {
		const stored = localStorage.getItem(INVOICES_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed) && parsed.length > 0) {
				return parsed;
			}
		}
	} catch (e) {
		console.error("Failed to load invoices from localStorage", e);
	}
	return MOCK_INVOICE_LIST;
}

export function saveStoredInvoices(invoices: InvoiceItem[]): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
	} catch (e) {
		console.error("Failed to save invoices to localStorage", e);
	}
}

export function addStoredInvoice(newInvoice: InvoiceItem): void {
	const current = getStoredInvoices();
	const updated = [newInvoice, ...current.filter((inv) => inv.id !== newInvoice.id)];
	saveStoredInvoices(updated);
}
