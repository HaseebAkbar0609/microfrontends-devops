"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  MoreVertical,
  CheckCheck,
  ClockFading,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  ArchiveX,
  MessageCircleMore,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbUIItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { OFFER_ROUTES } from "../constants/offerRoutes";
import { OfferArchivedItem, OfferAgreedStatus } from "../types/offer";
import { OfferArchivedCommentModal } from "./OfferArchivedCommentModal";
import {
  addOfferCommentAPIAction,
  deleteOfferAPIAction,
} from "@/api-actions/offers";
import { restoreOffer } from "../services/commissionService";

type SortField = keyof Pick<
  OfferArchivedItem,
  | "contractNr"
  | "jobName"
  | "customerName"
  | "status"
  | "municipality"
  | "jobType"
  | "agreedPrice"
>;

const SKELETON_COL_COUNT = 9;

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={`skeleton-${i}`} className="border-b border-slate-100">
          {Array.from({ length: SKELETON_COL_COUNT }).map((_, j) => (
            <td key={j} className="px-4 py-3.5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function renderArchivedStatusBadge(
  status: OfferAgreedStatus,
  signedLabel: string,
  waitingLabel: string,
) {
  if (status === "signed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCheck size={13} className="text-emerald-600" />
        {signedLabel}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
      <ClockFading size={13} className="text-amber-600" />
      {waitingLabel}
    </span>
  );
}

function ArchivedStatusActionButton({
  status,
  rowId,
  offerId,
  agreementId,
  onNavigate,
}: {
  status: OfferAgreedStatus;
  rowId: string;
  offerId: string;
  agreementId?: string;
  onNavigate: (path: string) => void;
}) {
  const isSigned = status === "signed";
  const actionLabelKey = isSigned
    ? localizationConstants.offerAgreedViewAgreement
    : localizationConstants.offerAgreedSign;

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 px-3 text-xs font-medium bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer shadow-xs"
      onClick={() =>
        onNavigate(
          isSigned && agreementId
            ? `/module/business-support/agreement/${agreementId}`
            : OFFER_ROUTES.createAgreement(rowId || offerId),
        )
      }
    >
      <Translate text={actionLabelKey} />
    </Button>
  );
}

interface Props {
  offerId: string;
  items: OfferArchivedItem[];
  isLoading?: boolean;
  onSearchChange?: (value: string) => void;
}

export function OfferArchivedView({ offerId, items, isLoading = false, onSearchChange }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [archivedList, setArchivedList] = useState<OfferArchivedItem[]>(items);
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<OfferAgreedStatus[]>([]);
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [commentModal, setCommentModal] = useState<{
    open: boolean;
    offertNr: string;
    job: string;
    mappingId?: string;
  }>({ open: false, offertNr: "", job: "", mappingId: undefined });

  useEffect(() => {
    setArchivedList(items);
  }, [items]);

  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => onSearchChange?.(debouncedSearch), [debouncedSearch, onSearchChange]);
  const activeFilterCount = selectedStatuses.length;

  const signedLabel = t(localizationConstants.offerAgreedStatusSigned);
  const waitingLabel = t(localizationConstants.offerAgreedStatusWaiting);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return archivedList.filter((item) => {
      const matchesSearch =
        item.contractNr.toLowerCase().includes(q) ||
        item.jobName.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.municipality.toLowerCase().includes(q);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, selectedStatuses, archivedList]);

  const sorted = useMemo(
    () =>
      sortItems(filtered, sortField, sortDir, (item, field) =>
        item[field as keyof OfferArchivedItem] as string | number,
      ),
    [filtered, sortField, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  async function handleDelete(row: OfferArchivedItem) {
    if (!row.mappingId) return showToast("error", "Offer identifier is missing");
    const result = await deleteOfferAPIAction(row.mappingId);
    if (!result.success) return showToast("error", result.error || "Offer could not be deleted");
    setArchivedList((prev) => prev.filter((i) => i.id !== row.id));
    showToast(
      "success",
      `${row.jobName}: ${t(localizationConstants.offerArchivedDeletedToast)}`,
    );
  }

  async function handleUnarchive(row: OfferArchivedItem) {
    if (!row.mappingId) return showToast("error", "Offer identifier is missing");
    try { await restoreOffer(row.mappingId); }
    catch { return showToast("error", t(localizationConstants.commissionRestoreError)); }
    setArchivedList((prev) => prev.filter((i) => i.id !== row.id));
    showToast(
      "success",
      `${row.jobName}: ${t(localizationConstants.offerArchivedRestoredToast)}`,
    );
  }

  const columns: { key: SortField; label: string }[] = [
    {
      key: "contractNr",
      label: t(localizationConstants.offerArchivedQuoteNr),
    },
    { key: "jobName", label: t(localizationConstants.offerAcceptedAllJobs) },
    {
      key: "customerName",
      label: t(localizationConstants.offerQuotedCustomerName),
    },
    { key: "status", label: t(localizationConstants.statusLabel) },
    {
      key: "municipality",
      label: t(localizationConstants.offerQuotedMunicipality),
    },
    { key: "jobType", label: t(localizationConstants.offerAgreedJobType) },
    { key: "agreedPrice", label: t(localizationConstants.offerAgreedPrice) },
  ];

  return (
    <div className="flex flex-1 flex-col bg-slate-50/60 min-h-screen font-sans">
      {/* Subheader with Page Title and Breadcrumbs */}
      <div className="px-6 pt-5 pb-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          <Translate text={localizationConstants.offerTabArchived} />
        </h2>
        <Breadcrumb>
          <BreadcrumbList className="flex items-center flex-wrap gap-1 text-[#64748B]">
            <BreadcrumbUIItem className="flex items-center gap-1 text-sm!">
              <BreadcrumbLink
                asChild
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              >
                <Link href="/home">
                  <Translate text={localizationConstants.breadcrumbHome} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbUIItem>
            <BreadcrumbSeparator className="text-[#64748B]" />
            <BreadcrumbUIItem className="flex items-center gap-1 text-sm!">
              <BreadcrumbLink
                asChild
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              >
                <Link href="/module">
                  <Translate text={localizationConstants.breadcrumbModule} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbUIItem>
            <BreadcrumbSeparator className="text-[#64748B]" />
            <BreadcrumbUIItem className="flex items-center gap-1 text-sm!">
              <BreadcrumbLink
                asChild
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              >
                <Link href="/module/business">
                  <Translate text={localizationConstants.breadcrumbBusiness} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbUIItem>
            <BreadcrumbSeparator className="text-[#64748B]" />
            <BreadcrumbUIItem className="flex items-center gap-1 text-sm!">
              <BreadcrumbLink
                asChild
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              >
                <Link href="/module/business/offer">
                  <Translate text={localizationConstants.breadcrumbOffer} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbUIItem>
            <BreadcrumbSeparator className="text-[#64748B]" />
            <BreadcrumbPage className="font-sans text-sm leading-5 tracking-normal text-[#64748B] font-normal!">
              <Translate text={localizationConstants.offerTabArchived} />
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content Card Container */}
      <div className="px-6 pb-6 flex-1 flex flex-col">
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col p-6 gap-5">
          {/* Card Header Section: Search & Filter */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Search Input */}
            <Search
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder={t(localizationConstants.search)}
              wrapperClassName="w-64"
              className="h-9 text-xs"
            />

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 gap-1.5 border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer"
                >
                  <Translate text={localizationConstants.filter} />
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown size={14} className="text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 text-xs">
                <DropdownMenuLabel className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <Translate text={localizationConstants.statusLabel} />
                </DropdownMenuLabel>
                {(["signed", "waiting_signature"] as OfferAgreedStatus[]).map(
                  (status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={(checked) => {
                        setSelectedStatuses((prev) =>
                          checked
                            ? [...prev, status]
                            : prev.filter((s) => s !== status),
                        );
                        setPage(1);
                      }}
                      className="cursor-pointer"
                    >
                      {status === "signed" ? signedLabel : waitingLabel}
                    </DropdownMenuCheckboxItem>
                  ),
                )}
                {activeFilterCount > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-xs font-medium text-red-600 focus:text-red-600"
                      onClick={() => {
                        setSelectedStatuses([]);
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

          {/* Data Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-270">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                      onClick={() => toggleSort(col.key)}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {renderSortIcon(col.key, sortField, sortDir)}
                      </span>
                    </th>
                  ))}
                  {/* Agreement button column empty header */}
                  <th className="whitespace-nowrap px-4 py-3.5" />
                  {/* Actions column (Sticky Right) */}
                  <th className="sticky right-0 z-10 bg-white px-4 py-3.5 text-right w-44 before:absolute before:inset-y-0 before:left-0 before:w-[0.5px] before:bg-slate-200" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <SkeletonRows count={pageSize} />
                ) : (
                  <>
                    {paginated.map((row) => (
                      <tr
                        key={row.id}
                        className="group hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Citat nr. */}
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 font-normal">
                          {row.contractNr}
                        </td>

                        {/* Alla jobb (Bold) */}
                        <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-900">
                          {row.jobName}
                        </td>

                        {/* Kundnamn */}
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 font-normal">
                          {row.customerName}
                        </td>

                        {/* Status Badge */}
                        <td className="whitespace-nowrap px-4 py-3.5">
                          {renderArchivedStatusBadge(
                            row.status,
                            signedLabel,
                            waitingLabel,
                          )}
                        </td>

                        {/* Kommun/ ort */}
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 font-normal">
                          {row.municipality}
                        </td>

                        {/* Jobb typ */}
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 font-normal">
                          {row.jobType || "-"}
                        </td>

                        {/* Avtalat pris */}
                        <td className="whitespace-nowrap px-4 py-3.5 font-normal text-slate-900 tabular-nums">
                          {row.agreedPrice > 0
                            ? formatCurrency(row.agreedPrice)
                            : "—"}
                        </td>

                        {/* Agreement Action button column (Status based: Se Avtal for signed, Signera for waiting) */}
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <ArchivedStatusActionButton
                            status={row.status}
                            rowId={row.id}
                            offerId={offerId}
                            agreementId={row.agreementId}
                            onNavigate={router.push}
                          />
                        </td>

                        {/* Actions (Sticky Right) */}
                        <td className="sticky right-0 z-10 bg-white px-4 py-3.5 group-hover:bg-slate-50 before:absolute before:inset-y-0 before:left-0 before:w-[0.5px] before:bg-slate-200">
                          <div className="flex items-center justify-end gap-2.5">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 cursor-pointer p-0 text-slate-700 hover:text-slate-900"
                                  aria-label={t(localizationConstants.actions)}
                                >
                                  <MoreVertical className="h-4 w-4 text-slate-700" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-44 text-xs"
                              >
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2 text-slate-800"
                                  onClick={() => void handleDelete(row)}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-slate-700" />
                                  <Translate
                                    text={localizationConstants.offerArchivedDelete}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2 text-slate-800"
                                  onClick={() => void handleUnarchive(row)}
                                >
                                  <ArchiveX className="h-3.5 w-3.5 text-slate-700" />
                                  <Translate
                                    text={localizationConstants.offerArchivedUnarchive}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2 text-slate-800"
                                  onClick={() =>
                                    setCommentModal({
                                      open: true,
                                      offertNr: row.contractNr,
                                      job: row.jobName,
                                      mappingId: row.mappingId,
                                    })
                                  }
                                >
                                  <MessageCircleMore className="h-3.5 w-3.5 text-slate-700" />
                                  <Translate
                                    text={
                                      localizationConstants.offerArchivedCommentAction
                                    }
                                  />
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs font-medium bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer shadow-xs"
                              onClick={() =>
                                router.push(
                                  OFFER_ROUTES.archivedProject(row.id, offerId),
                                )
                              }
                            >
                              <Translate
                                text={
                                  localizationConstants.offerArchivedViewTheProject
                                }
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {paginated.length === 0 && (
                      <tr>
                        <td
                          colSpan={columns.length + 2}
                          className="px-4 py-12 text-center text-xs text-slate-400"
                        >
                          <Translate
                            text={localizationConstants.noQuotesFound}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Section */}
          <div className="flex items-center justify-center sm:justify-end gap-6 py-2 px-1 text-sm text-slate-600 flex-wrap">
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

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded border-slate-200 bg-transparent text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                onClick={() => setPage(1)}
                disabled={page <= 1}
                aria-label="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded border-slate-200 bg-transparent text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded border-slate-200 bg-transparent text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded border-slate-200 bg-transparent text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                aria-label="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OfferArchivedCommentModal
        open={commentModal.open}
        offertNr={commentModal.offertNr}
        job={commentModal.job}
        onClose={() => setCommentModal({ open: false, offertNr: "", job: "", mappingId: undefined })}
        onSubmit={async (comment) => {
          if (!commentModal.mappingId) return false;
          const result = await addOfferCommentAPIAction(commentModal.mappingId, comment);
          return result.success;
        }}
      />
    </div>
  );
}
