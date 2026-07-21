import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface ProjectPaymentPlanRow {
  id: string;
  date: string;
  paymentItem: string;
  description: string;
  amount: number;
  withheldFunds: number;
  rgt: number;
}

export interface ProjectPaymentPlan {
  id: string;
  idNo: string;
  designation: string;
  date: string;
  projectNo: string;
  status: "draft" | "pending" | "approved" | "declined";
  rows: ProjectPaymentPlanRow[];
}

export async function getProjectPaymentPlansAPIAction(
  projectId: string,
): Promise<ActionResult<ProjectPaymentPlan[]>> {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/project/${projectId}/payment-plans`,
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch project payment plans");
  }
}

export async function saveProjectPaymentPlanAPIAction(
  projectId: string,
  payload: Partial<ProjectPaymentPlan>,
): Promise<ActionResult<ProjectPaymentPlan>> {
  try {
    const { data } = await axiosInstance.post(
      `/api/v1/project/${projectId}/payment-plans`,
      payload,
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to save project payment plan");
  }
}

export async function updatePaymentPlanStatusAPIAction(
  projectId: string,
  planId: string,
  status: string,
  declineReason?: string,
): Promise<ActionResult<ProjectPaymentPlan>> {
  try {
    const { data } = await axiosInstance.patch(
      `/api/v1/project/${projectId}/payment-plans/${planId}/status`,
      { status, decline_reason: declineReason },
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to update payment plan status");
  }
}
