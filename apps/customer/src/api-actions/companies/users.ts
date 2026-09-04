import { API_PATH } from "@/constants/api";
import { companyMessages } from "@/constants/messages";
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

		showToast("success", companyMessages.activeInactiveUser.success);
		return { success: true, data: response.data, error: null };
	} catch {
		showToast("error", companyMessages.activeInactiveUser.failed);
		return {
			success: false,
			data: null,
			error: companyMessages.activeInactiveUser.failed,
		};
	}
}
