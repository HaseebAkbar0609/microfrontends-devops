"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ShieldUser, UserCog, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import type { AdminUser, AdminUserAction, AdminUserSort } from "../types/adminUsers.types";
import { formatAdminDate } from "../utils/adminUserTable";
import { AdminUserActions } from "./AdminUserActions";
import { AdminQueryState } from "./AdminQueryState";

export const adminStatusLabels = {
  active: localizationConstants.statusActive, inactive: localizationConstants.adminStatusInactive,
  deactivated: localizationConstants.adminStatusDeactivated, pending: localizationConstants.adminStatusPending,
  invited: localizationConstants.adminStatusInvited,
};

interface Props {
  users: AdminUser[];
  loading: boolean;
  error: boolean;
  sortBy: AdminUserSort;
  sortDir: "asc" | "desc";
  pending: boolean;
  onSort: (sort: AdminUserSort) => void;
  onAction: (user: AdminUser, action: AdminUserAction) => void;
  onRetry: () => void;
}

export function AdminUsersTable({ users, loading, error, sortBy, sortDir, pending, onSort, onAction, onRetry }: Props) {
  const { t, i18n } = useTranslation();
  const columns: { label: string; sort?: AdminUserSort }[] = [
    { label: localizationConstants.nameLabel, sort: "first_name" },
    { label: localizationConstants.personalNumberLabel },
    { label: localizationConstants.adminAccessCol, sort: "role" },
    { label: localizationConstants.adminGroupCol, sort: "department" },
    { label: localizationConstants.roleLabel },
    { label: localizationConstants.statusLabel, sort: "status" },
    { label: localizationConstants.userDetailsLastLogin, sort: "last_login" },
  ];
  return (
    <Table>
      <TableHeader><TableRow className="border-slate-200 hover:bg-transparent">
        {columns.map(({ label, sort }) => <TableHead key={label} className="px-4 py-3 text-sm font-medium text-slate-500" aria-sort={sort && sort === sortBy ? sortDir === "asc" ? "ascending" : "descending" : undefined}>
          {sort ? <button type="button" onClick={() => onSort(sort)} className="flex items-center gap-1.5 text-slate-700">{t(label)}{sort !== sortBy ? <ArrowUpDown className="h-3.5 w-3.5" /> : sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}</button> : t(label)}
        </TableHead>)}
        <TableHead className="px-4 py-3 text-right">{t(localizationConstants.adminActionsCol)}</TableHead>
      </TableRow></TableHeader>
      <TableBody>
        {(loading || error || !users.length) && <TableRow><TableCell colSpan={columns.length + 1} className="h-32"><AdminQueryState loading={loading} error={error ? localizationConstants.adminUsersLoadError : undefined} empty={!loading && !error ? localizationConstants.adminNoUsersFound : undefined} onRetry={onRetry} /></TableCell></TableRow>}
        {!loading && !error && users.map((user) => {
          const Icon = user.role === "owner" ? ShieldUser : user.role === "manage" ? UserCog : Users;
          const roleLabel = user.role === "owner" ? localizationConstants.roleSysAdmin : user.role === "manage" ? localizationConstants.roleAdmin : localizationConstants.roleUser;
          return <TableRow key={user.id} className="border-slate-200 hover:bg-slate-50/70">
            <TableCell className="px-4 py-3.5"><div className="max-w-72 whitespace-normal break-words font-medium text-slate-900">{user.display_name || `${user.first_name} ${user.last_name}`.trim()}</div><div className="max-w-72 whitespace-normal break-words text-xs text-slate-400">{user.email}</div></TableCell>
            <TableCell className="px-4 py-3.5">{user.personal_id || t(localizationConstants.adminNone)}</TableCell>
            <TableCell className="px-4 py-3.5"><span className="inline-flex items-center gap-1.5 text-sm font-medium"><Icon className="h-3.5 w-3.5" />{t(roleLabel)}</span></TableCell>
            <TableCell className="max-w-48 whitespace-normal break-words px-4 py-3.5">{user.department || t(localizationConstants.adminNone)}</TableCell>
            <TableCell className="max-w-48 whitespace-normal break-words px-4 py-3.5">{user.permission_role_name || user.position || t(localizationConstants.adminNone)}</TableCell>
            <TableCell className="px-4 py-3.5"><span className={`inline-flex rounded-md px-2 py-1.5 text-xs font-medium ${user.status === "active" ? "bg-green-500 text-white" : user.status === "pending" || user.status === "invited" ? "bg-amber-100 text-amber-900" : "bg-red-500 text-white"}`}>{t(adminStatusLabels[user.status] ?? localizationConstants.adminStatusUnknown)}</span></TableCell>
            <TableCell className="px-4 py-3.5 text-sm">{formatAdminDate(user.last_login, i18n.language) || t(localizationConstants.adminNone)}</TableCell>
            <TableCell className="px-4 py-3.5 text-right"><AdminUserActions user={user} pending={pending} onAction={onAction} /></TableCell>
          </TableRow>;
        })}
      </TableBody>
    </Table>
  );
}
