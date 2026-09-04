export interface WarrantyRow {
	id: string;
	orderNo: string;
	orderName: string;
	startDate: string;
	approvedDate: string;
	warrantyPeriod: string;
	projectManager: string;
	customer: string;
	contactPerson?: string;
	warrantyResponsible?: string;
	warrantyEndDate?: string;
	phone?: string;
	email?: string;
}

export interface InspectionDateItem {
	id: string;
	date: string;
	reminderEmail: string;
	rule: string;
	documentName: string;
	fileType: "pdf" | "doc";
}
