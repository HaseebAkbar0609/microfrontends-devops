import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import { API_PATH } from "@/constants/api";

export interface SupportConfig {
  help_center_url: string | null;
  contact_support_url: string | null;
  chat_available: boolean;
  chat_config: Record<string, unknown> | null;
  support_email: string | null;
  support_phone: string | null;
  operating_hours: string | null;
}

export async function getSupportConfigAPIAction(): Promise<ActionResult<SupportConfig>> {
  try {
    const { data: body } = await axiosInstance.get<{
      data: SupportConfig;
    }>(API_PATH.SUPPORT.CONFIG);
    return { success: true, data: body.data, error: null };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to load support config",
    };
  }
}
