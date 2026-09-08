export type RotRutType = "rot" | "rut";

export type RotRutStatus = "pending" | "submitted" | "approved" | "rejected";

export type RotRutPeriod = "all" | "this_year" | "last_year" | "this_month";

export interface RotRutItem {
	id: string;
	invoiceId: string;
	invoiceNo: string;
	customerName: string;
	customerPersonalId: string;
	customerPersonalIdMasked: string;
	propertyId: string;
	apartmentNo?: string;
	brfOrgNr?: string;
	type: RotRutType;
	description: string;
	laborCost: number;
	materialCost: number;
	totalAmount: number;
	deductionRate: number;
	deductionAmount: number;
	status: RotRutStatus;
	submissionDate?: string;
	decisionDate?: string;
	rejectionReason?: string;
	skatteverketReference?: string;
	createdAt: string;
}

export interface RotRutCustomerLimit {
	customerId: string;
	customerName: string;
	customerPersonalIdMasked: string;
	annualLimit: number;
	rotUsed: number;
	rutUsed: number;
	totalUsed: number;
	remainingLimit: number;
	percentUsed: number;
}

export interface RotRutKpiSummary {
	totalRotApplied: number;
	totalRutApplied: number;
	totalPending: number;
	totalPendingCount: number;
	totalApproved: number;
	totalApprovedCount: number;
	totalRejected: number;
	totalRejectedCount: number;
	totalCount: number;
}

export type RotRutSortColumn = keyof RotRutItem;

export interface RotRutFilterState {
	searchQuery: string;
	statusFilter: RotRutStatus | "all";
	typeFilter: RotRutType | "all";
	periodFilter: RotRutPeriod;
	sortBy: RotRutSortColumn;
	sortOrder: "asc" | "desc";
}

export interface RegisterRotRutFormData {
	invoiceId: string;
	customerName: string;
	customerPersonalId: string;
	type: RotRutType;
	propertyId: string;
	apartmentNo?: string;
	brfOrgNr?: string;
	laborCost: number;
	materialCost: number;
	description: string;
}
