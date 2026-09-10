export interface OfferCategoryApiItem {
	id?: string;
	name?: string;
}

export interface OfferApiResponseItem {
	id?: string;
	project_id?: string;
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
