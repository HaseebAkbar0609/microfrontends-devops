import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { CalculationProData } from "../types/pro";
import { DEFAULT_PRO_DATA } from "../constants/proMock";

/**
 * Fetch Calculation Pro data with fallback to default mock
 */
export async function getCalculationProAPIAction(): Promise<CalculationProData> {
	try {
		const response = await axiosInstance.get(API_PATH.CALCULATION.PRO);
		if (response?.data?.data) {
			return response.data.data as CalculationProData;
		}
		return DEFAULT_PRO_DATA;
	} catch {
		return DEFAULT_PRO_DATA;
	}
}

/**
 * Save Calculation Pro settings
 */
export async function saveCalculationProSettingsAPIAction(
	payload: CalculationProData,
): Promise<{ success: boolean }> {
	try {
		const response = await axiosInstance.post(API_PATH.CALCULATION.PRO_SAVE, payload);
		return { success: response?.status === 200 || response?.status === 201 };
	} catch {
		// Mock optimistic success
		return { success: true };
	}
}

/**
 * Purchase Industry License
 */
export async function purchaseIndustryLicenseAPIAction(
	industryName?: string,
): Promise<{ success: boolean; id?: string }> {
	try {
		const response = await axiosInstance.post(
			API_PATH.CALCULATION.PRO_PURCHASE_LICENSE,
			{ industryName },
		);
		return {
			success: response?.status === 200 || response?.status === 201,
			id: response?.data?.data?.id,
		};
	} catch {
		// Mock optimistic success
		return { success: true, id: `cat-${Date.now()}` };
	}
}

/**
 * Delete Industry Setting Row
 */
export async function deleteIndustrySettingRowAPIAction(
	rowId: string,
): Promise<{ success: boolean }> {
	try {
		const response = await axiosInstance.delete(
			API_PATH.CALCULATION.PRO_DELETE_ROW(rowId),
		);
		return { success: response?.status === 200 || response?.status === 204 };
	} catch {
		// Mock optimistic success
		return { success: true };
	}
}
