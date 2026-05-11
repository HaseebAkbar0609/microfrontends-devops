export type QuoteDocument = {
	id: string;
	date: string;
	name: string;
	fileType: string;
};

export type QuoteLineItem = {
	id: string;
	date: string;
	description: string;
	amount: string;
};

export type QuoteTotals = {
	quoteTotal: string;
	includingVat: string;
	rotDeduction: string;
	finalTotal: string;
};

export type QuoteDetail = {
	id: string;
	leadId: string;
	companyName: string;
	orgNumber: string;
	address: string;
	postalNo: string;
	contactPerson: string;
	mobilePhone: string;
	email: string;
	documents: QuoteDocument[];
	items: QuoteLineItem[];
	totals: QuoteTotals;
};
