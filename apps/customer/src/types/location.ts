export interface Country {
	id: string;
	name: string;
	code: string;
}

export interface CountriesResponse {
	success: boolean;
	message: string;
	total_pages: number;
	total_items: number;
	current_page: number;
	page_size: number;
	data: Country[];
}

export interface City {
	id: string;
	name: string;
	country_id: string;
}

export interface CitiesResponse {
	success: boolean;
	message: string;
	total_pages: number;
	total_items: number;
	current_page: number;
	page_size: number;
	data: City[];
}
