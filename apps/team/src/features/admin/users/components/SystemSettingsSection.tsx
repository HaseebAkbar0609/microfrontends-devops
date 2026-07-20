"use client";

import type { UseFormReturn } from "react-hook-form";
import { MonitorCog } from "lucide-react";

import { FormSelect } from "@/components/form/FormSelect";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AddUserFormValues } from "@/schemas/admin/addUser.schema";

const LANGUAGE_OPTIONS = [
  { value: "sv", label: "Svenska" },
  { value: "en", label: "English" },
];

const LOGOUT_OPTIONS = [
  { value: "30m", label: "30 minuter" },
  { value: "1h", label: "1 timme" },
  { value: "2h", label: "2 timmar" },
  { value: "4h", label: "4 timmar" },
  { value: "8h", label: "8 timmar" },
];

interface SystemSettingsSectionProps {
  form: UseFormReturn<AddUserFormValues>;
}

export function SystemSettingsSection({ form }: SystemSettingsSectionProps) {
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
          label={<Translate text={localizationConstants.addUserLanguageLabel} />}
          options={LANGUAGE_OPTIONS}
          className="grid gap-1"
          triggerClassName="w-full"
        />
        <FormSelect
          control={form.control}
          name="automaticLogout"
          label={<Translate text={localizationConstants.addUserAutomaticLogoutLabel} />}
          options={LOGOUT_OPTIONS}
          className="grid gap-1"
          triggerClassName="w-full"
        />
      </div>
    </div>
  );
}
