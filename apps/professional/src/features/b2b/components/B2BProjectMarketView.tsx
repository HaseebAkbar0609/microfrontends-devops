"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, MoreVertical, Plus } from "lucide-react";
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
import { ProjectMarket, ProjectMarketStatus } from "../types/projectMarket";

type SortField = keyof Pick<
  ProjectMarket,
  "refNr" | "project" | "date" | "type" | "requests" | "municipality" | "lowestOffer"
>;

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
  "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";
const SKELETON_COL_COUNT = 9;
const ALL_STATUSES: ProjectMarketStatus[] = ["contract_signed", "waiting", "open", "closing_soon"];

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

function StatusBadge({ status }: { status: ProjectMarketStatus }) {
  const t = useTranslate();
  const config: Record<ProjectMarketStatus, { label: string; className: string }> = {
    contract_signed: {
      label: t(localizationConstants.b2bPMStatusContractSigned),
      className: "border-emerald-300 bg-emerald-50 text-emerald-700",
    },
    waiting: {
      label: t(localizationConstants.b2bPMStatusWaiting),
      className: "border-amber-300 bg-amber-50 text-amber-700",
    },
    open: {
      label: t(localizationConstants.b2bPMStatusWaiting),
      className: "border-blue-300 bg-blue-50 text-blue-700",
    },
    closing_soon: {
      label: t(localizationConstants.b2bPMStatusWaiting),
      className: "border-red-300 bg-red-50 text-red-700",
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

interface Props {
  projects: ProjectMarket[];
  isLoading?: boolean;
}

export function B2BProjectMarketView({ projects, isLoading = false }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectMarketStatus[]>([]);
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const debouncedSearch = useDebounce(search, 300);
  const activeFilterCount = selectedStatuses.length;

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        p.refNr.toLowerCase().includes(q) ||
        p.project.toLowerCase().includes(q) ||
        p.municipality.toLowerCase().includes(q);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(p.status);
      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, selectedStatuses, projects]);

  const sorted = useMemo(
    () =>
      sortItems(filtered, sortField, sortDir, (item, field) =>
        item[field as keyof ProjectMarket] as string | number,
      ),
    [filtered, sortField, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const statusLabels: Record<ProjectMarketStatus, string> = {
    contract_signed: t(localizationConstants.b2bPMStatusContractSigned),
    waiting: t(localizationConstants.b2bPMStatusWaiting),
    open: t(localizationConstants.b2bPMStatusWaiting),
    closing_soon: t(localizationConstants.b2bPMStatusWaiting),
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
        <div className="relative w-75">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 opacity-50"
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
            <Button variant="outline" size="sm" className="h-9 cursor-pointer gap-1.5 text-sm">
              {t(localizationConstants.filter)}
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={14} aria-hidden={true} />
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
            onClick={() => router.push("/module/business/b2b/project-market/create")}
          >
            <Plus size={14} aria-hidden={true} />
            {t(localizationConstants.b2bPMAddProject)}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-300 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("refNr")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bPMRefNr)}
                    {renderSortIcon("refNr", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("project")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bPMProject)}
                    {renderSortIcon("project", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("date")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bDealDetailDatum)}
                    {renderSortIcon("date", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("type")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bPMType)}
                    {renderSortIcon("type", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("requests")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bPMRequests)}
                    {renderSortIcon("requests", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("municipality")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bPMMunicipality)}
                    {renderSortIcon("municipality", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("lowestOffer")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.b2bPMLowestOffer)}
                    {renderSortIcon("lowestOffer", sortField, sortDir)}
                  </span>
                </th>
                <th scope="col" className={TH_PLAIN}>
                  {t(localizationConstants.statusLabel)}
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
                      onClick={() =>
                        router.push(`/module/business/b2b/project-market/${row.id}`)
                      }
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        {row.refNr}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                        {row.project}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.date}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {row.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-700">
                        {row.requests}/10
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {row.municipality}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums font-medium text-slate-900">
                        {formatCurrency(row.lowestOffer)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td
                        className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3 group-hover:bg-slate-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            className="h-9 cursor-pointer whitespace-nowrap bg-slate-100 px-2 text-sm font-medium text-slate-900 shadow-none hover:bg-slate-200"
                            onClick={() =>
                              router.push(`/module/business/b2b/project-market/${row.id}`)
                            }
                          >
                            {t(localizationConstants.b2bPMViewProject)}
                          </Button>
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
                              <DropdownMenuItem className="cursor-pointer">
                                {t(localizationConstants.b2bDealArchiveAction)}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                {t(localizationConstants.b2bDealDelete)}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={SKELETON_COL_COUNT}
                        className="px-4 py-12 text-center text-sm text-slate-400"
                      >
                        {t(localizationConstants.b2bPMEmpty)}
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
