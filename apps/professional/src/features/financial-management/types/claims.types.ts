export type ClaimStatus = "draft" | "sent" | "approved" | "paid" | "rejected";

export type ClaimTabType = "reklamationerlista" | "mallar";

export type ClaimCreateStep = 1 | 2;

export type ClaimTemplateType = "rot" | "rut";

export type ClaimTemplateServiceCategory =
	// ROT categories
	| "bygg"
	| "el"
	| "glas"
	| "mark"
	| "murning"
	| "målning"
	| "plåt"
	| "vvs"
	| "dränering"
	| "takarbete"
	// RUT categories
	| "städning"
	| "trädgård"
	| "barnpassning"
	| "flytt"
	| "it"
	| "tvätt"
	| "personlig_omsorg"
	| "reparation";

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
	title: string;
	date: string;
	description: string;
	updatedAt: string;
}

export interface ClaimTemplateFormData {
	name: string;
	title: string;
	date: string;
	description: string;
}

export type ClaimTemplateSortColumn = "id" | "name" | "title" | "updatedAt";

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
