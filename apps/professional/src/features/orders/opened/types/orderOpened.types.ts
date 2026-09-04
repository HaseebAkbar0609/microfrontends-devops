export interface CustomerDetails {
	customerName: string;
	address: string;
	postCode: string;
	city: string;
	email: string;
	phone: string;
	orgNumber: string;
}

export interface ContactPersonDetails {
	firstName: string;
	lastName: string;
	email: string;
	mobile: string;
	role: string;
}

export interface OrderBasicDetails {
	serialNo: string;
	orderName: string;
	quarterName: string;
	orderAddress: string;
	postCode: string;
	city: string;
}

export interface OrderMetaInformation {
	type: string;
	category: string;
	department: string;
	contractAmount: string;
	offerNo: string;
	startDate: string;
	endDate: string;
}

export interface OrderDocumentItem {
	id: string;
	date: string;
	documentName: string;
	fileName: string;
	fileType: "pdf" | "doc" | "xls";
}

export interface CompanyDetails {
	companyId: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	orgNumber: string;
}

export interface ProjectDescriptionDetails {
	projectName: string;
	workLocation: string;
	specifications: string;
}

export interface OfferInfoDetails {
	offerNo: string;
	work: string;
	material: string;
	totalOffer: string;
	rotDeductionLabor: string;
	paymentTerms: string;
	rotDeductionSettled: string;
	secondaryPaymentTerms?: string;
}

export interface OrderOpenedData {
	id: string;
	title: string;
	titleKey?: string;
	isDirect: boolean;
	postedDate: string;
	tags: string[];
	tagKeys?: string[];
	budgetAmount: number;
	customerInfo: CustomerDetails;
	contactPerson: ContactPersonDetails;
	orderDetails: OrderBasicDetails;
	orderInfo: OrderMetaInformation;
	companyInfo?: CompanyDetails;
	projectDescription?: ProjectDescriptionDetails;
	offerDetails?: OfferInfoDetails;
	documents: OrderDocumentItem[];
}

export type CustomerInfo = CustomerDetails;
export type ContactPerson = ContactPersonDetails;
export type OrderDetails = OrderBasicDetails;
export type OrderInfo = OrderMetaInformation;


