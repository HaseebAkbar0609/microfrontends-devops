import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type { ConsultantTypeItem } from "@/features/consultant/types/consultantType";

export interface GetConsultantTypesParams {
  search?: string;
}

export async function getConsultantTypesAPIAction(
  params: GetConsultantTypesParams = {},
): Promise<ActionResult<ConsultantTypeItem[]>> {
  try {
    const queryParams = params.search ? `?search=${encodeURIComponent(params.search)}` : "";
    const response = await axiosInstance.get(`/api/v1/customers/consultation/types${queryParams}`);

    return {
      success: true,
      data: response.data?.data || [],
      error: null,
    };
  } catch (error) {
    const e = error as ApiError;
    return {
      success: false,
      data: null,
      error: e.response?.data?.message || "Failed to load consultant types",
    };
  }
}
