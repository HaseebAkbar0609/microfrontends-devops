export interface OfferApiResponseItem {
	id?: string;
	offer_id?: string;
	project_code?: string;
	project_title?: string;
	created_at?: string | number;
	project_type?: string;
	status?: string;
	city?: string;
	category?: string;
	[key: string]: any; // Allow other properties since backend schema is dynamic
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
