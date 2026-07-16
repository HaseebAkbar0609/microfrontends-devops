import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type { Supplier } from "@/features/suppliers/types/types";

export interface GetSuppliersParams {
	page?: number;
	pageSize?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: string;
}

export interface SuppliersListPayload {
	suppliers: Supplier[];
	totalItems: number;
}

interface ApiSupplierItem {
	company_id: string;
	user_id?: string;
	company_name: string;
	organization_number: string;
	first_name?: string;
	last_name?: string;
	email: string;
}

interface ApiSuppliersListResponse {
	success: boolean;
	message?: string;
	data: ApiSupplierItem[];
	total_items?: number;
	total_pages?: number;
	current_page?: number;
	page_size?: number;
}

export async function getSuppliersAPIAction(
	params: GetSuppliersParams = {},
): Promise<ActionResult<SuppliersListPayload>> {
	const { page = 1, pageSize = 10, search } = params;

	const queryParams = new URLSearchParams();
	queryParams.set("page", String(page));
	queryParams.set("page_size", String(pageSize));
	if (search && search.trim()) {
		queryParams.set("search", search.trim());
	}

	try {
		const { data: res } = await axiosInstance.get<ApiSuppliersListResponse>(
			`${API_PATH.SUPPLIER.LIST}?${queryParams.toString()}`,
		);

		if (!res || res.data == null || !Array.isArray(res.data)) {
			return {
				success: false,
				data: null,
				error: res?.message || "Invalid response format from suppliers API",
			};
		}

		const suppliers: Supplier[] = res.data.map((item) => ({
			id: item.company_id,
			companyName: item.company_name,
			orgNo: item.organization_number,
			contactPersonName: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
			email: item.email,
			mobileNumber: "",
		}));

		return {
			success: true,
			data: {
				suppliers,
				totalItems: res.total_items ?? suppliers.length,
			},
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: false,
			data: null,
			error:
				apiError.response?.data?.message || "Failed to load suppliers",
		};
	}
}
