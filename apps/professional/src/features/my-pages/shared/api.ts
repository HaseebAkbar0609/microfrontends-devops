import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStatus } from "@/context/AuthContext";
import client from "@/lib/axiosInstance";

export const MY_PAGES_ROOT = "/professionals/my-pages";
export const MY_PAGES_KEY = ["professional-my-pages"];
export const RECORD_PAGE_SIZE = 100;
export const MAX_RECORD_PAGES = 100;
export type RecordKind = "diary" | "time" | "ticket" | "protocol" | "note" | "absence";
export type RecordMeta = { id: string; version: number; canEdit: boolean; createdAt: number; updatedAt: number };
type Envelope<T> = RecordMeta & { kind: RecordKind; data: T };
export type RecordPage<T> = { items: T[]; total: number; page: number; pageSize: number };
export type QueryParams = Record<string, string | number | undefined>;
export type Participant = { id: string; name: string; handle: string };

const flatten = <T,>(record: Envelope<T>): T & RecordMeta => ({
  ...record.data, id: record.id, version: record.version, canEdit: record.canEdit,
  createdAt: record.createdAt, updatedAt: record.updatedAt,
});

export async function readMyPages<T>(path: string, params?: QueryParams): Promise<T> {
  return (await client.get(`${MY_PAGES_ROOT}/${path}`, { params })).data.data;
}

// Existing calendar/table screens share one filtered dataset. Traverse bounded API
// pages, never silently show only the first page as the complete history.
export async function listRecords<T>(kind: RecordKind, params?: QueryParams): Promise<(T & RecordMeta)[]> {
  const items: (T & RecordMeta)[] = [];
  for (let page = 1; page <= MAX_RECORD_PAGES; page += 1) {
    const result = await readMyPages<RecordPage<Envelope<T>>>("entries", {
      ...params, kind, page, page_size: RECORD_PAGE_SIZE,
    });
    items.push(...result.items.map(flatten));
    if (items.length >= result.total) return items;
    if (!result.items.length) break;
  }
  throw new Error("MY_PAGES_RANGE_TOO_LARGE");
}

export async function getRecord<T>(id: string): Promise<T & RecordMeta> {
  return flatten(await readMyPages<Envelope<T>>(`entries/${id}`));
}

export async function recordPage<T>(kind: RecordKind, params: QueryParams): Promise<RecordPage<T & RecordMeta>> {
  const page = await readMyPages<RecordPage<Envelope<T>>>("entries", { kind, ...params });
  return { ...page, items: page.items.map(flatten) };
}

export async function saveRecord<T>(kind: RecordKind, values: T, previous?: RecordMeta): Promise<T & RecordMeta> {
  const { id: _id, version: _version, canEdit: _canEdit, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = values as T & Partial<RecordMeta>;
  const response = await client.request<{ data: Envelope<T> }>({
    method: previous ? "put" : "post",
    url: `${MY_PAGES_ROOT}/entries${previous ? `/${previous.id}` : ""}`,
    params: previous ? { version: previous.version } : undefined,
    data: { kind, data },
  });
  return flatten(response.data.data);
}

export async function deleteRecord(record: RecordMeta) {
  await client.delete(`${MY_PAGES_ROOT}/entries/${record.id}`, { params: { version: record.version } });
}

export function useMyPagesQuery<T>(key: unknown[], queryFn: () => Promise<T>, enabled = true) {
  const { company, user, isAuthenticated } = useAuthStatus();
  const actorId = user && typeof user === "object" && "id" in user ? user.id : null;
  return useQuery({
    queryKey: [...MY_PAGES_KEY, company?.id, actorId, ...key], queryFn,
    enabled: enabled && !!company?.id && isAuthenticated, retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useMyPagesRefresh() {
  const cache = useQueryClient();
  return () => cache.invalidateQueries({ queryKey: MY_PAGES_KEY });
}

export function useParticipants() {
  return useMyPagesQuery(["participants"], () => readMyPages<Participant[]>("participants"));
}

export const today = () => {
  const value = new Date();
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};
