"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type {
	CalculationArchiveRow,
	CalculationArchiveSortField,
	ArchiveStatus,
} from "../types/archive";
import { DUMMY_CALCULATION_ARCHIVE_ROWS } from "../constants/archiveMock";
import {
	getCalculationArchiveListAPIAction,
	restoreCalculationArchiveAPIAction,
	deleteCalculationArchivePermanentAPIAction,
} from "../api/calculationArchiveApi";

export function useCalculationArchive() {
	const router = useRouter();
	const t = useTranslate();

	// Data & Loading State
	const [rows, setRows] = useState<CalculationArchiveRow[]>(DUMMY_CALCULATION_ARCHIVE_ROWS);
	const [isLoading, setIsLoading] = useState(false);

	// Search & Filter State
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<string | null>(null);

	// Pagination & Sort State
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { sortField, sortDir, toggleSort } = useTableSort<CalculationArchiveSortField>();

	// Modals State
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Status options map
	const statusLabels: Record<ArchiveStatus, string> = useMemo(
		() => ({
			inProgress: t(localizationConstants.calcOverviewStatusInProgress),
			notStarted: t(localizationConstants.calcOverviewStatusNotStarted),
			completed: t(localizationConstants.calcOverviewStatusCompleted),
		}),
		[t],
	);

	const activeFilterLabel = useMemo(() => {
		if (!filterStatus) return t(localizationConstants.filter);
		return statusLabels[filterStatus as ArchiveStatus] ?? t(localizationConstants.filter);
	}, [filterStatus, statusLabels, t]);

	// Fetch Data Action
	const fetchRows = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getCalculationArchiveListAPIAction({
				search,
				status: filterStatus ?? undefined,
				page,
				limit: pageSize,
				sortBy: sortField ?? undefined,
				sortOrder: sortDir ?? undefined,
			});
			if (res?.data && res.data.length > 0) {
				setRows(res.data);
			}
		} catch {
			// Fallback handled in API action
		} finally {
			setIsLoading(false);
		}
	}, [search, filterStatus, page, pageSize, sortField, sortDir]);

	useEffect(() => {
		void fetchRows();
	}, [fetchRows]);

	// Open / View Action
	const handleOpen = useCallback(
		(row: CalculationArchiveRow) => {
			router.push(`/module/business/calculation/overview/${row.id}`);
		},
		[router],
	);

	// Unarchive / Restore Action
	const handleRestore = useCallback(
		async (id: string) => {
			try {
				await restoreCalculationArchiveAPIAction(id);
				setRows((prev) => prev.filter((r) => r.id !== id));
				showToast("success", t(localizationConstants.calcArchiveRestoreSuccess));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[t],
	);

	// Permanent Delete Action
	const handleDeleteConfirm = useCallback(async () => {
		if (!deleteTargetId) return;
		setIsDeleting(true);
		try {
			await deleteCalculationArchivePermanentAPIAction(deleteTargetId);
			setRows((prev) => prev.filter((r) => r.id !== deleteTargetId));
			showToast("success", t(localizationConstants.calcArchiveDeleteSuccess));
			setDeleteTargetId(null);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsDeleting(false);
		}
	}, [deleteTargetId, t]);

	// Instant Search & Client Filtering
	const filteredRows = useMemo(() => {
		let result = rows;
		if (filterStatus) {
			result = result.filter((r) => r.status === filterStatus);
		}
		const q = search.trim().toLowerCase();
		if (!q) return result;
		return result.filter(
			(r) =>
				r.kalkylNr.toLowerCase().includes(q) ||
				r.projektNamn.toLowerCase().includes(q) ||
				r.koppling.toLowerCase().includes(q) ||
				r.bestellare.toLowerCase().includes(q) ||
				r.offertDatum.toLowerCase().includes(q) ||
				r.typ.toLowerCase().includes(q),
		);
	}, [rows, filterStatus, search]);

	// Sorting
	const sortedRows = useMemo(() => {
		return sortItems(
			filteredRows,
			sortField,
			sortDir,
			(item, field) => item[field as keyof CalculationArchiveRow] as string | number,
		);
	}, [filteredRows, sortField, sortDir]);

	// Pagination
	const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
	const paginatedRows = useMemo(() => {
		return sortedRows.slice((page - 1) * pageSize, page * pageSize);
	}, [sortedRows, page, pageSize]);

	return {
		rows: paginatedRows,
		totalRows: sortedRows.length,
		isLoading,
		search,
		setSearch,
		filterStatus,
		setFilterStatus,
		activeFilterLabel,
		statusLabels,
		page,
		setPage,
		pageSize,
		setPageSize,
		totalPages,
		sortField,
		sortDir,
		toggleSort,
		deleteTargetId,
		setDeleteTargetId,
		isDeleting,
		handleOpen,
		handleRestore,
		handleDeleteConfirm,
	};
}
