import { ECONOMY_MOCK_INVOICES, EconomyInvoice } from "../constants/mockData";

export function listEconomyInvoices(): EconomyInvoice[] {
	return ECONOMY_MOCK_INVOICES;
}

export function getEconomyInvoiceById(id: string): EconomyInvoice | undefined {
	return ECONOMY_MOCK_INVOICES.find((invoice) => invoice.id === id);
}
