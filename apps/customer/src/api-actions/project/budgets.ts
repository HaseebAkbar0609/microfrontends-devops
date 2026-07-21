import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

import type { BudgetSection } from "@/features/projects/components/tabs/finance/types";

export interface ProjectBudget {
  id: string;
  projectName: string;
  date: string;
  totalAmount?: number;
  sections?: BudgetSection[];
}

export async function getProjectBudgetsAPIAction(
  projectId: string,
): Promise<ActionResult<ProjectBudget[]>> {
  try {
    const { data } = await axiosInstance.get(
      `/api/v1/project/${projectId}/budgets`,
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch project budgets");
  }
}

export async function saveProjectBudgetAPIAction(
  projectId: string,
  payload: Partial<ProjectBudget>,
): Promise<ActionResult<ProjectBudget>> {
  try {
    const { data } = await axiosInstance.post(
      `/api/v1/project/${projectId}/budgets`,
      payload,
    );
    return {
      success: true,
      data: data?.data ?? data,
      error: null,
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to save project budget");
  }
}
