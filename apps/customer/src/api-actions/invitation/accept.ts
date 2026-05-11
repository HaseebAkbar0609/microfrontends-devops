import axiosInstance from "@/lib/axiosInstance";
import { ActionResult, ApiError } from "@/types/api";
import { API_PATH } from "@/constants/api";

const ACCEPT_INVITATION_PATH = API_PATH.INVITATION.ACCEPT;

export interface AcceptInvitationPayload {
	project_id: string | undefined;
}

export const acceptInvitationAPIAction = async (
	payload: AcceptInvitationPayload,
): Promise<ActionResult<void>> => {
	try {
		await axiosInstance.post(ACCEPT_INVITATION_PATH, payload);
		return { success: true, data: undefined, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data;
		const errorMessage = errorResponse?.message || "Failed to accept invitation";

		return {
			success: false,
			data: null,
			error: errorMessage,
		};
	}
};
