export type InvoiceDetailStatus = "startade" | "skickad" | "betald" | "förfallen" | "utkast" | "krediterad";

export interface InvoiceDetailLineItem {
	id: string;
	articleId: string;
	description: string;
	quantity: number;
	unit: string;
	unitPrice: number;
	delsumma: number;
	handlingType: "none" | "rabatt" | "påslag" | "rot/rut";
	handlingPercentage: number;
	adjustment: number;
	total: number;
	ks: number;
}

export interface InvoiceDetailPaymentPlanItem {
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

export interface InvoiceDetailTimeReportItem {
	id: string;
	date: string;
	employee: string;
	regularHours: number;
	unit: string;
	ataHours: number;
	totalHours: number;
	ks: number;
	comments: string;
}

export interface InvoiceDetailUnderlagItem {
	id: string;
	date: string;
	supplier: string;
	supplierInvoiceNo: string;
	amount: number;
	unit: string;
	ataNo: number;
	markupPercent: number;
	markupAmount: number;
	ks: number;
	subtotal: number;
	comments: string;
}

export interface InvoiceHistoryEvent {
	id: string;
	date: string;
	time: string;
	type: "created" | "sent" | "viewed" | "reminder_sent" | "payment_received" | "credited";
	description: string;
	actor: string;
}

export interface InvoiceDetailData {
	id: string;
	invoiceNo: string;
	ocr: string;
	status: InvoiceDetailStatus;
	invoiceTemplate: string;
	attachTimeReport: boolean;
	attachUnderlag: boolean;
	isCreditInvoice: boolean;
	projectName: string;
	projectNumber: string;
	contactPerson: string;
	projectSum: number;
	invoicedEarlier: number;
	invoiceInclThis: number;
	invoiceDate: string;
	dueDate: string;
	rotRut: string;
	paymentPlanName: string;
	pricingModel: string;
	category: string;
	customer: string;
	customerOrgNr: string;
	customerAddress: string;
	customerEmail: string;
	customerPhone: string;
	supplierName: string;
	supplierContact: string;
	supplierAddress: string;
	supplierEmail: string;
	supplierPhone: string;
	lineItems: InvoiceDetailLineItem[];
	paymentPlanItems: InvoiceDetailPaymentPlanItem[];
	timeReportItems: InvoiceDetailTimeReportItem[];
	underlagItems: InvoiceDetailUnderlagItem[];
	comments: string;
	history: InvoiceHistoryEvent[];
}

export interface InvoiceDetailCalculations {
	delsumma: number;
	totalDiscount: number;
	totalMarkup: number;
	totalRotRut: number;
	totalExclVat: number;
	vatRate: number;
	vatAmount: number;
	attErhalla: number;
}
