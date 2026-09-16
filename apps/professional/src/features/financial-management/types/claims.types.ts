export type ClaimStatus = "draft" | "sent" | "approved" | "paid" | "rejected";

export type ClaimTabType = "reklamationerlista" | "mallar";

export type ClaimCreateStep = 1 | 2;

export interface ClaimDocument {
	id: string;
	date: string;
	name: string;
	fileType: string;
	fileSize?: string;
	fileUrl?: string;
}

export interface ClaimItem {
	id: string;
	date: string;
	supplier: string;
	linkedInvoice: string;
	object: string;
	objectId: string;
	objectName: string;
	responsible: string;
	deficiencyType: string;
	incidentDate: string;
	supplierContact: string;
	responseDeadline: string;
	deficiencyDescription: string;
	disputedAmount: number;
	desiredAction: string;
	templateId?: string;
	templateName?: string;
	title: string;
	description: string;
	status: ClaimStatus;
	documents: ClaimDocument[];
	createdAt: string;
	updatedAt?: string;
}

export interface ClaimTemplate {
	id: string;
	name: string;
	deficiencyType: string;
	desiredAction: string;
	title: string;
	description: string;
	createdAt: string;
}

export interface ClaimFormData {
	id?: string;
	supplier: string;
	linkedInvoice: string;
	object: string;
	objectId: string;
	objectName: string;
	responsible: string;
	deficiencyType: string;
	incidentDate: string;
	supplierContact: string;
	responseDeadline: string;
	deficiencyDescription: string;
	disputedAmount: number | string;
	desiredAction: string;
	templateId?: string;
	templateName?: string;
	title: string;
	description: string;
	status?: ClaimStatus;
	documents?: ClaimDocument[];
}

export interface ClaimsFilterState {
	searchQuery: string;
	status: ClaimStatus | "all";
	deficiencyType?: string;
	supplier?: string;
	sortBy?: keyof ClaimItem;
	sortOrder?: "asc" | "desc";
}
