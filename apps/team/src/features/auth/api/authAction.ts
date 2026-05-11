import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import { authStorage } from "@/lib/authStorage";
import axiosInstance from "@/lib/axiosInstance";
import type {
  ActionResult,
  ApiError,
  ApiResponse,
} from "@/types/api";
import type { LoginAPIPayload, LoginPayloadData } from "@/features/auth/types";
import { showToast } from "@/lib/toast";


export async function loginAPIAction(
  payload: LoginAPIPayload
): Promise<ActionResult<LoginPayloadData>> {
  try {
    const response = await axiosInstance.post<
      ApiResponse<LoginPayloadData> | { data: LoginPayloadData }
    >(API_PATH.AUTH.LOGIN, payload);

    const apiData =
      "data" in response.data
        ? response.data.data
        : (response.data as unknown as LoginPayloadData);

    if (!apiData) {
      const errorMsg = authMessages.login.invalidResponse;
      showToast("error", errorMsg);
      return { success: false, data: null, error: errorMsg };
    }

    const accessToken =
      apiData.accessToken ??
      apiData.access_token ??
      apiData.token;
    const refreshToken =
      apiData.refreshToken ?? apiData.refresh_token;
    const { user } = apiData;

    if (!accessToken) {
      const errorMsg = authMessages.login.tokenNotReceived;
      showToast("error", errorMsg);
      return { success: false, data: null, error: errorMsg };
    }

    authStorage.setAuthData(accessToken);
    if (refreshToken) {
      authStorage.setRefreshToken(refreshToken);
    }
    if (user !== undefined) {
      authStorage.setUserData(user);
    }
    showToast("success", authMessages.login.success);
    return { success: true, data: apiData, error: null };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const errorResponse = apiError.response?.data;
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

    showToast("error", authMessages.login.failed);
    return {
      success: false,
      data: null,
      error: authMessages.login.failed,
    };
  }
}
