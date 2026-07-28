export interface OfferRequest {
	id: string;
	trackingNumber: string;
	jobName: string;
	customerName: string;
	municipality: string;
	type: string;
	latestOfferDate: string;
	preliminaryBudget: number;
	assignee: string;
}

export const OFFER_REQUEST_TYPE_BADGE_CLASSES: Record<string, string> = {
	"B2C Offer": "bg-neutral-950 text-white",
	Express: "bg-neutral-950 text-white",
	"B2B Rent OUT": "bg-neutral-950 text-white",
	"B2B Rent IN": "bg-neutral-950 text-white",
};
