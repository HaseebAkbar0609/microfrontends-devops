import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type { DiscountPartnerDetail } from "@/features/discount/types/types";
import { API_PATH } from "@/constants/api";

export async function getDiscountDetailAPIAction(
  partnerId: string,
): Promise<ActionResult<DiscountPartnerDetail>> {
  try {
    const { data: body } = await axiosInstance.get<{
      data: DiscountPartnerDetail;
    }>(API_PATH.DISCOUNT.detail(partnerId));
    return { success: true, data: body.data, error: null };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        success: true,
        data: { partner: null, offers: [], bannerSlides: [] },
        error: null,
      };
    }
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to load discount details",
    };
  }
}
