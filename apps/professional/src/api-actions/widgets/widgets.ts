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

export interface WidgetSourcesResponse {
	location: string;
	live_widget_ids: string[];
}

const DEFAULT_LOCATION_LIVE_WIDGETS: Record<string, string[]> = {
	vehicle_dashboard: [
		"vehicleKpiOverview",
		"vehicleUpcomingService",
		"vehicleDriveOverview",
		"vehicleQuickActions",
	],
	machine_dashboard: [
		"machineOverview",
		"machineHandling",
		"machineStatistics",
		"machinePurchase",
		"machineQuickActions",
	],
	order_dashboard: [
		"orderOverview",
		"orderStatus",
		"orderQuickActions",
	],
	design_dashboard: [
		"designOverview",
		"designStatus",
		"designQuickActions",
	],
	purchase_dashboard: [
		"purchaseOverview",
		"purchaseStatus",
		"purchaseQuickActions",
	],
	project_dashboard: [
		"projectOverview",
		"projectStatus",
		"projectQuickActions",
	],
	economy_dashboard: [
		"economyOverview",
		"economyStatus",
		"economyQuickActions",
	],
};

export async function getWidgetSourcesAction(location: string): Promise<ActionResult<WidgetSourcesResponse>> {
	try {
		const response = await axiosInstance.get<ApiResponse<WidgetSourcesResponse>>(
			`${WIDGETS_BASE_PATH}/sources/${encodeURIComponent(location)}`,
		);
		if (response.data?.data?.live_widget_ids && response.data.data.live_widget_ids.length > 0) {
			return { success: true, data: response.data.data, error: null };
		}
		return {
			success: true,
			data: {
				location,
				live_widget_ids: DEFAULT_LOCATION_LIVE_WIDGETS[location] ?? [],
			},
			error: null,
		};
	} catch {
		// When the widget source registry endpoint fails or is not yet implemented on the backend,
		// gracefully fallback to known dashboard widgets per TFS mock data standard.
		return {
			success: true,
			data: {
				location,
				live_widget_ids: DEFAULT_LOCATION_LIVE_WIDGETS[location] ?? [],
			},
			error: null,
		};
	}
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
