/**
 * Which module is showing the feature.
 *
 * The rows are the same either way; only what the list calls a record differs
 * — an Order screen heads the column "Order nr", the Project frame "Projekt
 * Nr". Defaulting to `"order"` keeps the wording the two merged Order screens
 * already shipped.
 */
export type WarrantyScope = "order" | "project";

export interface RecipientItem {
	id: string;
	name: string;
	handle: string;
	email: string;
	avatarUrl?: string;
}

export interface AttachedDocumentItem {
	id: string;
	name: string;
	fileType: "pdf" | "doc" | "png" | "jpg";
	fileSize?: string;
	url?: string;
}

export interface WarrantyRow {
	id: string;
	recordNo: string;
	recordName: string;
	startDate: string;
	approvedDate: string;
	warrantyPeriod: string;
	projectManager: string;
	customer: string;
	contactPerson?: string;
	warrantyResponsible?: string;
	warrantyEndDate?: string;
	phone?: string;
	email?: string;
}

export interface InspectionDateItem {
	id: string;
	date: string;
	reminderEmail: string;
	rule: string;
	documentName: string;
	fileType: "pdf" | "doc" | "png" | "jpg";
	recipients?: RecipientItem[];
	documents?: AttachedDocumentItem[];
}
