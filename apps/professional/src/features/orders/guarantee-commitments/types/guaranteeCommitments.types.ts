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

export interface GuaranteeRow {
	id: string;
	orderNo: string;
	orderName: string;
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
