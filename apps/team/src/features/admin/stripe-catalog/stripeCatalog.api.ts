import axiosInstance from "@/lib/axiosInstance";

export type CatalogStatus = "ready" | "unchanged" | "free" | "missing_product" | "ambiguous_product" | "missing_price" | "ambiguous_price";
export interface CatalogRow {
  plan_id: string; price_id: string; plan_key: string; interval: string; amount: number;
  old_product_id: string | null; old_price_id: string | null;
  new_product_id: string | null; new_price_id: string | null; status: CatalogStatus;
}
export interface CatalogPreview {
  account_id: string; livemode: boolean; rows: CatalogRow[];
  fingerprint: string; blocked: boolean; changes: number;
}
const CATALOG_API = "/api/v1/teams/stripe-catalog";
export const catalogCapabilityKey = ["stripe-catalog-capabilities"] as const;
export async function getCatalogCapability() {
  const result = await axiosInstance.get<{ data: { can_sync: boolean } }>(`${CATALOG_API}/capabilities`);
  return result.data.data;
}
export async function previewCatalog() {
  const result = await axiosInstance.get<{ data: CatalogPreview }>(`${CATALOG_API}/preview`);
  return result.data.data;
}
export async function syncCatalog(fingerprint: string) {
  const result = await axiosInstance.post<{ data: { updated_prices: number } }>(`${CATALOG_API}/sync`, { fingerprint });
  return result.data.data;
}
