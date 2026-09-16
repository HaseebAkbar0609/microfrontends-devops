/**
 * TFS-668: Order Production Documents Types
 */

import type { DocumentsSubTab } from "../constants/documents.constants";

export type DocumentKind = "handling" | "ritning";

export interface OrderDocumentItem {
	id: string;
	orderId: string;
	date: string;
	name: string;
	fileName: string;
	fileType?: string;
	fileSize?: number;
	fileUrl?: string;
	drawingNumber?: string;
	category?: string;
	createdBy: string;
	kind: DocumentKind;
	isArchived: boolean;
	archivedAt?: string;
	createdAt: string;
	updatedAt?: string;
}

export interface UploadDocumentPayload {
	name: string;
	file: File | null;
	fileName: string;
	drawingNumber?: string;
	category?: string;
	kind?: DocumentKind;
}

export interface DocumentsFilterState {
	searchQuery: string;
	categoryFilter: string;
	subtab: DocumentsSubTab;
	page: number;
	pageSize: number;
	sortField: "date" | "name" | "fileName" | "drawingNumber" | "category" | "createdBy";
	sortOrder: "asc" | "desc";
}
