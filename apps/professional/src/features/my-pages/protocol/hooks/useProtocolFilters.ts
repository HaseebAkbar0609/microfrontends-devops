"use client";

import { useMemo, useState } from "react";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import {
	Protocol,
	ProtocolStatus,
	ProtocolType,
} from "../constants/mockData";

export type ProtocolSortField =
	| "date"
	| "title"
	| "status"
	| "department"
	| "type";

export type ProtocolFilter = "all" | ProtocolStatus | ProtocolType;

export function useProtocolFilters(protocols: Protocol[]) {
	const [search, setSearchState] = useState("");
	const [filter, setFilterState] = useState<ProtocolFilter>("all");
	const { sortField, sortDir, toggleSort } =
		useTableSort<ProtocolSortField>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		let rows = protocols;
		if (term)
			rows = rows.filter((protocol) =>
				protocol.title.toLowerCase().includes(term),
			);
		if (filter !== "all")
			rows = rows.filter(
				(protocol) =>
					protocol.status === filter || protocol.type === filter,
			);
		return sortItems(rows, sortField, sortDir, (item, field) =>
			String(item[field as ProtocolSortField]),
		);
	}, [protocols, search, filter, sortField, sortDir]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const paged = useMemo(
		() => filtered.slice((page - 1) * pageSize, page * pageSize),
		[filtered, page, pageSize],
	);

	const setSearch = (value: string) => {
		setSearchState(value);
		setPage(1);
	};

	const setFilter = (value: ProtocolFilter) => {
		setFilterState(value);
		setPage(1);
	};

	const setPageSize = (size: number) => {
		setPageSizeState(size);
		setPage(1);
	};

	return {
		search,
		setSearch,
		filter,
		setFilter,
		sortField,
		sortDir,
		toggleSort,
		page,
		setPage,
		pageSize,
		setPageSize,
		paged,
		totalPages,
	};
}
