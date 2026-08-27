"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getB2BArchiveProjectsAction,
  restoreB2BProjectAction,
  deleteB2BArchivedProjectAction,
} from "@/api-actions/b2b";
import { B2BArchiveItem, B2BArchiveTyp } from "../types/archive";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export type B2BArchiveSortField =
  | "refNr"
  | "projekt"
  | "datum"
  | "typ"
  | "forfragningar"
  | "kommun"
  | "lagstOffert";

export function useB2BArchive() {
  const t = useTranslate();
  const [items, setItems] = useState<B2BArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedTyps, setSelectedTyps] = useState<B2BArchiveTyp[]>([]);
  const { sortField, sortDir, toggleSort } =
    useTableSort<B2BArchiveSortField>();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getB2BArchiveProjectsAction({
        search: search || undefined,
        type: selectedTyps.length === 1 ? selectedTyps[0] : undefined,
      });
      setItems(res.items);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedTyps]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((item) => {
      const matchesSearch =
        !q ||
        item.refNr.toLowerCase().includes(q) ||
        item.projekt.toLowerCase().includes(q) ||
        item.kommun.toLowerCase().includes(q);
      const matchesTyp =
        selectedTyps.length === 0 || selectedTyps.includes(item.typ);
      return matchesSearch && matchesTyp;
    });
  }, [search, selectedTyps, items]);

  const sorted = useMemo(
    () =>
      sortItems(
        filtered,
        sortField,
        sortDir,
        (item, field) => item[field as keyof B2BArchiveItem] as string | number
      ),
    [filtered, sortField, sortDir]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleRestore = async (id: string) => {
    const res = await restoreB2BProjectAction(id);
    if (res.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast("success", t(localizationConstants.offerArchivedRestoredToast));
    } else {
      showToast("error", t(localizationConstants.b2bArchiveErrorToast));
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteB2BArchivedProjectAction(id);
    if (res.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast("success", t(localizationConstants.offerArchivedDeletedToast));
    } else {
      showToast("error", t(localizationConstants.b2bRemoveErrorToast));
    }
  };

  return {
    items: paginated,
    allItems: sorted,
    isLoading,
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
    refetch: loadData,
  };
}
