import type { LeadRow } from "@/features/leads/types";
import { reviewLeadRows } from "@/features/leads/constants/review";
import { monitoringLeadRows } from "@/features/leads/constants/monitoring";
import { handlingLeadRows } from "@/features/leads/constants/handling";
import { archiveLeadRows } from "@/features/leads/constants/archive";
import { acceptedLeadRows } from "@/features/leads/constants/accepted";
import { paidLeadRows } from "@/features/leads/constants/paid";
import { previewLead } from "@/features/leads/management/constants/previewLead";

const acceptedAsLeadRows: LeadRow[] = acceptedLeadRows.map((row) => ({
	id: row.id,
	date: row.acceptedDate,
	leadId: row.leadId,
	customer: row.customer,
	type: row.type,
	category: row.category,
	city: row.city,
	matches: "0",
	status: "accepterad",
	email: "",
	phone: "",
}));

const paidAsLeadRows: LeadRow[] = paidLeadRows.map((row) => ({
	id: row.id,
	date: row.acceptedDate,
	leadId: row.leadId,
	customer: row.customer,
	type: "",
	category: "",
	city: row.city,
	matches: "0",
	status: "betalda",
	email: "",
	phone: "",
}));

const allDummyLeadRows: LeadRow[] = [
	previewLead,
	...reviewLeadRows,
	...monitoringLeadRows,
	...handlingLeadRows,
	...archiveLeadRows,
	...acceptedAsLeadRows,
	...paidAsLeadRows,
];

export function findDummyLeadById(leadId: string): LeadRow | undefined {
	return allDummyLeadRows.find((row) => row.id === leadId);
}

/** Reverse lookup: from the human-readable lead number (e.g. "L-2025-001") back to the row's internal id. */
export function findDummyLeadByLeadNumber(leadNumber: string): LeadRow | undefined {
	return allDummyLeadRows.find((row) => row.leadId === leadNumber);
}
