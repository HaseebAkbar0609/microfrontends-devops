import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/axiosInstance";
import { useAuthStatus } from "@/context/AuthContext";

export type Params = Record<string, string | number | undefined>;
export type Result<T> = { data: T; total_items?: number; total_pages?: number };
export type Option = { id: string; name?: string; display_name?: string; email?: string };
export type AdminUser = Option & {
  first_name: string; last_name: string; role: string; status: string;
  groups: Option[]; department_id?: string; department?: string; position_id?: string;
  permission_role_id?: string; permission_role_name?: string; position?: string;
  available_actions: string[]; editable_fields: string[]; allowed_roles: string[];
  phone_number?: string; personal_id?: string; user_credentials?: string;
  language_preference?: string; sms_authentication?: boolean; auto_logout?: number;
  pending_email?: string; module_permissions?: Record<string, boolean>;
  license?: string; created_at?: string; last_login?: string;
};
export type Group = Option & {
  name: string; description?: string; status: string; parent_group_id?: string;
  member_count: number; users: Option[]; members_truncated?: boolean;
  module_permissions: Record<string, boolean>;
};
export const ADMIN_KEY = ["professional-admin-live"];
export { ADMIN_PAGE_SIZE, OPTION_PAGE_SIZE } from "./admin.constants";
const ROOT = "/professionals/admin/";

export async function read<T>(path: string, params?: Params): Promise<Result<T>> {
  return (await client.get(ROOT + path, { params })).data;
}
export function useAdminQuery<T>(path: string, params?: Params, enabled = true) {
  const { company, user, isAuthenticated } = useAuthStatus();
  const actorId = user && typeof user === "object" && "id" in user ? user.id : null;
  return useQuery({ queryKey: [...ADMIN_KEY, company?.id, actorId, path, params], queryFn: () => read<T>(path, params), enabled: enabled && !!company?.id && isAuthenticated, retry: false });
}
export function useAdminWrite() {
  const cache = useQueryClient();
  return async <T,>(method: "post" | "patch" | "delete", path: string, data?: unknown): Promise<T> => {
    const response = await client.request<Result<T>>({ method, url: ROOT + path, data });
    await cache.invalidateQueries({ queryKey: ADMIN_KEY });
    return response.data.data;
  };
}
export function fieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error)) return {};
  const details = error.response?.data?.details;
  if (!Array.isArray(details)) return {};
  return Object.fromEntries(details.map((item: { field?: string; loc?: string[]; msg?: string }) =>
    [item.field ?? item.loc?.at(-1) ?? "form", item.msg ?? ""]));
}
export function errorKey(error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  return status === 403 ? "proAdminForbidden" : status === 404 ? "proAdminNotFound" :
    status === 409 ? "proAdminConflict" : status === 422 ? "proAdminInvalid" : "proAdminError";
}
export const optionLabel = (option: Option) => option.name || option.display_name || option.email || option.id;
