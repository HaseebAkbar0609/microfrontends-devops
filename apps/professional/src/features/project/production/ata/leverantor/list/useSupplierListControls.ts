"use client";

import { useCallback, useState } from "react";

import { useTableSort } from "@/hooks/useTableSort";
import type { SupplierAtaStatus } from "../../types";
import { SUPPLIER_ATA_PAGE_SIZE } from "../supplierAta.config";

/**
 * Search, the status filter, sorting and paging shared by the grouped table and
 * a supplier's table. Changing what is shown returns to page 1; the page shown
 * is clamped, so a narrower list never leaves the reader past its end.
 */
export function useSupplierListControls<K extends string>() {
	const [search, setSearchValue] = useState("");
	const [filter, setFilterValue] = useState<SupplierAtaStatus | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(SUPPLIER_ATA_PAGE_SIZE);
	const { sortField, sortDir, toggleSort } = useTableSort<K>();

	const setSearch = useCallback((value: string) => {
		setSearchValue(value);
		setPage(1);
	}, []);

	/* The toolbar hands back its option value; only statuses are offered. */
	const setFilter = useCallback((value: string | null) => {
		setFilterValue(value as SupplierAtaStatus | null);
		setPage(1);
	}, []);

	const onSort = useCallback(
		(field: K) => {
			toggleSort(field);
			setPage(1);
		},
		[toggleSort],
	);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	function paginate<T>(rows: T[]) {
		const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
		const currentPage = Math.min(page, totalPages);
		return { pageRows: rows.slice((currentPage - 1) * pageSize, currentPage * pageSize), totalPages, currentPage };
	}

	return { search, setSearch, filter, setFilter, sortField, sortDir, onSort, pageSize, setPage, setPageSize, paginate };
}

export type SupplierListControls<K extends string> = ReturnType<typeof useSupplierListControls<K>>;
