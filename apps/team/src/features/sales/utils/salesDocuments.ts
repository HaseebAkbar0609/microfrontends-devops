import localizationConstants from "@/utils/translation/constants";
import { getSalesOrderHref, getSalesQuoteHref } from "../constants/salesNav";
import { getSalesStatusMeta } from "../constants/salesStatuses";
import type { SalesDocumentType } from "../constants/salesDocumentTypes";
import type { SalesCompany, SalesCustomDocument } from "../types";

export type SalesDocument = {
	id: string;
	type: SalesDocumentType;
	number: string;
	companyId: string;
	companyName: string;
	date: string;
	statusKey: string;
	amount: number;
	/** Where the document opens, or null when it is a stored file. */
	href: string | null;
};

export type DocumentFilters = { type: SalesDocumentType | "all"; query: string };

/**
 * Every document in the sales system: the quotes, order confirmations and
 * invoices the CRM produced, plus whatever was added by hand.
 */
export function getSalesDocuments(
	companies: SalesCompany[],
	custom: SalesCustomDocument[],
): SalesDocument[] {
	const documents: SalesDocument[] = [];

	for (const company of companies) {
		const statusKey = getSalesStatusMeta(company.status).labelKey;

		if (company.quote) {
			documents.push({
				id: `${company.id}-quote`,
				type: "quote",
				number: company.quote.quoteNumber,
				companyId: company.id,
				companyName: company.name,
				date: company.quote.createdAt,
				statusKey,
				amount: company.quote.firstInvoice,
				href: getSalesQuoteHref(company.id),
			});
		}

		if (company.order) {
			documents.push({
				id: `${company.id}-order`,
				type: "order",
				number: company.order.orderNumber,
				companyId: company.id,
				companyName: company.name,
				date: company.order.createdAt,
				statusKey,
				amount: company.quote?.firstInvoice ?? 0,
				href: getSalesOrderHref(company.id),
			});
		}

		if (company.payment) {
			documents.push({
				id: `${company.id}-invoice`,
				type: "invoice",
				number: company.payment.invoiceNumber,
				companyId: company.id,
				companyName: company.name,
				date: company.payment.sentAt,
				statusKey:
					company.payment.status === "paid"
						? localizationConstants.salesPaymentPaid
						: localizationConstants.salesPaymentPending,
				amount: company.payment.amount,
				href: getSalesOrderHref(company.id),
			});
		}
	}

	for (const document of custom) {
		documents.push({
			id: document.id,
			type: document.type,
			number: document.number,
			companyId: document.companyId,
			companyName: document.companyName,
			date: document.date,
			statusKey: localizationConstants.salesDocStatusStored,
			amount: document.amount,
			href: null,
		});
	}

	return documents.sort((a, b) => b.date.localeCompare(a.date));
}

export function filterSalesDocuments(
	documents: SalesDocument[],
	{ type, query }: DocumentFilters,
): SalesDocument[] {
	const needle = query.trim().toLowerCase();
	return documents.filter(
		(document) =>
			(type === "all" || document.type === type) &&
			(!needle ||
				document.companyName.toLowerCase().includes(needle) ||
				document.number.toLowerCase().includes(needle)),
	);
}

/** How many documents each filter pill would show. */
export function countByType(
	documents: SalesDocument[],
): Record<string, number> {
	const counts: Record<string, number> = { all: documents.length };
	for (const document of documents) {
		counts[document.type] = (counts[document.type] ?? 0) + 1;
	}
	return counts;
}

/** The four figures across the top, for whatever is currently selected. */
export function getDocumentTotals(documents: SalesDocument[]) {
	return {
		documents: documents.length,
		quotes: documents.filter((document) => document.type === "quote").length,
		orders: documents.filter((document) => document.type === "order").length,
		invoiced: documents
			.filter((document) => document.type === "invoice")
			.reduce((total, document) => total + document.amount, 0),
	};
}
