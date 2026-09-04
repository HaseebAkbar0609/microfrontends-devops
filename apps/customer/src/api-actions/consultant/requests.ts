import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { ConsultantRequest } from "@/features/consultant/types/consultantRequest";

export interface RequestItem {
  id: string;
  project_id?: string | null;
  selected_options?: {
    project?: string | null;
    consultant_type_id?: string | null;
  } | null;
  applications_count?: number | null;
  created_at: string | number | Date;
}

export interface GetConsultantRequestsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  consultant?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ConsultantRequestsPayload {
  requests: ConsultantRequest[];
  totalItems: number;
}

export async function getConsultantRequestsAPIAction(
  params: GetConsultantRequestsParams = {},
): Promise<ActionResult<ConsultantRequestsPayload>> {
  const {
    page = 1,
    pageSize = 10,
    search,
    consultant,
    sortBy,
    sortOrder = "asc",
  } = params;

  try {
    const query = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) query.append("search", search);
    if (consultant) query.append("consultant", consultant);
    if (sortBy) query.append("sort_by", sortBy);
    if (sortOrder) query.append("sort_order", sortOrder);

    const response = await axiosInstance.get(
      `${API_PATH.CONSULTATION.LIST}?${query.toString()}`,
    );

    const data = response.data?.data || [];

    // Map backend response to frontend ConsultantRequest interface
    const requests: ConsultantRequest[] = (data as RequestItem[]).map((item) => ({
      id: item.id,
      project_id: item.project_id || "",
      project: item.selected_options?.project || "Unknown Project",
      applications: item.applications_count || 0,
      date: new Date(item.created_at).toISOString().split("T")[0],
      consultant: item.selected_options?.consultant_type_id || "Unknown",
      consultantType: (item.selected_options?.consultant_type_id || "architect") as ConsultantRequest["consultantType"],
    }));

    return { 
      success: true, 
      data: { 
        requests, 
        totalItems: response.data?.meta?.total_items || requests.length 
      }, 
      error: null 
    };
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      data: null,
      error: apiError.response?.data?.message || apiError.message || "Failed to load requests",
    };
  }
}
