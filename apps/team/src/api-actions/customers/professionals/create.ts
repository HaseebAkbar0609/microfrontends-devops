import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ApiError } from "@/types/api";

const PROFESSIONALS_ACCOUNTS_PATH = "/api/v1/teams/professionals/accounts";

export interface CreateProfessionalPayload {
	company_name: string;
	organization_number: string;
	company_category: string;
	city: string;
	contact_name: string;
	email: string;
	phone: string;
}

export interface CreateProfessionalResult {
	success: boolean;
	error: string | null;
}

export async function createProfessionalAPIAction(
	payload: CreateProfessionalPayload,
): Promise<CreateProfessionalResult> {
	try {
		await axiosInstance.post(PROFESSIONALS_ACCOUNTS_PATH, payload);
		showToast("success", "Professional account created successfully");
		return { success: true, error: null };
	} catch (error: unknown) {
		const msg =
			(error as ApiError).response?.data?.message ?? "Failed to create professional account";
		showToast("error", msg);
		return { success: false, error: msg };
	}
}
