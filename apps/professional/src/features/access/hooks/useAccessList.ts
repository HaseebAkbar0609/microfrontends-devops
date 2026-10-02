"use client";

import { useCallback, useMemo, useState } from "react";
import { ACCESS_DEFAULT_PAGE_SIZE } from "../constants/access.constants";
import { useAccessRows } from "../context/AccessRowsContext";
import type {
	AccessListParams,
	AccessSortField,
	AccessStatusId,
	AccessTypeId,
	SortOrder,
} from "../types/access.types";
import { selectAccessPoints } from "../utils/accessList";

const INITIAL_PARAMS: AccessListParams = {
	search: "",
	status: null,
	type: null,
	sortBy: null,
	sortOrder: "asc",
	page: 1,
	pageSize: ACCESS_DEFAULT_PAGE_SIZE,
};

/**
 * The overview's data and list state. Rows come from the shared in-memory
 * provider and archive/delete only change that copy, until a backend exists.
 * When it does, only this hook and the provider change: the table keeps
 * reading `page` and calling the same setters.
 */
export function useAccessList() {
	const { rows, archive, remove } = useAccessRows();
	const [params, setParams] = useState<AccessListParams>(INITIAL_PARAMS);

	const page = useMemo(() => selectAccessPoints(rows, params), [rows, params]);

	/** A new search or filter starts again from page 1. */
	const setFilterParam = useCallback(
		(change: Partial<Pick<AccessListParams, "search" | "status" | "type">>) =>
			setParams((current) => ({ ...current, ...change, page: 1 })),
		[],
	);

	const setSearch = useCallback((search: string) => setFilterParam({ search }), [setFilterParam]);
	const setStatus = useCallback(
		(status: AccessStatusId | null) => setFilterParam({ status }),
		[setFilterParam],
	);
	const setType = useCallback((type: AccessTypeId | null) => setFilterParam({ type }), [setFilterParam]);
	const clearFilters = useCallback(() => setFilterParam({ status: null, type: null }), [setFilterParam]);

	const setSort = useCallback(
		(field: AccessSortField, order: SortOrder | null) =>
			setParams((current) => ({ ...current, sortBy: order ? field : null, sortOrder: order ?? "asc", page: 1 })),
		[],
	);
	const setPage = useCallback((next: number) => setParams((current) => ({ ...current, page: next })), []);
	const setPageSize = useCallback(
		(pageSize: number) => setParams((current) => ({ ...current, pageSize, page: 1 })),
		[],
	);

	return {
		page,
		params,
		setSearch,
		setStatus,
		setType,
		clearFilters,
		setSort,
		setPage,
		setPageSize,
		archive,
		remove,
	};
}
