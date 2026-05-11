import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError } from "@/types/api";

const INVITATION_ACCEPT_PATH = API_PATH.COMPANIES.INVITATION_ACCEPT;

export type AcceptInvitationAPIPayload = {
  token: string;
};

export type AcceptInvitationAPIResponse = {
  message?: string;
  data?: {
    email: string; // The email we get from the API
    [key: string]: string;
  };
};

/**
 * Accept invitation
 * POST /companies/invitation/accept
 */
export async function acceptInvitationAPIAction(
  payload: AcceptInvitationAPIPayload
): Promise<ActionResult<AcceptInvitationAPIResponse>> {
  try {
    const response = await axiosInstance.post<AcceptInvitationAPIResponse>(
      INVITATION_ACCEPT_PATH,
      payload
    );

    return { success: true, data: response.data ?? {}, error: null };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const errorResponse = apiError.response?.data as
      | { code?: string; message?: string }
      | undefined;

    const errorCode = errorResponse?.code;
    const errorMessage = errorResponse?.message;

    if (errorCode) {
      const msg = getErrorMessageByCode(String(errorCode));
      showToast("error", msg);
      return { success: false, data: null, error: msg, errorCode };
    }

    if (errorMessage) {
      showToast("error", errorMessage);
      return { success: false, data: null, error: errorMessage };
    }

    showToast("error", "Failed to verify invitation token");
    return {
      success: false,
      data: null,
      error: "Failed to verify invitation token",
    };
  }
}
