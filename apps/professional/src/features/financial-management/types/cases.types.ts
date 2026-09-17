export type CaseStatus =
	| "not_started"
	| "ongoing"
	| "completed"
	| "closed"
	| "rejected";

export type CaseCategory =
	| "info"
	| "billing"
	| "support"
	| "technical"
	| "administrative"
	| "other";

export interface CaseMessage {
	id: string;
	caseId: string;
	author: string;
	authorRole?: string;
	content: string;
	createdAt: string;
	isInternal?: boolean;
}

export interface CaseDocument {
	id: string;
	name: string;
	date: string;
	fileType?: string;
	fileSize?: string;
	url?: string;
	category?: "document" | "image";
}

export interface CaseItem {
	id: string;
	caseNumber: string;
	title: string;
	category: CaseCategory;
	createdBy: string;
	createdRole?: string;
	date: string;
	status: CaseStatus;
	description?: string;
	messages: CaseMessage[];
	documents: CaseDocument[];
	images: CaseDocument[];
	createdAt: string;
	updatedAt?: string;
}

export interface CaseFormData {
	id: string;
	title: string;
	category: CaseCategory;
	createdBy: string;
	date: string;
	description: string;
	initialMessage?: string;
	documents: CaseDocument[];
	images: CaseDocument[];
}

export interface CaseFilterState {
	searchQuery: string;
	statusFilter: CaseStatus | "all";
	categoryFilter: CaseCategory | "all";
	page: number;
	pageSize: number;
}
