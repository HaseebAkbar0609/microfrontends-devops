export type AgreementDocFileType = "pdf" | "doc" | "img" | "ppt";

export interface AgreementDocumentItem {
	id: string;
	date: string;
	name: string;
	fileName: string;
	fileType: AgreementDocFileType;
	url?: string;
	size?: string;
}

export interface AvailableDocumentOption {
	id: string;
	name: string;
	fileType: AgreementDocFileType;
}

export type AgreementDocumentsSortField = "date" | "name" | "fileType";
export type AgreementDocumentsSortOrder = "asc" | "desc";
