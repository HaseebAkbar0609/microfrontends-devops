export type LeadStatus =
	| "granskning"
	| "bevakning"
	| "hantering"
	| "accepterad"
	| "betalda"
	| "arkiv";

export type LeadRow = {
	id: string;
	date: string;
	leadId: string;
	customer: string;
	type: string;
	category: string;
	city: string;
	matches: string;
	status: LeadStatus;
	email: string;
	phone: string;
	reviewed?: boolean;
};

export type LeadApiCategory = {
	id: string;
	name?: string;
	english_name?: string;
	swedish_name?: string;
};

export type LeadApiItem = {
	lead_id: string;
	lead_number: string;
	project_id: string;
	status?: string;
	customer_name?: string;
	customer_id?: string;
	project_name?: string;
	project_type?: string;
	city?: string | null;
	city_name?: string | null;
	categories?: LeadApiCategory[];
	hit_count?: number;
	taken_count?: number;
	created_at?: string | number;
	creatd_at?: string | number;
	createdAt?: string | number;
	updated_at?: string | number;
};

export type LeadsListApiResponse = {
	success: boolean;
	message: string;
	total_pages: number;
	total_items: number;
	current_page: number;
	page_size: number;
	data: LeadApiItem[];
};

export type LeadsListQueryParams = {
	page?: number;
	pageSize?: number;
};

export type LeadsListResult = {
	items: LeadRow[];
	totalPages: number;
	totalItems: number;
	currentPage: number;
	pageSize: number;
};

export type LeadDetailApiCustomer = {
	customer_name: string;
	personal_email: string;
	mobile_number: string;
	city: string;
	city_name?: string;
};

export type LeadDetailApiData = {
	lead_id: string;
	lead_number: string;
	status: string;
	hit_count: number;
	taken_count: number;
	categories: LeadApiCategory[];
	created_at: string;
	updated_at: string;
	customer_details: LeadDetailApiCustomer;
};

export type LeadDetailApiResponse = {
	success: boolean;
	message: string;
	data: LeadDetailApiData;
};

export type LeadProjectCategory = {
	id: string;
	name: string;
};

export type LeadProjectMedia = {
	media_id: string;
	url: string;
	media_type: string;
	file_name: string;
};

export type LeadProjectSupplier = {
	company_name?: string;
	organization_number?: string;
	contact_person_name?: string;
	email?: string;
};

export type LeadProjectDetailsApiData = {
	project_details?: {
		project_name?: string;
		is_express?: boolean;
		client_no?: string;
		categories?: LeadProjectCategory[];
		subcategories?: LeadProjectCategory[];
		project_address?: string;
		city?: string;
		city_name?: string;
		postal_code?: string;
		directions?: string;
		project_type?: string;
	};
	project_description?: {
		project_description?: string;
		media?: LeadProjectMedia[];
	};
	suppliers?: {
		invited_suppliers?: LeadProjectSupplier[];
	};
};

export type LeadProjectDetailsApiResponse = {
	success: boolean;
	message: string;
	data: LeadProjectDetailsApiData;
};

export type UpdateLeadStatusPayload = {
	status: string;
};

export type UpdateLeadStatusApiResponse = {
	success: boolean;
	message: string;
	data?: {
		lead_id?: string;
		status?: string;
	};
};
