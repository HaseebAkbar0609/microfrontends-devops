import type { LeadRow } from "./leads";

export type HandlingLeadRow = LeadRow & {
	taken: string;
	repeat: string;
};

export type MonitoringLeadRow = LeadRow & {
	tags: string;
};

export type ArchiveLeadRow = LeadRow & {
	tags: string;
};

export type AcceptedLeadRow = {
	id: string;
	acceptedDate: string;
	leadId: string;
	customer: string;
	supplier: string;
	type: string;
	category: string;
	city: string;
	offer: string;
	commission: string;
	reminder: string;
	status: string;
};

export type PaidLeadRow = {
	id: string;
	acceptedDate: string;
	leadId: string;
	customer: string;
	supplier: string;
	city: string;
	commission: string;
	paymentDate: string;
};
