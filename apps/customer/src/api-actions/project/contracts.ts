import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface ProjectContract {
  id: string;
  name?: string;
  title?: string;
  file_url?: string;
  created_at?: string;
  contract_number?: string;
  [key: string]: unknown;
}

export async function getProjectContractsAPIAction(projectId: string): Promise<ActionResult<ProjectContract[]>> {
  try {
    const { data } = await axiosInstance.get(`/api/v1/project/${projectId}/contracts`);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch contracts");
  }
}

export async function saveProjectContractAPIAction(projectId: string, payload: unknown): Promise<ActionResult<ProjectContract>> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/project/${projectId}/contracts`, payload);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to save contract");
  }
}
