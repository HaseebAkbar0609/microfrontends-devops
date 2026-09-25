/** Where a client sits against its own limits. */
export type RiskLevel = "low" | "watch" | "high";

/** The badge beside a client's name on its detail screen. */
export type RiskClientStatus = "ongoing" | "paused";

/** How far a project's invoices have been settled. */
export type RiskProjectPayment = "fullyPaid" | "partiallyPaid" | "pending";

/** One of a client's projects, as its detail screen lists them. */
export interface RiskClientProject {
	id: string;
	/** `PRJ-001`, as the frame writes it. */
	projectNo: string;
	name: string;
	/** What the project is budgeted at, in SEK. */
	budget: number;
	/** What it has cost so far, in SEK. */
	spentToDate: number;
	payment: RiskProjectPayment;
}

/** What the Settings tab configures, per client. */
export interface RiskClientSettings {
	/** The unpaid amount a client may reach before it counts as high risk, in SEK. */
	spendingThreshold: number;
	/** The credit extended for outstanding invoices, in SEK. */
	creditLimit: number;
	/** The share of the threshold at which the client is flagged for watching. */
	alertPercent: number;
	/** Whether passing the threshold marks the client high risk by itself. */
	autoRedStatus: boolean;
}

/** A client in the register, with everything the screens derive their figures from. */
export interface RiskClient {
	id: string;
	name: string;
	/** `CLI-2024-793`, as the frame writes it. */
	clientNo: string;
	status: RiskClientStatus;
	/** Invoiced to this client so far, in SEK. */
	invoiced: number;
	/** Of that, what has been paid, in SEK. */
	paid: number;
	projects: RiskClientProject[];
	settings: RiskClientSettings;
}

/** What a client's rows and cards read, all derived from the client itself. */
export interface RiskClientTotals {
	activeObjects: number;
	/** The projects' budgets together, in SEK. */
	totalCost: number;
	/** What has been spent of that, in SEK. */
	spentToDate: number;
	/** Spending against budget, as a percentage. */
	spentPercent: number;
	totalPaid: number;
	/** Invoiced less paid, in SEK. */
	pendingAmount: number;
	/** The outstanding amount against the threshold, as a percentage. */
	thresholdPercent: number;
	level: RiskLevel;
}

/** One band of the Status Distribution ring. */
export interface RiskDistributionSlice {
	level: RiskLevel;
	count: number;
}

/** The four cards above the register. */
export interface RiskSummary {
	/** What the clients being watched or over their limit have outstanding, in SEK. */
	exposure: number;
	highRiskCount: number;
	/** Every client's threshold together, in SEK. */
	limitTotal: number;
	/** The outstanding total against that, as a percentage. */
	limitUsedPercent: number;
	/** Every client's outstanding amount together, in SEK. */
	pendingTotal: number;
	clientCount: number;
	distribution: RiskDistributionSlice[];
}

export type RiskListSortField =
	| "name"
	| "activeObjects"
	| "totalCost"
	| "creditLimit"
	| "totalPaid"
	| "pendingAmount"
	| "level";

export interface RiskListFilters {
	level: RiskLevel | null;
	status: RiskClientStatus | null;
}
