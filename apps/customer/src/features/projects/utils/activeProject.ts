import type { ActiveProjectItem } from "@/api-actions/project/active";
import {
  PROJECT_LIST_PATH,
  resumeDraftPath,
} from "@/features/quote/constants";
import { normalizeProjectStatus } from "@/utils/statusNormalizer";
import type { ActiveProject, ApiQuoteItem } from "../types";

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

const FALLBACK_COMPANY_NAMES = [
  "Bygg & Co AB",
  "Nordic Renovation AB",
  "Sundsvall Bygg AB",
  "Fasad & Tak AB",
] as const;

function normalizeOptionalString(value?: string | null): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function buildStableFallbackCompanyName(seed?: string | null): string {
  const baseSeed = normalizeOptionalString(seed) ?? "";
  let hash = 0;

  for (let index = 0; index < baseSeed.length; index += 1) {
    hash = (hash << 5) - hash + baseSeed.charCodeAt(index);
    hash |= 0;
  }

  const fallbackIndex = Math.abs(hash) % FALLBACK_COMPANY_NAMES.length;
  return FALLBACK_COMPANY_NAMES[fallbackIndex];
}

export function resolveCompanyName(
  source: ActiveProjectCompanySource,
  seed?: string | null,
): string {
  const resolvedCompanyName =
    normalizeOptionalString(source.companyName) ??
    normalizeOptionalString(source.company?.name) ??
    normalizeOptionalString(source.primaryContact?.companyName) ??
    normalizeOptionalString(source.primaryContact?.name);

  return resolvedCompanyName ?? buildStableFallbackCompanyName(seed);
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
    companyName: resolveCompanyName(item, item.name),
    status: normStatus,
    statusLabel: item.statusLabel || item.status,
    orderNo: orderNo,
    quoteReferenceNo: "-",
    progressPercent: item.progressPercent ?? 0,
    updatedAt: item.updatedAt,
    category: "-",
  };
}

function mapListProjectToFrontend(q: ApiQuoteItem): ActiveProject {
  const projName =
    q.projectName || q.project_name || q.name || "Untitled Project";
  const rawId = q.project_id || q.id || "";
  const rawRef = q.refNo || q.ref_no || q.project_code || q.projectCode;
  const refCode =
    rawRef && rawRef !== "-"
      ? rawRef
      : rawId
        ? rawId.substring(0, 8).toUpperCase()
        : "-";
  const normStatus = normalizeProjectStatus(q.quote_status || q.status);
  const rawOrderNo = q.orderNo || q.order_no;
  const orderNo = rawOrderNo && rawOrderNo !== "-" ? rawOrderNo : "—";
  return {
    id: rawId,
    name: projName,
    referenceNo: refCode,
    clientNo: q.clientNo || q.client_no || "-",
    projectNo: refCode,
    startDate: "-",
    endDate: "-",
    contactPersonName: "-",
    mobileNumber: "-",
    email: "-",
    address: "-",
    postalCode: "-",
    companyName:
      q.companyName || q.company_name || resolveCompanyName({}, projName),
    status: normStatus,
    statusLabel: q.quote_status || q.status || "Active",
    orderNo: orderNo,
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
  listRows: ApiQuoteItem[],
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
