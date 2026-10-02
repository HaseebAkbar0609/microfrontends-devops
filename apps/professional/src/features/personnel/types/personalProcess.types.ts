export type ProcessStatus = "active" | "completed" | "pending" | "overdue";

export type ProcessCategory = "all" | "onboarding" | "annual_review" | "certification";

export interface ProcessChecklistItem {
	id: string;
	title: string;
	isCompleted: boolean;
	completedDate?: string;
}

export interface ProcessDocumentItem {
	id: string;
	name: string;
	date: string;
	fileFormat: string;
	fileSize?: string;
}

export interface PersonalProcessItem {
	id: string;
	title: string;
	date: string;
	category: ProcessCategory;
	status: ProcessStatus;
	checklist: ProcessChecklistItem[];
	documents: ProcessDocumentItem[];
}

export interface PersonalProcessFormData {
	id: string;
	title: string;
	date: string;
	category: ProcessCategory;
	checklist: ProcessChecklistItem[];
	documents: ProcessDocumentItem[];
}
