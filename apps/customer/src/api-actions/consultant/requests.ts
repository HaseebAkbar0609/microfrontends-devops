import type { ActionResult } from "@/types/api";
import type { ConsultantRequest } from "@/features/consultant/types/consultantRequest";
import { DUMMY_CONSULTANT_REQUESTS } from "@/features/consultant/constants/directory";

export interface GetConsultantRequestsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  consultant?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ConsultantRequestsPayload {
  requests: ConsultantRequest[];
  totalItems: number;
}

interface RequestItem {
  id: string;
  project_id?: string;
  applications_count?: number;
  created_at: number;
  selected_options?: { project?: string; consultant_type_id?: string };
}

export async function getConsultantRequestsAPIAction(
  params: GetConsultantRequestsParams = {},
): Promise<ActionResult<ConsultantRequestsPayload>> {
  const {
    page = 1,
    pageSize = 10,
    search,
    consultant,
    sortBy,
    sortOrder = "asc",
  } = params;

  try {
    let rows = [...DUMMY_CONSULTANT_REQUESTS];

    const q = search?.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.project.toLowerCase().includes(q) ||
          r.consultant.toLowerCase().includes(q),
      );
    }

    if (consultant) {
      rows = rows.filter((r) => r.consultant === consultant);
    }

    const dir = sortOrder === "desc" ? -1 : 1;
    if (sortBy === "project" || sortBy === "consultant") {
      rows.sort((a, b) => a[sortBy].localeCompare(b[sortBy]) * dir);
    } else if (sortBy === "applications") {
      rows.sort((a, b) => (a.applications - b.applications) * dir);
    } else if (sortBy === "date") {
      rows.sort((a, b) => (a.date < b.date ? -1 : 1) * dir);
    } else {
      // Default: newest first.
      rows.sort((a, b) => (a.date < b.date ? 1 : -1));
    }

    const totalItems = rows.length;
    const start = (page - 1) * pageSize;
    const requests = rows.slice(start, start + pageSize);

    return { success: true, data: { requests, totalItems }, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to load requests",
    };
  }
}
