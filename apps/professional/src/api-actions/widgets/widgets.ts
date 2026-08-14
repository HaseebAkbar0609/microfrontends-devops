import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

const WIDGETS_BASE_PATH = "/widgets";

export interface WidgetSyncItem {
	key: string;
	order: number;
}

export interface WidgetCompanyResponse {
	id: string;
	name: string;
	description?: string;
	company_id: string;
	order: number;
	key: string;
	location: string;
}

export async function getWidgetsAction(companyId: string, location: string): Promise<ActionResult<WidgetCompanyResponse[]>> {
	try {
		const response = await axiosInstance.get<ApiResponse<WidgetCompanyResponse[]>>(`${WIDGETS_BASE_PATH}/list/${companyId}?location=${location}`);
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to fetch widgets";
		return { success: false, data: null, error: errorMessage };
	}
}

export async function syncWidgetsAction(companyId: string, location: string, widgets: WidgetSyncItem[]): Promise<ActionResult<WidgetCompanyResponse[]>> {
	try {
		const response = await axiosInstance.put<ApiResponse<WidgetCompanyResponse[]>>(`${WIDGETS_BASE_PATH}/update_order_list`, {
			company_id: companyId,
			location,
			widgets
		});
		showToast("success", "Dashboard layout saved successfully");
		return { success: true, data: response.data.data, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage = apiError.response?.data?.message || "Failed to save dashboard layout";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}
