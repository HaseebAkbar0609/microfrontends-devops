import type { ProjectCreationMode } from "@/features/quote/types/types";

export interface ActiveProject {
	id: string;
	name: string;
	referenceNo: string;
	clientNo: string;
	projectNo: string;
	startDate: string;
	endDate: string;
	contactPersonName: string;
	mobileNumber: string;
	email: string;
	address: string;
	city?: string;
	postalCode: string;
	companyName: string;
	status: "active" | "on-hold" | "completed" | "received-quote" | "draft" | "under-review";
	statusLabel?: string;
	orderNo?: string;
	quoteReferenceNo?: string;
	progressPercent?: number;
	updatedAt?: string;
	primaryContact?: {
		id?: string;
		name?: string;
	};
	summary?: {
		openTasks?: number;
		completedTasks?: number;
		nextMilestone?: string;
	};
	category: string;
	description?: string;
	/** Tells a project started from Projects apart from an accepted offer */
	creationMode?: ProjectCreationMode;
	/** False for a draft, which opens the wizard to continue it */
	isCompleted?: boolean;
}

export interface ArchivedProject extends Omit<
	ActiveProject,
	"status" | "statusLabel"
> {
	status: "archived";
	statusLabel?: string;
	archivedDate?: string;
}

export interface ProjectDocument {
	id: string;
	name: string;
	specification: string;
	type: string;
	date: string;
	fileUrl?: string;
}

export interface PersonalDocument {
	id: string;
	name: string;
	type: string;
}

export interface MeetingMinute {
	id: string;
	title: string;
	date: string;
	rating: "good" | "moderate" | "bad";
	description?: string;
}

export interface ProjectQuestion {
	id: string;
	question: string;
	answer?: string;
	date: string;
	isAnswered: boolean;
}

export interface TimelineEvent {
	id: string;
	title: string;
	date: string;
	description: string;
	isCompleted: boolean;
}

export interface OrgMember {
	id: string;
	company: string;
	category: string;
	role: string;
	contactPerson: string;
	phone: string;
	mail: string;
}

export interface ApiQuoteItem {
	id?: string;
	project_id?: string;
	project_name?: string;
	projectName?: string;
	name?: string;
	company_name?: string;
	companyName?: string;
	ref_no?: string;
	refNo?: string;
	project_code?: string;
	projectCode?: string;
	quote_status?: string;
	status?: string;
	clientNo?: string;
	client_no?: string;
	orderNo?: string;
	order_no?: string;
	category?: string;
	created_at?: string;
	creation_mode?: ProjectCreationMode;
	is_completed?: boolean;
}

export interface ApiProjectDetailItem {
	id: string;
	project_id?: string;
	current_step?: number;
	is_completed?: boolean;
	created_at?: string | number;
	personal_information?: {
		first_name?: string;
		last_name?: string;
		mobile_number?: string;
		personal_email?: string;
		address?: string;
		city?: string;
		city_name?: string;
		postal_code?: string;
	};
	project_details?: {
		project_name?: string;
		ref_no?: string;
		client_no?: string;
		project_address?: string;
		city?: string;
		city_name?: string;
		postal_code?: string;
		directions?: string;
		project_type?: string;
		start_date?: string | number;
		due_date?: string | number;
		order_no?: string;
	};
	suppliers?: {
		invited_suppliers?: Array<{
			company_name?: string;
			first_name?: string;
			last_name?: string;
			user_id?: string;
			company_id?: string;
		}>;
	};
	status?: string;
	quote_status?: string;
	projectName?: string;
	name?: string;
	ref_no?: string;
	refNo?: string;
	client_no?: string;
	start_date?: string;
	due_date?: string;
	contact_person?: string;
	contact_phone?: string;
	contact_email?: string;
	address?: string;
	postal_code?: string;
	company_name?: string;
	order_no?: string;
	category?: string;
}

