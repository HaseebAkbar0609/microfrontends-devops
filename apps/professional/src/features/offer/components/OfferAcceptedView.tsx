"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { OFFER_ROUTES } from "../constants/offerRoutes";
import { OfferAcceptedItem } from "../types/offer";
import { DUMMY_ACCEPTED_ITEMS } from "../constants/offerAccepted.mock";
import { OFFER_ACCEPTED_BREADCRUMBS } from "../constants/offerAccepted";
import { authStorage } from "@/lib/authStorage";
import { ProfessionalRow } from "@/types/company";
import { listOffersAPIAction, OFFER_API_STATUS } from "@/api-actions/offers";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";

type SortField = keyof Pick<
  OfferAcceptedItem,
  | "offertNr"
  | "job"
  | "customerName"
  | "category"
  | "municipality"
  | "acceptedPrice"
  | "type"
  | "contactPerson"
>;

const SKELETON_COL_COUNT = 10;

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-slate-200">
          {Array.from({ length: SKELETON_COL_COUNT }).map((_, j) => (
            <td key={j} className="px-4 py-3 first:pl-6 last:pr-6">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

interface RowProps {
  row: OfferAcceptedItem;
  statusBadgeLabel: string;
  createContractLabel: string;
  viewOfferLabel: string;
  onCreateContract: (id: string) => void;
  onViewOffer: () => void;
}

const OfferAcceptedTableRow = React.memo(function OfferAcceptedTableRow({
  row,
  statusBadgeLabel,
  createContractLabel,
  viewOfferLabel,
  onCreateContract,
  onViewOffer,
}: RowProps) {
  return (
    <tr className="group border-b border-slate-200 last:border-0 hover:bg-slate-50">
      <td className="whitespace-nowrap px-4 py-3 text-slate-900">{row.offertNr}</td>
      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
        <span className="block max-w-36 truncate">{row.job}</span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-slate-900">{row.customerName}</td>
      <td className="whitespace-nowrap px-4 py-3">
        <span className="inline-flex items-center rounded-[4px] border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500">
          {row.category}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span className="inline-flex items-center rounded-[4px] border border-emerald-500 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
          {statusBadgeLabel}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-slate-900">{row.municipality}</td>
      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 tabular-nums">
        {formatCurrency(row.acceptedPrice)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-slate-900">{row.type}</td>
      <td className="whitespace-nowrap px-4 py-3 text-slate-900">{row.contactPerson.name}</td>
      <td className="whitespace-nowrap px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 cursor-pointer font-sans font-medium text-sm leading-6 tracking-normal border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 px-4 transition-colors shadow-none rounded-md"
            onClick={() => onCreateContract(row.id)}
          >
            {createContractLabel}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 cursor-pointer font-sans font-medium text-sm leading-6 tracking-normal border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 px-4 transition-colors shadow-none rounded-md"
            onClick={onViewOffer}
          >
            {viewOfferLabel}
          </Button>
        </div>
      </td>
    </tr>
  );
});

interface Props {
  initialItems?: OfferAcceptedItem[];
  items?: OfferAcceptedItem[];
  offerId?: string;
}

export function OfferAcceptedView({ initialItems, items: itemsProp, offerId: _offerId }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState<OfferAcceptedItem[]>(itemsProp ?? initialItems ?? DUMMY_ACCEPTED_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const passedItems = itemsProp ?? initialItems;
    if (passedItems && passedItems.length > 0) {
      setItems(passedItems);
      return;
    }

    let cancelled = false;
    async function fetchAccepted() {
      setIsLoading(true);
      try {
        const companyData = authStorage.getCompanyData() as ProfessionalRow | null;
        const result = await listOffersAPIAction({
          status: OFFER_API_STATUS.ACCEPTED,
          page: 1,
          pageSize: 100,
          companyId: companyData?.id,
        });

        if (!cancelled && result.items.length > 0) {
          const mapped: OfferAcceptedItem[] = result.items.map((item) => ({
            id: item.id,
            offertNr: item.idNumber || "N/A",
            job: item.jobName,
            customerName: item.jobName,
            category: item.category,
            municipality: item.municipality,
            acceptedPrice: 0,
            type: item.type,
            contactPerson: { name: "", phone: "", email: "" },
          }));
          setItems(mapped);
        }
      } catch {
        // keep dummy data
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchAccepted();
    return () => { cancelled = true; };
  }, [initialItems, itemsProp]);

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

  const sorted = useMemo(
    () =>
      sortItems(filtered, sortField, sortDir, (item, field) => {
        if (field === "contactPerson") return item.contactPerson.name;
        return item[field as keyof OfferAcceptedItem] as string | number;
      }),
    [filtered, sortField, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalSum = filtered.reduce((sum, i) => sum + i.acceptedPrice, 0);

  const columns: { key: SortField | "status"; label: string; sortable?: boolean }[] = [
    { key: "offertNr", label: t(localizationConstants.offerQuotedOffertNr) },
    { key: "job", label: t(localizationConstants.offerAcceptedAllJobs) },
    { key: "customerName", label: t(localizationConstants.offerQuotedCustomerName) },
    { key: "category", label: t(localizationConstants.offerQuotedCategory) },
    { key: "status", label: t(localizationConstants.statusLabel), sortable: false },
    { key: "municipality", label: t(localizationConstants.offerQuotedMunicipality) },
    { key: "acceptedPrice", label: t(localizationConstants.offerAcceptedPrice) },
    { key: "type", label: t(localizationConstants.offerQuotedType) },
    { key: "contactPerson", label: t(localizationConstants.offerAcceptedContactPerson) },
  ];

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex flex-col gap-1.5 px-6 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/module/business/offer/dashboard")}
            className="flex items-center gap-2 text-slate-900 font-bold text-lg hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t(localizationConstants.offerTabAccepted)}</span>
          </button>
        </div>
        <DynamicBreadcrumb
          items={OFFER_ACCEPTED_BREADCRUMBS.map((item) => ({
            translationKey: item.label,
            href: item.href,
          }))}
          variant="small"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 py-4">
        {/* Table Container with Search, Filter, Total text, and Table inside */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          {/* Top inside table container: Search + Filter */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Search
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder={localizationConstants.search}
              wrapperClassName="w-full sm:w-75 flex-shrink-0"
              className="h-9 text-xs"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-3 gap-1.5 border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                >
                  <Translate text={localizationConstants.filter} />
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 text-xs">
                <DropdownMenuLabel className="text-xs font-medium text-slate-500">
                  <Translate text={localizationConstants.offerQuotedType} />
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
                    className="text-xs cursor-pointer"
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
                      <Translate text={localizationConstants.clearFilters} />
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Text below search/filter inside table container with margin before the table */}
          <div className="mb-4">
            {isLoading ? (
              <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
            ) : (
              <p className="font-sans font-semibold text-base leading-6 tracking-normal text-slate-900">
                {t(localizationConstants.offerAcceptedTotalLabel)}{" "}
                {formatCurrency(totalSum)}
              </p>
            )}
          </div>

          {/* Table with horizontal scroll */}
          <div className="overflow-x-auto">
            <table className="min-w-275 w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={col.sortable !== false ? "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800" : "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500"}
                      onClick={col.sortable !== false ? () => toggleSort(col.key as SortField) : undefined}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.sortable !== false && renderSortIcon(col.key as SortField, sortField, sortDir)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <SkeletonRows count={pageSize} />
                ) : (
                  <>
                    {paginated.map((row) => (
                      <OfferAcceptedTableRow
                        key={row.id}
                        row={row}
                        statusBadgeLabel={t(localizationConstants.offerAcceptedStatusBadge)}
                        createContractLabel={t(localizationConstants.offerAcceptedCreateContract)}
                        viewOfferLabel={t(localizationConstants.offerAcceptedViewOffer)}
                        onCreateContract={(id) => router.push(OFFER_ROUTES.createAgreement(id))}
                        onViewOffer={() => router.push(OFFER_ROUTES.quoted())}
                      />
                    ))}

                    {paginated.length === 0 && (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="px-6 py-12 text-center text-sm text-slate-400"
                        >
                          {t(localizationConstants.noQuotesFound)}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Section Inside the Card */}
          <div className="flex items-center justify-center sm:justify-end gap-6 pt-4 pb-1 text-sm text-slate-600 flex-wrap border-t border-slate-100">
            {/* Rows per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                <Translate text={localizationConstants.rowsPerPage} />
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-18 border-slate-200 bg-transparent text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-0 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {[5, 10, 20, 30, 50].map((size) => (
                    <SelectItem
                      key={size}
                      value={String(size)}
                      className="cursor-pointer"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page counter */}
            <div className="text-sm font-medium text-slate-700 select-none flex items-center gap-1">
              <span>
                <Translate text={localizationConstants.pageLabel} />
              </span>
              <span>{page}</span>
              <span>
                <Translate text={localizationConstants.ofLabel} />
              </span>
              <span>{totalPages}</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-none"
                disabled={page <= 1}
                onClick={() => setPage(1)}
                title={t(localizationConstants.paginationFirstPage)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-none"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                title={t(localizationConstants.paginationPreviousPage)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-none"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                title={t(localizationConstants.paginationNextPage)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-none"
                disabled={page >= totalPages}
                onClick={() => setPage(totalPages)}
                title={t(localizationConstants.paginationLastPage)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
