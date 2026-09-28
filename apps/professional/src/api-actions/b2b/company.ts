import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import { CompanyDetail } from "@/features/b2b/types/company";

const B2B_COMPANY_PATH = "/professionals/b2b/companies";

/**
 * Fetch B2B Company Detail by ID (always the caller's own company).
 */
export async function getB2BCompanyDetailAction(
  companyId: string
): Promise<ActionResult<CompanyDetail>> {
  try {
    const response = await axiosInstance.get<ApiResponse<CompanyDetail>>(
      `${B2B_COMPANY_PATH}/${companyId}`
    );
    const data = response.data?.data ?? response.data;
    if (data && typeof data === "object" && "namn" in data) {
      return { success: true, data: data as CompanyDetail, error: null };
    }
    return { success: false, data: null, error: "Unexpected response from server" };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to load business information",
    };
  }
}

/**
 * Update B2B Company Detail
 */
export async function updateB2BCompanyDetailAction(
  companyId: string,
  payload: Partial<CompanyDetail>
): Promise<ActionResult<CompanyDetail>> {
  try {
    const response = await axiosInstance.put<ApiResponse<CompanyDetail>>(
      `${B2B_COMPANY_PATH}/${companyId}`,
      payload
    );
    const data = response.data?.data ?? response.data;
    if (data) {
      return { success: true, data: data as CompanyDetail, error: null };
    }
    return { success: false, data: null, error: "Unexpected response from server" };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to save business information",
    };
  }
}

/**
 * Verify B2B Company
 */
export async function verifyB2BCompanyAction(
  companyId: string
): Promise<ActionResult<{ success: boolean; status: "verified" }>> {
  try {
    await axiosInstance.post<ApiResponse<{ status: "verified" }>>(
      `${B2B_COMPANY_PATH}/${companyId}/verify`
    );
    return {
      success: true,
      data: { success: true, status: "verified" },
      error: null,
    };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || "Failed to verify business",
    };
  }
}
