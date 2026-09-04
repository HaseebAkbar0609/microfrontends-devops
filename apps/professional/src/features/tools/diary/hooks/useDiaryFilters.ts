"use client";

import { useMemo, useState } from "react";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { DiaryEntry } from "../constants/mockData";

export type DiaryFilter = string | null;

const [REF_YEAR, REF_MONTH] = mockDate(0).split("-").map(Number);

export function useDiaryFilters(entries: DiaryEntry[]) {
	const [search, setSearchState] = useState("");
	const [filter, setFilterState] = useState<DiaryFilter>(null);
	const [month, setMonthState] = useState(REF_MONTH);
	const [year, setYearState] = useState(REF_YEAR);
	const { sortField, sortDir, toggleSort } = useTableSort<"date">();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		let rows = entries.filter((entry) =>
			entry.date.startsWith(monthPrefix),
		);
		if (term)
			rows = rows.filter((entry) =>
				entry.title.toLowerCase().includes(term),
			);
		if (filter !== null)
			rows = rows.filter((entry) => entry.projectName === filter);
		return sortItems(rows, sortField, sortDir, (item) => item.date);
	}, [entries, search, filter, monthPrefix, sortField, sortDir]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const paged = useMemo(
		() => filtered.slice((page - 1) * pageSize, page * pageSize),
		[filtered, page, pageSize],
	);

	const setSearch = (value: string) => {
		setSearchState(value);
		setPage(1);
	};

	const setFilter = (value: DiaryFilter) => {
		setFilterState(value);
		setPage(1);
	};

	const setMonth = (value: number) => {
		setMonthState(value);
		setPage(1);
	};

	const setYear = (value: number) => {
		setYearState(value);
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
		month,
		setMonth,
		year,
		setYear,
		sortField,
		sortDir,
		toggleSort,
		page,
		setPage,
		pageSize,
		setPageSize,
		filtered,
		paged,
		totalPages,
	};
}
