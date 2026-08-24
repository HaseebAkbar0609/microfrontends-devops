export interface CustomerInfoData {
	customer: string;
	address: string;
	postalCode: string;
	city: string;
	email: string;
	phone: string;
	orgOrPersonalNo: string;
}

export interface ContactPersonData {
	firstName: string;
	lastName: string;
	email: string;
	mobile: string;
	role: string;
}

export interface OrderInfoData {
	orderNo: string;
	orderName: string;
	blockName: string;
	orderAddress: string;
	postalCode: string;
	city: string;
	type: string;
	category: string;
	department: string;
	contractSum: string;
	offerNo: string;
	startDate: string;
	endDate: string;
}

export interface OrderDocumentItem {
	id: string;
	date: string;
	documentName: string;
	fileName: string;
	fileType: "pdf" | "doc" | "png" | "jpg";
	fileSize?: string;
	fileUrl?: string;
}

export interface ContractorContactItem {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	mobile: string;
	role: string;
}

export interface ContractorOrganizationData {
	contractorType: string;
	organizationName: string;
	address: string;
	postalCode: string;
	city: string;
	email: string;
	phone: string;
	selectedContactTags: string[];
	contacts: ContractorContactItem[];
}

export interface OrderOrganizationSummaryRow {
	id: string;
	company: string;
	category: string;
	name: string;
	email: string;
	mobile: string;
	role: string;
	address?: string;
	postalCode?: string;
	city?: string;
	phone?: string;
	contacts?: ContractorContactItem[];
}

export interface CreateOrderFormData {
	// Step 1
	customerInfo: CustomerInfoData;
	contactPerson: ContactPersonData;

	// Step 2
	orderInfo: OrderInfoData;

	// Step 3
	documents: OrderDocumentItem[];

	// Step 4
	contractor: ContractorOrganizationData;
	organizationsList: OrderOrganizationSummaryRow[];
}
