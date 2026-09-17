"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import { OPTION_PAGE_SIZE, optionLabel, useAdminQuery, type Option } from "./api";
import { TEXT_MAX_LENGTH } from "./admin.constants";
import { Field, State } from "./ui";

export default function RemoteSelect({ path, label, selected, onChange, multiple = false, disabled = false, exclude }: {
  path: string; label: string; selected: Option[]; onChange: (options: Option[]) => void;
  multiple?: boolean; disabled?: boolean; exclude?: string;
}) {
  const t = useTranslate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const query = useAdminQuery<Option[]>(path, { search: search || undefined, skip: page * OPTION_PAGE_SIZE, limit: OPTION_PAGE_SIZE }, open && !disabled);
  const options = (query.data?.data ?? []).filter(o => o.id !== exclude);
  return <div className="min-w-0 space-y-2 text-sm">
    <span>{label}</span><div className="flex flex-wrap items-center gap-2">
      {selected.map(item => <span key={item.id} className="inline-flex max-w-full items-center gap-1 rounded border px-2 py-1"><span className="break-all">{optionLabel(item)}</span><button type="button" disabled={disabled} title={t("proAdminRemove")} aria-label={t("proAdminRemove") + " " + optionLabel(item)} onClick={() => onChange(selected.filter(o => o.id !== item.id))}><X className="h-4 w-4" /></button></span>)}
      <Button type="button" variant="outline" disabled={disabled} onClick={() => setOpen(!open)} aria-expanded={open}>{t("proAdminSearch")}</Button>
    </div>
    {open && !disabled && <div className="space-y-2 border-l-2 pl-3">
      <Field label={t("proAdminSearch") + " " + label} value={search} maxLength={TEXT_MAX_LENGTH} onChange={e => { setSearch(e.target.value); setPage(0); }} />
      <State loading={query.isPending} error={query.error} retry={() => void query.refetch()} empty={!query.isPending && !options.length} />
      {!query.isError && <div className="max-h-48 overflow-y-auto">{options.map(item => <label key={item.id} className="flex items-center gap-2 py-1.5"><input type={multiple ? "checkbox" : "radio"} checked={selected.some(o => o.id === item.id)} onChange={e => { onChange(multiple ? e.target.checked ? [...selected, item] : selected.filter(o => o.id !== item.id) : [item]); if (!multiple) setOpen(false); }} /><span className="break-all">{optionLabel(item)}</span></label>)}</div>}
      <div className="flex gap-2"><Button type="button" variant="outline" size="icon" title={t("proAdminPrevious")} disabled={!page || query.isFetching} onClick={() => setPage(page - 1)}><ChevronLeft /></Button><Button type="button" variant="outline" size="icon" title={t("proAdminNext")} disabled={query.isFetching || (query.data?.data.length ?? 0) < OPTION_PAGE_SIZE} onClick={() => setPage(page + 1)}><ChevronRight /></Button></div>
    </div>}
  </div>;
}
