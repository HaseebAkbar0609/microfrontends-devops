import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type { Discount } from "@/features/discounts/constants";
import { DUMMY_DISCOUNTS } from "@/features/discounts/constants";

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

const USE_MOCK = true; // TODO: set to false when real API is available
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

  if (USE_MOCK) {
    // Simulate network delay for realistic infinite scroll feel
    await new Promise((r) => setTimeout(r, 400));

    const filtered = DUMMY_DISCOUNTS.filter((d) => {
      const matchSupplier = !supplier || d.supplier === supplier;
      const matchCategory = !category || d.category === category;
      return matchSupplier && matchCategory;
    });

    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);
    const hasMore = offset + limit < filtered.length;

    return { success: true, data: { items, hasMore, total: filtered.length }, error: null };
  }

  try {
    const { data: body } = await axiosInstance.get<{
      data: { items: Discount[]; hasMore: boolean; total: number };
    }>(`/api/v1/discounts?${q.toString()}`);
    return { success: true, data: body.data, error: null };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to load discounts",
    };
  }
}
