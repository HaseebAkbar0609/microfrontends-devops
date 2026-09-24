"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { B2BArchiveItem, B2BArchiveTyp } from "../types/archive";
import { B2B_ARCHIVE_BREADCRUMBS } from "../constants";
import { useB2BArchive, B2BArchiveSortField } from "../hooks/useB2BArchive";

const ALL_TYPS: B2BArchiveTyp[] = ["B2B-Hyra UT", "B2B-Offert", "B2B-Hyra IN"];
const TABLE_COLUMNS_COUNT = 8;

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={`skeleton-${i}`} className="border-b border-slate-200">
          {Array.from({ length: TABLE_COLUMNS_COUNT }).map((_, j) => (
            <TableCell key={j} className="px-4 py-3.5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function B2BArchiveView() {
  const t = useTranslate();
  const router = useRouter();

  const {
    items,
    isLoading,
    error,
    search,
    setSearch,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    selectedTyps,
    setSelectedTyps,
    sortField,
    sortDir,
    toggleSort,
    handleRestore,
    handleDelete,
    refetch,
  } = useB2BArchive();

  const [projectToRestore, setProjectToRestore] = useState<B2BArchiveItem | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<B2BArchiveItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeFilterCount = selectedTyps.length;

  const renderSortIndicator = (field: B2BArchiveSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="text-slate-400 shrink-0 ml-1" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-slate-900 shrink-0 ml-1" />
    ) : (
      <ArrowDown size={12} className="text-slate-900 shrink-0 ml-1" />
    );
  };

  const handleConfirmRestore = async () => {
    if (!projectToRestore) return;
    setIsRestoring(true);
    try {
      await handleRestore(projectToRestore.id);
    } finally {
      setIsRestoring(false);
      setProjectToRestore(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await handleDelete(projectToDelete.id);
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-white min-h-screen font-sans">
      {/* 1. Page Header (Standard Reusable PageHeader Component) */}
      <PageHeader
        title={localizationConstants.archive}
        breadcrumbs={B2B_ARCHIVE_BREADCRUMBS}
        className="border-b-0 px-6 pt-5 pb-2"
      />

      {/* 3. Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-4">
        {/* Left: Search Input + Filter Dropdown */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative w-56 sm:w-64">
            <Search
              size={16}
              className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 cursor-pointer gap-1.5 text-sm font-medium border-slate-300 rounded-md bg-white hover:bg-slate-50 text-slate-700"
              >
                <span>{t(localizationConstants.filter)}</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown size={14} className="text-slate-500" aria-hidden={true} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 bg-white border border-slate-200 shadow-md">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
                <Translate text={localizationConstants.b2bDealDetailType} />
              </DropdownMenuLabel>
              {ALL_TYPS.map((typ) => (
                <DropdownMenuCheckboxItem
                  key={typ}
                  checked={selectedTyps.includes(typ)}
                  onCheckedChange={(checked) => {
                    setSelectedTyps((prev) =>
                      checked ? [...prev, typ] : prev.filter((t) => t !== typ)
                    );
                    setPage(1);
                  }}
                  className="cursor-pointer text-sm"
                >
                  {typ}
                </DropdownMenuCheckboxItem>
              ))}
              {activeFilterCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900"
                    onClick={() => {
                      setSelectedTyps([]);
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

        {/* Right: + Add new project */}
        <div>
          <Button
            size="sm"
            className="h-9 cursor-pointer gap-1.5 px-4 bg-slate-950 hover:bg-slate-800 text-sm font-semibold text-white rounded-md shadow-none transition-colors"
            onClick={() => router.push("/module/business/b2b/create")}
          >
            <Plus size={16} aria-hidden={true} />
            <span>
              <Translate text={localizationConstants.b2bArchiveAddProject} />
            </span>
          </Button>
        </div>
      </div>

      {/* 4. Reusable Shadcn Table Primitive */}
      <div className="flex-1 px-6 pb-4">
        <Table className="min-w-[900px] border-collapse">
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-white hover:bg-white">
              <TableHead
                onClick={() => toggleSort("refNr")}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-0.5">
                  <Translate text={localizationConstants.b2bPMRefNr} />
                  {renderSortIndicator("refNr")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("projekt")}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-0.5">
                  <Translate text={localizationConstants.b2bPMProject} />
                  {renderSortIndicator("projekt")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("datum")}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-0.5">
                  <Translate text={localizationConstants.b2bDealDetailDatum} />
                  {renderSortIndicator("datum")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("typ")}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-0.5">
                  <Translate text={localizationConstants.b2bPMType} />
                  {renderSortIndicator("typ")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("forfragningar")}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-0.5">
                  <Translate text={localizationConstants.b2bArchiveInquiry} />
                  {renderSortIndicator("forfragningar")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("kommun")}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-0.5">
                  <Translate text={localizationConstants.b2bPMMunicipality} />
                  {renderSortIndicator("kommun")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("lagstOffert")}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-0.5">
                  <Translate text={localizationConstants.b2bArchiveLowestQuote} />
                  {renderSortIndicator("lagstOffert")}
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold text-slate-500 text-right w-52" />
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
            {isLoading ? (
              <SkeletonRows count={rowsPerPage || 5} />
            ) : error && items.length === 0 ? (
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableCell
                  colSpan={TABLE_COLUMNS_COUNT}
                  className="px-4 py-16 text-center text-sm text-red-500"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span>{error}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="cursor-pointer"
                    >
                      <Translate text={localizationConstants.retry} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-slate-200 hover:bg-slate-50/80 transition-colors group"
                >
                  <TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900">
                    {row.refNr}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-slate-950">
                    {row.projekt}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900">
                    {row.datum}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3.5">
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-900 hover:bg-slate-100 border-0 shadow-none"
                    >
                      {row.typ}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900 tabular-nums">
                    {row.forfragningar}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-900">
                    {row.kommun}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3.5 text-sm font-normal text-slate-900 tabular-nums">
                    {row.lagstOffert > 0
                      ? row.lagstOffert.toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* First Button: View quote — only when this company actually sent one */}
                      {row.hasOffer && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/module/business/b2b/archive/${row.id}/offer`
                            )
                          }
                        >
                          <Translate text={localizationConstants.b2bArchiveViewOffer} />
                        </Button>
                      )}

                      {/* Second Button: View inquiry (border added, bg removed) */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-medium text-slate-700 bg-transparent hover:bg-slate-50 border border-slate-200 rounded-md transition-colors cursor-pointer shadow-none"
                        onClick={() =>
                          router.push(
                            `/module/business/b2b/archive/${row.id}/request`
                          )
                        }
                      >
                        <Translate text={localizationConstants.b2bArchiveViewRequest} />
                      </Button>

                      {/* 3-dots action menu for Restore & Delete */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="More actions"
                            className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                          >
                            <MoreVertical size={16} aria-hidden={true} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 bg-white border border-slate-200 shadow-md p-1">
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-900 hover:bg-slate-100"
                            onClick={() => setProjectToRestore(row)}
                          >
                            <RotateCcw size={14} className="text-slate-900" />
                            <span>
                              <Translate text={localizationConstants.actionRestore} />
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-900 hover:bg-slate-100"
                            onClick={() => setProjectToDelete(row)}
                          >
                            <Trash2 size={14} className="text-slate-900" />
                            <span>
                              <Translate text={localizationConstants.b2bDealDelete} />
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableCell
                  colSpan={TABLE_COLUMNS_COUNT}
                  className="px-4 py-16 text-center text-sm text-slate-500"
                >
                  <Translate text={localizationConstants.noQuotesFound} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* 5. Real Project Standard TablePagination (Responsive & Spaced from Table) */}
        <div className="w-full overflow-x-auto mt-4">
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={rowsPerPage}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setRowsPerPage(size);
              setPage(1);
            }}
            className="flex-wrap justify-between sm:justify-end gap-3 sm:gap-4 px-0 pt-2 pb-8 min-w-0"
          />
        </div>
      </div>

      {/* Confirmation Modal for Project Restore */}
      <AlertDialog
        open={!!projectToRestore}
        onOpenChange={(open) => !open && setProjectToRestore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(localizationConstants.b2bRestoreConfirmTitle)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(localizationConstants.b2bRestoreConfirmDesc)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring} className="cursor-pointer">
              {t(localizationConstants.cancel)}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              disabled={isRestoring}
              className="bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
            >
              {t(localizationConstants.actionRestore)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Modal for Project Permanent Deletion */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(localizationConstants.b2bDeletePermanentConfirmTitle)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(localizationConstants.b2bDeletePermanentConfirmDesc)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
              {t(localizationConstants.cancel)}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-slate-950 hover:bg-slate-800 text-white cursor-pointer"
            >
              {t(localizationConstants.b2bDealDelete)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default B2BArchiveView;
