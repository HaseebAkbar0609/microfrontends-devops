"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Plus, Search, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { useAdminUsers, useDeleteAdminUser, useAdminGroups, useActivateAdminUser, useDeactivateAdminUser, useResendInvitation, useAdminAccessOptions } from "./hooks/useAdminUsers";
import type { AdminOption, AdminUser, AdminUserAction, AdminUserRole, AdminUserSort, AdminUserStatus } from "./types/adminUsers.types";
import { ADMIN_OPTIONS_PAGE_SIZE, ADMIN_SEARCH_DELAY_MS } from "./constants/adminUsers.constants";
import { allowedUserActions, listParams } from "./utils/adminUserTable";
import { adminErrorMessage } from "./utils/adminUserErrors";
import { AdminUsersTable, adminStatusLabels } from "./components/AdminUsersTable";
import { AdminQueryState } from "./components/AdminQueryState";

export function AdminUsersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [role, setRole] = useState<AdminUserRole | "all">("all");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState<AdminUserStatus | "all">("all");
  const [sortBy, setSortBy] = useState<AdminUserSort>("first_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => { setQuerySearch(search); setPage(1); }, ADMIN_SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search]);
  const query = useAdminUsers(listParams(page, { search: querySearch, role: role === "all" ? undefined : role, department: department === "all" ? undefined : department, status: status === "all" ? undefined : status, sort_by: sortBy, sort_dir: sortDir }));
  const groups = useAdminGroups({ skip: 0, limit: ADMIN_OPTIONS_PAGE_SIZE });
  const access = useAdminAccessOptions();
  const remove = useDeleteAdminUser();
  const activate = useActivateAdminUser();
  const deactivate = useDeactivateAdminUser();
  const resend = useResendInvitation();
  const pending = remove.isPending || activate.isPending || deactivate.isPending || resend.isPending;
  const pages = query.data?.total_pages ?? 0;

  useEffect(() => {
    if (query.data && !query.isFetching && page > Math.max(1, query.data.total_pages)) setPage(Math.max(1, query.data.total_pages));
  }, [query.data, query.isFetching, page]);

  function handleSort(field: AdminUserSort) {
    setSortDir(sortBy === field && sortDir === "asc" ? "desc" : "asc");
    setSortBy(field);
    setPage(1);
  }

  async function handleAction(user: AdminUser, action: AdminUserAction) {
    if (pending || !allowedUserActions(user).includes(action)) return;
    const confirmation = action === "delete" ? localizationConstants.confirmDeleteUser : action === "deactivate" ? localizationConstants.adminConfirmDeactivate : action === "resend" ? localizationConstants.adminConfirmResend : null;
    if (confirmation && !window.confirm(t(confirmation))) return;
    setActionError(null);
    try {
      if (action === "delete") await remove.mutateAsync(user.id);
      if (action === "activate") await activate.mutateAsync(user.id);
      if (action === "deactivate") await deactivate.mutateAsync(user.id);
      if (action === "resend") await resend.mutateAsync(user.id);
      toast.success(t(action === "resend" ? localizationConstants.adminInvitationQueued : localizationConstants.adminActionSuccess));
    } catch (error) {
      setActionError(adminErrorMessage(error));
    }
  }

  const filters = [
    { label: localizationConstants.filterByAccess, value: role, setValue: (value: string) => setRole(value as AdminUserRole | "all"), options: [
      { value: "all", label: t(localizationConstants.filterAllRoles) }, { value: "owner", label: t(localizationConstants.roleSysAdmin) }, { value: "manage", label: t(localizationConstants.roleAdmin) }, { value: "worker", label: t(localizationConstants.roleUser) },
    ] },
    { label: localizationConstants.filterByDepartment, value: department, setValue: setDepartment, options: [
      { value: "all", label: t(localizationConstants.filterAllDepartments) }, ...((groups.data?.data ?? []) as AdminOption[]).map((group) => ({ value: group.id, label: group.name })),
    ] },
    { label: localizationConstants.filterByStatus, value: status, setValue: (value: string) => setStatus(value as AdminUserStatus | "all"), options: [
      { value: "all", label: t(localizationConstants.filterAllStatuses) }, ...Object.entries(adminStatusLabels).map(([value, label]) => ({ value, label: t(label) })),
    ] },
  ];

  return (
    <div className="flex h-full min-w-0 flex-col">
      <PageHeader title={t(localizationConstants.adminUsers)} breadcrumbs={[{ label: t(localizationConstants.breadcrumbHome), href: "/home" }, { label: t(localizationConstants.adminUsers) }]} />
      <div className="flex min-w-0 flex-col gap-6 px-4 pt-6 pb-8 sm:px-8">
        <div className="min-w-0 overflow-hidden rounded-lg border border-[#E5E5E5] bg-white" aria-busy={query.isFetching}>
          <div className="flex min-h-14 flex-col justify-between gap-4 border-b border-[#E4E4E7] bg-slate-200 px-4 py-3 sm:flex-row sm:items-center">
            <h2 className="text-base font-medium text-[#09090B]">{t(localizationConstants.adminUsersListTitle)}</h2>
            {!!access.data?.allowed_roles?.length && <Button asChild className="h-9 gap-2 bg-[#18181B] px-4 text-sm text-white hover:bg-[#18181B]/90"><Link href="/admin/users/add-user"><Plus className="h-4 w-4" />{t(localizationConstants.addUser)}</Link></Button>}
          </div>
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3 xl:flex-row xl:items-center">
            <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input aria-label={t(localizationConstants.searchUsersPlaceholder)} placeholder={t(localizationConstants.searchUsersPlaceholder)} value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 border-slate-200 bg-white pl-9 text-sm" /></div>
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => <Select key={filter.label} value={filter.value} onValueChange={(value) => { filter.setValue(value); setPage(1); }}><SelectTrigger aria-label={t(filter.label)} className="h-9 w-40 max-w-full border-slate-200 bg-white text-xs"><SelectValue /></SelectTrigger><SelectContent>{filter.options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>)}
              <Button type="button" size="icon" variant="outline" className="h-9 w-9" title={t(localizationConstants.adminRetry)} aria-label={t(localizationConstants.adminRetry)} disabled={query.isFetching} onClick={() => void query.refetch()}><RotateCw className="h-4 w-4" /></Button>
            </div>
          </div>
          {groups.isError && <AdminQueryState error={localizationConstants.adminOptionsLoadError} onRetry={() => void groups.refetch()} />}
          {actionError && <AdminQueryState error={actionError} />}
          <AdminUsersTable users={query.data?.data ?? []} loading={query.isPending} error={query.isError} sortBy={sortBy} sortDir={sortDir} pending={pending} onSort={handleSort} onAction={(user, action) => void handleAction(user, action)} onRetry={() => void query.refetch()} />
          {!query.isError && query.data && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <span className="text-sm text-slate-600" role="status">{t(localizationConstants.adminPagination, { page: pages ? query.data.current_page : 0, pages, total: query.data.total_items })}</span>
            <div className="flex gap-2">
              <Button type="button" size="icon" variant="outline" aria-label={t(localizationConstants.adminPreviousPage)} title={t(localizationConstants.adminPreviousPage)} disabled={query.isFetching || page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button type="button" size="icon" variant="outline" aria-label={t(localizationConstants.adminNextPage)} title={t(localizationConstants.adminNextPage)} disabled={query.isFetching || page >= pages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}
