import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

const QUOTE_MANAGEMENT = "/professionals/quotes/quote-management";
export const COMMISSIONS_PATH = "/module/business/offer/commissions";
export const COMMISSIONS_QUERY_KEY = "offer-commissions";

export interface CommissionSummary {
  id: string;
  project_id: string;
  quote_id: string;
  company_id: string;
  amount: number | string;
  currency: string;
  payment_status: string;
  failure_code: string | null;
  can_recover: boolean;
}

export interface AcceptancePreview {
  amount: number | string;
  currency: string;
  percentage: number;
  fixed_fee_sek: number;
  already_recorded: boolean;
}

export interface AcceptanceResult {
  mapping_id: string;
  professional_status: string;
  quote_status: string;
  commission: CommissionSummary;
}

function selection(projectId: string, quoteId: string) {
  if (!projectId || !quoteId) throw new Error("OFFER_IDENTIFIER_MISSING");
  return { project_id: projectId, quote_id: quoteId };
}

export async function previewOfferAcceptance(projectId: string, quoteId: string) {
  const response = await axiosInstance.post<ApiResponse<AcceptancePreview>>(
    `${QUOTE_MANAGEMENT}/accept/preview`, selection(projectId, quoteId),
  );
  if (!response.data.data) throw new Error("OFFER_PREVIEW_UNAVAILABLE");
  return response.data.data;
}

export async function acceptOffer(projectId: string, quoteId: string) {
  const response = await axiosInstance.post<ApiResponse<AcceptanceResult>>(
    `${QUOTE_MANAGEMENT}/accept`, selection(projectId, quoteId),
  );
  if (!response.data.data?.commission) throw new Error("OFFER_ACCEPTANCE_UNCONFIRMED");
  return response.data.data;
}

export async function listCommissions(companyId: string) {
  if (!companyId) throw new Error("COMPANY_REQUIRED");
  const response = await axiosInstance.get<ApiResponse<{ items: CommissionSummary[] }>>(
    `${QUOTE_MANAGEMENT}/commissions`, { headers: { "X-Company-ID": companyId } },
  );
  if (!Array.isArray(response.data.data?.items)) throw new Error("COMMISSION_LIST_UNAVAILABLE");
  return response.data.data.items;
}

export async function recoverCommission(id: string) {
  if (!id) throw new Error("COMMISSION_REQUIRED");
  const response = await axiosInstance.post<ApiResponse<{
    commission: CommissionSummary; client_secret: string | null;
  }>>(`${QUOTE_MANAGEMENT}/commissions/${encodeURIComponent(id)}/recover`);
  if (!response.data.data?.commission) throw new Error("COMMISSION_UNCONFIRMED");
  return response.data.data;
}

export async function restoreOffer(mappingId: string) {
  if (!mappingId) throw new Error("OFFER_IDENTIFIER_MISSING");
  await axiosInstance.post(`/professionals/quotes/quote-listing/offer/${encodeURIComponent(mappingId)}/restore`);
}
