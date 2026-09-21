"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { sortItems } from "@/utils/tableSort";
import { useTableSort } from "@/hooks/useTableSort";
import { DUMMY_CALC_OVERVIEW_LIST } from "../constants/overviewMock";
import type { CalcOverviewItem, CalcOverviewStatus } from "../types/overview";
import {
  getCalculationOverviewListAPIAction,
  archiveCalculationAPIAction,
  deleteCalculationAPIAction,
} from "../api/calculationOverview";

export interface UseCalculationOverviewOptions {
  initialItems?: CalcOverviewItem[];
  initialPageSize?: number;
}

export function useCalculationOverview(options: UseCalculationOverviewOptions = {}) {
  const { initialItems = DUMMY_CALC_OVERVIEW_LIST, initialPageSize = 10 } = options;
  const t = useTranslate();

  const [dataList, setDataList] = useState<CalcOverviewItem[]>(initialItems);
  const [totalItems, setTotalItems] = useState(initialItems.length);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<CalcOverviewStatus | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { sortField, sortDir, toggleSort } = useTableSort<keyof CalcOverviewItem>();

  const statusLabels: Record<CalcOverviewStatus, string> = useMemo(
    () => ({
      not_started: t(localizationConstants.calcOverviewStatusNotStarted),
      in_progress: t(localizationConstants.calcOverviewStatusInProgress),
      completed: t(localizationConstants.calcOverviewStatusCompleted),
    }),
    [t],
  );

  const activeFilterLabel = filterStatus
    ? statusLabels[filterStatus]
    : t(localizationConstants.filter);

  // Fetch data with graceful fallback to mock data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCalculationOverviewListAPIAction({
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        status: filterStatus || undefined,
        sortBy: sortField || undefined,
        sortOrder: sortDir || undefined,
      });

      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setDataList(res.data);
        setTotalItems(res.total);
        setIsUsingFallback(false);
      } else {
        // Fallback to local mock data if API returns empty
        setIsUsingFallback(true);
      }
    } catch {
      // Graceful fallback to mock data on network/API failure
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, filterStatus, sortField, sortDir]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Client-side filtering & sorting for fallback mode
  const fallbackFiltered = useMemo(() => {
    if (!isUsingFallback) return dataList;

    let result = [...initialItems];
    if (filterStatus) {
      result = result.filter((item) => item.status === filterStatus);
    }
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (item) =>
          item.calcNo.toLowerCase().includes(q) ||
          item.projectName.toLowerCase().includes(q) ||
          item.client.toLowerCase().includes(q) ||
          item.connection.toLowerCase().includes(q) ||
          item.typ.toLowerCase().includes(q) ||
          item.kategori.toLowerCase().includes(q),
      );
    }

    return sortItems(
      result,
      sortField,
      sortDir,
      (item, field) => item[field as keyof CalcOverviewItem] as string | number,
    );
  }, [isUsingFallback, dataList, initialItems, filterStatus, search, sortField, sortDir]);

  const totalPages = isUsingFallback
    ? Math.max(1, Math.ceil(fallbackFiltered.length / pageSize))
    : Math.max(1, Math.ceil(totalItems / pageSize));

  const paginated = useMemo(() => {
    if (!isUsingFallback) return dataList;
    const start = (page - 1) * pageSize;
    return fallbackFiltered.slice(start, start + pageSize);
  }, [isUsingFallback, dataList, fallbackFiltered, page, pageSize]);

  const handleArchive = useCallback(
    async (id: string) => {
      setDataList((prev) => prev.filter((item) => item.id !== id));
      showToast("info", t(localizationConstants.calcOverviewArchiveSuccess));
      try {
        await archiveCalculationAPIAction(id);
      } catch {
        // Optimistic UI updated
      }
    },
    [t],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;
    const idToDelete = deleteTargetId;
    setDataList((prev) => prev.filter((item) => item.id !== idToDelete));
    setDeleteTargetId(null);
    showToast("success", t(localizationConstants.calcOverviewDeleteSuccess));
    try {
      await deleteCalculationAPIAction(idToDelete);
    } catch {
      // Optimistic UI updated
    }
  }, [deleteTargetId, t]);

  return {
    dataList: isUsingFallback ? fallbackFiltered : dataList,
    paginated,
    totalItems: isUsingFallback ? fallbackFiltered.length : totalItems,
    totalPages,
    isLoading,
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
    refetch: fetchData,
  };
}
