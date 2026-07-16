import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { API_PATH } from "@/constants/api";
import { handleApiError } from "@/utils/apiError";

export interface ApiProjectDocumentItem {
  id: string;
  name?: string;
  comment?: string;
  type?: string;
  date?: string;
  fileUrl?: string;
}

export async function getProjectDocumentsAPIAction(projectId: string): Promise<ActionResult<ApiProjectDocumentItem[]>> {
  try {
    const url = API_PATH.PROJECT.documents(projectId);
    const { data } = await axiosInstance.get(url);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch documents");
  }
}

export async function saveProjectDocumentAPIAction(
  projectId: string,
  mediaId: string,
  comment?: string,
): Promise<ActionResult<ApiProjectDocumentItem>> {
  try {
    const url = API_PATH.PROJECT.documents(projectId);
    const { data } = await axiosInstance.post(url, {
      media_id: mediaId,
      comment: comment || "",
    });
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to save document");
  }
}

export async function deleteProjectDocumentAPIAction(
  projectId: string,
  documentId: string,
): Promise<ActionResult<ApiProjectDocumentItem>> {
  try {
    const url = API_PATH.PROJECT.documentDetail(projectId, documentId);
    const { data } = await axiosInstance.delete(url);
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete document");
  }
}
