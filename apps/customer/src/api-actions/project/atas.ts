import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface ProjectATA {
  id: string;
  ata_no?: string;
  created_at?: string;
  title?: string;
  reason?: string;
  quality_status?: string;
  total_cost?: number;
  economic_status?: string;
}

export async function getProjectATAsAPIAction(projectId: string): Promise<ActionResult<ProjectATA[]>> {
  try {
    const { data } = await axiosInstance.get(`/api/v1/project/${projectId}/atas`);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch ÄTA reports");
  }
}

export interface ProjectATAItemPayload {
  category?: string;
  item_date?: string;
  person_or_supplier?: string;
  resource_no?: string;
  description?: string;
  net_price?: number;
  amount?: number;
  quantity?: number;
  unit?: string;
  activity?: string;
  invoice_no?: string;
}

export interface SaveProjectATAPayload {
  title?: string;
  category?: string;
  reason?: string;
  quality_status?: string;
  economic_status?: string;
  total_cost?: number;
  ata_no?: string;
  items?: ProjectATAItemPayload[];
  description?: string;
  proposed_action?: string;
  action?: string;
  client_company_name?: string;
  client_contact_name?: string;
  client_address?: string;
  client_postal_code?: string;
  client_city?: string;
}

export async function saveProjectATAAPIAction(projectId: string, payload: SaveProjectATAPayload): Promise<ActionResult<ProjectATA>> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/project/${projectId}/atas`, payload);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to save ÄTA report");
  }
}

export interface ProjectATADetail extends ProjectATA {
  items?: ProjectATAItemPayload[];
  description?: string;
  proposed_action?: string;
  action?: string;
  client_company_name?: string;
  client_contact_name?: string;
  client_address?: string;
  client_postal_code?: string;
  client_city?: string;
  category?: string;
}

export async function getProjectATADetailAPIAction(ataId: string): Promise<ActionResult<ProjectATADetail>> {
  try {
    const { data } = await axiosInstance.get(`/api/v1/project/atas/${ataId}`);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch ÄTA detail");
  }
}

export async function updateProjectATAStatusAPIAction(
  ataId: string,
  status: string
): Promise<ActionResult<ProjectATA>> {
  try {
    const { data } = await axiosInstance.patch(`/api/v1/project/atas/${ataId}/status`, { status });
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to update ÄTA status");
  }
}
