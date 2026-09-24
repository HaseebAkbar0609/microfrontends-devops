"use client";

import { useTranslation } from "react-i18next";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormSelect } from "@/components/form/FormSelect";
import localizationConstants from "@/utils/translation/constants";
import type { AdminUserRole } from "../types/adminUsers.types";

export function AdminAccessSelect<T extends FieldValues>({ control, name, allowedRoles, currentRole, disabled }: { control: Control<T>; name: FieldPath<T>; allowedRoles: AdminUserRole[]; currentRole: AdminUserRole; disabled?: boolean }) {
  const { t } = useTranslation();
  const labels = { owner: localizationConstants.roleSysAdmin, manage: localizationConstants.roleAdmin, worker: localizationConstants.roleUser };
  return <FormSelect control={control} name={name} label={localizationConstants.adminAccessCol} disabled={disabled || !allowedRoles.length} options={[...new Set([currentRole, ...allowedRoles])].map((role) => ({ value: role, label: t(labels[role]) }))} triggerClassName="w-full border-slate-200" />;
}
