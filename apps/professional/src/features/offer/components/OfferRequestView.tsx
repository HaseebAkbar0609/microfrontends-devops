"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ChevronDown,
	ArrowLeft,
	MoreVertical,
	Info,
	ChevronsUpDown,
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
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { OfferRequest } from "../constants/offerRequests";
import { OfferQuotedStatusBadge } from "./OfferQuotedStatusBadge";
import { OfferQuotedCommentModal } from "./OfferQuotedCommentModal";
import { OfferQuotedAnswerModal } from "./OfferQuotedAnswerModal";

type SortField = keyof Pick<
	OfferRequest,
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
	requests: OfferRequest[];
}

export function OfferRequestView({ requests }: Props) {
	const t = useTranslate();
	const router = useRouter();

	const [search, setSearch] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
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

	const uniqueCategories = useMemo(
		() => [...new Set(requests.map((r) => r.category).filter(Boolean))],
		[requests],
	);
	const uniqueTypes = useMemo(
		() => [...new Set(requests.map((r) => r.type).filter(Boolean))],
		[requests],
	);
	const uniqueMunicipalities = useMemo(
		() => [...new Set(requests.map((r) => r.municipality).filter(Boolean))],
		[requests],
	);

	const activeFilterCount =
		selectedCategories.length +
		selectedTypes.length +
		selectedMunicipalities.length +
		selectedStatuses.length;

	const filtered = useMemo(() => {
		const q = debouncedSearch.toLowerCase().trim();
		return requests.filter((item) => {
			const matchesSearch =
				!q ||
				item.offertNr.toLowerCase().includes(q) ||
				item.job.toLowerCase().includes(q) ||
				item.customerName.toLowerCase().includes(q) ||
				item.category.toLowerCase().includes(q) ||
				item.municipality.toLowerCase().includes(q) ||
				(item.contactPerson?.name && item.contactPerson.name.toLowerCase().includes(q));

			const matchesCategory =
				selectedCategories.length === 0 || selectedCategories.includes(item.category);
			const matchesType =
				selectedTypes.length === 0 || selectedTypes.includes(item.type);
			const matchesMuni =
				selectedMunicipalities.length === 0 ||
				selectedMunicipalities.includes(item.municipality);
			const matchesStatus =
				selectedStatuses.length === 0 ||
				selectedStatuses.includes(
					item.status === "opened" ? "opened" : "notReviewed",
				);

			return matchesSearch && matchesCategory && matchesType && matchesMuni && matchesStatus;
		});
	}, [
		debouncedSearch,
		selectedCategories,
		selectedTypes,
		selectedMunicipalities,
		selectedStatuses,
		requests,
	]);

	const sorted = useMemo(
		() =>
			sortItems(filtered, sortField, sortDir, (item, field) => {
				if (field === "contactPerson") return item.contactPerson?.name || "";
				return item[field as keyof OfferRequest] as string | number;
			}),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
	const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);
	const totalSum = 2500000; // Total summa OFFERERAD from Figma

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
    <div className="flex flex-1 flex-col bg-slate-50/60 min-h-screen font-sans">
      {/* Subheader with Back link and Breadcrumbs */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/module/business/offer/list")}
            className="flex items-center gap-2 text-slate-900 font-bold text-lg hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t(localizationConstants.offerTabRequest)}</span>
          </button>
        </div>
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
            <BreadcrumbUIItem className="flex items-center gap-1 text-sm!">
              <BreadcrumbSeparator className="text-[#64748B]" />
              <BreadcrumbLink
                asChild
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              >
                <Link href="/module">
                  <Translate text={localizationConstants.breadcrumbModule} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbUIItem>
            <BreadcrumbUIItem className="flex items-center gap-1 text-sm!">
              <BreadcrumbSeparator className="text-[#64748B]" />
              <BreadcrumbLink
                asChild
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              >
                <Link href="/module/business">
                  <Translate text={localizationConstants.breadcrumbBusiness} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbUIItem>
            <BreadcrumbUIItem className="flex items-center gap-1 text-sm!">
              <BreadcrumbSeparator className="text-[#64748B]" />
              <BreadcrumbLink
                asChild
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              >
                <Link href="/module/business/offer/list">
                  <Translate text={localizationConstants.breadcrumbOffer} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbUIItem>
            <BreadcrumbUIItem className="flex items-center gap-1 text-sm!">
              <BreadcrumbSeparator className="text-[#64748B]" />
              <BreadcrumbPage className="font-sans text-sm leading-5 tracking-normal text-[#64748B] font-normal!">
                <Translate text={localizationConstants.offerTabRequest} />
              </BreadcrumbPage>
            </BreadcrumbUIItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content Card Container */}
      <div className="px-6 pb-6 flex-1 flex flex-col">
        <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col p-6 gap-5">
          {/* Card Header Section: Search, Filter & Total Sum */}
          <div className="flex flex-col gap-4">
            {/* Search and Filter Row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Standard Reusable Search Input */}
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
                    {t(localizationConstants.filter)}
                    {activeFilterCount > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                        {activeFilterCount}
                      </span>
                    )}
                    <ChevronDown size={14} className="text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 text-xs">
                  {uniqueCategories.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {t(localizationConstants.offerQuotedCategory)}
                      </DropdownMenuLabel>
                      {uniqueCategories.map((cat) => (
                        <DropdownMenuCheckboxItem
                          key={cat}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={(checked) => {
                            setSelectedCategories((prev) =>
                              checked
                                ? [...prev, cat]
                                : prev.filter((x) => x !== cat),
                            );
                            setPage(1);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          {cat}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {uniqueTypes.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {t(localizationConstants.offerQuotedType)}
                      </DropdownMenuLabel>
                      {uniqueTypes.map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            setSelectedTypes((prev) =>
                              checked
                                ? [...prev, type]
                                : prev.filter((x) => x !== type),
                            );
                            setPage(1);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          {type}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {uniqueMunicipalities.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {t(localizationConstants.offerQuotedMunicipality)}
                      </DropdownMenuLabel>
                      {uniqueMunicipalities.map((muni) => (
                        <DropdownMenuCheckboxItem
                          key={muni}
                          checked={selectedMunicipalities.includes(muni)}
                          onCheckedChange={(checked) => {
                            setSelectedMunicipalities((prev) =>
                              checked
                                ? [...prev, muni]
                                : prev.filter((x) => x !== muni),
                            );
                            setPage(1);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          {muni}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {activeFilterCount > 0 && (
                    <DropdownMenuItem
                      className="cursor-pointer text-xs font-medium text-red-600 focus:text-red-600"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedTypes([]);
                        setSelectedMunicipalities([]);
                        setSelectedStatuses([]);
                        setPage(1);
                      }}
                    >
                      {t(localizationConstants.clearFilters)}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Total Sum Headline */}
            <p className="text-base font-semibold text-slate-900 tracking-tight">
              {t(localizationConstants.offerQuotedTotalLabel)} {totalSum.toLocaleString("sv-SE")}
            </p>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-270">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                      onClick={() => toggleSort(col.key)}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {renderSortIcon(col.key, sortField, sortDir)}
                      </span>
                    </th>
                  ))}
                  {/* Normal weight, right-aligned + button header */}
                  <th className="sticky right-0 z-10 bg-white px-4 py-3.5 text-right w-40 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-slate-100">
                    <div className="flex items-center justify-end pr-2">
                      <span
                        className="text-xl font-normal text-slate-700 hover:text-slate-800 cursor-pointer select-none leading-none"
                        title={t(localizationConstants.add)}
                      >
                        +
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Offert Nr */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 font-normal">
                      {row.offertNr}
                    </td>

                    {/* Jobb (Bold) */}
                    <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-900">
                      {row.job}
                    </td>

                    {/* Kundnamn */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 font-normal">
                      {row.customerName}
                    </td>

                    {/* Kategori (Badge) */}
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-white text-slate-700 border border-slate-200 shadow-xs">
                        {row.category}
                      </span>
                    </td>

                    {/* Kommun */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 font-normal">
                      {row.municipality}
                    </td>

                    {/* Typ */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 font-normal">
                      {row.type}
                    </td>

                    {/* Offert pris */}
                    <td className="whitespace-nowrap px-4 py-3.5 font-normal text-slate-900 tabular-nums">
                      {row.price.toLocaleString("de-DE")}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <OfferQuotedStatusBadge
                        status={row.status}
                        openedAt={row.openedAt}
                      />
                    </td>

                    {/* Kontakt person */}
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{row.contactPerson?.name || "—"}</span>
                      </div>
                    </td>

                    {/* Actions (Sticky Right) */}
                    <td className="sticky right-0 z-10 bg-white px-4 py-3.5 group-hover:bg-slate-50 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-slate-100">
                      <div className="flex items-center justify-end gap-2.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs font-medium bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-md cursor-pointer shadow-xs"
                          onClick={() =>
                            router.push(
                              `/module/business/offer/request/${row.id}`,
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
                              className="h-8 w-8 cursor-pointer p-0 text-slate-500 hover:text-slate-900"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 text-xs"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/module/business/offer/request/${row.id}`,
                                )
                              }
                            >
                              {t(localizationConstants.viewProject)}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setCommentModal({
                                  open: true,
                                  offertNr: row.offertNr,
                                  job: row.job,
                                });
                              }}
                            >
                              {t(
                                localizationConstants.offerQuotedActionComment,
                              )}
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
                      className="px-4 py-12 text-center text-xs text-slate-400"
                    >
                      {t(localizationConstants.noQuotesFound)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Section Inside the Card (Centered in Middle) */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 w-full select-none">
            {/* Rows per page selector */}
            <div className="flex items-center gap-2">
              <span>{t(localizationConstants.rowsPerPageLabel)}</span>
              <div className="flex h-8 w-16 items-center justify-between rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 shadow-xs">
                <span>{rowsPerPage}</span>
                <ChevronsUpDown size={12} className="text-slate-400 shrink-0" />
              </div>
            </div>

            {/* Page counter & Navigation buttons */}
            <div className="flex items-center gap-3">
              <span>
                {t(localizationConstants.pageOfLabel)
                  .replace("{page}", String(page))
                  .replace("{total}", String(totalPages))}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex items-center justify-center text-xs text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer rounded"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  title={t(localizationConstants.paginationFirstPage)}
                >
                  «
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex items-center justify-center text-xs text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer rounded"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  title={t(localizationConstants.paginationPreviousPage)}
                >
                  ‹
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex items-center justify-center text-xs text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer rounded"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page === totalPages}
                  title={t(localizationConstants.paginationNextPage)}
                >
                  ›
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex items-center justify-center text-xs text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer rounded"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  title={t(localizationConstants.paginationLastPage)}
                >
                  »
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <OfferQuotedCommentModal
        open={commentModal.open}
        offertNr={commentModal.offertNr}
        job={commentModal.job}
        onClose={() => setCommentModal((prev) => ({ ...prev, open: false }))}
      />

      {/* Answer Modal */}
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

export default OfferRequestView;
