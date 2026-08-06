"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  MoreVertical,
  TrendingUp,
  Handshake,
  BadgeDollarSign,
  Trophy,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { OfferTablePagination } from "@/features/offer/components/OfferTablePagination";
import { B2BDeal, DealStatus } from "../types/deal";

type SortField = keyof Pick<
  B2BDeal,
  "dealId" | "company" | "title" | "value" | "status" | "createdDate" | "expectedClose" | "assignedTo"
>;

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
  "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";
const SKELETON_COL_COUNT = 9;
const ALL_STATUSES: DealStatus[] = ["new", "in_progress", "won", "lost", "pending"];

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={`skeleton-${i}`} className="border-b border-slate-200">
          {Array.from({ length: SKELETON_COL_COUNT }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function StatusBadge({ status }: { status: DealStatus }) {
  const t = useTranslate();
  const config: Record<DealStatus, { label: string; className: string }> = {
    new: {
      label: t(localizationConstants.b2bDealStatusNew),
      className: "border-blue-300 bg-blue-50 text-blue-700",
    },
    in_progress: {
      label: t(localizationConstants.b2bDealStatusInProgress),
      className: "border-amber-300 bg-amber-50 text-amber-700",
    },
    won: {
      label: t(localizationConstants.b2bDealStatusWon),
      className: "border-emerald-400 bg-emerald-50 text-emerald-700",
    },
    lost: {
      label: t(localizationConstants.b2bDealStatusLost),
      className: "border-red-300 bg-red-50 text-red-700",
    },
    pending: {
      label: t(localizationConstants.b2bDealStatusPending),
      className: "border-slate-300 bg-slate-50 text-slate-600",
    },
  };
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shadow-sm ${className}`}
    >
      {label}
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-md ${accent}`}>
          <Icon size={16} className="text-white" aria-hidden={true} />
        </span>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className="text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

interface Props {
  deals: B2BDeal[];
  isLoading?: boolean;
}

export function B2BDealListView({ deals, isLoading = false }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<DealStatus[]>([]);
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const debouncedSearch = useDebounce(search, 300);
  const activeFilterCount = selectedStatuses.length;

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return deals.filter((d) => {
      const matchesSearch =
        d.dealId.toLowerCase().includes(q) ||
        d.company.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(d.status);
      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, selectedStatuses, deals]);

  const sorted = useMemo(
    () =>
      sortItems(filtered, sortField, sortDir, (item, field) =>
        item[field as keyof B2BDeal] as string | number,
      ),
    [filtered, sortField, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // KPI computations
  const activeDeals = deals.filter((d) => d.status !== "lost" && d.status !== "won");
  const pipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter((d) => d.status === "won");
  const conversionRate =
    deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  const statusLabels: Record<DealStatus, string> = {
    new: t(localizationConstants.b2bDealStatusNew),
    in_progress: t(localizationConstants.b2bDealStatusInProgress),
    won: t(localizationConstants.b2bDealStatusWon),
    lost: t(localizationConstants.b2bDealStatusLost),
    pending: t(localizationConstants.b2bDealStatusPending),
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 border-b border-slate-200 px-5 py-4 xl:grid-cols-4">
        <KpiCard
          icon={Handshake}
          label={t(localizationConstants.b2bDealsTotalActive)}
          value={String(activeDeals.length)}
          sub={`${deals.length} ${t(localizationConstants.totalLabel)}`}
          accent="bg-blue-600"
        />
        <KpiCard
          icon={BadgeDollarSign}
          label={t(localizationConstants.b2bDealsPipelineValue)}
          value={formatCurrency(pipelineValue)}
          accent="bg-violet-600"
        />
        <KpiCard
          icon={Trophy}
          label={t(localizationConstants.b2bDealsWonThisMonth)}
          value={String(wonDeals.length)}
          sub={formatCurrency(wonDeals.reduce((s, d) => s + d.value, 0))}
          accent="bg-emerald-600"
        />
        <KpiCard
          icon={TrendingUp}
          label={t(localizationConstants.b2bDealsConversionRate)}
          value={`${conversionRate}%`}
          accent="bg-amber-500"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
        <div className="relative w-75">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 opacity-50"
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
            <Button variant="outline" size="sm" className="h-9 cursor-pointer gap-1.5 text-sm">
              {t(localizationConstants.filter)}
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className="text-xs font-medium text-slate-500">
              {t(localizationConstants.statusLabel)}
            </DropdownMenuLabel>
            {ALL_STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) => {
                  setSelectedStatuses((prev) =>
                    checked ? [...prev, status] : prev.filter((s) => s !== status),
                  );
                  setPage(1);
                }}
              >
                {statusLabels[status]}
              </DropdownMenuCheckboxItem>
            ))}
            {activeFilterCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-xs text-slate-500"
                  onClick={() => {
                    setSelectedStatuses([]);
                    setPage(1);
                  }}
                >
                  {t(localizationConstants.clearFilters)}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto">
          <Button
            size="sm"
            className="h-9 cursor-pointer gap-2 bg-neutral-950 text-sm text-white hover:bg-neutral-800"
            onClick={() => router.push("/module/business/b2b/create")}
          >
            <Plus size={14} aria-hidden={true} />
            {t(localizationConstants.b2bCreateDeal)}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="b2b-table-scroll overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-300 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("dealId")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealId)}
                    {renderSortIcon("dealId", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("company")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealCompany)}
                    {renderSortIcon("company", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("title")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealTitle)}
                    {renderSortIcon("title", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("value")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealValue)}
                    {renderSortIcon("value", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_PLAIN}>
                  {t(localizationConstants.statusLabel)}
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("createdDate")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealCreatedDate)}
                    {renderSortIcon("createdDate", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("expectedClose")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealExpectedClose)}
                    {renderSortIcon("expectedClose", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("assignedTo")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealAssignedTo)}
                    {renderSortIcon("assignedTo", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SkeletonRows count={rowsPerPage} />
              ) : (
                <>
                  {paginated.map((row) => (
                    <tr
                      key={row.id}
                      className="group cursor-pointer border-b border-slate-200 last:border-0 hover:bg-slate-50"
                      onClick={() => router.push(`/module/business/b2b/deals/${row.id}`)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        {row.dealId}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {row.company}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <span className="block max-w-52 truncate">{row.title}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums text-slate-900">
                        {formatCurrency(row.value)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {row.createdDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {row.expectedClose}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {row.assignedTo}
                      </td>
                      <td
                        className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3 group-hover:bg-slate-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={t(localizationConstants.actions)}
                              className="h-7 w-7 cursor-pointer p-0"
                            >
                              <MoreVertical size={14} aria-hidden={true} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => router.push(`/module/business/b2b/deals/${row.id}`)}
                            >
                              {t(localizationConstants.b2bDealViewDetails)}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              {t(localizationConstants.b2bDealEdit)}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              {t(localizationConstants.b2bDealArchiveAction)}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                              {t(localizationConstants.b2bDealDelete)}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}

                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={SKELETON_COL_COUNT}
                        className="px-4 py-12 text-center text-sm text-slate-400"
                      >
                        {t(localizationConstants.b2bDealsEmpty)}
                      </td>
                    </tr>
                  )}
                </>
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
