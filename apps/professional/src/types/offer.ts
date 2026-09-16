export interface OfferCategoryApiItem {
	id?: string;
	name?: string;
}

export interface OfferApiResponseItem {
	id?: string;
	mapping_id?: string;
	project_id?: string;
	quote_id?: string;
	agreement_id?: string;
	agreement_status?: string;
	offer_id?: string;
	offer_code?: string;
	project_code?: string;
	project_name?: string;
	project_title?: string;
	title?: string;
	created_at?: string | number;
	project_type?: string;
	type?: string;
	status?: string;
	professional_status?: string | null;
	city?: string;
	city_name?: string | null;
	municipality?: string | null;
	category?: string;
	categories?: OfferCategoryApiItem[];
	hit_count?: number;
	taken_count?: number;
	is_bookmark?: boolean;
	project_description?: string | null;
	country_name?: string | null;
	postal_code?: string | null;
	address?: string | null;
	contact_details?: {
		first_name?: string | null;
		last_name?: string | null;
		email?: string | null;
		phone?: string | null;
		address?: string | null;
		postal_code?: string | null;
	};
	media?: Array<{
		media_id?: string;
		file_name?: string;
		url?: string;
		content_type?: string;
		media_type?: string;
	}>;
	preliminary_budget?: { preliminary_budget?: number | string; budget_date?: number } | number | string | null;
	total_quote_price?: number | null;
	project_contact_first_name?: string | null;
	project_contact_last_name?: string | null;
	project_contact_phone?: string | null;
	project_contact_email?: string | null;
	seen_status?: { status?: string | null; opened_at?: number | null } | string | null;
	[key: string]: unknown; // Allow other properties since backend schema is dynamic
}

export interface OffersListApiResponse {
	success: boolean;
	message: string;
	data: OfferApiResponseItem[];
	total_pages: number;
	total_items: number;
	current_page: number;
	page_size: number;
}

export interface AvailableOffersApiResponse {
	success: boolean;
	message: string;
	data: {
		items: OfferApiResponseItem[];
		total_pages: number;
		total_items: number;
		current_page: number;
		page_size: number;
	};
}
