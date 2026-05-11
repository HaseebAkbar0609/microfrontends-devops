import { API_PATH, getErrorMessageByCode } from "@/constants/api";
import { cartMessages } from "@/constants/messages";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";

export interface SetupIntentResponse {
  client_secret: string;
}

export interface AttachPaymentMethodPayload {
  payment_method_id: string;
  is_default: boolean;
}

export interface AttachedCard {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export type UserCard = AttachedCard;

export interface UserCardsListResponse {
  success: boolean;
  message: string;
  total_pages: number;
  total_items: number;
  current_page: number;
  page_size: number;
  data: UserCard[];
}

export async function createSetupIntentAction(): Promise<
  ActionResult<SetupIntentResponse>
> {
  try {
    const response = await axiosInstance.post<ApiResponse<SetupIntentResponse>>(
      API_PATH.USER_CARDS.SETUP_INTENT,
      {}
    );

    return {
      success: true,
      data: response.data?.data,
      error: null,
    };
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

    const message = errorMessage ?? "Failed to create setup intent.";
    showToast("error", message);
    return { success: false, data: null, error: message };
  }
}

export async function attachPaymentMethodAction(
  payload: AttachPaymentMethodPayload
): Promise<ActionResult<AttachedCard>> {
  try {
    const response = await axiosInstance.post<ApiResponse<AttachedCard>>(
      API_PATH.USER_CARDS.ATTACH_PAYMENT_METHOD,
      payload
    );
    const serverMessage =
      typeof response.data?.message === "string"
        ? response.data.message
        : undefined;

    showToast(
      "success",
      serverMessage ?? cartMessages.checkoutPayment.cardAdded
    );
    return { success: true, data: response.data?.data, error: null };
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

    const message = errorMessage ?? "Failed to attach payment method.";
    showToast("error", message);
    return { success: false, data: null, error: message };
  }
}

export async function getUserCardsListAction(): Promise<
  ActionResult<UserCard[]>
> {
  try {
    const response = await axiosInstance.get<UserCardsListResponse>(
      API_PATH.USER_CARDS.LIST
    );

    return { success: true, data: response.data?.data ?? [], error: null };
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

    const message = errorMessage ?? "Failed to fetch saved cards.";
    showToast("error", message);
    return { success: false, data: null, error: message };
  }
}
