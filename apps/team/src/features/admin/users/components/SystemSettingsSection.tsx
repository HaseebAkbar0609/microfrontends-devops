"use client";

import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MonitorCog } from "lucide-react";

import { FormSelect } from "@/components/form/FormSelect";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AddUserFormValues } from "@/schemas/admin/addUser.schema";

interface SystemSettingsSectionProps {
  form: UseFormReturn<AddUserFormValues>;
}

export function SystemSettingsSection({ form }: SystemSettingsSectionProps) {
  const { t } = useTranslation();

  const languageOptions = [
    { value: "sv", label: t(localizationConstants.languageSwedish) },
    { value: "en", label: t(localizationConstants.languageEnglish) },
  ];

  const logoutOptions = [
    { value: "30m", label: t(localizationConstants.logout30m) },
    { value: "1h", label: t(localizationConstants.logout1h) },
    { value: "2h", label: t(localizationConstants.logout2h) },
    { value: "4h", label: t(localizationConstants.logout4h) },
    { value: "8h", label: t(localizationConstants.logout8h) },
  ];

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
          label={localizationConstants.addUserLanguageLabel}
          options={languageOptions}
          className="grid gap-1"
          triggerClassName="w-full"
        />
        <FormSelect
          control={form.control}
          name="automaticLogout"
          label={localizationConstants.addUserAutomaticLogoutLabel}
          options={logoutOptions}
          className="grid gap-1"
          triggerClassName="w-full"
        />
      </div>
    </div>
  );
}
