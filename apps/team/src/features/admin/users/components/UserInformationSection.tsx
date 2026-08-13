"use client";

import type { UseFormReturn } from "react-hook-form";
import { UserRound } from "lucide-react";

import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormSwitch } from "@/components/form/FormSwitch";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AddUserFormValues } from "@/schemas/admin/addUser.schema";
import { useAdminGroups, useAdminRoleOptions } from "../hooks/useAdminUsers";

interface UserInformationSectionProps {
  form: UseFormReturn<AddUserFormValues>;
}

export function UserInformationSection({ form }: UserInformationSectionProps) {
  
  const { data: rolesData } = useAdminRoleOptions();
  const { data: groupsData } = useAdminGroups({ skip: 0, limit: 100 });

  const roleOptions = (rolesData?.data || []).map((r: { id: string; name: string }) => ({ value: r.id, label: r.name }));
  const departmentOptions = (groupsData?.data || []).map((g: { id: string; name: string }) => ({ value: g.id, label: g.name }));

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
        <UserRound className="h-5 w-5 text-slate-700" strokeWidth={2.2} />
        <span className="text-sm font-semibold text-slate-700">
          <Translate text={localizationConstants.addUserUserInformation} />
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Row 1: Credentials & Personal Number */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="userCredentials"
            label={localizationConstants.addUserCredentialsLabel}
            placeholder={localizationConstants.addUserCredentialsPlaceholder}
            className="grid gap-1"
            inputProps={{ autoComplete: "off" }}
          />
          <FormInput
            control={form.control}
            name="personalNumber"
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
            label={localizationConstants.addUserFirstNameLabel}
            placeholder={localizationConstants.addUserFirstNamePlaceholder}
            className="grid gap-1"
            inputProps={{ autoComplete: "given-name" }}
          />
          <FormInput
            control={form.control}
            name="lastName"
            label={localizationConstants.addUserLastNameLabel}
            placeholder={localizationConstants.addUserLastNamePlaceholder}
            className="grid gap-1"
            inputProps={{ autoComplete: "family-name" }}
          />
        </div>

        {/* Row 3: Password & Confirm Password */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        {/* Row 4: Role & Department */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            control={form.control}
            name="role"
            label={localizationConstants.addUserRoleLabel}
            placeholder={localizationConstants.addUserRolePlaceholder}
            options={roleOptions}
            triggerClassName="w-full !w-full justify-between text-left border-slate-200"
          />
          <FormSelect
            control={form.control}
            name="department"
            label={localizationConstants.addUserDepartmentLabel}
            placeholder={localizationConstants.addUserDepartmentPlaceholder}
            options={departmentOptions}
            triggerClassName="w-full !w-full justify-between text-left border-slate-200"
          />
        </div>

        {/* Row 5: Email & Mobile Number */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="email"
            label={localizationConstants.addUserEmailLabel}
            placeholder={localizationConstants.addUserEmailPlaceholder}
            type="email"
            className="grid gap-1"
          />
          <FormInput
            control={form.control}
            name="mobileNumber"
            label={localizationConstants.addUserMobileLabel}
            placeholder={localizationConstants.addUserMobilePlaceholder}
            className="grid gap-1"
          />
        </div>

        {/* Row 6: Employee Register Person */}
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            control={form.control}
            name="employeeRegisterPerson"
            label={localizationConstants.addUserEmployeeRegisterLabel}
            placeholder={localizationConstants.addUserEmployeeRegisterPlaceholder}
            className="grid gap-1"
          />
        </div>

        {/* Row 7: 3 Checkbox/Toggle Switches on the Same Line (Responsive) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
          <FormSwitch
            control={form.control}
            name="isActive"
            label={localizationConstants.addUserActiveLabel}
            yesLabel={<Translate text={localizationConstants.yesLabel} />}
            noLabel={<Translate text={localizationConstants.noLabel} />}
          />
          <FormSwitch
            control={form.control}
            name="generateEmailForNewPassword"
            label={localizationConstants.addUserGenerateEmailLabel}
            yesLabel={<Translate text={localizationConstants.yesLabel} />}
            noLabel={<Translate text={localizationConstants.noLabel} />}
          />
          <FormSwitch
            control={form.control}
            name="smsAuthentication"
            label={localizationConstants.addUserSmsAuthLabel}
            yesLabel={<Translate text={localizationConstants.yesLabel} />}
            noLabel={<Translate text={localizationConstants.noLabel} />}
          />
        </div>
      </div>
    </div>
  );
}
