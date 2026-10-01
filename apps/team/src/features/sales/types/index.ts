import type { TranslationKeys } from "@/utils/translation/constants";
import type { SalesDocumentType } from "../constants/salesDocumentTypes";

export type SalesCompanyStatus =
	| "prospect"
	| "lead"
	| "quoted"
	| "accepted"
	| "closed";

export type SalesActivityType = "call" | "email" | "meeting" | "note";

export type QuotePriceUnit = "perUserMonth" | "perMonth" | "oneTime";

export type QuoteTermId = "monthly" | "quarterly" | "yearly";

export type TrialKind = "demo" | "test";

export type PaymentStatus = "pending" | "paid";

export type TrialAccount = {
	username: string;
	url: string;
	startedAt: string;
	expiresAt: string;
};

export type SalesActivity = {
	id: string;
	date: string;
	type: SalesActivityType;
	text: string;
	followUpAt: string;
	done: boolean;
	/** Who logged the call or booked the meeting. Absent on older rows. */
	booker?: string;
	/** When a booked meeting takes place. Only set for `type: "meeting"`. */
	meetingAt?: string;
};

export type CreditsafeInfo = {
	fetchedAt: string;
	hasFTax: boolean;
	vatRegistered: boolean;
	employerRegistered: boolean;
	rating: string;
	riskLevelKey: TranslationKeys;
	registeredAt: string;
	legalFormKey: TranslationKeys;
	address: string;
};

export type QuoteLine = {
	id: string;
	name: string;
	description: string;
	quantity: number;
	price: number;
	unit: QuotePriceUnit;
	amount: number;
};

export type SalesQuote = {
	quoteNumber: string;
	createdAt: string;
	validUntil: string;
	users: number;
	term: QuoteTermId;
	monthlyNet: number;
	firstInvoice: number;
	lines: QuoteLine[];
	notes: string;
	/**
	 * The discount typed on top of the term discount. It is what explains
	 * monthlyNet, so the server checks the net exactly when it is sent. Absent on
	 * quotes saved before it was.
	 */
	extraDiscountPercent?: number;
};

export type SalesOrder = {
	orderNumber: string;
	createdAt: string;
};

export type SalesPayment = {
	status: PaymentStatus;
	link: string;
	invoiceNumber: string;
	sentAt: string;
	amount: number;
};

export type SalesCompany = {
	id: string;
	version?: number;
	professionalCompanyId?: string | null;
	name: string;
	organisationNumber: string;
	contactPerson: string;
	email: string;
	mobile: string;
	city: string;
	trade: string;
	category: string;
	region: string;
	employees: number;
	revenue: number;
	startYear: string;
	status: SalesCompanyStatus;
	accountManager: string;
	seller: string;
	source: string;
	notes: string;
	createdAt: string;
	demoAccounts: TrialAccount[];
	testAccounts: TrialAccount[];
	creditsafe: CreditsafeInfo | null;
	activities: SalesActivity[];
	quote: SalesQuote | null;
	order: SalesOrder | null;
	payment: SalesPayment | null;
};

/** One presentation email the sales team can send from a customer card. */
export type SalesEmailTemplate = {
	id: string;
	name: string;
	subject: string;
	body: string;
};

/** The team's shared Sales settings, as `/teams/sales/settings` returns them. */
export type SalesSettings = {
	calendlyLink: string;
	emailTemplates: SalesEmailTemplate[];
};

/** A document added by hand, as opposed to one the CRM produced. */
export type SalesCustomDocument = {
	id: string;
	type: SalesDocumentType;
	number: string;
	companyId: string;
	companyName: string;
	date: string;
	amount: number;
};

export type SalesTeamRole = "seller" | "meeting-booker" | "account-manager";

export type SalesTeamMember = {
	id: string;
	name: string;
	role: SalesTeamRole;
	/** Region id from the sales taxonomy. */
	region: string;
	email: string;
	phone: string;
};

export type SalesCompanyDraft = Pick<
	SalesCompany,
	| "name"
	| "organisationNumber"
	| "trade"
	| "city"
	| "contactPerson"
	| "mobile"
	| "email"
	| "category"
	| "region"
	| "status"
>;

export type SalesStatusFilter = SalesCompanyStatus | "all" | "demo" | "test";

export type SalesSortKey =
	| "name"
	| "category"
	| "region"
	| "status"
	| "invoiced"
	| "seller"
	| "contactPerson"
	| "mobile"
	| "email";

/** One editable row in the quote builder's module list. */
export type QuoteModuleRow = {
	id: string;
	name: string;
	description: string;
	price: number;
	unit: QuotePriceUnit;
	selected: boolean;
	quantity: number;
	quantityEditable: boolean;
};

/** Everything the quote builder derives from its rows, term and discount. */
export type QuoteTotals = {
	lines: QuoteLine[];
	monthlyGross: number;
	termDiscountAmount: number;
	extraDiscountAmount: number;
	monthlyNet: number;
	oneTimeTotal: number;
	periodMonths: number;
	amountPerInvoice: number;
	firstInvoice: number;
	annualCost: number;
};
