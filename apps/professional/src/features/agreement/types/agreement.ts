export type AgreementStatus = "active" | "expired" | "draft" | "terminated" | "sent";

export interface Agreement {
	id: string;
	idNumber: string;
	object: string;
	department: string;
	counterparty: string;
	startDate: string;
	endDate: string;
	actionDate: string;
	status: AgreementStatus;
	createdAt: string;
	updatedAt: string;
}

export interface AgreementColumn {
	field: string;
	label: string;
	sortable: boolean;
}

export interface AgreementListTableProps {
	data: Agreement[];
	totalItems: number;
}
