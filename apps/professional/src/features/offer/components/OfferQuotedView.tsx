"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Trash2,
  Archive,
  CheckCircle,
  MessageCircleMore,
  MessagesSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { OFFER_QUOTED_BREADCRUMBS } from "../constants/offerQuoted";
import { OfferQuotedItem } from "../types/offer";
import { OfferQuotedStatusBadge } from "./OfferQuotedStatusBadge";
import { OfferQuotedContactCell } from "./OfferQuotedContactCell";
import { OfferQuotedCommentModal } from "./OfferQuotedCommentModal";
import { OfferQuotedAnswerModal } from "./OfferQuotedAnswerModal";
import { OfferQuotedCategoryBadge } from "./OfferQuotedCategoryBadge";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbUIItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Translate } from "@/utils/translation/translate";
import { listOffersAPIAction } from "@/api-actions/offers";
import { authStorage } from "@/lib/authStorage";
import { ProfessionalRow } from "@/types/company";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";

type SortField = keyof Pick<
  OfferQuotedItem,
  | "offertNr"
  | "job"
  | "customerName"
  | "category"
  | "municipality"
  | "type"
  | "price"
  | "status"
  | "contactPerson"
>;

type CommentModal = { open: boolean; offertNr: string; job: string };
type AnswerModal = {
  open: boolean;
  offertNr: string;
  job: string;
  answer: string;
};

interface Props {
  offerId: string;
  items: OfferQuotedItem[];
}

export function OfferQuotedView({ offerId, items: initialItems }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [items, setItems] = useState<OfferQuotedItem[]>(initialItems);
  const [totalItems, setTotalItems] = useState(initialItems.length);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [commentModal, setCommentModal] = useState<CommentModal>({
    open: false,
    offertNr: "",
    job: "",
  });

  const [answerModal, setAnswerModal] = useState<AnswerModal>({
    open: false,
    offertNr: "",
    job: "",
    answer: "",
  });

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let isMounted = true;
    async function fetchQuotedOffers() {
      if (isMounted) setIsLoading(true);
      try {
        const companyData = authStorage.getCompanyData() as ProfessionalRow | null;
        const result = await listOffersAPIAction({
          status: "OFFERED",
          page,
          pageSize,
          search: debouncedSearch,
          companyId: companyData?.id,
        });
        if (!isMounted) return;
        if (result && result.items && result.items.length > 0) {
          const mapped: OfferQuotedItem[] = result.items.map((item, idx) => ({
            id: item.id || String(idx),
            offertNr: item.idNumber,
            job: item.jobName,
            customerName: item.jobName,
            category: item.category || t(localizationConstants.offerQuotedCategory),
            municipality: item.municipality || "",
            type: item.type || t(localizationConstants.offerQuotedType),
            price: 0,
            status: "notReviewed" as const,
            contactPerson: {
              name: item.jobName,
              phone: "",
              email: "",
            },
          }));
          setItems(mapped);
          setTotalItems(result.totalItems);
        } else {
          setItems(initialItems);
          setTotalItems(initialItems.length);
        }
      } catch {
        if (isMounted) {
          setItems(initialItems);
          setTotalItems(initialItems.length);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchQuotedOffers();
    return () => { isMounted = false; };
  }, [page, pageSize, debouncedSearch, initialItems, t]);

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
        return item[field as keyof OfferQuotedItem] as string | number;
      }),
    [filtered, sortField, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalSum = filtered.reduce((sum, i) => sum + i.price, 0);

  function openCommentModal(item: OfferQuotedItem) {
    setCommentModal({ open: true, offertNr: item.offertNr, job: item.job });
  }

  function openAnswerModal(item: OfferQuotedItem) {
    setAnswerModal({
      open: true,
      offertNr: item.offertNr,
      job: item.job,
      answer: item.customerAnswer || "",
    });
  }

  const columns: { key: SortField; label: string }[] = [
    { key: "offertNr", label: t(localizationConstants.offerQuotedOffertNr) },
    { key: "job", label: t(localizationConstants.offerQuotedJob) },
    { key: "customerName", label: t(localizationConstants.offerQuotedCustomerName) },
    { key: "category", label: t(localizationConstants.offerQuotedCategory) },
    { key: "municipality", label: t(localizationConstants.offerQuotedMunicipality) },
    { key: "type", label: t(localizationConstants.offerQuotedType) },
    { key: "price", label: t(localizationConstants.offerQuotedPrice) },
    { key: "status", label: t(localizationConstants.statusLabel) },
    { key: "contactPerson", label: t(localizationConstants.offerQuotedContactPerson) },
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
            <span>{t(localizationConstants.offerTabQuoted)}</span>
          </button>
        </div>
        <Breadcrumb>
          <BreadcrumbList className="flex items-center flex-wrap gap-1 text-slate-500 text-xs">
            {OFFER_QUOTED_BREADCRUMBS.map((item, index) => {
              const isLast = index === OFFER_QUOTED_BREADCRUMBS.length - 1;
              return (
                <BreadcrumbUIItem key={`${item.label}-${index}`} className="flex items-center gap-1 text-xs">
                  {index !== 0 && <BreadcrumbSeparator className="text-slate-400" />}
                  {isLast ? (
                    <BreadcrumbPage className="text-xs text-slate-500 font-normal">
                      <Translate text={item.label} />
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href || "#"} className="text-xs text-slate-500 hover:text-slate-900 transition-colors font-normal">
                        <Translate text={item.label} />
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbUIItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col px-5 py-4">
            <div className="rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 px-5 py-3">
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
                      className="h-9 cursor-pointer gap-1.5 border-slate-200 bg-white text-sm"
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

              <div className="px-5 py-3">
                <p className="text-base font-semibold text-slate-900">
                  {t(localizationConstants.offerQuotedTotalLabel)}{" "}
                  {formatCurrency(totalSum)}
                </p>
              </div>

              <div className="overflow-x-auto p-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-track]:bg-slate-100">
                <table className="min-w-275 w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white">
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800"
                          onClick={() => toggleSort(col.key)}
                        >
                          <span className="flex items-center gap-1">
                            {col.label}
                            {renderSortIcon(col.key, sortField, sortDir)}
                          </span>
                        </th>
                      ))}
                      <th className="sticky right-0 bg-white px-4 py-3" style={{ boxShadow: "inset 1px 0 0 0 #e2e8f0" }}>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            aria-label={t(localizationConstants.addColumnLabel)}
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          >
                            +
                          </button>
                        </div>
                      </th>
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
                          <OfferQuotedCategoryBadge category={row.category} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {row.municipality}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {row.type}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 tabular-nums">
                          {formatCurrency(row.price)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <OfferQuotedStatusBadge item={row} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <OfferQuotedContactCell item={row} />
                        </td>
                        <td className="sticky right-0 bg-white px-4 py-3 group-hover:bg-slate-50" style={{ boxShadow: "inset 1px 0 0 0 #e2e8f0" }}>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              className="h-8 cursor-pointer bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                              onClick={() => {
                                const targetId = row.id || offerId;
                                if (targetId) {
                                  router.push(
                                    offerId
                                      ? `/module/business/offer/${offerId}/agreed/project/${targetId}`
                                      : `/module/business/offer/agreed/project/${targetId}`,
                                  );
                                }
                              }}
                            >
                              {t(localizationConstants.viewProject)}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 cursor-pointer p-0"
                                  aria-label={t(localizationConstants.actions)}
                                >
                                  <MoreVertical size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[170px]">
                                <DropdownMenuItem className="cursor-pointer">
                                  <Trash2 size={12} strokeWidth={1.33} className="mr-2 h-[13.33px] w-3 text-[#18181B]" />
                                  {t(localizationConstants.offerQuotedActionDelete)}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Archive size={12} strokeWidth={1.33} className="mr-2 h-[13.33px] w-3 text-[#18181B]" />
                                  {t(localizationConstants.offerQuotedActionArchive)}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <CheckCircle size={12} strokeWidth={1.33} className="mr-2 h-[13.33px] w-3 text-[#18181B]" />
                                  {t(localizationConstants.offerQuotedActionAccept)}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => openCommentModal(row)}
                                >
                                  <MessageCircleMore size={12} strokeWidth={1.33} className="mr-2 h-[13.33px] w-3 text-[#18181B]" />
                                  {t(localizationConstants.offerQuotedActionComment)}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => openAnswerModal(row)}
                                >
                                  <MessagesSquare size={12} strokeWidth={1.33} className="mr-2 h-[13.33px] w-3 text-[#18181B]" />
                                  {t(localizationConstants.offerQuotedActionViewAnswer)}
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
                          colSpan={columns.length + 1}
                          className="px-4 py-12 text-center text-sm text-slate-400"
                        >
                          {t(localizationConstants.noQuotesFound)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Section Inside the Card */}
              <div className="flex items-center justify-center sm:justify-end gap-6 py-3 px-5 text-sm text-slate-600 flex-wrap border-t border-slate-100">
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
        </>
      )}

      <OfferQuotedCommentModal
        open={commentModal.open}
        offertNr={commentModal.offertNr}
        job={commentModal.job}
        onClose={() => setCommentModal((prev) => ({ ...prev, open: false }))}
      />

      <OfferQuotedAnswerModal
        open={answerModal.open}
        offertNr={answerModal.offertNr}
        job={answerModal.job}
        answer={answerModal.answer}
        onClose={() => setAnswerModal((prev) => ({ ...prev, open: false }))}
        onLeaveComment={() => {
          setAnswerModal((prev) => ({ ...prev, open: false }));
          setCommentModal({
            open: true,
            offertNr: answerModal.offertNr,
            job: answerModal.job,
          });
        }}
      />
    </div>
  );
}
