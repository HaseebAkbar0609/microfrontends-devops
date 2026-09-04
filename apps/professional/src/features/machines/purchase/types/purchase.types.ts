export type PurchaseStatus = "not_ready" | "ready" | "in_progress" | "pending" | "archived";

export interface PurchaseDocument {
	id: string;
	date: string;
	name: string;
	fileType: string;
	url?: string;
}

export interface PurchaseItem {
	id: string;
	number: string;
	category: string;
	type: string;
	brand: string;
	designation: string;
	price: number;
	quantity?: number;
	totalCost?: number;
	supplier: string;
	address: string;
	postalCode: string;
	city: string;
	phone: string;
	email: string;
	file: string;
	status?: PurchaseStatus;
	additionalInfo?: string;
	documents?: PurchaseDocument[];
}

export interface PurchaseDetail extends PurchaseItem {
	additionalInfo: string;
	documents: PurchaseDocument[];
}

export type PurchaseSortField =
	| "number"
	| "type"
	| "brand"
	| "designation"
	| "price"
	| "supplier"
	| "address"
	| "postalCode"
	| "city"
	| "phone"
	| "email"
	| "file";

export type SortOrder = "asc" | "desc";
