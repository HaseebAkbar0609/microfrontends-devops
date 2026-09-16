import type { AdminUser, AdminUserAction, AdminUsersParams, AdminUserStatus } from "../types/adminUsers.types";
import { ADMIN_USERS_PAGE_SIZE } from "../constants/adminUsers.constants";

export function listParams(page: number, filters: Omit<AdminUsersParams, "skip" | "limit">): AdminUsersParams {
  return { ...filters, search: filters.search?.trim() || undefined, skip: (page - 1) * ADMIN_USERS_PAGE_SIZE, limit: ADMIN_USERS_PAGE_SIZE };
}

export function allowedUserActions(user: Pick<AdminUser, "status" | "available_actions" | "pending_email">): AdminUserAction[] {
  const lifecycle: Record<AdminUserStatus, AdminUserAction[]> = {
    active: ["edit", "deactivate", "delete"], inactive: ["edit", "activate", "delete"],
    deactivated: ["edit", "activate", "delete"],
    pending: ["edit", "resend", "delete"], invited: ["edit", "resend", "delete"],
  };
  return (user.available_actions ?? []).filter((action) => lifecycle[user.status]?.includes(action) || (action === "resend" && user.status === "active" && !!user.pending_email));
}

export function formatAdminDate(value: string | number | null | undefined, locale: string): string {
  if (value == null) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString(locale === "swe" ? "sv" : locale);
}
