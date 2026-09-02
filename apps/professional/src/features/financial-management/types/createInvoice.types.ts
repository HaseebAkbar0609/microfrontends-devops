export type CreateInvoiceTab = "oversikt" | "tidrapport" | "underlag";

export type HandlingType = "discount" | "markup" | "rotrut" | "none";

export interface InvoiceLineItem {
	id: string;
	articleId: string;
	description: string;
	quantity: number;
	unit: string;
	unitPrice: number;
	subtotal: number;
	handlingType: HandlingType;
	handlingPercentage: number;
	adjustmentAmount: number;
	total: number;
	costCenter: string;
}

export interface PaymentPlanItem {
	id: string;
	invoiceNo: string;
	date: string;
	description: string;
	quantity: number;
	unit: string;
	unitPrice: number;
	withheld: number;
	amount: number;
	paid: number;
	cost: number;
}

export interface TimeReportItem {
	id: string;
	date: string;
	employee: string;
	workHours: number;
	unit: string;
	ataHours: number;
	totalHours: number;
	costCenter: string;
	comments: string;
}

export interface InvoiceAttachment {
	id: string;
	name: string;
	size: string;
	uploadDate: string;
	type: string;
}

export interface CreateInvoiceFormData {
	// Header & Checkboxes
	attachTimeReport: boolean;
	attachDocumentation: boolean;
	isCreditInvoice: boolean;
	invoiceNo: string;
	status: string;
	template: string;

	// Customer & Project Info
	customer: string;
	customerContactPerson: string;
	category: string;
	projectName: string;
	projectNumber: string;
	contactPerson: string;
	projectSum: number;
	invoicedEarlier: number;
	invoiceInclThis: number;

	// Dates & Models
	invoiceDate: string;
	rotRutType: "rot" | "rut" | "none";
	paymentPlanType: string;
	pricingModel: "lopande" | "fastpris" | "budget";

	// Items & Tables
	lineItems: InvoiceLineItem[];
	paymentPlanItems: PaymentPlanItem[];
	timeReportItems: TimeReportItem[];
	attachments: InvoiceAttachment[];

	// Comments
	comments: string;

	// Time Report Tab Flags
	detailedReporting: boolean;
	mergedReport: boolean;
	showAta: boolean;
}
