import type { ConsultantType } from "./consultant";

export interface ConsultantRequest {
	id: string;
	project_id: string;
	project: string;
	applications: number;
	date: string;
	consultant: string;
	consultantType: ConsultantType;
}

export type ConsultantRequestColumnField =
	"project" | "applications" | "date" | "consultant" | "actions";
