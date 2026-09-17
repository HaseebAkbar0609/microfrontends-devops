"use client";

import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MonitorCog } from "lucide-react";

import { FormSelect } from "@/components/form/FormSelect";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AddUserFormValues } from "@/schemas/admin/addUser.schema";
import { ADMIN_OPTION_NONE } from "../constants/adminUsers.constants";
import { parseLogout } from "../utils/adminUserForms";
import type { AdminUserDetail } from "../types/adminUsers.types";

interface SystemSettingsSectionProps {
  form: UseFormReturn<AddUserFormValues>;
  user?: AdminUserDetail;
}

export function SystemSettingsSection({ form, user }: SystemSettingsSectionProps) {
  const { t } = useTranslation();

  const languageOptions = [
    { value: "sv", label: t(localizationConstants.languageSwedish) },
    { value: "en", label: t(localizationConstants.languageEnglish) },
  ];

  const logoutOptions = [
    { value: ADMIN_OPTION_NONE, label: t(localizationConstants.adminNone) },
    { value: "30m", label: t(localizationConstants.logout30m) },
    { value: "1h", label: t(localizationConstants.logout1h) },
    { value: "2h", label: t(localizationConstants.logout2h) },
    { value: "4h", label: t(localizationConstants.logout4h) },
    { value: "8h", label: t(localizationConstants.logout8h) },
  ];
  const logout = form.watch("automaticLogout");
  if (logout && !logoutOptions.some((option) => option.value === logout)) {
    logoutOptions.push({ value: logout, label: t(localizationConstants.adminLogoutMinutes, { minutes: parseLogout(logout) }) });
  }

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
        <MonitorCog className="h-5 w-5 text-slate-700" strokeWidth={2.2} />
        <span className="text-sm font-semibold text-slate-700">
          <Translate text={localizationConstants.addUserSystemSettings} />
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <FormSelect
          control={form.control}
          name="language"
          disabled={!!user && !user.editable_fields?.includes("language")}
          label={localizationConstants.addUserLanguageLabel}
          placeholder={localizationConstants.adminNone}
          options={languageOptions}
          className="grid gap-1"
          triggerClassName="w-full"
        />
        <FormSelect
          control={form.control}
          name="automaticLogout"
          disabled={!!user && !user.editable_fields?.includes("auto_logout")}
          label={localizationConstants.addUserAutomaticLogoutLabel}
          options={logoutOptions}
          className="grid gap-1"
          triggerClassName="w-full"
        />
      </div>
    </div>
  );
}
