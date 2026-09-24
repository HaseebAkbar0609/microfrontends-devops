export type AuthorityCategory =
	| "Govt Docs"
	| "Financial"
	| "Tax"
	| "Legal"
	| "Insurance";

export type AuthorityStatus =
	| "pending"
	| "submitted"
	| "approved"
	| "action_required";

export type AuthorityFileType = "PDF" | "DOC" | "DOCX" | "PNG" | "JPG" | "XLSX";

export interface AuthorityItem {
	id: string;
	caseNr: string;
	authorityName: string;
	category: AuthorityCategory;
	documentName: string;
	subject: string;
	date: string;
	dueDate?: string;
	status: AuthorityStatus;
	responsiblePerson?: string;
	referenceNumber?: string;
	fileType?: AuthorityFileType;
	fileName?: string;
	fileUrl?: string;
	fileSize?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthorityFormData {
	id?: string;
	caseNr?: string;
	authorityName: string;
	category: AuthorityCategory;
	documentName: string;
	subject?: string;
	date: string;
	dueDate?: string;
	status?: AuthorityStatus;
	responsiblePerson?: string;
	referenceNumber?: string;
	fileType?: AuthorityFileType;
	fileName?: string;
	fileUrl?: string;
	fileSize?: string;
	notes?: string;
}

export type AuthoritySortField =
	| "caseNr"
	| "authorityName"
	| "category"
	| "date"
	| "documentName"
	| "fileName"
	| "status";

export type AuthoritySortOrder = "asc" | "desc";
