import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import { authStorage } from "@/lib/authStorage";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import { ActionResult, ApiError, ApiResponse } from "@/types/api";

const LOGOUT_PATH = API_PATH.AUTH.LOGOUT;

/**
 * Call logout API, then clear local session.
 * Still clears session if the API fails (e.g. expired token).
 */

export type LogoutAPIPayload = {
  refresh_token: string;
};

export type LogoutPayloadData = {
  message: string;
};

export async function logoutAPIAction(
  payload?: LogoutAPIPayload
): Promise<ActionResult<LogoutPayloadData>> {
  try {
    const refreshToken =
      payload?.refresh_token ?? authStorage.getRefreshToken() ?? "";

    if (!refreshToken) {
      const errorMsg = authMessages.logout.invalidResponse;
      showToast("error", errorMsg);
      authStorage.clearSession();
      return { success: false, data: null, error: errorMsg };
    }

    const response = await axiosInstance.post<
      ApiResponse<LogoutPayloadData> | { data: LogoutPayloadData }
    >(LOGOUT_PATH, { refresh_token: refreshToken });

    const apiData =
      "data" in response.data
        ? response.data.data
        : (response.data as unknown as LogoutPayloadData);

    if (!apiData) {
      const errorMsg = authMessages.logout.invalidResponse;
      showToast("error", errorMsg);
      return { success: false, data: null, error: errorMsg };
    }

    authStorage.clearSession();

    showToast("success", authMessages.logout.success);
    return { success: true, data: apiData, error: null };
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

    showToast("error", authMessages.logout.failed);
    return { success: false, data: null, error: authMessages.logout.failed };
  } finally {
    authStorage.clearSession();
  }
}
