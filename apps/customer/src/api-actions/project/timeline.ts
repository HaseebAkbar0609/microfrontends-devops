import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { API_PATH } from "@/constants/api";
import { handleApiError } from "@/utils/apiError";

export interface ApiTimelineTaskItem {
  id: string;
  name?: string;
  title?: string;
  startDate: string | number;
  endDate: string | number;
  color?: string;
  parentId?: string;
}

export interface ApiTimelineProjectItem {
  id: string;
  title: string;
  estimatedDays?: number;
  lastUpdated?: string;
  tasks?: ApiTimelineTaskItem[];
}

export async function getProjectTimelinesAPIAction(projectId: string): Promise<ActionResult<ApiTimelineProjectItem[]>> {
  try {
    const url = API_PATH.PROJECT.timelines(projectId);
    const { data } = await axiosInstance.get(url);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch project timelines");
  }
}
