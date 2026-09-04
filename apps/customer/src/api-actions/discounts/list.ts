import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { Discount } from "@/features/discounts/constants";
import { API_PATH } from "@/constants/api";
import { handleApiError } from "@/utils/apiError";

export interface GetDiscountsParams {
  supplier?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface DiscountsPage {
  items: Discount[];
  hasMore: boolean;
  total: number;
}

const DEFAULT_LIMIT = 6;

export async function getDiscountsAPIAction(
  params: GetDiscountsParams = {},
): Promise<ActionResult<DiscountsPage>> {
  const { supplier, category, page = 1, limit = DEFAULT_LIMIT } = params;
  const q = new URLSearchParams();
  if (supplier) q.set("supplier", supplier);
  if (category) q.set("category", category);
  q.set("page", String(page));
  q.set("limit", String(limit));

  try {
    const { data: body } = await axiosInstance.get<{
      data: { items: Discount[]; hasMore: boolean; total: number };
    }>(`${API_PATH.DISCOUNT.LIST}?${q.toString()}`);
    return { success: true, data: body.data, error: null };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to load discounts");
  }
}
