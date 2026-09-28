import { ArrowDownWideNarrow, ArrowUpNarrowWide, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslate } from "@/utils/translation/translate";

export function DocumentsToolbar({ search, setSearch, sort, setSort, desc, setDesc, refresh, refreshing }: {
  search: string; setSearch: (value: string) => void; sort: string; setSort: (value: string) => void;
  desc: boolean; setDesc: (value: boolean) => void; refresh: () => void; refreshing: boolean;
}) {
  const t = useTranslate();
  return <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-end lg:justify-between">
    <div className="relative min-w-0 lg:w-80"><Search className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-500" aria-hidden />
      <Input className="h-11 pl-9" value={search} onChange={event => setSearch(event.target.value)} aria-label={t("dwSearch")} placeholder={t("dwSearch")} />
    </div>
    <div className="flex min-w-0 items-end gap-2">
      <div className="min-w-0 flex-1 space-y-1 lg:w-48"><Label htmlFor="documents-sort" className="text-xs text-slate-500">{t("dwSort")}</Label>
        <Select value={sort} onValueChange={setSort}><SelectTrigger id="documents-sort" className="h-11 w-full"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="documentName">{t("dwSortName")}</SelectItem><SelectItem value="date">{t("dwSortDate")}</SelectItem></SelectContent>
        </Select>
      </div>
      <Button variant="outline" size="icon" className="h-11 w-11" title={t(desc ? "dwDescending" : "dwAscending")} aria-label={t(desc ? "dwDescending" : "dwAscending")} onClick={() => setDesc(!desc)}>
        {desc ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
      </Button>
      <Button variant="outline" size="icon" className="h-11 w-11" title={t("retry")} aria-label={t("retry")} disabled={refreshing} onClick={refresh}><RefreshCw className={refreshing ? "animate-spin" : undefined} /></Button>
    </div>
  </div>;
}
