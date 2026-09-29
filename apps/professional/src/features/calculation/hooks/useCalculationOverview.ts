"use client";
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStatus } from "@/context/AuthContext";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { useTableSort } from "@/hooks/useTableSort";
import type { CalcOverviewItem, CalcOverviewStatus } from "../types/overview";
import { getCalculationOverviewListAPIAction, archiveCalculationAPIAction, deleteCalculationAPIAction } from "../api/calculationOverview";
import { CALCULATION_OVERVIEW_QUERY_KEY } from "../api/calculationDashboard";

export interface UseCalculationOverviewOptions { initialPageSize?: number }

export function useCalculationOverview({ initialPageSize = 10 }: UseCalculationOverviewOptions = {}) {
    const t = useTranslate();
    const { company, user } = useAuthStatus();
    const actorId = user && typeof user === "object" && "id" in user ? String(user.id) : "";
    const [search, setSearchValue] = useState("");
    const [filterStatus, setFilterValue] = useState<CalcOverviewStatus | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSizeValue] = useState(initialPageSize);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const { sortField, sortDir, toggleSort } = useTableSort<keyof CalcOverviewItem>();
    const statusLabels: Record<CalcOverviewStatus, string> = useMemo(() => ({
        not_started: t(localizationConstants.calcOverviewStatusNotStarted),
        in_progress: t(localizationConstants.calcOverviewStatusInProgress),
        completed: t(localizationConstants.calcOverviewStatusCompleted),
    }), [t]);
    const query = useQuery({
        queryKey: [CALCULATION_OVERVIEW_QUERY_KEY, company?.id, actorId, page, pageSize, search, filterStatus, sortField, sortDir],
        queryFn: ({ signal }) => getCalculationOverviewListAPIAction({
            page, limit: pageSize, search: search.trim() || undefined, status: filterStatus || undefined,
            sortBy: sortField || undefined, sortOrder: sortDir || undefined,
        }, company?.id, signal),
        enabled: Boolean(company?.id && actorId), retry: false,
    });
    const handleArchive = useCallback(async (id: string) => {
        if (await archiveCalculationAPIAction(id)) {
            showToast("success", t(localizationConstants.calcOverviewArchiveSuccess));
            await query.refetch();
        } else showToast("error", t(localizationConstants.calcNewGenericError));
    }, [query, t]);
    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTargetId) return;
        if (await deleteCalculationAPIAction(deleteTargetId)) {
            setDeleteTargetId(null);
            showToast("success", t(localizationConstants.calcOverviewDeleteSuccess));
            await query.refetch();
        } else showToast("error", t(localizationConstants.calcNewGenericError));
    }, [deleteTargetId, query, t]);
    return {
        dataList: query.data?.data ?? [], paginated: query.data?.data ?? [],
        totalItems: query.data?.total ?? 0, totalPages: Math.max(1, query.data?.totalPages ?? 1),
        isLoading: query.isPending, loadError: query.isError,
        search, setSearch: (value: string) => { setSearchValue(value); setPage(1); },
        filterStatus, setFilterStatus: (value: CalcOverviewStatus | null) => { setFilterValue(value); setPage(1); },
        activeFilterLabel: filterStatus ? statusLabels[filterStatus] : t(localizationConstants.filter),
        statusLabels, sortField, sortDir, toggleSort, page, setPage, pageSize,
        setPageSize: (value: number) => { setPageSizeValue(value); setPage(1); },
        deleteTargetId, setDeleteTargetId, handleArchive, handleDeleteConfirm, refetch: query.refetch,
    };
}
