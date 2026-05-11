/** Category row from teams category/subcategory list endpoints */
export interface CustomerCategory {
	id: string;
	name: string;
}

export interface CustomerCategoriesListResponse {
	success: boolean;
	message?: string;
	data: CustomerCategory[];
}
