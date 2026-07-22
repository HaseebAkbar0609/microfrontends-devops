import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface ProjectInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: "paid" | "unpaid";
  amount?: number;
}

export async function getProjectInvoicesAPIAction(
  projectId: string,
): Promise<ActionResult<ProjectInvoice[]>> {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/project/${projectId}/invoices`,
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch project invoices");
  }
}
