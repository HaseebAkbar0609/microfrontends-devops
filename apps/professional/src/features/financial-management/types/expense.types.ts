export type ExpenseStatus =
	| "klar"
	| "ej_attesterad"
	| "reklamerad"
	| "aktiv"
	| "ledig"
	| "ej_paborjad"
	| "pending"
	| "approved"
	| "paid"
	| "rejected";

export type ExpenseCategory =
	| "material"
	| "labor"
	| "equipment"
	| "travel"
	| "subcontractor"
	| "other";

export type SwedishVatRate = 25 | 12 | 6 | 0;

export interface ExpenseLineItem {
	id: string;
	articleNo?: string;
	description: string;
	quantity: number;
	unit: string;
	unitPrice: number;
	subtotal?: number;
	handling?: string;
	percent?: string;
	adjustment?: number;
	vatRate: SwedishVatRate;
	accountNumber: string;
	costCenter?: string;
	total: number;
}

export interface ExpenseAttachment {
	id: string;
	name: string;
	size: number;
	type: string;
	uploadedAt: string;
	url?: string;
}

export interface ExpenseTimeReportItem {
	id: string;
	date: string;
	referenceName: string;
	workedHours: number;
	unit: string;
	hourlyRate: number;
	ataHours?: number;
	sumTime?: number;
	costCenter?: string;
	total: number;
	comments?: string;
	included: boolean;
}

export interface ExpensePaymentPlanItem {
	id: string;
	invoiceNo: string;
	date: string;
	description: string;
	debQuantity: number;
	unit: string;
	unitPrice: number;
	withheld: number;
	amount: number;
	paid: number;
	cost: number;
}

export interface ExpenseUnderlagItem {
	id: string;
	date: string;
	supplier: string;
	supplierInvoiceNo: string;
	amount: number;
	unit: string;
	ataNo?: string;
	markupPercent: number;
	markupKr: number;
	costCenter: string;
	subtotal: number;
	comments?: string;
}

export interface RegisterExpenseFormData {
	supplier: string;
	fakturaNo: string;
	date: string;
	dueDate: string;
	category: ExpenseCategory;
	project: string;
	costCenter: string;
	lineItems: ExpenseLineItem[];
	attachments: ExpenseAttachment[];
	notes: string;
	timeReportItems: ExpenseTimeReportItem[];
	comments?: string;
}

export interface VatRateBreakdown {
	rate: SwedishVatRate;
	basisAmount: number;
	vatAmount: number;
}

export interface RegisterExpenseCalculations {
	subtotal: number;
	vatBreakdown: VatRateBreakdown[];
	totalVat: number;
	grandTotal: number;
}

export interface RegisterExpenseErrors {
	supplier?: string;
	fakturaNo?: string;
	date?: string;
	dueDate?: string;
	category?: string;
	lineItems?: string;
	general?: string;
}

export interface ExpenseTimelineEvent {
	id: string;
	titleKey: string;
	date: string;
	user?: string;
	status: "completed" | "current" | "pending";
}

export interface ExpenseItem {
	id: string;
	expenseNo: string;
	fakturaNo?: string;
	supplier: string;
	supplierOrgNo?: string;
	supplierAddress?: string;
	supplierPhone?: string;
	supplierEmail?: string;
	customerName?: string;
	customerAddress?: string;
	customerOrgNo?: string;
	paymentTerms?: string;
	reference?: string;
	paymentDate?: string;
	category: ExpenseCategory;
	amount: number;
	vatAmount: number;
	status: ExpenseStatus;
	approvalStatus?: "pending" | "approved" | "rejected";
	approverName?: string;
	date: string;
	invoiceDate?: string;
	dueDate: string;
	project: string;
	projectNumber: string;
	costCenter: string;
	attestResponsible?: string;
	invoiceRef?: string;
	notes?: string;
	receiptUrl?: string;
	isInboxItem?: boolean;
	lineItems?: ExpenseLineItem[];
	attachments?: ExpenseAttachment[];
	timeReportItems?: ExpenseTimeReportItem[];
	timeline?: ExpenseTimelineEvent[];
	invoiceTemplate?: string;
	attachTimeReport?: boolean;
	hasUnderlag?: boolean;
	isCreditInvoice?: boolean;
	contactPerson?: string;
	projectSum?: number;
	invoicedEarlier?: number;
	invoiceInclThis?: number;
	rotRut?: string;
	paymentPlanTitle?: string;
	pricingModel?: string;
	comments?: string;
	paymentPlanItems?: ExpensePaymentPlanItem[];
	underlagItems?: ExpenseUnderlagItem[];
	withheldAmount?: number;
	markupAmount?: number;
	rotRutAmount?: number;
	toReceiveAmount?: number;
	subtotal?: number;
	contractNo?: string;
	customerContactPerson?: string;
	customerEmail?: string;
	customerPhone?: string;
	customerPostalCity?: string;
	supplierContactPerson?: string;
	supplierPostalCity?: string;
	supplierVatNo?: string;
	freightFee?: number;
	invoiceFee?: number;
	bankName?: string;
	iban?: string;
	bic?: string;
	swishNo?: string;
	bankgiro?: string;
	fTaxStatus?: string;
}

export type ExpenseSortField =
	| "date"
	| "fakturaNo"
	| "expenseNo"
	| "supplier"
	| "project"
	| "amount"
	| "invoiceDate"
	| "dueDate"
	| "attestResponsible"
	| "status"
	| "category";

export interface ExpenseSummaryStats {
	totalExpenses: number;
	pendingApprovalCount: number;
	pendingApprovalAmount: number;
	thisMonthAmount: number;
	budgetUtilizationPercentage: number;
}

export interface ExpenseFilterState {
	search: string;
	status: ExpenseStatus | "all";
	category: ExpenseCategory | "all";
	project: string | "all";
	sortBy: ExpenseSortField;
	sortOrder: "asc" | "desc";
	page: number;
	pageSize: number;
}

