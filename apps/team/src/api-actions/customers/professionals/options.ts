import axiosInstance from "@/lib/axiosInstance";
import type { ApiError } from "@/types/api";

const CATEGORIES_PATH = "/api/v1/teams/professionals/subcategories/list";
const CITIES_PATH = "/api/v1/location/cities";

export interface SelectOption {
	id: string;
	name: string;
}

interface ListResponse {
	success: boolean;
	message: string;
	data: SelectOption[];
	total_pages: number;
	total_items: number;
	current_page: number;
	page_size: number;
}

export async function getProfessionalCategoriesAPIAction(search = ""): Promise<SelectOption[]> {
	try {
		const response = await axiosInstance.get<ListResponse>(CATEGORIES_PATH, {
			params: { page: 1, page_size: 20, search },
		});
		return response.data?.data ?? [];
	} catch (error: unknown) {
		console.error("Failed to fetch professional categories", (error as ApiError).response?.data?.message);
		return [];
	}
}

export async function getCitiesAPIAction(search = ""): Promise<SelectOption[]> {
	try {
		const response = await axiosInstance.get<ListResponse>(CITIES_PATH, {
			params: { page: 1, page_size: 20, search },
		});
		return response.data?.data ?? [];
	} catch (error: unknown) {
		console.error("Failed to fetch cities", (error as ApiError).response?.data?.message);
		return [];
	}
}
