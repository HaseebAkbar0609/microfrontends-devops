"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, MoreVertical } from "lucide-react";
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
import { OFFER_ROUTES } from "../constants/offerRoutes";
import { OfferQuotedItem } from "../types/offer";
import { OfferTablePagination } from "./OfferTablePagination";
import { OfferQuotedTypeBadge } from "./OfferQuotedTypeBadge";
import { OfferQuotedStatusBadge } from "./OfferQuotedStatusBadge";
import { OfferQuotedContactCell } from "./OfferQuotedContactCell";
import { OfferQuotedCommentModal } from "./OfferQuotedCommentModal";
import { OfferQuotedAnswerModal } from "./OfferQuotedAnswerModal";

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

export function OfferQuotedView({ offerId, items }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

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

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalSum = filtered.reduce((sum, i) => sum + i.price, 0);

  function openCommentModal(item: OfferQuotedItem) {
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
          {formatCurrency(totalSum)}
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
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
                    <OfferQuotedTypeBadge type={row.type} />
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
                  <td className="px-2 py-3" />
                  <td className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3 group-hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 cursor-pointer bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
                        onClick={() =>
                          router.push(OFFER_ROUTES.request(offerId))
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

        <OfferTablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
        />
      </div>

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
