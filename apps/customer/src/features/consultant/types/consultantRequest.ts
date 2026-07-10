export interface ConsultantRequest {
	id: string;
	project: string;
	applications: number;
	date: string;
	consultant: string;
}

export type ConsultantRequestColumnField =
	"project" | "applications" | "date" | "consultant" | "actions";
