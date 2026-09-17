import { resolveMyPagesMediaUrl } from "../../shared/media";
import client from "@/lib/axiosInstance";
import { MY_PAGES_ROOT, readMyPages, RecordPage, listRecords, useMyPagesQuery } from "../../shared/api";
import type { Absence, EmploymentDocument } from "../constants/data";

export const DOCUMENT_PAGE_SIZE = 20;
export function useEmploymentDocuments(kind: EmploymentDocument["kind"], page = 1, year?: number) {
  return useMyPagesQuery(["employment", kind, page, year], () =>
    readMyPages<RecordPage<EmploymentDocument>>("employment/documents", { kind, page, page_size: DOCUMENT_PAGE_SIZE, year }));
}
export function useAbsences() {
  return useMyPagesQuery(["absence"], () => listRecords<Absence>("absence"));
}
export async function openDocument(id: string): Promise<{ url: string; fileName: string }> {
  const result = (await client.post(`${MY_PAGES_ROOT}/employment/documents/${id}/open`)).data.data;
  return { ...result, url: resolveMyPagesMediaUrl(result.url) };
}
export async function acknowledgeDocument(id: string) {
  return (await client.post(`${MY_PAGES_ROOT}/employment/documents/${id}/acknowledge`)).data.data;
}
