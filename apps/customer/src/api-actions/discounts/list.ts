import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type { Discount } from "@/features/discounts/constants";
import { DUMMY_DISCOUNTS } from "@/features/discounts/constants";

export interface GetDiscountsParams {
  supplier?: string;
  category?: string;
}

const USE_MOCK = true; // TODO: set to false when real API is available
const MOCK_DISCOUNTS: Discount[] = DUMMY_DISCOUNTS;

export async function getDiscountsAPIAction(
  params: GetDiscountsParams = {},
): Promise<ActionResult<Discount[]>> {
  const { supplier, category } = params;
  const q = new URLSearchParams();
  if (supplier) q.set("supplier", supplier);
  if (category) q.set("category", category);

  if (USE_MOCK) {
    const items = MOCK_DISCOUNTS.filter((d) => {
      const matchSupplier = !supplier || d.supplier === supplier;
      const matchCategory = !category || d.category === category;
      return matchSupplier && matchCategory;
    });
    return { success: true, data: items, error: null };
  }

  try {
    const { data: body } = await axiosInstance.get<{ data: Discount[] }>(
      `/api/v1/discounts?${q.toString()}`,
    );
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
