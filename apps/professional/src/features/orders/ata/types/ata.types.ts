import type { AtaCategory, AtaStatus, AtaAttestedStatus } from "../constants/ata.constants";

export interface AtaItem {
	id: string;
	orderId: string;
	ataNumber: string;
	category: AtaCategory;
	date: string;
	title: string;
	description?: string;
	linkedLevAta?: string;
	supplier?: string;
	amount: number;
	vatAmount?: number;
	totalAmount?: number;
	status: AtaStatus;
	attested: AtaAttestedStatus;
	attestedDate?: string;
	notes?: string;
	createdAt?: string;
	updatedAt?: string;
}

export type AtaSortField =
	| "date"
	| "ataNumber"
	| "linkedLevAta"
	| "supplier"
	| "amount"
	| "status"
	| "attested"
	| "attestedDate";

export type SortOrder = "asc" | "desc";

export interface AtaSummary {
	totalAtaValue: number;
	countAta: number;
	activeAta: number;
	pendingApproval: number;
	approvedAta: number;
	rejectedAta: number;
}
