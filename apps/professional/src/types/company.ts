export type ProfessionalStatus = "active" | "inactive" | "pending" | "archived";

export interface ProfessionalRow {
	id: string;
	contactUserId: string;
	companyName: string;
	orgNo: string;
	category: string;
	contactPerson: string;
	email: string;
	phone: string;
	city: string;
	status: ProfessionalStatus;
}

export interface ProfessionalCategoryInfo {
	id: string;
	name: string;
}

export interface ProfessionalAccountItem {
	company_id?: string;
	id?: string;
	company_name?: string | null;
	organization_number?: string | null;
	category?: ProfessionalCategoryInfo | null;
	company_category?: ProfessionalCategoryInfo | null;
	contact_person?: string | null;
	contact_user_id?: string | null;
	email?: string | null;
	phone?: string | null;
	city?: string | null;
	status?: string | null;
	[key: string]: unknown;
}

export interface ProfessionalsListApiResponse {
	success: boolean;
	message: string;
	data: ProfessionalAccountItem[];
	total_pages: number;
	total_items: number;
	current_page: number;
	page_size: number;
}
