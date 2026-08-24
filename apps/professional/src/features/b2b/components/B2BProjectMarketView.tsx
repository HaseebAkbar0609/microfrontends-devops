"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Plus,
  Archive as ArchiveIcon,
  Trash2,
} from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types/common";
import { getB2BProjectsAction, deleteB2BProjectAction } from "@/api-actions/b2b";
import { ProjectMarket, ProjectMarketStatus } from "../types/projectMarket";

export const B2B_OVERVIEW_BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.module, href: "/module/business" },
  { label: localizationConstants.businessCategory, href: "/module/business" },
  { label: localizationConstants.b2b, href: "/module/business/b2b" },
  { label: localizationConstants.b2bOverview },
];

type SortField = keyof Pick<
  ProjectMarket,
  "refNr" | "project" | "date" | "type" | "requests" | "municipality" | "lowestOffer" | "status"
>;

const SKELETON_COL_COUNT = 9;
const ALL_STATUSES: ProjectMarketStatus[] = ["contract_signed", "waiting", "open", "closing_soon"];

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
          {Array.from({ length: SKELETON_COL_COUNT }).map((_, j) => (
            <TableCell key={j} className="px-4 py-3.5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function StatusBadge({ status }: { status: ProjectMarketStatus }) {
  const t = useTranslate();
  if (status === "contract_signed") {
    return (
      <Badge className="rounded-md bg-[#059669] hover:bg-[#059669] px-2.5 py-1 text-xs font-medium text-white shadow-2xs border-0">
        {t(localizationConstants.b2bPMStatusContractSigned)}
      </Badge>
    );
  }
  return (
    <Badge className="rounded-md bg-[#F59E0B] hover:bg-[#F59E0B] px-2.5 py-1 text-xs font-medium text-white shadow-2xs border-0">
      {t(localizationConstants.b2bPMStatusWaiting)}
    </Badge>
  );
}

interface Props {
  projects?: ProjectMarket[];
  isLoading?: boolean;
}

export function B2BProjectMarketView({ projects = [], isLoading = false }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [projectList, setProjectList] = useState<ProjectMarket[]>(projects);
  const [loading, setLoading] = useState(isLoading || projects.length === 0);
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectMarketStatus[]>([]);
  const { sortField, sortDir, toggleSort } = useTableSort<SortField>();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearch = useDebounce(search, 300);
  const activeFilterCount = selectedStatuses.length;

  useEffect(() => {
    let isMounted = true;
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await getB2BProjectsAction({
          page,
          pageSize: rowsPerPage,
          search: debouncedSearch,
        });
        if (isMounted && res && res.projects) {
          setProjectList(res.projects);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, [page, rowsPerPage, debouncedSearch]);

  const handleRemoveProject = async (project: ProjectMarket) => {
    try {
      await deleteB2BProjectAction(project.id);
      setProjectList((prev) => prev.filter((p) => p.id !== project.id));
      showToast("success", t(localizationConstants.b2bRemoveSuccessToast));
    } catch {
      showToast("error", t(localizationConstants.b2bRemoveErrorToast));
    }
  };

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return projectList.filter((p) => {
      const matchesSearch =
        p.refNr.toLowerCase().includes(q) ||
        p.project.toLowerCase().includes(q) ||
        p.municipality.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(p.status);
      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, selectedStatuses, projectList]);

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
    open: t(localizationConstants.open),
    closing_soon: t(localizationConstants.closingSoon),
  };

  const formatNumberWithCommas = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  return (
    <div className="flex flex-1 flex-col bg-white min-h-screen">
      {/* Page Header with Breadcrumbs */}
      <PageHeader
        title={t(localizationConstants.b2bOverview)}
        breadcrumbs={B2B_OVERVIEW_BREADCRUMBS}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col px-4 sm:px-6 md:px-8 py-5">
        {/* Title Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            <Translate text={localizationConstants.b2b} />
          </h1>
        </div>

        {/* Navigation Tabs (Responsive) */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 border-b border-slate-200 text-sm font-medium -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 overflow-x-auto scrollbar-none mb-6 whitespace-nowrap">
          <Link
            href="/module/business/b2b"
            className="px-3 sm:px-4 md:px-6 pb-3.5 text-slate-500 hover:text-slate-900 transition-colors text-center shrink-0"
          >
            <Translate text={localizationConstants.b2bDashboard} />
          </Link>
          <Link
            href="/module/business/b2b/project-market"
            className={cn(
              "relative px-3 sm:px-4 md:px-6 pb-3.5 text-slate-900 font-semibold transition-colors text-center shrink-0",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-slate-900"
            )}
          >
            <Translate text={localizationConstants.b2bOverview} />
          </Link>
          <Link
            href="/module/business/b2b/archive"
            className="px-3 sm:px-4 md:px-6 pb-3.5 text-slate-500 hover:text-slate-900 transition-colors text-center shrink-0"
          >
            <Translate text={localizationConstants.archive} />
          </Link>
        </div>

        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Box */}
            <div className="relative w-56 sm:w-64">
              <Search
                size={16}
                className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden={true}
              />
              <Input
                placeholder={t(localizationConstants.search)}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-none border-0 border-b border-slate-300 pl-7 text-sm shadow-none focus-visible:ring-0 focus-visible:border-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 cursor-pointer gap-1.5 text-sm font-medium border-slate-300 rounded-md bg-white hover:bg-slate-50 text-slate-700"
                >
                  {t(localizationConstants.filter)}
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown size={14} className="text-slate-500" aria-hidden={true} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-white border border-slate-200 shadow-md">
                <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
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
          </div>

          {/* Add New Project Button */}
          <div>
            <Button
              size="sm"
              className="h-9 cursor-pointer gap-1.5 bg-[#111827] text-sm font-medium text-white hover:bg-neutral-800 rounded-md px-4 shadow-2xs"
              onClick={() => router.push("/module/business/b2b/project-market/create")}
            >
              <Plus size={16} aria-hidden={true} />
              {t(localizationConstants.b2bPMAddProject)}
            </Button>
          </div>
        </div>

        {/* Reused Standard Shadcn Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-white hover:bg-white">
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => toggleSort("refNr")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.b2bPMRefNr)}
                  {renderSortIcon("refNr", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => toggleSort("project")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.b2bPMProject)}
                  {renderSortIcon("project", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => toggleSort("date")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.b2bDealDetailDatum)}
                  {renderSortIcon("date", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => toggleSort("type")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.b2bPMType)}
                  {renderSortIcon("type", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => toggleSort("requests")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.b2bPMRequests)}
                  {renderSortIcon("requests", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => toggleSort("municipality")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.b2bPMMunicipality)}
                  {renderSortIcon("municipality", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => toggleSort("lowestOffer")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.b2bPMLowestOffer)}
                  {renderSortIcon("lowestOffer", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => toggleSort("status")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.statusLabel)}
                  {renderSortIcon("status", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead className="px-4 py-3.5 text-right font-medium text-slate-500" />
              {/* 3-dots column with vertical divider to the right of See project */}
              <TableHead className="w-12 px-3 py-3.5 text-center font-medium text-slate-500 border-l border-slate-200" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <SkeletonRows count={rowsPerPage} />
            ) : (
              <>
                {paginated.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/70 transition-colors border-b border-slate-100"
                  >
                    <TableCell className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-900 font-normal">
                      {row.refNr}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3.5 text-xs font-bold text-slate-900">
                      {row.project}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-600 font-normal">
                      {row.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3.5">
                      <Badge
                        variant="secondary"
                        className="rounded-md bg-[#F1F5F9] hover:bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200/50"
                      >
                        {row.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3.5 text-xs font-normal tabular-nums text-slate-700">
                      {row.requests}/10
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-700 font-normal">
                      {row.municipality}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3.5 text-xs tabular-nums text-slate-900 font-normal">
                      {formatNumberWithCommas(row.lowestOffer)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    {/* See project button column */}
                    <TableCell className="whitespace-nowrap px-4 py-3 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          router.push(`/module/business/b2b/project-market/${row.id}`)
                        }
                        className="h-10 bg-[#F1F5F9] hover:bg-slate-200/80 text-slate-800 text-xs font-semibold px-5 py-3 shadow-none cursor-pointer rounded-md border-0"
                      >
                        {t(localizationConstants.b2bPMViewProject)}
                      </Button>
                    </TableCell>
                    {/* 3-dots action column with left border (to the right of See project) */}
                    <TableCell className="w-12 whitespace-nowrap px-3 py-3.5 text-center border-l border-slate-200">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t(localizationConstants.actions)}
                            className="h-7 w-7 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                          >
                            <MoreVertical size={16} aria-hidden={true} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 bg-white border border-slate-200/80 rounded-lg shadow-lg p-1">
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md py-1.5 px-2"
                            onClick={() => router.push(`/module/business/b2b/archive`)}
                          >
                            <ArchiveIcon size={15} className="text-slate-600" />
                            {t(localizationConstants.archive)}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md py-1.5 px-2"
                            onClick={() => handleRemoveProject(row)}
                          >
                            <Trash2 size={15} className="text-slate-600" />
                            {t(localizationConstants.remove)}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={SKELETON_COL_COUNT}
                      className="px-4 py-12 text-center text-sm text-slate-400"
                    >
                      {t(localizationConstants.b2bPMEmpty)}
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>

        {/* Project Standard Reusable Table Pagination (Responsive) */}
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={rowsPerPage}
          onPageChange={setPage}
          onPageSizeChange={setRowsPerPage}
          className="mt-6 flex-wrap justify-between sm:justify-end gap-3 sm:gap-6"
        />
      </div>
    </div>
  );
}
