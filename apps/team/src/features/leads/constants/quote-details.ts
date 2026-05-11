import { leadQuoteListByLeadId } from "@/features/leads/constants/quotes";
import type { QuoteDetail, QuoteDocument, QuoteLineItem, QuoteTotals } from "@/features/leads/types";

const defaultDocuments: QuoteDocument[] = [
	{
		id: "doc-1",
		date: "2024-05-10",
		name: "Work Description",
		fileType: "PDF",
	},
	{
		id: "doc-2",
		date: "2024-05-10",
		name: "Policy",
		fileType: "PDF",
	},
	{
		id: "doc-3",
		date: "2024-05-10",
		name: "Policy",
		fileType: "PDF",
	},
];

const defaultItems: QuoteLineItem[] = [
	{
		id: "item-1",
		date: "01",
		description: "Plan and Budget",
		amount: "12,300 SEK",
	},
	{
		id: "item-2",
		date: "02",
		description: "Demolish the old bathroom",
		amount: "12,300 SEK",
	},
	{
		id: "item-3",
		date: "03",
		description: "Stefan Svensson",
		amount: "12,300 SEK",
	},
	{
		id: "item-4",
		date: "04",
		description: "Reinforce and frame walls",
		amount: "12,300 SEK",
	},
	{
		id: "item-5",
		date: "05",
		description: "Install drainage and lay new water pipes",
		amount: "12,300 SEK",
	},
];

const defaultTotals: QuoteTotals = {
	quoteTotal: "1,250,000 SEK",
	includingVat: "75,000 SEK",
	rotDeduction: "Yes",
	finalTotal: "1,325,000 SEK",
};

export const leadQuoteDetailsByLeadId: Record<string, Record<string, QuoteDetail>> =
	Object.fromEntries(
		Object.entries(leadQuoteListByLeadId).map(([leadId, quotes]) => [
			leadId,
			Object.fromEntries(
				quotes.map((quote) => [
					quote.id,
					{
						id: quote.id,
						leadId,
						companyName: quote.companyName,
						orgNumber: quote.orgNumber,
						address: "Storgatan 11B",
						postalNo: "171 63",
						contactPerson: quote.contactPerson,
						mobilePhone: "0708888888",
						email: "pelle@hotmail.com",
						documents: defaultDocuments,
						items: defaultItems,
						totals: defaultTotals,
					},
				])
			),
		])
	);
