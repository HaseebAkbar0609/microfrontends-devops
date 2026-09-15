"use client";
import { useTranslate } from "@/utils/translation/translate";
import { useAdminQuery } from "./api";
import { State } from "./ui";

export default function Permissions({ value, onChange, disabled }: { value: Record<string, boolean>; onChange: (value: Record<string, boolean>) => void; disabled?: boolean }) {
  const t = useTranslate();
  const query = useAdminQuery<{ category: string; modules: { id: string; name: string }[] }[]>("modules/options");
  return <fieldset className="min-w-0 space-y-3 border-t pt-4" disabled={disabled}><legend className="text-sm font-medium">{t("proAdminPermissions")}</legend>
    <State loading={query.isPending} error={query.error} empty={!query.isPending && !query.data?.data.length} retry={() => void query.refetch()} />
    {!query.isError && query.data?.data.map(category => <div key={category.category} className="space-y-2"><h3 className="text-sm font-medium">{category.category}</h3><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{category.modules.map(module => <label key={module.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value[module.id]} onChange={e => onChange({ ...value, [module.id]: e.target.checked })} />{module.name}</label>)}</div></div>)}
  </fieldset>;
}
