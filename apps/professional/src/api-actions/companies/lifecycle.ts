import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { AccountLifecycle, AccountLifecyclePopup } from "@/types/lifecycle";

interface LifecycleApiResponse {
	success: boolean;
	message: string;
	data: AccountLifecycle;
}

interface PopupsApiResponse {
	success: boolean;
	message: string;
	data: AccountLifecyclePopup[];
}

export async function getCompanyLifecycleAPIAction(
	companyId: string,
): Promise<AccountLifecycle> {
	const response = await axiosInstance.get<LifecycleApiResponse>(
		API_PATH.COMPANIES.LIFECYCLE(companyId),
	);
	return response.data.data;
}

export async function listLifecyclePopupsAPIAction(
	companyId: string,
): Promise<AccountLifecyclePopup[]> {
	const response = await axiosInstance.get<PopupsApiResponse>(
		API_PATH.COMPANIES.LIFECYCLE_POPUPS(companyId),
	);
	return response.data.data ?? [];
}

export async function acknowledgeLifecyclePopupAPIAction(
	companyId: string,
	notificationId: string,
): Promise<void> {
	await axiosInstance.post(
		API_PATH.COMPANIES.LIFECYCLE_POPUP_ACK(companyId, notificationId),
	);
}
