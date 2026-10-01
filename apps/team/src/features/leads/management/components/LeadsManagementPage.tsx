"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EllipsisVertical,
  Plus,
  RotateCw,
  ArrowRight,
  Trash2,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { updateLeadStatusAPIAction } from "@/api-actions";
import { mapLeadStatusToApiStatus } from "@/api-actions/leads/shared";
import { filterOptions, leadTabs } from "@/features/leads/management/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type {
  AcceptedLeadRow,
  ArchiveLeadRow,
  HandlingLeadRow,
  LeadRow,
  LeadStatus,
  MonitoringLeadRow,
  PaidLeadRow,
} from "@/features/leads/types";
import { useDebounce } from "@/components/hooks/useDebounce";
import { useQueryParams } from "@/components/hooks/useQueryParams";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { showToast } from "@/lib/toast";
import { useLeadsList } from "@/features/leads/queries/useLeadsList";
import { useDeleteLead } from "@/features/leads/queries/useDeleteLead";

import {
  filterLeadRows,
  getLeadRowsForTab,
  getLeadRowCells,
  getLeadTableConfig,
  LEAD_PAGE_SIZE_OPTIONS,
} from "@/features/leads/management/helpers";
import type { LeadTableCell } from "@/features/leads/management/types";
import { ActionsToolbar, type FilterConfig } from "@/components/table/ActionsToolbar";
import { LeadSettingsTab } from "@/features/leads/settings/components/LeadSettingsTab";

export function LeadsManagementPage() {
  const t = useTranslate();
  const router = useRouter();
  const { search: searchParam, page, changeQueries, setPage } = useQueryParams();
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [monitoringRows, setMonitoringRows] = useState<MonitoringLeadRow[]>([]);
  const [handlingRows, setHandlingRows] = useState<HandlingLeadRow[]>([]);
  const [acceptedRows, setAcceptedRows] = useState<AcceptedLeadRow[]>([]);
  const [paidRows, setPaidRows] = useState<PaidLeadRow[]>([]);
  const [archiveRows, setArchiveRows] = useState<ArchiveLeadRow[]>([]);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [activeTab, setActiveTab] = useState<LeadStatus | "settings">("granskning");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [sort, setSort] = useState<{ column: number; direction: "asc" | "desc" } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isReviewTab = activeTab === "granskning";
  const { mutate: deleteLeadMutation } = useDeleteLead();
  const debouncedSearch = useDebounce(searchInput, 400);
  const leadsListQuery = useLeadsList({
    page: 1,
    pageSize: 10000,
  });


  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const prevSearchRef = useRef(debouncedSearch);

  useEffect(() => {
    if (prevSearchRef.current !== debouncedSearch) {
      prevSearchRef.current = debouncedSearch;
      changeQueries({ search: debouncedSearch || null, page: "1" });
      setPageIndex(0);
    }
  }, [debouncedSearch, changeQueries]);

  useEffect(() => {
    setPageIndex(Math.max(page - 1, 0));
  }, [page]);

  useEffect(() => {
    if (!leadsListQuery.data) return;
    const items = leadsListQuery.data.items;
    const reviewItems = items.filter((item) => item.status === "granskning");

    setRows(reviewItems);
    const monitoringItems = items
      .filter((item) => item.status === "bevakning")
      .map((item) => ({
        ...item,
        tags: "0",
      }));
    setMonitoringRows(monitoringItems);

    const handlingItems = items
      .filter((item) => item.status === "hantering")
      .map((item) => ({
        ...item,
        taken: "0",
        repeat: "1",
      }));
    setHandlingRows(handlingItems);

    const archiveItems = items
      .filter((item) => item.status === "arkiv")
      .map((item) => ({
        ...item,
        tags: "0",
      }));
    setArchiveRows(archiveItems);

    const acceptedItems = items
      .filter((item) => item.status === "accepterad")
      .map((item) => ({
        id: item.id,
        acceptedDate: item.date,
        leadId: item.leadId,
        customer: item.customer,
        supplier: "-",
        type: item.type,
        category: item.category,
        city: item.city,
        offer: "-",
        commission: "-",
        reminder: "-",
        status: "unpaid" as const,
      }));
    setAcceptedRows(acceptedItems);

    const paidItems = items
      .filter((item) => item.status === "betalda")
      .map((item) => ({
        id: item.id,
        acceptedDate: item.date,
        leadId: item.leadId,
        customer: item.customer,
        supplier: "-",
        city: item.city,
        commission: "-",
        paymentDate: "-",
      }));
    setPaidRows(paidItems);

  }, [leadsListQuery.data]);

  useEffect(() => {
    setSearchInput("");
    setTypeFilter("all");
    setPageIndex(0);
    setSelectedIds(new Set());
  }, [activeTab]);

  const isMonitoring = activeTab === "bevakning";
  const isAccepted = activeTab === "accepterad";
  const leadTypeFilter = useMemo<FilterConfig>(
    () => ({
      label: localizationConstants.filterLabel,
      options: filterOptions.map((option) => ({
        value: option,
        label:
          option === "all"
            ? localizationConstants.allTypes
            : option,
      })),
      onFilterChange: (value) => {
        setTypeFilter(value || "all");
        setPageIndex(0);
      },
      value: typeFilter === "all" ? null : typeFilter,
    }),
    [typeFilter]
  );
  const tableConfig = useMemo(
    () => getLeadTableConfig(activeTab !== "settings" ? activeTab : "granskning", t),
    [activeTab, t]
  );
  const isSelectable = tableConfig.isSelectable;
  const totalAcceptedCommission = useMemo(() => {
    if (acceptedRows.length === 0) {
      return "0";
    }
    const sum = acceptedRows.reduce((total, row) => {
      const numericValue = Number(row.commission.replace(/[^\d.-]/g, ""));
      return Number.isFinite(numericValue) ? total + numericValue : total;
    }, 0);

    return sum === 0 ? "0" : sum.toLocaleString("en-US");
  }, [acceptedRows]);

  const baseRows = useMemo(() => {
    if (activeTab === "settings") return [];
    return getLeadRowsForTab(activeTab, {
      granskning: rows,
      bevakning: monitoringRows,
      hantering: handlingRows,
      accepterad: acceptedRows,
      betalda: paidRows,
      arkiv: archiveRows,
    });
  }, [activeTab, rows, monitoringRows, handlingRows, acceptedRows, paidRows, archiveRows]);

  const filteredRows = useMemo(() => {
    const filtered = filterLeadRows(baseRows, debouncedSearch, typeFilter);
    if (!sort || activeTab === "settings") return filtered;
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    const getSortValue = (row: (typeof filtered)[number]) => {
      if (activeTab === "granskning" && sort.column === 0) {
        return (row as LeadRow).reviewed ? "1" : "0";
      }
      const index = sort.column - (activeTab === "granskning" ? 1 : 0);
      const cell = getLeadRowCells(activeTab, row)[index];
      return cell && "value" in cell ? cell.value : cell?.valueKey ?? "";
    };
    return filtered.map((row, index) => ({ row, index })).sort((a, b) => {
      const comparison = collator.compare(getSortValue(a.row), getSortValue(b.row));
      return (sort.direction === "asc" ? comparison : -comparison) || a.index - b.index;
    }).map(({ row }) => row);
  }, [baseRows, debouncedSearch, typeFilter, sort, activeTab]);

  const deleteRowByTab = useMemo(
    () => ({
      granskning: (id: string) =>
        setRows((prev) => prev.filter((row) => row.id !== id)),
      bevakning: (id: string) =>
        setMonitoringRows((prev) => prev.filter((row) => row.id !== id)),
      hantering: (id: string) =>
        setHandlingRows((prev) => prev.filter((row) => row.id !== id)),
      accepterad: (id: string) =>
        setAcceptedRows((prev) => prev.filter((row) => row.id !== id)),
      betalda: (id: string) =>
        setPaidRows((prev) => prev.filter((row) => row.id !== id)),
      arkiv: (id: string) =>
        setArchiveRows((prev) => prev.filter((row) => row.id !== id)),
    }),
    []
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const clampedPageIndex = Math.min(Math.max(pageIndex, 0), totalPages - 1);

  const pagedRows = useMemo(() => {
    const start = clampedPageIndex * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, clampedPageIndex, pageSize]);

  function goToPage(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 0), totalPages - 1);
    setPageIndex(safePage);
    setPage(safePage + 1);
  }

  function handleDelete(id: string) {
    if (activeTab === "settings") return;
    deleteLeadMutation(id, {
      onSuccess: () => {
        deleteRowByTab[activeTab](id);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        showToast("success", t(localizationConstants.leadDeletedToast));
      },
      onError: () => {
        showToast("error", t(localizationConstants.serverError));
      }
    });
  }

  const selectedCount = isSelectable ? selectedIds.size : 0;

  const toggleRowSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleResend = () => {
    if (selectedIds.size === 0) {
      return;
    }
    // Placeholder: integrate with resend notification API when available.
    setSelectedIds(new Set());
  };

  const persistLeadStatusChange = async (
    leadId: string,
    nextStatus: LeadStatus
  ) => {
    await updateLeadStatusAPIAction(leadId, {
      status: mapLeadStatusToApiStatus(nextStatus),
    });
  };

  const markLeadAsReviewed = async (leadId: string) => {
    try {
      await updateLeadStatusAPIAction(leadId, { status: "mark_as_reviewed" });
      await leadsListQuery.refetch();
      showToast("success", t(localizationConstants.markReviewedToast));
    } catch {
      showToast("error", t(localizationConstants.serverError));
    }
  };

  const moveMonitoringToHandling = async (
    lead: MonitoringLeadRow,
    announce = false
  ) => {
    await persistLeadStatusChange(lead.id, "hantering");
    setMonitoringRows((prev) => prev.filter((item) => item.id !== lead.id));
    setHandlingRows((prev) => [
      ...prev,
      { ...lead, status: "hantering", taken: "0", repeat: "1" },
    ]);
    if (announce) {
      showToast("success", t(localizationConstants.movedToHandlingToast));
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 px-8 pt-6 pb-8 ">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            <Translate text={tableConfig.titleKey} />
          </h1>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as LeadStatus | "settings");
          setPageIndex(0);
          setSelectedIds(new Set());
          setSearchInput("");
          setTypeFilter("all");
          setSort(null);
          if (searchParam || page !== 1) {
            changeQueries({ search: null, page: "1" });
          }
        }}
        className="w-full"
      >
        <TabsList variant="line" className="w-full justify-start gap-1 p-0 border-b border-slate-200">
          {leadTabs.map((tab) => (
            <TabsTrigger key={tab.value} className="w-fit flex-none px-4" value={tab.value}>
              <Translate text={tab.labelKey} />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="settings" className="-mx-8">
          <LeadSettingsTab />
        </TabsContent>

        {activeTab !== "settings" && <TabsContent value={activeTab} className="pt-6">
          {isAccepted && (
            <div className="mb-6 w-full max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-slate-500">
                <Translate text={localizationConstants.totalCommissionLabel} />
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {totalAcceptedCommission}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <div className="w-full">
              <ActionsToolbar
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                filters={[leadTypeFilter]}
                onCreateClick={tableConfig.showCreateButton ? () => { } : undefined}
                createButtonLabel={localizationConstants.createLabel}
                className="px-0 py-0"
              />
            </div>
            {tableConfig.showResendButton && (
              <Button
                type="button"
                className={`h-11 gap-2 rounded-xl px-5 text-base font-medium shadow-none ${selectedCount === 0
                  ? "bg-slate-200 text-slate-400"
                  : "cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
                  }`}
                disabled={selectedCount === 0}
                onClick={handleResend}
              >
                <RotateCw className="size-5" />
                <Translate text={localizationConstants.resendLabel} />
              </Button>
            )}
          </div>

          <div className="mt-6 pb-6">
            <Table
              key={`${activeTab}-${clampedPageIndex}`}
              containerClassName="rounded-xl border-[#E2E8F0]"
            >
              <TableHeader>
                <TableRow>
                  {isSelectable && (
                    <TableHead className="w-10">
                      {/* Empty head cell for selection column */}
                    </TableHead>
                  )}
                  {tableConfig.headers.map((header, index) => (
                    <TableHead key={header} className="text-sm font-medium capitalize tracking-wide text-slate-500" aria-sort={sort?.column === index ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
                      <button type="button" className="inline-flex items-center gap-1" aria-label={`Sort by ${header}`} onClick={() => { setSort((previous) => ({ column: index, direction: previous?.column === index && previous.direction === "asc" ? "desc" : "asc" })); goToPage(0); }}>
                        {header}
                        <ArrowUpDown className="size-4 text-slate-400" />
                      </button>
                    </TableHead>
                  ))}
                  <TableHead className="items-center text-center text-slate-500 flex justify-center"><Plus size={20} /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedRows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/70">
                    {isSelectable && (
                      <TableCell className="w-10">
                        <Checkbox
                          aria-label={`Select ${"leadId" in row ? row.leadId : "row"}`}
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={(checked) => toggleRowSelection(row.id, Boolean(checked))}
                          className="border border-black shadow-none data-[state=checked]:bg-black data-[state=checked]:border-black"
                        />
                      </TableCell>
                    )}

                    {activeTab === "granskning" && (
                      <TableCell className="text-center text-sm font-medium text-slate-700">
                        {(row as LeadRow).reviewed ? (
                          <Star className="mx-auto size-4 text-slate-700" />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    )}

                    {getLeadRowCells(activeTab, row).map((cell, index) => (
                      <LeadRowCell
                        key={`${row.id}-${index}`}
                        cell={cell}
                        onClick={
                          index === 2
                            ? () => {
                              const sourceParam = isMonitoring ? "?source=monitoring" : "";
                              router.push(`/leads/management/${row.id}${sourceParam}`);
                            }
                            : undefined
                        }
                      />
                    ))}

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-white cursor-pointer text-slate-700 hover:bg-slate-200">
                            <EllipsisVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-40">
                          <DropdownMenuItem
                            onClick={() => {
                              const sourceParam = isMonitoring ? "?source=monitoring" : "";
                              router.push(`/leads/management/${row.id}${sourceParam}`);
                            }}
                          >
                            <Eye className="size-4" />
                            <Translate text={localizationConstants.open} />
                          </DropdownMenuItem>
                          {isMonitoring && (
                            <DropdownMenuItem
                              onClick={async () => {
                                const movedItem = row as MonitoringLeadRow;
                                try {
                                  await moveMonitoringToHandling(movedItem, true);
                                  setActiveTab("hantering");
                                  setSelectedIds(new Set());
                                } catch {
                                  showToast("error", "Failed to update lead status.");
                                }
                              }}
                            >
                              <ArrowRight className="size-4" />
                              <Translate text={localizationConstants.moveToHandling} />
                            </DropdownMenuItem>
                          )}
                          <ConfirmDialog
                            title="Delete lead?"
                            description="This will remove the lead from the list."
                            confirmText={t(localizationConstants.delete)}
                            cancelText={t(localizationConstants.cancelLabel)}
                            onConfirm={() => handleDelete(row.id)}
                            trigger={
                              <DropdownMenuItem
                                className="gap-2"
                                onSelect={(event) => event.preventDefault()}
                              >
                                <Trash2 className="size-4" />
                                <Translate text={localizationConstants.delete} />
                              </DropdownMenuItem>
                            }
                          />
                          {activeTab === "granskning" && (
                            <DropdownMenuItem
                              onClick={() => {
                                markLeadAsReviewed(row.id);
                              }}
                            >
                              <Star className="size-4" />
                              <Translate text={localizationConstants.markReviewed} />
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={tableConfig.columnCount} className="py-10 text-center text-sm text-slate-500">
                      {leadsListQuery.isPending && isReviewTab
                        ? "Loading leads..."
                        : leadsListQuery.error instanceof Error && isReviewTab
                          ? leadsListQuery.error.message
                          : t(localizationConstants.noLeadsFound)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-900">
            <div className="flex items-center gap-3">
              <span><Translate text={localizationConstants.rowsPerPage} /></span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="h-10 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-slate-900">
              <Translate text={localizationConstants.pageLabel} /> {clampedPageIndex + 1}{" "}
              <Translate text={localizationConstants.ofLabel} /> {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => goToPage(0)}
                disabled={clampedPageIndex === 0}
              >
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => goToPage(clampedPageIndex - 1)}
                disabled={clampedPageIndex === 0}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => goToPage(clampedPageIndex + 1)}
                disabled={clampedPageIndex >= totalPages - 1}
              >
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => goToPage(totalPages - 1)}
                disabled={clampedPageIndex >= totalPages - 1}
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </TabsContent>}
      </Tabs>

    </div>
  );
}

function LeadRowCell({ cell, onClick }: { cell: LeadTableCell; onClick?: () => void }) {
  if (cell.kind === "status") {
    return (
      <TableCell>
        <span className="inline-flex items-center rounded-sm border border-warning bg-warning px-2.5 py-0.5 text-xs font-medium text-warning">
          <Translate text={cell.valueKey} />
        </span>
      </TableCell>
    );
  }

  if (cell.kind === "pill") {
    return (
      <TableCell>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {cell.value}
          {cell.suffixKey ? (
            <>
              {" "}
              <Translate text={cell.suffixKey} />
            </>
          ) : null}
        </span>
      </TableCell>
    );
  }

  return (
    <TableCell
      onClick={onClick}
      className={
        cell.kind === "strong"
          ? `text-sm font-semibold text-slate-900${onClick ? " cursor-pointer hover:underline" : ""}`
          : "text-sm text-slate-700"
      }
    >
      {cell.value}
    </TableCell>
  );
}
