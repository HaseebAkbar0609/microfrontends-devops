"use client";

import { useMemo, useState } from "react";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { ProjectEconomyItem } from "../data/projectEconomy.mock";
import {
	getTotalTbContribution,
	listEconomyRows,
} from "../services/projectEconomyService";

export type ProjectEconomySortField = keyof Omit<ProjectEconomyItem, "id">;

export function useProjectEconomyFilters() {
	const [rows] = useState<ProjectEconomyItem[]>(() => listEconomyRows());
	const { sortField, sortDir, toggleSort } =
		useTableSort<ProjectEconomySortField>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const sorted = useMemo(
		() =>
			sortItems(
				rows,
				sortField,
				sortDir,
				(item, field) => item[field as ProjectEconomySortField],
			),
		[rows, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const paged = useMemo(
		() => sorted.slice((page - 1) * pageSize, page * pageSize),
		[sorted, page, pageSize],
	);

	const setPageSize = (size: number) => {
		setPageSizeState(size);
		setPage(1);
	};

	return {
		totalTbContribution: getTotalTbContribution(),
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
