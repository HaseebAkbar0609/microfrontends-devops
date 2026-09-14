"use client";

import { useState } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { Blocks, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { Checkbox } from "@/components/ui/checkbox";
import localizationConstants from "@/utils/translation/constants";
import type { UserDetailsFormValues } from "@/schemas/admin/userDetails.schema";
import type { AdminModuleCategory } from "../types/adminUsers.types";

export function PermissionPanel({ col, form, disabled }: { col: AdminModuleCategory; form: UseFormReturn<UserDetailsFormValues>; disabled?: boolean }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(true);
  const permissions = useWatch({ control: form.control, name: "permissions" }) ?? {};
  const checkedCount = col.modules.filter((mod) => permissions[mod.id]).length;
  const allChecked = col.modules.length > 0 && checkedCount === col.modules.length;
  const swedish = i18n.language.startsWith("sv") || i18n.language === "swe";
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2.5 text-left">
        <span className="break-words text-sm font-bold text-slate-700">{t(col.category)}</span>
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
      </button>
      {open && <>
        <div className="grid grid-cols-[minmax(0,1fr)_80px] border-b border-slate-200 px-4 py-2.5 text-sm text-slate-500"><span>{t(localizationConstants.userDetailsModules)}</span><span className="text-center">{t(localizationConstants.userDetailsAccess)}</span></div>
        {col.modules.map((mod) => <div key={mod.id} className="grid grid-cols-[minmax(0,1fr)_80px] items-center border-b border-slate-200 px-4 py-3.5">
          <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-700"><Info className="h-4 w-4 shrink-0" /><span className="break-words">{swedish ? mod.name_sv || mod.name : mod.name}</span></span>
          <FormCheckbox control={form.control} name={`permissions.${mod.id}`} disabled={disabled} label={<span className="sr-only">{swedish ? mod.name_sv || mod.name : mod.name}</span>} className="justify-center" checkboxClassName="h-4 w-4" variant="secondary" />
        </div>)}
        <div className="grid min-h-12 grid-cols-[minmax(0,1fr)_80px] items-center px-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800"><Blocks className="h-4 w-4" />{t(localizationConstants.userDetailsAll)}</span>
          <div className="flex justify-center"><Checkbox aria-label={`${t(localizationConstants.userDetailsAll)} ${t(col.category)}`} checked={allChecked ? true : checkedCount > 0 ? "indeterminate" : false} disabled={disabled || !col.modules.length} onCheckedChange={(checked) => {
            for (const mod of col.modules) form.setValue(`permissions.${mod.id}`, checked === true, { shouldDirty: true });
          }} /></div>
        </div>
      </>}
    </div>
  );
}
