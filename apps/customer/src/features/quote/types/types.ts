export type OfferStatus =
	| "draft"
	| "sent"
	| "accepted"
	| "rejected"
	| "expired";

export interface Offer {
	id: string;
	offerNumber: string;
	customerName: string;
	projectName: string;
	createdAt: string;
	status: OfferStatus;
	amount: number;
	currency?: string;
}


export interface Quote {
	id: string;
	refNo: string;
	projectName: string;
	/** Raw API value (e.g. `b2c`); Type column prefers this when set */
	project_type?: string;
	type: string;
	/** Comma-joined for legacy / string contexts */
	category: string;
	/** One label per subcategory; prefer this for UI (multiple badges) */
	categories?: string[];
	receivedQuotes: string; // e.g., "3/5"
	lowestPrice: string; // e.g., "46,000 SEK"
	highestPrice: string; // e.g., "56,000 SEK"
	/** API `quote_status` enum (see PROJECT_STATUS_FILTER_OPTIONS values) */
	quote_status: string;
	/** When false, "Open" resumes the create-offer flow instead of project detail */
	is_completed?: boolean;
}

export type QuoteColumnField = keyof Quote | "actions";

export interface QuoteColumn {
	label: string;
	field: QuoteColumnField;
}

export type QuoteStatus =
	| "Approved"
	| "Received Quote"
	| "Invited"
	| "Estimated"
	| "Waiting for Quote";

export interface QuoteItem {
	id: string;
	isStarred: boolean;
	company: string;
	contact: string;
	orgNo: string;
	price: string;
	status: QuoteStatus;
}

export interface ProjectDocument {
	id: string;
	date: string;
	name: string;
	comments: string;
	fileType: string;
}

export interface ChatCompany {
	id: string;
	name: string;
	time: string;
	status: string;
	statusVariant: "default" | "secondary" | "destructive" | "outline" | "category" | "success" | "info" | "warning";
	message: string;
	hasCalendar: boolean;
	unread: number;
}


export interface SpecificationDocument {
	id: string;
	date: string;
	name: string;
}

export interface ReferenceProject {
	id: string;
	name: string;
	municipality: string;
	year: string;
	images: string[];
}
