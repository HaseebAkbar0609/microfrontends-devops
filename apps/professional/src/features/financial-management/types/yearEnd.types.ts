export type YearEndTabType = "bokslut" | "checklist";

export type YearEndCategory =
	| "Årsredovisning"
	| "Deklaration"
	| "Balans & Resultat"
	| "Huvudbok"
	| "Leverantörslista"
	| "Kundfordringar"
	| "Moms & Skatt"
	| "Övrigt";

export type YearEndStatus = "not_started" | "in_progress" | "completed";

export interface YearEndItem {
	id: string;
	srNr: string;
	tab: YearEndTabType;
	fiscalYear: number;
	category: YearEndCategory;
	name: string;
	fileName: string;
	fileType: "PDF" | "DOC" | "DOCX" | "PNG" | "JPG" | "XLSX";
	fileUrl?: string;
	fileSize?: string;
	status: YearEndStatus;
	notes?: string;
	updatedAt: string;
	createdAt: string;
}

export interface YearEndFormData {
	id?: string;
	srNr?: string;
	tab: YearEndTabType;
	fiscalYear: number;
	category: YearEndCategory;
	name: string;
	fileName: string;
	fileType: "PDF" | "DOC" | "DOCX" | "PNG" | "JPG" | "XLSX";
	fileUrl?: string;
	fileSize?: string;
	status?: YearEndStatus;
	notes?: string;
}

export type YearEndSortField =
	| "srNr"
	| "category"
	| "name"
	| "fileName"
	| "status"
	| "fiscalYear";

export type YearEndSortOrder = "asc" | "desc";
