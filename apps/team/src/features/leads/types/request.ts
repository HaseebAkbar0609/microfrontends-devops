export type LeadRequestDocument = {
	id: string;
	date: string;
	name: string;
	fileType: string;
	url?: string;
};

export type LeadRequestSupplier = {
	id: string;
	companyName: string;
	orgNumber: string;
	contactName: string;
	email: string;
};

export type LeadRequestDetails = {
	projectName: string;
	isExpress: boolean;
	orderNumber: string;
	category: string;
	projectType: string;
	address: string;
	city: string;
	postalCode: string;
	directions: string;
	description: string;
	documents: LeadRequestDocument[];
	suppliers: LeadRequestSupplier[];
};
