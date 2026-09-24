"use client";

import { useRouter } from "next/navigation";
import {
  Archive,
  Check,
  ChevronDown,
  FolderOpen,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DynamicBreadcrumb } from "@/components/common";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCalculationOverview } from "../hooks/useCalculationOverview";
import type { CalcOverviewItem, CalcOverviewStatus } from "../types/overview";

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900";

const STATUS_PILL_CLASS: Record<CalcOverviewStatus, string> = {
  in_progress: "bg-emerald-600 text-white hover:bg-emerald-600 border-none",
  not_started: "bg-amber-500 text-white hover:bg-amber-500 border-none",
  completed: "bg-slate-700 text-white hover:bg-slate-700 border-none",
};

function StatusBadge({ status }: { status: CalcOverviewStatus }) {
  const t = useTranslate();
  const labels: Record<CalcOverviewStatus, string> = {
    not_started: t(localizationConstants.calcOverviewStatusNotStarted),
    in_progress: t(localizationConstants.calcOverviewStatusInProgress),
    completed: t(localizationConstants.calcOverviewStatusCompleted),
  };
  return (
    <Badge
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium shadow-none ${STATUS_PILL_CLASS[status]}`}
    >
      {labels[status]}
    </Badge>
  );
}

interface Props {
  items?: CalcOverviewItem[];
}

export function CalculationOverviewView({ items }: Props) {
  const router = useRouter();
  const t = useTranslate();

  const {
    paginated,
    totalPages,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    activeFilterLabel,
    statusLabels,
    sortField,
    sortDir,
    toggleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    deleteTargetId,
    setDeleteTargetId,
    handleArchive,
    handleDeleteConfirm,
  } = useCalculationOverview({ initialItems: items });

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Page heading */}
      <div className="px-5 py-4">
        <h1 className="mb-0.5 text-2xl font-semibold tracking-tight text-slate-950">
          <Translate text={localizationConstants.calcOverviewPage} />
        </h1>
        <DynamicBreadcrumb
          variant="small"
          items={[
            { translationKey: localizationConstants.home, href: "/home" },
            {
              translationKey: localizationConstants.moduleItem,
              href: "/module/business",
            },
            {
              translationKey: localizationConstants.calculation,
              href: "/module/business/calculation/dashboard",
            },
            { translationKey: localizationConstants.calcOverviewPage },
          ]}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <Search
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder={localizationConstants.search}
            className="h-10 w-full"
            wrapperClassName="w-full sm:w-72"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-full shrink-0 cursor-pointer justify-between gap-2 rounded-md border-slate-200 bg-white text-sm font-normal text-slate-700 hover:bg-slate-50 shadow-none sm:w-auto sm:justify-start"
              >
                <span>{activeFilterLabel}</span>
                <ChevronDown size={14} className="text-slate-500" aria-hidden={true} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 bg-white shadow-md border-slate-200">
              <DropdownMenuItem
                className="cursor-pointer text-sm flex items-center justify-between"
                onClick={() => {
                  setFilterStatus(null);
                  setPage(1);
                }}
              >
                <Translate text={localizationConstants.adminUsersFilterAll} />
                {!filterStatus && <Check size={14} className="text-slate-900" />}
              </DropdownMenuItem>
              {(Object.keys(statusLabels) as CalcOverviewStatus[]).map((status) => (
                <DropdownMenuItem
                  key={status}
                  className="cursor-pointer text-sm flex items-center justify-between"
                  onClick={() => {
                    setFilterStatus(status);
                    setPage(1);
                  }}
                >
                  <span>{statusLabels[status]}</span>
                  {filterStatus === status && <Check size={14} className="text-slate-900" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex w-full shrink-0 justify-end sm:w-auto sm:ml-auto">
          <Button
            size="sm"
            className="h-10 w-full sm:w-auto cursor-pointer gap-2 rounded-md bg-neutral-950 px-4 text-sm font-medium text-white hover:bg-neutral-800"
            onClick={() => router.push("/module/business/calculation/new")}
          >
            <Plus size={16} aria-hidden={true} />
            <Translate text={localizationConstants.calcOverviewNewBtn} />
          </Button>
        </div>
      </div>

      {/* Table reusing shadcn components */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-2">
        <Table className="w-full min-w-200 table-auto border-collapse">
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-white hover:bg-white">
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("calcNo")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.calcNo)}
                  {renderSortIcon("calcNo", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("projectName")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.projectName)}
                  {renderSortIcon("projectName", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("connection")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.calcOverviewConnection)}
                  {renderSortIcon("connection", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("client")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.calcOverviewClient)}
                  {renderSortIcon("client", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("offertDatum")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.calcOverviewOffertDatum)}
                  {renderSortIcon("offertDatum", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("typ")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.calcOverviewTyp)}
                  {renderSortIcon("typ", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("offertSumma")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.calcOverviewOffertSumma)}
                  {renderSortIcon("offertSumma", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("kategori")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.calcOverviewKategori)}
                  {renderSortIcon("kategori", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead
                className={TH_SORTABLE}
                onClick={() => toggleSort("status")}
              >
                <span className="flex items-center gap-1">
                  {t(localizationConstants.statusHeader)}
                  {renderSortIcon("status", sortField, sortDir)}
                </span>
              </TableHead>
              <TableHead className="py-3.5 px-4 text-right whitespace-nowrap font-medium text-slate-600" />
              <TableHead className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20 text-center py-3.5 px-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  {t(localizationConstants.calcOverviewEmpty)}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow
                  key={item.id}
                  className="group cursor-pointer border-b border-slate-200 last:border-0 hover:bg-slate-50"
                  onClick={() =>
                    router.push(
                      `/module/business/calculation/overview/${item.id}`,
                    )
                  }
                >
                  <TableCell className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                    {item.calcNo}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    <span className="block max-w-48 truncate">
                      {item.projectName}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-900">
                      {item.connection}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-slate-900">
                    <span className="block max-w-36 truncate">
                      {item.client}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {item.offertDatum}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-900">
                      {item.typ}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-900 tabular-nums">
                      {typeof item.offertSumma === "number"
                        ? formatCurrency(item.offertSumma)
                        : item.offertSumma}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-900">
                      {item.kategori}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell
                    className="whitespace-nowrap px-3 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 cursor-pointer border-slate-200 bg-slate-100/80 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200 shadow-none"
                      onClick={() =>
                        router.push(
                          `/module/business/calculation/overview/${item.id}`,
                        )
                      }
                    >
                      <Translate
                        text={localizationConstants.calcOverviewSeKalkyl}
                      />
                    </Button>
                  </TableCell>
                  <TableCell
                    className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50 z-10 text-center py-3 px-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 mx-auto"
                          aria-label="More actions"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-900" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-36 bg-white shadow-md border-slate-200"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer text-xs font-medium gap-2 text-slate-900 focus:text-slate-900 focus:bg-slate-100"
                          onClick={() =>
                            router.push(
                              `/module/business/calculation/overview/${item.id}`,
                            )
                          }
                        >
                          <FolderOpen className="h-3.5 w-3.5 text-slate-900" />
                          <Translate
                            text={localizationConstants.calcOverviewActionOpen}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-xs font-medium gap-2 text-slate-900 focus:text-slate-900 focus:bg-slate-100"
                          onClick={() => handleArchive(item.id)}
                        >
                          <Archive className="h-3.5 w-3.5 text-slate-900" />
                          <Translate
                            text={
                              localizationConstants.calcOverviewActionArchive
                            }
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-xs font-medium gap-2 text-slate-900 focus:text-slate-900 focus:bg-slate-100"
                          onClick={() => setDeleteTargetId(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-slate-900" />
                          <Translate
                            text={
                              localizationConstants.calcOverviewActionDelete
                            }
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Standard Project Table Pagination */}
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Translate
                text={localizationConstants.calcOverviewDeleteConfirmTitle}
              />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <Translate
                text={
                  localizationConstants.calcOverviewDeleteConfirmDescription
                }
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              <Translate text={localizationConstants.cancel} />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer"
            >
              <Translate
                text={localizationConstants.calcOverviewActionDelete}
              />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
