import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import axiosInstance from "@/lib/axiosInstance";
import {
	extractRequiresSubscriptionFlag,
	setRequiresSubscriptionCookie,
} from "@/lib/requiresSubscriptionCookie";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError } from "@/types/api";

const SET_PASSWORD_PATH = API_PATH.AUTH.SET_PASSWORD;

export type SetPasswordAPIPayload = {
  token: string;
  password?: string; // Optional if we just want to validate token first? But wait, the API receives token and password.
};

export type SetPasswordAPIResponse = {
  message?: string;
  data?: unknown;
  requires_subscription?: string | boolean;
};

/**
 * Set password
 * POST /professionals/auth/set-password
 */
export async function setPasswordAPIAction(
  payload: SetPasswordAPIPayload
): Promise<ActionResult<SetPasswordAPIResponse>> {
  try {
    const response = await axiosInstance.post<SetPasswordAPIResponse>(
      SET_PASSWORD_PATH,
      payload
    );

    const serverMessage =
      typeof response.data?.message === "string"
        ? response.data.message
        : undefined;

    setRequiresSubscriptionCookie(
      extractRequiresSubscriptionFlag(response.data),
    );

    showToast("success", serverMessage ?? authMessages.resetPassword.success);
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

    showToast("error", authMessages.resetPassword.failed);
    return {
      success: false,
      data: null,
      error: authMessages.resetPassword.failed,
    };
  }
}
