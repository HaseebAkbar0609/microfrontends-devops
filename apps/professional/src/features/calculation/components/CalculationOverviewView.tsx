"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { OfferTablePagination } from "@/features/offer/components/OfferTablePagination";
import { CalcOverviewItem, CalcOverviewStatus } from "../types/overview";

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
  "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

type SortField = keyof Pick<
  CalcOverviewItem,
  "calcNo" | "projectName" | "connection" | "client" | "offertDatum" | "offertSumma"
>;

const STATUS_CLASS: Record<CalcOverviewStatus, string> = {
  not_started: "border-amber-300 bg-amber-50 text-amber-700",
  in_progress: "border-emerald-400 bg-emerald-50 text-emerald-700",
  completed:   "border-blue-300 bg-blue-50 text-blue-700",
};

function StatusBadge({ status }: { status: CalcOverviewStatus }) {
  const t = useTranslate();
  const labels: Record<CalcOverviewStatus, string> = {
    not_started: t(localizationConstants.calcOverviewStatusNotStarted),
    in_progress: t(localizationConstants.calcOverviewStatusInProgress),
    completed:   t(localizationConstants.calcOverviewStatusCompleted),
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shadow-sm ${STATUS_CLASS[status]}`}>
      {labels[status]}
    </span>
  );
}

interface Props {
  items: CalcOverviewItem[];
}

export function CalculationOverviewView({ items }: Props) {
  const router = useRouter();
  const t = useTranslate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<CalcOverviewStatus | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

  const statusLabels: Record<CalcOverviewStatus, string> = {
    not_started: t(localizationConstants.calcOverviewStatusNotStarted),
    in_progress: t(localizationConstants.calcOverviewStatusInProgress),
    completed:   t(localizationConstants.calcOverviewStatusCompleted),
  };

  const filtered = useMemo(() => {
    let result = items;
    if (filterStatus) result = result.filter((item) => item.status === filterStatus);
    const q = search.toLowerCase();
    if (!q) return result;
    return result.filter(
      (item) =>
        item.calcNo.toLowerCase().includes(q) ||
        item.projectName.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q),
    );
  }, [items, search, filterStatus]);

  const sorted = useMemo(
    () =>
      sortItems(
        filtered,
        sortField,
        sortDir,
        (item, field) => item[field as keyof CalcOverviewItem] as string | number,
      ),
    [filtered, sortField, sortDir],
  );

  useEffect(() => { setPage(1); }, [items]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const activeFilterLabel = filterStatus ? statusLabels[filterStatus] : t(localizationConstants.filter);

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Page heading */}
      <div className="px-5 py-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.calcOverviewPage)}
        </h1>
      </div>

      {/* Toolbar — no bottom border */}
      <div className="flex items-center gap-2 px-5 py-3">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden={true}
          />
          <Input
            placeholder={t(localizationConstants.search)}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-none border-0 border-b border-slate-200 pl-8 text-sm shadow-none focus-visible:ring-0"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 cursor-pointer gap-1.5 border-slate-200 text-sm font-medium text-slate-700"
            >
              {activeFilterLabel}
              <ChevronDown size={14} aria-hidden={true} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => { setFilterStatus(null); setPage(1); }}
            >
              {t(localizationConstants.adminUsersFilterAll)}
            </DropdownMenuItem>
            {(Object.keys(statusLabels) as CalcOverviewStatus[]).map((status) => (
              <DropdownMenuItem
                key={status}
                className="cursor-pointer text-sm"
                onClick={() => { setFilterStatus(status); setPage(1); }}
              >
                {statusLabels[status]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto">
          <Button
            size="sm"
            className="h-9 cursor-pointer gap-2 bg-neutral-950 text-sm text-white hover:bg-neutral-800"
            onClick={() => router.push("/module/business/calculation/overview/create")}
          >
            <Plus size={14} aria-hidden={true} />
            {t(localizationConstants.calcOverviewNewBtn)}
          </Button>
        </div>
      </div>

      {/* Table — no outer border box */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-2">
        <div className="b2b-table-scroll overflow-x-auto">
          <table className="min-w-max w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("calcNo")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.calcNo)}
                    {renderSortIcon("calcNo", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("projectName")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.projectName)}
                    {renderSortIcon("projectName", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("connection")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.calcOverviewConnection)}
                    {renderSortIcon("connection", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("client")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.calcOverviewClient)}
                    {renderSortIcon("client", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("offertDatum")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.calcOverviewOffertDatum)}
                    {renderSortIcon("offertDatum", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_PLAIN}>
                  {t(localizationConstants.calcOverviewTyp)}
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("offertSumma")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.calcOverviewOffertSumma)}
                    {renderSortIcon("offertSumma", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_PLAIN}>
                  {t(localizationConstants.calcOverviewKategori)}
                </th>
                <th scope="col" className={TH_PLAIN}>
                  {t(localizationConstants.statusHeader)}
                </th>
                <th scope="col" className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-400">
                    {t(localizationConstants.calcOverviewEmpty)}
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="group cursor-pointer border-b border-slate-200 last:border-0 hover:bg-slate-50"
                    onClick={() => router.push(`/module/business/calculation/overview/${item.id}`)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {item.calcNo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      <span className="block max-w-48 truncate">{item.projectName}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {item.connection}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      <span className="block max-w-36 truncate">{item.client}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.offertDatum}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {item.typ}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
                      {formatCurrency(item.offertSumma)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.kategori}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td
                      className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3 group-hover:bg-slate-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        className="h-8 cursor-pointer gap-1.5 bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                        onClick={() => router.push(`/module/business/calculation/overview/${item.id}`)}
                      >
                        <Eye size={12} aria-hidden={true} />
                        {t(localizationConstants.calcOverviewSeKalkyl)}
                      </Button>
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
