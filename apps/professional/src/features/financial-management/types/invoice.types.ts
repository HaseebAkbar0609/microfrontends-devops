export type InvoiceStatus =
	| "paid"
	| "reminder1"
	| "reminder2"
	| "reminder3"
	| "sent"
	| "saved"
	| "overdue"
	| "collection";

export type InvoiceType = "fastpris" | "budget" | "hourly";

export type InvoiceObjectType = "Projekt" | "Order";

export interface InvoiceItem {
	id: string;
	invoiceNo: string;
	ocr: string;
	object: InvoiceObjectType;
	type: InvoiceType;
	customer: string;
	invoiceDate: string;
	costCenter: string;
	projectLeader: string;
	location: string;
	contractType: string;
	total: number;
	balance: number;
	currency: string;
	dueDate: string;
	fullyPaidDate?: string;
	status: InvoiceStatus;
}

export interface ReminderItem {
	id: string;
	customer: string;
	email: string;
	amount: number;
	currency: string;
	latestReminder: string;
	remindersLeft: number;
	status: InvoiceStatus;
}

export type InvoiceSortField =
	| "invoiceNo"
	| "ocr"
	| "object"
	| "type"
	| "customer"
	| "invoiceDate"
	| "costCenter"
	| "projectLeader"
	| "location"
	| "contractType"
	| "total"
	| "balance"
	| "dueDate"
	| "fullyPaidDate"
	| "status";

export type ReminderSortField =
	| "id"
	| "customer"
	| "email"
	| "amount"
	| "latestReminder"
	| "remindersLeft"
	| "status";

export type SortOrder = "asc" | "desc";

export interface InvoiceFilterState {
	searchQuery: string;
	statusFilter: string;
	objectFilter: string;
	typeFilter: string;
	customerFilter: string;
	costCenterFilter: string;
}
