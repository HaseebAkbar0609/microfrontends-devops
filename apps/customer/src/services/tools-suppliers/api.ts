import { getSupplierOrToolByIdAPIAction } from "@/api-actions";

export async function fetchSupplierOrToolDetail(id: string) {
  return getSupplierOrToolByIdAPIAction(id);
}
