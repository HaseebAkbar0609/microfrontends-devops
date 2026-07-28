import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { GuideFolder } from "@/features/support/types";
import { API_PATH } from "@/constants/api";
import { handleApiError } from "@/utils/apiError";

export interface GuideFoldersData {
  folders: GuideFolder[];
}

export async function getGuideFoldersAPIAction(): Promise<ActionResult<GuideFoldersData>> {
  try {
    const { data: body } = await axiosInstance.get<{
      data: GuideFoldersData;
    }>(API_PATH.SUPPORT.GUIDE_FOLDERS);
    return { success: true, data: body.data, error: null };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to load guide folders");
  }
}
