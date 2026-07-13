export type ConsultantStatus = "active" | "pending" | "completed" | "past";

export type ConsultantType =
	"architect" | "electrical" | "structural" | "plumbing";

export interface Consultant {
	id: string;
	name: string;
	avatarUrl?: string;
	type: ConsultantType;
	project: string;
	status: ConsultantStatus;
	email: string;
	phone: string;
	updatedAt: string;
}

export type ConsultantColumnField =
	"name" | "specialty" | "project" | "status" | "contact" | "actions";
