"use client";

import { useMemo, useState } from "react";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { ProjectListItem } from "../data/projectsOverview.mock";

/**
 * Every field a column can show and sort on.
 *
 * `archived` is excluded deliberately: this type also types `visibleColumns`
 * and indexes the cell render, and a boolean has no column.
 */
export type ProjectSortField = keyof Omit<ProjectListItem, "id" | "archived">;

export function useProjectOverviewFilters(projects: ProjectListItem[]) {
	const [search, setSearchState] = useState("");
	const [filter, setFilterState] = useState<string | null>(null);
	const { sortField, sortDir, toggleSort } = useTableSort<ProjectSortField>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		let rows = projects;
		if (term)
			rows = rows.filter((project) =>
				[
					project.projectNr,
					project.name,
					project.projectManager,
					project.customer,
				].some((value) => value.toLowerCase().includes(term)),
			);
		if (filter)
			rows = rows.filter(
				(project) =>
					project.category === filter ||
					project.department === filter,
			);
		return sortItems(rows, sortField, sortDir, (item, field) =>
			String(item[field as ProjectSortField]),
		);
	}, [projects, search, filter, sortField, sortDir]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const paged = useMemo(
		() => filtered.slice((page - 1) * pageSize, page * pageSize),
		[filtered, page, pageSize],
	);

	const setSearch = (value: string) => {
		setSearchState(value);
		setPage(1);
	};

	const setFilter = (value: string | null) => {
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
