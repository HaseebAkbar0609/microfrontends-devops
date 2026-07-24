import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import { API_PATH } from "@/constants/api";

export interface DiscountFilters {
  suppliers: string[];
  categories: string[];
}

export async function getDiscountFiltersAPIAction(): Promise<ActionResult<DiscountFilters>> {
  try {
    const { data: body } = await axiosInstance.get<{
      data: DiscountFilters;
    }>(API_PATH.DISCOUNT.FILTERS);
    return { success: true, data: body.data, error: null };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to load discount filters",
    };
  }
}
