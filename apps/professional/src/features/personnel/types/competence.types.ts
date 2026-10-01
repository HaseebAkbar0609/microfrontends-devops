export type CompetenceStatus = "active" | "expire_soon" | "expired";

export interface CompetenceSpecDoc {
	id: string;
	date: string;
	name: string;
	fileType: "pdf" | "doc" | "png" | "jpg";
	fileName?: string;
	fileUrl?: string;
}

export interface EmployeeCompetenceItem {
	id: string;
	nr: string;
	name: string;
	training: string;
	certNo: string;
	expiryDate: string;
	status: CompetenceStatus;
	hasFile: boolean;
	specifications: CompetenceSpecDoc[];
	isArchived?: boolean;
}

export type CompetenceItem = EmployeeCompetenceItem;

export interface CreateCompetenceFormData {
	name: string;
	certNo: string;
	training: string;
	expiryDate: string;
	specifications: CompetenceSpecDoc[];
}
