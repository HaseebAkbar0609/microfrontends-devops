"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  MoreVertical,
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
import { formatCurrency } from "@/utils/formatCurrency";
import { OfferAcceptedItem } from "../types/offer";
import { OfferQuotedTypeBadge } from "./OfferQuotedTypeBadge";

type SortField = keyof Pick<
  OfferAcceptedItem,
  | "offertNr"
  | "job"
  | "customerName"
  | "category"
  | "municipality"
  | "acceptedPrice"
  | "type"
>;
type SortDir = "asc" | "desc" | null;

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
  "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

function renderSortIcon(
  field: SortField,
  activeSortField: SortField | null,
  activeSortDir: SortDir,
) {
  if (activeSortField !== field)
    return <ChevronsUpDown size={14} className="shrink-0 text-slate-400" />;
  if (activeSortDir === "asc") return <ChevronUp size={14} className="shrink-0" />;
  return <ChevronDown size={14} className="shrink-0" />;
}

interface Props {
  offerId: string;
  items: OfferAcceptedItem[];
}

export function OfferAcceptedView({ offerId, items }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const debouncedSearch = useDebounce(search, 300);
  const uniqueTypes = useMemo(
    () => [...new Set(items.map((i) => i.type))],
    [items],
  );
  const activeFilterCount = selectedTypes.length;

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        item.offertNr.toLowerCase().includes(q) ||
        item.job.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q);
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);
      return matchesSearch && matchesType;
    });
  }, [debouncedSearch, selectedTypes, items]);

  const sorted = useMemo(() => {
    if (!sortField || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortField] as string | number;
      const bv = b[sortField] as string | number;
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalSum = filtered.reduce((sum, i) => sum + i.acceptedPrice, 0);

  function toggleSort(field: SortField) {
    if (sortField !== field) {
      setSortField(field);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortField(null);
      setSortDir(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
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
            <Button
              variant="outline"
              size="sm"
              className="h-9 cursor-pointer gap-1.5 text-sm"
            >
              {t(localizationConstants.filter)}
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel className="text-xs font-medium text-slate-500">
              {t(localizationConstants.offerQuotedType)}
            </DropdownMenuLabel>
            {uniqueTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => {
                  setSelectedTypes((prev) =>
                    checked ? [...prev, type] : prev.filter((x) => x !== type),
                  );
                  setPage(1);
                }}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
            {activeFilterCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-xs text-slate-500"
                  onClick={() => {
                    setSelectedTypes([]);
                    setPage(1);
                  }}
                >
                  {t(localizationConstants.clearFilters)}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        {/* Total sum */}
        <p className="text-base font-semibold text-slate-900">
          {t(localizationConstants.offerAcceptedTotalLabel)}{" "}
          {formatCurrency(totalSum)}
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-275 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th
                  className={TH_SORTABLE}
                  onClick={() => toggleSort("offertNr")}
                >
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.offerQuotedOffertNr)}
                    {renderSortIcon("offertNr", sortField, sortDir)}
                  </span>
                </th>
                <th className={TH_SORTABLE} onClick={() => toggleSort("job")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.offerAcceptedAllJobs)}
                    {renderSortIcon("job", sortField, sortDir)}
                  </span>
                </th>
                <th
                  className={TH_SORTABLE}
                  onClick={() => toggleSort("customerName")}
                >
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.offerQuotedCustomerName)}
                    {renderSortIcon("customerName", sortField, sortDir)}
                  </span>
                </th>
                <th
                  className={TH_SORTABLE}
                  onClick={() => toggleSort("category")}
                >
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.offerQuotedCategory)}
                    {renderSortIcon("category", sortField, sortDir)}
                  </span>
                </th>
                <th className={TH_PLAIN}>
                  {t(localizationConstants.statusLabel)}
                </th>
                <th
                  className={TH_SORTABLE}
                  onClick={() => toggleSort("municipality")}
                >
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.offerQuotedMunicipality)}
                    {renderSortIcon("municipality", sortField, sortDir)}
                  </span>
                </th>
                <th
                  className={TH_SORTABLE}
                  onClick={() => toggleSort("acceptedPrice")}
                >
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.offerAcceptedPrice)}
                    {renderSortIcon("acceptedPrice", sortField, sortDir)}
                  </span>
                </th>
                <th className={TH_SORTABLE} onClick={() => toggleSort("type")}>
                  <span className="flex items-center gap-1">
                    {t(localizationConstants.offerQuotedType)}
                    {renderSortIcon("type", sortField, sortDir)}
                  </span>
                </th>
                <th className="px-2 py-3 text-left">
                  <button
                    type="button"
                    aria-label="Add column"
                    className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-sm text-slate-400 hover:bg-slate-50"
                  >
                    +
                  </button>
                </th>
                <th className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr
                  key={row.id}
                  className="group border-b border-slate-200 last:border-0 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {row.offertNr}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    <span className="block max-w-36 truncate">{row.job}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {row.customerName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {row.category}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t(localizationConstants.offerAcceptedStatusBadge)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {row.municipality}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 tabular-nums">
                    {formatCurrency(row.acceptedPrice)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <OfferQuotedTypeBadge type={row.type} />
                  </td>
                  <td className="px-2 py-3" />
                  <td className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3 group-hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 cursor-pointer bg-slate-900 px-3 text-xs font-medium text-white hover:bg-slate-700"
                        onClick={() =>
                          router.push(
                            `/module/business/offer/${offerId}/agreed`,
                          )
                        }
                      >
                        {t(localizationConstants.offerAcceptedCreateContract)}
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 cursor-pointer bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                        onClick={() =>
                          router.push(
                            `/module/business/offer/${offerId}/quoted`,
                          )
                        }
                      >
                        {t(localizationConstants.offerAcceptedViewOffer)}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 cursor-pointer p-0"
                          >
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                            {t(localizationConstants.offerQuotedActionDelete)}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            {t(localizationConstants.offerQuotedActionArchive)}
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
                    colSpan={10}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    {t(localizationConstants.noQuotesFound)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span>{t(localizationConstants.rowsPerPageLabel)}</span>
            <span className="flex h-8 w-16 items-center justify-between rounded border border-slate-200 px-2 text-sm">
              {rowsPerPage}
              <ChevronsUpDown size={12} className="text-slate-400" />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                «
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                ›
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                »
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
