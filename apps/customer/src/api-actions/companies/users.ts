import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult } from "@/types/api";

export async function activeInactiveCompanyUserAPIAction(
	companyUserId: string,
): Promise<ActionResult<unknown>> {
	try {
		const response = await axiosInstance.put(
			API_PATH.COMPANIES.USER_ACTIVE_INACTIVE(companyUserId),
		);

		showToast("success", "User status updated");
		return { success: true, data: response.data, error: null };
	} catch {
		showToast("error", "Failed to update user status");
		return {
			success: false,
			data: null,
			error: "Failed to update user status",
		};
	}
}
