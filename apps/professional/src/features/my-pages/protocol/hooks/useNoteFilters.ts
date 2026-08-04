"use client";

import { useMemo, useState } from "react";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { ProtocolNote } from "../constants/mockData";

export type NoteSortField = "date" | "name";

export function useNoteFilters(notes: ProtocolNote[]) {
	const [search, setSearchState] = useState("");
	const { sortField, sortDir, toggleSort } = useTableSort<NoteSortField>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		let rows = notes;
		if (term)
			rows = rows.filter((note) =>
				note.name.toLowerCase().includes(term),
			);
		return sortItems(rows, sortField, sortDir, (item, field) =>
			String(item[field as NoteSortField]),
		);
	}, [notes, search, sortField, sortDir]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const paged = useMemo(
		() => filtered.slice((page - 1) * pageSize, page * pageSize),
		[filtered, page, pageSize],
	);

	const setSearch = (value: string) => {
		setSearchState(value);
		setPage(1);
	};

	const setPageSize = (size: number) => {
		setPageSizeState(size);
		setPage(1);
	};

	return {
		search,
		setSearch,
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
