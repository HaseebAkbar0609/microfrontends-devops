export interface OfferRequestContact {
	name: string;
	phone?: string;
	email?: string;
}

export interface OfferRequest {
	id: string;
	projectId?: string;
	mappingId?: string;
	quoteId?: string;
	offertNr: string;
	job: string;
	customerName: string;
	category: string;
	municipality: string;
	type: string;
	price: number;
	status: "notReviewed" | "opened" | string;
	contactPerson: OfferRequestContact;
	openedAt?: string;
	trackingNumber?: string;
	jobName?: string;
	latestOfferDate?: string;
	preliminaryBudget?: number;
	assignee?: string;
}

export const OFFER_REQUEST_TYPE_BADGE_CLASSES: Record<string, string> = {
	"B2C Offer": "bg-neutral-950 text-white",
	Express: "bg-slate-100 text-slate-700 border border-slate-200",
	B2C: "bg-slate-100 text-slate-700 border border-slate-200",
	B2B: "bg-slate-100 text-slate-700 border border-slate-200",
	"B2B Rent OUT": "bg-neutral-950 text-white",
	"B2B Rent IN": "bg-neutral-950 text-white",
};
