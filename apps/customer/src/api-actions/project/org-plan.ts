import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { API_PATH } from "@/constants/api";
import { handleApiError } from "@/utils/apiError";

export interface ApiOrgContactItem {
  id: string;
  name: string;
  phone: string;
  mail: string;
  role: string;
}

export interface ApiOrgCompanyItem {
  id: string;
  company: string;
  category: string;
  role: string;
  phone: string;
  mail: string;
  contacts: ApiOrgContactItem[];
}

export async function getProjectOrgPlanAPIAction(projectId: string): Promise<ActionResult<ApiOrgCompanyItem[]>> {
  try {
    const url = API_PATH.PROJECT.orgPlan(projectId);
    const { data } = await axiosInstance.get(url);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch project org plan");
  }
}
