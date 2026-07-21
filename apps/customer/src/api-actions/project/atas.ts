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

export interface SaveProjectATAPayload {
  title?: string;
  category?: string;
  reason?: string;
  quality_status?: string;
  economic_status?: string;
  total_cost?: number;
  ata_no?: string;
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
