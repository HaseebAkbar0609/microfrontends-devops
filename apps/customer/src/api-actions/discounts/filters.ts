import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { API_PATH } from "@/constants/api";
import { handleApiError } from "@/utils/apiError";

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
    return handleApiError(error, "Failed to load discount filters");
  }
}
