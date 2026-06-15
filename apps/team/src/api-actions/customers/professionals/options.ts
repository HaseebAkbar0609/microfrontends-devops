import axiosInstance from "@/lib/axiosInstance";
import type { ApiError } from "@/types/api";

const CATEGORIES_PATH = "/api/v1/teams/professionals/subcategories/list";
const CITIES_PATH = "/api/v1/location/cities";

export interface SelectOption {
	id: string;
	name: string;
}

interface PaginatedItemsResponse {
	success: boolean;
	data: {
		items: SelectOption[];
	};
}

export async function getProfessionalCategoriesAPIAction(): Promise<SelectOption[]> {
	try {
		const response = await axiosInstance.get<PaginatedItemsResponse>(CATEGORIES_PATH, {
			params: { page: 1, page_size: 100 },
		});
		return response.data?.data?.items ?? [];
	} catch (error: unknown) {
		console.error("Failed to fetch professional categories", (error as ApiError).message);
		return [];
	}
}

export async function getCitiesAPIAction(): Promise<SelectOption[]> {
	try {
		const response = await axiosInstance.get<PaginatedItemsResponse>(CITIES_PATH, {
			params: { page: 1, page_size: 200 },
		});
		return response.data?.data?.items ?? [];
	} catch (error: unknown) {
		console.error("Failed to fetch cities", (error as ApiError).message);
		return [];
	}
}
