import axiosInstance from "@/lib/axiosInstance";

export const QUOTE_API = "/professionals/quotes/quote-management";
export const QUOTE_CURRENCY = "SEK";
export const DEFAULT_QUOTE_TAX = 0;
export const MAX_QUOTE_FILE_BYTES = 10 * 1024 * 1024;
export type OfferVariant = "b2c" | "express" | "rent";
export type OfferDetails = {
  variant: OfferVariant; project_name: string; work_location: string; specifications: string;
  work: string; material: string; personnel: string; hourly_rate: number | null;
};
export type OfferMedia = { id?: string; media_id: string; type: "required" | "optional"; file_name?: string; file_url?: string };
export type SavedOffer = {
  id: string; project_id: string; professional_status: string; type: "overall" | "itemized_breakdown";
  total_quote_price: number; vat: number; rot_discount: number; is_tax_deducted: boolean;
  work_start_date: number | null; work_end_date: number | null; payment_terms: string | null;
  offer_details: OfferDetails | null; media: OfferMedia[]; items: { id?: string; description: string; amount: number }[];
};
export type OfferContext = {
  quote: SavedOffer | null;
  project: { id: string; project_name: string; project_address: string; project_description?: string; project_type: string };
  customer: { first_name?: string; last_name?: string; email?: string; phone?: string; address?: string };
  company: { name: string; email?: string; organization_number?: string; phone?: string; address?: string };
};
export type OfferFields = Omit<OfferDetails, "hourly_rate"> & {
  hourly_rate: string; total: string; start: string; end: string; payment_terms: string; rot: boolean;
};
export type OfferErrors = Partial<Record<keyof OfferFields, string>>;
export const isoDate = (value: number | null | undefined) => value ? new Date(value).toISOString().slice(0, 10) : "";
export function initialOfferFields(context: OfferContext, variant: OfferVariant): OfferFields {
  const q = context.quote;
  return {
    variant, project_name: context.project.project_name, work_location: context.project.project_address,
    specifications: context.project.project_description || "", work: "", material: "", personnel: "",
    ...q?.offer_details, hourly_rate: q?.offer_details?.hourly_rate?.toString() || "",
    total: q?.total_quote_price?.toString() || "", start: isoDate(q?.work_start_date), end: isoDate(q?.work_end_date),
    payment_terms: q?.payment_terms || "", rot: q?.is_tax_deducted || false,
  };
}
const validMoney = (value: string) => /^\d+(?:[.,]\d{1,2})?$/.test(value.trim()) && Number.isFinite(Number(value.replace(",", "."))) && Number(value.replace(",", ".")) > 0;
export function validateOffer(fields: OfferFields): OfferErrors {
  const errors: OfferErrors = {};
  if (!fields.project_name.trim() || fields.project_name.trim().length > 255) errors.project_name = "offerEditorNameRequired";
  if (!validMoney(fields.total)) errors.total = "offerEditorPositiveAmount";
  if (fields.variant === "rent" && !validMoney(fields.hourly_rate)) errors.hourly_rate = "offerEditorPositiveAmount";
  for (const key of ["start", "end"] as const) {
    if (fields[key] && (!/^\d{4}-\d{2}-\d{2}$/.test(fields[key]) || !Number.isFinite(Date.parse(fields[key])) || isoDate(Date.parse(fields[key])) !== fields[key])) errors[key] = "offerEditorInvalidDate";
  }
  if (fields.start && fields.end && fields.end < fields.start) errors.end = "offerEditorDateOrder";
  return errors;
}
export function buildOfferPayload(projectId: string, fields: OfferFields, media: OfferMedia[], send: boolean, existing?: SavedOffer | null) {
  if (!projectId || Object.keys(validateOffer(fields)).length) throw new Error("INVALID_OFFER_FORM");
  const { total, start, end, payment_terms, rot, hourly_rate, ...details } = fields;
  return {
    ...(existing?.id ? { id: existing.id } : {}), project_id: projectId,
    type: existing?.type || "overall", total_quote_price: Number(total.replace(",", ".")),
    vat: existing?.vat ?? DEFAULT_QUOTE_TAX, rot_discount: existing?.rot_discount ?? DEFAULT_QUOTE_TAX,
    is_tax_deducted: rot, payment_terms, work_start_date: start ? Date.parse(start) : null,
    work_end_date: end ? Date.parse(end) : null,
    offer_details: { ...details, project_name: details.project_name.trim(), hourly_rate: fields.variant === "rent" ? Number(hourly_rate.replace(",", ".")) : null },
    media: media.map(({ id, media_id, type }) => ({ ...(id ? { id } : {}), media_id, type })),
    items: existing?.items || [], send_quote: send,
  };
}
export async function loadOfferContext(projectId: string): Promise<OfferContext> {
  if (!projectId) throw new Error("PROJECT_REQUIRED");
  const response = await axiosInstance.get(`${QUOTE_API}/details`, { params: { project_id: projectId } });
  const data = response.data?.data as OfferContext;
  if (!data?.project?.id || data.project.id !== projectId) throw new Error("OFFER_CONTEXT_UNAVAILABLE");
  return data;
}
export async function saveOffer(payload: ReturnType<typeof buildOfferPayload>): Promise<SavedOffer> {
  const response = await axiosInstance.post(`${QUOTE_API}/create`, payload);
  const data = response.data?.data as SavedOffer;
  if (!data?.id || data.project_id !== payload.project_id) throw new Error("OFFER_SAVE_UNCONFIRMED");
  return data;
}
export async function uploadOfferFile(file: File): Promise<OfferMedia> {
  if (!/\.(png|jpe?g|pdf)$/i.test(file.name) || file.size <= 0 || file.size > MAX_QUOTE_FILE_BYTES) throw new Error("INVALID_OFFER_FILE");
  const form = new FormData(); form.append("file", file); form.append("media_type", "general");
  const response = await axiosInstance.post("/media/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
  if (!response.data?.data?.id) throw new Error("OFFER_UPLOAD_UNCONFIRMED");
  return { media_id: response.data.data.id, type: "required", file_name: file.name };
}
