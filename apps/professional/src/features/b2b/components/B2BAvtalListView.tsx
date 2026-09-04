"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { OfferTablePagination } from "@/features/offer/components/OfferTablePagination";
import { AvtalListItem, AvtalStatus } from "../types/avtal";

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
  "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

type SortField = keyof Pick<AvtalListItem, "refNr" | "projektNamn" | "kund" | "datum" | "kontraktTyp" | "pris">;

const STATUS_CLASS: Record<AvtalStatus, string> = {
  draft:    "border-amber-300 bg-amber-50 text-amber-700",
  sent:     "border-blue-300 bg-blue-50 text-blue-700",
  signed:   "border-emerald-400 bg-emerald-50 text-emerald-700",
  rejected: "border-red-300 bg-red-50 text-red-700",
};

function StatusBadge({ status }: { status: AvtalStatus }) {
  const t = useTranslate();
  const labels: Record<AvtalStatus, string> = {
    draft:    t(localizationConstants.b2bAvtalStatusDraft),
    sent:     t(localizationConstants.b2bAvtalStatusSent),
    signed:   t(localizationConstants.b2bAvtalStatusSigned),
    rejected: t(localizationConstants.b2bAvtalStatusRejected),
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shadow-sm ${STATUS_CLASS[status]}`}>
      {labels[status]}
    </span>
  );
}

interface Props {
  items: AvtalListItem[];
}

export function B2BAvtalListView({ items }: Props) {
  const router = useRouter();
  const t = useTranslate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.projektNamn.toLowerCase().includes(q) ||
        item.refNr.toLowerCase().includes(q) ||
        item.kund.toLowerCase().includes(q),
    );
  }, [items, search]);

  const sorted = useMemo(
    () =>
      sortItems(
        filtered,
        sortField,
        sortDir,
        (item, field) => item[field as keyof AvtalListItem] as string | number,
      ),
    [filtered, sortField, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Page heading */}
      <div className="px-5 py-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bAvtalListTitle)}
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden={true}
          />
          <Input
            placeholder={t(localizationConstants.search)}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 rounded-none border-0 border-b border-slate-200 pl-8 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="ml-auto">
          <Button
            size="sm"
            className="h-9 cursor-pointer gap-2 bg-neutral-950 text-sm text-white hover:bg-neutral-800"
            onClick={() => router.push("/module/business/b2b/agreements/create")}
          >
            <Plus size={14} aria-hidden={true} />
            {t(localizationConstants.b2bAvtalNewBtn)}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="b2b-table-scroll overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-max w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("refNr")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bAvtalRefNr)}
                    {renderSortIcon("refNr", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("projektNamn")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bAvtalProjektNamn)}
                    {renderSortIcon("projektNamn", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_PLAIN}>
                  {t(localizationConstants.b2bAvtalStatusCol)}
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("kund")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bAvtalKund)}
                    {renderSortIcon("kund", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("datum")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bAvtalDatum)}
                    {renderSortIcon("datum", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("kontraktTyp")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bAvtalKontraktTyp)}
                    {renderSortIcon("kontraktTyp", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("pris")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bAvtalPris)}
                    {renderSortIcon("pris", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                    {t(localizationConstants.b2bAvtalListEmpty)}
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="group cursor-pointer border-b border-slate-200 last:border-0 hover:bg-slate-50"
                    onClick={() => router.push(`/module/business/b2b/agreements/${item.id}`)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{item.refNr}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      <span className="block max-w-48 truncate">{item.projektNamn}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.kund}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.datum}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.kontraktTyp}</td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
                      {formatCurrency(item.pris)}
                    </td>
                    <td
                      className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3 group-hover:bg-slate-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="h-8 cursor-pointer gap-1.5 bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                          onClick={() => router.push(`/module/business/b2b/agreements/${item.id}`)}
                        >
                          <Eye size={12} aria-hidden={true} />
                          {t(localizationConstants.b2bAvtalSeAvtal)}
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 cursor-pointer gap-1.5 bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                          onClick={() => router.push("/module/business/b2b/agreements/create")}
                        >
                          <Pencil size={12} aria-hidden={true} />
                          {t(localizationConstants.b2bAvtalRedigera)}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <OfferTablePagination
            page={page}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
