"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { DEFAULT_CASES_PAGE_SIZE } from "../constants/cases.constants";
import type { CaseCategory, CaseStatus } from "../types/cases.types";
import { matchesCase, sortCases, type CaseSortField } from "../utils/cases";
import { useCases } from "./useCases";

/**
 * Ärendelistan's rows and the register's view of them: search, the two
 * filters, sorting and paging.
 *
 * Anything that changes what is shown returns to page 1, and the page is
 * clamped, so deleting the last row of the last page never leaves the reader
 * past the end.
 */
export function useCasesList() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const { cases, isLoading, deleteCase, updateCaseStatus } = useCases();

	const [search, setSearchValue] = useState("");
	const [statusFilter, setStatusFilterValue] = useState<CaseStatus | "all">("all");
	const [categoryFilter, setCategoryFilterValue] = useState<CaseCategory | "all">("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(DEFAULT_CASES_PAGE_SIZE);
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
	const { sortField, sortDir, toggleSort } = useTableSort<CaseSortField>();

	const filters = useMemo(
		() => ({ status: statusFilter, category: categoryFilter }),
		[statusFilter, categoryFilter],
	);

	const shown = useMemo(
		() => sortCases(cases.filter((item) => matchesCase(item, filters, search)), sortField, sortDir, t, i18n.language),
		[cases, filters, search, sortField, sortDir, t, i18n.language],
	);

	const totalPages = Math.max(1, Math.ceil(shown.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const setSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPage(1);
	}, []);

	const setStatusFilter = useCallback((value: CaseStatus | "all") => {
		setStatusFilterValue(value);
		setPage(1);
	}, []);

	const setCategoryFilter = useCallback((value: CaseCategory | "all") => {
		setCategoryFilterValue(value);
		setPage(1);
	}, []);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	const onSort = useCallback(
		(field: CaseSortField) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const changeStatus = useCallback(
		(id: string, status: CaseStatus) => {
			updateCaseStatus(id, status);
			showToast("success", t(localizationConstants.casesToastStatusChanged));
		},
		[t, updateCaseStatus],
	);

	const confirmDelete = useCallback(() => {
		if (!deleteTargetId) return;
		deleteCase(deleteTargetId);
		setDeleteTargetId(null);
		showToast("success", t(localizationConstants.casesToastDeleted));
	}, [deleteCase, deleteTargetId, t]);

	return {
		pageRows: shown.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		totalItems: shown.length,
		isLoading,
		currentPage,
		pageSize,
		setPage,
		setPageSize,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		categoryFilter,
		setCategoryFilter,
		sortField,
		sortDir,
		onSort,
		deleteTargetId,
		setDeleteTargetId,
		confirmDelete,
		changeStatus,
	};
}

export type CasesListState = ReturnType<typeof useCasesList>;
