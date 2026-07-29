"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  MoreVertical,
  AtSign,
  Circle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { OfferQuotedItem } from "../types/offer";

type SortField = keyof Pick<
  OfferQuotedItem,
  "offertNr" | "job" | "customerName" | "category" | "municipality" | "type" | "price" | "status" | "contactPerson"
>;
type SortDir = "asc" | "desc" | null;

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

export function OfferQuotedView({ offerId, items }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [commentModal, setCommentModal] = useState<CommentModal>({
    open: false,
    offertNr: "",
    job: "",
  });
  const [commentText, setCommentText] = useState("");

  const [answerModal, setAnswerModal] = useState<AnswerModal>({
    open: false,
    offertNr: "",
    job: "",
    answer: "",
  });

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
      let av: string | number;
      let bv: string | number;
      if (sortField === "contactPerson") {
        av = a.contactPerson.name;
        bv = b.contactPerson.name;
      } else {
        av = a[sortField] as string | number;
        bv = b[sortField] as string | number;
      }
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalSum = filtered.reduce((sum, i) => sum + i.price, 0);

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

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <ChevronsUpDown size={14} className="shrink-0 text-slate-400" />;
    if (sortDir === "asc") return <ChevronUp size={14} className="shrink-0" />;
    return <ChevronDown size={14} className="shrink-0" />;
  }

  function openCommentModal(item: OfferQuotedItem) {
    setCommentText("");
    setCommentModal({ open: true, offertNr: item.offertNr, job: item.job });
  }

  function openAnswerModal(item: OfferQuotedItem) {
    if (!item.customerAnswer) return;
    setAnswerModal({
      open: true,
      offertNr: item.offertNr,
      job: item.job,
      answer: item.customerAnswer,
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

  function TypeBadge({ type }: { type: string }) {
    const lower = type.toLowerCase();
    const isExpress = lower === "express";
    const isB2C = lower === "b2c";
    return (
      <span
        className={cn(
          "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
          isExpress && "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
          isB2C && "bg-slate-800 text-white",
          !isExpress && !isB2C && "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
        )}
      >
        {type}
      </span>
    );
  }

  function StatusBadge({ item }: { item: OfferQuotedItem }) {
    const isOpened = item.status === "opened";
    return (
      <div className="group/status relative inline-block">
        <span
          className={cn(
            "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
            isOpened
              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
              : "bg-orange-50 text-orange-600 ring-1 ring-orange-200",
          )}
        >
          {isOpened ? (
            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
          ) : (
            <AtSign className="h-3 w-3" />
          )}
          {isOpened
            ? t(localizationConstants.offerQuotedStatusOpened)
            : t(localizationConstants.offerQuotedStatusNotReviewed)}
        </span>
        {isOpened && item.openedAt && (
          <div className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 hidden min-w-max rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-md group-hover/status:block">
            {t(localizationConstants.offerQuotedOpenedAt)} {item.openedAt}
          </div>
        )}
      </div>
    );
  }

  function ContactCell({ item }: { item: OfferQuotedItem }) {
    const initials = item.contactPerson.name
      .split(" ")
      .map((n) => n[0])
      .join(".")
      .toUpperCase();

    return (
      <div className="group/contact relative">
        <span className="cursor-default text-slate-600">{initials}</span>
        <div className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 hidden min-w-max rounded-md border border-slate-200 bg-white px-3 py-2 shadow-md group-hover/contact:block">
          <p className="text-xs font-medium text-slate-900">
            {item.contactPerson.phone}
          </p>
          <p className="text-xs text-slate-500">{item.contactPerson.email}</p>
        </div>
      </div>
    );
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
          {t(localizationConstants.offerQuotedTotalLabel)}{" "}
          {totalSum.toLocaleString("sv-SE")}
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm" style={{ minWidth: "1100px" }}>
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
                      <SortIcon field={col.key} />
                    </span>
                  </th>
                ))}
                {/* Add column button */}
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
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {row.municipality}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <TypeBadge type={row.type} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 tabular-nums">
                    {row.price.toLocaleString("sv-SE")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge item={row} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <ContactCell item={row} />
                  </td>
                  {/* Add column placeholder */}
                  <td className="px-2 py-3" />
                  {/* Sticky actions */}
                  <td className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3 group-hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 cursor-pointer bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                        onClick={() =>
                          router.push(
                            `/module/business/offer/${offerId}/request`,
                          )
                        }
                      >
                        {t(localizationConstants.viewProject)}
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
                          <DropdownMenuItem className="cursor-pointer">
                            {t(localizationConstants.offerQuotedActionAccept)}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => openCommentModal(row)}
                          >
                            {t(localizationConstants.offerQuotedActionComment)}
                          </DropdownMenuItem>
                          {row.customerAnswer && (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => openAnswerModal(row)}
                            >
                              {t(localizationConstants.offerQuotedActionViewAnswer)}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 3}
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

      {/* Leave Comment Modal */}
      <Dialog
        open={commentModal.open}
        onOpenChange={(open) =>
          setCommentModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="w-110 p-0">
          <DialogHeader className="border-b border-slate-100 px-6 py-4">
            <DialogTitle className="text-base font-semibold text-slate-900">
              {t(localizationConstants.offerQuotedCommentTitle)}
            </DialogTitle>
            <p className="mt-0.5 text-sm text-slate-500">
              {commentModal.job} – {commentModal.offertNr}
            </p>
          </DialogHeader>
          <div className="px-6 py-4">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t(localizationConstants.offerQuotedCommentPlaceholder)}
              className="min-h-28 resize-none bg-white text-sm"
            />
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
            <Button
              variant="outline"
              className="h-9 cursor-pointer px-5 text-sm"
              onClick={() =>
                setCommentModal((prev) => ({ ...prev, open: false }))
              }
            >
              {t(localizationConstants.cancel)}
            </Button>
            <Button
              className="h-9 cursor-pointer bg-neutral-950 px-5 text-sm text-white hover:bg-neutral-800"
              onClick={() =>
                setCommentModal((prev) => ({ ...prev, open: false }))
              }
            >
              {t(localizationConstants.offerQuotedCommentSend)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer's Answer Modal */}
      <Dialog
        open={answerModal.open}
        onOpenChange={(open) =>
          setAnswerModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="w-110 p-0">
          <DialogHeader className="border-b border-slate-100 px-6 py-4">
            <DialogTitle className="text-base font-semibold text-slate-900">
              {t(localizationConstants.offerQuotedAnswerTitle)}
            </DialogTitle>
            <p className="mt-0.5 text-sm text-slate-500">
              {answerModal.job} – {answerModal.offertNr}
            </p>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-slate-700">{answerModal.answer}</p>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <Button
              variant="outline"
              className="h-9 cursor-pointer px-5 text-sm"
              onClick={() =>
                setAnswerModal((prev) => ({ ...prev, open: false }))
              }
            >
              {t(localizationConstants.offerQuotedAnswerBack)}
            </Button>
            <Button
              className="h-9 cursor-pointer bg-neutral-950 px-5 text-sm text-white hover:bg-neutral-800"
              onClick={() => {
                setAnswerModal((prev) => ({ ...prev, open: false }));
                setCommentModal({
                  open: true,
                  offertNr: answerModal.offertNr,
                  job: answerModal.job,
                });
                setCommentText("");
              }}
            >
              {t(localizationConstants.offerQuotedAnswerLeaveComment)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
