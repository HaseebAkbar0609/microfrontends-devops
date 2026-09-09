export type InspectionStatus = "pending" | "approved" | "rejected";

export type InspectionType =
	| "Byggmöte"
	| "Förbesiktning"
	| "Slutbesiktning"
	| "Efterbesiktning"
	| "Garantibesiktning"
	| "Särskild besiktning"
	| string;

export interface InspectionDocument {
	id: string;
	name: string;
	fileName: string;
	fileSize?: number;
	fileType?: "pdf" | "png" | "jpg" | "jpeg" | "doc" | "xls" | string;
	url?: string;
	uploadedAt?: string;
}

export interface OrderInspectionItem {
	id: string;
	orderId?: string;
	date: string; // Datum (e.g. 2025-09-01)
	type: InspectionType; // Typ (e.g. Byggmöte)
	inspectionDate: string; // Besiktningsdatum (e.g. 2025-10-01)
	status: InspectionStatus; // e.g. "approved" | "rejected" | "pending"
	documents: InspectionDocument[];
	comments?: string;
	createdAt?: string;
	updatedAt?: string;
}

export type CreateInspectionInput = Omit<OrderInspectionItem, "id">;

export type InspectionSortField = "date" | "type" | "inspectionDate" | "pdf";
