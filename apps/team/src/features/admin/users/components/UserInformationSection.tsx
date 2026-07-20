"use client";

import type { UseFormReturn } from "react-hook-form";
import { UserRound } from "lucide-react";

import { FormInput } from "@/components/form/FormInput";
import { FormSwitch } from "@/components/form/FormSwitch";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AddUserFormValues } from "@/schemas/admin/addUser.schema";

interface UserInformationSectionProps {
  form: UseFormReturn<AddUserFormValues>;
}

export function UserInformationSection({ form }: UserInformationSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
        <UserRound className="h-5 w-5 text-slate-700" strokeWidth={2.2} />
        <span className="text-sm font-semibold text-slate-700">
          <Translate text={localizationConstants.addUserUserInformation} />
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4">
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
            name="password"
            label={localizationConstants.addUserPasswordLabel}
            placeholder={localizationConstants.addUserPasswordPlaceholder}
            type="password"
            className="grid gap-1"
            inputProps={{ autoComplete: "new-password" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="name"
            label={localizationConstants.addUserNameLabel}
            placeholder={localizationConstants.addUserNamePlaceholder}
            className="grid gap-1"
            inputProps={{ autoComplete: "off" }}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="personalNumber"
            label={localizationConstants.addUserPersonalNumberLabel}
            placeholder={localizationConstants.addUserPersonalNumberPlaceholder}
            className="grid gap-1"
          />
          <FormSwitch
            control={form.control}
            name="smsAuthentication"
            label={localizationConstants.addUserSmsAuthLabel}
            yesLabel={<Translate text={localizationConstants.yesLabel} />}
            noLabel={<Translate text={localizationConstants.noLabel} />}
          />
        </div>

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="employeeRegisterPerson"
            label={localizationConstants.addUserEmployeeRegisterLabel}
            placeholder={localizationConstants.addUserEmployeeRegisterPlaceholder}
            className="grid gap-1"
          />
          <div />
        </div>
      </div>
    </div>
  );
}
