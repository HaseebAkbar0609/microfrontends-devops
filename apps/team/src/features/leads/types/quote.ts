export type QuoteStatus =
	| "received"
	| "invited"
	| "estimated"
	| "waiting";

export type LeadQuoteRow = {
	id: string;
	companyName: string;
	contactPerson: string;
	orgNumber: string;
	quotePrice: string;
	status: QuoteStatus;
};
