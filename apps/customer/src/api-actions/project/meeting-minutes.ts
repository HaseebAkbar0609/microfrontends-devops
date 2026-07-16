import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { API_PATH } from "@/constants/api";
import { handleApiError } from "@/utils/apiError";

export interface CreateMeetingMinutePayload {
  title: string;
  meeting_date: string | number;
  action_protocol_status: "good" | "moderate" | "bad";
  notes?: string;
}

export interface ApiMeetingMinuteItem {
  id: string;
  title: string;
  meeting_date: string | number;
  action_protocol_status?: "good" | "moderate" | "bad";
  notes?: string;
}

export async function getMeetingMinutesAPIAction(projectId: string): Promise<ActionResult<ApiMeetingMinuteItem[]>> {
  try {
    const url = API_PATH.PROJECT.meetingMinutes(projectId);
    const { data } = await axiosInstance.get(url);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch meeting minutes");
  }
}

export async function createMeetingMinuteAPIAction(
  projectId: string,
  payload: CreateMeetingMinutePayload
): Promise<ActionResult<ApiMeetingMinuteItem>> {
  try {
    const url = API_PATH.PROJECT.meetingMinutes(projectId);
    const { data } = await axiosInstance.post(url, payload);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create meeting minute");
  }
}

export async function deleteMeetingMinuteAPIAction(
  projectId: string,
  minuteId: string
): Promise<ActionResult<ApiMeetingMinuteItem>> {
  try {
    const url = API_PATH.PROJECT.meetingMinuteDetail(projectId, minuteId);
    const { data } = await axiosInstance.delete(url);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete meeting minute");
  }
}
