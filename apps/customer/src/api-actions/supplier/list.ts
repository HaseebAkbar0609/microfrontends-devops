import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { Supplier } from "@/features/suppliers/types/types";
import { handleApiError } from "@/utils/apiError";

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
	company_name: string;
	organization_number?: string;
	contact_person_name?: string;
	email: string;
	mobile_no?: string;
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
	const { page = 1, pageSize = 10, search, sortBy, sortOrder } = params;

	const queryParams = new URLSearchParams();
	queryParams.set("page", String(page));
	queryParams.set("page_size", String(pageSize));
	if (search && search.trim()) {
		queryParams.set("search", search.trim());
	}
	if (sortBy) {
		queryParams.set("sort_by", sortBy);
	}
	if (sortOrder) {
		queryParams.set("sort_order", sortOrder);
	}

	try {
		const { data: res } = await axiosInstance.get<ApiSuppliersListResponse>(
			`${API_PATH.SUPPLIER.LIST}?${queryParams.toString()}`,
		);

		if (!res || res.success === false || res.data == null || !Array.isArray(res.data)) {
			return {
				success: false,
				data: null,
				error: res?.message || "Invalid response format from suppliers API",
			};
		}

		const suppliers: Supplier[] = res.data.map((item) => ({
			id: item.company_id,
			companyName: item.company_name,
			orgNo: item.organization_number || "",
			contactPersonName: item.contact_person_name || "",
			email: item.email,
			mobileNumber: item.mobile_no || "",
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
		return handleApiError(error, "Failed to load suppliers");
	}
}
