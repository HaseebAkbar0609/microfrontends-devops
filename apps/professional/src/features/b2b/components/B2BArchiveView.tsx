"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { OfferTablePagination } from "@/features/offer/components/OfferTablePagination";
import { B2BArchiveItem, B2BArchiveTyp } from "../types/archive";

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN = "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

type SortField = "refNr" | "projekt" | "datum" | "typ" | "kommun" | "lagstOffert";

const TYP_BADGE: Record<B2BArchiveTyp, string> = {
  "B2B-Hyra UT": "bg-slate-100 text-slate-700",
  "B2B-Offert":  "bg-slate-100 text-slate-700",
  "B2B-Hyra IN": "bg-slate-100 text-slate-700",
};

interface Props {
  items: B2BArchiveItem[];
}

export function B2BArchiveView({ items }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.refNr.toLowerCase().includes(q) ||
      item.projekt.toLowerCase().includes(q) ||
      item.kommun.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t(localizationConstants.search)}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 rounded-none border-0 border-b border-slate-200 pl-8 text-sm shadow-none focus-visible:ring-0"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 cursor-pointer gap-1.5 text-sm">
              {t(localizationConstants.filter)}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48" />
        </DropdownMenu>

        <div className="ml-auto">
          <Button
            size="sm"
            className="h-9 cursor-pointer gap-2 bg-neutral-950 text-sm text-white hover:bg-neutral-800"
            onClick={() => router.push("/module/business/b2b/archive/create")}
          >
            <Plus size={14} aria-hidden={true} />
            {t(localizationConstants.b2bArchiveAddProject)}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-max w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className={TH_SORTABLE} onClick={() => toggleSort("refNr")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealDetailRef)}
                    {renderSortIcon("refNr", sortField, sortDir)}
                  </span>
                </th>
                <th className={TH_SORTABLE} onClick={() => toggleSort("projekt")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.projectName)}
                    {renderSortIcon("projekt", sortField, sortDir)}
                  </span>
                </th>
                <th className={TH_SORTABLE} onClick={() => toggleSort("datum")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealDetailDatum)}
                    {renderSortIcon("datum", sortField, sortDir)}
                  </span>
                </th>
                <th className={TH_SORTABLE} onClick={() => toggleSort("typ")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealDetailType)}
                    {renderSortIcon("typ", sortField, sortDir)}
                  </span>
                </th>
                <th className={TH_PLAIN}>{t(localizationConstants.b2bArchiveRequests)}</th>
                <th className={TH_SORTABLE} onClick={() => toggleSort("kommun")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.offerQuotedMunicipality)}
                    {renderSortIcon("kommun", sortField, sortDir)}
                  </span>
                </th>
                <th className={TH_SORTABLE} onClick={() => toggleSort("lagstOffert")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bPMLowestOffer)}
                    {renderSortIcon("lagstOffert", sortField, sortDir)}
                  </span>
                </th>
                <th className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="group border-b border-slate-200 last:border-0 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.refNr}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    <span className="block max-w-40 truncate">{row.projekt}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.datum}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${TYP_BADGE[row.typ]}`}>
                      {row.typ}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.forfragningar}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.kommun}</td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
                    {row.lagstOffert > 0 ? formatCurrency(row.lagstOffert) : "—"}
                  </td>
                  <td className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3 group-hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 cursor-pointer bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                        onClick={() => router.push(`/module/business/b2b/archive/${row.id}/offer`)}
                      >
                        {t(localizationConstants.b2bArchiveViewOffer)}
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 cursor-pointer bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                        onClick={() => router.push(`/module/business/b2b/archive/${row.id}/request`)}
                      >
                        {t(localizationConstants.b2bArchiveViewRequest)}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                    {t(localizationConstants.noQuotesFound)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <OfferTablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
