import type { ActiveProjectItem } from "@/api-actions/project/active";
import {
  PROJECT_LIST_PATH,
  resumeDraftPath,
} from "@/features/quote/constants";
import { normalizeProjectStatus } from "@/utils/statusNormalizer";
import type { Quote } from "@/features/quote/types/types";
import type { ActiveProject } from "../types";

export interface ActiveProjectCompanySource {
  companyName?: string | null;
  company?: {
    name?: string | null;
  } | null;
  primaryContact?: {
    name?: string | null;
    companyName?: string | null;
  } | null;
}

function normalizeOptionalString(value?: string | null): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

/** The supplier name the API sent, or "-" when it sent none */
export function resolveCompanyName(source: ActiveProjectCompanySource): string {
  const resolvedCompanyName =
    normalizeOptionalString(source.companyName) ??
    normalizeOptionalString(source.company?.name) ??
    normalizeOptionalString(source.primaryContact?.companyName) ??
    normalizeOptionalString(source.primaryContact?.name);

  return resolvedCompanyName ?? "-";
}

export type ProjectSortKey =
  | "referenceNo"
  | "name"
  | "orderNo"
  | "quoteReferenceNo"
  | "companyName"
  | "status";

export type SortDirection = "asc" | "desc";

function mapActiveProjectToFrontend(item: ActiveProjectItem): ActiveProject {
  const normStatus = normalizeProjectStatus(item.status);
  const rawItem = item as unknown as Record<string, unknown>;
  const rawOrderNo = (rawItem.orderNo || rawItem.order_no) as
    | string
    | undefined;
  const orderNo = rawOrderNo && rawOrderNo !== "-" ? rawOrderNo : "—";
  return {
    id: item.id,
    name: item.name || "Untitled Project",
    referenceNo:
      item.projectCode ||
      (item.id ? item.id.substring(0, 8).toUpperCase() : "PROJ-1"),
    clientNo: "-",
    projectNo: item.projectCode || "-",
    startDate: item.startDate || "-",
    endDate: item.dueDate || "-",
    contactPersonName: item.primaryContact?.name || "-",
    mobileNumber: "-",
    email: "-",
    address: "-",
    postalCode: "-",
    companyName: resolveCompanyName(item),
    status: normStatus,
    statusLabel: item.statusLabel || item.status,
    orderNo: orderNo,
    quoteReferenceNo: "-",
    progressPercent: item.progressPercent ?? 0,
    updatedAt: item.updatedAt,
    category: "-",
  };
}

/** List rows are already mapped by mapProjectRowToQuote, which has no supplier or order number */
function mapListProjectToFrontend(q: Quote): ActiveProject {
  const refCode =
    q.refNo && q.refNo !== "-" ? q.refNo : q.id.substring(0, 8).toUpperCase();
  return {
    id: q.id,
    name: q.projectName,
    referenceNo: refCode,
    clientNo: "-",
    projectNo: refCode,
    startDate: "-",
    endDate: "-",
    contactPersonName: "-",
    mobileNumber: "-",
    email: "-",
    address: "-",
    postalCode: "-",
    companyName: "-",
    status: normalizeProjectStatus(q.quote_status),
    statusLabel: q.quote_status,
    orderNo: "—",
    quoteReferenceNo: refCode,
    progressPercent: 0,
    category: q.category || "-",
    creationMode: q.creation_mode,
    isCompleted: q.is_completed,
  };
}

/**
 * One row per project from the filtered list rows, de-duplicated by id.
 * /project/active returns every sent request, so it only enriches those rows.
 */
export function mergeProjectRows(
  listRows: Quote[],
  activeItems: ActiveProjectItem[],
): ActiveProject[] {
  const activeById = new Map<string, ActiveProject>();
  for (const item of activeItems) {
    const mapped = mapActiveProjectToFrontend(item);
    if (mapped.id) activeById.set(mapped.id, mapped);
  }

  const merged = new Map<string, ActiveProject>();
  for (const row of listRows) {
    const item = mapListProjectToFrontend(row);
    if (!item.id) continue;
    const existing = activeById.get(item.id);
    merged.set(
      item.id,
      existing
        ? {
            ...existing,
            clientNo:
              existing.clientNo !== "-" ? existing.clientNo : item.clientNo,
            quoteReferenceNo:
              existing.quoteReferenceNo !== "-"
                ? existing.quoteReferenceNo
                : item.quoteReferenceNo,
            category:
              existing.category !== "-" ? existing.category : item.category,
            creationMode: item.creationMode,
            isCompleted: item.isCompleted,
          }
        : item,
    );
  }
  return Array.from(merged.values());
}

/** Project codes (P-YYYY-NNNNNN) grow with creation, so referenceNo desc is newest first */
export function sortProjectRows(
  rows: ActiveProject[],
  key: ProjectSortKey,
  direction: SortDirection,
): ActiveProject[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...rows].sort(
    (a, b) =>
      sign *
      String(a[key] ?? "").localeCompare(String(b[key] ?? ""), undefined, {
        numeric: true,
      }),
  );
}

/** A draft opens the wizard to continue it; anything else opens the project */
export function projectHref(project: ActiveProject): string {
  return project.isCompleted === false
    ? resumeDraftPath(project.id)
    : `${PROJECT_LIST_PATH}/${project.id}`;
}
