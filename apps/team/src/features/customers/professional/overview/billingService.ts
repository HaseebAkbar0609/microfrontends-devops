import axios from "@/lib/axiosInstance";

const ROOT = "/api/v1/teams/billing";
export const MAX_LICENSE_QUANTITY = 10000;
export type Price = { id: string; interval: string; price: number; is_active: boolean };
export type Plan = { id: string; plan_key: string; is_license: boolean; prices: Price[] };
export type Invoice = { id: string; number: string | null; currency: string; amount_due: number; hosted_invoice_url: string | null };
export type Selection = { subscription_plan_id: string; subscription_plan_price_id: string; quantity: number };
export type InvoiceRequest = { start_date: string; items: Selection[] };
export type BillingOrder = { id: string; status: string; amount: number; currency: string; request: InvoiceRequest };
export type Billing = { company_name: string; payer_email: string; needs_activation: boolean; orders: BillingOrder[]; invoices: Invoice[] };
export type Override = { id: string; reason: string; expires_at: number; created_by: string; revoked_at: number | null };

export const getBilling = async (id: string) => (await axios.get<{ data: Billing }>(`${ROOT}/${id}`)).data.data;
export const getCatalog = async () => (await axios.get<{ data: Plan[] }>(`${ROOT}/catalog`)).data.data;
export const sendInvoice = (id: string, body: InvoiceRequest) => axios.post(`${ROOT}/${id}/invoice`, body);
export const sendActivation = (id: string) => axios.post(`${ROOT}/${id}/activation`);
export const getOverrides = async (id: string) => (await axios.get<{ data: Override[] }>(`/api/v1/teams/subscription-overrides/${id}`)).data.data;
export const grantOverride = (id: string, reason: string, expires_at: number) => axios.post("/api/v1/teams/subscription-overrides", { company_id: id, reason, expires_at });
export const revokeOverride = (id: string) => axios.post(`/api/v1/teams/subscription-overrides/${id}/revoke`);
export const money = (amount: number, currency = "SEK") => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount / 100);
export const today = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(new Date());
