"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CircleUserRound, ChevronDown, ChevronUp, Users, Info } from "lucide-react";
import { FormSelect } from "@/components/form/FormSelect";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import localizationConstants from "@/utils/translation/constants";
import type { UserDetailsFormValues } from "@/schemas/admin/userDetails.schema";
import { useAdminGroups, useAdminRoleOptions, useAdminTypeOptions, useAdminModules } from "../hooks/useAdminUsers";
import type { AdminOption, AdminUserDetail } from "../types/adminUsers.types";
import { ADMIN_OPTIONS_PAGE_SIZE, ADMIN_OPTION_NONE } from "../constants/adminUsers.constants";
import { AdminQueryState } from "./AdminQueryState";
import { PermissionPanel } from "./UserPermissionPanel";
import { AdminUserPicker } from "./AdminUserPicker";
import { formatAdminDate } from "../utils/adminUserTable";
import { AdminAccessSelect } from "./AdminAccessSelect";

interface UserDetailsSectionProps {
  form: UseFormReturn<UserDetailsFormValues>;
  user: AdminUserDetail;
  showDetails: boolean;
  onToggleDetails: () => void;
}

export function UserDetailsSection({ form, user, showDetails, onToggleDetails }: UserDetailsSectionProps) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const groups = useAdminGroups({ skip: 0, limit: ADMIN_OPTIONS_PAGE_SIZE });
  const roles = useAdminRoleOptions();
  const types = useAdminTypeOptions();
  const modules = useAdminModules();
  const optionQueries = [groups, roles, types];
  const canEdit = (field: "department" | "permission_role_id" | "position_id" | "module_permissions") => user.editable_fields?.includes(field);
  const options = (data?: AdminOption[]) => [{ value: ADMIN_OPTION_NONE, label: t(localizationConstants.adminNone) }, ...(data ?? []).map((item) => ({ value: item.id, label: item.name }))];
  const overview = [
    [localizationConstants.nameLabel, user.display_name || `${user.first_name} ${user.last_name}`.trim()],
    [localizationConstants.addUserEmailLabel, user.email],
    [localizationConstants.userDetailsPhone, user.phone_number],
    [localizationConstants.userDetailsLastLogin, formatAdminDate(user.last_login, i18n.language)],
    [localizationConstants.userDetailsCreatedDate, formatAdminDate(user.created_at, i18n.language)],
  ];

  return (
    <>
      <AdminUserPicker user={user} dirty={form.formState.isDirty} showDetails={showDetails} onToggleDetails={onToggleDetails} />
      {showDetails && <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-4 hover:bg-slate-50/30">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Info className="h-5 w-5" />{t(localizationConstants.userDetailsUserInformation)}</span>
          {expanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
        </button>
        {expanded && <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-4 border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center">
            <CircleUserRound className="h-16 w-16 shrink-0 text-slate-400" />
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {overview.map(([label, value]) => <div key={label}><span className="block text-xs font-semibold text-slate-500">{t(label ?? "")}</span><span className="break-words text-sm text-slate-900">{value || t(localizationConstants.adminNone)}</span></div>)}
            </div>
            <AdminAccessSelect control={form.control} name="accessRole" currentRole={user.role} allowedRoles={user.allowed_roles ?? []} disabled={!user.editable_fields?.includes("role")} />
          </div>
          <AdminQueryState loading={optionQueries.some((query) => query.isPending)} error={optionQueries.some((query) => query.isError) ? localizationConstants.adminOptionsLoadError : undefined} onRetry={() => optionQueries.forEach((query) => void query.refetch())} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormSelect control={form.control} name="group" label={localizationConstants.userDetailsGroup} options={options(groups.data?.data)} disabled={groups.isPending || groups.isError || !canEdit("department")} leadingIcon={Users} triggerClassName="w-full border-slate-200" />
            <FormSelect control={form.control} name="role" label={localizationConstants.userDetailsRole} options={options(roles.data?.data)} disabled={roles.isPending || roles.isError || !canEdit("permission_role_id")} leadingIcon={CircleUserRound} triggerClassName="w-full border-slate-200" />
            <FormSelect control={form.control} name="type" label={localizationConstants.userDetailsType} options={options(types.data?.data)} disabled={types.isPending || types.isError || !canEdit("position_id")} triggerClassName="w-full border-slate-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormCheckbox control={form.control} name="reports" label={t(localizationConstants.userDetailsReports)} variant="secondary" disabled={!canEdit("module_permissions")} />
            <FormCheckbox control={form.control} name="registerImportant" label={t(localizationConstants.userDetailsRegisterImportant)} variant="secondary" disabled={!canEdit("module_permissions")} />
          </div>
          {typeof form.formState.errors.permissions?.message === "string" && <p role="alert" className="text-sm text-red-600">{t(form.formState.errors.permissions.message)}</p>}
          <hr className="my-2 border-t border-slate-200" />
          <div>
            <h3 className="mb-4 text-sm font-semibold text-slate-700">{t(localizationConstants.userDetailsPermissions)}</h3>
            <AdminQueryState loading={modules.isPending} error={modules.isError ? localizationConstants.adminOptionsLoadError : undefined} empty={!modules.isPending && !modules.isError && !modules.data?.data.length ? localizationConstants.adminOptionsEmpty : undefined} onRetry={() => void modules.refetch()} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {modules.data?.data.map((col) => <PermissionPanel key={col.category} col={col} form={form} disabled={!canEdit("module_permissions")} />)}
            </div>
          </div>
        </div>}
      </div>}
    </>
  );
}
