import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface KmaDoc {
  id: string;
  kma: string;
  date: string;
  documentName: string;
  fileType: string;
  media_id?: string | null;
}

export interface KmaFolder {
  id: string;
  name: string;
  count?: number;
  defaultOpen?: boolean;
  parentId?: string | null;
  children?: KmaFolder[];
}

export interface KmaControl {
  id: string;
  folderId?: string | null;
  subTab: string;
  viewType: string;
  kontroll: string;
  fileType?: string | null;
  lastUpdated: string;
  createdBy: string;
}

export interface SecureCheck {
  id: string;
  controlId?: string | null;
  nr: string;
  kontroll: string;
  source: string;
  datumKontroll: string;
  utfordAv: string;
  status: "completed" | "pending";
  fileType?: string | null;
  categoryPath?: string[] | null;
  tags?: string[] | null;
  owner?: string | null;
  registeredInfo?: {
    name?: string;
    date?: string;
    time?: string;
    control?: string;
    comment?: string;
  } | null;
}

export interface QualityDeviation {
  id: string;
  secureCheckId?: string | null;
  title: string;
  description?: string | null;
  status: string;
  reportedBy?: string | null;
  dateReported?: string | null;
  photos?: string[] | null;
}

// ─── Documents ──────────────────────────────────────────────────────────────

export async function getProjectQualityDocumentsAPIAction(
  projectId: string,
  params?: { kma?: string; file_type?: string; search?: string }
): Promise<ActionResult<KmaDoc[]>> {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/project/${projectId}/quality/documents`,
      { params }
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch quality documents");
  }
}

export async function createProjectQualityDocumentAPIAction(
  projectId: string,
  payload: { kma: string; documentName: string; fileType: string; media_id?: string }
): Promise<ActionResult<KmaDoc>> {
  try {
    const { data } = await axiosInstance.post(
      `/api/v1/project/${projectId}/quality/documents`,
      payload
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create quality document");
  }
}

export async function deleteProjectQualityDocumentAPIAction(
  projectId: string,
  documentId: string
): Promise<ActionResult<void>> {
  try {
    await axiosInstance.delete(
      `/api/v1/project/${projectId}/quality/documents/${documentId}`
    );
    return {
      success: true,
      data: undefined,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete quality document");
  }
}

// ─── Folders ────────────────────────────────────────────────────────────────

export async function getProjectQualityFoldersAPIAction(
  projectId: string,
  params?: { parent_id?: string; search?: string }
): Promise<ActionResult<KmaFolder[]>> {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/project/${projectId}/quality/folders`,
      { params }
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch quality folders");
  }
}

export async function createProjectQualityFolderAPIAction(
  projectId: string,
  payload: { name: string; parent_id?: string; default_open?: boolean }
): Promise<ActionResult<KmaFolder>> {
  try {
    const { data } = await axiosInstance.post(
      `/api/v1/project/${projectId}/quality/folders`,
      payload
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create quality folder");
  }
}

export async function deleteProjectQualityFolderAPIAction(
  projectId: string,
  folderId: string
): Promise<ActionResult<void>> {
  try {
    await axiosInstance.delete(
      `/api/v1/project/${projectId}/quality/folders/${folderId}`
    );
    return {
      success: true,
      data: undefined,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete quality folder");
  }
}

// ─── Controls ───────────────────────────────────────────────────────────────

export async function getProjectQualityControlsAPIAction(
  projectId: string,
  params?: {
    sub_tab?: string;
    view_type?: string;
    folder_id?: string;
    search?: string;
    created_by?: string;
  }
): Promise<ActionResult<KmaControl[]>> {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/project/${projectId}/quality/controls`,
      { params }
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch quality controls");
  }
}

export async function createProjectQualityControlAPIAction(
  projectId: string,
  payload: {
    sub_tab: string;
    view_type: string;
    kontroll: string;
    folder_id?: string;
    file_type?: string;
    created_by?: string;
  }
): Promise<ActionResult<KmaControl>> {
  try {
    const { data } = await axiosInstance.post(
      `/api/v1/project/${projectId}/quality/controls`,
      payload
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create quality control");
  }
}

export async function deleteProjectQualityControlAPIAction(
  projectId: string,
  controlId: string
): Promise<ActionResult<void>> {
  try {
    await axiosInstance.delete(
      `/api/v1/project/${projectId}/quality/controls/${controlId}`
    );
    return {
      success: true,
      data: undefined,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete quality control");
  }
}

// ─── Secure Checks ──────────────────────────────────────────────────────────

export async function getProjectSecureChecksAPIAction(
  projectId: string,
  params?: { control_id?: string; status?: string; search?: string }
): Promise<ActionResult<SecureCheck[]>> {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/project/${projectId}/quality/secure-checks`,
      { params }
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch secure checks");
  }
}

export async function updateSecureCheckStatusAPIAction(
  projectId: string,
  checkId: string,
  status: "completed" | "pending"
): Promise<ActionResult<SecureCheck>> {
  try {
    const { data } = await axiosInstance.patch(
      `/api/v1/project/${projectId}/quality/secure-checks/${checkId}/status`,
      { status }
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to update secure check status");
  }
}

export async function deleteProjectSecureCheckAPIAction(
  projectId: string,
  checkId: string
): Promise<ActionResult<void>> {
  try {
    await axiosInstance.delete(
      `/api/v1/project/${projectId}/quality/secure-checks/${checkId}`
    );
    return {
      success: true,
      data: undefined,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to delete secure check");
  }
}

// ─── Deviations ─────────────────────────────────────────────────────────────

export async function getProjectQualityDeviationsAPIAction(
  projectId: string,
  params?: { secure_check_id?: string; status?: string }
): Promise<ActionResult<QualityDeviation[]>> {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/project/${projectId}/quality/deviations`,
      { params }
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch quality deviations");
  }
}
