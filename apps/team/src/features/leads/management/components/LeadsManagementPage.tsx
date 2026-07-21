"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { fetchLeadSettings } from "@/features/leads/settings/api/leadSettings";
import { useLeadsList } from "@/features/leads/queries/useLeadsList";
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reviewedAtByLeadId, setReviewedAtByLeadId] = useState<Record<string, string>>({});
  const lastAutoMoveRef = useRef<{ review?: string; monitor?: string }>({});
  const autoMovedToMonitoringRef = useRef<Record<string, Set<string>>>({});
  const isAutoMoveRunningRef = useRef(false);
  const isManualMoveRunningRef = useRef(false);
  const debouncedSearch = useDebounce(searchInput, 400);
  const hasClientFilters = debouncedSearch.trim().length > 0 || typeFilter !== "all";
  const isReviewTab = activeTab === "granskning";
  const leadsListQuery = useLeadsList(
    {
      page,
      pageSize,
    }
  );

  const { data: leadSettings } = useQuery({
    queryKey: ["lead-settings"],
    queryFn: fetchLeadSettings,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    changeQueries({ search: debouncedSearch || null, page: "1" });
    setPageIndex(0);
  }, [debouncedSearch, changeQueries]);

  useEffect(() => {
    setPageIndex(Math.max(page - 1, 0));
  }, [page]);

  useEffect(() => {
    if (!leadsListQuery.data) return;
    const items = leadsListQuery.data.items;
    const reviewItems = items.filter((item) => item.status === "granskning");
    const reviewLeadIdSet = new Set(reviewItems.map((item) => item.id));

    setRows(reviewItems);
    setMonitoringRows(
      items
        .filter((item) => item.status === "bevakning")
        .map((item) => ({
          ...item,
          tags: "0",
        }))
    );
    setHandlingRows(
      items
        .filter((item) => item.status === "hantering")
        .map((item) => ({
          ...item,
          taken: "0",
          repeat: "1",
        }))
    );
    setArchiveRows(
      items
        .filter((item) => item.status === "arkiv")
        .map((item) => ({
          ...item,
          tags: "0",
        }))
    );
    setAcceptedRows(
      items
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
        }))
    );
    setPaidRows(
      items
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
        }))
    );

    setReviewedAtByLeadId((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([leadId]) => reviewLeadIdSet.has(leadId))
      )
    );
  }, [leadsListQuery.data]);

  useEffect(() => {
    setSearchInput("");
    setTypeFilter("all");
    setPageIndex(0);
    setSelectedIds(new Set());
  }, [activeTab]);

  const isMonitoring = activeTab === "bevakning";
  const isAccepted = activeTab === "accepterad";
  const isReviewManualMode =
    (leadSettings?.review_mode ?? "").toLowerCase() === "manual";
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
    return filterLeadRows(baseRows, debouncedSearch, typeFilter);
  }, [baseRows, debouncedSearch, typeFilter]);

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

  const totalPages =
    isReviewTab && !hasClientFilters
      ? Math.max(1, leadsListQuery.data?.totalPages ?? 1)
      : Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const clampedPageIndex = isReviewTab && !hasClientFilters
    ? Math.min(Math.max(page - 1, 0), totalPages - 1)
    : Math.min(pageIndex, totalPages - 1);
  const pagedRows = useMemo(() => {
    if (isReviewTab && !hasClientFilters) {
      return filteredRows;
    }
    const start = clampedPageIndex * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, clampedPageIndex, isReviewTab, hasClientFilters, pageSize]);

  function goToPage(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 0), totalPages - 1);
    if (isReviewTab && !hasClientFilters) {
      setPage(safePage + 1);
      return;
    }
    setPageIndex(safePage);
    setPage(safePage + 1);
  }

  function handleDelete(id: string) {
    if (activeTab === "settings") return;
    deleteRowByTab[activeTab](id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast("success", t(localizationConstants.leadDeletedToast));
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

  const markLeadAsReviewed = (leadId: string) => {
    const reviewedAt = new Date().toISOString();
    setReviewedAtByLeadId((prev) => ({
      ...prev,
      [leadId]: reviewedAt,
    }));
    showToast("success", t(localizationConstants.markReviewedToast));
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

  const isAutomaticMode = (value?: string) =>
    value?.toLowerCase() === "automatic";

  const getScheduleTimeForToday = (schedule?: Record<string, unknown>) => {
    if (!schedule) return null;
    const root =
      "additionalProp1" in schedule &&
      typeof schedule.additionalProp1 === "object" &&
      schedule.additionalProp1
        ? (schedule.additionalProp1 as Record<string, unknown>)
        : (schedule as Record<string, unknown>);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayLabel = dayNames[new Date().getDay()];
    const value = root[todayLabel];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    return null;
  };

  const isTimePassed = (time: string) => {
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return false;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0,
      0
    );
    return now.getTime() >= target.getTime();
  };

  const getLocalDateKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const hasReachedNextDayEightAm = (reviewedAtIso: string) => {
    const reviewedAt = new Date(reviewedAtIso);
    if (Number.isNaN(reviewedAt.getTime())) return false;

    const target = new Date(
      reviewedAt.getFullYear(),
      reviewedAt.getMonth(),
      reviewedAt.getDate() + 1,
      8,
      0,
      0,
      0
    );

    return Date.now() >= target.getTime();
  };

  useEffect(() => {
    const runAutoMoves = () => {
      const syncAutomaticMoves = async () => {
        if (!leadSettings || isAutoMoveRunningRef.current) return;

        isAutoMoveRunningRef.current = true;

        try {
          const todayKey = getLocalDateKey();
          const movedToMonitoringToday =
            autoMovedToMonitoringRef.current[todayKey] ??
            (autoMovedToMonitoringRef.current[todayKey] = new Set<string>());

          if (isAutomaticMode(leadSettings.review_mode)) {
            const reviewTime = getScheduleTimeForToday(leadSettings.review_schedule);
            if (
              reviewTime &&
              isTimePassed(reviewTime) &&
              lastAutoMoveRef.current.review !== todayKey
            ) {
              lastAutoMoveRef.current.review = todayKey;
              const reviewLeads = [...rows];
              const results = await Promise.allSettled(
                reviewLeads.map((lead) => persistLeadStatusChange(lead.id, "bevakning"))
              );
              const succeededLeadIds = new Set(
                reviewLeads
                  .filter((_, index) => results[index]?.status === "fulfilled")
                  .map((lead) => lead.id)
              );

              if (succeededLeadIds.size > 0) {
                succeededLeadIds.forEach((leadId) => movedToMonitoringToday.add(leadId));
                setRows((prev) => prev.filter((lead) => !succeededLeadIds.has(lead.id)));
                setMonitoringRows((monitorPrev) => [
                  ...monitorPrev,
                  ...reviewLeads
                    .filter((lead) => succeededLeadIds.has(lead.id))
                    .map((lead) => ({
                      ...lead,
                      status: "bevakning" as const,
                      tags: "0",
                    })),
                ]);
              }
            }
          }

          if (isAutomaticMode(leadSettings.monitor_mode)) {
            const monitorTime = getScheduleTimeForToday(leadSettings.monitor_schedule);
            if (
              monitorTime &&
              isTimePassed(monitorTime) &&
              lastAutoMoveRef.current.monitor !== todayKey
            ) {
              lastAutoMoveRef.current.monitor = todayKey;
              const monitoringLeads = monitoringRows.filter(
                (lead) => !movedToMonitoringToday.has(lead.id)
              );
              const results = await Promise.allSettled(
                monitoringLeads.map((lead) => persistLeadStatusChange(lead.id, "hantering"))
              );
              const succeededLeadIds = new Set(
                monitoringLeads
                  .filter((_, index) => results[index]?.status === "fulfilled")
                  .map((lead) => lead.id)
              );

              if (succeededLeadIds.size > 0) {
                setMonitoringRows((prev) =>
                  prev.filter((lead) => !succeededLeadIds.has(lead.id))
                );
                setHandlingRows((handlingPrev) => [
                  ...handlingPrev,
                  ...monitoringLeads
                    .filter((lead) => succeededLeadIds.has(lead.id))
                    .map((lead) => ({
                      ...lead,
                      status: "hantering" as const,
                      taken: "0",
                      repeat: "1",
                    })),
                ]);
              }
            }
          }
        } finally {
          isAutoMoveRunningRef.current = false;
        }
      };

      void syncAutomaticMoves();
    };

    runAutoMoves();
    const interval = setInterval(runAutoMoves, 60 * 1000);

    return () => clearInterval(interval);
  }, [leadSettings, monitoringRows, rows]);

  useEffect(() => {
    const runManualMoves = () => {
      const syncManualMoves = async () => {
        if (!isReviewManualMode || isManualMoveRunningRef.current) return;

        const dueReviewLeads = rows.filter((lead) => {
          const reviewedAt = reviewedAtByLeadId[lead.id];
          return reviewedAt && hasReachedNextDayEightAm(reviewedAt);
        });

        if (dueReviewLeads.length === 0) return;

        isManualMoveRunningRef.current = true;
        try {
          const results = await Promise.allSettled(
            dueReviewLeads.map((lead) =>
              persistLeadStatusChange(lead.id, "bevakning")
            )
          );

          const succeededLeadIds = new Set(
            dueReviewLeads
              .filter((_, index) => results[index]?.status === "fulfilled")
              .map((lead) => lead.id)
          );

          if (succeededLeadIds.size > 0) {
            setRows((prev) =>
              prev.filter((lead) => !succeededLeadIds.has(lead.id))
            );
            setMonitoringRows((prev) => [
              ...prev,
              ...dueReviewLeads
                .filter((lead) => succeededLeadIds.has(lead.id))
                .map((lead) => ({
                  ...lead,
                  status: "bevakning" as const,
                  tags: "0",
                })),
            ]);
            setReviewedAtByLeadId((prev) =>
              Object.fromEntries(
                Object.entries(prev).filter(
                  ([leadId]) => !succeededLeadIds.has(leadId)
                )
              )
            );
          }
        } finally {
          isManualMoveRunningRef.current = false;
        }
      };

      void syncManualMoves();
    };

    runManualMoves();
    const interval = setInterval(runManualMoves, 60 * 1000);
    return () => clearInterval(interval);
  }, [isReviewManualMode, reviewedAtByLeadId, rows]);

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
                onCreateClick={tableConfig.showCreateButton ? () => {} : undefined}
                createButtonLabel={localizationConstants.createLabel}
                className="px-0 py-0"
              />
            </div>
            {tableConfig.showResendButton && (
              <Button
                type="button"
                className={`h-11 gap-2 rounded-xl px-5 text-base font-medium shadow-none ${
                  selectedCount === 0
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

          <div className="mt-6 overflow-hidden pb-6">
            <Table key={`${activeTab}-${clampedPageIndex}`}>
              <TableHeader>
                <TableRow className="">
                  {isSelectable && (
                    <TableHead className="w-10">
                      {/* Empty head cell for selection column */}
                    </TableHead>
                  )}
                  {tableConfig.headers.map((header) => (
                    <TableHead key={header} className="text-sm font-medium capitalize tracking-wide text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        {header}
                        <ArrowUpDown className="size-4 text-slate-400" />
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="border-l items-center text-center text-slate-500 flex justify-center"><Plus size={20} /></TableHead>
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
                        {reviewedAtByLeadId[row.id] ? (
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

                    <TableCell className="text-center border-l">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-white cursor-pointer text-slate-700 hover:bg-slate-200">
                            <EllipsisVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
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
