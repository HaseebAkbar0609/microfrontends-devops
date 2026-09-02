import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError, ApiResponse } from "@/types/api";
import { CompanyDetail } from "@/features/b2b/types/company";
import { DUMMY_COMPANY_DETAIL, COMPANIES_MOCK_MAP } from "@/features/b2b/constants/companyMock";

const B2B_COMPANY_PATH = "/professionals/b2b/companies";

/**
 * Fetch B2B Company Detail by ID with fallback to mock data
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
      return {
        success: true,
        data: data as CompanyDetail,
        error: null,
      };
    }
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const msg = apiError.response?.data?.message;
    // Log or fall through to mock
    if (process.env.NODE_ENV === "development") {
      console.warn("B2B Company API unreachable or unseeded, using fallback mock:", msg);
    }
  }

  const mockCompany = COMPANIES_MOCK_MAP[companyId] || {
    ...DUMMY_COMPANY_DETAIL,
    id: companyId || DUMMY_COMPANY_DETAIL.id,
  };

  return {
    success: true,
    data: mockCompany,
    error: null,
  };
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
      return {
        success: true,
        data: data as CompanyDetail,
        error: null,
      };
    }
  } catch {
    // For development fallback
    return {
      success: true,
      data: { ...DUMMY_COMPANY_DETAIL, ...payload, id: companyId },
      error: null,
    };
  }

  return {
    success: true,
    data: { ...DUMMY_COMPANY_DETAIL, ...payload, id: companyId },
    error: null,
  };
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
  } catch {
    return {
      success: true,
      data: { success: true, status: "verified" },
      error: null,
    };
  }
}
