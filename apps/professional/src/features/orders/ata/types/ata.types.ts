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

export type AtaType = "andring" | "tillagg" | "avgaende";

export interface CreateAtaFormData {
	orderId: string;
	// Orderer (Beställare)
	orderer: string;
	ordererName: string;
	address: string;
	postalCode: string;
	city: string;
	// Order Information
	eatingNumber: string;
	title: string;
	subTitle: string;
	proposedAction: string;
	action: string;
	qualityStatus: string;
	reason: string;
	economicStatus: string;
	location: string;
	description: string;
	ataType: AtaType;
	date: string;
	responsible: string;
	amount: number;
	vat: number;
	status: AtaStatus;
	supplierInvoices: string[];
	timeReports: string[];
}

export interface DetailedLineItem {
	id: string;
	date: string;
	personOrSupplier: string;
	team: string;
	description?: string;
	amount: number;
	quantityOrInvoice?: string | number;
	unit?: string;
	netPrice?: number | string;
	netSum?: number | string;
	percentage?: string | number;
	contracted?: string;
	n2?: string;
	activity?: string;
	position?: string;
}

export interface AttachedDocument {
	id: string;
	date: string;
	referenceNumber: string;
	fileName: string;
	fileType: "pdf" | "doc" | "ppt" | "image";
	fileSize?: string;
	fileUrl?: string;
	url?: string;
}

export interface CreateAtaSummary {
	ataNr: string;
	projectCode: string;
	locations: string[];
	ownStaffCount: number;
	totalMaterial: number;
	totalMachines: number;
	totalUe: number;
	totalAtaSupplier: number;
}

export interface SupplierAtaGroup {
	supplierId: string;
	supplierName: string;
	totalAmount: number;
	totalCount: number;
	approvedCount: number;
	inReviewCount: number;
	notApprovedCount: number;
}

export type SupplierGroupSortField =
	| "supplierName"
	| "totalAmount"
	| "totalCount"
	| "approvedCount"
	| "inReviewCount"
	| "notApprovedCount";

export type SupplierDetailSortField =
	| "date"
	| "ataNumber"
	| "linkedLevAta"
	| "amount"
	| "status"
	| "attested"
	| "attestedDate";

