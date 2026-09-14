"use client";

import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { UserRound } from "lucide-react";

import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormSwitch } from "@/components/form/FormSwitch";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AddUserFormValues } from "@/schemas/admin/addUser.schema";
import { useAdminGroups, useAdminRoleOptions, useAdminAccessOptions } from "../hooks/useAdminUsers";
import { ADMIN_OPTIONS_PAGE_SIZE, ADMIN_OPTION_NONE } from "../constants/adminUsers.constants";
import { AdminQueryState } from "./AdminQueryState";
import { AdminAccessSelect } from "./AdminAccessSelect";
import type { AdminUserDetail, UpdateAdminUserRequest } from "../types/adminUsers.types";

interface UserInformationSectionProps {
  form: UseFormReturn<AddUserFormValues>;
  isEditMode?: boolean;
  user?: AdminUserDetail;
}

export function UserInformationSection({ form, isEditMode, user }: UserInformationSectionProps) {
  const { t } = useTranslation();
  const rolesQuery = useAdminRoleOptions();
  const groupsQuery = useAdminGroups({ skip: 0, limit: ADMIN_OPTIONS_PAGE_SIZE });
  const typesQuery = useAdminAccessOptions();
  const readonly = (field: keyof UpdateAdminUserRequest) => !!isEditMode && !user?.editable_fields?.includes(field);
  const rolesData = rolesQuery.data;
  const groupsData = groupsQuery.data;

  const noneOption = { value: ADMIN_OPTION_NONE, label: t(localizationConstants.adminNone) };
  const roleOptions = [noneOption, ...(rolesData?.data || []).map((r: { id: string; name: string }) => ({ value: r.id, label: r.name }))];
  const departmentOptions = [noneOption, ...(groupsData?.data || []).map((g: { id: string; name: string }) => ({ value: g.id, label: g.name }))];

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
        <UserRound className="h-5 w-5 text-slate-700" strokeWidth={2.2} />
        <span className="text-sm font-semibold text-slate-700">
          <Translate text={localizationConstants.addUserUserInformation} />
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <AdminQueryState loading={rolesQuery.isPending || groupsQuery.isPending} error={rolesQuery.isError || groupsQuery.isError ? localizationConstants.adminOptionsLoadError : undefined} onRetry={() => { void rolesQuery.refetch(); void groupsQuery.refetch(); }} />
        <AdminQueryState loading={typesQuery.isPending} error={typesQuery.isError ? localizationConstants.adminOptionsLoadError : undefined} onRetry={() => void typesQuery.refetch()} />
        <AdminAccessSelect control={form.control} name="accessRole" currentRole={form.watch("accessRole")} allowedRoles={user?.allowed_roles ?? typesQuery.data?.allowed_roles ?? []} disabled={readonly("role")} />
        {user?.pending_email && <p role="status" className="break-words text-sm text-amber-800">{t(localizationConstants.adminPendingEmail, { email: user.pending_email })}</p>}
        {/* Row 1: Credentials & Personal Number */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="userCredentials"
            disabled={readonly("user_credentials")}
            label={localizationConstants.addUserCredentialsLabel}
            placeholder={localizationConstants.addUserCredentialsPlaceholder}
            className="grid gap-1"
            inputProps={{ autoComplete: "off" }}
          />
          <FormInput
            control={form.control}
            name="personalNumber"
            disabled={readonly("personal_id")}
            label={localizationConstants.addUserPersonalNumberLabel}
            placeholder={localizationConstants.addUserPersonalNumberPlaceholder}
            className="grid gap-1"
          />
        </div>

        {/* Row 2: First Name & Last Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="firstName"
            disabled={readonly("first_name")}
            label={localizationConstants.addUserFirstNameLabel}
            placeholder={localizationConstants.addUserFirstNamePlaceholder}
            className="grid gap-1"
            inputProps={{ autoComplete: "given-name" }}
          />
          <FormInput
            control={form.control}
            name="lastName"
            disabled={readonly("last_name")}
            label={localizationConstants.addUserLastNameLabel}
            placeholder={localizationConstants.addUserLastNamePlaceholder}
            className="grid gap-1"
            inputProps={{ autoComplete: "family-name" }}
          />
        </div>

        {/* Password changes are not supported by the profile PATCH. */}
        {!isEditMode && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="password"
            label={localizationConstants.addUserPasswordLabel}
            placeholder={localizationConstants.addUserPasswordPlaceholder}
            type="password"
            className="grid gap-1"
            inputProps={{ autoComplete: "new-password" }}
          />
          <FormInput
            control={form.control}
            name="confirmPassword"
            label={localizationConstants.addUserConfirmPasswordLabel}
            placeholder={localizationConstants.addUserConfirmPasswordPlaceholder}
            type="password"
            className="grid gap-1"
            inputProps={{ autoComplete: "new-password" }}
          />
        </div>

        }
        {/* Row 4: Role & Department */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            control={form.control}
            name="role"
            label={localizationConstants.addUserRoleLabel}
            placeholder={localizationConstants.addUserRolePlaceholder}
            options={roleOptions}
            disabled={rolesQuery.isPending || rolesQuery.isError || readonly("permission_role_id")}
            triggerClassName="w-full !w-full justify-between text-left border-slate-200"
          />
          <FormSelect
            control={form.control}
            name="department"
            label={localizationConstants.addUserDepartmentLabel}
            placeholder={localizationConstants.addUserDepartmentPlaceholder}
            options={departmentOptions}
            disabled={groupsQuery.isPending || groupsQuery.isError || readonly("department")}
            triggerClassName="w-full !w-full justify-between text-left border-slate-200"
          />
        </div>

        {/* Row 5: Email & Mobile Number */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="email"
            disabled={readonly("email")}
            label={localizationConstants.addUserEmailLabel}
            placeholder={localizationConstants.addUserEmailPlaceholder}
            type="email"
            className="grid gap-1"
          />
          <FormInput
            control={form.control}
            name="mobileNumber"
            disabled={readonly("phone_number")}
            label={localizationConstants.addUserMobileLabel}
            placeholder={localizationConstants.addUserMobilePlaceholder}
            className="grid gap-1"
          />
        </div>

        {/* Row 7: 3 Checkbox/Toggle Switches on the Same Line (Responsive) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
          <FormSwitch
            control={form.control}
            name="isActive"
            disabled={isEditMode}
            label={localizationConstants.addUserActiveLabel}
            yesLabel={<Translate text={localizationConstants.yesLabel} />}
            noLabel={<Translate text={localizationConstants.noLabel} />}
          />
          {!isEditMode && <FormSwitch
            control={form.control}
            name="generateEmailForNewPassword"
            label={localizationConstants.addUserGenerateEmailLabel}
            yesLabel={<Translate text={localizationConstants.yesLabel} />}
            noLabel={<Translate text={localizationConstants.noLabel} />}
          />}
          <FormSwitch
            control={form.control}
            name="smsAuthentication"
            disabled={readonly("sms_authentication")}
            label={localizationConstants.addUserSmsAuthLabel}
            yesLabel={<Translate text={localizationConstants.yesLabel} />}
            noLabel={<Translate text={localizationConstants.noLabel} />}
          />
        </div>
      </div>
    </div>
  );
}
