import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { CalcOverviewItem, CalcOverviewStatus } from "../types/overview";

export type GetCalculationOverviewParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type GetCalculationOverviewResponse = {
  data: CalcOverviewItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ApiListEnvelope<T> = {
  success: boolean;
  data: T;
  total_items?: number;
  current_page?: number;
  page_size?: number;
  total_pages?: number;
};

export const mapCalculationOverviewFromApi = (
  item: Record<string, unknown>,
): CalcOverviewItem => ({
  id: String(item.id ?? ""),
  currency: typeof item.currency === "string" && /^[A-Z]{3}$/.test(item.currency) ? item.currency : undefined,
  calcNo: String(item.calc_no ?? item.calcNo ?? item.code ?? ""),
  projectName: String(item.project_name ?? item.projectName ?? item.title ?? ""),
  connection: String(item.connection ?? item.order_no ?? ""),
  client: String(item.client ?? item.customer_name ?? item.customer ?? ""),
  offertDatum: String(item.offert_datum ?? item.offertDatum ?? item.created_at ?? ""),
  typ: String(item.typ ?? item.type ?? ""),
  offertSumma: item.offert_summa == null && item.offertSumma == null && item.total_amount == null
    ? null : Number(item.offert_summa ?? item.offertSumma ?? item.total_amount),
  kategori: String(item.kategori ?? item.category ?? ""),
  status: (item.status as CalcOverviewStatus) ?? "not_started",
});

export async function getCalculationOverviewListAPIAction(
  params?: GetCalculationOverviewParams,
  companyId?: string,
  signal?: AbortSignal,
): Promise<GetCalculationOverviewResponse> {
  const queryParams: Record<string, string | number> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.search) queryParams.search = params.search;
  if (params?.status && params.status !== "all") queryParams.status = params.status;
  if (params?.sortBy) queryParams.sort_by = params.sortBy;
  if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

  const res = await axiosInstance.get<ApiListEnvelope<Record<string, unknown>[]>>(
    API_PATH.CALCULATIONS.LIST,
    { params: queryParams, headers: companyId ? { "X-Company-ID": companyId } : undefined, signal },
  );

  if (!res.data?.success || !Array.isArray(res.data.data)) throw new Error("CALCULATION_LIST_INVALID");
  const items = res.data.data;
  const total = res.data?.total_items ?? items.length;
  const limit = res.data?.page_size ?? params?.limit ?? 10;
  const page = res.data?.current_page ?? params?.page ?? 1;

  return {
    data: items.map(mapCalculationOverviewFromApi),
    total,
    page,
    limit,
    totalPages: res.data?.total_pages ?? (Math.ceil(total / limit) || 1),
  };
}

export async function archiveCalculationAPIAction(id: string): Promise<boolean> {
  try {
    await axiosInstance.post(API_PATH.CALCULATIONS.ARCHIVE(id));
    return true;
  } catch {
    return false;
  }
}

export async function deleteCalculationAPIAction(id: string): Promise<boolean> {
  try {
    await axiosInstance.delete(API_PATH.CALCULATIONS.DELETE(id));
    return true;
  } catch {
    return false;
  }
}
