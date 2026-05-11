import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { authMessages } from "@/constants/messages";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError } from "@/types/api";

const FORGOT_PASSWORD_PATH = API_PATH.AUTH.FORGOT_PASSWORD;
const VALIDATE_OTP_PATH = API_PATH.AUTH.VALIDATE_OTP;
const RESET_PASSWORD_PATH = API_PATH.AUTH.RESET_PASSWORD;

export type ForgotPasswordAPIPayload = {
  email: string;
};

export type ForgotPasswordAPIResponse = {
  message?: string;
  data?: unknown;
};

export type ValidateOTPAPIPayload = {
  email: string;
  otp_code: string;
  otp_type: "forgot_password" | "verify_email";
};

export type ValidateOTPAPIResponse = {
  message?: string;
  data?: unknown;
};

export type ResetPasswordAPIPayload = {
  email: string;
  otp_code: string;
  password: string;
};

export type ResetPasswordAPIResponse = {
  message?: string;
  data?: unknown;
};

/**
 * Request password reset email.
 * POST /auth/forgot-password
 */
export async function forgotPasswordAPIAction(
  payload: ForgotPasswordAPIPayload
): Promise<ActionResult<ForgotPasswordAPIResponse>> {
  try {
    const response = await axiosInstance.post<ForgotPasswordAPIResponse>(
      FORGOT_PASSWORD_PATH,
      payload
    );

    const serverMessage =
      typeof response.data?.message === "string"
        ? response.data.message
        : undefined;

    showToast("success", serverMessage ?? authMessages.forgotPassword.success);
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

    showToast("error", authMessages.forgotPassword.failed);
    return {
      success: false,
      data: null,
      error: authMessages.forgotPassword.failed,
    };
  }
}

/**
 * Validate OTP
 * POST /auth/validate-otp
 */
export async function validateOTPAction(
  payload: ValidateOTPAPIPayload
): Promise<ActionResult<ValidateOTPAPIResponse>> {
  try {
    const response = await axiosInstance.post<ValidateOTPAPIResponse>(
      VALIDATE_OTP_PATH,
      payload
    );

    showToast("success", authMessages.validateOTP.success);
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

    showToast("error", authMessages.validateOTP.failed);
    return {
      success: false,
      data: null,
      error: authMessages.validateOTP.failed,
    };
  }
}

/**
 * Reset password
 * POST /auth/reset-password
 */
export async function resetPasswordAction(
  payload: ResetPasswordAPIPayload
): Promise<ActionResult<ResetPasswordAPIResponse>> {
  try {
    const response = await axiosInstance.post<ResetPasswordAPIResponse>(
      RESET_PASSWORD_PATH,
      payload
    );

    const serverMessage =
      typeof response.data?.message === "string"
        ? response.data.message
        : undefined;

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
